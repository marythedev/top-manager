const db_auth = require("../controllers/authorization-controller.js");

const express = require("express");
const router = express.Router();

const register_title = "Register";  //html title for rendered file

router.get("/", (req, res) => {
    res.render("register", { title: register_title });
});
router.post("/", (req, res) => {
    db_auth.register(req.body)
        .then(() => {
            res.render("register", {
                success: "User created!",
                title: register_title
            });
        })
        .catch((e) => {
            res.render("register", {
                error: e,
                username: req.body.username,
                title: register_title
            });
        })
});

module.exports = router;