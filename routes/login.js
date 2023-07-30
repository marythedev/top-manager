const db_auth = require("../controllers/authorization-controller.js");

const express = require("express");

const router = express.Router();

const login_title = "Login";  //html title for rendered file

router.get("/", (req, res) => {
    res.render("login", { title: login_title });
});
router.post("/", (req, res) => {
    db_auth.login(req.body)
        .then((user) => {
            req.session.user = {
                username: user.username,
                email: user.email,
                history: user.history
            }
            res.redirect('/employees');
        })
        .catch((e) => {
            res.render("login", {
                error: e,
                username: req.body.username,
                title: login_title
            });
        });

});

module.exports = router;