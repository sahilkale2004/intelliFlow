import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import { CheckCircle2, Clock, AlertCircle, XCircle, Save, PlusCircle, Edit, Trash, RefreshCw, Lock } from "lucide-react";
import "./Tasks.css";
import TaskAllocator from "../components/TaskAllocator";

const socket = io("http://localhost:5000");

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(
    localStorage.getItem("isAdminAuthenticated") === "true"
  );
  
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    userName: "",
    email: "",
    status: "",
  });
  const [editTask, setEditTask] = useState(null);

  const getRandomAvatar = () => {
  const randomNum = Math.floor(Math.random() * 70) + 1;
  return `https://i.pravatar.cc/150?img=${randomNum}`;
  };
  
  const handleInputChange = (e) => {
  setNewTask({ ...newTask, [e.target.name]: e.target.value });
};
  
  const handleEditInputChange = (e) => {
  setEditTask({ ...editTask, [e.target.name]: e.target.value });
};

  useEffect(() => {
    fetchTasks();
    socket.on("new_task", (task) => setTasks((prev) => [...prev, task]));
    socket.on("taskUpdated", (updatedTask) => setTasks((prev) => prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))));
    return () => { socket.off("new_task"); socket.off("taskUpdated"); };
  }, []);

  const fetchTasks = async () => {
    try { setTasks((await axios.get("http://localhost:5000/tasks")).data); }
    catch (error) { console.error("Error fetching tasks:", error); }
  };

  const authenticateAdmin = (e) => {
    e.preventDefault();
    if (adminEmail === "admin@example.com" && adminPassword === "admin123") {
      setIsAdminAuthenticated(true);
      localStorage.setItem("isAdminAuthenticated", "true");
      setShowAdminLogin(false);
    } else alert("Invalid admin credentials");
  };

  const verifyAdminPassword = (e) => {
    e.preventDefault();
    if (adminPassword === "admin123") {
      setShowAdminPassword(false);
      return true;
    } else {
      alert("Incorrect password");
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdminAuthenticated) return setShowAdminLogin(true);
    if (!newTask.title || !newTask.description || !newTask.dueDate || !newTask.userName || !newTask.email) return alert("Please fill all fields");
    const taskWithAvatar = { ...newTask, avatar: getRandomAvatar() };
    try {
        await axios.post("http://localhost:5000/tasks", taskWithAvatar);
        fetchTasks();
        setShowForm(false);
        setNewTask({ title: "", description: "", dueDate: "", userName: "", email: "", status: "" });
    } catch (error) {
        console.error("Error adding task:", error);
    }
  };
  
  const handleEdit = (task) => { setShowAdminPassword(true); setEditTask(task); };
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!verifyAdminPassword(e)) return;
    try {
      await axios.put(`http://localhost:5000/tasks/${editTask._id}`, editTask);
      fetchTasks(); setEditTask(null);
    } catch (error) { console.error("Error updating task:", error); }
  };

  const handleDelete = async (id) => {
    if (!verifyAdminPassword(new Event("submit"))) return;
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await axios.delete(`http://localhost:5000/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) { console.error(err); }
  };

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <h1 className="tasks-title">Tasks</h1>
        <button className="add-task-button" onClick={() => { setShowForm(true); setEditTask(null); }}>
          <PlusCircle size={18} /> Add Task
        </button>
      </div>

      {showAdminLogin && (
        <div className="admin-overlay">
          <form onSubmit={authenticateAdmin} className="admin-form">
            <h2>Admin Login</h2>
            <input type="email" placeholder="Admin Email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} required />
            <input type="password" placeholder="Admin Password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} required />
            <button type="submit"><Lock size={18} /> Login</button>
            <button onClick={() => setShowAdminLogin(false)}><XCircle size={18} /> Cancel</button>
          </form>
        </div>
      )}
      {showAdminPassword && (
        <div className="admin-overlay">
          <form onSubmit={verifyAdminPassword} className="admin-form">
            <h2>Enter Admin Password</h2>
            <input type="password" placeholder="Admin Password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} required />
            <button type="submit"><Lock size={18} /> Verify</button>
            <button onClick={() => setShowAdminPassword(false)}><XCircle size={18} /> Cancel</button>
          </form>
        </div>
      )}

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
                  <div className="task-actions">
                    <Edit className="task-action-icon task-edit-icon" onClick={() => handleEdit(task)} />
                    <Trash className="task-action-icon task-delete-icon" onClick={() => handleDelete(task._id)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add Task Form */}
      {showForm && (
        <div className="task-form-overlay">
          <div className="task-form">
            <h2>Add Task</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" name="title" placeholder="Task Title" value={newTask.title} onChange={handleInputChange} required />
              <textarea name="description" placeholder="Task Description" value={newTask.description} onChange={handleInputChange} required />
              <input type="date" name="dueDate" value={newTask.dueDate} onChange={handleInputChange} required />
              <input type="text" name="userName" placeholder="User Name" value={newTask.userName} onChange={handleInputChange} required />
              <input type="email" name="email" placeholder="User Email" value={newTask.email} onChange={handleInputChange} required />
              <select name="status" value={newTask.status} onChange={handleInputChange}>
              <option value="">Select Status</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              </select>
              <button type="submit"><Save size={18} /> Save Task</button>
              <button type="button" onClick={() => setShowForm(false)}><XCircle size={18} /> Cancel</button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Task Form */}
      {editTask && (
        <div className="task-form-overlay">
          <div className="task-form">
            <h2>Edit Task</h2>
            <form onSubmit={handleUpdate}>
              <input type="text" name="title" value={editTask.title} onChange={handleEditInputChange} required />
              <textarea name="description" value={editTask.description} onChange={handleEditInputChange} required />
              <input type="date" name="dueDate" value={editTask.dueDate} onChange={handleEditInputChange} required />
              <select name="status" value={editTask.status} onChange={handleEditInputChange}>
              <option value="">Select Status</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              </select>
              <button type="submit"><RefreshCw size={18} /> Update Task</button>
              <button type="button" onClick={() => setEditTask(null)}><XCircle size={18} /> Cancel</button>
            </form>
          </div>
        </div>
      )}

      <TaskAllocator />
    </div>
  );
};

export default Tasks;