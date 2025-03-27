import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.neighbors import NearestNeighbors
from textblob import TextBlob

genai.configure(api_key="AIzaSyAvRPZtY-2z2cdHh6tkvHYpDIJrkhb13tY")

df = pd.read_csv("sponsors_data.csv")

df['Event Type'] = df['Event Type'].astype('category').cat.codes
df['Sponsor'] = df['Sponsor'].astype('category').cat.codes

# Train Model
X = df[['Event Type']]
model = NearestNeighbors(n_neighbors=3, metric='euclidean')
model.fit(X)

app = Flask(__name__)
CORS(app)

# AI-Generated Marketing Content
@app.route('/generate_content', methods=['POST'])
def generate_content():
    data = request.json
    event_name = data.get("event_name", "TechFest 2025")
    event_details = data.get("event_details", "A hackathon with amazing prizes!")
    
    prompt = f"Generate an engaging social media post and email to promote {event_name}. Details: {event_details}"
    model = genai.GenerativeModel("gemini-pro")  
    response = model.generate_content(prompt)
    
    return jsonify({"content": response.text})

# Sentiment Analysis
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

# Sponsor Recommendation
@app.route('/recommend_sponsors', methods=['POST'])
def recommend_sponsors():
    data = request.json
    event_type = data['event_type']
    input_data = np.array([[event_type]])
    distances, indices = model.kneighbors(input_data)
    recommended_sponsors = df.iloc[indices[0]]['Sponsor'].tolist()
    return jsonify({"sponsors": recommended_sponsors})

if __name__ == '__main__':
    app.run(port=5002, debug=True)
