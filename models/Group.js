const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    alias: {
        type: String,
        unique: true
    }
})

module.exports = mongoose.model('groups', groupSchema);