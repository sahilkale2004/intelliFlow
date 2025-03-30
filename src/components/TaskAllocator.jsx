import React, { useState } from "react";
import axios from "axios";
import "./TaskAllocator.css";

function TaskAllocator() {
    const [task, setTask] = useState("");
    const [experience, setExperience] = useState("");
    const [availability, setAvailability] = useState("");
    const [result, setResult] = useState("");

    const allocateTask = async () => {
        if (!task.trim()) {
            setResult("Error: Task is required.");
            return;
        }
        if (!experience || isNaN(experience) || experience < 0) {
            setResult("Error: Experience must be a valid non-negative number.");
            return;
        }
        if (!availability || isNaN(availability) || availability < 0 || availability > 100) {
            setResult("Error: Availability must be a valid number between 0 and 100.");
            return;
        }

        try {
            const response = await axios.post("http://127.0.0.1:5000/allocate_task", {
                task: task,
                experience: parseInt(experience),
                availability: parseInt(availability),
            });
            setResult(response.data.result);
        } catch (error) {
            console.error("Error allocating task:", error);
            setResult("Error allocating task: " + (error.response?.data?.result || error.message));
        }
    };

    return (
        <div className="task-allocator-container">
            <h2>Smart Task Allocator</h2>
            <input
                type="text"
                placeholder="Enter Task (e.g., Manage PR)"
                value={task}
                onChange={(e) => setTask(e.target.value)}
            />
            <input
                type="number"
                placeholder="Enter Experience (Years)"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                min="0"
            />
            <input
                type="number"
                placeholder="Enter Availability (%)"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                min="0"
                max="100"
            />
            <button onClick={allocateTask}>Allocate Task</button>
            <p>{result}</p>
        </div>
    );
}

export default TaskAllocator;