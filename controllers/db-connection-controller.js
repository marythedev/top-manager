const mongoose = require('mongoose');
require('dotenv').config();     //for environment variables

const uri = process.env.MONGODB_URI;

module.exports.connect = () => {
    return new Promise((resolve, reject) => {
        mongoose.connect(uri)
            .then(() => {
                console.log("Database connection established.");
                resolve();
            })
            .catch((error) => {
                reject("Can't connect to the database. " + error);
            });
    });
}