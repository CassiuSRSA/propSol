// BUILT-IN PACKAGES
const path = require("path");

// 3RD PARTY PACKAGES
const express = require("express");
const session = require("express-session");
const mongodbStore = require("connect-mongodb-session");

const app = express();

// DATABASE
const db = require("./data/database");

// ROUTER
const authRoutes = require("./routes/authRoutes");
const captureRoutes = require("./routes/captureRoutes");
const adminRoutes = require("./routes/adminRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

// SETTING UP PORT ENV VARIABLE
let port = 3000;

if (process.env.PORT) {
  port = process.env.PORT;
}

//MONGODBSTORE SETUP
const MongoDBStore = mongodbStore(session);

const sessionStore = new MongoDBStore({
  uri: db.mongodbUrl,
  databaseName: "propsol",
  collection: "sessions",
});

// VIEW ENGINE SETUP
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// EXPRESS MIDDLEWARE SETUP
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

// EXPRESS-SESSION SETUP
app.use(
  session({
    secret: "super-secret",
    resave: "false",
    saveUninitialized: false,
    store: sessionStore,
  })
);

// CUSTOM MIDDLEWARE FOR STORING DATA TO BE ACCESSED GLOBALLY IN ALL TEMPLATES
app.use(async (req, res, next) => {
  const user = req.session.user;
  const isAuth = req.session.isAuthenticated;

  if (!user || !isAuth) {
    return next();
  }

  const userDoc = await db
    .getDb()
    .collection("users")
    .findOne({ _id: user.id });
  const isAdmin = userDoc.isAdmin;

  res.locals.isAuth = isAuth;
  res.locals.isAdmin = isAdmin;

  next();
});

// USE ROUTER
app.use(adminRoutes);
app.use(dashboardRoutes);
app.use(captureRoutes);
app.use(authRoutes);

// CATCH ALL ERROR HANDLER
app.use((error, req, res, next) => {
  res.render("500");
});

// INITIATE SERVER UPON DATABASE CONNECTION
db.connectToDatabase().then(() => {
  app.listen(port);
});
