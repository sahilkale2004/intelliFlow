import React, { useState } from "react";
import axios from "axios";
import "./TaskAllocator.css";

function TaskAllocator() {
    const [skills, setSkills] = useState("");
    const [experience, setExperience] = useState("");
    const [availability, setAvailability] = useState("");
    const [result, setResult] = useState("");

    const allocateTask = async () => {
        const response = await axios.post("http://localhost:5001/allocate_task", {
            skills: parseInt(skills),
            experience: parseInt(experience),
            availability: parseInt(availability),
        });

        setResult(response.data.result);
    };

    return (
        <div>
            <h2>Task Allocation</h2>
            <input type="number" placeholder="Skills (0-Marketing, 1-Tech, 2-Finance, 3-Sponsorship)" onChange={(e) => setSkills(e.target.value)} />
            <input type="number" placeholder="Experience (Years)" onChange={(e) => setExperience(e.target.value)} />
            <input type="number" placeholder="Availability (%)" onChange={(e) => setAvailability(e.target.value)} />
            <button onClick={allocateTask}>Allocate Task</button>
            <h3>{result}</h3>
        </div>
    );
}

export default TaskAllocator;
