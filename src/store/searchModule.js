//import moment from "moment";

export default {
    namespaced: true,
    state: () => ({
            sortParameter: null,
            legs: [],
            position: null,
            direction: null,
            source: null,
            minDays: null,
            maxDays: null,
            userConditions: [],
            indicatorConditions: [],
            query: null,
            openStart: null,
            openEnd: null,
            closeStart: null,
            closeEnd: null,
            tradePeriodExcludedSelector: null,
            numberOfContractsApartComparator: null
        }),
    mutations: {
        set: function(state, {key, value}){
            console.log("set() starting. key=", key, " value=", value);
            state[key] = value;
        },
        setUserConditions: function (state, userConditions) {
           // console.log("setUserConditions() starting. userConditions=", userConditions);
           // console.trace();
            state.userConditions = userConditions;
        },
        setIndicatorConditions: function (state, indicatorConditions) {
            state.indicatorConditions = indicatorConditions;
        },
        setQuery: function (state, query) {
          //  console.log("setQuery() starting. query=", query);
            state.query = query;
        },
        setOpenStart: function (state, openStart) {
           // console.log("openStart=", openStart);
            state.openStart = openStart;
        },
        setOpenEnd: function (state, openEnd) {
           // console.log("openEnd=", openEnd);
            state.openEnd = openEnd;
        },
        setCloseStart: function (state, closeStart) {
           // console.log("closeStart=", closeStart);
            state.closeStart = closeStart;
        },
        setCloseEnd: function (state, closeEnd) {
           // console.log("closeEnd=", closeEnd);
            state.closeEnd = closeEnd;
        }, 
        setTradePeriodExcludedSelector: function (state, tradePeriodExcludedSelector) {
            state.tradePeriodExcludedSelector = tradePeriodExcludedSelector;
        },
    }
};


