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
### 3️⃣ Create a react project

    npx create-react-app your_app_name

    cd your_app_name

    npm start
    

### 4️⃣ Backend Setup (Flask & Python)

🔹 Create a Virtual Environment

    python -m venv venv
    
🔹 Install Python Packages

    pip install google-generativeai flask flask-cors pandas numpy scikit-learn textblob vaderSentiment pymongo
    
🔹 Initialize backend server for connecting frontend & backend 

    npm init -y

🔹 Install Python Packages 

    pip install express dotenv mongoose nodemailer socket.io cors 
   

### 5️⃣ Set Up Environment Variables

    GEMINI_API_KEY=your_google_gemini_api_key
    
    MONGO_URI=mongodb://localhost:27017/your_db_name

### 6️⃣ Prepare Data Files

Ensure the following JSON files exist in the root directory:

* sponsors_data.json

* speakers_judges.json

* budget_data.json

* task_data.json

* analytics_data.json

7️⃣ Run the Flask Server

    python app.py

8️⃣ Run the node Server

    node  index.js
    .

### 📌 Key Features & Functionality
1️⃣ Dashboard
* Provides a snapshot of upcoming events, active tasks, and team members.

* AI-generated insights to optimize event planning.

2️⃣ Events Module
* Centralized event listing with detailed information.

* AI-powered speaker & judge recommendations based on event theme and budget.

3️⃣ Tasks Module
* Smart AI-driven task allocation based on expertise & availability.

* Real-time updates via WebSockets for smooth workflow.

4️⃣ Analytics & Insights
* AI-driven post-event analytics with engagement tracking.

* Visual reports (bar & pie charts) on attendance, budget utilization, and task efficiency.

* Sentiment analysis of social media comments for measuring event success.

5️⃣ Login & Access Control
* Admins can manage events and tasks (add/update/delete).

* Role-based authentication to ensure data security and controlled access.

### 🤖 AI-Powered Enhancements

✅ AI Chatbot – Assists users with FAQs, event details & platform guidance.<br>
✅ Marketing Automation – AI-generated promotional content & PR strategies.<br>
✅ Sponsor Recommendations – AI suggests ideal sponsors based on event type.<br>
✅ Predictive Budget Optimization – AI-driven cost-effective budget planning.<br>
✅ Real-Time Notifications – WebSockets for instant task updates & alerts.<br>

### 🛠️ Tech Stack

✅ Frontend: React.js + CSS (for seamless UI)<br>
✅ Backend: Node.js with Express.js (API & business logic)<br>
✅ Database: MongoDB (to manage structured event & user data)<br>
✅ AI-ML Modules: Python (for chatbot, sponsor recommendations, marketing, event analytics, and task allocation)<br>
✅ Real-Time Communication: WebSockets (for live updates & notifications)








    
    
