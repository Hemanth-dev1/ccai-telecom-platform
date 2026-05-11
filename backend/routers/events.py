import json

from fastapi import APIRouter

from sqlalchemy.orm import Session

from database.db import SessionLocal

from database.event_model import Event


router = APIRouter(
    prefix="/events",
    tags=["events"]
)


# ==========================================
# GET EVENTS BY SESSION
# ==========================================

@router.get("/{session_id}")
async def get_events(
    session_id: str
):

    db: Session = SessionLocal()

    events = (

        db.query(Event)

        .filter(
            Event.session_id == session_id
        )

        .order_by(
            Event.created_at.asc()
        )

        .all()
    )

    db.close()

    return [

        {

            "id":
                event.id,

            "session_id":
                event.session_id,

            "event_type":
                event.event_type,

            "event_data":
                json.loads(
                    event.event_data
                )
                if event.event_data
                else None,

            "source":
                event.source,

            "created_at":
                event.created_at,
        }

        for event in events
    ]