import express from "express";

import {
  createTask,
  getTasks,
  updateTaskStatus,
  deleteTask,
} from "../controllers/taskController.js";

import { protect } from "../middleware/authMiddleware.js";

import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/", protect, adminOnly, createTask);

router.get("/", protect, getTasks);

router.put("/:id", protect, updateTaskStatus);

router.delete("/:id", protect, adminOnly, deleteTask);

export default router;