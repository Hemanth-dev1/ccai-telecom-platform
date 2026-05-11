import json

from services.gemini_client import (
    model
)


# ==========================================
# ANALYZE CUSTOMER STATE
# ==========================================

def analyze_sentiment(

    message: str,

    intent: str,
):

    prompt = f"""
You are an enterprise telecom
support orchestration system.

Analyze the customer message.

Customer Message:
"{message}"

Detected Intent:
"{intent}"

Return ONLY valid JSON.

JSON schema:

{{
    "sentiment": "...",
    "urgency": "...",
    "risk_level": "...",
    "requires_escalation": true,
    "customer_state": "...",
    "business_impact": "..."
}}

Allowed sentiment:
- positive
- neutral
- frustrated
- angry

Allowed urgency:
- low
- medium
- high

Allowed risk_level:
- low
- medium
- high

Allowed customer_state:
- stable
- dissatisfied
- churn_risk
- escalation_risk

Allowed business_impact:
- low
- medium
- high

Escalation rules:
- legal threats
- cancellation requests
- repeated complaints
- angry customers
- high business impact
"""

    try:

        response = model.generate_content(
            prompt
        )

        text = (

            response.text

            .replace(
                "```json",
                ""
            )

            .replace(
                "```",
                ""
            )

            .strip()
        )

        print(
            "\n========== SENTIMENT ANALYSIS =========="
        )

        print(text)

        print(
            "========================================\n"
        )

        data = json.loads(text)

        return data

    except Exception as e:

        print(
            f"\nSENTIMENT ERROR: {e}\n"
        )

        return {

            "sentiment":
                "neutral",

            "urgency":
                "low",

            "risk_level":
                "low",

            "requires_escalation":
                False,

            "customer_state":
                "stable",

            "business_impact":
                "low",
        }