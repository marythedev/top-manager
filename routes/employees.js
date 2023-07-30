const { checkAuthorization } = require("../middleware-functions.js");
const db_emp = require("../controllers/employee-controller.js");
const db_dep = require("../controllers/department-controller.js");

const express = require("express");
const router = express.Router();

//html titles for rendered files
const employees_title = "Employees";
const addEmployee_title = "Add Employee";

const displayEmployees = (employees, res) => {
    if (employees.length == 0)
        res.render("employees", {
            message: "No results",
            title: employees_title
        });
    else
        res.render("employees", {
            employees: employees,
            title: employees_title
        });
}

router.get("/", checkAuthorization, (req, res) => {

    //possible status values: "Full Time" & "Part Time"
    if (req.query.status != undefined) {
        db_emp.getEmployeesByStatus(req.query.status)
            .then((employees) => displayEmployees(employees, res))
            .catch((e) => {
                res.render("employees", {
                    message: "Problem retrieving employees.",
                    title: employees_title
                });
            });
    } else if (req.query.department != undefined) {
        db_emp.getEmployeesByDepartment(req.query.department)
            .then((employees) => displayEmployees(employees, res))
            .catch(() => {
                res.render("employees", {
                    message: "Problem retrieving employees.",
                    title: employees_title
                });
            });
    } else {
        db_emp.getAllEmployees()
            .then((employees) => displayEmployees(employees, res))
            .catch((e) => {
                console.log(e);
                res.render("employees", {
                    message: "Problem retrieving employees.",
                    title: employees_title
                });
            });
    }

});
router.get("/add", checkAuthorization, (req, res) => {
    db_dep.getDepartments()
        .then((departments) => {
            res.render("addEmployee", {
                departments: departments,
                title: addEmployee_title
            });
        })
        .catch(() => {
            res.status(500).send("Problem encountered while retrieving department data. Try again later.");
        })
});
router.post("/add", checkAuthorization, (req, res) => {
    db_emp.addEmployee(req.body)
        .then(() => {
            res.redirect("/employees")
        })
        .catch((e) => {
            db_dep.getDepartments()
                .then((departments) => {
                    res.render("addEmployee", {
                        error: e,
                        departments: departments,
                        title: addEmployee_title
                    });
                })
                .catch(() => {
                    res.status(500).send("Problem encountered while retrieving department data. Try again later.");
                })
        });
})

module.exports = router;