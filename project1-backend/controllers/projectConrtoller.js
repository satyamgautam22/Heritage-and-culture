import mongoose from 'mongoose';
import Project from '../models/project.js';
import User from '../models/Users.js'; // ✅ to get uploader's name

export const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      imageUrl,
      category
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const project = new Project({
      title,
      description,
      imageUrl,
      category,
      uploaderName: user.name
    });

    await project.save();

    return res.status(201).json({
      message: "Project created",
      project
    });

  } catch (err) {
    console.error(err);

    return res.status(400).json({
      message: err.message
    });
  }
};

// Get all projects
export const getAllProjects = async (_req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    return res.status(200).json({ projects, count: projects.length });
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching projects', error: err.message });
  }
};

// Get one project
export const getProjectById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid Project ID' });
  }

  try {
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    return res.status(200).json({ project });
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching project', error: err.message });
  }
};

// Update project
export const updateProject = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid Project ID' });
  }

  try {
    const updated = await Project.findByIdAndUpdate(
      id,
      { ...req.body }, // ✅ update with whatever fields are in body (title, desc, imageUrl, category)
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: 'Project not found' });

    return res.status(200).json({ message: 'Project updated', project: updated });
  } catch (err) {
    return res.status(400).json({ errors: err.errors, message: err.message });
  }
};

// Delete project
export const deleteProject = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid Project ID' });
  }

  try {
    const deleted = await Project.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Project not found' });
    return res.status(200).json({ message: 'Project deleted', id });
  } catch (err) {
    return res.status(500).json({ message: 'Error deleting project', error: err.message });
  }
};

//like 

  export const toggleLike = async (req, res) => {
  try {
    console.log("USER:", req.user);
    console.log("PROJECT ID:", req.params.id);

    const project = await Project.findById(req.params.id);

    console.log("PROJECT:", project);

    // existing code...
  } catch (error) {
    console.error("LIKE ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};