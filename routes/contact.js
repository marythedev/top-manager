const { spawn } = require('child_process');

const express = require("express");
const router = express.Router();

const contact_title = "Contact";  //html title for rendered file

router.get("/", (request, response) => {
    response.render("contact", { title: contact_title });
});

router.post('/', async (request, response) => {
    const emailAPI = request.app.get('emailAPI');
    const sendEmail = spawn('python', [emailAPI]);

    sendEmail.stdout.on('data', (data) => {
        console.log(`${data}`);
    });

    sendEmail.stderr.on('data', (data) => {
        console.error(`${data}`);
    });

    response.render("contact", {
        error: "Backend for contact form is not implemented yet! Try again later.",
        title: contact_title
    });
});

module.exports = router;