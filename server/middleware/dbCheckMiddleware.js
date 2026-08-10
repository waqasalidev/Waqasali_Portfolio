import mongoose from "mongoose";

/**
 * Middleware that checks whether Mongoose is currently connected to MongoDB.
 * If not, it returns 503 immediately — preventing Mongoose from buffering
 * the query for 10 seconds before timing out.
 *
 * readyState values: 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
 */
const dbCheck = (req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    return next();
  }
  const stateLabel = ["disconnected", "connected", "connecting", "disconnecting"][
    mongoose.connection.readyState
  ] || "unknown";
  console.error(`[dbCheck] MongoDB not connected (state: ${stateLabel}). Rejecting request.`);
  return res.status(503).json({
    message: "Database temporarily unavailable. Please try again shortly.",
  });
};

export default dbCheck;
