import express from 'express';
import { getAllUsers, login, register } from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
const userRouter = express.Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.get('/', authMiddleware, getAllUsers);

export default userRouter;