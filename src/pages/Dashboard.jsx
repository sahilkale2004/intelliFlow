import React from 'react';
import { Calendar, Users, TrendingUp, Bell } from 'lucide-react';
import './Dashboard.css';
import Chatbot from '../components/Chatbot';

const Dashboard = () => (
  <div className="dashboard-container">
    <h1 className="dashboard-title">Event Planning Dashboard</h1>
    
    <div className="dashboard-stats-grid">
      {[
        { title: 'Upcoming Events', value: '12', icon: Calendar, color: 'blue' },
        { title: 'Active Tasks', value: '34', icon: Bell, color: 'green' },
        { title: 'Team Members', value: '8', icon: Users, color: 'purple' },
        { title: 'Event Analytics', value: '+24%', icon: TrendingUp, color: 'yellow' },
      ].map((stat, index) => (
        <div key={index} className="stat-card">
          <div className="stat-card-header">
            <div className={`stat-icon-container ${stat.color}`}>
              <stat.icon className="stat-icon" />
            </div>
            <div className="stat-details">
              <p className="stat-title">{stat.title}</p>
              <p className="stat-value">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>

    <div className="dashboard-content-grid">
      <div className="card">
        <h2 className="card-title">Upcoming Events</h2>
        <div className="event-list">
          {['Tech Symposium', 'Cultural Fest', 'Sports Meet'].map((event, index) => (
            <div key={index} className="event-item">
              <div>
                <h3 className="event-name">{event}</h3>
                <p className="event-date">March {15 + index}, 2024</p>
              </div>
              <span className="event-status">On Track</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">AI Insights</h2>
        <div className="insight-list">
          {[
            'Attendance prediction: 200+ expected for Tech Symposium',
            'Suggested marketing channels: Instagram, College Website',
            'Resource optimization: Consider outdoor venue',
          ].map((insight, index) => (
            <div key={index} className="insight-item">
              <TrendingUp className="insight-icon" />
              <p className="insight-text">{insight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  < Chatbot />
  </div>
);

export default Dashboard;
