from fastapi import APIRouter

from sqlalchemy.orm import Session

from database.db import SessionLocal

from database.conversation_model import (
    Conversation
)

router = APIRouter(
    prefix="/agent-desk",
    tags=["Agent Desk"]
)


# ==========================================
# GET ESCALATION QUEUE
# ==========================================

@router.get("/escalations")
async def get_escalations():

    db: Session = SessionLocal()

    conversations = (

        db.query(Conversation)

        .filter(
            Conversation.role == "user"
        )

        .filter(
            Conversation.risk_level != None
        )

        .order_by(
            Conversation.created_at.desc()
        )

        .limit(25)

        .all()
    )

    queue = []

    for convo in conversations:

        requires_escalation = (

            convo.sentiment == "angry"

            or convo.urgency == "high"

            or convo.risk_level == "high"
        )

        if not requires_escalation:
            continue

        queue.append({

            "id":
                convo.id,

            "session_id":
                convo.session_id,

            "customer":
                convo.session_id,

            "intent":
                convo.intent,

            "sentiment":
                convo.sentiment,

            "urgency":
                convo.urgency,

            "risk_level":
                convo.risk_level,

            "confidence":
                0.91,

            "wait_time":
                "2m",

            "message":
                convo.message,
        })

    db.close()

    return {

        "queue":
            queue,

        "total":
            len(queue),
    }