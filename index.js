const config = require("./config/config");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const server = require("http").createServer(app);
const mongoose = require("mongoose");
const path = require("path");
const expressValidator = require("express-validator");

const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const cookieParser = require("cookie-parser");

/* **** MONGODB **** */
mongoose.connect(`mongodb://${config.db.host}/${config.db.database}`, {
    useCreateIndex: true,
    useNewUrlParser: true
});
/*****************************/

/* **** VIEW CONFIGURATION **** */
app.set("views", path.join(__dirname, "/src/views"));
app.set("view engine", "twig");
app.set("twig options", {
    allow_async: true // Allow asynchronous compiling
});
/*****************************/

/* **** MIDDLEWARES **** */
app.use(express.static(path.join(__dirname, "/public")));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// Express Session
app.use(session({
    secret: "secret",
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express validator
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        let namespace = param.split(".");
        let root = namespace.shift();
        let formParam = root;

        while (namespace.length) {
            formParam += "[" + namespace.shift() + "]";
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.form = req.flash("form");
    res.locals.user = req.user || null;
    next();
});
/*******************/
const { ensureAuthenticated, isAdmin } = require("./routes/middlewares/Authenticated");

/* **** Routes **** */
app.use("/", require("./routes/UserRoutes"));
app.use("/exercises", require("./routes/ExerciseRoutes"));
app.use("/sets", require("./routes/SetRoutes"));
app.use("/profile", ensureAuthenticated, require("./routes/ProfileRoutes"));
app.use("/profile/settings", ensureAuthenticated, require("./routes/SettingsRoutes"));
app.use("/api", require("./routes/ApiRoutes"));
app.use("/admin", isAdmin, require("./routes/AdminRoutes"));
app.use("/doc", require("./routes/DocumentationRoutes"));
/*******************/

server.listen(config.app.port, () => {
    console.log(`Server running on port ${config.app.port}`);
});