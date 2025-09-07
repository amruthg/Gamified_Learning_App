import { GoogleGenerativeAI } from '@google/generative-ai';
import Lesson from '../model/lessonModel.js';

const genAI = new GoogleGenerativeAI('AIzaSyCTnhiYH59608ExLr0ak4RvSq_dhzLxka8');
const lessonLevels = ['Beginner', 'Intermediate', 'Advanced'];

// Function to generate a lesson for a specific level
const generateLessonContent = async (topic, level) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  
  const prompt = `Generate a ${level} level lesson on language ${topic} so that the user can learn from the response you give. 
    Include clear, engaging information appropriate for the ${level} level.
    The content should be well-structured and educational.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};

// Function to generate questions based on lesson content
const generateQuestions = async (lessonContent) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  const questions = [];

  for (let i = 1; i <= 5; i++) {
    try {
      const prompt = `Based on this lesson content, create a multiple-choice question.
        The response MUST follow this EXACT format:
        Question: [your question here]
        A) [first option]
        B) [second option]
        C) [third option]
        D) [fourth option]
        Answer: [A, B, C, or D]

        Lesson content:
        ${lessonContent}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const questionData = response.text();
      
      // Parse the response
      const parsedQuestion = parseQuestionResponse(questionData);
      
      // Validate parsed question before adding
      if (isValidQuestion(parsedQuestion)) {
        questions.push(parsedQuestion);
      } else {
        console.warn(`Skipping invalid question ${i}: `, parsedQuestion);
        // Retry this question
        i--;
      }
    } catch (error) {
      console.error(`Error generating question ${i}:`, error);
      // Skip this question and continue
      continue;
    }
  }

  return questions;
};

// Helper function to validate question object
const isValidQuestion = (question) => {
  return (
    question &&
    question.question &&
    question.question.trim() !== '' &&
    Array.isArray(question.options) &&
    question.options.length === 4 &&
    question.options.every(opt => opt && opt.trim() !== '') &&
    question.correctAnswer &&
    question.correctAnswer.trim() !== ''
  );
};

// Helper function to parse the question response
const parseQuestionResponse = (responseText) => {
  try {
    const lines = responseText.split('\n').filter(line => line.trim() !== '');
    
    // Extract question
    const questionLine = lines.find(line => line.startsWith('Question:'));
    const question = questionLine ? questionLine.replace('Question:', '').trim() : '';
    
    // Extract options
    const options = lines
      .filter(line => /^[A-D]\)/.test(line.trim()))
      .map(opt => opt.replace(/^[A-D]\)\s*/, '').trim());
    
    // Extract answer
    const answerLine = lines.find(line => line.startsWith('Answer:'));
    let answer = answerLine ? answerLine.replace('Answer:', '').trim() : '';
    
    // If answer is a letter (A, B, C, D), get the corresponding option
    if (answer.match(/^[A-D]$/)) {
      const index = answer.charCodeAt(0) - 65; // Convert A->0, B->1, etc.
      answer = options[index] || '';
    }

    // Validate all parts are present
    if (!question || options.length !== 4 || !answer) {
      throw new Error('Invalid question format');
    }

    return {
      question,
      options,
      correctAnswer: answer
    };
  } catch (error) {
    console.error('Error parsing question response:', error);
    return null;
  }
};

// Main function to generate lessons for a topic at all levels
const generateLessonsForTopic = async (topic) => {
  const lessons = [];

  for (let level of lessonLevels) {
    try {
      const lessonContent = await generateLessonContent(topic, level);
      const questions = await generateQuestions(lessonContent);

      // Validate we have enough valid questions
      if (questions.length < 3) {
        throw new Error(`Not enough valid questions generated for ${level} level`);
      }

      const lesson = new Lesson({
        topic,
        level,
        content: lessonContent,
        questions,
      });

      // Validate lesson before saving
      await lesson.validate();
      await lesson.save();
      lessons.push(lesson);
    } catch (error) {
      console.error(`Error generating ${level} lesson:`, error);
      throw error;
    }
  }

  return lessons;
};

// Controller function for generating lessons
const createLessons = async (req, res) => {
  const { topic } = req.body;

  if (!topic || topic.trim() === '') {
    return res.status(400).json({ message: 'Topic is required' });
  }

  try {
    const lessons = await generateLessonsForTopic(topic);
    res.status(201).json({ 
      message: 'Lessons generated successfully', 
      lessons 
    });
  } catch (error) {
    console.error('Error generating lessons:', error);
    res.status(500).json({ 
      message: 'Could not generate lessons', 
      error: error.message 
    });
  }
};

// Controller function for fetching lessons by topic
const getLessonsByTopic = async (req, res) => {
  const { topic } = req.params;

  try {
    const lessons = await Lesson.find({ topic });
    if (!lessons || lessons.length === 0) {
      return res.status(404).json({ message: 'No lessons found for this topic' });
    }
    res.status(200).json({ lessons });
  } catch (error) {
    res.status(500).json({ 
      message: 'Could not fetch lessons', 
      error: error.message 
    });
  }
};

export { createLessons, getLessonsByTopic };