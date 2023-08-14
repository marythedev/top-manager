const db_acc = require("../controllers/account-controller.js");

const express = require("express");
const router = express.Router();

const signup_title = "Sign Up";  //html title for rendered file

router.get("/", (request, response) => {
    response.render("signup", { title: signup_title });
});
router.post("/", (request, response) => {
    db_acc.signup(request.body)
        .then((user) => {
            request.session.user = { username: user.username };
            response.redirect('/tasks');
        })
        .catch((error) => {
            //Client error format: {code: 400, message: "error message"};
            //Frontend displays error message for the user
            if (error.code == 400) {
                response.render("signup", {
                    error: error.message,
                    username: request.body.username,
                    title: signup_title
                });
            }
            //Any internal error format: "error message";
            //Frontend displays an oops page
            else {
                response.status(500).render("oops", {
                    message: "a problem creating account",
                    username: request.body.username,
                    title: signup_title
                });
            }
        })
});

module.exports = router;