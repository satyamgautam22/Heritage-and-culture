import express from "express";
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  toggleLike  
} from "../controllers/projectConrtoller.js"; // keeping filename as-is per your note
import auth from "../middleware/auth.js";

const router = express.Router();

// List + read
router.get("/projects", getAllProjects);
router.get("/projects/:id", getProjectById);

// Create + update + delete
router.post("/projects", auth, createProject);
router.put("/projects/:id", auth, updateProject);
router.delete("/projects/:id", auth, deleteProject);
router.put("/projects/:id/like",auth, toggleLike);

export default router;
