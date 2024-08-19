const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
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
        type: String,
        unique: true,
        required: true
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
        unique: true,
        default: ''
    },
    // group: {
    //     ref: 'groups',
    //     type: Schema.Types.ObjectId,
    //     default: 'Клиент'
    // },
    // restaurant: {
    //     ref: 'restaurants',
    //     type: Schema.Types.ObjectId,
    //     default: 'Оазис'
    // }
})

module.exports = mongoose.model('users', userSchema);