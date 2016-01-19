'use strict';
let express = require('express');
let _  = require('lodash');
let util = require('util');
let Joi = require('joi');
let debug = require('debug')('routesUsers');

let uPlayModel = require('../models/userPlay.js');
let generater = require('../lib/generate.js');

let router = express.Router();

// fake data
let data = {
  2:{
  userId: 122,
  courseId: 5,
  count: 120,
},
};

/* GET users testing. */
router.get('/', function(req, res) {
  res.send('user.js page').status(200);
});

/* GET latest users record ). */
router.get('/read/playrecord/:uid/:cid', function(req, res) {
  let userId = parseInt(req.params.uid);
  let courseId = parseInt(req.params.cid);

  uPlayModel
    .query(userId)
    .filter('courseId').equals(courseId)
    .descending()
    .limit(1)
    .exec((err, resp) => {
      if (err) {
        debug(err);
        console.log('Error running query', err);
      } else {
        // console.log(_.pluck(resp.Items, 'attrs'));
        res.status(200).send(_.pluck(resp.Items, 'attrs'));
      }
    });
});

/* GET all users record begin with time(Linux time format => moment().unix()). */
router.get('/read/playrecord/:uid/:cid/:time', function(req, res) {
  let userId = parseInt(req.params.uid);
  let courseId = parseInt(req.params.cid);
  let timestamp = parseInt(req.params.time);

  uPlayModel
    .query(userId)
    .where('timestamp').gt(timestamp)
    .filter('courseId').equals(courseId)
    .loadAll()
    .exec((err, resp) => {
      if (err) {
        debug(err);
        console.log('Error running query', err);
      } else {
        res.status(200).send(_.pluck(resp.Items, 'attrs'));
      }
    });
});

/* data will be an array contain many object
example :
[
  2:{
  userId: 122,
  courseId: 2,
  count: 200,
  timestamp: 33333,
},
  1:{
  userId: 122,
  courseId: 2,
  count: 200,
  timestamp: 44444,
},
];
*/
router.post('/save/playrecord', (req, res, next) => {
  let dataBody = req.body;
  let insertArr = [];
  for (let i in dataBody) {
    insertArr.push(dataBody[i]);
  }

  req.insertArr = insertArr;
  next();
}, (req, res) => {
  uPlayModel.create(req.insertArr, { overwrite: false }, function(err, post) {
        if (err) {
          console.log(err);
          debug(err);
          return res.sendStatus(400);
        }

        res.sendStatus(200);
      });
});

module.exports = router;
