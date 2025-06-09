const Appointment = require('../models/Appointment');

const createAppointment = async (req, res) => {
    try {
        const { doctorId, dateTime, symptoms, notes } = req.body;
        const appointment = new Appointment({
            doctorId,
            patientId: req.user._id,
            dateTime,
            symptoms,
            notes
        });
        await appointment.save();
        res.status(201).json(appointment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAppointments = async (req, res) => {
    try {
        const role = req.user.role;
        let filter = {};
        if (role === 'doctor') filter.doctorId = req.user._id;
        if (role === 'patient') filter.patientId = req.user._id;
        const appointments = await Appointment.find(filter)
            .populate('doctorId', 'name email profile')
            .populate('patientId', 'name email profile')
            .sort({ dateTime: -1 });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const appointment = await Appointment.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
        res.json(appointment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createAppointment,
    getAppointments,
    updateAppointmentStatus
}; 