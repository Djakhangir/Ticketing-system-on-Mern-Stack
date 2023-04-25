//Define the database

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ResetPinSchema = new Schema({
    pin: {
        type: Number,
        maxLength: 6,
        minLength: 6,
    },
    email: {
        type: String,
        maxLength: 50,
        required: true,
    },
})

module.exports = {
    ResetPinSchema: mongoose.model('Reset_pin', ResetPinSchema)
}