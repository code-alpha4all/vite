let basicChartInitialStateTest = {
    instrument: "future",
    "generator": "BasicBarsGenerator",
    "program": "BasicChartsTest",
    "study": "basic",
    chartParameters: {
        balloons: true,
        initialZoom: true,
        hiddenFeatures: {
            expiration: false,
            title: false,
            legends: true
        },
    },
};

export { basicChartInitialStateTest };