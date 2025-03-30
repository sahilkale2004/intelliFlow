import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import json
import os
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.neighbors import NearestNeighbors
from textblob import TextBlob
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from pymongo import MongoClient
from datetime import datetime

app = Flask(__name__)
CORS(app)

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
    
 ### Speakers and Judges Data and Budget predictor APIs ###
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
   
### Task Allocation API ###
# Load dataset
df = pd.read_json("task_data.json")

# Normalize 'Skills Required' and 'Task'
df['Skills Required'] = df['Skills Required'].str.strip().str.lower()
df['Task'] = df['Task'].str.strip().str.lower()

task_to_skills = dict(zip(df['Task'], df['Skills Required']))

# Value encoding
skill_encoder = LabelEncoder()
organizer_encoder = LabelEncoder()
df['Skills Required'] = skill_encoder.fit_transform(df['Skills Required'])
df['Organizer'] = organizer_encoder.fit_transform(df['Organizer'])

# Data preparation
X = df[['Skills Required', 'Experience (Years)', 'Availability (%)']]
y = df['Organizer']

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = RandomForestClassifier(n_estimators=200, random_state=42)
model.fit(X_train, y_train)
   
@app.route('/allocate_task', methods=['POST'])
def allocate_task():
    try:
        data = request.json
        task = data['task'].strip().lower()
        experience = int(data['experience'])
        availability = int(data['availability'])

        # Check if task exists in the dataset
        if task not in task_to_skills:
            return jsonify({"result": "Invalid Task. Try: " + ", ".join(task_to_skills.keys())}), 400
        
        skills_required = task_to_skills[task]
        task_encoded = skill_encoder.transform([skills_required])[0]

        # Make prediction
        input_data = np.array([[task_encoded, experience, availability]])
        predicted_organizer = model.predict(input_data)[0]
        organizer_name = organizer_encoder.inverse_transform([predicted_organizer])[0]

        return jsonify({"result": f"Best Organizer: {organizer_name}"})
    except (KeyError, ValueError) as e:
        return jsonify({"result": "Invalid input: 'task', 'experience', and 'availability' must be provided and valid"}), 400 
    
### EVENT ANALYSIS API ###
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

@app.route("/generate_stats_insights", methods=["POST"])
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
    
### Event Insights API ###   
# Connect to MongoDB
MONGODB_URI = os.getenv("MONGODB_URI")
client = MongoClient(MONGODB_URI)
db = client["EVENT_MANAGER"]
collection = db["event_details"]

@app.route("/event-insights", methods=["GET"])
def generate_insights():
    events = list(collection.find({}, {"_id": 0}))
    
    # Sort events by date and get the next 4 upcoming events
    events.sort(key=lambda x: datetime.strptime(x["date"], "%Y-%m-%d"))
    upcoming_events = events[:4]
    
    predictions = []
    for event in upcoming_events:
        prompt = f"""
        Given the event details:
        - Title: {event['title']}
        - Date: {event['date']}
        - Location: {event['location']}
        - Expected Attendees: {event['attendees']}
        - Duration: {event['duration']} hours
        - Status: {event['status']}
        
        Provide a one-line insight predicting estimated final attendance, best marketing strategy, or resource allocation.
        """
        try:
            model = genai.GenerativeModel("gemini-2.0-flash")
            response = model.generate_content(prompt)
            insight = response.text.strip().split("\n")[0]  
            predictions.append({
                "title": event["title"],
                "insight": insight
            })

        except Exception as e:
            print(f"Error generating insight for {event['title']}: {e}")
            predictions.append({
                "title": event["title"],
                "insight": "Could not generate insights due to an API error."
            })

    return jsonify(predictions)   

if __name__ == '__main__':
    app.run(port=5000, debug=True)