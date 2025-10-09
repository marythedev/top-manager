const db_task = require("./task-controller.js");
const db_prj = require("./project-controller.js");

const mongoose = require('mongoose');
require('dotenv').config();     //for environment variables
const bcrypt = require('bcryptjs');

const userSchema = require('../model/User');
const usersModel = mongoose.model(process.env.USER_COLLECTION, userSchema);

//functions used within controllers
const processInput = (account) => {
    for (const input in account) {
        if (account[input] == "")
            account[input] = null;
    }
}

const usernameValidator = (username) => {
    if (username === null || username.match(/^ *$/) !== null)
        return { valid: false, code: 400, message: "Username cannot be empty or contain only spaces." };
    else if (!/^[a-zA-Z0-9._]+$/.test(username))
        return { valid: false, code: 400, message: "Username can only contain letters, numbers, dots and underscores." };
    else
        return { valid: true };
}

const passwordValidator = (password) => {
    if (password === null || password.match(/^ *$/) !== null)
        return { valid: false, code: 400, message: "Password cannot be empty or contain only spaces." };
    else if (password.length < 8)
        return { valid: false, code: 400, message: "Password should have at least 8 characters." };
    else if (/[a-zA-Z]/g.test(password) == false)
        return { valid: false, code: 400, message: "Password should contain at least one letter." };
    else
        return { valid: true };
}

//functions used by routes
module.exports.signup = (user) => {

    return new Promise((resolve, reject) => {
        const usernameStatus = usernameValidator(user.username);
        const passwordStatus = passwordValidator(user.password);
        if (!usernameStatus.valid)
            return reject({ code: usernameStatus.code, message: usernameStatus.message });
        else if (!passwordStatus.valid)
            return reject({ code: passwordStatus.code, message: passwordStatus.message });
        else if (user.password !== user.confirm_password)
            reject({ code: 400, message: "Passwords should match." });

        bcrypt.hash(user.password, 8)
            .then((hash) => {
                user.password = hash;
                const newUser = new usersModel(user);
                return newUser.save();
            })
            .then((newUser) => {
                resolve(newUser);
            })
            .catch((error) => {
                if (error.code == 11000)     //duplicate entry
                    reject({ code: 400, message: "Username already exists." });
                else
                    reject(error);
            });
    });

}

module.exports.login = (login) => {

    return new Promise((resolve, reject) => {
        usersModel.findOne({ username: login.username }).exec()
            .then((user) => {
                if (user) {
                    bcrypt.compare(login.password, user.password)
                        .then((passwordMatches) => {
                            if (passwordMatches)
                                resolve(user);
                            else
                                reject({ code: 400, message: "Incorrect login or password." });
                        })
                        .catch((error) => {
                            reject(error);
                        });
                }
                else
                    reject({ code: 400, message: `Couldn't find user ${login.username}.` });
            })
            .catch((error) => {
                reject(error);
            });
    });

}

module.exports.updateAccount = (update, session) => {

    return new Promise((resolve, reject) => {

        processInput(update);      //process received data to store in db

        // username update
        if (update.username !== session.user.username) {
            const usernameStatus = usernameValidator(update.username);
            if (!usernameStatus.valid)
                return reject({ code: usernameStatus.code, message: usernameStatus.message });

            usersModel.updateOne(
                { username: session.user.username },
                { $set: { "username": update.username } }
            ).then(() => {
                session.user.username = update.username;
                resolve("Username was updated.");
            }).catch((error) => {
                if (error.code == 11000)    //duplicate entry
                    reject({ code: 400, message: "Username is not available." });
                else
                    reject(error);
            });
        }

        // password update
        else if (update.password || update.new_password || update.confirm_new_password) {
            if (!update.password)
                return reject({ code: 400, message: "Enter your current password to change your password." });
            else if (!update.new_password)
                return reject({ code: 400, message: "Enter your new password to change your password." });
            else if (!update.confirm_new_password)
                return reject({ code: 400, message: "Confirm your new password to change your password." });
            else if (update.password && update.new_password && update.confirm_new_password) {
                const passwordStatus = passwordValidator(update.new_password);
                if (!passwordStatus.valid)
                    return reject({ code: passwordStatus.code, message: passwordStatus.message });
                else if (update.new_password !== update.confirm_new_password)
                    return reject({ code: 400, message: "New passwords should match." });
            }

            usersModel.findOne({ username: session.user.username }).exec()
                .then((user) => {
                    if (user)
                        return bcrypt.compare(update.password, user.password);
                    else {
                        reject({ code: 400, message: "User Not Found" });
                        return;
                    }
                }).then((passwordMatches) => {
                    if (passwordMatches)
                        return bcrypt.hash(update.new_password, 8);
                    else {
                        reject({ code: 400, message: "Incorrect current password." });
                        return;
                    }
                }).then((hash) => {
                    return usersModel.updateOne(
                        { username: session.user.username },
                        { $set: { "password": hash } }
                    )
                }).then(() => {
                    resolve("Password was updated.");
                }).catch((error) => {
                    reject(error);
                });
        }

        // no update necessary
        else
            resolve();
    });

}

module.exports.deleteAccount = (username) => {

    return new Promise((resolve, reject) => {
        db_task.getAllTasks(username)
            .then((tasks) => {
                const deleteTaskpromises = [];
                for (const task of tasks)
                    deleteTaskpromises.push(db_task.deleteTask(username, task._id));
                return Promise.all(deleteTaskpromises);
            })
            .then(() => {
                return db_prj.getAllProjects(username);
            })
            .then((projects) => {
                const deleteProjectpromises = [];
                for (const project of projects)
                    deleteProjectpromises.push(db_prj.deleteProject(username, project._id));
                return Promise.all(deleteProjectpromises);
            })
            .then(() => {
                return usersModel.deleteOne({ username: username }).exec();
            })
            .then(() => {
                resolve();
            })
            .catch((error) => {
                reject(error);
            });
    });

}