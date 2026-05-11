import uuid


def create_ticket(user_issue):

    ticket_id = str(uuid.uuid4())[:8]

    return {
        "ticket_id": ticket_id,
        "issue": user_issue,
        "status": "OPEN"
    }