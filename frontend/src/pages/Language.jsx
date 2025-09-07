// src/components/Language.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from './Loader';
import '../styles/language.css';
import Navigation from '../components/Navigation';

export default function Language() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLanguageSelection = async (language) => {
    try {
      setLoading(true); // Show loader
      // Trigger the backend to generate lesson content
      await axios.post('http://localhost:3000/api/lessons/generate', { topic: language });
      
      // After generation is complete, navigate to the next page
      navigate('/path', { state: { language } });
    } catch (error) {
      console.error('Error generating lesson content:', error);
      // Optionally show an error message
    } finally {
      setLoading(false); // Hide loader
    }
  };

  if (loading) {
    return <Loader />; // Show loader while waiting for response
  }

  return (
    <>
      <div className="language-container">
        <div className="blurred-box">
          <p>Choose Your Language</p>
          <div className="language-buttons">
            <button onClick={() => handleLanguageSelection('English')}>English</button>
            <button onClick={() => handleLanguageSelection('Telugu')}>Telugu</button>
            <button onClick={() => handleLanguageSelection('Hindi')}>Hindi</button>
          </div>
        </div>
      </div>
      <Navigation></Navigation>
    </>

  );
}