import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBrain, FaUpload, FaChartBar, FaHome } from 'react-icons/fa';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: <FaHome /> },
    { path: '/upload', label: 'Upload Resume', icon: <FaUpload /> },
    { path: '/dashboard', label: 'Dashboard', icon: <FaBrain /> },
    { path: '/statistics', label: 'Statistics', icon: <FaChartBar /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <FaBrain style={{ marginRight: '8px' }} />
          AI Resume Analyzer
        </Link>
        
        <ul className={`nav-links ${isMenuOpen ? 'nav-links-open' : ''}`}>
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.icon}
                <span style={{ marginLeft: '8px' }}>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
        
        <button
          className="nav-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      
      <style jsx>{`
        .nav-links-open {
          display: flex !important;
          flex-direction: column;
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          padding: 1rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        
        .nav-link {
          display: flex;
          align-items: center;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        
        .nav-link.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white !important;
        }
        
        .nav-toggle {
          display: none;
          flex-direction: column;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
        }
        
        .nav-toggle span {
          width: 25px;
          height: 3px;
          background: #333;
          margin: 3px 0;
          transition: 0.3s;
          border-radius: 2px;
        }
        
        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }
          
          .nav-toggle {
            display: flex;
          }
          
          .nav-links-open {
            display: flex;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar; 