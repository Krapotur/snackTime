const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema({
    status: {
        type: Boolean,
        default: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    login: {
        type: String
    },
    password: {
        type: String,
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
    },
})

module.exports = mongoose.model('clients', clientSchema);