import express from "express";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTaskById,
  updateTask,
} from "../controllers/task.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const taskRouter = express.Router();

taskRouter.post("/create-task", authMiddleware, createTask);
taskRouter.get("/", authMiddleware, getAllTasks);
taskRouter.get("/get-task/:id", authMiddleware, getTaskById);
taskRouter.put("/update-task/:id", authMiddleware, updateTask);
taskRouter.delete("/delete-task/:id", authMiddleware, deleteTask);

export default taskRouter;
