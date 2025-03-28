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

# Engagement Analysis Function
def analyze_engagement(data):
    """Analyze event engagement metrics."""
    df = pd.DataFrame(data)

    avg_attendance = df['attendance'].mean()
    popular_session = df['session'].value_counts().idxmax()

    return {
        "average_attendance": avg_attendance,
        "most_popular_session": popular_session
    }

@app.route('/analyze_engagement', methods=['POST'])
def engagement_metrics():
    """API route to analyze event engagement."""
    data = request.json.get("event_data", [])
    result = analyze_engagement(data)
    return jsonify(result)

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
