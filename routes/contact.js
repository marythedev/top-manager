const { spawn } = require('child_process');

const express = require("express");
const router = express.Router();

const contact_title = "Contact";  //html title for rendered file

router.get("/", (request, response) => {
    response.render("contact", { title: contact_title });
});

router.post('/', async (request, response) => {
    const emailAPI = request.app.get('emailAPI');
    const emailMessage = `${request.body.message}\nReply to ${request.body.email}(${request.body.name})`;

    const sendEmail = spawn('python', [emailAPI, emailMessage]);
    sendEmail.on('close', (code) => {
        if (code)
            response.status(500).render("oops", {
                message: "a problem sending email",
                contactError: true,
                title: contact_title
            });
        else {
            response.redirect('/tasks');
        };
    });
});

module.exports = router;