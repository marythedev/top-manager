const mongoose = require('mongoose');
require('dotenv').config();     //for environment variables

const taskSchema = require('../model/Task');
const tasksModel = mongoose.model(process.env.TASK_COLLECTION, taskSchema);

const processInput = (task) => {
    for (const input in task) {
        if (task[input] == "")
            task[input] = null;
    }
}

module.exports.getAllTasks = (username) => {
    return new Promise((res, rej) => {
        tasksModel.find({owner: username}).lean()
            .then((tasks) => {
                res(tasks);
            })
            .catch(() => {
                rej("No results.");
            });
    });
}

module.exports.getTasksByPriority = (username, priority) => {
    return new Promise((res, rej) => {
        tasksModel.find({ owner: username, priority: priority }).lean().exec()
            .then((tasks) => {
                res(tasks);
            })
            .catch(() => {
                rej("No results.");
            });
    });
}

module.exports.getTasksByProject = (username, project) => {
    return new Promise((res, rej) => {
        tasksModel.find({ owner: username, project: project }).lean().exec()
            .then((tasks) => {
                res(tasks);
            })
            .catch(() => {
                rej("No results.");
            });
    });
}

module.exports.addTask = (task) => {
    return new Promise((res, rej) => {

        processInput(task);      //process received data to store in db

        const newTask = new tasksModel(task);
        newTask.save()
            .then(() => {
                res("Task created.");
            })
            .catch((e) => {
                if (e.code == 11000)    //duplicate entry
                    rej("Task № should be unique.");
                else
                    rej(`Problems creating Task: ${e}`);
            });

    });
}

module.exports.updateTask = (update) => {
    return new Promise((res, rej) => {

        processInput(update);      //process received data to store in db

        tasksModel.updateOne({ owner: update.owner, _id: update._id },
            { $set: update })
            .then(() => {
                res("Task updated.");
            })
            .catch(() => {
                rej("Application encountered a problem updating task. Try again later.");
            });

    });
}

module.exports.deleteTask = (username, _id) => {
    return new Promise((res, rej) => {
        tasksModel.deleteOne({ owner: username, _id: _id }).exec()
            .then(() => {
                res("Task deleted.");
            })
            .catch(() => {
                rej("Application encountered a problem deleting task. Try again later.");
            });
    });
}