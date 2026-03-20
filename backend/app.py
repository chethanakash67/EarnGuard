"""
EarnGuard V2 – Flask API
All endpoints for assessment, forecast, history, reports, plans, and demos.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from plans import (
    PLANS, get_plan, get_all_plans, validate_income,
    get_max_income, get_subscription_price, get_next_plan,
)
from risk_engine import (
    simulate_weather, calculate_risk, calculate_payout,
    generate_insight, generate_forecast, generate_history,
    generate_report, generate_map_data,
)

app = Flask(__name__)
CORS(app)


# ---------------------------------------------------------------------------
# GET /api/plans – return all plan definitions
# ---------------------------------------------------------------------------
@app.route("/api/plans", methods=["GET"])
def api_plans():
    return jsonify(get_all_plans())


# ---------------------------------------------------------------------------
# GET /api/weather?city=X – weather for a city
# ---------------------------------------------------------------------------
@app.route("/api/weather", methods=["GET"])
def api_weather():
    city = request.args.get("city", "")
    weather = simulate_weather(city)
    risk_level, _ = calculate_risk(weather["rain_probability"])
    weather["risk_level"] = risk_level
    return jsonify(weather)


# ---------------------------------------------------------------------------
# POST /api/assess – main risk assessment
# ---------------------------------------------------------------------------
@app.route("/api/assess", methods=["POST"])
def api_assess():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

    name = data.get("name", "").strip()
    job_type = data.get("job_type", "").strip()
    city = data.get("city", "").strip()
    expected_income = data.get("expected_income")
    plan_id = data.get("plan", "starter").strip().lower()
    custom_income = data.get("custom_income")

    if not name or not job_type:
        return jsonify({"error": "Name and job type are required."}), 400

    try:
        expected_income = float(expected_income)
        if expected_income <= 0:
            raise ValueError
    except (TypeError, ValueError):
        return jsonify({"error": "Expected income must be a positive number."}), 400

    # Plan validation
    plan = get_plan(plan_id)
    if not plan:
        return jsonify({"error": f"Unknown plan: {plan_id}"}), 400

    is_valid, error_info = validate_income(plan_id, expected_income, custom_income)
    if not is_valid:
        return jsonify(error_info), 400

    coverage = plan["coverage"]
    coverage_pct = int(coverage * 100)

    # Weather + risk
    weather = simulate_weather(city)
    risk_level, loss_pct = calculate_risk(weather["rain_probability"], job_type)
    payout = calculate_payout(expected_income, loss_pct, coverage)
    insight = generate_insight(name, job_type, risk_level, weather, payout, plan["name"], coverage_pct)

    return jsonify({
        "name": name,
        "job_type": job_type,
        "city": city,
        "expected_income": expected_income,
        "plan": plan_id,
        "plan_name": plan["name"],
        "coverage_pct": coverage_pct,
        "weather": weather,
        "risk_level": risk_level,
        "actual_income": payout["actual_income"],
        "loss_percentage": payout["loss_percentage"],
        "loss_amount": payout["loss_amount"],
        "compensation": payout["compensation"],
        "insight": insight,
        "protected": payout["compensation"] > 0,
    })


# ---------------------------------------------------------------------------
# GET /api/forecast?city=X&job_type=Y&expected_income=Z&plan=P
# ---------------------------------------------------------------------------
@app.route("/api/forecast", methods=["GET"])
def api_forecast():
    city = request.args.get("city", "")
    job_type = request.args.get("job_type", "Delivery")
    expected_income = float(request.args.get("expected_income", 5000))
    plan_id = request.args.get("plan", "starter")

    plan = get_plan(plan_id)
    coverage = plan["coverage"] if plan else 0.50

    result = generate_forecast(city, job_type, expected_income, coverage)
    return jsonify(result)


# ---------------------------------------------------------------------------
# GET /api/history?job_type=Y&expected_income=Z&plan=P
# ---------------------------------------------------------------------------
@app.route("/api/history", methods=["GET"])
def api_history():
    job_type = request.args.get("job_type", "Delivery")
    expected_income = float(request.args.get("expected_income", 5000))
    plan_id = request.args.get("plan", "starter")

    plan = get_plan(plan_id)
    coverage = plan["coverage"] if plan else 0.50

    result = generate_history(expected_income, job_type, coverage)
    return jsonify(result)


# ---------------------------------------------------------------------------
# POST /api/report
# ---------------------------------------------------------------------------
@app.route("/api/report", methods=["POST"])
def api_report():
    data = request.get_json() or {}
    name = data.get("name", "Worker")
    job_type = data.get("job_type", "Delivery")
    expected_income = float(data.get("expected_income", 5000))
    plan_id = data.get("plan", "starter")

    plan = get_plan(plan_id)
    coverage = plan["coverage"] if plan else 0.50
    plan_name = plan["name"] if plan else "Starter"
    coverage_pct = int(coverage * 100)

    history = generate_history(expected_income, job_type, coverage)
    report = generate_report(name, job_type, plan_name, coverage_pct, history)
    return jsonify(report)


# ---------------------------------------------------------------------------
# GET /api/map?city=X – risk map data
# ---------------------------------------------------------------------------
@app.route("/api/map", methods=["GET"])
def api_map():
    city = request.args.get("city", "")
    return jsonify(generate_map_data(city))


# ---------------------------------------------------------------------------
# POST /api/demo-scenarios – fixed demo data
# ---------------------------------------------------------------------------
@app.route("/api/demo-scenarios", methods=["POST"])
def api_demo():
    data = request.get_json() or {}
    name = data.get("name", "Demo User")
    job_type = data.get("job_type", "Delivery")
    expected_income = float(data.get("expected_income", 5000))
    plan_id = data.get("plan", "pro")

    plan = get_plan(plan_id)
    coverage = plan["coverage"] if plan else 0.80
    coverage_pct = int(coverage * 100)
    plan_name = plan["name"] if plan else "Pro"

    scenarios = [
        {"condition": "Partly Cloudy", "rain_probability": 15, "temperature": 32, "label": "Sunny Day"},
        {"condition": "Light Rain", "rain_probability": 55, "temperature": 24, "label": "Rainy Day"},
        {"condition": "Thunderstorm", "rain_probability": 90, "temperature": 19, "label": "Storm"},
    ]

    results = []
    for sc in scenarios:
        weather = {"condition": sc["condition"], "rain_probability": sc["rain_probability"], "temperature": sc["temperature"]}
        risk_level, loss_pct = calculate_risk(weather["rain_probability"], job_type)
        payout = calculate_payout(expected_income, loss_pct, coverage)
        insight = generate_insight(name, job_type, risk_level, weather, payout, plan_name, coverage_pct)

        results.append({
            "label": sc["label"],
            "name": name,
            "job_type": job_type,
            "expected_income": expected_income,
            "plan": plan_id,
            "plan_name": plan_name,
            "coverage_pct": coverage_pct,
            "weather": weather,
            "risk_level": risk_level,
            "actual_income": min(payout["actual_income"], expected_income),
            "loss_percentage": payout["loss_percentage"],
            "loss_amount": payout["loss_amount"],
            "compensation": payout["compensation"],
            "insight": insight,
            "protected": payout["compensation"] > 0,
        })

    return jsonify({"scenarios": results})


# ---------------------------------------------------------------------------
if __name__ == "__main__":
    print("EarnGuard V2 API running on http://localhost:5001")
    app.run(debug=True, port=5001)
