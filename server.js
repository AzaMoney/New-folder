const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const staticRoutes = require('./route/static');
const baseController = require('./controller/baseController');
const path = require("path");
const expressSession = require("express-session");
const session = require("./config/sessionConfig");
const passport = require("passport");
const Auth0Strategy = require("passport-auth0");
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger-output.json')
const winston = require('winston');
require("dotenv").config();

const authRouter = require("./auth");
const app = express();

// Configure Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.errors({ stack: true })
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

if (app.get("env") === "production") {
  // Serve secure cookies, requires HTTPS
  session.cookie.secure = true;
}

const strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: process.env.AUTH0_CALLBACK_URL
  },
  function (accessToken, refreshToken, extraParams, profile, done) {
    return done(null, profile);
  }
);

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

/* ***********************
 * View Engine and Templates
 *************************/
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(expressLayouts);
app.set('layout', './layouts/layout'); // not at views root

// Apply auth middleware to all routes in this router
app.use(expressSession(session));

passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Set isAuthenticated before rendering views
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

/* ***********************
 * Routes
 *************************/

app.use(staticRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// Define a route
app.use("/auth", authRouter);

app.get('/', baseController.buildLandingPage);

app.use('/user-account', require('./route/userAccountRoute'));

app.use('/project', require('./route/projectRoute'));

app.use('/mentorship', require('./route/mentorshipRoute'));

app.use('/heWhoShallNotBeNamed', require('./route/heWhoShallNotBeNamedRoute'));

app.use('/help', require('./route/helpRoute'))

app.use('/profile', require('./route/profileRoute'))

// Error-handling middleware
app.use(async (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  logger.error('500 error - Internal Server Error', {
    error: err,
    message: err.message,
    stack: err.stack,
    service: 'user-service'
  });
  res.status(err.status || 500).render('errors/error', {
    title: 'Error',
    message: err.message || 'Internal Server Error',
  });
});

// Add a new route for handling 404 errors
app.use((req, res, next) => {
  logger.warn('404 error - Not Found', { url: req.originalUrl });
  res.status(404).render('errors/not-found', { title: 'Not Found' });
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/

const port = process.env.PORT || 8000;

app.listen(port, () => {
  logger.info(`Server is running at http://localhost:${port}`);
});

// Fix isAuthenticated in the router callback

