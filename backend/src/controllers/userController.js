const User = require('../models/User');

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProfile = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'profile'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).json({ message: 'Invalid updates' });
    }

    try {
        updates.forEach(update => req.user[update] = req.body[update]);
        await req.user.save();
        res.json(req.user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getDoctors = async (req, res) => {
    try {
        const doctors = await User.find({ role: 'doctor' })
            .select('name email profile.specialization')
            .sort({ 'profile.specialization': 1 });
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    getDoctors
}; 