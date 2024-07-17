const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const positionSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    imgSrc: {
        type: String,
        default: '',
    },
    composition: {
        type: String,
        default: ''
    },
    weight: {
        type: Number,
        require: true,
        default: 100,
    },
    caloric: {
        type: Number,
        default: 100
    }
})

module.exports = mongoose.model('positions', positionSchema);