import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


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
    
if __name__ == '__main__':
    app.run(port=5002, debug=True)