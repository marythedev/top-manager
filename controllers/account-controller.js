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

//functions used by routes
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

        usersModel.updateOne(
            { username: update.username },
            { $set: { "username": update.new_username } }
        ).then(() => {
            session.user.username = update.new_username;
            if (update.password || update.new_password || update.confirm_new_password)
                reject({
                    code: 400,
                    message: "Your username was changed! Backend for password change is not implemented yet, try again later."
                });
            resolve();
        }).catch((error) => {
            if (error.code == 11000)    //duplicate entry
                reject({ code: 400, message: "Username already exists." });
            else
                reject(error);
        });
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