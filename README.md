# 📌 Project Setup Instructions

### 1️⃣ Prerequisites
Ensure you have the following installed:

* Python (≥ 3.8)

* pip (Python package manager)

* MongoDB (for sponsor & event data storage)

* Flask (Backend framework)

* Node.js & npm (For frontend dependencies)

### 2️⃣ Clone or Download the Project

    git clone https://github.com/your-repo/project-name.git
    
    cd project-name

### 3️⃣ Backend Setup (Flask & Python)

🔹 Create a Virtual Environment

    python -m venv venv
🔹 Install Python Packages

    pip install google-generativeai flask flask-cors pandas numpy scikit-learn textblob vaderSentiment pymongo

### 4️⃣ Set Up Environment Variables

    GEMINI_API_KEY=your_google_gemini_api_key
    
    MONGO_URI=mongodb://localhost:27017/your_db_name

### 6️⃣ Prepare Data Files

Ensure the following JSON files exist in the root directory:

* sponsors_data.json

* speakers_judges.json

* budget_data.json

* task_data.json

* analytics_data.json


* 

If missing, create them and struc



    
    
