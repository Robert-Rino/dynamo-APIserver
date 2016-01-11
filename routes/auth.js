'use strict';
const debug = require('debug')('models');
let express = require('express');
let router = express.Router();
let jwt = require('jsonwebtoken');
let Token = require('../models/token.js');
let _ = require('lodash');

const config = require('config');
const hasJWTSecret = config.has('JWT.secret');

let securt = hasJWTSecret ? config.get('JWT.secret') : process.env.JWT_SECRET;

/* GET root route. */
router.get('/', (req, res) => {
  res.json({
    result: 'Hello, this is vCPE API Server!',
  });
});

/* POST /auth/login */
router.post('/auth/login', (req, res) => {
  req.accepts(['application/json']);
  let username = req.body.username;
  let password = req.body.password;

  if (!(password && username)) {
    return res.status(400).json({
      error: 'password and username should be set.',
    });
  }

  let profile = {
    username: username,
    password: password,
  };

  Token
    .query(profile.username)
    .where('password').equals(profile.password)
    .exec((err, resp) => {
      if (err) debug(err);
      if (resp.Count === 0) {
        return res.status(401).json({error: 'Unauthorized'});
      } else {
        let token = jwt.sign(profile, securt);
        Token.update({
          username: profile.username,
          password: profile.password,
          token: token,
        }, function(err, t) {
          if (err) debug(err);
          res.status(200).json({token: token});
        });
      }
    });
});

/* POST /auth/signup */
router.post('/auth/signup', (req, res) => {
  req.accepts(['application/json']);
  let username = req.body.username;
  let password = req.body.password;
  let email = req.body.email;

  if (!(password && username && email)) {
    return res.status(400).json({
      error: 'password, username and email should be set.',
    });
  }

  let profile = {
    username: username,
    password: password,
    email: email,
  };
  console.log(profile)
  
  Token
    .query(profile.username)
    .exec((err, resp) => {
      if (err) debug(err);
      if (resp.Count !== 0) {
        return res.status(409).json({
          error: 'Account exists',
        });
      } else {
        let token = jwt.sign(profile, securt);
        Token.create({
          username: profile.username,
          password: profile.password,
          email: email,
          token: token,
        }, {overwrite: false}, (err, acc) => {
          if (err) {
            return res.status(409).json({
              error: 'Account exists',
            });
          };

          return res.status(200).json({token: token});
        });
      }
    });

});

module.exports = router;
