"""
EarnGuard Backend – AI-Powered Income Protection API
Flask server with weather-based risk assessment, earnings history,
forecasts, AI reports, and premium tier support.
"""

import random
import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# ---------------------------------------------------------------------------
# Constants & Configuration
# ---------------------------------------------------------------------------

WEATHER_CONDITIONS = [
    {"condition": "Clear", "rain_probability": 5},
    {"condition": "Partly Cloudy", "rain_probability": 15},
    {"condition": "Cloudy", "rain_probability": 30},
    {"condition": "Light Rain", "rain_probability": 55},
    {"condition": "Heavy Rain", "rain_probability": 80},
    {"condition": "Thunderstorm", "rain_probability": 95},
]

# Worker profile risk multipliers — outdoor jobs are more weather-sensitive
WORKER_PROFILES = {
    "Delivery": {
        "rain_multiplier": 1.5,
        "temp_multiplier": 1.2,
        "base_loss_high": (0.35, 0.60),
        "base_loss_medium": (0.18, 0.30),
        "description": "High outdoor exposure. Rain and extreme temperatures significantly impact delivery routes and order volume.",
    },
    "Driver": {
        "rain_multiplier": 1.3,
        "temp_multiplier": 1.0,
        "base_loss_high": (0.30, 0.55),
        "base_loss_medium": (0.15, 0.28),
        "description": "Moderate weather sensitivity. Heavy rain reduces ride requests but temperature has less impact.",
    },
    "Freelancer": {
        "rain_multiplier": 0.5,
        "temp_multiplier": 0.3,
        "base_loss_high": (0.15, 0.35),
        "base_loss_medium": (0.08, 0.18),
        "description": "Low weather sensitivity. Mostly indoor work, but severe weather can disrupt meetings and deadlines.",
    },
}

# Premium tier coverage
TIER_COVERAGE = {
    "basic": 0.50,
    "pro": 0.90,
}

DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

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
    """Determine risk level factoring in worker profile."""
    rain_prob = weather["rain_probability"]
    profile = WORKER_PROFILES.get(job_type, WORKER_PROFILES["Freelancer"])

    # Effective rain impact
    effective_rain = min(rain_prob * profile["rain_multiplier"], 100)

    if effective_rain >= 70:
        return "HIGH"
    elif effective_rain >= 35:
        return "MEDIUM"
    return "LOW"


def compute_payout(expected_income, risk_level, job_type, tier="pro"):
    """Calculate loss and apply tier coverage."""
    profile = WORKER_PROFILES.get(job_type, WORKER_PROFILES["Freelancer"])
    coverage = TIER_COVERAGE.get(tier, 0.90)

    if risk_level == "HIGH":
        loss_pct = random.uniform(*profile["base_loss_high"])
    elif risk_level == "MEDIUM":
        loss_pct = random.uniform(*profile["base_loss_medium"])
    else:
        loss_pct = 0.0

    loss_amount = round(expected_income * loss_pct)
    # Coverage applies to the loss — this is what EarnGuard pays
    payout = round(loss_amount * coverage)
    actual_income = expected_income - loss_amount

    return {
        "loss_percentage": round(loss_pct * 100),
        "actual_income": actual_income,
        "payout": payout,
        "coverage_percentage": round(coverage * 100),
        "total_loss": loss_amount,
    }


def generate_insight(risk_level, weather, job_type, payout_info, tier):
    """Generate a human-readable AI insight string."""
    coverage = payout_info["coverage_percentage"]

    if risk_level == "HIGH":
        return (
            f"Based on current conditions ({weather['condition']}, "
            f"{weather['rain_probability']}% rain probability), your income risk "
            f"as a {job_type} is HIGH. Your {tier.capitalize()} plan covers "
            f"{coverage}% of losses. EarnGuard has issued compensation to "
            f"protect your weekly earnings."
        )
    if risk_level == "MEDIUM":
        return (
            f"Moderate weather disruption detected ({weather['condition']}). "
            f"As a {job_type}, you may experience some earnings impact. "
            f"Your {tier.capitalize()} plan ({coverage}% coverage) has calculated "
            f"partial compensation."
        )
    return (
        f"Conditions look favorable ({weather['condition']}, "
        f"{weather['temperature']}°C). No significant income risk detected "
        f"for {job_type} workers this week."
    )


# ---------------------------------------------------------------------------
# API: Assess Risk
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
    tier = data.get("tier", "pro").strip().lower()

    if not name or not job_type:
        return jsonify({"error": "Name and job type are required."}), 400
    try:
        expected_income = float(expected_income)
        if expected_income <= 0:
            raise ValueError
    except (TypeError, ValueError):
        return jsonify({"error": "Expected income must be a positive number."}), 400
    if tier not in TIER_COVERAGE:
        tier = "pro"

    weather = simulate_weather()
    risk_level = compute_risk(weather, job_type)
    payout_info = compute_payout(expected_income, risk_level, job_type, tier)
    insight = generate_insight(risk_level, weather, job_type, payout_info, tier)

    return jsonify({
        "name": name,
        "job_type": job_type,
        "expected_income": expected_income,
        "tier": tier,
        "weather": weather,
        "risk_level": risk_level,
        "actual_income": payout_info["actual_income"],
        "loss_percentage": payout_info["loss_percentage"],
        "payout": payout_info["payout"],
        "total_loss": payout_info["total_loss"],
        "coverage_percentage": payout_info["coverage_percentage"],
        "insight": insight,
        "protected": payout_info["payout"] > 0,
    })


# ---------------------------------------------------------------------------
# API: Earnings History (8 weeks simulated)
# ---------------------------------------------------------------------------

@app.route("/api/history", methods=["POST"])
def history():
    """Generate 8 weeks of simulated earnings history."""
    data = request.get_json() or {}
    expected_income = float(data.get("expected_income", 5000))
    job_type = data.get("job_type", "Delivery")
    tier = data.get("tier", "pro").lower()

    weeks = []
    today = datetime.date.today()
    total_payout = 0
    protected_weeks = 0

    for i in range(7, -1, -1):
        week_start = today - datetime.timedelta(weeks=i)
        weather = simulate_weather()
        risk = compute_risk(weather, job_type)
        payout_info = compute_payout(expected_income, risk, job_type, tier)

        if payout_info["payout"] > 0:
            protected_weeks += 1
        total_payout += payout_info["payout"]

        weeks.append({
            "week": f"W{8 - i}",
            "week_start": week_start.strftime("%b %d"),
            "expected": expected_income,
            "actual": payout_info["actual_income"],
            "payout": payout_info["payout"],
            "risk_level": risk,
            "weather": weather["condition"],
        })

    return jsonify({
        "weeks": weeks,
        "total_payout": total_payout,
        "protected_weeks": protected_weeks,
        "streak": protected_weeks,  # simplified streak
    })


# ---------------------------------------------------------------------------
# API: 5-Day Forecast
# ---------------------------------------------------------------------------

@app.route("/api/forecast", methods=["POST"])
def forecast():
    """Generate 5-day weather + risk forecast."""
    data = request.get_json() or {}
    job_type = data.get("job_type", "Delivery")
    expected_income = float(data.get("expected_income", 5000))
    tier = data.get("tier", "pro").lower()

    today = datetime.date.today()
    days = []
    total_estimated_payout = 0

    for i in range(5):
        day = today + datetime.timedelta(days=i + 1)
        weather = simulate_weather()
        risk = compute_risk(weather, job_type)
        payout_info = compute_payout(expected_income / 5, risk, job_type, tier)
        total_estimated_payout += payout_info["payout"]

        days.append({
            "day_name": DAY_NAMES[day.weekday()],
            "date": day.strftime("%b %d"),
            "weather": weather,
            "risk_level": risk,
            "estimated_payout": payout_info["payout"],
        })

    return jsonify({
        "days": days,
        "total_estimated_payout": total_estimated_payout,
    })


# ---------------------------------------------------------------------------
# API: AI Weekly Report
# ---------------------------------------------------------------------------

@app.route("/api/report", methods=["POST"])
def report():
    """Generate a simulated AI weekly report."""
    data = request.get_json() or {}
    name = data.get("name", "Worker")
    job_type = data.get("job_type", "Delivery")
    expected_income = float(data.get("expected_income", 5000))
    tier = data.get("tier", "pro").lower()

    # Simulate the past week day by day
    high_risk_days = 0
    total_payout = 0
    worst_day = None
    worst_loss = 0

    for i in range(7):
        weather = simulate_weather()
        risk = compute_risk(weather, job_type)
        daily_income = expected_income / 7
        payout_info = compute_payout(daily_income, risk, job_type, tier)

        if risk == "HIGH":
            high_risk_days += 1
        total_payout += payout_info["payout"]

        if payout_info["total_loss"] > worst_loss:
            worst_loss = payout_info["total_loss"]
            worst_day = DAY_NAMES[i]

    # Build report text
    if total_payout > 0:
        summary = (
            f"Hi {name}, here's your weekly protection summary. "
            f"Last week had {high_risk_days} high-risk day{'s' if high_risk_days != 1 else ''} "
            f"due to adverse weather conditions. "
            f"Your EarnGuard {tier.capitalize()} plan protected your income with a total "
            f"compensation of Rs.{total_payout:,}. "
        )
        if worst_day:
            summary += (
                f"{worst_day} was the most impacted day with Rs.{round(worst_loss):,} in potential losses. "
            )
        summary += (
            f"As a {job_type}, weather disruptions can significantly affect your earnings. "
            f"EarnGuard ensures you stay financially stable regardless of conditions."
        )
    else:
        summary = (
            f"Great news, {name}! Last week was smooth sailing with no major weather "
            f"disruptions affecting your {job_type} earnings. Your expected income of "
            f"Rs.{expected_income:,.0f} remained on track. Keep up the great work!"
        )

    tip = random.choice([
        "Tip: Upgrade to Pro for 90% coverage and maximum protection.",
        "Tip: Check the 5-day forecast to plan your week around risky days.",
        "Tip: Delivery workers face 1.5x rain impact — plan indoor tasks on rainy days.",
        "Tip: Your protection streak earns you badges. Keep it going!",
        "Tip: Share EarnGuard with fellow gig workers to help them protect their income.",
    ])

    return jsonify({
        "summary": summary,
        "high_risk_days": high_risk_days,
        "total_payout": total_payout,
        "worst_day": worst_day,
        "tip": tip,
    })


# ---------------------------------------------------------------------------
# API: AI Chat (pre-built responses)
# ---------------------------------------------------------------------------

CHAT_RESPONSES = {
    "payout": (
        "Your payout depends on three factors: (1) Weather conditions — heavier rain means higher "
        "risk and larger compensation, (2) Your job type — Delivery workers face 1.5x rain impact "
        "vs Freelancers at 0.5x, and (3) Your coverage tier — Pro covers 90% of losses while "
        "Basic covers 50%. If your payout was lower, it likely means conditions were only moderately "
        "disruptive or you're on the Basic plan."
    ),
    "maximize": (
        "To maximize your EarnGuard protection: (1) Upgrade to Pro tier for 90% coverage, "
        "(2) Check the 5-day forecast and plan high-value work on low-risk days, "
        "(3) Build a protection streak — consistent weeks earn you badges and priority support, "
        "(4) Set your expected income accurately so compensation matches your actual earning potential."
    ),
    "coverage": (
        "EarnGuard offers two tiers: Basic covers 50% of weather-related income losses, "
        "while Pro covers 90%. For example, if you expect Rs.5,000/week and heavy rain causes "
        "a 40% drop (Rs.2,000 loss), Basic pays Rs.1,000 and Pro pays Rs.1,800. "
        "Pro is recommended for full-time gig workers."
    ),
    "weather": (
        "EarnGuard monitors weather conditions including rain probability, temperature extremes, "
        "and storm events. Each job type reacts differently — Delivery workers are most affected "
        "(1.5x rain multiplier) because routes become slower and order volume drops. Drivers face "
        "moderate impact (1.3x) while Freelancers are least affected (0.5x) since most work is indoors."
    ),
    "how": (
        "EarnGuard works in 3 simple steps: (1) Tell us your job type, expected weekly income, "
        "and choose a coverage tier, (2) Our AI analyzes real-time weather data and your job's "
        "risk profile to calculate potential earnings impact, (3) If weather disruption causes "
        "income loss, compensation is automatically calculated and issued. No claims, no paperwork."
    ),
    "default": (
        "I can help you understand your payouts, coverage tiers, weather impact, and how to "
        "maximize your protection. Try asking about: 'Why was my payout lower?', "
        "'How do I maximize protection?', 'What does my coverage include?', "
        "'How does weather affect me?', or 'How does EarnGuard work?'"
    ),
}


@app.route("/api/chat", methods=["POST"])
def chat():
    """Simple keyword-based chat assistant."""
    data = request.get_json() or {}
    message = data.get("message", "").lower().strip()

    # Keyword matching
    if any(w in message for w in ["payout", "lower", "less", "why", "reduced"]):
        key = "payout"
    elif any(w in message for w in ["maximize", "max", "increase", "more", "better", "improve"]):
        key = "maximize"
    elif any(w in message for w in ["coverage", "tier", "plan", "basic", "pro", "premium"]):
        key = "coverage"
    elif any(w in message for w in ["weather", "rain", "storm", "temperature", "forecast"]):
        key = "weather"
    elif any(w in message for w in ["how", "work", "what", "explain", "start"]):
        key = "how"
    else:
        key = "default"

    return jsonify({
        "response": CHAT_RESPONSES[key],
        "matched_topic": key,
    })


# ---------------------------------------------------------------------------
# API: Worker Profile Info
# ---------------------------------------------------------------------------

@app.route("/api/profiles", methods=["GET"])
def profiles():
    """Return worker profile details."""
    result = {}
    for job_type, profile in WORKER_PROFILES.items():
        result[job_type] = {
            "rain_multiplier": profile["rain_multiplier"],
            "temp_multiplier": profile["temp_multiplier"],
            "description": profile["description"],
        }
    return jsonify(result)


# ---------------------------------------------------------------------------
# API: Auto-Demo Scenarios
# ---------------------------------------------------------------------------

@app.route("/api/demo-scenarios", methods=["POST"])
def demo_scenarios():
    """Return 3 fixed scenarios for auto-demo playback."""
    data = request.get_json() or {}
    name = data.get("name", "Demo User")
    job_type = data.get("job_type", "Delivery")
    expected_income = float(data.get("expected_income", 5000))
    tier = data.get("tier", "pro").lower()

    scenarios = [
        {"condition": "Clear", "rain_probability": 5, "temperature": 32, "label": "Sunny Day"},
        {"condition": "Light Rain", "rain_probability": 55, "temperature": 24, "label": "Rainy Day"},
        {"condition": "Thunderstorm", "rain_probability": 95, "temperature": 19, "label": "Storm"},
    ]

    results = []
    for scenario in scenarios:
        weather = {
            "condition": scenario["condition"],
            "rain_probability": scenario["rain_probability"],
            "temperature": scenario["temperature"],
        }
        risk = compute_risk(weather, job_type)
        payout_info = compute_payout(expected_income, risk, job_type, tier)
        insight = generate_insight(risk, weather, job_type, payout_info, tier)

        results.append({
            "label": scenario["label"],
            "name": name,
            "job_type": job_type,
            "expected_income": expected_income,
            "tier": tier,
            "weather": weather,
            "risk_level": risk,
            "actual_income": payout_info["actual_income"],
            "loss_percentage": payout_info["loss_percentage"],
            "payout": payout_info["payout"],
            "total_loss": payout_info["total_loss"],
            "coverage_percentage": payout_info["coverage_percentage"],
            "insight": insight,
            "protected": payout_info["payout"] > 0,
        })

    return jsonify({"scenarios": results})


# ---------------------------------------------------------------------------
# Run
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    print("EarnGuard API running on http://localhost:5000")
    app.run(debug=True, port=5000)
