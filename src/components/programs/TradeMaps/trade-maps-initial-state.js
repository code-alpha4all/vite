let tradeMapsInitialState = {
    "instrument": "future",
    "y1": 15,
    program: "TradeMaps",
    aligned: true,
    chartParameters: {
        balloons: true,
        parameterToMap: "percentUp",
        initialZoom: false,
        hiddenFeatures: {
            expiration: false,
            title: false,
            legends: true,
            horizontalScrollbar: true,
            verticalScrollbar: true
        },
    },
    "addBollinger": false,
    "addRSIPanel": false,
    "addMACDPanel": false,
    "addATRPanel": false,
    "addVolumePanel": false,
    "addVolumeProfile": false,
    "addCCIPanel": false,
    "showTradingPeriod": true,
    "overwriteShow": false,
    "showBullets": true,
    "showSeasonals": true,
    "intracommodity": false,
    "stockGraphType": "line",
    "seasonals": [5, 15],
    seasonalTypes: ["adjusted"],
    truncate: 1  // Making this larger causes the trading period on the basic chart to be misplaced!
};

export {tradeMapsInitialState};