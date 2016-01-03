'use strict';
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.json({
    version: 'v1',
  });
});

module.exports = router;
