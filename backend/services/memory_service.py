from sqlalchemy.orm import Session

from database.db import SessionLocal

from database.conversation_model import Conversation


# ==========================================
# SAVE MESSAGE
# ==========================================

def save_message(

    session_id,

    role,

    message,

    intent=None,

    flow=None,

    sentiment=None,

    urgency=None,

    risk_level=None,
):

    db: Session = SessionLocal()

    conversation = Conversation(

        session_id=session_id,

        role=role,

        message=message,

        intent=intent,

        flow=flow,

        sentiment=sentiment,

        urgency=urgency,

        risk_level=risk_level,
    )

    db.add(conversation)

    db.commit()

    db.close()


# ==========================================
# GET SESSION HISTORY
# ==========================================


def get_session_history(
    session_id,
    limit=6,
):

    db: Session = SessionLocal()

    messages = (
        db.query(Conversation)
        .filter(
            Conversation.session_id
            == session_id
        )
        .order_by(
            Conversation.created_at.desc()
        )
        .limit(limit)
        .all()
    )

    db.close()

    messages.reverse()

    return messages