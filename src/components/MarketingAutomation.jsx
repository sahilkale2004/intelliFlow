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
    const [eventType, setEventType] = useState("");

    // Function to generate marketing content
    const generateContent = async () => {
        try {
            const response = await axios.post("http://127.0.0.1:5000/generate_content", {
                event_name: eventName,
                event_details: eventDetails,
            });
            setGeneratedContent(response.data.content);
        } catch (error) {
            console.error("Error generating content:", error);
            setGeneratedContent("Error generating content. Please try again.");
        }
    };

    // Analyze sentiment function for social media comments
    const analyzeSentiment = async () => {
        try {
            const response = await axios.post("http://127.0.0.1:5000/analyze_sentiment", {
                comments: comments.split("\n"),
            });
            setSentimentResults(response.data.sentiments);
        } catch (error) {
            console.error("Error analyzing sentiment:", error);
            setSentimentResults([{ comment: "Error analyzing sentiment", sentiment: "N/A" }]);
        }
    };

    // Sponsors recommendation function based on[event_type]
    const recommendSponsors = async () => {
        try {
            const response = await axios.post("http://127.0.0.1:5000/recommend_sponsors", {
                event_type: eventType.trim().toLowerCase(),
            });

            console.log("API Response:", response.data);
            setSponsors(response.data.sponsors || []);
        } catch (error) {
            console.error("Error fetching sponsors:", error);
            setSponsors([{ name: "Error fetching sponsors" }]);
        }
    };

   return (
  <div className="marketing-container">
    <div className="marketing-content">
      <h2>AI Marketing Automation</h2>
      <input
        type="text"
        placeholder="Event Name"
        value={eventName}
        onChange={(e) => setEventName(e.target.value)}
      />
      <textarea
        placeholder="Event Details"
        value={eventDetails}
        onChange={(e) => setEventDetails(e.target.value)}
      />
      <button onClick={generateContent}>Generate Content</button>
      <h3>Generated Content:</h3>
      <p>{generatedContent || "No content generated yet."}</p>
    </div>

    <div className="sentiment-content">
      <h2>Smart Sentiment Analysis</h2>
      <textarea
        placeholder="Enter Social Media Comments (One per line)"
        value={comments}
        onChange={(e) => setComments(e.target.value)}
      />
      <button onClick={analyzeSentiment}>Analyze Sentiment</button>
      <h3>Sentiment Analysis:</h3>
      {sentimentResults.length > 0 ? (
        sentimentResults.map((res, index) => (
          <p key={index}>
            {res.comment}: <strong>{res.sentiment}</strong>
          </p>
        ))
      ) : (
        <p>No sentiment analysis yet.</p>
      )}
    </div>

    <div className="sponsor-content">
      <h2>Sponsor Recommendation</h2>
      <input
        type="text"
        placeholder="Enter Event Type (e.g., Hackathons)"
        value={eventType}
        onChange={(e) => setEventType(e.target.value)}
      />
      <button onClick={recommendSponsors}>Recommend Sponsors</button>
      <h3>Suggested Sponsors:</h3>
      {sponsors.length > 0 ? (
        <table border="1">
          <thead>
            <tr>
              <th>Name</th>
              <th>Industry</th>
              <th>Sponsorship Type</th>
              <th>Average Sponsorship Amount</th>
            </tr>
          </thead>
          <tbody>
            {sponsors.map((sponsor, index) => (
              <tr key={index}>
                <td>{sponsor.name}</td>
                <td>{sponsor.industry}</td>
                <td>{sponsor.sponsorship_type.join(', ')}</td>
                <td>{sponsor.average_sponsorship_amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No sponsors recommended yet.</p>
      )}
    </div>
  </div>
);
}

export default MarketingAutomation;