const express = require("express");

const router = express.Router();

const contact_title = "Contact";  //html title for rendered file

router.get("/", (req, res) => {
    res.render("contact", { title: contact_title });
});

router.post('/', (req, res) => {
    console.log("sending email...");
    res.render("contact", { 
        error: "Backend for contact form is not implemented yet! Try again later.",
        title: contact_title 
    });
});

module.exports = router;