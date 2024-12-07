let stackedChartsInitialState = {
    instrument: "future",
    generator: "LongTermCandlesticksGenerator",
    "program": "StackedCharts",
    "study": "basic",
    "showSeasonals": false,
    "seasonals": [5, 15],
    aligned: true,
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

export { stackedChartsInitialState };