from dotenv import load_dotenv

import os

import google.cloud.dialogflowcx_v3 as dialogflowcx


# ==========================================
# LOAD ENV
# ==========================================

load_dotenv()


PROJECT_ID = os.getenv(
    "PROJECT_ID"
)

LOCATION_ID = os.getenv(
    "LOCATION_ID"
)

AGENT_ID = os.getenv(
    "AGENT_ID"
)


print(
    f"\nPROJECT_ID: {PROJECT_ID}"
)

print(
    f"LOCATION_ID: {LOCATION_ID}"
)

print(
    f"AGENT_ID: {AGENT_ID}\n"
)


# ==========================================
# DETECT INTENT
# ==========================================

def detect_intent(

    session_id: str,

    user_message: str,
):

    try:

        client_options = {

            "api_endpoint":
                f"{LOCATION_ID}-dialogflow.googleapis.com:443"
        }

        client = (
            dialogflowcx.SessionsClient(

                client_options=
                    client_options
            )
        )

        session_path = (
            client.session_path(

                PROJECT_ID,

                LOCATION_ID,

                AGENT_ID,

                session_id,
            )
        )

        text_input = (
            dialogflowcx.TextInput(
                text=user_message
            )
        )

        query_input = (
            dialogflowcx.QueryInput(

                text=text_input,

                language_code="en",
            )
        )

        request = (
            dialogflowcx.DetectIntentRequest(

                session=session_path,

                query_input=query_input,
            )
        )

        response = (
            client.detect_intent(
                request=request
            )
        )

        query_result = (
            response.query_result
        )

        # ==================================
        # DEFAULTS
        # ==================================

        intent = "unknown"

        confidence = 0.0

        flow = "Unknown Flow"

        # ==================================
        # INTENT
        # ==================================

        if query_result.intent:

            intent = (
                query_result
                .intent
                .display_name
            )

        # ==================================
        # CONFIDENCE
        # ==================================

        confidence = (
            query_result
            .intent_detection_confidence
        )

        # ==================================
        # FLOW
        # ==================================

        if query_result.current_flow:

            flow = (
                query_result
                .current_flow
                .display_name
            )

        print(
            "\n========== CX DETECTION =========="
        )

        print({

            "intent":
                intent,

            "confidence":
                confidence,

            "flow":
                flow,
        })

        print(
            "==================================\n"
        )

        return {

            "intent":
                intent,

            "confidence":
                confidence,

            "flow":
                flow,
        }

    except Exception as e:

        print(
            f"\nDIALOGFLOW ERROR: {e}\n"
        )

        return {

            "intent":
                "fallback",

            "confidence":
                0.0,

            "flow":
                "Fallback Flow",
        }