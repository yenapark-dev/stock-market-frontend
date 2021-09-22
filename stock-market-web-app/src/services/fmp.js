// Financial modelling prep services
const API_KEY = "2ecdca9e359f6b83bd63bea3cc993bdc";
const baseUrl = "https://financialmodelingprep.com/api/v3";

export const fetchStocks = async () => {
    try {
        let res = await fetch(
            `${baseUrl}/stock-screener?&apikey=${API_KEY}`
        ).catch((error) => console.log("parsing failed", error));
        let data = await res.json();
        return data;
    } catch (e) {
        throw new Error(e);
    }
};

export const fetchStocksForQuote = async (symbol) => {
    try {
        if (symbol !== "") {
            let res = await fetch(
                `${baseUrl}/quote/${symbol}?&apikey=${API_KEY}`
            ).catch((error) => console.log("parsing failed", error));
            let data = await res.json();
            return data.map((stock) => ({
                symbol: stock.symbol,
                name: stock.name,
                price: stock.price,
                open: stock.open,
                dayLow: stock.dayLow,
                dayHigh: stock.dayHigh,
                timestamp: dateToString(new Date(stock.timestamp*1000)),
            }));
        } else {
            return "";
        }
    } catch (e) {
        throw new Error(e);
    }
};

export const fetchStocksWithPrice = async (symbol) => {
    try {
        if (symbol !== "") {
            let res = await fetch(
                `${baseUrl}/historical-price-full/${symbol}?timeseries=100&apikey=${API_KEY}`
            ).catch((error) => console.log("parsing failed", error));
            let data = await res.json();
            let prices = data.historical;

            return prices.map((stock) => ({
                symbol: data.symbol,
                date: stock.date,
                open: stock.open,
                high: stock.high,
                low: stock.low,
                close: stock.close,
                volume: stock.volume,
            }));
        } else {
            return "";
        }

    } catch (e) {
        throw new Error(e);
    }
};

export const fetchStocksWithDate = async (search) => {
    try {
        if (search.symbol !== "") {
            let res = await fetch(
                `${baseUrl}/historical-price-full/${search.symbol
                }?from=${dateToString(search.date)}&to=${dateToString(
                    new Date()
                )}&apikey=${API_KEY}`
            ).catch((error) => console.log("parsing failed", error));
            let data = await res.json();
            let prices = data.historical;

            return prices.map((stock) => ({
                symbol: data.symbol,
                date: stock.date,
                open: stock.open,
                high: stock.high,
                low: stock.low,
                close: stock.close,
                volume: stock.volume,
            }));
        } else {
            return "";
        }
    } catch (e) {
        throw new Error(e);
    }
};

export function dateToString(date) {
    let d = new Date(date);
    let month = "" + (d.getMonth() + 1);
    let day = "" + d.getDate();
    let year = d.getFullYear();

    if (month.length < 2) {
        month = "0" + month;
    }
    if (day.length < 2) {
        day = "0" + day;
    }

    return [year, month, day].join("-");
}
