const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  status: {
    type: Boolean,
    default: false
  },
  isDrink: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    required: true
  },
  imgSrc: {
    type: String,
    default: '',
  },
  restaurant: {
    ref: 'restaurants',
    type: Schema.Types.ObjectId,
    default: ''
  }
})

module.exports = mongoose.model('categories', categorySchema);