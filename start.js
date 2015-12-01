var selenium = require('selenium-standalone');
var driver = require('./lib/driver.js');
var utils = require('./lib/utils.js');

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
