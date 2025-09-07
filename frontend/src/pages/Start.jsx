import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import '../styles/start.css';

export default function Start() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/language');
  };

  return (
    <>
      <div className="start-container">
        <div className="start-content">
          <h2 className="start-title">Welcome to PixelSpeak</h2>
          <p className="start-subtitle">
            Learn popular languages through interactive lectures and quizzes.
          </p>
          <button className="get-started-button" onClick={handleGetStarted}>
            Get Started
          </button>
          <Navigation />
        </div>
      </div>
    </>

  );
}