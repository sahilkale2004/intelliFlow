import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, CheckSquare, BarChart2, Layout } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: Layout },
    { path: '/events', label: 'Events', icon: Calendar },
    { path: '/tasks', label: 'Tasks', icon: CheckSquare },
    { path: '/analytics', label: 'Analytics', icon: BarChart2 },
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Calendar className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-800">IntelliFlow</span>
          </Link>
          
          <div className="hidden md:flex space-x-8">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === path
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;