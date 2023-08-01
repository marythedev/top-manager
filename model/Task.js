const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const taskSchema = new Schema({
    taskNumber: {
        type: Number,
        unique: true,
        required: true
    },
    owner: String,
    name: {
        type: String,
        required: true
    },
    priority: String,
    project: Number,
    dueDate: {
        type: String,
        required: true
    }
});

module.exports = mongoose.Schema(taskSchema);