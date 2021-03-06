'use strict';
let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let expressJwt = require('express-jwt');
let cors = require('cors');
const config = require('config');
const hasJWTSecret = config.has('JWT.secret');

let dynamo = require('./lib/generate.js');

// let qResult = dynamo.query(70664);
// let test = dynamo.save(1);
// console.log(test);

let routes = require('./routes/index');
let auth = require('./routes/auth.js');
let users = require('./routes/users.js');

let authenticate = hasJWTSecret ?
   expressJwt({ secret: config.get('JWT.secret') }) :
   expressJwt({ secret: process.env.JWT_SECRET });
let app = express();

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// // return 401 when no authorization
// app.use('/api', authenticate, (err, req, res, next) => {
//   if (err.name === 'UnauthorizedError') {
//     res.status(401).send('Unauthorized or invalid token.');
//   }
// });

app.use((req, res, next) => {
  next();
});

app.use('/', routes);
app.use('/users', users);

module.exports = app;
