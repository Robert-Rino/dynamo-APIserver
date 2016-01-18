'use strict';
let express = require('express');
let _  = require('lodash');
let util = require('util');
let debug = require('debug')('routesUsers');

let uPlayModel = require('../models/userPlay.js');
let generater = require('../lib/generate.js');

let router = express.Router();

// fake data
let data = {
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
};

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('user.js page').status(200);
});

/* GET users listing. */
router.get('/read/playrecord/:uid/:cid/:time', function(req, res) {
  let userId = parseInt(req.params.uid);
  let courseId = parseInt(req.params.cid);
  let timestamp = parseInt(req.params.time);
  uPlayModel
    .query(userId)
    .where('timestamp').gt(timestamp)
    .filter('courseId').equals(courseId)
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

// data will be a object contain many object
router.post('/save/playrecord', (req, res) => {
  let dataBody = req.body;
  for (let i in dataBody) {
    uPlayModel.create(dataBody[i], function(err, post) {
        if (err) {
          console.log(err);
          res.send().status(500);
        }
      });
  }

  res.status(201).send('Created');
});

module.exports = router;
