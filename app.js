if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}
const express = require("express");
const app = express();
app.set('trust proxy', 1); // Required for Render/Heroku proxy — fixes secure cookies
var cookieParser = require('cookie-parser')
app.use(cookieParser("secret"));
const session = require("express-session");
var flash = require('connect-flash');

const engine = require('ejs-mate');
app.engine('ejs', engine);
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));
var methodOverride = require('method-override');
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
const ExpressError = require("./ExpressError.js");
const mongoose = require('mongoose');
let listing = require("./Routes/listing.js")
let reviewe = require("./Routes/review.js");
let signLogin = require("./Routes/usersignupLogin.js")
async function main() {
    const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/project';
    await mongoose.connect(MONGO_URL);
    console.log('Connected to MongoDB');
}
main().catch((err) => { console.log(err) });
const passport = require("passport");
const LocalStrategy = require("passport-local");
const user = require('./Models/user.js');
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // explicit views path for production

app.use(session({
    secret: process.env.SESSION_SECRET || 'wanderlust-fallback-secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    }
}))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
app.use((req, res, next) => {
    res.locals.curruser = req.user;
    next();
})
// app.use((req,res,next)=>{
//     res.locals.fileName = req.file;
//     next();
// })
// Redirect root to /listing
app.get("/", (req, res) => res.redirect("/listing"));

app.use("/", listing);
app.use("/", reviewe);
app.use("/", signLogin);



app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
})
app.use((err, req, res, next) => {
    let { statusCode, message } = err;
    res.render("error.ejs", { message });
})

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


