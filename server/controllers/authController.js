import jwt from "jsonwebtoken";

// @desc    Auth admin & get token
// @route   POST /api/auth/login
// @access  Public
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide both email and password" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please provide a valid email address" });
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPass = process.env.ADMIN_PASSWORD;
    const jwtSecret = process.env.JWT_SECRET;

    if (!adminEmail || !adminPass || !jwtSecret) {
      console.error("CRITICAL CONFIGURATION ERROR: Missing ADMIN_EMAIL, ADMIN_PASSWORD, or JWT_SECRET env variables.");
      return res.status(500).json({ 
        message: "Server configuration error: Required environment variables (admin credentials or JWT secret) are not set on the server." 
      });
    }

    if (email.toLowerCase() === adminEmail.toLowerCase() && password === adminPass) {
      const token = jwt.sign(
        { email },
        jwtSecret,
        { expiresIn: "30d" }
      );

      res.json({
        email,
        token,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error during login" });
  }
};
