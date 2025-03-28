import React, { useState } from "react";
import axios from "axios";
import "./EventAnalysis.css";

function PostEventAnalysis() {
    const [feedback, setFeedback] = useState("");
    const [feedbackResults, setFeedbackResults] = useState([]);
    const [summary, setSummary] = useState("");
    
    const analyzeFeedback = async () => {
        const response = await axios.post("http://localhost:5005/analyze_feedback", {
            feedback: feedback.split("\n"),
        });
        setFeedbackResults(response.data.feedback_analysis);
    };

    const generateSummary = async () => {
        const response = await axios.post("http://localhost:5005/generate_event_summary", {
            event_name: "TechFest 2025",
        });
        setSummary(response.data.summary);
    };

    return (
        <div className="post-event-container">
            <h2>Post-Event Analysis</h2>

            <textarea placeholder="Enter Feedback" onChange={(e) => setFeedback(e.target.value)} />
            <button onClick={analyzeFeedback}>Analyze Feedback</button>
            
            <h3>Feedback Sentiment Analysis:</h3>
            {feedbackResults.map((res, index) => (
                <p key={index}>{res.feedback}: {res.sentiment}</p>
            ))}

            <button onClick={generateSummary}>Generate Event Summary</button>
            <h3>Event Summary:</h3>
            <p>{summary}</p>
        </div>
    );
}

export default PostEventAnalysis;
