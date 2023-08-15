const express = require("express");
const router = express.Router();

const contact_title = "Contact";  //html title for rendered file

router.get("/", (request, response) => {
    response.render("contact", { title: contact_title });
});

router.post('/', (request, response) => {
    console.log("sending email...");
    response.render("contact", { 
        error: "Backend for contact form is not implemented yet! Try again later.",
        title: contact_title 
    });
});

module.exports = router;