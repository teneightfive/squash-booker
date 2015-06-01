var driver = require('./driver.js');
var selenium = require('selenium-standalone');
var utils = require('./utils.js');

selenium.install({
  version: '2.45.0',
  baseURL: 'http://selenium-release.storage.googleapis.com'
}, function (err) {
  if (err) return err;

  utils.log('starting browser');

  selenium.start(function (err, child) {
    if (err) return err;
    selenium.child = child;

    driver.connect(child);
  });
});
