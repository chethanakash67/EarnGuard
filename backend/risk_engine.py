"""
EarnGuard V2 – Risk Engine
Weather simulation, risk calculation, and compensation logic.
"""

import random
import datetime

# ---------------------------------------------------------------------------
# Job type multipliers — how much weather affects each worker type
# ---------------------------------------------------------------------------
JOB_MULTIPLIERS = {
    "Delivery": 1.2,
    "Driver": 1.0,
    "Freelancer": 0.6,
    "Auto Driver": 1.1,
    "Construction Worker": 1.3,
}

# ---------------------------------------------------------------------------
# Weather conditions with base rain probability ranges
# ---------------------------------------------------------------------------
WEATHER_TABLE = [
    {"condition": "Clear", "rain_range": (0, 10), "temp_range": (28, 40)},
    {"condition": "Partly Cloudy", "rain_range": (8, 25), "temp_range": (25, 36)},
    {"condition": "Cloudy", "rain_range": (20, 45), "temp_range": (22, 32)},
    {"condition": "Light Rain", "rain_range": (40, 65), "temp_range": (20, 28)},
    {"condition": "Heavy Rain", "rain_range": (60, 90), "temp_range": (18, 26)},
    {"condition": "Thunderstorm", "rain_range": (80, 98), "temp_range": (16, 24)},
]

# City risk bias — higher = more likely to get rain
CITY_BIAS = {
    "mumbai": 0.3, "chennai": 0.25, "kolkata": 0.2,
    "delhi": -0.1, "bangalore": 0.15, "hyderabad": 0.1,
    "pune": 0.1, "jaipur": -0.15, "ahmedabad": -0.1,
    "tirupati": 0.15, "lucknow": 0.0, "kochi": 0.35,
}

DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]


def simulate_weather(city=""):
    """Generate realistic simulated weather for a city."""
    # Pick a weather condition with some randomness
    bias = CITY_BIAS.get(city.lower().strip(), 0.0)
    # Bias shifts which weather condition is more likely
    weights = [max(0.05, 0.3 - bias), 0.25, 0.2, 0.15, max(0.05, 0.1 + bias * 0.5), max(0.02, 0.05 + bias * 0.3)]
    weather = random.choices(WEATHER_TABLE, weights=weights, k=1)[0]

    rain_prob = random.randint(*weather["rain_range"])
    temperature = random.randint(*weather["temp_range"])

    return {
        "condition": weather["condition"],
        "rain_probability": rain_prob,
        "temperature": temperature,
    }


def calculate_risk(rain_prob, job_type="Delivery"):
    """
    Calculate risk level and loss percentage.
    rain_prob < 25% → LOW (0% loss)
    rain_prob 25-55% → MEDIUM (15-30% loss)
    rain_prob > 55% → HIGH (30-60% loss)
    Multiplied by job type factor.
    """
    multiplier = JOB_MULTIPLIERS.get(job_type, 1.0)

    if rain_prob > 55:
        base_loss = random.uniform(0.30, 0.60)
        risk_level = "HIGH"
    elif rain_prob >= 25:
        base_loss = random.uniform(0.15, 0.30)
        risk_level = "MEDIUM"
    else:
        base_loss = 0.0
        risk_level = "LOW"

    # Apply multiplier but cap at 75%
    adjusted_loss = min(base_loss * multiplier, 0.75)
    loss_pct = round(adjusted_loss * 100)

    return risk_level, loss_pct


def calculate_payout(expected_income, loss_pct, coverage):
    """Calculate actual income and compensation."""
    loss_amount = round(expected_income * loss_pct / 100)
    actual_income = expected_income - loss_amount
    compensation = round(loss_amount * coverage)
    return {
        "actual_income": actual_income,
        "loss_amount": loss_amount,
        "loss_percentage": loss_pct,
        "compensation": compensation,
    }


def generate_insight(name, job_type, risk_level, weather, payout_info, plan_name, coverage_pct):
    """Generate AI insight text."""
    if payout_info["compensation"] > 0:
        return (
            f"Based on {weather['condition'].lower()} conditions "
            f"({weather['rain_probability']}% rain probability), "
            f"your income risk as a {job_type} is {risk_level}. "
            f"Your EarnGuard {plan_name} plan ({coverage_pct}% coverage) "
            f"has issued compensation of "
            f"\u20b9{payout_info['compensation']:,} to protect your earnings."
        )
    return (
        f"Based on {weather['condition'].lower()} conditions "
        f"({weather['temperature']}\u00b0C), your income risk as a {job_type} "
        f"is {risk_level}. No disruption detected \u2014 EarnGuard has kept "
        f"your earnings stable this week."
    )


def generate_forecast(city, job_type, expected_income, coverage, days=5):
    """Generate multi-day weather + risk forecast."""
    today = datetime.date.today()
    result = []
    total_compensation = 0

    for i in range(days):
        day = today + datetime.timedelta(days=i + 1)
        weather = simulate_weather(city)
        risk_level, loss_pct = calculate_risk(weather["rain_probability"], job_type)
        daily_income = expected_income / 5  # 5 working days
        payout = calculate_payout(daily_income, loss_pct, coverage)
        total_compensation += payout["compensation"]

        result.append({
            "day_name": DAY_NAMES[day.weekday()],
            "date": day.strftime("%b %d"),
            "weather": weather,
            "risk_level": risk_level,
            "estimated_compensation": payout["compensation"],
        })

    return {"days": result, "total_estimated_compensation": total_compensation}


def generate_history(expected_income, job_type, coverage, weeks=8):
    """
    Generate 8 weeks of earnings history.
    IMPORTANT: actual income is ALWAYS capped at expected income.
    """
    result = []
    total_compensation = 0
    protected_weeks = 0
    today = datetime.date.today()

    for i in range(weeks - 1, -1, -1):
        week_start = today - datetime.timedelta(weeks=i)
        weather = simulate_weather()
        risk_level, loss_pct = calculate_risk(weather["rain_probability"], job_type)
        payout = calculate_payout(expected_income, loss_pct, coverage)

        # Cap actual at expected — actual can NEVER exceed expected
        actual = min(payout["actual_income"], expected_income)

        if payout["compensation"] > 0:
            protected_weeks += 1
        total_compensation += payout["compensation"]

        result.append({
            "week": f"W{weeks - i}",
            "week_start": week_start.strftime("%b %d"),
            "expected": expected_income,
            "actual": actual,
            "compensation": payout["compensation"],
            "risk_level": risk_level,
            "weather": weather["condition"],
        })

    return {
        "weeks": result,
        "total_compensation": total_compensation,
        "protected_weeks": protected_weeks,
        "streak": protected_weeks,
    }


def generate_report(name, job_type, plan_name, coverage_pct, history_data):
    """Generate AI weekly report from history data."""
    weeks = history_data["weeks"]
    high_risk_days = sum(1 for w in weeks if w["risk_level"] == "HIGH")
    total_comp = history_data["total_compensation"]

    # Find worst week
    worst_week = max(weeks, key=lambda w: w["expected"] - w["actual"])
    worst_loss = worst_week["expected"] - worst_week["actual"]
    worst_day = worst_week["week"]

    if total_comp > 0:
        summary = (
            f"Hi {name}, here\u2019s your weekly protection summary. "
            f"Last week had {high_risk_days} high-risk day{'s' if high_risk_days != 1 else ''} "
            f"due to adverse weather conditions. Your EarnGuard {plan_name} plan "
            f"protected your income with a total compensation of \u20b9{total_comp:,}. "
            f"{worst_day} was the most impacted with \u20b9{worst_loss:,} in potential losses. "
            f"As a {job_type}, weather disruptions can significantly affect your earnings. "
            f"EarnGuard ensures you stay financially stable regardless of conditions."
        )
    else:
        summary = (
            f"Great news, {name}! Last week was smooth sailing with no major weather "
            f"disruptions affecting your {job_type} earnings. Your income remained "
            f"on track. Keep up the great work!"
        )

    # Tip for non-Elite users
    tip = None
    if plan_name != "Elite":
        from plans import get_next_plan, PLAN_ORDER
        plan_id = plan_name.lower()
        next_plan = get_next_plan(plan_id) if plan_id in PLAN_ORDER else None
        if next_plan:
            tip = (
                f"Upgrade to {next_plan['name']} for {int(next_plan['coverage'] * 100)}% "
                f"coverage and \u20b9{next_plan['max_income']:,} weekly protection cap."
            )

    return {
        "summary": summary,
        "high_risk_days": high_risk_days,
        "total_compensation": total_comp,
        "worst_day": worst_day,
        "worst_loss": worst_loss,
        "tip": tip,
    }


# Map cities for the risk map
MAP_CITIES = [
    {"name": "Mumbai", "lat": 19.076, "lng": 72.878},
    {"name": "Delhi", "lat": 28.614, "lng": 77.209},
    {"name": "Bangalore", "lat": 12.972, "lng": 77.595},
    {"name": "Chennai", "lat": 13.083, "lng": 80.271},
    {"name": "Hyderabad", "lat": 17.385, "lng": 78.487},
    {"name": "Kolkata", "lat": 22.573, "lng": 88.364},
    {"name": "Pune", "lat": 18.520, "lng": 73.857},
    {"name": "Jaipur", "lat": 26.912, "lng": 75.787},
]


def generate_map_data(user_city=""):
    """Generate risk data for map cities, highlighting user's city."""
    result = []
    for city in MAP_CITIES:
        weather = simulate_weather(city["name"])
        risk_level, _ = calculate_risk(weather["rain_probability"])
        is_user_city = city["name"].lower() == user_city.lower().strip()
        result.append({
            **city,
            "weather": weather,
            "risk_level": risk_level,
            "is_user_city": is_user_city,
        })
    return result
