if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require("express");
const mongoose = require("mongoose");


const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");

// implementing for passport based authentication
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const app = express();

const sessionOption = { //object
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
}

app.set("views engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(session(sessionOption));
app.use(flash());  //it use before all routes

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.engine('ejs', ejsMate);


const dbUrl = process.env.ATLASDB_URL;


main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    })

async function main() {
    await mongoose.connect(dbUrl);
}

app.get("/", (req, res) => {
    res.render("home.ejs");

});


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})


app.use("/listings", listingRouter);  // for routers->listing.js
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);



app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
    console.log(err);
});


app.listen(3000, () => {
    console.log("server is listening to port 3000");
});

