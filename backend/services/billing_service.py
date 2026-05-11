import json

def get_bill_details():

    with open("data/mock_bills.json", "r") as file:
        data = json.load(file)

    return data[0]