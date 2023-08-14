const db = require("./controllers/db-connection-controller.js");

const loginRoute = require("./routes/login.js");
const signupRoute = require("./routes/signup.js");
const contactRoute = require("./routes/contact.js");
const accountRoute = require("./routes/account.js");
const tasksRoute = require("./routes/tasks.js");
const taskRoute = require("./routes/task.js");
const projectsRoute = require("./routes/projects.js");
const projectRoute = require("./routes/project.js");

const hbs = require('express-handlebars');
const sessions = require('client-sessions');
const path = require('path');
require('dotenv').config();     //for environment variables
const express = require("express");



//set up application
const PORT = process.env.PORT || 3000;
const app = express();

//set up middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(sessions({
    cookieName: "session",
    secret: "thesecretestsecretkeyever",
    duration: 24 * 60 * 60 * 1000,
    activeDuration: 1000 * 60 * 5
}));
app.use((request, response, next) => {
    response.locals.session = request.session;
    next();
});

app.engine("hbs", hbs.engine({
    extname: "hbs",
    defaultLayout: 'main',
    helpers: {
        getProjectName: (projects, _id) => {
            for (const project of projects) {
                if (project._id == _id)
                    return project.name;
            }
        }
    }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, './views'));


//start the app
db.connect()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`App is listening on port ${PORT} :)`);
        });
    })
    .catch((error) => {
        console.log("App failed to start. " + error);
    });


//available routes
app.get("/", (request, response) => {
    response.render("home", { title: "Home" });
});

app.use("/login", loginRoute);
app.use("/signup", signupRoute);
app.use("/contact", contactRoute);
app.use("/account", accountRoute);
app.use("/tasks", tasksRoute);
app.use("/task", taskRoute);
app.use("/projects", projectsRoute);
app.use("/project", projectRoute);

app.get("/logout", (request, response) => {
    request.session.reset();
    response.redirect('/');
});
app.get("/*", (request, response) => {
    response.status(404).render("page404", { title: "Not Found" });
});