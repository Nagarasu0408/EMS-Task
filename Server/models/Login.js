const mongoose = require('mongoose');


// User login information

const LoginSchema = new mongoose.Schema({
    f_userName: {
        type: String,
        required: true,
        unique: true
    },
    f_Pwd: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Login', LoginSchema);
