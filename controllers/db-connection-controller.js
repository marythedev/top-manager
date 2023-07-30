const mongoose = require('mongoose');
require('dotenv').config();     //for environment variables

const uri = process.env.MONGODB_URI;
var db_connected = false;

module.exports.connect = async () => {
    try {
        await mongoose.connect(uri);
        db_connected = true;
        console.log("Database connection established.");
    }
    catch (e) {
        throw new Error("Can't connect to the database. " + e);
    }
}

module.exports.close = () => {
    if (db_connected) {
        mongoose.connection.close()
        console.log("Database connection closed.");
    }
}