const { checkAuthorization } = require("../middleware-functions.js");
const db_prj = require("../controllers/project-controller.js");

const express = require("express");
const router = express.Router();

//html titles for rendered files
const projects_title = "Projects";

router.get("/", checkAuthorization, (req, res) => {
    db_prj.getAllProjects(req.session.user.username)
        .then((projects) => {
            if (projects.length == 0)
                res.render("projects", {
                    message: "You have no projects yet!",
                    username: req.session.user.username,
                    title: projects_title
                });
            else
                res.render("projects", {
                    projects: projects,
                    username: req.session.user.username,
                    title: projects_title
                });
        })
        .catch((e) => {
            res.render("projects", {
                message: "Problem retrieving projects.",
                username: req.session.user.username,
                title: projects_title
            });
        });

});
router.post("/", checkAuthorization, (req, res) => {
    db_prj.addProject(req.body)
        .then(() => {
            res.redirect("/projects");
        })
        .catch((e) => {
            db_prj.getAllProjects(req.session.user.username)
                .then((projects) => {
                    if (projects.length == 0)
                        res.render("projects", {
                            error: e,
                            message: "You have no projects yet!",
                            username: req.session.user.username,
                            title: projects_title
                        });
                    else
                        res.render("projects", {
                            error: e,
                            projects: projects,
                            username: req.session.user.username,
                            title: projects_title
                        });
                })
        });
});

module.exports = router;