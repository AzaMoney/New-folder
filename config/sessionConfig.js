// sessionConfig.js
const expressSession = require("express-session");
const connectPgSimple = require('connect-pg-simple');
const { pool } = require("./databaseConfig");

const session = {
  store: new (connectPgSimple(expressSession))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  name: 'sessionId',
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 60 * 1000, // 30 minutes in milliseconds
  },
};

module.exports = session;