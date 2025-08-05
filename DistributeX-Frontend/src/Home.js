import React, { useState, useEffect } from 'react';
import { FaShieldAlt, FaBolt, FaDatabase, FaBars, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import './Home.css';
import { useNavigate } from 'react-router-dom';


const NavItem = ({ children, href = "#", onClick }) => (
  <a href={href} className="nav-item" onClick={onClick}>
    {children}
  </a>
);

const Button = ({ children, className, ...props }) => (
  <button
    className={`button ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Card = ({ icon: Icon, title, description }) => (
  <div className="card">
    <Icon className="card-icon" />
    <h3 className="card-title">{title}</h3>
    <p className="card-description">{description}</p>
  </div>
);

export default function HomePage() {
  const navigate = useNavigate();

  const [offset, setOffset] = useState(0);
  const [particles, setParticles] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

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

  const handleStartDetection = () => {
    navigate('/logs'); // Navigate to Logs page
  };

  return (
    <div className="home-page" style={{ '--gradient-offset': `${offset}deg` }}>
      <header className="header">
        <nav className="nav-container">
          <a href="#" className="logo">DistributeX</a>
          <div className="nav-links">
            <NavItem>Home</NavItem>
            <NavItem>Features</NavItem>
            {/* <NavItem>Pricing</NavItem> */}
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
            <NavItem>Home</NavItem>
            <NavItem>Features</NavItem>
            {/* <NavItem>Pricing</NavItem> */}
            <NavItem href="#" onClick={toggleContact}>Contact Us</NavItem>
            <NavItem href="/signout">
              <FaSignOutAlt className="icon-inline" />
              Sign Out
            </NavItem>
          </div>
        )}
      </header>

      <main className="main-content">
        <section className="hero-section">
          <h1 className="hero-title">Protect Your Data with DistributeX</h1>
          <p className="hero-description">
            Advanced ransomware detection and mitigation for your peace of mind
          </p>
          <Button className="cta-button primary">
            Get Started
          </Button>
        </section>

        <section className="features-section">
          <Card
            icon={FaShieldAlt}
            title="Real-time Detection"
            description="Identify threats instantly with our advanced AI-powered system"
          />
          <Card
            icon={FaBolt}
            title="Rapid Mitigation"
            description="Stop attacks in their tracks with automated response protocols"
          />
          <Card
            icon={FaDatabase}
            title="Data Recovery"
            description="Restore your valuable information with our secure backup solutions"
          />
        </section>

        <section className="cta-section">
          <h2 className="cta-title">Ready to secure your data?</h2>
          <p className="cta-description">
            Join thousands of satisfied customers who trust DistributeX
          </p>
          <Button className="cta-button secondary" onClick={handleStartDetection}>
              Start Ransomware Detection
          </Button>
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