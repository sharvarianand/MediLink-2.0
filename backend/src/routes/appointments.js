const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const { createAppointment, getAppointments, updateAppointmentStatus } = require('../controllers/appointmentController');

router.post('/', auth, checkRole(['patient']), createAppointment);
router.get('/', auth, getAppointments);
router.put('/:id/status', auth, updateAppointmentStatus);

module.exports = router; 