var webdriverio = require('webdriverio');
var creds = require('./credentials.js');
var options = {
  desiredCapabilities: {
    browserName: 'firefox'
  }
};
var client = webdriverio.remote(options).init();

module.exports = {

  baseUrl: 'https://better.legendonlineservices.co.uk/enterprise/',

  getSlots: function (cb) {
    client
      .url(this.baseUrl + 'account/Login')
      .setValue('#login_Email', creds.auth.username)
      .setValue('#login_Password', creds.auth.password)
      .click('input#login')
      .url(this.baseUrl + 'BookingsCentre/Index')
      .click('.regionResult[onclick="showRegionClubs(9705); return false;"]')
      .click('input[name="club"][value="246"]')
      .pause(1000)
      .click('input[name="behaviours"][value="-3"]')
      .pause(1000)
      .click('input[name="activity"][value="444"]')
      .pause(1000)
      .click('input#bottomsubmit[value="View Timetable"]')
      .waitFor('iframe#TB_iframeContent')
      .frame('TB_iframeContent')
      .getHTML('.sportsHallSlotWrapper', cb);
  },

  bookSlot: function (slotId) {
    client
      .click('#' + slotId)
      .pause(500)
      .frame('TB_iframeContent')
      .click('a[onclick="javascript:confirmCourtSelect();"]')
      .url(this.baseUrl + 'Basket/Index')
      .click('#btnPayNow')
      .setValue('#card_CardNo', creds.payment.cardNumber)
      .selectByValue('#card_ExpiryDateMonth', creds.payment.expiryMonth)
      .selectByValue('#card_ExpiryDateYear', creds.payment.expiryYear)
      .setValue('#card_SecurityCode', creds.payment.securityCode)
      .setValue('#card_CardHolder', creds.payment.cardHolder)
      .click('#btnPayNow');
  }

};
