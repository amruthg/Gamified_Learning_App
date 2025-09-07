// routes/userRoutes.js
import express from 'express';
import {  loginUser, logout, CreateUser } from '../controllers/userController.js';

const router = express.Router();
router.post('/register', CreateUser);
router.post('/login', loginUser);
router.post('/logout', logout);

export default router;
