
import asyncio
import time

from fastapi import APIRouter
from pydantic import BaseModel

from services.dialogflow_service import (
    detect_intent
)

from services.memory_service import (
    save_messages_batch,
    get_session_history
)

from services.event_service import (
    create_events_batch
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
    # PARALLEL: Dialogflow + Memory + RAG
    # =====================================

    parallel_start = time.time()

    async def _timed_rag():
        r_start = time.time()
        result = await asyncio.to_thread(
            retrieve_context, user_message
        )
        return result, round(
            (time.time() - r_start) * 1000
        )

    intent_task = asyncio.to_thread(
        detect_intent,
        session_id=session_id,
        user_message=user_message,
    )
    history_task = asyncio.to_thread(
        get_session_history, session_id
    )
    rag_task = _timed_rag()

    intent_data, history, (context, rag_latency) = (
        await asyncio.gather(
            intent_task, history_task, rag_task
        )
    )

    parallel_latency = round(
        (time.time() - parallel_start) * 1000
    )

    intent = intent_data["intent"]
    confidence = intent_data["confidence"]
    flow = intent_data["flow"]

    print(
        "\n========== PARALLEL =========="
    )
    print(f"INTENT: {intent} ({confidence:.2f})")
    print(f"FLOW: {flow}")
    print(f"HISTORY: {len(history)} messages")
    print(f"PARALLEL LATENCY: {parallel_latency} ms")
    print(f"RAG LATENCY: {rag_latency} ms")
    print(
        "==============================\n"
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
    # BATCH SAVE MESSAGES
    # =====================================

    save_messages_batch([
        {
            "session_id": session_id,
            "role": "user",
            "message": user_message,
            "intent": intent,
            "flow": flow,
            "sentiment": sentiment,
            "urgency": urgency,
            "risk_level": risk_level,
        },
        {
            "session_id": session_id,
            "role": "assistant",
            "message": ai_reply,
            "intent": intent,
            "flow": flow,
            "sentiment": sentiment,
            "urgency": urgency,
            "risk_level": risk_level,
        },
    ])

    # =====================================
    # FIRE-AND-FORGET EVENTS
    # =====================================

    async def _log_events():
        try:
            await asyncio.to_thread(
                create_events_batch,
                [
                    {
                        "session_id": session_id,
                        "event_type": "intent_detected",
                        "event_data": {
                            "intent": intent,
                            "confidence": confidence,
                            "flow": flow,
                        },
                        "source": "Dialogflow",
                    },
                    {
                        "session_id": session_id,
                        "event_type": "sentiment_detected",
                        "event_data": {
                            "sentiment": sentiment,
                            "urgency": urgency,
                            "risk_level": risk_level,
                            "requires_escalation": requires_escalation,
                            "customer_state": customer_state,
                            "business_impact": business_impact,
                        },
                        "source": "Gemini",
                    },
                    {
                        "session_id": session_id,
                        "event_type": "rag_retrieval",
                        "event_data": {
                            "query": user_message,
                            "latency_ms": rag_latency,
                        },
                        "source": "RAG",
                    },
                    {
                        "session_id": session_id,
                        "event_type": "response_generated",
                        "event_data": {
                            "flow": flow,
                            "latency_ms": gemini_latency,
                        },
                        "source": "Gemini",
                    },
                ],
            )
        except Exception as e:
            print(f"EVENT LOGGING ERROR: {e}")

    asyncio.create_task(_log_events())

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

