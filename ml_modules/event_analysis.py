import google.generativeai as genai
import pandas as pd
import numpy as np
import os
import matplotlib.pyplot as plt
import seaborn as sns
from textblob import TextBlob
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from flask import Flask, request, jsonify
from flask_cors import CORS

# Gemini API Key Configuration
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = Flask(__name__)
CORS(app)

# AI-driven Insights Generation
def generate_insights(average_attendees, budget_utilization, task_completion):
    """
    Generate AI-driven insights using Google Gemini Pro.
    """
    prompt = f"""
    Analyze the event performance based on the following:
    - Total Attendees: {average_attendees}
    - Budget Utilization: {budget_utilization}%
    - Task Completion Rate: {task_completion}%

    Provide exactly three key insights in a clean format:
    - Each insight should start with a single bullet point (•) followed by a concise statement.
    - No asterisks (***) or extra formatting.
    - Keep insights short and actionable.
    """

    model = genai.GenerativeModel("gemini-1.5-pro")
    response = model.generate_content(prompt)

    # Process response to remove unwanted characters
    raw_insights = [line.strip() for line in response.text.split("\n") if line.strip()]
    
    # Ensure insights start with a clean bullet point
    insights = [f"• {line.lstrip('*-•')}" for line in raw_insights[:3]]

    return insights

@app.route("/generate_insights", methods=["POST"])
def generate_insights_from_request():
    """
    API endpoint to generate AI-driven insights from request data.
    """
    try:
        data = request.json
        average_attendees = data.get("average_attendees", 0)
        budget_utilization = data.get("budget_utilization", 0)
        task_completion = data.get("task_completion", 0)
        
        insights = generate_insights(average_attendees, budget_utilization, task_completion)
        return jsonify({"insights": insights})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Sentiment Analyzer
analyzer = SentimentIntensityAnalyzer()
@app.route('/analyze_feedback', methods=['POST'])
def analyze_feedback():
    """Analyze sentiment from user feedback."""
    data = request.json
    feedback_list = data.get("feedback", [])

    results = []
    for feedback in feedback_list:
        analysis = TextBlob(feedback)
        compound_score = analyzer.polarity_scores(feedback)['compound']
        
        if compound_score >= 0.05:
            sentiment = "Positive"
        elif compound_score <= -0.05:
            sentiment = "Negative"
        else:
            sentiment = "Neutral"

        results.append({"feedback": feedback, "sentiment": sentiment})

    return jsonify({"feedback_analysis": results})


# AI generated event summary using Gemini API
@app.route('/generate_event_summary', methods=['POST'])
def generate_summary():
    """Generate an AI-driven summary of an event."""
    try:
        data = request.json
        event_name = data.get("event_name", "Unnamed Event")
        event_date = data.get("event_date", "Unknown Date")
        event_location = data.get("event_location", "Unknown Location")

        # Prompt for the AI model
        prompt = f"""
        Provide a detailed and engaging summary of the event '{event_name}' 
        that took place on {event_date} at {event_location}.
        Highlight the key moments, attendee experience, major activities, and overall success.
        """

        model = genai.GenerativeModel("gemini-1.5-pro") 
        response = model.generate_content(prompt)

        return jsonify({"summary": response.text.strip()})
    
    except Exception as e:
        return jsonify({"error": f"Failed to generate summary: {str(e)}"}), 500
    
if __name__ == '__main__':
    app.run(port=5005, debug=True)
