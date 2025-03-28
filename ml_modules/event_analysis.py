import google.generativeai as genai
import pandas as pd
import numpy as np
import os
import json
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
def generate_insights(attendees, budget_utilization, task_completion):
    """
    Generate AI-driven insights using Google Gemini Pro.
    """
    prompt = f"""
    Analyze the event performance based on the following:
    - Total Attendees: {attendees}
    - Budget Utilization: {budget_utilization}%
    - Task Completion Rate: {task_completion}%

    Provide 3 key insights in bullet points that can help improve event planning.
    """

    model = genai.GenerativeModel("gemini-1.5-pro")
    response = model.generate_content(prompt)
    insights = response.text.split("\n")[:3] 
    return insights

@app.route("/generate_insights", methods=["GET"])
def generate_insights_from_file():
    """
    API endpoint to generate AI-driven insights from analytics_data.json.
    """
    try:
        # Load analytics data from the JSON file
        with open("analytics_data.json", "r") as file:
            analytics_data = json.load(file)

        # Extract required values
        attendees = analytics_data.get("total_attendees", 0)
        budget_utilization = analytics_data.get("budget_utilization", 0)
        task_completion = analytics_data.get("task_completion", 0)

        # Generate AI insights
        insights = generate_insights(attendees, budget_utilization, task_completion)

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

# AI generated event summary using gemini API
@app.route('/generate_event_summary', methods=['POST'])
def generate_summary():
    """Generate an AI-driven summary of an event."""
    try:
        data = request.json
        event_name = data.get("event_name", "TechFest 2025")

        prompt = f"Summarize the key highlights of {event_name} in an engaging and detailed way."
        model = genai.GenerativeModel("gemini-1.5-pro") 
        response = model.generate_content(prompt)

        return jsonify({"summary": response.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
if __name__ == '__main__':
    app.run(port=5005, debug=True)
