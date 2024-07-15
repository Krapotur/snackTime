const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const kitchenSchema = new Schema({
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

module.exports = mongoose.model('kitchens', kitchenSchema);