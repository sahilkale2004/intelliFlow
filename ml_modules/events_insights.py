import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import os

app = Flask(__name__)
CORS(app)

# Gemini API Key Configuration
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["event_db"]
collection = db["event_details"]

@app.route("/event-insights", methods=["GET"])
def generate_insights():
    events = list(collection.find({}, {"_id": 0}))

    predictions = []
    for event in events:
        prompt = f"""
        Given the event details:
        - Name: {event['event_name']}
        - Type: {event['event_type']}
        - Past Attendance: {event['past_attendance']}
        - Marketing Channels Used: {event['marketing_channels']}
        - Feedback Score: {event['feedback_score']}
        
        Predict:
        1. Expected attendance
        2. Best marketing strategies
        3. Resource optimization recommendations
        """

        response = genai.GenerativeModel("gemini-pro").generate_content(prompt)
        insight = response.text  

        predictions.append({
            "event_name": event["event_name"],
            "insight": insight
        })

    return jsonify(predictions)

if __name__ == "__main__":
    app.run(debug=True)
