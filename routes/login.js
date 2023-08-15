const { checkNeedForLogin } = require("../middleware-functions.js");
const db_acc = require("../controllers/account-controller.js");

const express = require("express");
const router = express.Router();

const login_title = "Login";  //html title for rendered file

router.get("/", checkNeedForLogin, (request, response) => {
    response.render("login", { title: login_title });
});
router.post("/", checkNeedForLogin, (request, response) => {
    db_acc.login(request.body)
        .then((user) => {
            request.session.user = { username: user.username };
            response.redirect('/tasks');
        })
        .catch((error) => {
            //Client error format: {code: 400, message: "error message"}
            if (error.code == 400) {
                response.render("login", {
                    error: error.message,
                    title: login_title
                });
            }
            //Internal error format: "error message"
            else {
                response.status(500).render("oops", {
                    message: "a problem logging you in",
                    title: login_title
                });
            }
        });
});

module.exports = router;