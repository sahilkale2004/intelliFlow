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

        df = pd.DataFrame(data)

        # Ensure required columns exist
        required_fields = {"Name", "Role", "Expertise", "Experience", "budget", "Rating"}
        missing_fields = required_fields - set(df.columns)

        if missing_fields:
            return pd.DataFrame()  # Return empty DataFrame if fields are missing

        # Convert budget and rating to numeric
        df["budget"] = pd.to_numeric(df["budget"], errors="coerce")
        df["Rating"] = pd.to_numeric(df["Rating"], errors="coerce")

        return df

    except Exception:
        return pd.DataFrame()  # Return empty DataFrame in case of an error

# Load data at startup
df_speakers_judges = load_speakers_judges()

# API to recommend speakers and judges based on theme, budget, and role
@app.route('/recommend_speakers', methods=['POST'])
def recommend():
    try:
        data = request.json
        theme = data.get("theme")
        budget = data.get("budget")
        role = data.get("role")

        # Validate input
        if not theme or budget is None or not role:
            return jsonify({"error": "Missing required fields: theme, budget, or role"}), 400

        try:
            budget = float(budget)
        except ValueError:
            return jsonify({"error": "Invalid budget format"}), 400

        # Filter based on theme, budget, and role
        recommendations = df_speakers_judges[
            (df_speakers_judges["Expertise"].str.contains(theme, case=False, na=False)) &
            (df_speakers_judges["budget"] <= budget) &
            (df_speakers_judges["Role"].str.lower() == role.lower())
        ].sort_values(by="Rating", ascending=False)

        if recommendations.empty:
            return jsonify({"message": "No matching recommendations found", "recommendations": []})

        return jsonify({"recommendations": recommendations.to_dict(orient="records")})

    except Exception:
        return jsonify({"error": "Internal server error"}), 500
    
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
