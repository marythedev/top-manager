const { checkAuthorization } = require("../middleware-functions.js");
const db_acc = require("../controllers/account-controller.js");

const express = require("express");
const router = express.Router();

//html titles for rendered files
const account_title = "My Account";
const delete_title = "Delete Account";

router.get("/", checkAuthorization, (request, response) => {
    response.render("account", {
        user: request.session.user,
        title: account_title
    });
});
router.post("/", checkAuthorization, (request, response) => {
    db_acc.updateAccount(request.body, request.session)
        .then(() => {
            response.redirect("/");
        })
        .catch((error) => {
            //Client error format: {code: 400, message: "error message"}
            if (error.code == 400) {
                response.render("account", {
                    error: error.message,
                    user: request.session.user,
                    title: account_title
                });
            }
            //Internal error format: "error message"
            else {
                response.status(500).render("oops", {
                    message: "a problem updating account",
                    title: account_title
                });
            }
        })
});

router.get("/delete", checkAuthorization, (request, response) => {
    response.render("delete", { title: delete_title });
});
router.post("/delete", checkAuthorization, (request, response) => {
    db_acc.deleteAccount(request.session.user.username)
        .then(() => {
            response.redirect("/logout");
        })
        .catch(() => {
            response.status(500).render("oops", {
                message: "a problem deleting account",
                title: delete_title
            });
        })

});

module.exports = router;