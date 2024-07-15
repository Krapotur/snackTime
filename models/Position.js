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
    }
})

module.exports = mongoose.model('positions', positionSchema);