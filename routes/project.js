const { checkAuthorization } = require("../middleware-functions.js");
const db_prj = require("../controllers/project-controller.js");

const express = require("express");
const router = express.Router();

const project_title = "Project";  //html title for rendered file

// router.get('/:prjNumber', checkAuthorization, (req, res) => {
//     db_prj.getProjectByNum(req.session.user.username, req.params.prjNumber)
//         .then((project) => {
//             if (project != undefined)
//                 res.render("project", { project: project, title: project_title });
//             else
//                 res.status(404).send("Project Not Found");
//         }, (rej) => { throw rej; })
//         .catch((reason) => {
//             console.log(reason);
//             res.status(404).send("Project Not Found");
//         });
// })
// router.post("/update", checkAuthorization, (req, res) => {
//     db_prj.updateProject(req.body)
//         .then(() => { 
//             res.redirect("/projects"); 
//         })
//         .catch(() => { 
//             res.status(500).send("Problem encountered while updating project. Try again later.");
//         })

// });
router.get("/delete/:_id", checkAuthorization, (req, res) => {
    db_prj.deleteProject(req.session.user.username, req.params._id)
        .then(() => {
            res.redirect("/projects");
        }).catch(() => {
            res.status(500).send("Problem encountered while deleting project. Try again later.");
        });
});

module.exports = router;