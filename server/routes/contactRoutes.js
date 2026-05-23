import express from "express";
import {
  submitContactMessage,
  getContactMessages,
  deleteContactMessage,
} from "../controllers/contactController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .post(submitContactMessage)
  .get(protect, getContactMessages);

router.route("/:id")
  .delete(protect, deleteContactMessage);

export default router;
