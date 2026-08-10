import express from "express";
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";
import protect from "../middleware/authMiddleware.js";
import dbCheck from "../middleware/dbCheckMiddleware.js";

const router = express.Router();

// Reject all requests immediately when DB is not connected
router.use(dbCheck);

router.route("/")
  .get(getProjects)
  .post(protect, createProject);

router.route("/:id")
  .get(getProjectById)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

export default router;
