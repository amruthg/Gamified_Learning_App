import express from "express";
import Lesson from "../model/lessonModel.js"; // Import the Lesson model
import {
  createLessons,
  getLessonsByTopic,
} from "../controllers/lessonController.js";
import { authenticate } from "../middleware/authMidleware.js";

const router = express.Router();

// Route to generate lessons (protected)
router.post("/generate", createLessons);

// Endpoint to get lessons by topic and level
router.get("/:topic/:level", async (req, res) => {
  try {
    const { topic, level } = req.params;
    const lesson = await Lesson.findOne({ topic, level }); // Adjusted to find one specific lesson
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }
    res.json({ content: lesson.content, questions: lesson.questions });
  } catch (error) {
    console.error("Error retrieving lesson:", error);
    res.status(500).json({ message: "Error retrieving lesson" });
  }
});

export default router;