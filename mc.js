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
      // let $ = res.$;
      let params = res.options.data;
      let rate = JSON.parse(res.body).data.conversionRate;
      console.log(params.date.format("YYYY-MM-DD"), "MC", rate);
      storeData(
        "mc",
        params.fromCurrency,
        params.toCurrency,
        moment(params.date).format("YYYY-MM-DD"),
        rate
      );
    }
    done();
  }
});

function storeData(cardIssuer, fromCurrency, toCurrency, date, rate) {
  let data = `${date}\t${rate}\n`;
  fs.appendFile(
    `./data/${cardIssuer}-${fromCurrency}-${toCurrency}.csv`,
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
  let mDate = moment(date);
  let day = mDate.format("DD");
  let month = mDate.format("MM");
  let year = mDate.format("YYYY");
  let uri = `https://www.mastercard.us/settlement/currencyrate/fxDate=${year}-${month}-${day};transCurr=${toCurrency};crdhldBillCurr=${fromCurrency};bankFee=0;transAmt=1/conversion-rate`;
  c.queue({
    uri: uri,
    jQuery: false,
    headers: {
      accept: "application/json, text/plain, */*",
      dnt: "1",
      "x-devtools-emulate-network-conditions-client-id":
        "54A77682E481AD12B6B664B6D2124C0A",
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36",
      referer:
        "https://www.mastercard.us/en-us/consumers/get-support/convert-currency.html",
      "accept-encoding": "gzip, deflate, br",
      "accept-language": "en-CA,en;q=0.9,en-US;q=0.8",
      cookie:
        "AMCV_919F3704532951060A490D44%40AdobeOrg=T; PHPSESSID=db6ko449glsk1pc42uljl72jo5; AMCVS_919F3704532951060A490D44%40AdobeOrg=1; s_sess=%20s_ria%3Dflash%2520not%2520detected%257Csilverlight%2520not%2520detected%3B%20s_sq%3D%3B%20s_ppv%3DCash%252520Back%252520Credit%252520Cards%252520%252C99%252C19%252C11143%3B%20s_cc%3Dtrue%3B; s_pers=%20s_vnum%3D1532933591312%2526vn%253D3%7C1532933591312%3B%20s_fid%3D6D7FFB118FD354BC-3661C3F46B2A14C7%7C1594853472205%3B%20s_pers_prop5%3Danon%7C1689375072210%3B%20s_pers_prop6%3Danon%7C1689375072212%3B%20s_getNewRepeat%3D1531695072218-Repeat%7C1534287072218%3B%20s_invisit%3Dtrue%7C1531696872220%3B; s_cc=true; QSI_HistorySession=https%3A%2F%2Fwww.mastercard.us%2Fen-us%2Fconsumers%2Fget-support%2Fconvert-currency.html~1530956047105%7Chttps%3A%2F%2Fwww.mastercard.us%2Fen-us%2Fconsumers%2Foffers-promotions%2Fcard-benefits.html~1531691884184%7Chttps%3A%2F%2Fwww.mastercard.us%2Fen-us%2Fconsumers%2Fpayment-technologies.html~1531692076180%7Chttps%3A%2F%2Fwww.mastercard.us%2Fen-us%2Fconsumers%2Ffind-card-products%2Fcredit-cards%2Fmastercard.html~1531692127170%7Chttps%3A%2F%2Fwww.mastercard.us%2Fen-us%2Fconsumers%2Ffind-card-products%2Fcredit-cards%2Fworld.html~1531692127489%7Chttps%3A%2F%2Fwww.mastercard.us%2Fen-us%2Fconsumers%2Ffind-card-products%2Fcredit-cards%2Fworld-elite.html~1531692128010%7Chttps%3A%2F%2Fwww.mastercard.us%2Fen-us%2Fconsumers%2Foffers-promotions%2Fworld-elite-travel-benefits.html~1531692215198%7Chttps%3A%2F%2Fwww.mastercard.us%2Fen-us%2Fconsumers%2Fget-support%2Fconvert-currency.html~1533190176867; BIGipServerwww.dm.mc.us-https.app~www.dm.mc.us-https-https-pool=!yVOrS3dq2ohCCPLwWNNWzOCmd7dWoFl3HnHe82jaDJD3U8EFDOq+1ckQvd2qiDlYOWsCxEwcyrrp2AQ=; TS013559a7=01b18b28be3e8dc1d44240bf358255c534904c74d20e77679b1a93246606576224eef17ebf78458cc9e7f70c1f89eac18037cae9d26813acf005742fdfd675728fd7f2cfb7ec243a9759985ae0ad41b0a35704e31947dedd4478cdca9ffa24b648a0bd42b1; AMCV_919F3704532951060A490D44%40AdobeOrg=1687686476%7CMCIDTS%7C17764%7CMCMID%7C51611831577077132394688710658361968031%7CMCAID%7CNONE%7CMCOPTOUT-1534772404s%7CNONE%7CvVersion%7C3.0.0; s_nr=1534765234501-Repeat; gpv_pn=Currency%20Converter%20%7C%20Foreign%20Exchange%20Rates%20Calculator%20%7C%20Mastercard; s_sq=masterc604%252Cmastercglobal%3D%2526c.%2526a.%2526activitymap.%2526page%253DCurrency%252520Converter%252520%25257C%252520Foreign%252520Exchange%252520Rates%252520Calculator%252520%25257C%252520Mastercard%2526link%253DCALCULATE%2526region%253Dcontent%2526pageIDType%253D1%2526.activitymap%2526.a%2526.c%2526pid%253DCurrency%252520Converter%252520%25257C%252520Foreign%252520Exchange%252520Rates%252520Calculator%252520%25257C%252520Mastercard%2526pidt%253D1%2526oid%253DCALCULATE%2526oidt%253D3%2526ot%253DSUBMIT",
      "cache-control": "no-cache",
      "postman-token": "a8d033f1-150a-1ae7-e508-020ab9cc5d2a"
    },
    data: {
      date: moment(date),
      fromCurrency: fromCurrency,
      toCurrency: toCurrency
    }
  });
}

module.exports = {
  addCrawl: addCrawl
};
