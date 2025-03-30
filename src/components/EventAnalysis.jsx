import React, { useState } from "react";
import axios from "axios";
import "./EventAnalysis.css";

function PostEventAnalysis() {
    const [feedback, setFeedback] = useState("");
    const [feedbackResults, setFeedbackResults] = useState([]);
    const [summary, setSummary] = useState("");
    const [eventName, setEventName] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [eventLocation, setEventLocation] = useState("");

    const analyzeFeedback = async () => {
        if (!feedback.trim()) {
            alert("Please enter feedback before analyzing.");
            return;
        }

        try {
            const response = await axios.post("http://127.0.0.1:5000/analyze_feedback", {
                feedback: feedback.split("\n"),
            });
            setFeedbackResults(response.data.feedback_analysis);
        } catch (error) {
            console.error("Error analyzing feedback:", error);
            alert("Failed to analyze feedback. Please try again.");
        }
    };

    const generateSummary = async () => {
        if (!eventName.trim() || !eventDate.trim() || !eventLocation.trim()) {
            alert("Please enter Event Name, Date, and Location to generate a summary.");
            return;
        }

        try {
            const response = await axios.post("http://127.0.0.1:5000/generate_event_summary", {
                event_name: eventName,
                event_date: eventDate,
                event_location: eventLocation,
            });
            setSummary(response.data.summary);
        } catch (error) {
            console.error("Error generating summary:", error);
            alert("Failed to generate event summary. Please try again.");
        }
    };

    return (
        <div className="post-event-container">
            <h2>Post-Event Analysis</h2>
            {/* Feedback Analysis Section */}
            <textarea
                placeholder="Enter Feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
            />
            <button onClick={analyzeFeedback}>Analyze Feedback</button>

            <h3>Feedback Sentiment Analysis:</h3>
            {feedbackResults.length > 0 ? (
                feedbackResults.map((res, index) => (
                    <p key={index}>
                        {res.feedback}: <strong>{res.sentiment}</strong>
                    </p>
                ))
            ) : (
                <p>No feedback analysis yet.</p>
            )}

             {/* Event Input Fields */}
            <div className="event-inputs">
                <input
                    type="text"
                    placeholder="Enter Event Name"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                />
                <input
                    type="date"
                    placeholder="Select Event Date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Enter Event Location"
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                />
            </div>
            {/* Event Summary Generation */}
            <button onClick={generateSummary}>Generate Event Summary</button>
            <h3>Event Summary:</h3>
            <p>{summary || "No summary generated yet."}</p>
        </div>
    );
}

export default PostEventAnalysis;
