import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, CheckSquare, BarChart2, Layout, LogIn, Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Layout },
    { path: '/events', label: 'Events', icon: Calendar },
    { path: '/tasks', label: 'Tasks', icon: CheckSquare },
    { path: '/analytics', label: 'Analytics', icon: BarChart2 },
    { path: '/login', label: 'Login', icon: LogIn },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="brand">
          <Calendar className="brand-icon" />
          <span className="brand-name">IntelliFlow</span>
        </Link>

        {/* Menu Button for Mobile */}
        <button className="menu-button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Navigation Links */}
        <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`nav-item ${location.pathname === path ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)} 
            >
              <Icon className="nav-icon" />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
