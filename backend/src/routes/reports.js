const express = require('express');
const router = express.Router();
const multer = require('multer');
const { auth } = require('../middleware/auth');
const { uploadReport, getReports } = require('../controllers/medicalReportController');

const upload = multer({ dest: 'uploads/' });

router.post('/upload', auth, upload.single('file'), uploadReport);
router.get('/:userId', auth, getReports);

module.exports = router; 