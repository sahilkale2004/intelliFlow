import React, { useState } from "react";
import axios from "axios";
import "./MarketingAutomation.css";

function MarketingAutomation() {
    const [eventName, setEventName] = useState("");
    const [eventDetails, setEventDetails] = useState("");
    const [generatedContent, setGeneratedContent] = useState("");
    const [sponsors, setSponsors] = useState([]);
    const [comments, setComments] = useState("");
    const [sentimentResults, setSentimentResults] = useState([]);

    const generateContent = async () => {
        const response = await axios.post("http://localhost:5002/generate_content", {
            event_name: eventName,
            event_details: eventDetails,
        });
        setGeneratedContent(response.data.content);
    };

    const analyzeSentiment = async () => {
        const response = await axios.post("http://localhost:5003/analyze_sentiment", {
            comments: comments.split("\n"),
        });
        setSentimentResults(response.data.sentiments);
    };

    const recommendSponsors = async () => {
        const response = await axios.post("http://localhost:5004/recommend_sponsors", {
            event_type: 1, 
        });
        setSponsors(response.data.sponsors);
    };

    return (
        <div className="marketing-container">
            <h2>AI Marketing Automation</h2>
            <input type="text" placeholder="Event Name" onChange={(e) => setEventName(e.target.value)} />
            <textarea placeholder="Event Details" onChange={(e) => setEventDetails(e.target.value)} />
            <button onClick={generateContent}>Generate Content</button>
            <h3>Generated Content:</h3>
            <p>{generatedContent}</p>

            <textarea placeholder="Enter Social Media Comments" onChange={(e) => setComments(e.target.value)} />
            <button onClick={analyzeSentiment}>Analyze Sentiment</button>
            <h3>Sentiment Analysis:</h3>
            {sentimentResults.map((res, index) => (
                <p key={index}>{res.comment}: {res.sentiment}</p>
            ))}

            <button onClick={recommendSponsors}>Recommend Sponsors</button>
            <h3>Suggested Sponsors:</h3>
            {sponsors.map((sponsor, index) => (
                <p key={index}>{sponsor}</p>
            ))}
        </div>
    );
}

export default MarketingAutomation;
