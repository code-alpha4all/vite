let basicChartInitialState = {
    "p": [1, -1, 1, 1],
    spreadP: 1,
    "unitMove": [50, 50, 50, 50],
    "legs": 1,
    "sampleContract": ["C2021U", "O2021U", "MW2020U", "KW2020U"],
    stockArray: ["AAPL, Apple Inc.", "IBM, International Business Machines"],
    selected: [], //["AAPL, Apple Inc."],
    barchartTicker: "ZCU21",
    title: "C2021U",
    "mult": [1, 1, 1, 1],
    "y1": 15,
    "open": "2021-01-25",
    "close": "2021-03-26",
    "generator": "BasicBarsGenerator",
    "program": "BasicCharts",
    "study": "basic",
    "language": "en",
    "addBollinger": false,
    addSMA: false,
    smaLength: 20,
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
    truncate: 1,
    buySell: "buy",
    dataSource: "eod",
    chartParameters: {
        lastChartDate: "2020-12-31",
        balloons: false,
        skipEmptyPeriods: false,
        levels: [
            {from: 400, to: 440, color: "orange", name: "horizontal-bronze-series"},
            {from: 440, to: 500, color: "silver", name: "horizontal-silver-series"},
            {from: 500, to: 550, color: "gold", name: "horizontal-gold-series"}
        ],
        entryType: "stop",
        hiddenFeatures: {
            expiration: false,
            title: false,
            legends: false,
            horizontalScrollbar: true,
            verticalScrollbar: false
        }
    },
    playback: {
        start: "2021-02-25",
        end: "2021-05-06",
        interval: 1,
        breakpoints: [
            {date: "2021-03-01", title: "Title 1", message: "first breakpoint "}
        ]
    },
    search: {},
    instrument: "future",
    user: "A4A-user0",
    password: "M1-K8xQgmR"
};

export {basicChartInitialState};