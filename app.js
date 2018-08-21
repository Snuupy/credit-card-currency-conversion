const visa = require('./visa')
const moment = require("moment");
const mc = require('./mc')
// 30 days, map over date

var a = moment("2018-01-01");
var b = moment("2018-08-01");

for (var m = moment(a); m.isBefore(b); m.add(1, 'days')) {
  // USD -> CAD
  // visa.addCrawl(m, 'USD', 'CAD');
  // mc.addCrawl(m, 'USD', 'CAD');

  // USD -> EUR
  // visa.addCrawl(m, 'USD', 'EUR');
  // mc.addCrawl(m, 'USD', 'EUR');

  // USD -> HKD
  // visa.addCrawl(m, "USD", "HKD");
  // mc.addCrawl(m, "USD", "HKD");

  // USD -> GBP
  visa.addCrawl(m, "USD", "GBP");
  mc.addCrawl(m, "USD", "GBP");

  // CAD -> USD
  // visa.addCrawl(m, 'CAD', 'USD');
  // mc.addCrawl(m, 'CAD', 'USD');

  // CAD -> EUR
  // visa.addCrawl(m, 'CAD', 'EUR');
  // mc.addCrawl(m, 'CAD', 'EUR');

  // CAD -> HKD
  // visa.addCrawl(m, "CAD", "HKD");
  // mc.addCrawl(m, "CAD", "HKD");

  // CAD -> GBP
  visa.addCrawl(m, "CAD", "GBP");
  mc.addCrawl(m, "CAD", "GBP");
}