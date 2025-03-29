from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import json

app = Flask(__name__)
CORS(app)

# Load the corrected JSON file
def load_speakers_judges():
    try:
        with open('speakers_judges.json', 'r', encoding='utf-8') as file:
            data = json.load(file)
        
        # Convert to DataFrame
        df = pd.DataFrame(data)
        
        # Ensure required columns exist
        required_fields = {"Name", "Role", "Expertise", "Experience", "budget", "Rating"}
        missing_fields = required_fields - set(df.columns)
        
        if missing_fields:
            print(f"Missing fields: {missing_fields}")
            return pd.DataFrame()  # Return empty DataFrame if fields are missing
        
        # Convert budget to float
        df["budget"] = pd.to_numeric(df["budget"], errors="coerce")
    except Exception as e:
        print(f"Error loading speakers and judges data: {e}")
        return pd.DataFrame()  # Return empty DataFrame in case of an error       

# Load data at startup
df_speakers_judges = load_speakers_judges()

@app.route('/recommend_speakers', methods=['POST'])
def recommend():
    try:
        data = request.json
        expertise = data.get("expertise")
        budget = float(data.get("budget", 0))  # Ensure budget is numeric
        
        if expertise is None or budget == 0:
            return jsonify({"error": "JSON data is missing required fields", "recommendations": []}), 400

        # Filter speakers/judges based on expertise and budget
        recommendations = df_speakers_judges[
            (df_speakers_judges["Expertise"].str.contains(expertise, case=False, na=False)) & 
            (df_speakers_judges["budget"] <= budget)
        ].sort_values(by="Rating", ascending=False)

        if recommendations.empty:
            return jsonify({"message": "No matching recommendations found", "recommendations": []})
        
        return jsonify({"recommendations": recommendations.to_dict(orient="records")})
    
    except Exception as e:
        return jsonify({"error": str(e), "recommendations": []}), 500
    
@app.route("/predict_budget", methods=["POST"])
def predict_budget():
    with open("budget_data.json", "r") as file:
        past_budgets = json.load(file)

    avg_budget = {
        "venue_cost": sum(d["venue_cost"] for d in past_budgets) / len(past_budgets),
        "marketing": sum(d["marketing"] for d in past_budgets) / len(past_budgets),
        "speakers": sum(d["speakers"] for d in past_budgets) / len(past_budgets),
        "misc": sum(d["misc"] for d in past_budgets) / len(past_budgets),
    }

    return jsonify({"optimized_budget": avg_budget})    

if __name__ == '__main__':
    app.run(port=5005, debug=True)
