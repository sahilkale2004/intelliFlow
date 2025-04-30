from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import json
from sklearn.neighbors import NearestNeighbors

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
    app.run(port=5001, debug=True)