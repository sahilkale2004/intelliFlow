import React from 'react';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const Tasks = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
          Add Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {["To Do", "In Progress", "Completed"].map((status, statusIndex) => (
          <div key={statusIndex} className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">{status}</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((task, taskIndex) => (
                <div
                  key={taskIndex}
                  className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:shadow transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium text-gray-900">
                        {status === "To Do" && "Design event posters"}
                        {status === "In Progress" && "Contact vendors"}
                        {status === "Completed" && "Book venue"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {status === "To Do" && "Create promotional materials for social media"}
                        {status === "In Progress" && "Negotiate with catering services"}
                        {status === "Completed" && "Secure main auditorium for symposium"}
                      </p>
                    </div>
                    {status === "To Do" && <Clock className="h-5 w-5 text-yellow-500" />}
                    {status === "In Progress" && <AlertCircle className="h-5 w-5 text-blue-500" />}
                    {status === "Completed" && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img
                        className="h-6 w-6 rounded-full"
                        src={`https://i.pravatar.cc/150?img=${statusIndex * 3 + taskIndex}`}
                        alt="User avatar"
                      />
                      <span className="text-sm text-gray-600">John Doe</span>
                    </div>
                    <span className="text-sm text-gray-600">Due Mar 15</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
