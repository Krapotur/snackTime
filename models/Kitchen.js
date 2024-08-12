const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const kitchenSchema = new Schema({
    status:{
        type: Boolean,
        default: true,
    },
    title: {
        type: String,
        required: true,
    },
    imgSrc: {
        type: String,
        default: '',
    }
})

module.exports = mongoose.model('kitchens', kitchenSchema);