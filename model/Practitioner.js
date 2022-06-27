const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const patientSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    }, 
    phonenumber: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        reuqired: true
    },
    email: {
        type: String,
        minlength: 6,
        lowercase: true,
        required: true
    },
    country: String,
    state: String,
    city: String,
    contact_person: String,
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    },
    updatedAt: {
        type: Date,
        default: () => Date.now()
    },
    refreshToken: String
});

module.exports = mongoose.model('Users', patientSchema);