const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const userSchema = new Schema({
    "username": {
        type: String,
        unique: true,
        required: true
    },
    "password": {
        type: String,
        required: true
    },
    "email": String,
    "history": [{
        "dateTime": Date
    }],
});

module.exports = mongoose.Schema(userSchema);