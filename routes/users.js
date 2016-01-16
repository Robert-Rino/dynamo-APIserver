'use strict';
let express = require('express');
let _  = require('lodash');

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
  let userId = req.params.uid;
  let courseId = req.params.cid;
  let timestamp = req.params.time;
  
  // uPlayModel
  //   .query(userId)
  //   .where(courseId).equals()
  //   .filter('tags').contains('cloud'),
  //   exec();
  res.json({
    uid:userId,
    cid:courseId,
    time:timestamp,
  }).status(200);
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
