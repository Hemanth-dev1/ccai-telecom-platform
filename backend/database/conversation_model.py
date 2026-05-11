from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Text
from sqlalchemy import DateTime

from datetime import datetime

from database.db import Base


class Conversation(Base):

    __tablename__ = "conversations"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    session_id = Column(
        String,
        index=True
    )

    role = Column(String)

    message = Column(Text)

    intent = Column(String)

    flow = Column(String)

    sentiment = Column(String)

    urgency = Column(String)

    risk_level = Column(String)

    created_at = Column(
    DateTime,
    default=datetime.utcnow,
    index=True
)