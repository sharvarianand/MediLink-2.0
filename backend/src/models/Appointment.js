const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dateTime: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    },
    notes: {
        type: String,
        trim: true
    },
    symptoms: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Index for efficient querying
appointmentSchema.index({ doctorId: 1, dateTime: 1 });
appointmentSchema.index({ patientId: 1, dateTime: 1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment; 