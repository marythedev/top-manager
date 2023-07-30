const { checkAuthorization } = require("../middleware-functions.js");
const db_emp = require("../controllers/employee-controller.js");
const db_dep = require("../controllers/department-controller.js");

const express = require("express");
const router = express.Router();

const employee_title = "Employee";  //html title for rendered file

router.get("/:empNumber", checkAuthorization, (req, res) => {
    db_emp.getEmployeeByNum(req.params.empNumber)
    .then((employee) => {
        db_dep.getDepartments()
        .then((departments) => {

            //set selected property for employee's department
            for (const department in departments) {
                if (department.departmentId == employee.department) {
                    departments.selected = true;
                    break;
                }
            }

            res.render("employee", { 
                employee: employee, 
                departments: departments,
                title: employee_title 
            });

        }).catch((e) => {
            res.status(500).send(e);
        });
    }).catch((e) => {
        res.status(404).send(e);
    });
});
router.post("/update", checkAuthorization, (req, res) => {
    db_emp.updateEmployee(req.body)
        .then(() => { 
            res.redirect("/employees"); 
        })
        .catch((e) => { 
            res.render("employee", { 
                error: e,
                employee: employee, 
                departments: departments,
                title: employee_title 
            });
        })

});
router.get("/delete/:empNumber", checkAuthorization, (req, res) => {
    db_emp.deleteEmployee(req.params.empNumber)
        .then(() => {
            res.redirect("/employees");
        }).catch(() => {
            res.status(500).send("Problem encountered while deleting employee data. Try again later.");
        });
});

module.exports = router;