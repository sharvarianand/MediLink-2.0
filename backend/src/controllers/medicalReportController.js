const MedicalReport = require('../models/MedicalReport');
const { extractTextFromFile } = require('../utils/ocr');

const uploadReport = async (req, res) => {
    try {
        const { reportType, date, notes, doctorId } = req.body;
        const file = req.file;
        if (!file) return res.status(400).json({ message: 'No file uploaded' });

        // OCR extraction
        const extractedText = await extractTextFromFile(file.path);

        const report = new MedicalReport({
            patientId: req.user._id,
            doctorId,
            fileUrl: file.path,
            fileName: file.originalname,
            fileType: file.mimetype,
            extractedText,
            reportType,
            date,
            notes
        });
        await report.save();
        res.status(201).json(report);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getReports = async (req, res) => {
    try {
        const { userId } = req.params;
        const reports = await MedicalReport.find({ patientId: userId })
            .populate('doctorId', 'name email')
            .sort({ date: -1 });
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    uploadReport,
    getReports
}; 