const express = require("express");
const router = express.Router();

const contact_title = "Contact";  //page title for rendered file

// render contact page
router.get("/", (request, response) => {
    response.render("contact", { title: contact_title });
});

module.exports = router;