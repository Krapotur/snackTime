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
    proteins: {
      type: Number,
    },
    fats: {
      type: Number,
    },
    carbs: {
      type: Number,
    },
    caloric: {
        type: Number,
        default: 100
    },
    category:{
        ref: 'categories',
        type: Schema.Types.ObjectId
    },
    restaurant:{
        ref: 'restaurants',
        type: Schema.Types.ObjectId
    }
})

module.exports = mongoose.model('positions', positionSchema);