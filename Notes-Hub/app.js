const express = require("express");
const expressEjsLayouts = require("express-ejs-layouts");
const connectDB = require("./server/config/db");
const methodOverride = require("method-override") 

const session = require("express-session");
const passport = require("passport");
const mongoStore = require("connect-mongo");

const app = express();
const port = process.env.PORT || 3000;

app.use(
    session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: true,
        store: mongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"))

// Connect to Database
connectDB();

// Static Files
app.use(express.static("public"));

// Templating Engine
app.use(expressEjsLayouts);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

// Routes
app.use("/", require("./server/routes/auth"));
app.use("/", require("./server/routes/index"));
app.use("/", require("./server/routes/dashboard"));

// Handle 404
app.use("*", function (req, res) {
    // res.status(404).send('404 - Page not found.')
    res.status(404).render("404");
});

app.listen(port, () => {
    console.log(`App listening on PORT: ${port}`);
});
