const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const taskSchema = new Schema({
    owner: String,
    name: {
        type: String,
        required: true
    },
    priority: String,
    project: String,
    dueDate: {
        type: String,
        required: true
    }
});

module.exports = mongoose.Schema(taskSchema);