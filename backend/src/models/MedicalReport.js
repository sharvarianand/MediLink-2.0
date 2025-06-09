const mongoose = require('mongoose');

const medicalReportSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        required: true
    },
    extractedText: {
        type: String
    },
    reportType: {
        type: String,
        required: true,
        enum: ['lab', 'prescription', 'xray', 'other']
    },
    date: {
        type: Date,
        required: true
    },
    notes: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Index for efficient querying
medicalReportSchema.index({ patientId: 1, date: -1 });
medicalReportSchema.index({ doctorId: 1, date: -1 });

const MedicalReport = mongoose.model('MedicalReport', medicalReportSchema);

module.exports = MedicalReport; 