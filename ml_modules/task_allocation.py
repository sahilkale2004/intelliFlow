import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from flask import Flask, request, jsonify
from flask_cors import CORS

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

# Flask app
app = Flask(__name__)
CORS(app)

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

if __name__ == '__main__':
    app.run(port=5001, debug=True)