const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const restaurantSchema = new Schema({
    title: {
      type: String,
      require: true,
      unique: true
    },
    description: {
      type: String,
      default: ''
    },
    date: {
        type: String,
        default: ''
    },
    rating: {
        type: Number,
        require: true
    },
    kitchen: {
        ref: 'kitchens',
        type: Schema.Types.ObjectId
    },
    user: {
        ref: 'users',
        type: Schema.Types.ObjectId
    }
})

module.exports = mongoose.model('restaurants', restaurantSchema);