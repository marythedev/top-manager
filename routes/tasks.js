const { checkAuthorization } = require("../middleware-functions.js");
const db_task = require("../controllers/task-controller.js");
const db_prj = require("../controllers/project-controller.js");

const express = require("express");
const router = express.Router();

//html titles for rendered files
const tasks_title = "Tasks";

const renderTasks = (response, tasks, username, projects, title) => {
    if (tasks.length == 0)
        response.render("tasks", {
            message: "You have no tasks yet!",
            username: username,
            projects: projects,
            title: title
        });
    else
        response.render("tasks", {
            tasks: tasks,
            username: username,
            projects: projects,
            title: title
        });
}

const renderOopsPage = (response) => {
    response.status(500).render("oops", {
        message: "a problem retrieving tasks",
        title: tasks_title
    });
}

router.get("/", checkAuthorization, (request, response) => {

    db_prj.getAllProjects(request.session.user.username)
        .then((projects) => {
            // if (request.query.priority != undefined) {   //possible priority values: "High", "Medium", "Low"
            //     db_task.getTasksByPriority(request.session.user.username, projects, request.query.priority)
            //         .then((tasks) => {
            //             renderTasks(
            //                 response, tasks,
            //                 request.session.user.username,
            //                 projects, tasks_title
            //             );
            //         }).catch(() => { renderOopsPage(response) });
            // }
            // else if (request.query.project != undefined) {
            //     db_task.getTasksByProject(request.session.user.username, request.query.project)
            //         .then((tasks) => {
            //             renderTasks(
            //                 response, tasks,
            //                 request.session.user.username,
            //                 projects, tasks_title
            //             );
            //         }).catch(() => { renderOopsPage(response) });
            // }
            // else {
            db_task.getAllTasks(request.session.user.username)
                .then((tasks) => {
                    renderTasks(
                        response, tasks,
                        request.session.user.username,
                        projects, tasks_title
                    );
                }).catch(() => { renderOopsPage(response) });
            // }
        })
        .catch(() => {
            renderOopsPage(response);
        });

});
router.post("/", checkAuthorization, (request, response) => {
    db_task.addTask(request.body)
        .then(() => {
            response.redirect("/tasks")
        }).catch(() => {
            response.status(500).render("oops", {
                message: "a problem adding task",
                title: "Add Task"
            });
        });
})

router.post("/update", checkAuthorization, (request, response) => {
    db_task.updateTask(request.body)
        .then(() => {
            response.redirect("/tasks");
        })
        .catch((error) => {
            console.log(error)
            response.status(500).render("oops", {
                message: "a problem updating task",
                title: "Update Task"
            });
        })

});

router.get("/delete/:_id", checkAuthorization, (request, response) => {
    db_task.deleteTask(request.session.user.username, request.params._id)
        .then(() => {
            response.redirect("/tasks");
        }).catch(() => {
            response.status(500).render("oops", {
                message: "a problem deleting task",
                title: "Delete Task"
            });
        });
});

module.exports = router;