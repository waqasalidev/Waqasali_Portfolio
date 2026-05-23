import nodemailer from "nodemailer";
import Message from "../models/Message.js";

// @desc    Submit a contact message & send email
// @route   POST /api/contact
// @access  Public
export const submitContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    // Save to Database
    const newMessage = new Message({
      name,
      email,
      subject,
      message,
    });
    const savedMessage = await newMessage.save();

    // Nodemailer Email Setup
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_USER, // sends to the admin email
      subject: `Portfolio Contact: ${subject}`,
      html: `
        <h3>New Message from Portfolio Website</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    };

    let emailSent = false;
    try {
      // Check if credentials are set before attempting to send
      if (process.env.EMAIL_USER && process.env.EMAIL_USER !== "your_email@gmail.com") {
        await transporter.sendMail(mailOptions);
        emailSent = true;
      } else {
        console.log("Email credentials not configured. Skipping nodemailer mail send.");
      }
    } catch (mailError) {
      console.error("Nodemailer Error: ", mailError);
      // We do not fail the request since it is saved in the database
    }

    res.status(201).json({
      success: true,
      message: "Message received successfully!",
      data: savedMessage,
      emailSent,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private/Admin
export const getContactMessages = async (req, res) => {
  try {
    const messages = await Message.find({}).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a message
// @route   DELETE /api/contact/:id
// @access  Private/Admin
export const deleteContactMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (message) {
      await Message.deleteOne({ _id: req.params.id });
      res.json({ message: "Message deleted successfully" });
    } else {
      res.status(404).json({ message: "Message not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
