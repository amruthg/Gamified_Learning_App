import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';
import Header from '../components/Header';
import { useLessons } from '../context/LessonsContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { lessons } = useLessons();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const username = userInfo ? userInfo.username : 'Guest';
    if (username) {
      setUsername(username);
    } else {
      navigate('/auth');
    }
  }, [navigate]);

  const leaderboard = [
    { rank: 1, username: 'Harsh', score: 1100 },
    { rank: 2, username: 'Kumar', score: 100 },
    { rank: 3, username: 'Vinay', score: 900 },
    { rank: 4, username: 'Nilay', score: 800 },
    { rank: 5, username: 'Parth', score: 700 },
    { rank: 6, username: 'Deepak', score: 600 },
    { rank: 7, username: 'Aakash', score: 500 },
  ];

  const handlePathNavigation = (language) => {
    navigate('/path', { state: { language } });
  };

  return (
    <>
      <Header isLoggedIn={true} />
      <div className='dashboard-section'>
        <h2 className="dashboard-title">Welcome, {username}!</h2> {/* Display username */}
        <div className="dashboard-container">
          {/* Language Progress Sections */}
          {Object.keys(lessons).map((language) => (
            <div key={language} className="language-section">
              <h3>{language}</h3>

              {/* Progress Bar for each language */}
              <div className="progress-bar-background">
                <div
                  className="progress-bar"
                  style={{ width: `${calculateProgressPercentage(lessons[language])}%` }}
                ></div>
              </div>

              {/* Display individual lessons' progress */}
              <div className="lessons-list">
                {lessons[language].map((lesson, index) => (
                  <div key={index} className="lesson-item">
                    <div>
                      <h4 className="lesson-title">{lesson.title}</h4>
                      <p className="lesson-progress">
                        {lesson.completed ? 'Completed' : 'Not Completed'}
                      </p>
                    </div>
                    <div className="lesson-progress-bar-background">
                      <div
                        className="lesson-progress-bar"
                        style={{ width: `${lesson.completed ? 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {/* Leaderboard Section */}
          <div className="leaderboard-section">
            <h3>Leaderboard</h3>
            <div className="leaderboard-list">
              {leaderboard.map((player, index) => (
                <div key={index} className="leaderboard-item">
                  <span className="username">{player.rank}. {player.username}</span>
                  <span className="score">{player.score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Utility function to calculate progress percentage
function calculateProgressPercentage(lessons) {
  const totalProgress = lessons.reduce((acc, lesson) => acc + (lesson.completed ? 1 : 0), 0);
  return (totalProgress / lessons.length) * 100;
}
