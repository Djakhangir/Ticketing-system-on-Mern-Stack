//Define the database

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ResetPinSchema = new Schema({
    pin: {
        type: String,
        maxLength: 6,
        minLength: 6,
    },
    email: {
        type: String,
        maxLength: 50,
        required: true,
    },
    addedAt: {
        type: Date,
        required: true,
        default: Date.now(),
    },
})

module.exports = {
    ResetPinSchema: mongoose.model('Reset_pin', ResetPinSchema)
}