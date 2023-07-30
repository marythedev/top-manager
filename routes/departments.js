const { checkAuthorization } = require("../middleware-functions.js");
const db_dep = require("../controllers/department-controller.js");

const express = require("express");
const router = express.Router();

//html titles for rendered files
const departments_title = "Departments";
const addDepartment_title = "Add Department";

router.get("/", checkAuthorization, (req, res) => {
    db_dep.getDepartments()
        .then((departments) => {
            if (departments.length == 0)
                res.render("departments", {
                    message: "No results",
                    title: departments_title
                });
            else
                res.render("departments", {
                    departments: departments,
                    title: departments_title
                });
        })
        .catch(() => {
            res.render("departments", {
                message: "Problem retrieving departments.",
                title: departments_title
            });
        });

});
router.get("/add", checkAuthorization, (req, res) => {
    res.render("addDepartment", { 
        title: addDepartment_title 
    });
});
router.post("/add", checkAuthorization, (req, res) => {
    db_dep.addDepartment(req.body)
        .then(() => {
            res.redirect("/departments");
        })
        .catch((e) => {
            res.render("addDepartment", {
                error: e,
                title: addDepartment_title
            });
        });
});

module.exports = router;