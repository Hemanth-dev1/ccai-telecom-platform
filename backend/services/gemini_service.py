import json
from services.gemini_client import (
    model
)


# ==========================================
# BILLING RESPONSE
# ==========================================

def generate_billing_response(

    user_message,

    bill_data,
):

    try:

        prompt = f"""
Customer billing issue:
{user_message}

Current bill:
{bill_data['current_bill']}

Previous bill:
{bill_data['last_month_bill']}

Reason:
{bill_data['reason']}

Instructions:
- concise telecom response
- professional tone
- avoid hallucinations
"""

        response = model.generate_content(
            prompt
        )

        return response.text

    except Exception as e:

        print(
            f"\nGEMINI ERROR: {e}\n"
        )

        return (
            "Your bill increased due "
            "to additional telecom "
            "usage charges."
        )


# ==========================================
# TICKET SUMMARY
# ==========================================

def generate_ticket_summary(
    user_message
):

    try:

        prompt = f"""
Summarize this telecom
customer issue for a
support agent.

Customer Issue:
{user_message}

Constraints:
- max 2 sentences
- concise
- operational language
"""

        response = model.generate_content(
            prompt
        )

        return response.text

    except Exception as e:

        print(
            f"\nSUMMARY ERROR: {e}\n"
        )

        return (
            "Customer reported "
            "telecom service issue."
        )


# ==========================================
# RAG RESPONSE
# ==========================================

def generate_rag_response(

    user_message,

    context,

    history=None,

    intent=None,

    sentiment=None,

    urgency=None,

    risk_level=None,

    customer_state=None,

    business_impact=None,
):

    try:

        history_text = ""

        if history:

            for item in history:

                history_text += (
                    f"{item.role}: "
                    f"{item.message}\n"
                )

        prompt = f"""
You are an enterprise telecom
customer support AI assistant.

====================================

Conversation History:
{history_text}

====================================

Intent:
{intent}

Sentiment:
{sentiment}

Urgency:
{urgency}

Risk Level:
{risk_level}

Customer State:
{customer_state}

Business Impact:
{business_impact}

====================================

Knowledge Base Context:
{context}

====================================

Customer Query:
{user_message}

====================================

Instructions:

- resolve telecom issues
- maintain conversational continuity
- reduce escalations
- be empathetic if frustrated
- avoid hallucinations
- never invent telecom policies
- concise professional responses
- acknowledge urgency carefully
- use only provided context
"""

        response = model.generate_content(
            prompt
        )

        return response.text

    except Exception as e:

        print(
            f"\nRAG ERROR: {e}\n"
        )

        return (
            "We are reviewing your "
            "telecom request."
        )
    


# ==========================================
# ORCHESTRATION RESPONSE
# ==========================================

def generate_orchestration_response(

    user_message,

    context,

    history=None,

    intent=None,

    flow=None,
):

    try:

        history_text = ""

        if history:

            for item in history:

                history_text += (
                    f"{item.role}: "
                    f"{item.message}\n"
                )

        prompt = f"""
You are an enterprise telecom AI orchestration engine.

You must:
- classify customer sentiment
- assess escalation risk
- determine urgency
- determine customer state
- generate telecom support response

====================================

Conversation History:
{history_text}

====================================

Detected Intent:
{intent}

Active Flow:
{flow}

====================================

Knowledge Base Context:
{context}

====================================

Customer Message:
{user_message}

====================================

Return ONLY valid JSON.

JSON schema:

{{
  "reply": "...",

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

Escalate if:
- legal threat
- repeated complaints
- cancellation intent
- fraud accusation
- angry customer
"""

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
            "\n========== ORCHESTRATION =========="
        )

        print(text)

        print(
            "===================================\n"
        )

        data = json.loads(text)

        return data

    except Exception as e:

        print(
            f"\nORCHESTRATION ERROR: {e}\n"
        )

        return {

            "reply":
                "We are reviewing your telecom request.",

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