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

const updateClosestDueDate = (closestDueDate, task) => {
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
}


//functions used by routes
module.exports.getAllProjects = (username) => {
    return new Promise((res, rej) => {
        projectsModel.find({ owner: username }).lean()
            .then((projects) => { res(projects); });
    });
}

module.exports.addProject = (project) => {
    return new Promise((res, rej) => {

        processInput(project);      //process received data to store in db

        const newProject = new projectsModel(project);
        newProject.save()
            .then(() => { res(); });

    });
}

module.exports.addTasktoProject = (task, project_id) => {
    return new Promise((res, rej) => {
        projectsModel.findOne({ _id: project_id })
            .then((project) => {

                //add task id to project's tasks array
                project.tasks.push({
                    taskId: task._id
                });

                //update project's closestDueDate if necessary
                updateClosestDueDate(project.closestDueDate, task);

                project.save()
                    .then(() => { res(); });
            })
            .catch((e) => {
                console.log(`project-controller: addTasktoProject encountered a problem ${e}`);
                rej("Application encountered a problem trying to add task to the project. Try again later or Contact Us.");
            });
    });
}

module.exports.deleteProject = (username, project_id) => {
    return new Promise((res, rej) => {
        projectsModel.deleteOne({ owner: username, _id: project_id }).exec()
            .then(() => { res(); });
    });
}

module.exports.deleteTaskFromProject = (task_id, project_id) => {
    return new Promise((res, rej) => {
        projectsModel.findOne({ _id: project_id })
            .then((project) => {


                //remove task from project
                let index = 0;
                for (const task of project.tasks) {
                    if (task.taskId == task_id)
                        project.tasks.splice(index, 1);
                    index++;
                }

                //update project's closestDueDate if it was the due date of the deleted task
                if (project.closestDueDate.taskId.localeCompare(task_id) == 0) {

                    project.closestDueDate = {};

                    for (const task of project.tasks) {
                        db_task.getTaskById(task.taskId)
                            .then((task) => { updateClosestDueDate(project.closestDueDate, task); })
                            .catch((e) => {
                                console.log(`project-controller: deleteTaskFromProject update project's ClosestDueDate ${e}`);
                                rej("Application encountered a problem trying to delete task from the project. Try again later or Contact Us.");
                            });
                    }
                }

                project.save()
                    .then(() => { res(); });
            })
            .catch((e) => {
                console.log(`project-controller: deleteTaskFromProject encountered a problem ${e}`);
                rej("Application encountered a problem trying to delete task from the project. Try again later or Contact Us.");
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