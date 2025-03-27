import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from flask import Flask, request, jsonify
from flask_cors import CORS

# Load dataset
df = pd.read_csv("task_data.csv")

# Encode categorical values
df['Skills Required'] = df['Skills Required'].astype('category').cat.codes
df['Organizer'] = df['Organizer'].astype('category').cat.codes
df['Assigned'] = df['Assigned'].map({'Yes': 1, 'No': 0})

# Split dataset
X = df[['Skills Required', 'Experience (Years)', 'Availability (%)']]
y = df['Assigned']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

app = Flask(__name__)
CORS(app)

@app.route('/allocate_task', methods=['POST'])
def allocate_task():
    data = request.json
    skills = data['skills']
    experience = data['experience']
    availability = data['availability']

    input_data = np.array([[skills, experience, availability]])
    prediction = model.predict(input_data)[0]

    response = "Task Assigned" if prediction == 1 else "Task Not Assigned"
    return jsonify({"result": response})

if __name__ == '__main__':
    app.run(port=5001, debug=True)
