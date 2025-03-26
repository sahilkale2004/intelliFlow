import React from 'react';
import { Calendar, Users, TrendingUp, Bell } from 'lucide-react';

const Dashboard = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-gray-900">Event Planning Dashboard</h1>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { title: 'Upcoming Events', value: '12', icon: Calendar, color: 'bg-blue-500' },
        { title: 'Active Tasks', value: '34', icon: Bell, color: 'bg-green-500' },
        { title: 'Team Members', value: '8', icon: Users, color: 'bg-purple-500' },
        { title: 'Event Analytics', value: '+24%', icon: TrendingUp, color: 'bg-yellow-500' },
      ].map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className={`${stat.color} p-3 rounded-full`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
        <div className="space-y-4">
          {['Tech Symposium', 'Cultural Fest', 'Sports Meet'].map((event, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">{event}</h3>
                <p className="text-sm text-gray-600">March {15 + index}, 2024</p>
              </div>
              <span className="px-3 py-1 text-sm text-green-700 bg-green-100 rounded-full">
                On Track
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">AI Insights</h2>
        <div className="space-y-4">
          {[
            'Attendance prediction: 200+ expected for Tech Symposium',
            'Suggested marketing channels: Instagram, College Website',
            'Resource optimization: Consider outdoor venue',
          ].map((insight, index) => (
            <div key={index} className="flex items-center space-x-3 p-4 bg-indigo-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              <p className="text-sm text-indigo-900">{insight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default Dashboard;
