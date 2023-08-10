const { checkAuthorization } = require("../middleware-functions.js");
const db_task = require("../controllers/task-controller.js");
const db_prj = require("../controllers/project-controller.js");

const express = require("express");
const router = express.Router();

//html titles for rendered files
const tasks_title = "Tasks";

const displayTasks = (tasks, res, req) => {
    if (tasks.length == 0)
        res.render("tasks", {
            message: "You have no tasks yet!",
            username: req.session.user.username,
            title: tasks_title
        });
    else
        res.render("tasks", {
            tasks: tasks,
            username: req.session.user.username,
            title: tasks_title
        });
}

router.get("/", checkAuthorization, (req, res) => {

    db_prj.getAllProjects(req.session.user.username)
        .then((projects) => {
            //possible priority values: "High", "Medium", "Low"
            if (req.query.priority != undefined) {
                db_task.getTasksByPriority(req.session.user.username, req.query.priority)
                    .then((tasks) => displayTasks(tasks, res, req))
                    .catch(() => {
                        res.render("tasks", {
                            message: "Problem retrieving task.",
                            username: req.session.user.username,
                            projects: projects,
                            title: tasks_title
                        });
                    });
            } else if (req.query.project != undefined) {
                db_task.getTasksByProject(req.session.user.username, req.query.project)
                    .then((tasks) => displayTasks(tasks, res, req))
                    .catch(() => {
                        res.render("tasks", {
                            message: "Problem retrieving tasks.",
                            username: req.session.user.username,
                            projects: projects,
                            title: tasks_title
                        });
                    });
            } else {
                db_task.getAllTasks(req.session.user.username)
                    .then((tasks) => displayTasks(tasks, res, req))
                    .catch((e) => {
                        console.log(e);
                        res.render("tasks", {
                            message: "Problem retrieving tasks.",
                            username: req.session.user.username,
                            projects: projects,
                            title: tasks_title
                        });
                    });
            }
        }).catch(() => {
            res.status(500).send("Problem encountered while retrieving project data. Try again later.");
        })

});
router.post("/", checkAuthorization, (req, res) => {
    db_task.addTask(req.body)
        .then(() => {
            res.redirect("/tasks")
        })
        .catch((e) => {
            console.log(e);
            db_prj.getAllProjects(req.session.user.username)
                .then((projects) => {
                    //possible priority values: "High", "Medium", "Low"
                    if (req.query.priority != undefined) {
                        db_task.getTasksByPriority(req.session.user.username, req.query.priority)
                            .then((tasks) => displayTasks(tasks, res, req))
                            .catch(() => {
                                res.render("tasks", {
                                    error: e,
                                    message: "Problem retrieving task.",
                                    username: req.session.user.username,
                                    projects: projects,
                                    title: tasks_title
                                });
                            });
                    } else if (req.query.project != undefined) {
                        db_task.getTasksByProject(req.session.user.username, req.query.project)
                            .then((tasks) => displayTasks(tasks, res, req))
                            .catch(() => {
                                res.render("tasks", {
                                    error: e,
                                    message: "Problem retrieving tasks.",
                                    username: req.session.user.username,
                                    projects: projects,
                                    title: tasks_title
                                });
                            });
                    } else {
                        db_task.getAllTasks(req.session.user.username)
                            .then((tasks) => displayTasks(tasks, res, req))
                            .catch((e) => {
                                console.log(e);
                                res.render("tasks", {
                                    error: e,
                                    message: "Problem retrieving tasks.",
                                    username: req.session.user.username,
                                    projects: projects,
                                    title: tasks_title
                                });
                            });
                    }
                }).catch(() => {
                    res.status(500).send("Problem encountered while retrieving project data. Try again later.");
                })

        });
})

module.exports = router;