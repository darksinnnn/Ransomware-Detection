import React, { useState, useEffect } from 'react';
import { FaShieldAlt, FaBolt, FaDatabase, FaBars, FaSignOutAlt, FaTimes, FaSync, FaPlay } from 'react-icons/fa';
import './Logs.css';

const NavItem = ({ children, href = "#", onClick }) => (
  <a href={href} className="nav-item" onClick={onClick}>
    {children}
  </a>
);

const Button = ({ children, className, icon: Icon, ...props }) => (
  <button
    className={`button ${className}`}
    {...props}
  >
    {Icon && <Icon className="button-icon" />}
    {children}
  </button>
);

export default function LogsPage() {
  const [offset, setOffset] = useState(0);
  const [particles, setParticles] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [alertLogs, setAlertLogs] = useState([]);
  const [fileLogs, setFileLogs] = useState([]);
  const [filePath, setFilePath] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setOffset(prev => (prev + 1) % 360);
    }, 50);

    setParticles(Array.from({ length: 50 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 4 + 1,
      speedX: Math.random() * 2 - 1,
      speedY: Math.random() * 2 - 1,
    })));

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const animateParticles = () => {
      setParticles(prevParticles => prevParticles.map(particle => ({
        ...particle,
        x: (particle.x + particle.speedX + window.innerWidth) % window.innerWidth,
        y: (particle.y + particle.speedY + window.innerHeight) % window.innerHeight,
      })));
    };

    const animationFrame = requestAnimationFrame(animateParticles);
    return () => cancelAnimationFrame(animationFrame);
  }, [particles]);

  const toggleContact = (e) => {
    e.preventDefault();
    setIsContactOpen(!isContactOpen);
  };

  const fetchLogs = async () => {
    try {
      const response = await fetch('http://localhost:5000/get-logs');
      const data = await response.json();
      setAlertLogs(data.alertLogs);
      setFileLogs(data.fileLogs);
    } catch (error) {
      console.error("Error fetching logs", error);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000); // Fetch logs every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const handleStartDetection = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/start-ransomware-detection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filePath }),
      });
      const data = await response.json();
      console.log(data.status);
      // Clear the input field after successful submission
      setFilePath('');
    } catch (error) {
      console.error("Error starting detection", error);
    }
  };

  return (
    <div className="logs-page" style={{ '--gradient-offset': `${offset}deg` }}>
      <header className="header">
        <nav className="nav-container">
          <a href="#" className="logo">DistributeX</a>
          <div className="nav-links">
            <NavItem href="/">Home</NavItem>
            <NavItem>Features</NavItem>
            <NavItem href="#" onClick={toggleContact}>Contact Us</NavItem>
            <NavItem href="/signout">
              <FaSignOutAlt className="icon-inline" />
              Sign Out
            </NavItem>
          </div>
          <Button 
            className="menu-button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <FaBars />
          </Button>
        </nav>
        {isMenuOpen && (
          <div className="mobile-menu">
            <NavItem href="/">Home</NavItem>
            <NavItem>Features</NavItem>
            <NavItem href="#" onClick={toggleContact}>Contact Us</NavItem>
            <NavItem href="/signout">
              <FaSignOutAlt className="icon-inline" />
              Sign Out
            </NavItem>
          </div>
        )}
      </header>

      <main className="main-content">
        <section className="logs-section">
          <h1 className="logs-title">Ransomware Detection Logs</h1>
          <form onSubmit={handleStartDetection} className="file-path-form">
            <input
              type="text"
              value={filePath}
              onChange={(e) => setFilePath(e.target.value)}
              placeholder="Enter path to ransomware detection Python file"
              className="file-path-input"
            />
            <Button type="submit" className="start-detection-button" icon={FaPlay}>
              Start Detection
            </Button>
          </form>
          <Button className="refresh-button" onClick={fetchLogs} icon={FaSync}>
            Refresh Logs
          </Button>
          <div className="logs-container">
            <h2 className="logs-subtitle">Alert Logs</h2>
            {alertLogs.length > 0 ? (
              alertLogs.map((log, index) => (
                <div key={index} className="log-entry">{log}</div>
              ))
            ) : (
              <p>No alert logs available. Start the ransomware detection to see logs.</p>
            )}
          </div>
          <div className="logs-container">
            <h2 className="logs-subtitle">File Logs</h2>
            {fileLogs.length > 0 ? (
              fileLogs.map((log, index) => (
                <div key={index} className="log-entry">{log}</div>
              ))
            ) : (
              <p>No file logs available. Start the ransomware detection to see logs.</p>
            )}
          </div>
        </section>

        {isContactOpen && (
          <div className="contact-overlay">
            <div className="contact-modal">
              <Button className="close-button" onClick={toggleContact}>
                <FaTimes />
              </Button>
              <h2 className="contact-title">Contact Us</h2>
              <div className="iframe-container">
                <iframe 
                  src="https://forms.gle/Ag75NRLezRdGSGiZ8" 
                  width="100%" 
                  height="100%" 
                  frameBorder="0" 
                  marginHeight="0" 
                  marginWidth="0"
                >
                  Loading…
                </iframe>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>&copy; 2024 DistributeX. All rights reserved.</p>
      </footer>

      <div className="particles">
        {particles.map((particle, index) => (
          <div
            key={index}
            className="particle"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
          />
        ))}
      </div>
    </div>
  );
}