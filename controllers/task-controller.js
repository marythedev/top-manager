const mongoose = require('mongoose');
require('dotenv').config();     //for environment variables

const db_prj = require("../controllers/project-controller.js");
const taskSchema = require('../model/Task');
const tasksModel = mongoose.model(process.env.TASK_COLLECTION, taskSchema);

//functions used within controllers
const processInput = (task) => {
    for (const input in task) {
        if (task[input] == "")
            task[input] = null;
    }
}

module.exports.unassignTaskfromProject = (task_id) => {
    return new Promise((resolve, reject) => {
        tasksModel.findOne({ _id: task_id })
            .then((task) => {
                if (task) {
                    task.project = undefined;
                    return task.save();
                } else {
                    reject("Task Not Found");
                    return;
                }
            })
            .then(() => { resolve(); })
            .catch((error) => { reject(error); });
    });
}

const deleteTaskFromDb = (_id) => {
    return new Promise((resolve, reject) => {
        tasksModel.deleteOne({ _id: _id }).exec()
            .then(() => { resolve(); })
            .catch((error) => { reject(error); });
    });
}

//functions used by routes
module.exports.getTaskById = (_id) => {
    return new Promise((resolve, reject) => {
        tasksModel.findOne({ _id: _id }).lean()
            .then((task) => { resolve(task); })
            .catch((error) => { reject(error); });
    });
}

module.exports.getAllTasks = (username) => {
    return new Promise((resolve, reject) => {
        tasksModel.find({ owner: username }).lean()
            .then((tasks) => { resolve(tasks); })
            .catch((error) => { reject(error); });
    });
}

module.exports.addTask = (task) => {
    return new Promise((resolve, reject) => {

        processInput(task);      //process received data to store in db

        const newTask = new tasksModel(task);
        newTask.save()
            .then(() => {
                if (task.project)
                    return db_prj.addTasktoProject(newTask, newTask.project);
                else {
                    resolve();
                    return;
                }
            })
            .then(() => {
                resolve();
            })
            .catch((error) => {
                reject(error);
            });

    });
}

module.exports.updateTask = (update) => {
    return new Promise((resolve, reject) => {

        processInput(update);      //process received data to store in db

        tasksModel.findOne({ _id: update._id })
            .then((task) => {
                if (task) {
                    if (task.project != update.project) {
                        if (update.project) {
                            db_prj.addTasktoProject(update, update.project)
                                .then(() => {
                                    if (task.project)
                                        return db_prj.deleteTaskFromProject(task._id, task.project);
                                })
                                .catch((error) => {
                                    reject(error);
                                    return;
                                });
                        } else {
                            db_prj.deleteTaskFromProject(task._id, task.project)
                                .catch((error) => {
                                    reject(error);
                                    return;
                                });
                        }
                    } else {
                        if (task.project && task.dueDate != update.dueDate) {
                            db_prj.updateClosestDueDate(update.project, update)
                                .catch((error) => {
                                    reject(error);
                                    return;
                                });
                        }
                    }
                    return tasksModel.updateOne({ _id: update._id }, { $set: update });
                } else
                    reject("Task Not Found");
            })
            .then(() => {
                resolve();
            })
            .catch((error) => {
                reject(error);
            });

    });
}

module.exports.deleteTask = (username, task_id) => {
    return new Promise((resolve, reject) => {

        //task can be deleted by /task/delete/:id route
        //session username will make sure that external user won't delete task
        tasksModel.findOne({ owner: username, _id: task_id })
            .then((task) => {
                if (task) {
                    //remove task from project if it was assigned to one
                    if (task.project)
                        return db_prj.deleteTaskFromProject(task_id, task.project)
                } else {
                    reject("Task Not Found");
                    return;
                }
            })
            .then(() => {
                return deleteTaskFromDb(task_id);
            })
            .then(() => { resolve(); })
            .catch((error) => {
                reject(error);
            });

    });
}