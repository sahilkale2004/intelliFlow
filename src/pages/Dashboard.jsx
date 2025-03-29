import React, { useEffect, useState } from 'react';
import { Calendar, Users, TrendingUp, Bell } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [insights, setInsights] = useState([]);

  // Fetch stats data from the stored data file
  useEffect(() => {
    fetch('/analytics_data.json')
      .then((response) => response.json())
      .then((data) => setDashboardData(data))
      .catch((error) => console.error('Error fetching dashboard data:', error));
  }, []);

  // Load the Chatbase
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.chatbase.co/embed.min.js';
    script.defer = true;
    script.setAttribute('chatbotId', '_IqbZ2FvkKs877SvzCSYT');
    script.setAttribute('domain', 'www.chatbase.co');
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Fetch upcoming events data
  useEffect(() => {
  fetch('http://localhost:5000/upcoming-events')
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => setUpcomingEvents(data))
    .catch((error) => {
      console.error('Error fetching events:', error);
    });
  }, []);
  
  // Fetch AI insights data
  useEffect(() => {
  fetch('http://127.0.0.1:5000/event-insights')
    .then((response) => {
      console.log('Response:', response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => setInsights(data))
    .catch((error) => console.error('Error fetching insights:', error));
  }, []);
  
  if (!dashboardData) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-image">
          <img src="/img/header1.jpg" alt="Event-Management" />
          <div className="dashboard-text">
            <h1>Event Management</h1>
            <p>Plan, manage, and analyze events with ease</p>
          </div>
        </div>
      </div>
      <h1 className="dashboard-title">Dashboard</h1>
      <div className="dashboard-stats-grid">
        {[ 
          { title: 'Upcoming Events', value: dashboardData.upcoming_events_count, icon: Calendar, color: 'blue' },
          { title: 'Active Tasks', value: dashboardData.active_tasks, icon: Bell, color: 'green' },
          { title: 'Team Members', value: dashboardData.team_members_count, icon: Users, color: 'purple' },
          { title: 'Event Analytics', value: dashboardData.event_analysis, icon: TrendingUp, color: 'yellow' }
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
            {upcomingEvents.map((event, index) => (
              <div key={index} className="event-item">
                <div>
                  <h3 className="event-name">{event.title}</h3>
                  <p className="event-date">{new Date(event.date).toDateString()}</p>
                </div>
                <span className="event-status">On Track</span>
              </div>
            ))}
          </div>
        </div>

      <div className="card">
            <h2 className="card-title">AI Insights</h2>
            <div className="insight-list">
            {insights.map((insight, index) => (
            <div key={index} className="insight-item">
          <TrendingUp className="insight-icon" />
          <p className="insight-text"><strong>{insight.event_name}:</strong> {insight.insight}</p>
      </div>
    ))}
  </div>
</div>
  </div>
  </div>
  );
}

export default Dashboard;
