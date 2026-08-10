import express from "express";
import {
  submitContactMessage,
  getContactMessages,
  deleteContactMessage,
} from "../controllers/contactController.js";
import protect from "../middleware/authMiddleware.js";
import dbCheck from "../middleware/dbCheckMiddleware.js";

const router = express.Router();

// Reject all requests immediately when DB is not connected
router.use(dbCheck);

router.route("/")
  .post(submitContactMessage)
  .get(protect, getContactMessages);

router.route("/:id")
  .delete(protect, deleteContactMessage);

export default router;
