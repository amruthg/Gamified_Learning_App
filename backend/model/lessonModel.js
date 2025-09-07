// models/lessonModel.js
import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  options: [{
    type: String,
    required: true,
    trim: true
  }],
  correctAnswer: {
    type: String,
    required: true,
    trim: true
  }
});

const lessonSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
    trim: true
  },
  level: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  questions: [questionSchema]
}, {
  timestamps: true
});

const Lesson = mongoose.model('Lesson', lessonSchema);

export default Lesson;