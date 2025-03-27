import React, { useState, useEffect } from "react";
import axios from "axios";
import { CheckCircle2, Clock, AlertCircle, XCircle, Save, PlusCircle } from "lucide-react";
import "./Tasks.css";
import TaskAllocator from "../components/TaskAllocator";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    userName: "",
    status: "",
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleInputChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const getRandomAvatar = () => {
    const randomNum = Math.floor(Math.random() * 70) + 1;
    return `https://i.pravatar.cc/150?img=${randomNum}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.description || !newTask.dueDate || !newTask.userName) {
      alert("Please fill all fields");
      return;
    }

    const taskWithAvatar = { ...newTask, avatar: getRandomAvatar() };

    try {
      await axios.post("http://localhost:5000/tasks", taskWithAvatar);
      fetchTasks();
      setShowForm(false);
      setNewTask({ title: "", description: "", dueDate: "", userName: "", status: "" });
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <h1 className="tasks-title">Tasks</h1>
        <button className="add-task-button" onClick={() => setShowForm(true)}>
          <PlusCircle size={18} />  Add Task
        </button>
      </div>

      <div className="tasks-grid">
        {["To Do", "In Progress", "Completed"].map((status) => (
          <div key={status} className="task-column">
            <h2 className="task-status-title">{status}</h2>
            <div className="task-list">
              {tasks.filter((task) => task.status === status).map((task, index) => (
                <div key={index} className="task-card">
                  <div className="task-card-header">
                    <div className="task-details">
                      <h3 className="task-title">{task.title}</h3>
                      <p className="task-description">{task.description}</p>
                    </div>
                    {status === "To Do" && <Clock className="task-icon task-icon-yellow" />}
                    {status === "In Progress" && <AlertCircle className="task-icon task-icon-blue" />}
                    {status === "Completed" && <CheckCircle2 className="task-icon task-icon-green" />}
                  </div>
                  <div className="task-card-footer">
                    <div className="task-user">
                      <img className="task-user-avatar" src={task.avatar || getRandomAvatar()} alt="User avatar" />
                      <span className="task-user-name">{task.userName}</span>
                    </div>
                    <span className="task-due-date">Due {task.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="task-form-overlay">
          <div className="task-form">
            <h2>Add Task</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" name="title" placeholder="Task Title" value={newTask.title} onChange={handleInputChange} required />
              <textarea name="description" placeholder="Task Description" value={newTask.description} onChange={handleInputChange} required />
              <input type="date" name="dueDate" value={newTask.dueDate} onChange={handleInputChange} required />
              <input type="text" name="userName" placeholder="User Name" value={newTask.userName} onChange={handleInputChange} required />
              <select name="status" value={newTask.status} onChange={handleInputChange}>
                <option value="">Select Status</option>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <button type="submit"><Save size={18} /> Save Task</button>
              <button type="button" onClick={() => setShowForm(false)}><XCircle size={18} />Cancel</button>
            </form>
          </div>
        </div>
      )}
    < TaskAllocator />  
    </div>
  );
};

export default Tasks;
