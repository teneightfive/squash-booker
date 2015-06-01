# Activity Booker

This app logs in to the Lambeth council gym booking site and books an activity, currently only squash, and completes the transaction.

It uses selenium webdriver to drive a browser through the steps and [cheerio](https://github.com/cheeriojs/cheerio) to scrape the current timetable. It then uses [Inquirer](https://github.com/SBoudrias/Inquirer.js/) to prompt some input from the user to book a slot.

#### To run

To run the app using [phantomjs](http://phantomjs.org/):
```
npm run start
```

To run using firefox:
```
npm run-script start-ff
```

#### Creds

You'll need the following credentials set as environment variables to login and book an activity:

```
USERNAME=
PASSWORD=
CARDNUMBER=
EXPIRY_MONTH=
EXPIRY_YEAR=
SECURITY_CODE=
CARDHOLDER=
```
