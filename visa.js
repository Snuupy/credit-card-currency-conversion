const Crawler = require("crawler");
const moment = require("moment");
const fs = require("fs");

let c = new Crawler({
  maxConnections: 1,
  rateLimit: 1000,
  callback: function(error, res, done) {
    if (error) {
      console.log(error);
    } else {
      let $ = res.$;
      let val = $("#er_result_table > p.currency-convertion-result.h2 > strong").text();
      var regex = /[+-]?\d+(?:\.\d+)?/g;
      match = regex.exec(val);
      rate = match[0];
      if (!rate) {
        console.log($("title").text(), val);
      }
      let params = res.options.data
      console.log(params.date.format('YYYY-MM-DD'), 'Visa', rate);
      storeData("visa", params.fromCurrency, params.toCurrency, moment(params.date).format('YYYY-MM-DD'), rate);
    }
    done();
  }
});

function storeData(cardIssuer, fromCurrency, toCurrency, date, rate) {
  let data = `${date}\t${rate}\n`;
  fs.appendFile(
    `${cardIssuer}-${fromCurrency}-${toCurrency}.csv`,
    data,
    err => {
      if (err) {
        console.error("Unable to write to disk:", err);
        return;
      }
    }
  );
}

function addCrawl(date, fromCurrency, toCurrency) {
  let mDate = moment(date)
  let day = mDate.format('DD')
  let month = mDate.format('MM')
  let year = mDate.format('YYYY')
  let uri =
    "https://usa.visa.com/support/consumer/travel-support/exchange-rate-calculator.html/" +
    "?amount=1&fee=0&exchangedate=" +
    `${month}%2F${day}%2F${year}&` +
    `fromCurr=${fromCurrency}&` +
    `toCurr=${toCurrency}&submitButton` +
    "=Calculate%20exchange%20rate";
  c.queue({
    uri: uri,
    "headers": {
      "upgrade-insecure-requests": "1",
      "dnt": "1",
      "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36",
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
      "referer": "https://usa.visa.com/support/consumer/travel-support/exchange-rate-calculator.html/?amount=1&fee=0.0&exchangedate=08%2F20%2F2018&fromCurr=USD&toCurr=CAD&submitButton=Calculate+exchange+rate",
      "accept-encoding": "gzip, deflate, br",
      "accept-language": "en-CA,en;q=0.9,en-US;q=0.8",
      "cookie": "visaAnonCookie=dc32c517ac3a0000fda27a5bae010000442a0100; AKA_A2=A; visaCookie=dc32c517ac3a00000ba27a5b5001000071290100; lbs=!w72RrdlKfHJ2EkASTJ/6Qo9WwVXjT6RD2J6cnWT8vBH3FpPu2R5IMHEyOqgLcSsr1ka983KHT5bwS5IESrLHcUTyyc99TzEYuj8UVrQ=",
      "cache-control": "no-cache",
      "postman-token": "2ec43121-7edc-4a84-e41e-5b3fc35bb70c"
    },
    data: {
      date: moment(date),
      fromCurrency: fromCurrency,
      toCurrency: toCurrency
    }
  });
};

module.exports = {
  addCrawl: addCrawl
}