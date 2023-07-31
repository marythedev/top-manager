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

module.exports.getAllProjects = () => {
    return new Promise((res, rej) => {
        projectsModel.find().lean()
            .then((projects) => {
                res(projects);
            })
            .catch(() => {
                rej("No results returned.");
            });
    });
}

module.exports.getProjectByNum = (prjNumber) => {
    return new Promise((res, rej) => {

        projectsModel.findOne({ prjNumber: prjNumber }).lean().exec()
            .then((project) => {
                res(project);
            })
            .catch(() => {
                rej(`Project №${prjNumber} was not found.`);
            });

    });
}

module.exports.addProject = (project) => {
    return new Promise((res, rej) => {

        processInput(project);      //process received data to store in db

        const newProject = new projectsModel(project);
        newProject.save()
            .then(() => {
                res("Project created.");
            })
            .catch((e) => {
                if (e.code == 11000)    //duplicate entry
                    rej("Project № should be unique.");
                else
                    rej(`Problems creating Project: ${e}`);
            });
        
    });
}

module.exports.updateProject = (update) => {
    return new Promise((res, rej) => {

        processInput(update);      //process received data to store in db

        projectsModel.updateMany({ prjNumber: update.prjNumber },
            { $set: update })
            .then(() => {
                res("Project updated.")
            })
            .catch(() => {
                rej("Application encountered a problem updating project. Try again later.");
            });

    });
}

module.exports.deleteProject = (prjNumber) => {
    return new Promise((res, rej) => {
        projectsModel.deleteOne({ prjNumber: prjNumber }).exec()
            .then(() => {
                res("Project deleted.");
            })
            .catch(() => {
                rej("Application encountered a problem deleting project. Try again later.");
            });
    });
}