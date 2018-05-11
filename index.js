'use strict';
const request = require('request-promise-native').defaults({timeout: 9999});

const getPriceHistory = async (apiKey, symbol) => {

    symbol = symbol.toUpperCase();

    // Convert symbols like BRK.B to BRK_B
    symbol = symbol.replace(/\./g, "_");

    const options = {
        uri: `https://www.quandl.com/api/v3/datatables/WIKI/PRICES.json?ticker=${symbol}&api_key=${apiKey}`,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:45.0) Gecko/20100101 Firefox/45.0'
        },
    };

    const quandlData = JSON.parse(await request(options));

    while (quandlData.meta.next_cursor_id !== null) {

        const nextQuandlData = JSON.parse(await request({
            uri: options.uri + `&qopts.cursor_id=${quandlData.meta.next_cursor_id}`,
            headers: options.headers
        }));

        quandlData.datatable.data = [...quandlData.datatable.data, ...nextQuandlData.datatable.data];
        quandlData.meta.next_cursor_id = nextQuandlData.meta.next_cursor_id;
    }

    let priceHistory = quandlData.datatable.data;

    // Remove the symbol from every record and then sort by date
    priceHistory = priceHistory.map(record => record.filter((e, i) => i > 0 )).
        sort((a, b) => a[0].localeCompare(b[0]));

    // Convert array of name/type objects to array of column names and remove symbol
    const columns = quandlData.datatable.columns
        .map(column => column.name)
        .filter((e, i) => i > 0);

    return { symbol: symbol, columns: columns, history: priceHistory };
};

const getSymbols = async (apiKey, date) => { /* date in format of YYYY-MM-DD, weekends return empty arrays */

    const options = {
        uri: `https://www.quandl.com/api/v3/datatables/WIKI/PRICES.json?date=${date}&api_key=${apiKey}`,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:45.0) Gecko/20100101 Firefox/45.0'
        },
    };

    const quandlData = JSON.parse(await request(options));

    while (quandlData.meta.next_cursor_id !== null) {

        const nextQuandlData = JSON.parse(await request({
            uri: options.uri + `&qopts.cursor_id=${quandlData.meta.next_cursor_id}`,
            headers: options.headers
        }));

        quandlData.datatable.data = [...quandlData.datatable.data, ...nextQuandlData.datatable.data];
        quandlData.meta.next_cursor_id = nextQuandlData.meta.next_cursor_id;
    }

    const symbolArray = quandlData.datatable.data.map(record => record[0]);

    return symbolArray;
};

exports.getPriceHistory = getPriceHistory;
exports.getSymbols = getSymbols;
