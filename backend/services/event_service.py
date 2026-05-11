import json

from sqlalchemy.orm import Session

from database.db import SessionLocal

from database.event_model import (
    Event
)


# ==========================================
# CREATE EVENT
# ==========================================

def create_event(

    session_id: str,

    event_type: str,

    event_data: dict,

    source: str,
):

    db: Session = SessionLocal()

    event = Event(

        session_id=session_id,

        event_type=event_type,

        event_data=json.dumps(event_data),

        source=source,
    )

    db.add(event)

    db.commit()

    db.refresh(event)

    db.close()

    return event