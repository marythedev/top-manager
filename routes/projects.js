const { checkAuthorization } = require("../middleware-functions.js");
const db_prj = require("../controllers/project-controller.js");

const express = require("express");
const router = express.Router();

//html titles for rendered files
const projects_title = "Projects";

const renderNoProjects = (res, message, username, title) => {
    res.render("projects", {
        message: message,
        username: username,
        title: title
    });
}

const renderProjects = (res, projects, username, title) => {
    res.render("projects", {
        projects: projects,
        username: username,
        title: title
    });
}

router.get("/", checkAuthorization, (req, res) => {
    db_prj.getAllProjects(req.session.user.username)
        .then((projects) => {
            if (projects.length == 0)
                renderNoProjects(res, "You have no projects yet!", req.session.user.username, projects_title);
            else
                renderProjects(res, projects, req.session.user.username, projects_title);
        })
        .catch(() => {
            renderNoProjects(res, "Problem retrieving projects.", req.session.user.username, projects_title);
        });

});
router.post("/", checkAuthorization, (req, res) => {
    db_prj.addProject(req.body)
        .then(() => {
            res.redirect("/projects");
        })
        .catch((e) => {
            console.log(`${e}.`);
            res.status(500).send("Problem encountered while adding project data. Try again later or Contact Us.");
        });
});

module.exports = router;