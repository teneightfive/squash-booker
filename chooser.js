var cheerio = require('cheerio');
var _ = require('lodash');
var inquirer = require('inquirer');
var driver = require('./driver.js');

////////////////////

function setDays (chooser, $) {
  $('.TextMembers').each(function(i, elem) {
    var $this = $(this);
    var $slots = $this.parent().nextUntil('div:not(.sporthallSlot)');
    var day = $this.text();

    // add day to days choices
    chooser.days.push(day);

    setSlots(chooser, day, $slots);
  });
}

function setSlots (chooser, day, $slots) {
  $slots.each(function(i, elem) {
    var $this = $(this);
    var time = $this.text().replace('Queen Mother SC', '');
    var timeId = $this.find('.sporthallSlotAddLink').attr('id');

    if (time.toLowerCase().indexOf('booked') === -1) {
      chooser.slots[day].push({
        time: time,
        id: timeId
      });
    }
  });
}

module.exports = {

  days: [],

  slots: {},

  findDesiredSlot: function (err, html) {
    var $ = cheerio.load(html);

    setDays(this, $);

    returnDay();
  },

  returnDay: function () {
    inquirer.prompt({
      type: 'list',
      name: 'day',
      message: 'What day would you like to book?',
      choices: this.days
    }, function(answers) {
      this.returnSlot(answers.day);

      // var selectedDay = slots[answers.day];
      // var availableSlots = _.pluck(selectedDay, 'time');

      // inquirer.prompt({
      //   type: 'list',
      //   name: 'time',
      //   message: 'Which time slot would you like to book?',
      //   choices: availableSlots
      // }, function(answers) {
      //   var slot = _.findWhere(selectedDay, {time: answers.time});

      //   client
      //     .click('#' + slot.id)
      //     .pause(500)
      //     .frame('TB_iframeContent')
      //     .click('a[onclick="javascript:confirmCourtSelect();"]')
      //     .url(baseUrl + 'Basket/Index')
      //     .click('#btnPayNow')
      //     .setValue('#card_CardNo', cardNumber)
      //     .selectByValue('#card_ExpiryDateMonth', expiryMonth)
      //     .selectByValue('#card_ExpiryDateYear', expiryYear)
      //     .setValue('#card_SecurityCode', securityCode)
      //     .setValue('#card_CardHolder', cardHolder)
      //     .click('#btnPayNow');
      // });
    });
  },

  returnSlot: function (day) {
    var availableSlots = _.pluck(this.slots[day], 'time');

    inquirer.prompt({
      type: 'list',
      name: 'time',
      message: 'Which time slot would you like to book?',
      choices: availableSlots
    }, function(answers) {
      var slot = _.findWhere(this.slots[day], {time: answers.time});
      driver.bookSlot(slot.id);
    });
  }

};


// function displaySlots (err, html) {
//   var $ = cheerio.load(html);
//   var days = [];
//   var slots = {};

//   $('.TextMembers').each(function(i, elem) {
//     var $this = $(this);
//     var $slots = $this.parent().nextUntil('div:not(.sporthallSlot)');
//     var day = $this.text();

//     // add day to days choices
//     days.push(day);

//     // add key to slots
//     slots[day] = [];

//     // loop slots and add to available slots
//     $slots.each(function(i, elem) {
//       var $this = $(this);
//       var time = $this.text().replace('Queen Mother SC', '');
//       var timeId = $this.find('.sporthallSlotAddLink').attr('id');

//       if (time.toLowerCase().indexOf('booked') === -1) {
//         slots[day].push({
//           time: time,
//           id: timeId
//         });
//       }
//     });
//   });

//   inquirer.prompt({
//     type: 'list',
//     name: 'day',
//     message: 'What day would you like to book?',
//     choices: days
//   }, function(answers) {
//     var selectedDay = slots[answers.day];
//     var availableSlots = _.pluck(selectedDay, 'time');

//     inquirer.prompt({
//       type: 'list',
//       name: 'time',
//       message: 'Which time slot would you like to book?',
//       choices: availableSlots
//     }, function(answers) {
//       var slot = _.findWhere(selectedDay, {time: answers.time});

//       client
//         .click('#' + slot.id)
//         .pause(500)
//         .frame('TB_iframeContent')
//         .click('a[onclick="javascript:confirmCourtSelect();"]')
//         .url(baseUrl + 'Basket/Index')
//         .click('#btnPayNow')
//         .setValue('#card_CardNo', cardNumber)
//         .selectByValue('#card_ExpiryDateMonth', expiryMonth)
//         .selectByValue('#card_ExpiryDateYear', expiryYear)
//         .setValue('#card_SecurityCode', securityCode)
//         .setValue('#card_CardHolder', cardHolder)
//         .click('#btnPayNow');
//     });
//   });
