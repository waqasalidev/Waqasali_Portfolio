import Project from "../models/Project.js";
import { deleteImageFromCloudinary } from "../config/cloudinary.js";

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({}).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Public
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private/Admin
export const createProject = async (req, res) => {
  try {
    const { title, description, images, technologies, githubLink, liveDemoLink, category } = req.body;

    const project = new Project({
      title,
      description,
      images,
      technologies: Array.isArray(technologies) ? technologies : technologies.split(",").map(t => t.trim()),
      githubLink,
      liveDemoLink,
      category,
    });

    const createdProject = await project.save();
    res.status(201).json(createdProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private/Admin
export const updateProject = async (req, res) => {
  try {
    const { title, description, images, technologies, githubLink, liveDemoLink, category } = req.body;

    const project = await Project.findById(req.params.id);

    if (project) {
      // If a new list of images is provided, delete any old images that are no longer present
      if (images) {
        const oldImages = project.images || [];
        const newImages = images || [];
        const imagesToDelete = oldImages.filter((img) => !newImages.includes(img));
        
        for (const imgUrl of imagesToDelete) {
          await deleteImageFromCloudinary(imgUrl);
        }
      }

      project.title = title || project.title;
      project.description = description || project.description;
      project.images = images || project.images;
      project.technologies = technologies 
        ? (Array.isArray(technologies) ? technologies : technologies.split(",").map(t => t.trim()))
        : project.technologies;
      project.githubLink = githubLink !== undefined ? githubLink : project.githubLink;
      project.liveDemoLink = liveDemoLink !== undefined ? liveDemoLink : project.liveDemoLink;
      project.category = category || project.category;

      const updatedProject = await project.save();
      res.json(updatedProject);
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      // Delete project images from Cloudinary before removing the project record
      if (project.images && project.images.length > 0) {
        for (const imgUrl of project.images) {
          await deleteImageFromCloudinary(imgUrl);
        }
      }

      await Project.deleteOne({ _id: req.params.id });
      res.json({ message: "Project removed successfully" });
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
