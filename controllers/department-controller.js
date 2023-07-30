const mongoose = require('mongoose');
require('dotenv').config();     //for environment variables

const departmentSchema = require('../model/Department');
const departmentsModel = mongoose.model(process.env.DEPARTMENT_COLLECTION, departmentSchema);

const processInput = (department) => {
    for (const input in department) {
        if (department[input] == "")
            department[input] = null;
    }
}

module.exports.getDepartments = () => {
    return new Promise((res, rej) => {
        departmentsModel.find().lean()
            .then((departments) => {
                res(departments);
            })
            .catch(() => {
                rej("No results returned.");
            });
    });
}

module.exports.getDepartmentById = (depNumber) => {
    return new Promise((res, rej) => {

        departmentsModel.findOne({ depNumber: depNumber }).lean().exec()
            .then((department) => {
                res(department);
            })
            .catch(() => {
                rej(`Department №${depNumber} was not found.`);
            });

    });
}

module.exports.addDepartment = (department) => {
    return new Promise((res, rej) => {

        processInput(department);      //process received data to store in db

        const newDepartment = new departmentsModel(department);
        newDepartment.save()
            .then(() => {
                res("Department created.");
            })
            .catch((e) => {
                if (e.code == 11000)    //duplicate entry
                    rej("Department № should be unique.");
                else
                    rej(`Problems creating Department: ${e}`);
            });
        
    });
}

module.exports.updateDepartment = (update) => {
    return new Promise((res, rej) => {

        processInput(update);      //process received data to store in db

        departmentsModel.updateMany({ depNumber: department.depNumber },
            { $set: update })
            .then(() => {
                res("Department updated.")
            })
            .catch(() => {
                rej("Application encountered a problem updating department. Try again later.");
            });

    });
}

module.exports.deleteDepartment = (depNumber) => {
    return new Promise((res, rej) => {
        departmentsModel.deleteOne({ depNumber: depNumber }).exec()
            .then(() => {
                res("Department deleted.");
            })
            .catch(() => {
                rej("Application encountered a problem deleting department. Try again later.");
            });
    });
}