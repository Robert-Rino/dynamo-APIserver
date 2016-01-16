'use strict';
let express = require('express');
let _  = require('lodash');

let uPlayModel = require('../models/userPlay.js');
let generater = require('../lib/generate.js');

let router = express.Router();

// fake data
let data = { 1:{
  userId: 123,
  courseId: 1,
  count: 100,
  timestamp: 99999,
},
2:{
  userId: 122,
  courseId: 2,
  count: 200,
  timestamp: 11111,
},
};

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('user.js page').status(200);
});

// data will be a json contain many data
router.post('/playRecord', (req, res) => {
  let dataBody = req.body;
  for (let i in dataBody) {
    uPlayModel.create(dataBody[i], function(err, post) {
        if (err) {
          console.log(err);
          res.send().status(500);
        }
      });
  }

  res.send().status(200);
});

module.exports = router;
