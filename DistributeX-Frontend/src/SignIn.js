import React, { useState, useEffect } from 'react';
import { FaGoogle, FaMicrosoft, FaEnvelope } from 'react-icons/fa';
import { auth, googleProvider, microsoftProvider } from './Firebase'; // Update Firebase imports
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './SignIn.css';

const Button = ({ children, className, icon: Icon, ...props }) => (
  <button className={`button ${className}`} {...props}>
    {Icon && <Icon className="button-icon" />}
    {children}
  </button>
);

export default function SignInPage() {
  const navigate = useNavigate(); // Initialize navigate function
  const [offset, setOffset] = useState(0);
  const [particles, setParticles] = useState([]);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setOffset((prev) => (prev + 1) % 360);
    }, 50);

    setParticles(
      Array.from({ length: 50 }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 4 + 1,
        speedX: Math.random() * 2 - 1,
        speedY: Math.random() * 2 - 1,
      }))
    );

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const animateParticles = () => {
      setParticles((prevParticles) =>
        prevParticles.map((particle) => ({
          ...particle,
          x: (particle.x + particle.speedX + window.innerWidth) % window.innerWidth,
          y: (particle.y + particle.speedY + window.innerHeight) % window.innerHeight,
        }))
      );
    };

    const animationFrame = requestAnimationFrame(animateParticles);
    return () => cancelAnimationFrame(animationFrame);
  }, [particles]);

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Signed in with email and password!");
      navigate('/home'); // Redirect to Home.js upon successful sign-in
    } catch (error) {
      console.error("Error signing in with email and password", error);
      alert("Failed to sign in: " + error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      alert("Signed in with Google!");
      navigate('/home'); // Redirect to Home.js upon successful Google sign-in
    } catch (error) {
      console.error("Error signing in with Google", error);
      alert("Failed to sign in: " + error.message);
    }
  };

  const handleMicrosoftSignIn = async () => {
    try {
      await signInWithPopup(auth, microsoftProvider);
      alert("Signed in with Microsoft!");
      navigate('/home'); // Redirect to Home.js upon successful Microsoft sign-in
    } catch (error) {
      console.error("Error signing in with Microsoft", error);
      alert("Failed to sign in: " + error.message);
    }
  };

  const toggleContact = (e) => {
    e.preventDefault();
    setIsContactOpen(!isContactOpen);
  };

  return (
    <div className="sign-in-page" style={{ '--gradient-offset-signin': `${offset}deg` }}>
      <header className="sign-in-header">
        <h1 className="sign-in-title">DistributeX</h1>
        <Button className="contact-button-signin" onClick={toggleContact} icon={FaEnvelope}>
          Contact Us
        </Button>
      </header>
      <div className="sign-in-container">
        <h2 className="sign-in-title">Sign In</h2>
        <form className="sign-in-form" onSubmit={handleEmailSignIn}>
          <div className="form-group-signin">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group-signin">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button className="sign-in-button" type="submit">
            Sign In
          </Button>
        </form>

        <div className="social-sign-in">
          <Button className="google-button" icon={FaGoogle} onClick={handleGoogleSignIn}>
            Sign in with Google
          </Button>
          <Button className="microsoft-button" icon={FaMicrosoft} onClick={handleMicrosoftSignIn}>
            Sign in with Microsoft
          </Button>
        </div>

        <div className="additional-options">
          <a href="#" className="forgot-password">Forgot Password?</a>
          <a href="#" className="create-account">Create Account</a>
        </div>
      </div>

      {isContactOpen && (
        <div className="contact-overlay-signin">
          <div className="contact-modal-signin">
            <Button className="close-button-signin" onClick={toggleContact}>
              &times;
            </Button>
            <h2 className="contact-title-signin">Contact Us</h2>
            <div className="iframe-container-signin">
              <iframe 
                src="https://docs.google.com/forms/d/e/1FAIpQLSc_8fQkRjJDe8ue0rDOJXNQkdq8Gu4lbRfVoZP1V1JUfKwdRw/viewform?embedded=true" 
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

      <div className="particles-signin">
        {particles.map((particle, index) => (
          <div
            key={index}
            className="particle-signin"
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
