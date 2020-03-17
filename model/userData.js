const mongoose = require('mongoose');

const userData = mongoose.Schema({
    userName: {
        type: String,

    },
    address: {
        type: String,

    },
    dateOfBirth: {
        type: Date,

    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,

    }

});

module.exports = mongoose.model('UserData', userData);