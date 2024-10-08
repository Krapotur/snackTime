const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const restaurantSchema = new Schema({
    status:{
        type: Boolean,
        default: true
    },
    title: {
      type: String,
      require: true,
      unique: true
    },
    description: {
      type: String,
      default: ''
    },
    timeOpen: {
        type: String,
        default: ''
    },
    timeClose: {
        type: String,
        default: ''
    },
    rating: {
        type: Number,
        default: 5
    },
    typePlace:{
      type:String,
      default: 'other'
    },
    imgSrc: {
      type: String,
      default: ''
    },
    kitchen: {
        ref: 'kitchens',
        type: Schema.Types.ObjectId
    }
})

module.exports = mongoose.model('restaurants', restaurantSchema);