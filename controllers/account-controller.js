const db_task = require("./task-controller.js");
const db_prj = require("./project-controller.js");

const mongoose = require('mongoose');
require('dotenv').config();     //for environment variables
const bcrypt = require('bcryptjs');

const userSchema = require('../model/User');
const usersModel = mongoose.model(process.env.USER_COLLECTION, userSchema);

module.exports.signup = (user) => {

    return new Promise((resolve, reject) => {
        if (user.password !== user.confirm_password)
            reject({ code: 400, message: "Passwords should match." });
        else if (user.password == "" || user.password.match(/^ *$/) !== null
            || user.confirm_password == "" || user.confirm_password.match(/^ *$/) !== null)
            reject({ code: 400, message: "Password cannot be empty." });
        else {
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
                    if (error.code == 11000)    //duplicate entry
                        reject({ code: 400, message: "Username already exists." });
                    else
                        reject(error);
                });
        }
    });

}

module.exports.login = (login) => {

    return new Promise((resolve, reject) => {
        usersModel.findOne({ username: login.username }).exec()
            .then((user) => {
                if (user)
                    return bcrypt.compare(login.password, user.password);
                else
                    reject({ code: 400, message: `Couldn't find user ${login.username}.` });
            })
            .then((passwordMatches) => {
                if (passwordMatches)
                    resolve(user);
                else
                    reject({ code: 400, message: "Incorrect login or password." });
            })
            .catch((error) => {
                reject(error);
            });
    });

}

module.exports.updateAccount = (update, session) => {
    return new Promise((res, rej) => {

        usersModel.updateOne({ username: update.username },
            { $set: { "username": update.new_username } })
            .then(() => {
                session.user.username = update.new_username;
                res("User updated.");
            })
            .catch((e) => {
                if (e.code == 11000)    //duplicate entry
                    rej(11000);
                else
                    rej("Application encountered a problem updating user. Try again later." + e);
            });

    });
}

module.exports.deleteAccount = (username) => {
    return new Promise((res, rej) => {
        db_task.getAllTasks(username)
            .then((tasks) => {
                for (const task of tasks)
                    db_task.deleteTask(username, task.taskNumber);
            }).catch(() => { rej("Application encountered a problem deleting tasks. Try again later."); });

        db_prj.getAllProjects(username)
            .then((projects) => {
                for (const project of projects)
                    db_prj.deleteProject(username, project.prjNumber);
            }).catch(() => { rej("Application encountered a problem deleting projects. Try again later."); });

        usersModel.deleteOne({ username: username }).exec()
            .then(() => {
                res("User deleted.");
            })
            .catch(() => {
                rej("Application encountered a problem deleting user. Try again later.");
            });
    });
}