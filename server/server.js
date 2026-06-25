import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

// Load env variables first — must happen before any other import uses process.env
dotenv.config();

// Connect to Database
connectDB();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());

app.use(express.json());

// ─── Static uploads fallback (localhost only) ───────────────────────────────
// In production ALL images are served from Cloudinary CDN URLs stored in
// MongoDB — this static route is only used in local development when you
// may still have leftover files in the uploads/ folder.
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ─── API routes ─────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/upload", uploadRoutes);

// Root health-check
app.get("/", (req, res) => {
  res.send("Portfolio API is running ✅");
});

// ─── Global error handler ───────────────────────────────────────────────────
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`
  );
});
