"""
EarnGuard Backend – AI-Powered Income Protection API
Flask server that simulates weather-based risk assessment for gig workers.
"""

import random
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# ---------------------------------------------------------------------------
# Weather simulation helpers
# ---------------------------------------------------------------------------

WEATHER_CONDITIONS = [
    {"condition": "Clear", "rain_probability": 5},
    {"condition": "Partly Cloudy", "rain_probability": 15},
    {"condition": "Cloudy", "rain_probability": 30},
    {"condition": "Light Rain", "rain_probability": 55},
    {"condition": "Heavy Rain", "rain_probability": 80},
    {"condition": "Thunderstorm", "rain_probability": 95},
]

def simulate_weather():
    """Return simulated weather data."""
    weather = random.choice(WEATHER_CONDITIONS)
    temperature = random.randint(18, 42)
    return {
        "condition": weather["condition"],
        "rain_probability": weather["rain_probability"],
        "temperature": temperature,
    }


def compute_risk(weather, job_type):
    """
    Determine risk level based on weather conditions and job type.
    Outdoor jobs (Delivery, Driver) are more weather-sensitive.
    """
    rain_prob = weather["rain_probability"]

    # Base risk from weather
    if rain_prob >= 70:
        base_risk = "HIGH"
    elif rain_prob >= 40:
        base_risk = "MEDIUM"
    else:
        base_risk = "LOW"

    # Outdoor jobs escalate risk one level
    if job_type in ("Delivery", "Driver") and base_risk == "MEDIUM":
        base_risk = "HIGH"
    if job_type in ("Delivery", "Driver") and base_risk == "LOW" and rain_prob >= 25:
        base_risk = "MEDIUM"

    return base_risk


def compute_payout(expected_income, risk_level):
    """Calculate loss percentage, actual income, and payout."""
    if risk_level == "HIGH":
        loss_pct = random.uniform(0.30, 0.60)
    elif risk_level == "MEDIUM":
        loss_pct = random.uniform(0.15, 0.30)
    else:
        loss_pct = 0.0

    loss_amount = round(expected_income * loss_pct)
    actual_income = expected_income - loss_amount
    return {
        "loss_percentage": round(loss_pct * 100),
        "actual_income": actual_income,
        "payout": loss_amount,
    }


def generate_insight(risk_level, weather, job_type):
    """Generate a human-readable AI insight string."""
    if risk_level == "HIGH":
        return (
            f"Based on current conditions ({weather['condition']}, "
            f"{weather['rain_probability']}% rain probability), your income risk "
            f"as a {job_type} is HIGH. EarnGuard has issued compensation to "
            f"protect your weekly earnings."
        )
    if risk_level == "MEDIUM":
        return (
            f"Moderate weather disruption detected ({weather['condition']}). "
            f"As a {job_type}, you may experience some earnings impact. "
            f"Partial compensation has been calculated."
        )
    return (
        f"Conditions look favorable ({weather['condition']}, "
        f"{weather['temperature']}°C). No significant income risk detected "
        f"for {job_type} workers this week."
    )


# ---------------------------------------------------------------------------
# API endpoint
# ---------------------------------------------------------------------------

@app.route("/api/assess", methods=["POST"])
def assess():
    """Assess income risk and calculate payout."""
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON payload"}), 400

    name = data.get("name", "").strip()
    job_type = data.get("job_type", "").strip()
    expected_income = data.get("expected_income")

    # Validation
    if not name or not job_type:
        return jsonify({"error": "Name and job type are required."}), 400
    try:
        expected_income = float(expected_income)
        if expected_income <= 0:
            raise ValueError
    except (TypeError, ValueError):
        return jsonify({"error": "Expected income must be a positive number."}), 400

    # Simulate & compute
    weather = simulate_weather()
    risk_level = compute_risk(weather, job_type)
    payout_info = compute_payout(expected_income, risk_level)
    insight = generate_insight(risk_level, weather, job_type)

    return jsonify({
        "name": name,
        "job_type": job_type,
        "expected_income": expected_income,
        "weather": weather,
        "risk_level": risk_level,
        "actual_income": payout_info["actual_income"],
        "loss_percentage": payout_info["loss_percentage"],
        "payout": payout_info["payout"],
        "insight": insight,
        "protected": payout_info["payout"] > 0,
    })


# ---------------------------------------------------------------------------
# Run
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    print("EarnGuard API running on http://localhost:5000")
    app.run(debug=True, port=5000)
