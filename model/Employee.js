const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const employeeSchema = new Schema({
    empNumber: {
        type: Number,
        unique: true,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: String,
    city: String,
    status: String,
    department: Number,
    hireDate: {
        type: String,
        required: true
    }  
});

module.exports = mongoose.Schema(employeeSchema);