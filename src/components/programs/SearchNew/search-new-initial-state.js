let searchNewInitialState = {
    instrument: "future",
    intracommodity: true,
    program: "SearchNew",
    tabTitle: "search new",
    chartParameters: {
        page: 1,
        chartsPerRow: 2,
        rowsPerPage: 20,
        chartsPerPage: 4,
        balloons: true,
    },
    group: "grains",
    numberOfContractsApart: 3,
    search: {
        sortParameter: "rrr",
        legs: [1,2,3],
        position: "either",
        direction: "desc",
        source: "singleCommodity",
        minDays: 4,
        maxDays: 100,
        tradePeriodExcludedSelector: "endingRange",
        userConditions: [
            {
                parameter: "appd",
                comparator: ">",
                value: 5
            },{
                parameter: "rrr",
                comparator: ">",
                value: 1
            },{
                parameter: "percentProfitable",
                comparator: ">=",
                value: 80
            },{
                parameter: "avgMax",
                comparator: ">",
                value: 0
            },{
                parameter: "bestMax",
                comparator: ">",
                value: 0
            },{
                parameter: "avgMin",
                comparator: "<",
                value: 0
            },{
                parameter: "worstMin",
                comparator: "<",
                value: 0
            }      
        ],
        indicatorConditions: [
            {
                parameter: "rsi",
                comparator: ">",
                value: 0
            }          
        ],
        query: ""
    }
};


export {searchNewInitialState};