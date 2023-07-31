const { checkAuthorization } = require("../middleware-functions.js");
const db_task = require("../controllers/task-controller.js");
const db_prj = require("../controllers/project-controller.js");

const express = require("express");
const router = express.Router();

//html titles for rendered files
const tasks_title = "Tasks";
const addTask_title = "Add Task";

const displayTasks = (tasks, res) => {
    if (tasks.length == 0)
        res.render("tasks", {
            message: "No results",
            title: tasks_title
        });
    else
        res.render("tasks", {
            tasks: tasks,
            title: tasks_title
        });
}

router.get("/", checkAuthorization, (req, res) => {

    //possible priority values: "High", "Medium", "Low"
    if (req.query.priority != undefined) {
        db_task.getTasksByPriority(req.query.priority)
            .then((tasks) => displayTasks(tasks, res))
            .catch(() => {
                res.render("tasks", {
                    message: "Problem retrieving task.",
                    title: tasks_title
                });
            });
    } else if (req.query.project != undefined) {
        db_task.getTasksByProject(req.query.project)
            .then((tasks) => displayTasks(tasks, res))
            .catch(() => {
                res.render("tasks", {
                    message: "Problem retrieving tasks.",
                    title: tasks_title
                });
            });
    } else {
        db_task.getAllTasks()
            .then((tasks) => displayTasks(tasks, res))
            .catch((e) => {
                console.log(e);
                res.render("tasks", {
                    message: "Problem retrieving tasks.",
                    title: tasks_title
                });
            });
    }

});
router.get("/add", checkAuthorization, (req, res) => {
    db_prj.getAllProjects()
        .then((projects) => {
            res.render("addTask", {
                projects: projects,
                title: addTask_title
            });
        })
        .catch(() => {
            res.status(500).send("Problem encountered while retrieving project data. Try again later.");
        })
});
router.post("/add", checkAuthorization, (req, res) => {
    db_task.addTask(req.body)
        .then(() => {
            res.redirect("/tasks")
        })
        .catch((e) => {
            db_prj.getAllProjects()
                .then((projects) => {
                    res.render("addTask", {
                        error: e,
                        projects: projects,
                        title: addTask_title
                    });
                })
                .catch(() => {
                    res.status(500).send("Problem encountered while retrieving project data. Try again later.");
                })
        });
})

module.exports = router;