from typing import Dict, List

from fastapi import APIRouter

from pydantic import BaseModel

from services.analytics_service import (

    get_total_conversations,

    get_total_messages,

    get_top_intents,

    get_flow_distribution,

    get_sentiment_distribution,

    get_risk_distribution,

    get_escalation_count,

    get_customer_states,

    get_business_impact_distribution,

    get_message_timeline,

    get_escalation_timeline,

    get_hourly_volume,
)


class AnalyticsResponse(BaseModel):
    total_conversations: int
    total_messages: int
    top_intents: Dict[str, int]
    flow_distribution: Dict[str, int]
    sentiment_distribution: Dict[str, int]
    risk_distribution: Dict[str, int]
    escalations: int
    customer_states: Dict[str, int]
    business_impact: Dict[str, int]
    message_timeline: List[Dict[str, int]]
    escalation_timeline: List[Dict[str, int]]
    volume: List[Dict[str, int]]

router = APIRouter(

    prefix="/analytics",

    tags=["analytics"]
)


@router.get("/", response_model=AnalyticsResponse)
async def analytics_dashboard():

    return {

        "total_conversations":
            get_total_conversations(),

        "total_messages":
            get_total_messages(),

        "top_intents":
            get_top_intents(),

        "flow_distribution":
            get_flow_distribution(),

        "sentiment_distribution":
            get_sentiment_distribution(),

        "risk_distribution":
            get_risk_distribution(),

        "escalations":
            get_escalation_count(),

        "customer_states":
            get_customer_states(),

        "business_impact":
            get_business_impact_distribution(),

        "message_timeline":
            get_message_timeline(),

        "escalation_timeline":
            get_escalation_timeline(),

        "volume":
            get_hourly_volume(),
    }