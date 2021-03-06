"use strict";

let lessonController = require('../controllers/lessonController.js'),
  configController = require('../controllers/configController.js'),
  tagsController = require('../controllers/tagsController.js'),
  rssController = require('../controllers/rssController.js'),
  adminController = require('../controllers/adminController.js'),
  redisController = require('../controllers/redisController.js'),
  Promise = require('promise');

exports.init = function(callback) {
  configController.initPromise().then(function() {
    return redisController.initPromise(configController.config.redisPort);
  }).then(function() {
    return lessonController.initPromise();
  }).then(function() {
    return tagsController.initPromise();
  }).then(function() {
    return rssController.initPromise(lessonController.categories);
  }).then(function() {
    return adminController.initPromise();
  }).done(function onSuccess() {
    exports.initialized = true;
    callback();
  }, function onFailure(err) {
    callback(err);
  });
};
exports.initPromise = Promise.denodeify(exports.init).bind(exports);
