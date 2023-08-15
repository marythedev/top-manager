const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const projectSchema = new Schema({
    owner: String,
    name: String,
    closestDueDate: {
        date: String,
        taskId: String
    },
    taskIds: [{
        taskId: String
    }],
});

module.exports = mongoose.Schema(projectSchema);