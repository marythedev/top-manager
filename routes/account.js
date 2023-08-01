const { checkAuthorization } = require("../middleware-functions.js");
const db_acc = require("../controllers/account-controller.js");

const express = require("express");

const router = express.Router();

//html titles for rendered files
const account_title = "Account"; 
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
            res.render("account", {
                error: e,
                user: req.session.user,
                title: account_title
            });
        })

});

router.get("/history", checkAuthorization, (req, res) => {
    res.render("history", { title: "Login History" });
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
            res.render("delete", {
                error: e,
                title: delete_title
            });
        })

});

module.exports = router;