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
    try:
        event = Event(

            session_id=session_id,

            event_type=event_type,

            event_data=json.dumps(event_data),

            source=source,
        )

        db.add(event)

        db.commit()

        db.refresh(event)
    finally:
        db.close()

    return event


# ==========================================
# CREATE EVENTS BATCH
# ==========================================

def create_events_batch(
    events,
):
    """Create multiple events in a single DB session.
    events: list of dicts with keys:
      session_id, event_type, event_data (dict), source
    """
    db: Session = SessionLocal()
    try:
        for evt in events:
            event = Event(
                session_id=evt["session_id"],
                event_type=evt["event_type"],
                event_data=json.dumps(evt["event_data"]),
                source=evt["source"],
            )
            db.add(event)
        db.commit()
    finally:
        db.close()