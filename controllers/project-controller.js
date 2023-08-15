const mongoose = require('mongoose');
require('dotenv').config();     //for environment variables

const db_task = require("../controllers/task-controller.js");
const projectSchema = require('../model/Project');
const projectsModel = mongoose.model(process.env.PROJECT_COLLECTION, projectSchema);

//functions used within controllers
const processInput = (project) => {
    for (const input in project) {
        if (project[input] == "")
            project[input] = null;
    }
}

const updClosestDueDate = (closestDueDate, task) => {
    if (closestDueDate.date) {
        if (closestDueDate.date > task.dueDate) {
            closestDueDate.date = task.dueDate;
            closestDueDate.taskId = task._id;
        }
    }
    else {
        closestDueDate.date = task.dueDate;
        closestDueDate.taskId = task._id;
    }
    return closestDueDate;
}

module.exports.addTasktoProject = (task, project_id) => {

    return new Promise((resolve, reject) => {
        projectsModel.findOne({ _id: project_id })
            .then((project) => {
                if (project) {
                    //add task id to project's task id array
                    project.taskIds.push({ taskId: task._id });

                    //update project's closestDueDate taking into account the new task's due date
                    project.closestDueDate = updClosestDueDate(project.closestDueDate, task);

                    return project.save();
                } else
                    reject("Project Not Found");
            })
            .then(() => {
                resolve();
            })
            .catch((error) => {
                reject(error);
            });
    });

}

module.exports.deleteTaskFromProject = (task_id, project_id) => {

    return new Promise((resolve, reject) => {
        projectsModel.findOne({ _id: project_id })
            .then((project) => {
                if (project) {
                    //remove task from project
                    let index = 0;
                    for (const taskIdObj of project.taskIds) {
                        if (taskIdObj.taskId == task_id)
                            project.taskIds.splice(index, 1);
                        index++;
                    }

                    //update project's closestDueDate if it was the due date of the deleted task
                    const updPromises = [];
                    if (project.closestDueDate.taskId.localeCompare(task_id) == 0) {
                        project.closestDueDate = {};
                        for (const taskIdObj of project.taskIds) {
                            const promise = db_task.getTaskById(taskIdObj.taskId)
                                .then((task) => {
                                    project.closestDueDate = updClosestDueDate(project.closestDueDate, task);
                                });
                            updPromises.push(promise);
                        }
                    }

                    Promise.all(updPromises)
                        .then(() => {
                            return project.save();
                        })
                        .then(() => { resolve(); })
                        .catch((error) => { reject(error); });

                } else
                    reject("Project Not Found");
            })
            .catch((error) => {
                reject(error)
            });
    });

}


//functions used by routes
module.exports.getAllProjects = (username) => {
    return new Promise((resolve, reject) => {
        projectsModel.find({ owner: username }).lean()
            .then((projects) => { resolve(projects); })
            .catch((error) => { reject(error); });
    });
}

module.exports.addProject = (project) => {
    return new Promise((resolve, reject) => {

        processInput(project);      //process received data to store in db

        const newProject = new projectsModel(project);
        newProject.save()
            .then(() => { resolve(); })
            .catch((error) => { reject(error); });

    });
}

module.exports.deleteProject = (username, project_id) => {

    return new Promise((resolve, reject) => {

        //project can be deleted by /project/delete/:id route
        //session username will make sure that external user won't delete project
        projectsModel.findOne({ owner: username, _id: project_id })
            .then((project) => {
                if (project) {
                    const unassignPromises = [];
                    for (const taskIdObj of project.taskIds)
                        unassignPromises.push(db_task.unassignTaskfromProject(taskIdObj.taskId));
                    return Promise.all(unassignPromises);
                } else
                    reject("Project Not Found");
            })
            .then(() => {
                return projectsModel.deleteOne({ _id: project_id }).exec();
            })
            .then(() => {
                resolve();
            })
            .catch((error) => {
                reject(error);
            });
    });

}





// module.exports.updateProject = (update) => {
//     return new Promise((res, rej) => {

//         processInput(update);      //process received data to store in db

//         projectsModel.updateOne({ owner: update.owner, _id: update._id },
//             { $set: update })
//             .then(() => {
//                 res("Project updated.")
//             })
//             .catch(() => {
//                 rej("Application encountered a problem updating project. Try again later.");
//             });

//     });
// }