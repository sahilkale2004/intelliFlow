import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import json
import os
from sklearn.neighbors import NearestNeighbors
from textblob import TextBlob

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Load the sponsors data
with open("sponsors_data.json", "r") as file:
    data = json.load(file)
df = pd.DataFrame(data)

df = df.explode("Previous Events Supported")
df['Event Type'] = df['Previous Events Supported'].astype('category').cat.codes
df['Sponsor ID'] = df['Sponsor ID'].astype('category').cat.codes

# Train Nearest Neighbors Model
X = df[['Event Type']]
model = NearestNeighbors(n_neighbors=3, metric='euclidean')
model.fit(X)

# Start Flask app
app = Flask(__name__)
CORS(app)

# AI Content Generation API
@app.route('/generate_content', methods=['POST'])
def generate_content():
    data = request.json
    event_name = data.get("event_name", "TechFest 2025")
    event_details = data.get("event_details", "A hackathon with amazing prizes!")
    
    prompt = f"Generate an engaging social media post and email to promote {event_name}. Details: {event_details}"
    model = genai.GenerativeModel("gemini-1.5-pro")
    response = model.generate_content(prompt)
    
    return jsonify({"content": response.text})

# Sentiment Analysis API
@app.route('/analyze_sentiment', methods=['POST'])
def analyze_sentiment():
    data = request.json
    comments = data.get("comments", [])
    sentiments = []
    
    for comment in comments:
        analysis = TextBlob(comment)
        polarity = analysis.sentiment.polarity
        sentiment = "Positive" if polarity > 0 else "Negative" if polarity < 0 else "Neutral"
        sentiments.append({"comment": comment, "sentiment": sentiment})

    return jsonify({"sentiments": sentiments})

# Sponsor Recommendation API
@app.route('/recommend_sponsors', methods=['POST'])
def recommend_sponsors():
    try:
        data = request.json
        event_type = data.get('event_type')

        if not event_type:
            return jsonify({"error": "Event type is required"}), 400

        # Normalize event_type to lowercase for comparison
        event_type = event_type.strip().lower()

        # Find the event code
        event_code = df[df['Previous Events Supported'].str.lower() == event_type]['Event Type'].unique()

        if len(event_code) == 0:
            return jsonify({"error": "Event type not found"}), 404

        input_data = pd.DataFrame([[event_code[0]]], columns=["Event Type"])
        distances, indices = model.kneighbors(input_data)

        # Get recommended sponsors
        recommended_sponsors = df.iloc[indices[0]][['Sponsor Name', 'Industry', 'Sponsorship Type', 'Average Sponsorship Amount (USD)']].to_dict(orient='records')

        # Rename keys for frontend compatibility
        formatted_sponsors = [
            {
                "name": sponsor['Sponsor Name'],
                "industry": sponsor['Industry'],
                "sponsorship_type": sponsor['Sponsorship Type'],
                "average_sponsorship_amount": sponsor['Average Sponsorship Amount (USD)']
            }
            for sponsor in recommended_sponsors
        ]

        return jsonify({"sponsors": formatted_sponsors})

    except Exception as e:
        print(f"Error in recommend_sponsors: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)