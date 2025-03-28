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

# Train Model
X = df[['Event Type']]
model = NearestNeighbors(n_neighbors=3, metric='euclidean')
model.fit(X)

# Start the flask app
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
    """Recommend sponsors based on event type."""
    data = request.json
    event_type = data['event_type']
    
# event type to numerical encoding
    event_code = df[df['Previous Events Supported'] == event_type]['Event Type'].unique()
    
    if len(event_code) == 0:
        return jsonify({"error": "Event type not found"}), 400

    input_data = np.array([[event_code[0]]])
    distances, indices = model.kneighbors(input_data)

    recommended_sponsors = df.iloc[indices[0]]['Sponsor Name'].tolist()
    return jsonify({"recommended_sponsors": recommended_sponsors})

if __name__ == '__main__':
    app.run(port=5002, debug=True)
