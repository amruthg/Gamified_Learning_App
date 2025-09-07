import React, { useState, useEffect } from "react";
import "../styles/lecture.css";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import { formatContent } from "../formatcontent.jsx"; // Import the formatContent function

export default function LectureContent() {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize the navigate function
  const { language, level } = location.state || {
    language: "English",
    level: "Beginner",
  };
  const [content, setContent] = useState("");
  const [questions, setQuestions] = useState([]);
  const [showQuestions, setShowQuestions] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); // State to control modal visibility

  useEffect(() => {
    // Fetch lesson content from backend
    const fetchLessonContent = async () => {
      try {
        const response = await fetch(`/api/lessons/${language}/${level}`);
        const data = await response.json();
        setContent(data.content);
        setQuestions(data.questions);
      } catch (error) {
        console.error("Error fetching lesson content:", error);
      }
    };

    fetchLessonContent();
  }, [language, level]);

  const handleStartGame = () => {
    // Navigate to the game page when "Start Game" is pressed
    navigate("/game", { state: { language, level, questions } });
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible); // Toggle the modal visibility
  };

  const handleBack = () => {
    navigate("/path",{state:{language}}); // Navigate back to the specified path
  };

  return (
    <div className="lecture-content">
      <header className="lecture-header">
        <h2>Topic: {language}</h2>
        <p>Level: {level}</p>
      </header>

      <section className="lecture-body">{formatContent(content)}</section>
      
      {/* Back button */}
      <div className="start-game">
        <button onClick={handleBack} className="start-game-button">
          Back
        </button>
      </div>

      <div className="start-game">
        <button onClick={toggleModal} className="start-game-button">
          Game Instructions
        </button>
      </div>

      {!showQuestions && (
        <div className="start-game">
          <button onClick={handleStartGame} className="start-game-button">
            Start Game
          </button>
        </div>
      )}
      
      {showQuestions && (
        <section className="lecture-questions">
          <h3>Questions</h3>
          {questions.map((questionItem, index) => (
            <div key={questionItem._id} className="question-item">
              <p>
                <strong>Q{index + 1}: </strong>
                {questionItem.question}
              </p>
              <div className="options">
                {questionItem.options.map((option, optionIndex) => (
                  <label key={optionIndex} className="option">
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Game Instructions Modal */}
      {isModalVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>How to Play:</h3>
            <ul>
              <li><strong>Start the Game:</strong> Click the "Start Game" button.</li>
              <li><strong>Match Words and Translations:</strong> Asteroids with vocabulary words will descend from the top of the screen. Your task is to select the correct translation from the options before the asteroid reaches the bottom.</li>
              <li><strong>Score Points:</strong> Each correct answer earns points. The game increases in difficulty as your score rises, making it more challenging to keep up with new words.</li>
              <li><strong>End of Game:</strong> The game ends after the total score after finishing the game reaches 200.</li>
              <li><strong>Level Progression:</strong> Successful completion of the game quiz allows users to move to the next proficiency level (beginner to intermediate, intermediate to advanced).</li>
            </ul>
            <h4>Controls:</h4>
            <ul>
              <li><strong>KeyW:</strong> Move forward</li>
              <li><strong>KeyA:</strong> Rotate left</li>
              <li><strong>KeyD:</strong> Rotate right</li>
              <li><strong>Space:</strong> Fire projectiles</li>
            </ul>
            <button onClick={toggleModal} className="close-modal-button">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
