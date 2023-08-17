const { checkAuthorization } = require("../middleware-functions.js");
const db_prj = require("../controllers/project-controller.js");

const express = require("express");
const router = express.Router();

const project_title = "Project";  //html title for rendered file


// router.post("/update", checkAuthorization, (req, res) => {
//     db_prj.updateProject(req.body)
//         .then(() => { 
//             res.redirect("/projects"); 
//         })
//         .catch(() => { 
//             res.status(500).send("Problem encountered while updating project. Try again later.");
//         })

// });
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