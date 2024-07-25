const express = require("express");
const router = express.Router();
const passport = require("passport");
const querystring = require("querystring");
const userModel = require('./model/userAccountModel')
const winston = require('winston');

require("dotenv").config();

// Configure Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'auth-service' },
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

/**
 * Routes Definitions
 */

router.get(
    "/login",
    (req, res, next) => {
      // Store the returnTo information in the session
      req.session.returnTo = req.headers.referer || "/";
      logger.info('Login initiated', { returnTo: req.session.returnTo });
      passport.authenticate("auth0", {
        scope: "openid email profile",
      })(req, res, next);
    },
    (req, res) => {
      res.redirect("/");
    }
  );

  router.get("/callback", async (req, res, next) => {
    passport.authenticate("auth0", async (err, user, info) => {
      if (err) {
        logger.error('Error during authentication', { error: err });
        return next(err);
      }
      if (!user) {
        logger.warn('User not authenticated, redirecting to login');
        return res.redirect("/auth/login");
      }
  
      try {
        const { provider, user_id } = user;
        const isExistingUser = await userModel.checkForExistingUser(provider, user_id);
  
        if (isExistingUser) {
          // User already exists, redirect to the account page
          req.logIn(user, (err) => {
            if (err) {
              logger.error('Error logging in existing user', { error: err });
              return next(err);
            }
            const returnTo = req.session.returnTo;
            delete req.session.returnTo;
            logger.info('Existing user logged in', { user });
            res.redirect(returnTo || "/");
          });
        } else {
          // User does not exist, redirect to the sign-up page
          req.logIn(user, (err) => {
            if (err) {
              logger.error('Error logging in new user', { error: err });
              return next(err);
            }
            const returnTo = req.session.returnTo;
            delete req.session.returnTo;
            logger.info('New user logged in', { user });
            res.redirect(returnTo || "/user-account/sign-up");
          });
        }
      } catch (error) {
        if (!res.headersSent) {
          logger.error('Error checking for existing user', { error });
          next(error);
        }
      }
    })(req, res, next);
  });

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            logger.error('Logout error', { error: err });
            return next(err);
        }

        let returnTo = `${req.protocol}://${req.hostname}`;
        if (process.env.NODE_ENV !== "production") {
            returnTo = `${returnTo}:${process.env.PORT}/`;
        }

        if (!process.env.AUTH0_DOMAIN || !process.env.AUTH0_CLIENT_ID) {
            logger.error('Missing AUTH0_DOMAIN or AUTH0_CLIENT_ID environment variables');
            return res.status(500).send("Internal Server Error");
        }

        const logoutURL = new URL(`https://${process.env.AUTH0_DOMAIN}/v2/logout`);
        const searchString = querystring.stringify({
            client_id: process.env.AUTH0_CLIENT_ID,
            returnTo: returnTo,
        });

        logoutURL.search = searchString;

        logger.info('User logged out', { logoutURL: logoutURL.toString() });
        res.redirect(logoutURL.toString());
    });
});

/**
 * Module Exports
 */

module.exports = router;