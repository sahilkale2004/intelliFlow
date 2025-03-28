import React from "react";
import { BarChart2, PieChart, TrendingUp, Users } from "lucide-react";
import "./Analytics.css";
import EventAnalysis from "../components/EventAnalysis";

const Analytics = () => (
  <div className="analytics-container">
    <h1 className="analytics-title">Analytics</h1>

    <div className="analytics-stats-grid">
      {[
        { title: "Total Events", value: "24", change: "+12%", icon: BarChart2 },
        { title: "Average Attendance", value: "156", change: "+8%", icon: Users },
        { title: "Task Completion", value: "89%", change: "+5%", icon: TrendingUp },
        { title: "Budget Utilization", value: "92%", change: "-3%", icon: PieChart },
      ].map((stat, index) => (
        <div key={index} className="stat-card">
          <div className="stat-header">
            <div>
              <p className="stat-title">{stat.title}</p>
              <p className="stat-value">{stat.value}</p>
            </div>
            <div className={`stat-change ${stat.change.startsWith("+") ? "text-green" : "text-red"}`}>
              <span>{stat.change}</span>
            </div>
          </div>
        </div>
      ))}
    </div>

    <div className="analytics-charts-grid">
      <div className="chart-card">
        <h2 className="chart-title">Event Performance</h2>
        <div className="chart-placeholder">
          <BarChart2 className="chart-icon" />
          <span className="chart-text">Chart visualization would go here</span>
        </div>
      </div>

      <div className="chart-card">
        <h2 className="chart-title">Attendance Distribution</h2>
        <div className="chart-placeholder">
          <PieChart className="chart-icon" />
          <span className="chart-text">Chart visualization would go here</span>
        </div>
      </div>
    </div>

    <div className="insights-card">
      <h2 className="insights-title">AI-Generated Insights</h2>
      <div className="insights-list">
        {[
          "Event attendance has increased by 23% compared to last semester",
          "Marketing campaigns on Instagram show 45% better engagement",
          "Recommended budget allocation: 40% venue, 30% marketing, 30% logistics",
          "Peak attendance times are between 2 PM and 5 PM for weekday events",
        ].map((insight, index) => (
          <div key={index} className="insight-item">
            <TrendingUp className="insight-icon" />
            <p className="insight-text">{insight}</p>
          </div>
        ))}
      </div>
    </div>
    < EventAnalysis />
  </div>
);

export default Analytics;
