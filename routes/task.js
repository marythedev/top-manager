const { checkAuthorization } = require("../middleware-functions.js");
const db_task = require("../controllers/task-controller.js");
const db_prj = require("../controllers/project-controller.js");

const express = require("express");
const router = express.Router();

const task_title = "Task";  //html title for rendered file

// router.get("/:taskNumber", checkAuthorization, (req, res) => {
//     db_task.getTaskByNum(req.session.user.username, req.params.taskNumber)
//     .then((task) => {
//         db_prj.getAllProjects(req.session.user.username, req.session.user.username)
//         .then((projects) => {

//             //set selected property for tasks's project
//             for (const project in projects) {
//                 if (project._id == task.project) {
//                     project.selected = true;
//                     break;
//                 }
//             }

//             res.render("task", { 
//                 task: task, 
//                 projects: projects,
//                 title: task_title 
//             });

//         }).catch((e) => {
//             res.status(500).send(e);
//         });
//     }).catch((e) => {
//         res.status(404).send(e);
//     });
// });
// router.post("/update", checkAuthorization, (req, res) => {
//     db_task.updateTask(req.body)
//         .then(() => { 
//             res.redirect("/tasks"); 
//         })
//         .catch((e) => { 
//             res.render("task", { 
//                 error: e,
//                 task: task, 
//                 projects: projects,
//                 title: task_title 
//             });
//         })

// });
router.get("/delete/:_id", checkAuthorization, (req, res) => {
    db_task.deleteTask(req.session.user.username, req.params._id)
        .then(() => {
            res.redirect("/tasks");
        }).catch(() => {
            res.status(500).send("Problem encountered while deleting task. Try again later.");
        });
});

module.exports = router;