'use strict';
let faker = require('faker');
let Joi = require('joi');
let vogels = require('vogels');
let config = require('config');
let moment = require('moment');
let util   = require('util');
let _      = require('lodash');
let uPlayModel = require('../models/userPlay.js');

//Create fake data
let myModule = {
  video:function() {
    return {
        courseId: faker.random.number(),
        userId: faker.random.number(),
        count: faker.random.number(),
        timestamp: moment().unix(),
      };
  },
};

var printResults = function(err, resp) {
  console.log('----------------------------------------------------------------------');
  if (err) {
    console.log('Error running query', err);
  } else {
    console.log('Found', resp.Count, 'items');
    console.log(util.inspect(_.pluck(resp.Items, 'attrs')));

    if (resp.ConsumedCapacity) {
      console.log('----------------------------------------------------------------------');
      console.log('Query consumed: ', resp.ConsumedCapacity);
    }
  }

  console.log('----------------------------------------------------------------------');
};

let dynamo = {
  save:function(howManyData) {
            vogels.AWS.config.update({
            accessKeyId:config.get('AWS_CREDENTIALS.accessKeyId'),
            secretAccessKey: config.get('AWS_CREDENTIALS.secretAccessKey'),
            region: config.get('AWS_CREDENTIALS.region'),
          });

            // store into db
            for (let i = 0; i < howManyData; i++) {
              let data = myModule.video();
              console.log(data);
              uPlayModel.create(data, function(err, post) {
                  if (err) {
                    console.log(err);
                    return;
                  }

                  console.log('created blog post');
                });
            }
          },

  query: function(userId) {
      vogels.AWS.config.update({
        accessKeyId:config.get('AWS_CREDENTIALS.accessKeyId'),
        secretAccessKey: config.get('AWS_CREDENTIALS.secretAccessKey'),
        region: config.get('AWS_CREDENTIALS.region'),
      });
      uPlayModel.query(userId).exec(printResults);
    },
};

module.exports = dynamo;
