const db = require("./controllers/db-connection-controller.js");
const { checkAuthorization } = require("./middleware-functions.js");

const loginRoute = require("./routes/login.js");
const registerRoute = require("./routes/register.js");
const employeesRoute = require("./routes/employees.js");
const employeeRoute = require("./routes/employee.js");
const departmentsRoute = require("./routes/departments.js");
const departmentRoute = require("./routes/department.js");

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

app.use(sessions({
    cookieName: "session",
    secret: "thesecretestsecretkeyever",
    duration: 24 * 60 * 60 * 1000,
    activeDuration: 1000 * 60 * 5
}));
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

app.engine("hbs", hbs.engine({
    extname: "hbs",
    defaultLayout: 'main-layout',
    helpers: {
        eq: (arg1, arg2, options) => {
            if (arg1 == arg2)
                return options.fn(this);
            return options.fn(this);
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
    .catch((e) => {
        console.log("App failed to start. " + e);
        db.close();
    });


//available routes
app.get("/", (req, res) => {
    res.render("home", { title: "Home" });
});
app.get("/about", (req, res) => {
    res.render("about", { title: "About" });
});
app.get("/userHistory", checkAuthorization, (req, res) => {
    res.render("userHistory", {title: "User History"});
});

app.use("/login", loginRoute);
app.use("/register", registerRoute);
app.use("/employees", employeesRoute);
app.use("/employee", employeeRoute);
app.use("/departments", departmentsRoute);
app.use("/department", departmentRoute);

app.get("/logout", (req, res) => {
    req.session.reset();
    res.redirect('/');
});
app.get("/*", (req, res) => {
    res.status(404).send("<h1>404 Page Not Found :(</h1>");
});