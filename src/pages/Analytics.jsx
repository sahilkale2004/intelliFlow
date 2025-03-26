import React from "react";
import { BarChart2, PieChart, TrendingUp, Users } from "lucide-react";

const Analytics = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { title: "Total Events", value: "24", change: "+12%", icon: Calendar },
        { title: "Average Attendance", value: "156", change: "+8%", icon: Users },
        { title: "Task Completion", value: "89%", change: "+5%", icon: CheckCircle2 },
        { title: "Budget Utilization", value: "92%", change: "-3%", icon: TrendingUp },
      ].map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">{stat.value}</p>
            </div>
            <div className={`${
              stat.change.startsWith("+") ? "text-green-600" : "text-red-600"
            } flex items-center`}>
              <span className="text-sm font-medium">{stat.change}</span>
            </div>
          </div>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Event Performance</h2>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <BarChart2 className="h-12 w-12 text-gray-400" />
          <span className="ml-2 text-gray-500">Chart visualization would go here</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Attendance Distribution</h2>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <PieChart className="h-12 w-12 text-gray-400" />
          <span className="ml-2 text-gray-500">Chart visualization would go here</span>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">AI-Generated Insights</h2>
      <div className="space-y-4">
        {[
          "Event attendance has increased by 23% compared to last semester",
          "Marketing campaigns on Instagram show 45% better engagement",
          "Recommended budget allocation: 40% venue, 30% marketing, 30% logistics",
          "Peak attendance times are between 2 PM and 5 PM for weekday events",
        ].map((insight, index) => (
          <div key={index} className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <p className="text-sm text-blue-900">{insight}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Analytics;
