const db_acc = require("../controllers/account-controller.js");

const express = require("express");
const router = express.Router();

const signup_title = "Sign Up";  //html title for rendered file

router.get("/", (req, res) => {
    res.render("signup", { title: signup_title });
});
router.post("/", (req, res) => {
    db_acc.signup(req.body)
        .then((user) => {
            req.session.user = {
                username: user.username
            }
            res.redirect('/tasks');
        })
        .catch((e) => {
            if (e == 11000) {    //duplicate entry
                res.render("signup", {
                    error: "Username is already taken.",
                    username: req.body.username,
                    title: signup_title
                });
            } else {
                console.log(`${e}.`);
                res.status(500).send("Problem encountered while creating account. Try again later or Contact Us.");
            }
           
        })
});

module.exports = router;