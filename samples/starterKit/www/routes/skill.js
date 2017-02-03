'use strict';

const router = exports.router = require('express').Router();
const skill = require('../../skill');
const config = require('../../config');

exports.mountPath = '/skill';

if (config.server.hostSkill) {
  router.post('/', (req, res, next) => {
    skill.handler(req.body, {
      fail: next,
      succeed: function succeed(msg) {
        res.json(msg);
      },
    }, function(err, msg) {
      if (err) return next(err);
      return res.json(msg);
    });
  });
}
