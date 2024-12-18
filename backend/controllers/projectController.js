const Project = require('../models/Project');
const User = require('../models/User');
const Task = require('../models/Task');


exports.createProject = async (req, res) => {
  try {
    const { title, description, students } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const newProject = new Project({
      title,
      description,
      teacher: req.user._id,
      students: students || [],
      status: 'pending'
    });

    const savedProject = await newProject.save();

    // Update students with the new project
    if (students && students.length > 0) {
      await User.updateMany(
        { _id: { $in: students } },
        { $push: { projects: savedProject._id } }
      );
    }

    res.status(201).json(savedProject);
  } catch (error) {
    res.status(500).json({ message: 'Error creating project', error: error.message });
  }
};

// Get all projects (for teachers, all projects; for students, their assigned projects)
exports.getProjects = async (req, res) => {
  try {
    let projects;
    
    if (req.user.role === 'teacher') {
      projects = await Project.find({ teacher: req.user._id })
        .populate('students', 'name email')
        .populate('tasks');
    } else {
      projects = await Project.find({ students: req.user._id })
        .populate('teacher', 'name email')
        .populate('tasks');
    }

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('teacher', 'name email')
      .populate('students', 'name email')
      .populate({
        path: 'tasks',
        populate: {
          path: 'assignedTo',
          select: 'name email'
        }
      });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (req.user.role === 'student' && !project.students.some(student => student._id.equals(req.user._id))) {
      return res.status(403).json({ message: 'Unauthorized access to project' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching project', error: error.message });
  }
};

exports.updateProjectStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (req.user.role !== 'teacher' && !project.students.includes(req.user._id)) {
      return res.status(403).json({ message: 'Unauthorized to update project' });
    }

    project.status = status;
    const updatedProject = await project.save();

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: 'Error updating project', error: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (req.user.role !== 'teacher' || !project.teacher.equals(req.user._id)) {
      return res.status(403).json({ message: 'Unauthorized to delete project' });
    }

    await User.updateMany(
      { _id: { $in: project.students } },
      { $pull: { projects: project._id } }
    );

    await Task.deleteMany({ project: project._id });

    await project.remove();

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project', error: error.message });
  }
};