const { checkAuthorization } = require("../middleware-functions.js");
const db_acc = require("../controllers/account-controller.js");

const express = require("express");

const router = express.Router();

//html titles for rendered files
const account_title = "My Account";
const delete_title = "Delete Account";

router.get("/", checkAuthorization, (req, res) => {
    res.render("account", {
        user: req.session.user,
        title: account_title
    });
});

router.post("/", checkAuthorization, (req, res) => {
    db_acc.updateAccount(req.body, req.session)
        .then(() => {
            res.redirect("/");
        })
        .catch((e) => {
            if (e == 11000) {    //duplicate entry
                res.render("account", {
                    error: "Username is already taken.",
                    user: req.session.user,
                    title: account_title
                });
            } else {
                console.log(`${e}.`);
                res.status(500).send("Problem encountered while updating account. Try again later or Contact Us.");
            }
        })

});

router.get("/delete", checkAuthorization, (req, res) => {
    res.render("delete", {
        title: delete_title
    });
});

router.post("/delete", checkAuthorization, (req, res) => {
    db_acc.deleteAccount(req.session.user.username)
        .then(() => {
            res.redirect("/logout");
        })
        .catch((e) => {
            console.log(`${e}.`);
            res.status(500).send("Problem encountered while deleting account. Try again later or Contact Us.");
        })

});

module.exports = router;