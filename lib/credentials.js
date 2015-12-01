var env = require('node-env-file');

// console.log(__dirname);

env('./.env');

module.exports = {
  auth:{
    username: process.env.USERNAME,
    password: process.env.PASSWORD
  },
  payment: {
    cardNumber: process.env.CARDNUMBER,
    expiryMonth: process.env.EXPIRY_MONTH,
    expiryYear: process.env.EXPIRY_YEAR,
    securityCode: process.env.SECURITY_CODE,
    cardHolder: process.env.CARDHOLDER
  }
};
