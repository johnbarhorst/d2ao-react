const express = require('express');
const https = require('https');
const fs = require('fs');
const rp = require('request-promise-native');
const path = require('path');
const cookieSession = require('cookie-session');
const mongoose = require('mongoose');
const passport = require('passport');
require('dotenv').config();

const { PORT } = process.env || 3001;
const { API_KEY, Mongo_DB, cookieKey } = process.env;

const app = express();

const serverListenTime = function () {
  const today = new Date();
  const time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
  return time;
}


// Connect to MongoDB
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};
mongoose.connect(Mongo_DB, mongoOptions, () => console.log('Connected to MongoDB'));

//Middleware
const authCheck = (req, res, next) => {
  if (!req.user) {
    res.status(401).json({
      authenticated: false,
      message: "user has not been authenticated"
    });
  } else {
    next();
  }
};

app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: [process.env.cookieKey],
}));

// Routing
const authRoutes = require('./routes/auth.js');
const apiRoutes = require('./routes/api.js');



app.use(passport.initialize());
app.use(passport.session());

// OAuth Handling
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

// Error handling, keep at bottom of middleware (so sayeth the docs)
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(404).send("Sorry can't find that!");
});

app.use(express.static(path.join(__dirname, '/client/build')));

app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});


https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.crt')
}, app).listen(PORT, err => {
  console.log(`Listening on port ${PORT} at ${serverListenTime()}`);
  if (err) console.log('error', err);
});