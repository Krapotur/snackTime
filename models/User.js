const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    imgSrc: {
        type: String,
        default: '',
    },
    phone: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        unique: true
    },
    points: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('users', userSchema);