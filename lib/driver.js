var webdriverio = require('webdriverio');
var colors = require('colors');
var creds = require('./credentials.js');
var chooser = require('./chooser.js');
var utils = require('./utils.js');

// set browser
var browser = 'phantomjs';
if (process.argv.indexOf('--browser') != -1) {
  browser = process.argv[process.argv.indexOf('--browser') + 1];
}

module.exports = {

  baseUrl: 'https://better.legendonlineservices.co.uk/enterprise/',

  client: false,

  seleniumProcess: false,

  wdOptions: {
    desiredCapabilities: {
      browserName: browser
    }
  },

  connect: function (seleniumProcess) {
    this.seleniumProcess = seleniumProcess;
    this.client = webdriverio.remote(this.wdOptions).init();
    this.getSlots();
  },

  getSlots: function () {
    this.client
      .url(this.baseUrl + 'account/Login', function () {
        utils.log('logging in');
      })
      .setValue('#login_Email', creds.auth.username)
      .setValue('#login_Password', creds.auth.password)
      .click('input#login')
      .url(this.baseUrl + 'BookingsCentre/Index', function () {
        utils.log('selecting club');
      })
      .click('input[name="behaviours"][data-booking-type="1"]') // select activies
      .pause(1000)
      .click('.regionResult[onclick="showRegionClubs(9705); return false;"]') // expand Westminster
      .click('input[name="club"][value="246"]') // select Queen Mother SC
      .pause(1000)
      .click('input[name="activity"][value="444"]', function () {
        utils.log('selecting activity');
      }) // select Squash
      .pause(1000) // wait for pointless animation
      .click('input#bottomsubmit', function () {
        utils.log('loading activity timetable');
      }) // view timetable
      .pause(1000)
      .frame('TB_iframeContent') // switch to iframe
      .getHTML('.sportsHallSlotWrapper', function (err, html) {
        if (err) 
          return;

        chooser.pickSlot(html);
      });
  },

  bookSlot: function (slotId, slotString) {
    var driver = this;

    driver.client
      .click('#' + slotId, function () {
        utils.log('selecting chosen slot');
      }) // select slot
      .waitFor('iframe#TB_iframeContent')
      .frame('TB_iframeContent')
      .click('a[onclick="javascript:confirmCourtSelect();"]') // add to basket
      .pause(500)      
      .url(this.baseUrl + 'Basket/Index')
      .click('#btnPayNow', function () {
        utils.log('entering payment details');
      }) // choose to pay now
      .setValue('#panInput', creds.payment.cardNumber)
      .selectByValue('#ExpiryDateMonth', creds.payment.expiryMonth)
      .selectByValue('#ExpiryDateYear', creds.payment.expiryYear)
      .setValue('#csc', creds.payment.securityCode)
      .setValue('#cardholdername', creds.payment.cardHolder)
      .click('#btnPayNow') // submit payment
      .end(function () {
        var msg = 'Booking complete: ' + slotString;

        utils.log(msg.green);

        driver.kill();
      });
  },

  kill: function () {
    this.client.end();

    this.seleniumProcess.kill();
  }

};
