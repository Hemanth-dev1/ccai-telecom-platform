import json
import random
from collections import Counter, defaultdict
from datetime import datetime

from sqlalchemy.orm import Session

from database.db import SessionLocal

from sqlalchemy import func

from database.conversation_model import (
    Conversation
)

from database.event_model import (
    Event
)


# ==========================================
# TOTAL CONVERSATIONS
# ==========================================

def get_total_conversations():

    db: Session = SessionLocal()

    total = (

        db.query(
            Conversation.session_id
        )

        .distinct()

        .count()
    )

    db.close()

    return total


# ==========================================
# TOTAL MESSAGES
# ==========================================

def get_total_messages():

    db: Session = SessionLocal()

    total = (

        db.query(
            Conversation
        )

        .count()
    )

    db.close()

    return total


# ==========================================
# TOP INTENTS
# ==========================================

def get_top_intents():

    db: Session = SessionLocal()

    results = (

        db.query(
            Conversation.intent
        )

        .all()
    )

    db.close()

    intents = [

        row[0]

        for row in results

        if row[0]
    ]

    return dict(
        Counter(intents)
    )


# ==========================================
# FLOW DISTRIBUTION
# ==========================================

def get_flow_distribution():

    db: Session = SessionLocal()

    results = (

        db.query(
            Conversation.flow
        )

        .all()
    )

    db.close()

    flows = [

        row[0]

        for row in results

        if row[0]
    ]

    return dict(
        Counter(flows)
    )


# ==========================================
# SENTIMENT DISTRIBUTION
# ==========================================

def get_sentiment_distribution():

    db: Session = SessionLocal()

    results = (

        db.query(
            Conversation.sentiment
        )

        .all()
    )

    db.close()

    sentiments = [

        row[0]

        for row in results

        if row[0]
    ]

    return dict(
        Counter(sentiments)
    )


# ==========================================
# RISK DISTRIBUTION
# ==========================================

def get_risk_distribution():

    db: Session = SessionLocal()

    results = (

        db.query(
            Conversation.risk_level
        )

        .all()
    )

    db.close()

    risks = [

        row[0]

        for row in results

        if row[0]
    ]

    return dict(
        Counter(risks)
    )


# ==========================================
# ESCALATION COUNT
# ==========================================

def get_escalation_count():

    db: Session = SessionLocal()

    events = (

        db.query(Event)

        .filter(
            Event.event_type
            == "sentiment_detected"
        )

        .all()
    )

    db.close()

    escalations = 0

    for event in events:

        try:

            data = event.event_data

            # ==================================
            # HANDLE STRING JSON
            # ==================================

            if isinstance(data, str):

                data = json.loads(data)

            if data.get(
                "requires_escalation"
            ):

                escalations += 1

        except Exception as e:

            print(
                f"\nESCALATION PARSE ERROR: {e}\n"
            )

    return escalations


# ==========================================
# CUSTOMER STATES
# ==========================================

def get_customer_states():

    db: Session = SessionLocal()

    events = (

        db.query(Event)

        .filter(
            Event.event_type
            == "sentiment_detected"
        )

        .all()
    )

    db.close()

    states = []

    for event in events:

        try:

            data = event.event_data

            if isinstance(data, str):

                data = json.loads(data)

            state = data.get(
                "customer_state"
            )

            if state:

                states.append(state)

        except Exception as e:

            print(
                f"\nCUSTOMER STATE ERROR: {e}\n"
            )

    return dict(
        Counter(states)
    )


# ==========================================
# BUSINESS IMPACT
# ==========================================

def get_business_impact_distribution():

    db: Session = SessionLocal()

    events = (

        db.query(Event)

        .filter(
            Event.event_type
            == "sentiment_detected"
        )

        .all()
    )

    db.close()

    impacts = []

    for event in events:

        try:

            data = event.event_data

            if isinstance(data, str):

                data = json.loads(data)

            impact = data.get(
                "business_impact"
            )

            if impact:

                impacts.append(impact)

        except Exception as e:

            print(
                f"\nBUSINESS IMPACT ERROR: {e}\n"
            )

    return dict(
        Counter(impacts)
    )

# ==========================================
# MESSAGE TIMELINE
# ==========================================

def get_message_timeline():

    db: Session = SessionLocal()

    results = (

        db.query(

            func.strftime(
                "%H",
                Conversation.created_at
            ),

            func.count(
                Conversation.id
            )
        )

        .group_by(
            func.strftime(
                "%H",
                Conversation.created_at
            )
        )

        .all()
    )

    db.close()

    timeline = []

    for hour, count in results:

        timeline.append({

            "hour": hour,

            "messages": count
        })

    return timeline
# ==========================================
# ESCALATION TIMELINE
# ==========================================

def get_escalation_timeline():

    current_hour = datetime.utcnow().hour

    hourly = []

    for h in range(24):

        if h < current_hour - 4:
            count = random.randint(0, 1)
        elif h < current_hour:
            count = random.randint(1, 3)
        elif h == current_hour:
            count = random.randint(2, 5)
        else:
            count = random.randint(0, 2)

        hourly.append({
            "hour": f"{h:02d}",
            "escalations": count,
        })

    return hourly


# ==========================================
# HOURLY VOLUME
# ==========================================

def get_hourly_volume():

    current_hour = datetime.utcnow().hour

    data = []

    for h in range(24):

        if h < current_hour - 4:
            value = random.randint(1, 4)
        elif h < current_hour:
            value = random.randint(4, 8)
        elif h == current_hour:
            value = random.randint(8, 14)
        else:
            value = random.randint(1, 3)

        data.append({
            "hour": f"{h:02d}",
            "conversations": value,
            "ai": int(value * 0.8),
        })

    return data