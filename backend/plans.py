"""
EarnGuard V2 – Subscription Plan Definitions & Validation
"""

PLANS = {
    "starter": {
        "name": "Starter",
        "max_income": 5000,
        "weekly_price": 99,
        "monthly_price": 349,
        "coverage": 0.50,
        "benefit": "Basic weather protection for part-time gig workers",
    },
    "basic": {
        "name": "Basic",
        "max_income": 10000,
        "weekly_price": 179,
        "monthly_price": 649,
        "coverage": 0.60,
        "benefit": "Enhanced coverage for regular gig workers",
    },
    "standard": {
        "name": "Standard",
        "max_income": 15000,
        "weekly_price": 249,
        "monthly_price": 899,
        "coverage": 0.70,
        "benefit": "Full protection with 70% income coverage",
    },
    "pro": {
        "name": "Pro",
        "max_income": 25000,
        "weekly_price": 399,
        "monthly_price": 1449,
        "coverage": 0.80,
        "popular": True,
        "benefit": "Most popular — 80% coverage for serious earners",
    },
    "elite": {
        "name": "Elite",
        "max_income": 50000,
        "weekly_price": 699,
        "monthly_price": 2499,
        "coverage": 0.90,
        "benefit": "Maximum 90% coverage for top earners",
    },
    "custom": {
        "name": "Custom",
        "max_income": None,  # user-defined
        "weekly_price": None,  # 4% of declared income
        "monthly_price": None,  # 14% of declared income
        "coverage": 0.70,
        "benefit": "Flexible plan — set your own income level",
    },
}

# Ordered list for upgrade suggestions
PLAN_ORDER = ["starter", "basic", "standard", "pro", "elite"]


def get_plan(plan_id):
    """Get plan by ID."""
    return PLANS.get(plan_id)


def get_subscription_price(plan_id, billing="weekly", custom_income=None):
    """Calculate subscription price. For custom plan, compute from income."""
    plan = PLANS.get(plan_id)
    if not plan:
        return 0

    if plan_id == "custom" and custom_income:
        if billing == "monthly":
            return round(custom_income * 0.14)
        return round(custom_income * 0.04)

    if billing == "monthly":
        return plan["monthly_price"]
    return plan["weekly_price"]


def get_max_income(plan_id, custom_income=None):
    """Get max allowed income for a plan."""
    if plan_id == "custom":
        return custom_income or 100000
    plan = PLANS.get(plan_id)
    return plan["max_income"] if plan else 5000


def validate_income(plan_id, expected_income, custom_income=None):
    """
    Validate income against plan cap.
    Returns (is_valid, error_dict) tuple.
    """
    max_income = get_max_income(plan_id, custom_income)

    if expected_income > max_income:
        # Find next higher plan
        suggested = None
        if plan_id in PLAN_ORDER:
            idx = PLAN_ORDER.index(plan_id)
            if idx < len(PLAN_ORDER) - 1:
                next_id = PLAN_ORDER[idx + 1]
                suggested = {
                    "id": next_id,
                    "name": PLANS[next_id]["name"],
                    "max_income": PLANS[next_id]["max_income"],
                    "coverage": int(PLANS[next_id]["coverage"] * 100),
                }
        elif plan_id == "custom":
            # Custom plan: income is whatever they declared, so only
            # validate if they try to claim more than declared
            return True, None

        return False, {
            "error": "Income exceeds plan limit",
            "max_allowed": max_income,
            "suggested_plan": suggested,
        }

    return True, None


def get_next_plan(plan_id):
    """Get the next higher plan for upgrade tips."""
    if plan_id not in PLAN_ORDER:
        return None
    idx = PLAN_ORDER.index(plan_id)
    if idx < len(PLAN_ORDER) - 1:
        next_id = PLAN_ORDER[idx + 1]
        return {"id": next_id, **PLANS[next_id]}
    return None  # Elite has no upgrade


def get_all_plans():
    """Return all plans as a list for API response."""
    result = []
    for pid, plan in PLANS.items():
        result.append({"id": pid, **plan})
    return result
