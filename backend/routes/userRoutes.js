
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, getStudents } = require('../controllers/userController');
const { authMiddleware } = require('../middleware/authMiddleware');
router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/profile', authMiddleware, getUserProfile);

router.get('/students', getStudents);

module.exports = router;
