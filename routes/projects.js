const { checkAuthorization } = require("../middleware-functions.js");
const db_prj = require("../controllers/project-controller.js");

const express = require("express");
const router = express.Router();

//html titles for rendered files
const projects_title = "Projects";

router.get("/", checkAuthorization, (request, response) => {
    db_prj.getAllProjects(request.session.user.username)
        .then((projects) => {
            if (projects.length == 0)
                response.render("projects", {
                    message: "You have no projects yet!",
                    username: request.session.user.username,
                    title: projects_title
                });
            else
                response.render("projects", {
                    projects: projects,
                    username: request.session.user.username,
                    title: projects_title
                });
        })
        .catch(() => {
            response.status(500).render("oops", {
                message: "a problem retrieving projects",
                title: projects_title
            });
        });
});
router.post("/", checkAuthorization, (request, response) => {
    db_prj.addProject(request.body)
        .then(() => {
            response.redirect("/projects");
        }).catch(() => {
            response.status(500).render("oops", {
                message: "a problem adding project",
                title: "Add Project"
            });
        });
});

router.get('/:_id', checkAuthorization, (request, response) => {
    db_prj.getProjectById(request.session.user.username, request.params._id)
        .then((project) => {
            db_prj.getAllProjects(request.session.user.username)
                .then((projects) => {
                    if (project.taskIds.length == 0) {
                        response.render("project", {
                            project: project,
                            projects: projects,
                            message: "This project has no tasks yet!",
                            username: request.session.user.username,
                            title: project.name
                        });
                    } else {
                        response.render("project", {
                            project: project,
                            projects: projects,
                            username: request.session.user.username,
                            title: project.name
                        });
                    }
                })
                .catch(() => {
                    response.status(500).render("oops", {
                        message: "a problem retrieving project",
                        title: "Project"
                    });
                });
        })
        .catch(() => {
            response.status(500).render("oops", {
                message: "a problem retrieving project",
                title: "Project"
            });
        });
})

router.post("/update", checkAuthorization, (request, response) => {
    db_prj.updateProject(request.body)
        .then(() => {
            response.redirect(`/projects/${request.query.id}`);
        })
        .catch(() => {
            response.status(500).render("oops", {
                message: "a problem updating project",
                title: "Update Project"
            });
        })

});

router.get("/delete/:_id", checkAuthorization, (request, response) => {
    db_prj.deleteProject(request.session.user.username, request.params._id)
        .then(() => {
            response.redirect("/projects");
        }).catch(() => {
            response.status(500).render("oops", {
                message: "a problem deleting project",
                title: "Delete Project"
            });
        });
});

module.exports = router;