const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const projectSchema = new Schema({
    prjNumber: {
        type: Number,
        unique: true,
        required: true
    },
    owner: String,
    name: String
});

module.exports = mongoose.Schema(projectSchema);