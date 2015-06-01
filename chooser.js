var _ = require('lodash');
var cheerio = require('cheerio');
var inquirer = require('inquirer');
var utils = require('./utils.js');

module.exports = {

  days: [],

  slots: {},

  pickSlot: function (html) {
    var $ = cheerio.load(html);

    this.setDays($);
    this.selectDay();
  },

  setDays: function ($) {
    var chooser = this;

    utils.log('getting available slots');
    $('.TextMembers').each(function(i, elem) {
      var $this = $(this);
      var $slots = $this.parent().nextUntil('div:not(.sporthallSlot)');
      var day = $this.text();

      // add day to days choices
      chooser.days.push(day);

      // set slots
      chooser.setSlots(day, $slots, $);
    });
  },

  setSlots: function (day, $slots, $) {
    var chooser = this;
    chooser.slots[day] = [];

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
  },

  selectDay: function () {
    var chooser = this;

    inquirer.prompt({
      type: 'list',
      name: 'day',
      message: 'What day would you like to book?',
      choices: this.days
    }, function(answers) {
      chooser.selectSlot(answers.day);
    });
  },

  selectSlot: function (day) {
    var chooser = this;
    var availableSlots = _.pluck(chooser.slots[day], 'time');

    availableSlots = availableSlots.concat([new inquirer.Separator(), 'BACK TO DAY LIST', new inquirer.Separator()]);

    inquirer.prompt({
      type: 'list',
      name: 'time',
      message: 'Which time slot would you like to book?',
      choices: availableSlots
    }, function(answers) {
      var slot = _.findWhere(chooser.slots[day], {time: answers.time});

      if (answers.time === 'BACK TO DAY LIST') {
        chooser.selectDay();
        return;
      }

      chooser.confirmSlot(slot.id, answers.time.substring(0, 5) + ' on ' + day);
    });
  },

  confirmSlot: function (slotId, slotString) {
    var chooser = this;
    
    inquirer.prompt({
      type: 'confirm',
      name: 'confirm',
      default: false,
      message: 'Are you sure you want to book ' + slotString + '?'
    }, function(answers) {
      var driver = require('./driver.js');

      if (!answers.confirm) {
        chooser.selectDay();
        return;
      }

      driver.bookSlot(slotId, slotString);
    });
  }

};
