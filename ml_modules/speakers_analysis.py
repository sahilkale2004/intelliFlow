from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import json

app = Flask(__name__)
CORS(app)

# Load speakers and judges data
def load_speakers_judges():
    try:
        with open('speakers_judges.json', 'r', encoding='utf-8') as file:
            data = json.load(file)

        df = pd.DataFrame(data)
        df.columns = df.columns.str.lower()

        required_fields = {"name", "role", "expertise", "experience", "budget", "rating", "availability"}
        if not required_fields.issubset(df.columns):
            return pd.DataFrame()

        # Convert budget and rating to numeric
        df["budget"] = pd.to_numeric(df["budget"], errors="coerce")
        df["rating"] = pd.to_numeric(df["rating"], errors="coerce")

        df["expertise"] = df["expertise"].str.lower().str.strip()
        df["role"] = df["role"].str.lower().str.strip()

        df["availability"] = df["availability"].apply(lambda x: x if isinstance(x, list) else [])

        return df
    except Exception as e:
        print(f"Error loading data: {e}")
        return pd.DataFrame()

df_speakers_judges = load_speakers_judges()

@app.route('/recommend_speakers', methods=['POST'])
def recommend():
    try:
        data = request.json
        theme = data.get("theme", "").strip().lower()  
        budget = data.get("budget")
        role = data.get("role", "").strip().lower()
        date = data.get("date", "").strip()

        if not theme or budget is None or not role:
            return jsonify({"error": "Missing required fields: theme, budget, or role"}), 400

        try:
            budget = float(budget)
        except ValueError:
            return jsonify({"error": "Invalid budget format"}), 400

        filtered_df = df_speakers_judges[
            (df_speakers_judges["expertise"].str.contains(theme, na=False)) &
            (df_speakers_judges["budget"] <= budget) &
            (df_speakers_judges["role"] == role)
        ]

        # Filter by availability if date is provided
        if date:
            filtered_df = filtered_df[filtered_df["availability"].apply(lambda dates: date in dates)]

        if filtered_df.empty:
            return jsonify({"message": "No matching recommendations found", "recommendations": []})

        return jsonify({"recommendations": filtered_df.sort_values(by="rating", ascending=False).to_dict(orient="records")})
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Internal server error"}), 500


@app.route("/predict_budget", methods=["POST"])
def predict_budget():
    try:
        with open("budget_data.json", "r") as file:
            past_budgets = json.load(file)

        avg_budget = {
            "venue_cost": sum(d["venue_cost"] for d in past_budgets) / len(past_budgets),
            "marketing": sum(d["marketing"] for d in past_budgets) / len(past_budgets),
            "speakers": sum(d["speakers"] for d in past_budgets) / len(past_budgets),
            "misc": sum(d["misc"] for d in past_budgets) / len(past_budgets),
        }

        return jsonify({"optimized_budget": avg_budget})  
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    app.run(port=5005, debug=True)
