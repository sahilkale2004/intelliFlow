import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { BarChart2, PieChart as PieChartIcon, TrendingUp, Users } from "lucide-react";
import EventAnalysis from "../components/EventAnalysis";
import "./Analytics.css";

const AnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [aiInsights, setAiInsights] = useState([]);
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  useEffect(() => {
    fetch("/analytics_data.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not OK");
        }
        return response.json();
      })
      .then((data) => {
        setAnalyticsData(data);
        fetchAiInsights(data);
      })
      .catch((error) => console.error("Error loading analytics data:", error));
  }, []);

   // Function to clean AI insights
  const cleanInsights = (insights) => {
    return insights.map((insight) => "• " + insight.replace(/[*-]/g, "").trim());
  };

  // Fetch AI insights data using API
  const fetchAiInsights = async (data) => {
    try {
      const response = await fetch("http://127.0.0.1:5002/generate_stats_insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          average_attendees: parseInt(data?.average_attendance || 0),
          budget_utilization: parseInt(data?.budget_utilization || 0),
          task_completion: parseInt(data?.task_completion || 0),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setAiInsights(cleanInsights(result.insights || []));
    } catch (error) {
      console.error("Error fetching AI insights:", error);
      setAiInsights(["Failed to fetch AI insights. Please try again."]);
    }
  };

  if (!analyticsData) return <p>Loading...</p>;

  // Custom Tooltip for Pie Chart
   const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-category">{payload[0].payload.category}</p>
          <p className="tooltip-percentage">{`Percentage: ${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="analytics-container">
      <h1 className="analytics-title">Analytics Dashboard</h1>

      {/* Statistics Cards */}
      <div className="analytics-stats-grid">
        {analyticsData && [
          { title: "Total Events", value: analyticsData.total_events, icon: BarChart2 },
          { title: "Average Attendance", value: analyticsData.average_attendance, icon: Users },
          { title: "Task Completion", value: analyticsData.task_completion, icon: TrendingUp },
          { title: "Budget Utilization", value: analyticsData.budget_utilization, icon: PieChartIcon },
        ].map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-header">
              <p className="stat-title">{stat.title}</p>
              <p className="stat-value">{stat.value}</p>
            </div>
            <stat.icon className="stat-icon" />
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="analytics-charts-grid">
        {/* Event Performance Bar Chart */}
        <div className="chart-card">
          <h2 className="chart-title">Event Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.event_performance}>
              <XAxis dataKey="event" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="score" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

         {/* Attendance Distribution Pie Chart */}
        <div className="chart-card">
          <h2 className="chart-title">Attendance Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analyticsData.attendance_distribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="percentage"
              >
                {analyticsData.attendance_distribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI-Generated Insights */}
      <div className="insights-card">
        <h2 className="insights-title">AI-Generated Insights</h2>
        <div className="insights-list">
          {aiInsights.length > 0 ? (
            aiInsights.map((insight, index) => (
              <div key={index} className="insight-item">
                <TrendingUp className="insight-icon" />
                <p className="insight-text">{insight}</p>
              </div>
            ))
          ) : (
            <p>Generating insights...</p>
          )}
        </div>
      </div>

      <EventAnalysis />
    </div>
  );
};

export default AnalyticsDashboard;
