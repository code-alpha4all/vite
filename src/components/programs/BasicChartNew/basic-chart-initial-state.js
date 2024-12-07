let basicChartInitialStateNew = {
    instrument: "future",
    "generator": "BasicBarsGenerator",
    "program": "BasicChartsNew",
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

export { basicChartInitialStateNew };