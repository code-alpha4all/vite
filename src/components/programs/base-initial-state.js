import moment from "moment";

let baseInitialState = {
    user: "A4A-user0",
    password: "M1-K8xQgmR",
    "p": [1, -1, 1, 1],
    spreadP: 1,
    "unitMove": [50, 50, 50, 50],
    "legs": 1,
    "sampleContract": ["S2024H", "S2024K", "S2024N", "S2024U"],
    stockArray: ["AAPL, Apple Inc.", "IBM, International Business Machines"],
    selected: [], //["AAPL, Apple Inc."],
    barchartTicker: "ZCU21",
    title: "C2021U",
    "mult": [1, 1, 1, 1],
    "y1": 15,
    "open": (function () {
        let open = moment().format("YYYY-MM-DD");
        return open;
    })(),
    "close": (function () {
        let close = moment().add(2, 'weeks').format("YYYY-MM-DD");
        return close;
    })(),
    "program": "",
    "language": "en",
    "addBollinger": false,
    bollingerPeriod: 20,
    addSMA: false,
    addEMA: false,
    smaLength: 20,
    emaLength: 20,
    "addCOTPanel": false,
    "addRSIPanel": false,
    "addMACDPanel": false,
    "addATRPanel": false,
    "addVolumePanel": true,
    "addCCIPanel": false,
    "addVolumeProfile": true,
    "showTradingPeriod": false,
    "aligned": false,
    addProfitLoss: false,
    "overwriteShow": false,
    "rsiPeriod": 7,
    "cciPeriod": 20,
    "volumeProfileColumns": 24,
    "cciSource": "closes",
    "showBullets": true,
    showPlaybackControl: false,
    addHorizontalLine: false,
    "intracommodity": false,
    "stockGraphType": "line",
    "showSeasonals": true,
    "seasonals": [5, 15],
    seasonalTypes: ["adjusted"],
    seasonalSelectionMode: "standard",
    truncate: 1,
    buySell: "buy",
    dataSource: "eod",
    longtermChartColors: "yearly",
    zoomToSavedCoordinates: false,
    forwardCurveStudy: "unaligned",
    "normalization": "off",
    "normalizationDate": "1",
    "normalizationMonth": "January",
    "numberOfContractsApart": 0,
    chartParameters: {
        balloons: false,
        skipEmptyPeriods: false,
        entryType: "stop",
        initialZoom: true,
        chartsPerRow: 2,
        rowsPerPage: 20,
        page: 1,

        hiddenFeatures: {
            expiration: false,
            title: false,
            legends: false,
            horizontalScrollbar: true,
            verticalScrollbar: true
        }
    },
    playback: {
        start: "2021-02-25",
        end: "2021-05-06",
        interval: 1,
        breakpoints: [
            { date: "2021-03-01", title: "Title 1", message: "first breakpoint " }
        ]
    },
    search: {
        query: "",
        openStart: (function () {
            let openStart = moment().format("YYYY-MM-DD");
            return openStart;
        })(),
        openEnd: (function () {
            let openEnd = moment().add(2, 'weeks').format("YYYY-MM-DD");
            return openEnd;
        })(),
        closeStart: (function () {
            let closeStart = moment().add(1, 'months').format("YYYY-MM-DD");
            return closeStart;
        })(),
        closeEnd: (function () {
            let closeEnd = moment().add(1, 'months').add(2, 'weeks').format("YYYY-MM-DD");
            return closeEnd;
        })()
    }
};
console.log("baseInitialState=", baseInitialState);

export { baseInitialState };