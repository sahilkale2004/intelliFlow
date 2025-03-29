import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Gemini API Key Configuration
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Connect to MongoDB
MONGODB_URI = os.getenv("MONGODB_URI")
client = MongoClient(MONGODB_URI)
db = client["EVENT_MANAGER"]
collection = db["event_details"]

@app.route("/event-insights", methods=["GET"])
def generate_insights():
    events = list(collection.find({}, {"_id": 0}))
    
    # Sort events by date and get the next 4 upcoming events
    events.sort(key=lambda x: datetime.strptime(x["date"], "%Y-%m-%d"))
    upcoming_events = events[:4]
    
    predictions = []
    for event in upcoming_events:
        prompt = f"""
        Given the event details:
        - Title: {event['title']}
        - Date: {event['date']}
        - Location: {event['location']}
        - Expected Attendees: {event['attendees']}
        - Duration: {event['duration']} hours
        - Status: {event['status']}
        
        Provide a one-line insight predicting estimated final attendance, best marketing strategy, or resource allocation.
        """
        try:
            model = genai.GenerativeModel("gemini-2.0-flash")
            response = model.generate_content(prompt)
            insight = response.text.strip().split("\n")[0]  
            predictions.append({
                "title": event["title"],
                "insight": insight
            })

        except Exception as e:
            print(f"Error generating insight for {event['title']}: {e}")
            predictions.append({
                "title": event["title"],
                "insight": "Could not generate insights due to an API error."
            })

    return jsonify(predictions)

if __name__ == "__main__":
    app.run(debug=True)
