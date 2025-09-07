// LessonsContext.js
import React, { createContext, useContext, useState } from 'react';

const LessonsContext = createContext();

export const LessonsProvider = ({ children }) => {
  const initialLessonsData = {
    English: [
      { id: 1, title: 'Beginner', completed: false },
      { id: 2, title: 'Intermediate', completed: false },
      { id: 3, title: 'Advanced', completed: false },
    ],
    // Add other languages with similar structure
    Telugu: [
      { id: 1, title: 'Beginner', completed: false },
      { id: 2, title: 'Intermediate', completed: false },
      { id: 3, title: 'Advanced', completed: false },
    ],
    Hindi: [
      { id: 1, title: 'Beginner', completed: false },
      { id: 2, title: 'Intermediate', completed: false },
      { id: 3, title: 'Advanced', completed: false },
    ]
  };

  const [lessons, setLessons] = useState(initialLessonsData);

  const updateLessonCompletion = (language, lessonId, completed) => {
    setLessons((prevLessons) => ({
      ...prevLessons,
      [language]: prevLessons[language].map((lesson) =>
        lesson.id === lessonId ? { ...lesson, completed } : lesson
      ),
    }));
  };

  return (
    <LessonsContext.Provider value={{ lessons, updateLessonCompletion }}>
      {children}
    </LessonsContext.Provider>
  );
};

export const useLessons = () => useContext(LessonsContext);