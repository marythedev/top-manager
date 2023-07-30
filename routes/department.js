const { checkAuthorization } = require("../middleware-functions.js");
const db_dep = require("../controllers/department-controller.js");

const express = require("express");
const router = express.Router();

const department_title = "Department";  //html title for rendered file

router.get('/:depNumber', checkAuthorization, (req, res) => {
    db_dep.getDepartmentById(req.params.depNumber)
        .then((data) => {
            if (data != undefined)
                res.render("department", { department: data, title: department_title });
            else
                res.status(404).send("Department Not Found");
        }, (rej) => { throw rej; })
        .catch((reason) => {
            console.log(reason);
            res.status(404).send("Department Not Found");
        });
})
router.post("/update", checkAuthorization, (req, res) => {
    db_dep.updateDepartment(req.body)
        .then(() => { 
            res.redirect("/departments"); 
        })
        .catch((e) => { 
            res.render("department", { 
                error: e,
                department: data, 
                title: department_title });
        })

});
router.get("/delete/:depNumber", checkAuthorization, (req, res) => {
    db_dep.deleteDepartment(req.params.depNumber)
        .then(() => {
            res.redirect("/departments");
        }).catch(() => {
            res.status(500).send("Problem encountered while deleting department data. Try again later.");
        });
});

module.exports = router;