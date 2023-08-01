const mongoose = require('mongoose');
require('dotenv').config();     //for environment variables
const bcrypt = require('bcryptjs');

const userSchema = require('../model/User');
const usersModel = mongoose.model(process.env.USER_COLLECTION, userSchema);

module.exports.register = (user) => {
    return new Promise((res, rej) => {
        if (user.password == "" || user.password.match(/^ *$/) !== null
            || user.confirm_password == "" || user.confirm_password.match(/^ *$/) !== null)
            rej("Password cannot be empty.");
        else if (user.password !== user.confirm_password)
            rej("Passwords should match.");
        else {
            bcrypt.hash(user.password, 8)
                .then((hash) => {
                    user.password = hash;
                    const newUser = new usersModel(user);
                    newUser.save()
                        .then(() => {
                            res("User created.");
                        })
                        .catch((e) => {
                            if (e.code == 11000)    //duplicate entry
                                rej("Username is already taken.");
                            else
                                rej(`Problems creating user: ${e}`);
                        });
                })
                .catch(() => {
                    rej("Application encountered a problem processing registration data. Try again later.");
                });
        }

    });
}

module.exports.login = (login) => {
    return new Promise((res, rej) => {

        usersModel.findOne({ username: login.username }).exec()
            .then((user) => {
                bcrypt.compare(login.password, user.password)
                    .then((result) => {
                        if (result) {
                            user.history.push({
                                dateTime: (new Date()).toString()
                            });
                            user.save()
                                .then(() => {
                                    res(user);
                                })
                                .catch((e) => {
                                    rej(`Error updating user history in the database. ${e}`);
                                });
                        }
                        else
                            rej(`Incorrect login or password.`);
                    })
                    .catch(() => {
                        rej("Application encountered a problem processing login data. Try again later.");
                    })
            })
            .catch(() => {
                rej(`No such user ${login.username}`);
            });

    });
}

module.exports.updateAccount = (update, session) => {
    return new Promise((res, rej) => {

        usersModel.updateOne({ username: update.username },
            { $set: {"username": update.new_username} })
            .then(() => {
                session.user.username = update.new_username;
                res("User updated.");
            })
            .catch((e) => {
                rej("Application encountered a problem updating user. Try again later." + e);
            });

    });
}

module.exports.deleteAccount = (username) => {
    return new Promise((res, rej) => {
        usersModel.deleteOne({ username: username }).exec()
            .then(() => {
                res("User deleted.");
            })
            .catch(() => {
                rej("Application encountered a problem deleting user. Try again later.");
            });
    });
}