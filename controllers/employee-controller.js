const mongoose = require('mongoose');
require('dotenv').config();     //for environment variables

const employeeSchema = require('../model/Employee');
const employeesModel = mongoose.model(process.env.EMPLOYEE_COLLECTION, employeeSchema);

const processInput = (employee) => {
    for (const input in employee) {
        if (employee[input] == "")
            employee[input] = null;
    }
}

module.exports.getAllEmployees = () => {
    return new Promise((res, rej) => {
        employeesModel.find().lean()
            .then((employees) => {
                res(employees);
            })
            .catch(() => {
                rej("No results.");
            });
    });
}

module.exports.getEmployeesByStatus = (status) => {
    return new Promise((res, rej) => {
        employeesModel.find({ status: status }).lean().exec()
            .then((employees) => {
                res(employees);
            })
            .catch(() => {
                rej("No results.");
            });
    });
}

module.exports.getEmployeesByDepartment = (department) => {
    return new Promise((res, rej) => {
        employeesModel.find({ department: department }).lean().exec()
            .then((employees) => {
                res(employees);
            })
            .catch(() => {
                rej("No results.");
            });
    });
}

module.exports.getEmployeeByNum = (empNumber) => {
    return new Promise((res, rej) => {
        employeesModel.findOne({ empNumber: empNumber }).lean().exec()
            .then((employee) => {
                res(employee);
            })
            .catch(() => {
                rej(`Employee №${empNumber} was not found.`);
            });
    });
}

module.exports.addEmployee = (employee) => {
    return new Promise((res, rej) => {

        processInput(employee);      //process received data to store in db

        const newEmployee = new employeesModel(employee);
        newEmployee.save()
            .then(() => {
                res("Employee created.");
            })
            .catch((e) => {
                if (e.code == 11000)    //duplicate entry
                    rej("Employee № should be unique.");
                else
                    rej(`Problems creating Employee: ${e}`);
            });

    });
}

module.exports.updateEmployee = (update) => {
    return new Promise((res, rej) => {

        processInput(update);      //process received data to store in db

        employeesModel.updateMany({ empNumber: update.empNumber },
            { $set: update })
            .then(() => {
                res("Employee updated.");
            })
            .catch(() => {
                rej("Application encountered a problem updating employee. Try again later.");
            });

    });
}

module.exports.deleteEmployee = (empNumber) => {
    return new Promise((res, rej) => {
        employeesModel.deleteOne({ empNumber: empNumber }).exec()
            .then(() => {
                res("Employee deleted.");
            })
            .catch(() => {
                rej("Application encountered a problem deleting employee. Try again later.");
            });
    });
}