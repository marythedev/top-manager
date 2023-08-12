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
    return new Promise((res, rej) => {
        tasksModel.findOne({ _id: _id })
            .then((task) => { res(task); })
            .catch((e) => { rej(`task-controller (getTaskById): ${e}`); });
    });
}

module.exports.unassignTaskfromProject = (task_id) => {
    return new Promise((res, rej) => {
        tasksModel.findOne({ _id: task_id })
            .then((task) => {

                if (task) {
                    task.project = undefined;
                    task.save()
                        .then(() => { res(); });
                } else
                    rej("task-controller (unassignTaskfromProject): Task Not Found");


            }).catch((e) => { rej(`task-controller (unassignTaskfromProject): ${e}`); });
    });
}

const deleteTaskFromDb = (_id) => {
    return new Promise((res, rej) => {
        tasksModel.deleteOne({ _id: _id }).exec()
            .then(() => { res(); })
            .catch((e) => { rej(`task-controller (deleteTaskFromDb): ${e}`); });
    });
}

//functions used by routes
module.exports.getAllTasks = (username) => {
    return new Promise((res, rej) => {
        tasksModel.find({ owner: username }).lean()
            .then((tasks) => { res(tasks); })
            .catch((e) => { rej(`task-controller (getAllTasks): ${e}`); });
    });
}

module.exports.addTask = (task) => {
    return new Promise((res, rej) => {

        processInput(task);      //process received data to store in db

        const newTask = new tasksModel(task);
        newTask.save()
            .then(() => {
                if (task.project) {
                    db_prj.addTasktoProject(newTask, newTask.project)
                        .then(() => { res(); })
                        .catch((e) => { rej(`task-controller (addTask): ${e}`); });
                } else
                    res();
            })
            .catch((e) => { rej(`task-controller (addTask): ${e}`); });

    });
}

module.exports.deleteTask = (username, task_id) => {
    return new Promise((res, rej) => {

        //session username will make sure that external user won't delete task
        //task can be deleted by /task/delete/:id route
        tasksModel.findOne({ owner: username, _id: task_id })
            .then((task) => {

                if (task) {
                    //remove task from project if it was assigned to one
                    if (task.project) {
                        db_prj.deleteTaskFromProject(task_id, task.project)
                            .then(() => {
                                deleteTaskFromDb(task_id)
                                    .then(() => { res(); })
                                    .catch((e) => { rej(`task-controller (deleteTask): ${e}`); });
                            })
                            .catch((e) => { rej(`task-controller (deleteTask): ${e}`); });
                    }

                    //if task wasn't assigned to a project, just delete it
                    else {
                        deleteTaskFromDb(task_id)
                            .then(() => { res(); })
                            .catch((e) => { rej(`task-controller (deleteTask): ${e}`); });
                    }
                } else
                    rej("task-controller (deleteTask): Task Not Found");

            }).catch((e) => { rej(`task-controller (deleteTask): ${e}`); });

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
