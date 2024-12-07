let longTermChartsInitialState = {
    instrument: "future",
    generator: "LongTermCandlesticksGenerator",
    "program": "LongTermCharts",
    "study": "basic",
    "showSeasonals": false,
    "seasonals": [5, 15],
    aligned: false,
    seasonalSelectionMode: "standard",
    chartParameters: {
        hiddenFeatures: {
            expiration: false,
            title: false,
            legends: false,
            horizontalScrollbar: true,
            verticalScrollbar: false
        }
    },
};

export { longTermChartsInitialState };