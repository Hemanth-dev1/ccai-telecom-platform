from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Text
from sqlalchemy import DateTime

from datetime import datetime

from database.db import Base


class Event(Base):

    __tablename__ = "events"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    session_id = Column(
        String,
        index=True
    )

    event_type = Column(
        String,
        index=True
    )

    source = Column(
        String,
        default="system"
    )

    event_data = Column(
        Text
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        index=True
    )