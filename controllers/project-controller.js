const mongoose = require('mongoose');
require('dotenv').config();     //for environment variables

const projectSchema = require('../model/Project');
const projectsModel = mongoose.model(process.env.PROJECT_COLLECTION, projectSchema);

const processInput = (project) => {
    for (const input in project) {
        if (project[input] == "")
            project[input] = null;
    }
}

module.exports.getAllProjects = (username) => {
    return new Promise((res, rej) => {
        projectsModel.find({ owner: username }).lean()
            .then((projects) => {
                res(projects);
            })
            .catch(() => { rej(); });
    });
}

module.exports.addProject = (project) => {
    return new Promise((res, rej) => {

        processInput(project);      //process received data to store in db

        const newProject = new projectsModel(project);
        newProject.save()
            .then(() => { res(); })
            .catch((e) => {
                rej(`Problems creating Project: ${e}`);
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

module.exports.deleteProject = (username, _id) => {
    return new Promise((res, rej) => {
        projectsModel.deleteOne({ owner: username, _id: _id }).exec()
            .then(() => { res(); })
            .catch(() => {
                rej("Application encountered a problem deleting project. Try again later.");
            });
    });
}