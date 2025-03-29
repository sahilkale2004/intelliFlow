import React, { useState } from "react";
import axios from "axios";
import "./BudgetOptimizer.css";

function BudgetOptimizer() {
    const [eventData, setEventData] = useState({
        event: "",
        venue_cost: ""
    });
    const [optimizedBudget, setOptimizedBudget] = useState(null);

    const handleChange = (e) => {
        setEventData({ ...eventData, [e.target.name]: e.target.value });
    };

    const fetchOptimizedBudget = async () => {
        try {
            const response = await axios.post("http://localhost:5005/predict_budget", eventData);
            setOptimizedBudget(response.data.optimized_budget);
        } catch (error) {
            console.error("Error fetching budget:", error);
        }
    };

    return (
        <div className="budget-optimizer-container">
            <h2>Predictive Budget Optimization</h2>
            
            <input type="text" name="event" placeholder="Event Name" onChange={handleChange} />
            <input type="number" name="venue_cost" placeholder="Venue Cost" onChange={handleChange} />

            <button onClick={fetchOptimizedBudget}>Get Budget Optimization</button>

            {optimizedBudget && (
                <div className="budget-results">
                    <h3>Optimized Budget Allocation for {eventData.event}:</h3>
                    <p>Venue Cost: ${optimizedBudget.venue_cost}</p>
                    <p>Marketing: ${optimizedBudget.marketing}</p>
                    <p>Speakers: ${optimizedBudget.speakers}</p>
                    <p>Miscellaneous: ${optimizedBudget.misc}</p>
                </div>
            )}
        </div>
    );
}

export default BudgetOptimizer;
