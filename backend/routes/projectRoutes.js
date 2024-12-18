
const express = require('express');
const router = express.Router();
const { 
  createProject, 
  getProjects, 
  getProjectById, 
  updateProjectStatus,
  deleteProject
} = require('../controllers/projectController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

router.post('/', 
  authMiddleware, 
  roleMiddleware(['teacher']), 
  createProject
);

router.get('/', 
  authMiddleware, 
  getProjects
);

router.get('/:id', 
  authMiddleware, 
  getProjectById
);

router.patch('/:id/status', 
  authMiddleware, 
  updateProjectStatus
);

router.delete('/:id', 
  authMiddleware, 
  roleMiddleware(['teacher']), 
  deleteProject
);

module.exports = router;