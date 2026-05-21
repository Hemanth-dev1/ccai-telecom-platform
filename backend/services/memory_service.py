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

    try:
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
    finally:
        db.close()


# ==========================================
# GET SESSION HISTORY
# ==========================================


# ==========================================
# SAVE MESSAGES BATCH
# ==========================================

def save_messages_batch(
    messages,
):
    """Save multiple messages in a single DB session.
    messages: list of dicts with keys:
      session_id, role, message, intent, flow, sentiment, urgency, risk_level
    """
    db: Session = SessionLocal()
    try:
        for msg in messages:
            conversation = Conversation(**msg)
            db.add(conversation)
        db.commit()
    finally:
        db.close()


# ==========================================
# GET SESSION HISTORY
# ==========================================


def get_session_history(
    session_id,
    limit=6,
):

    db: Session = SessionLocal()

    try:
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
    finally:
        db.close()

    messages.reverse()

    return messages