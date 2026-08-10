import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

// Load env variables first — must happen before any other import uses process.env
dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Middlewares ─────────────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "http://localhost:5173",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. curl, Render health checks)
      if (!origin) return callback(null, true);
      // Normalize trailing slashes before comparison
      const normalized = origin.replace(/\/$/, "");
      const isAllowed = allowedOrigins.some(
        (o) => o.replace(/\/$/, "") === normalized
      );
      if (isAllowed) return callback(null, true);
      callback(new Error(`CORS: origin not allowed — ${origin}`));
    },
    credentials: true,
  })
);

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

// ─── Health check ────────────────────────────────────────────────────────────
// readyState: 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
app.get("/api/health", (req, res) => {
  const state = mongoose.connection.readyState;
  const dbConnected = state === 1;
  const statusLabel = ["disconnected", "connected", "connecting", "disconnecting"][state] || "unknown";

  if (dbConnected) {
    return res.status(200).json({
      success: true,
      database: { status: statusLabel },
    });
  }
  return res.status(503).json({
    success: false,
    database: { status: statusLabel },
  });
});

// Root ping
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

// ─── Start server only after DB connects ────────────────────────────────────
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(
        `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`
      );
    });
  } catch (error) {
    console.error("Database connection failed — server will NOT start:", error.message);
    process.exit(1);
  }
};

startServer();
