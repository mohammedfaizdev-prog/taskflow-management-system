import Task from "../models/Task.js";


// CREATE TASK
// CREATE TASK
export const createTask = async (req, res) => {
  try {

    const {
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      project,
    } = req.body;

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      project,
      createdBy: req.user._id,
    });

    res.status(201).json(task);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};



// GET ALL TASKS
// GET TASKS
export const getTasks = async (req, res) => {
  try {

    let tasks;

    // ADMIN → SEE ALL TASKS
    if (req.user.role === "admin") {

      tasks = await Task.find()

        .populate("assignedTo", "name email")
        .populate("project", "title")
        .populate("createdBy", "name");

    } else {

      // MEMBER → SEE ONLY ASSIGNED TASKS
      tasks = await Task.find({
        assignedTo: req.user._id,
      })

        .populate("assignedTo", "name email")
        .populate("project", "title")
        .populate("createdBy", "name");
    }

    res.status(200).json(tasks);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};



// UPDATE TASK STATUS
// UPDATE TASK STATUS
export const updateTaskStatus = async (req, res) => {
  try {

    const task = await Task.findById(req.params.id);

    if (!task) {

      return res.status(404).json({
        message: "Task not found",
      });
    }

    // ADMIN CAN UPDATE ANY TASK
    const isAdmin =
      req.user.role === "admin";

    // ASSIGNED USER CAN UPDATE OWN TASK
    const isAssignedUser =
      task.assignedTo.toString() ===
      req.user._id.toString();

    if (!isAdmin && !isAssignedUser) {

      return res.status(403).json({
        message: "Not authorized",
      });
    }

    task.status =
      req.body.status || task.status;

    const updatedTask = await task.save();

    res.status(200).json(updatedTask);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};



// DELETE TASK
export const deleteTask = async (req, res) => {
  try {

    const task = await Task.findById(req.params.id);

    if (!task) {

      return res.status(404).json({
        message: "Task not found",
      });
    }

    await task.deleteOne();

    res.status(200).json({
      message: "Task deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};