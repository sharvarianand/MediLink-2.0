const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const { getProfile, updateProfile, getDoctors } = require('../controllers/userController');

// Protected routes
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);

// Public routes
router.get('/doctors', getDoctors);

module.exports = router; 