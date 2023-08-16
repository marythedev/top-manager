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

module.exports.getTaskById = (_id) => {
    return new Promise((resolve, reject) => {
        tasksModel.findOne({ _id: _id })
            .then((task) => { resolve(task); })
            .catch((error) => { reject(error); });
    });
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





// module.exports.getTasksByPriority = (username, priority) => {
//     return new Promise((res, rej) => {
//         tasksModel.find({ owner: username, priority: priority }).lean().exec()
//             .then((tasks) => {
//                 res(tasks);
//             })
//             .catch(() => {
//                 rej("No results.");
//             });
//     });
// }

// module.exports.getTasksByProject = (username, project) => {
//     return new Promise((res, rej) => {
//         tasksModel.find({ owner: username, project: project }).lean().exec()
//             .then((tasks) => {
//                 res(tasks);
//             })
//             .catch(() => {
//                 rej("No results.");
//             });
//     });
// }


// module.exports.updateTask = (update) => {
//     return new Promise((res, rej) => {

//         processInput(update);      //process received data to store in db

//         tasksModel.updateOne({ owner: update.owner, _id: update._id },
//             { $set: update })
//             .then(() => {
//                 res("Task updated.");
//             })
//             .catch(() => {
//                 rej("Application encountered a problem updating task. Try again later.");
//             });

//     });
// }
