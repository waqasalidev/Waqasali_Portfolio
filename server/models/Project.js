import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    technologies: {
      type: [String],
      required: true,
      default: [],
    },
    githubLink: {
      type: String,
      trim: true,
      default: "",
    },
    liveDemoLink: {
      type: String,
      trim: true,
      default: "",
    },
    category: {
      type: String,
      required: true,
      enum: ["Web", "AI", "Dashboard", "Other"],
      default: "Web",
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
