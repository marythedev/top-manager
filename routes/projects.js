const { checkAuthorization } = require("../middleware-functions.js");
const db_prj = require("../controllers/project-controller.js");

const express = require("express");
const router = express.Router();

//html titles for rendered files
const projects_title = "Projects";
const addProject_title = "Add Project";

router.get("/", checkAuthorization, (req, res) => {
    db_prj.getAllProjects()
        .then((projects) => {
            if (projects.length == 0)
                res.render("projects", {
                    message: "No results",
                    title: projects_title
                });
            else
                res.render("projects", {
                    projects: projects,
                    title: projects_title
                });
        })
        .catch((e) => {
            res.render("projects", {
                message: "Problem retrieving projects.",
                title: projects_title
            });
        });

});
router.get("/add", checkAuthorization, (req, res) => {
    res.render("addProject", { 
        title: addProject_title 
    });
});
router.post("/add", checkAuthorization, (req, res) => {
    db_prj.addProject(req.body)
        .then(() => {
            res.redirect("/projects");
        })
        .catch((e) => {
            res.render("addProject", {
                error: e,
                title: addProject_title
            });
        });
});

module.exports = router;