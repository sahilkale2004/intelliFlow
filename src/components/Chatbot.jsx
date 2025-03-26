import React, { useState } from "react";
import axios from "axios";
import "./Chatbot.css";

function Chatbot() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const sendMessage = async () => {
        if (!input) return;
        setMessages([...messages, { text: input, user: true }]);

        const response = await axios.post("https://ab09-202-168-145-66.ngrok-free.app/webhook", {
            queryResult: { intent: { displayName: input } }
        });

        setMessages([...messages, { text: input, user: true }, { text: response.data.fulfillmentText, user: false }]);
        setInput("");
    };

    return (
        <div className="chat-container">
            <div className="chat-box">
                {messages.map((msg, index) => (
                    <div key={index} className={msg.user ? "user-message" : "bot-message"}>
                        {msg.text}
                    </div>
                ))}
            </div>
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask something..." />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}

export default Chatbot;
