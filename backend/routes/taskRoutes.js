
const express = require('express');
const router = express.Router();
const { 
  createTask, 
  getTasks, 
  updateTask,
  deleteTask
} = require('../controllers/taskController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

router.post('/', 
  authMiddleware, 
  roleMiddleware(['teacher']), 
  createTask
);

router.get('/', 
  authMiddleware, 
  getTasks
);

router.patch('/:id', 
  authMiddleware, 
  updateTask
);

router.delete('/:id', 
  authMiddleware, 
  roleMiddleware(['teacher']), 
  deleteTask
);

module.exports = router;