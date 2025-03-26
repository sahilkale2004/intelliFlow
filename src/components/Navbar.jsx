import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, CheckSquare, BarChart2, Layout, LogIn } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: Layout },
    { path: '/events', label: 'Events', icon: Calendar },
    { path: '/tasks', label: 'Tasks', icon: CheckSquare },
    { path: '/analytics', label: 'Analytics', icon: BarChart2 },
    {path: '/login', label: 'Login', icon: LogIn},
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="brand">
          <Calendar className="brand-icon" />
          <span className="brand-name">IntelliFlow</span>
        </Link>
        
        <div className="nav-links">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`nav-item ${location.pathname === path ? 'active' : ''}`}
            >
              <Icon className="nav-icon" />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
