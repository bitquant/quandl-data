# quandl-data
Historical stock price history data from Quandl

## Install
```
$ npm install quandl-data --save
```

## Usage
```javascript

var quandl = require("quandl-data");

(async () => {
    try {
        const apiKey = "<your-api-key-from-quandl>";

        let microsoftHistory = await quandl.getPriceHistory(apiKey, "msft");
        console.log(JSON.stringify(microsoftHistory, null, 2));

        let allSymbols = await quandl.getSymbols(apiKey, "2017-10-13");
        console.log(JSON.stringify(allSymbols, null, 2));
    }
    catch (ex) {
        console.log('caught error: ' + ex.stack);
    }
})();

```

## License
MIT license; see [LICENSE](./LICENSE).
