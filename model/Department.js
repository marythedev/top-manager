const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const departmentSchema = new Schema({
    _id: false,
    depNumber: {
        type: Number,
        unique: true,
        required: true
    },
    name: String
});

module.exports = mongoose.Schema(departmentSchema);