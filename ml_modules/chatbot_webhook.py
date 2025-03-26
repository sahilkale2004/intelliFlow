from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/webhook', methods=['POST'])
def webhook():
    req = request.get_json()
    intent = req['queryResult']['intent']['displayName']

    response_text = ""

    if intent == "Event_Schedule":
        response_text = "The event is scheduled for March 30, 2025, at 10:00 AM."

    elif intent == "Event_Location":
        response_text = "The event will take place at ABC Auditorium, XYZ University."

    elif intent == "Event_Ticketing":
        response_text = "You can register for the event at: www.eventregister.com"

    return jsonify({"fulfillmentText": response_text})

if __name__ == '__main__':
    app.run(port=5000, debug=True)