const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    }, 
    phonenumber: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        minlength: 6,
        lowercase: true,
        required: true
    },
    role: {},
    password: {
        type: String,
        required: true
    },
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

module.exports = mongoose.model('Users', usersSchema);