
import time

from fastapi import APIRouter
from pydantic import BaseModel

from services.dialogflow_service import (
    detect_intent
)

from services.memory_service import (
    save_message,
    get_session_history
)

from services.event_service import (
    create_event
)

from rag.retriever import (
    retrieve_context
)

from services.gemini_service import (
    generate_orchestration_response
)

router = APIRouter()


# ==========================================
# REQUEST MODEL
# ==========================================

class ChatRequest(BaseModel):

    message: str

    session_id: str


# ==========================================
# CHAT ENDPOINT
# ==========================================

@router.post("/chat")
async def chat(
    request: ChatRequest
):

    overall_start = time.time()

    user_message = request.message

    session_id = request.session_id

    print(
        "\n========== NEW CHAT REQUEST =========="
    )

    print(f"SESSION: {session_id}")

    print(f"MESSAGE: {user_message}")

    print(
        "======================================\n"
    )

    # =====================================
    # DIALOGFLOW CX
    # =====================================

    intent_data = detect_intent(

        session_id=session_id,

        user_message=user_message,
    )

    intent = intent_data["intent"]

    confidence = (
        intent_data["confidence"]
    )

    flow = intent_data["flow"]

    print(
        "\n========== INTENT =========="
    )

    print(f"INTENT: {intent}")

    print(
        f"CONFIDENCE: {confidence}"
    )

    print(f"FLOW: {flow}")

    print(
        "============================\n"
    )

    # =====================================
    # MEMORY
    # =====================================

    history = get_session_history(
        session_id
    )

    print(
        f"\nHISTORY: {len(history)} messages\n"
    )

    # =====================================
    # RAG
    # =====================================

    rag_start = time.time()

    context = retrieve_context(
        user_message
    )

    rag_latency = round(

        (time.time() - rag_start)

        * 1000
    )

    print(
        "\n========== RAG =========="
    )

    print(context[:300])

    print(
        "=========================\n"
    )

    # =====================================
    # GEMINI ORCHESTRATION
    # =====================================

    gemini_start = time.time()

    orchestration = (
        generate_orchestration_response(

            user_message=user_message,

            context=context,

            history=history,

            intent=intent,

            flow=flow,
        )
    )

    gemini_latency = round(

        (time.time() - gemini_start)

        * 1000
    )

    # =====================================
    # EXTRACT ORCHESTRATION
    # =====================================

    ai_reply = orchestration.get(
        "reply",
        "We are reviewing your request."
    )

    sentiment = orchestration.get(
        "sentiment",
        "neutral"
    )

    urgency = orchestration.get(
        "urgency",
        "low"
    )

    risk_level = orchestration.get(
        "risk_level",
        "low"
    )

    requires_escalation = (
        orchestration.get(
            "requires_escalation",
            False
        )
    )

    customer_state = (
        orchestration.get(
            "customer_state",
            "stable"
        )
    )

    business_impact = (
        orchestration.get(
            "business_impact",
            "low"
        )
    )

    # =====================================
    # DETERMINISTIC OVERRIDE
    # =====================================

    escalation_intents = [

        "cancel_subscription",

        "legal_threat",

        "human_agent_request",

        "complaint_repeat",
    ]

    if intent in escalation_intents:

        requires_escalation = True

        urgency = "high"

        risk_level = "high"

        customer_state = (
            "escalation_risk"
        )

        business_impact = "high"

    print(
        "\n========== ORCHESTRATION =========="
    )

    print(f"SENTIMENT: {sentiment}")

    print(f"URGENCY: {urgency}")

    print(
        f"RISK: {risk_level}"
    )

    print(
        f"ESCALATION: {requires_escalation}"
    )

    print(
        f"CUSTOMER STATE: {customer_state}"
    )

    print(
        f"BUSINESS IMPACT: {business_impact}"
    )

    print(
        "===================================\n"
    )

    # =====================================
    # SAVE USER MESSAGE
    # =====================================

    save_message(

        session_id=session_id,

        role="user",

        message=user_message,

        intent=intent,

        flow=flow,

        sentiment=sentiment,

        urgency=urgency,

        risk_level=risk_level,
    )

    # =====================================
    # SAVE ASSISTANT MESSAGE
    # =====================================

    save_message(

        session_id=session_id,

        role="assistant",

        message=ai_reply,

        intent=intent,

        flow=flow,

        sentiment=sentiment,

        urgency=urgency,

        risk_level=risk_level,
    )

    # =====================================
    # EVENTS
    # =====================================

    create_event(

        session_id=session_id,

        event_type="intent_detected",

        event_data={

            "intent": intent,

            "confidence": confidence,

            "flow": flow,
        },

        source="Dialogflow",
    )

    create_event(

        session_id=session_id,

        event_type="sentiment_detected",

        event_data={

            "sentiment": sentiment,

            "urgency": urgency,

            "risk_level": risk_level,

            "requires_escalation":
                requires_escalation,

            "customer_state":
                customer_state,

            "business_impact":
                business_impact,
        },

        source="Gemini",
    )

    create_event(

        session_id=session_id,

        event_type="rag_retrieval",

        event_data={

            "query": user_message,

            "latency_ms":
                rag_latency,
        },

        source="RAG",
    )

    create_event(

        session_id=session_id,

        event_type="response_generated",

        event_data={

            "flow": flow,

            "latency_ms":
                gemini_latency,
        },

        source="Gemini",
    )

    # =====================================
    # TOTAL LATENCY
    # =====================================

    total_latency = round(

        (time.time() - overall_start)

        * 1000
    )

    print(
        f"\nTOTAL LATENCY: {total_latency} ms\n"
    )

    # =====================================
    # RESPONSE
    # =====================================

    return {

        "reply": ai_reply,

        "intent": intent,

        "confidence": confidence,

        "flow": flow,

        "session_id": session_id,

        "sentiment": sentiment,

        "urgency": urgency,

        "risk_level": risk_level,

        "requires_escalation":
            requires_escalation,

        "customer_state":
            customer_state,

        "business_impact":
            business_impact,

        "trace": {

            "webhook": {

                "endpoint":
                    "/chat",

                "status":
                    "success",

                "latency":
                    f"{total_latency} ms",
            },

            "gemini": {

                "model":
                    "gemini-2.5-flash",

                "status":
                    "success",

                "latency":
                    f"{gemini_latency} ms",
            },

            "rag": {

                "status":
                    "success",

                "latency":
                    f"{rag_latency} ms",

                "chunks": 1,
            },

            "memory": {

                "messages":
                    len(history),
            }
        }
    }

