'use strict';
let faker = require('faker');
let Joi = require('joi');
let vogels = require('vogels');

let myModule = {
  video:function() {
    return {
        courseId: faker.random.number(),
        userId: faker.name.findName(),
        name: faker.internet.email(),
      };
  },
};

var BlogPost = vogels.define('userPlay', {
  hashKey: 'userId',
  rangeKey: 'courseId',
  schema: {
    userId: Joi.number().required(),
    title: Joi.string(),
    content: Joi.binary(),
    tags: vogels.types.stringSet(),
  },
});

module.exports = myModule;
