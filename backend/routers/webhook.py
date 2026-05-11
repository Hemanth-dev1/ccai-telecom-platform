import time

from fastapi import APIRouter, Request

from rag.retriever import (
    retrieve_context
)

from services.gemini_service import (
    generate_rag_response,
    generate_ticket_summary
)

from services.ticket_service import (
    create_ticket
)

from services.memory_service import (
    save_message,
    get_session_history
)

from services.event_service import (
    create_event
)

router = APIRouter(
    prefix="/webhook",
    tags=["webhook"]
)


# ============================================
# DIALOGFLOW RESPONSE FORMATTER
# ============================================

def build_df_response(text):

    return {
        "fulfillment_response": {
            "messages": [
                {
                    "text": {
                        "text": [text]
                    }
                }
            ]
        }
    }


# ============================================
# GENERIC RAG SUPPORT FLOW
# ============================================

def execute_rag_support_flow(

    session_id,
    user_message,
    tag,
    flow_name,

):

    print(
        f"\nEXECUTING FLOW: {flow_name}\n"
    )

    # =====================================
    # LOAD SESSION HISTORY
    # =====================================

    history = get_session_history(
        session_id
    )

    print(
        f"\nHISTORY LOADED: {len(history)} messages\n"
    )

    create_event(

        session_id=session_id,

        event_type="memory_loaded",

        event_data={
            "history_messages":
                len(history)
        },

        source="MemoryService",
    )

    # =====================================
    # SAVE USER MESSAGE
    # =====================================

    print(
        "\nSAVING USER MESSAGE\n"
    )

    save_message(

        session_id=session_id,

        role="user",

        message=user_message,

        intent=tag,

        flow=flow_name,
    )

    # =====================================
    # RAG CONTEXT
    # =====================================

    print(
        "\nRUNNING RAG RETRIEVAL\n"
    )

    context = retrieve_context(
        user_message
    )

    print(
        f"\nCONTEXT RETRIEVED:\n{context[:180]}\n"
    )

    create_event(

        session_id=session_id,

        event_type="rag_retrieval",

        event_data={

            "query":
                user_message,

            "context_preview":
                context[:120],
        },

        source="RAG",
    )

    # =====================================
    # GEMINI RESPONSE
    # =====================================

    print(
        "\nGENERATING GEMINI RESPONSE\n"
    )

    rag_start = time.time()

    ai_response = (
        generate_rag_response(

            user_message,

            context,

            history,
        )
    )

    rag_latency = round(
        (time.time() - rag_start)
        * 1000
    )

    print(
        f"\nGEMINI LATENCY: {rag_latency} ms\n"
    )

    create_event(

        session_id=session_id,

        event_type="response_generated",

        event_data={

            "latency_ms":
                rag_latency,

            "flow":
                flow_name,
        },

        source="Gemini",
    )

    # =====================================
    # SAVE AI RESPONSE
    # =====================================

    print(
        "\nSAVING AI RESPONSE\n"
    )

    save_message(

        session_id=session_id,

        role="assistant",

        message=ai_response,

        intent=tag,

        flow=flow_name,
    )

    return ai_response


# ============================================
# WEBHOOK
# ============================================

@router.post("/dialogflow")
async def dialogflow_webhook(
    request: Request
):

    overall_start = time.time()

    try:

        print(
            "\n========== WEBHOOK HIT =========="
        )

        body = await request.json()

        print(
            "\n========== RAW WEBHOOK BODY =========="
        )

        print(body)

        print(
            "======================================\n"
        )

        # =====================================
        # SESSION
        # =====================================

        session_id = (

            body.get(
                "sessionInfo",
                {}
            )

            .get(
                "session",
                "unknown"
            )
        )

        print(
            f"\nSESSION ID: {session_id}\n"
        )

        # =====================================
        # USER MESSAGE
        # =====================================

        user_message = ""

        # Method 1

        if not user_message:

            user_message = body.get(
                "text",
                ""
            )

        # Method 2

        if not user_message:

            user_message = (

                body.get(
                    "textInput",
                    {}
                )

                .get(
                    "text",
                    ""
                )
            )

        # Method 3

        if not user_message:

            user_message = body.get(
                "transcript",
                ""
            )

        # Method 4

        if not user_message:

            try:

                user_message = (

                    body["payload"]["text"]
                )

            except:

                pass

        print(
            f"\nUSER MESSAGE: {user_message}\n"
        )

        # =====================================
        # TAG
        # =====================================

        tag = (

            body.get(
                "fulfillmentInfo",
                {}
            )

            .get(
                "tag",
                ""
            )
        )

        print(
            f"\nTAG RECEIVED: {tag}\n"
        )

        # =====================================
        # BILLING FLOW
        # =====================================

        if tag == "billing_support":

            print(
                "\nENTERED BILLING FLOW\n"
            )

            create_event(

                session_id=session_id,

                event_type="intent_detected",

                event_data={

                    "intent":
                        tag,

                    "flow":
                        "Billing Flow",
                },

                source="Dialogflow",
            )

            ai_response = (
                execute_rag_support_flow(

                    session_id=
                        session_id,

                    user_message=
                        user_message,

                    tag=
                        tag,

                    flow_name=
                        "Billing Flow",
                )
            )

            return build_df_response(
                ai_response
            )

        # =====================================
        # NETWORK FLOW
        # =====================================

        if tag == "network_support":

            print(
                "\nENTERED NETWORK FLOW\n"
            )

            ai_response = (
                execute_rag_support_flow(

                    session_id=
                        session_id,

                    user_message=
                        user_message,

                    tag=
                        tag,

                    flow_name=
                        "Network Flow",
                )
            )

            return build_df_response(
                ai_response
            )

        # =====================================
        # RECHARGE FLOW
        # =====================================

        if tag == "recharge_support":

            print(
                "\nENTERED RECHARGE FLOW\n"
            )

            ai_response = (
                execute_rag_support_flow(

                    session_id=
                        session_id,

                    user_message=
                        user_message,

                    tag=
                        tag,

                    flow_name=
                        "Recharge Flow",
                )
            )

            return build_df_response(
                ai_response
            )

        # =====================================
        # ESCALATION FLOW
        # =====================================

        if tag == "escalation_support":

            print(
                "\nENTERED ESCALATION FLOW\n"
            )

            ticket = create_ticket(
                user_message
            )

            summary = (
                generate_ticket_summary(
                    user_message
                )
            )

            response_text = f"""
Your issue has been escalated.

Ticket ID:
{ticket['ticket_id']}

Summary:
{summary}
"""

            return build_df_response(
                response_text
            )

        # =====================================
        # DEFAULT
        # =====================================

        print(
            "\nDEFAULT FALLBACK EXECUTED\n"
        )

        return build_df_response(
            "Webhook executed successfully."
        )

    except Exception as e:

        print(
            "\n========== WEBHOOK ERROR =========="
        )

        print(str(e))

        print(
            "===================================\n"
        )

        return {
    "fulfillment_response": {
        "messages": [
            {
                "text": {
                    "text": [
                        "STATIC TEST RESPONSE"
                    ]
                }
            }
        ]
    }
}