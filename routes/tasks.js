const { checkAuthorization } = require("../middleware-functions.js");
const db_task = require("../controllers/task-controller.js");
const db_prj = require("../controllers/project-controller.js");

const express = require("express");
const router = express.Router();

//html titles for rendered files
const tasks_title = "Tasks";

const renderNoTasks = (res, message, username, projects, title) => {
    res.render("tasks", {
        message: message,
        username: username,
        projects: projects,
        title: title
    });
}

const renderTasks = (res, tasks, username, projects, title) => {
    res.render("tasks", {
        tasks: tasks,
        username: username,
        projects: projects,
        title: title
    });
}

router.get("/", checkAuthorization, (req, res) => {

    db_prj.getAllProjects(req.session.user.username)
        .then((projects) => {
            //possible priority values: "High", "Medium", "Low"
            if (req.query.priority != undefined) {
                db_task.getTasksByPriority(req.session.user.username, projects, req.query.priority)
                    .then((tasks) => {
                        if (tasks.length == 0)
                            renderNoTasks(res, "You have no tasks yet!", req.session.user.username, projects, tasks_title);
                        else
                            renderTasks(res, tasks, req.session.user.username, projects, tasks_title)
                    })
                    .catch(() => {
                        renderNoTasks(res, "Problem retrieving task.", req.session.user.username, projects, tasks_title);
                    });
            } else if (req.query.project != undefined) {
                db_task.getTasksByProject(req.session.user.username, req.query.project)
                    .then((tasks) => {
                        if (tasks.length == 0)
                            renderNoTasks(res, "You have no tasks yet!", req.session.user.username, projects, tasks_title);
                        else
                            renderTasks(res, tasks, req.session.user.username, projects, tasks_title)
                    })
                    .catch(() => {
                        renderNoTasks(res, "Problem retrieving tasks.", req.session.user.username, projects, tasks_title);
                    });
            } else {
                db_task.getAllTasks(req.session.user.username)
                    .then((tasks) => {
                        if (tasks.length == 0)
                            renderNoTasks(res, "You have no tasks yet!", req.session.user.username, projects, tasks_title);
                        else
                            renderTasks(res, tasks, req.session.user.username, projects, tasks_title);
                    })
                    .catch(() => {
                        renderNoTasks(res, "Problem retrieving tasks.", req.session.user.username, projects, tasks_title);
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
        .catch(() => {
            res.status(500).send("Problem encountered while adding task. Try again later.");
        });
})

module.exports = router;