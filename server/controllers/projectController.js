import Project from "../models/Project.js";


// CREATE PROJECT
export const createProject = async (req, res) => {
  try {

    const { title, description, members } = req.body;

    const project = await Project.create({
      title,
      description,
      members,
      createdBy: req.user._id,
    });

    res.status(201).json(project);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// GET ALL PROJECTS
export const getProjects = async (req, res) => {
  try {

    const projects = await Project.find()
      .populate("createdBy", "name email")
      .populate("members", "name email");

    res.status(200).json(projects);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};