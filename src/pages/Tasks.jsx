import React from 'react';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import './Tasks.css';
import TaskAllocator from '../components/TaskAllocator';

const Tasks = () => {
  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <h1 className="tasks-title">Tasks</h1>
        <button className="add-task-button">Add Task</button>
      </div>

      <div className="tasks-grid">
        {["To Do", "In Progress", "Completed"].map((status, statusIndex) => (
          <div key={statusIndex} className="task-column">
            <h2 className="task-status-title">{status}</h2>
            <div className="task-list">
              {[1, 2, 3].map((task, taskIndex) => (
                <div key={taskIndex} className="task-card">
                  <div className="task-card-header">
                    <div className="task-details">
                      <h3 className="task-title">
                        {status === "To Do" && "Design event posters"}
                        {status === "In Progress" && "Contact vendors"}
                        {status === "Completed" && "Book venue"}
                      </h3>
                      <p className="task-description">
                        {status === "To Do" && "Create promotional materials for social media"}
                        {status === "In Progress" && "Negotiate with catering services"}
                        {status === "Completed" && "Secure main auditorium for symposium"}
                      </p>
                    </div>
                    {status === "To Do" && <Clock className="task-icon task-icon-yellow" />}
                    {status === "In Progress" && <AlertCircle className="task-icon task-icon-blue" />}
                    {status === "Completed" && <CheckCircle2 className="task-icon task-icon-green" />}
                  </div>
                  <div className="task-card-footer">
                    <div className="task-user">
                      <img
                        className="task-user-avatar"
                        src={`https://i.pravatar.cc/150?img=${statusIndex * 3 + taskIndex}`}
                        alt="User avatar"
                      />
                      <span className="task-user-name">John Doe</span>
                    </div>
                    <span className="task-due-date">Due Mar 15</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      < TaskAllocator />
    </div>
  );
};

export default Tasks;
