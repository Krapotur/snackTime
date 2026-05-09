const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const promoSchema = new Schema({
  status: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  imgSrc: {
    type: String,
    default: "",
  },
  link: {
    type: String,
    default: "",
  },
  restaurant: {
    ref: "restaurants",
    type: Schema.Types.ObjectId,
    default: "",
  },
});

module.exports = mongoose.model("promos", promoSchema);
