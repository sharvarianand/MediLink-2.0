const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    role: {
        type: String,
        enum: ['doctor', 'patient'],
        required: true
    },
    profile: {
        age: {
            type: Number,
            min: 0,
            max: 120
        },
        gender: {
            type: String,
            enum: ['male', 'female', 'other']
        },
        specialization: {
            type: String,
            required: function() {
                return this.get('role') === 'doctor';
            }
        },
        phone: {
            type: String,
            trim: true
        },
        address: {
            type: String,
            trim: true
        }
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User; 