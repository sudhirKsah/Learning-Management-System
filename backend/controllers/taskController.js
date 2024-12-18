const Task = require('../models/Task');
const Project = require('../models/Project');

exports.createTask = async (req, res) => {
  try {
    const { title, description, projectId, assignedTo } = req.body;

    if (!title || !description || !projectId) {
      return res.status(400).json({ message: 'Title, description, and project are required' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (req.user.role !== 'teacher' || !project.teacher.equals(req.user._id)) {
      return res.status(403).json({ message: 'Unauthorized to create task' });
    }

    const newTask = new Task({
      title,
      description,
      project: projectId,
      assignedTo,
      status: 'not-started',
      score: 0
    });

    const savedTask = await newTask.save();

    project.tasks.push(savedTask._id);
    await project.save();

    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    let tasks;
    
    if (req.user.role === 'teacher') {
      tasks = await Task.find()
        .populate('project', 'title')
        .populate('assignedTo', 'name email');
    } else {
      tasks = await Task.find({ assignedTo: req.user._id })
        .populate('project', 'title')
        .populate('assignedTo', 'name email');
    }

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { status, score, notes } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = await Project.findById(task.project);
    const isTeacher = req.user.role === 'teacher' && project.teacher.equals(req.user._id);
    const isAssignedStudent = req.user._id.equals(task.assignedTo);

    if (!isTeacher && !isAssignedStudent) {
      return res.status(403).json({ message: 'Unauthorized to update task' });
    }

    if (status) task.status = status;
    if (score !== undefined) task.score = score;
    if (notes) task.notes = notes;

    const updatedTask = await task.save();

    const projectTasks = await Task.find({ project: project._id });
    const allTasksCompleted = projectTasks.every(t => t.status === 'completed');

    if (allTasksCompleted) {
      project.status = 'completed';
      await project.save();
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = await Project.findById(task.project);
    if (req.user.role !== 'teacher' || !project.teacher.equals(req.user._id)) {
      return res.status(403).json({ message: 'Unauthorized to delete task' });
    }

    project.tasks.pull(task._id);
    await project.save();

    await task.remove();

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
};