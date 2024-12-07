import {storeTab} from "@/js/main";

export default {
    namespaced: true,
    state: () => ({
            grouping: null,
            balloons: null,
            lineWidth: null,
            height: null,
            width: null,
            page: null,
            chartsPerRow: null,
            rowsPerPage: null,
            showMapHover: null,
            showMapHoverLocationOnSeasonal: null,
            parameterToMap: null,
            start: "",
            end: "",
            mainSeriesEnd: "",
            firstChartDate: null,
            lastChartDate: "",
            minZoomed: "",
            maxZoomed: "",
            minYZoomed: "",
            maxYZoomed: "",
            verticalAdaptiveScaling: true,
            levels: [],
            numberOfCharts: "",
            initialZoom: true,
            skipEmptyPeriods: null,
            timeSpan: [],
            eye: [],
            entryType: null,
            hiddenFeatures: {
                expiration: null,
                title: null,
                legends: null,
                horizontalScrollbar: null,
                verticalScrollbar: null
            },
            annotationData: "",
            indicatorData: ""
        }),
    getters:{
        parentState: function (state, getters, rootState, rootGetters) {
            // console.log("state=", state);
            // console.log("rootState=", rootState);
 
             let activeModuleName = rootGetters['activeModuleName'];
             let parentState = rootState[activeModuleName];
             return parentState;
         }
    },
    mutations: {
        setHiddenFeatures:  function (state, payload) {
           // console.log("setHiddenFeatures() starting. payload=", payload);
           // console.trace();
            Object.assign(state.hiddenFeatures, payload);
        },
        setGrouping: function (state, grouping) {
            state.grouping = grouping;
        },
        setBalloons: function (state, balloons) {
            state.balloons = balloons;
        },
        setLineWidth: function (state, lineWidth) {
            state.lineWidth = lineWidth;
        },
        setHeight: function (state, height) {
            state.height = height;
        },
        setWidth: function (state, width) {
            state.width = width;
        },
        setPage: function (state, page) {
            state.page = page;
        },
        setChartsPerRow: function (state, chartsPerRow) {
            state.chartsPerRow = chartsPerRow;
        },
        setRowsPerPage: function (state, rowsPerPage) {
            state.rowsPerPage = rowsPerPage;
        },
        setShowMapHover: function (state, showMapHover) {
            state.showMapHover = showMapHover;
        },
        setShowMapHoverLocationOnSeasonal: function (state, showMapHoverLocationOnSeasonal) {
            state.showMapHoverLocationOnSeasonal = showMapHoverLocationOnSeasonal;
        },
        setParameterToMap: function (state, parameterToMap) {
            state.parameterToMap = parameterToMap;
        },
        setStart: function (state, start) {
            state.start = start;
        },
        setEnd: function (state, end) {
            state.end = end;
        },
        setMainSeriesEnd: function (state, mainSeriesEnd) {
            state.mainSeriesEnd = mainSeriesEnd;
        },
        setFirstChartDate: function (state, firstChartDate) {
            state.firstChartDate = firstChartDate;
        },
        setLastChartDate: function (state, lastChartDate) {
            state.lastChartDate = lastChartDate;
        },
        setLevels: function (state, levels) {
            state.levels = levels;
        },
        setNumberOfCharts: function (state, numberOfCharts) {
            state.numberOfCharts = numberOfCharts;
        },
        setSkipEmptyPeriods: function (state, skipEmptyPeriods) {
            state.skipEmptyPeriods = skipEmptyPeriods;
        },
        setTimeSpan: function (state, timeSpan) {
            state.timeSpan = timeSpan;
        },
        setEye: function (state, eye) {
            state.eye = eye;
        },
        setEntryType: function (state, entryType) {
            state.entryType = entryType;
        },
        setAnnotationData: function (state, annotationData) {
           // console.log("setAnnotationData() starting. annotationData=", JSON.parse(JSON.stringify(annotationData)));
            state.annotationData = JSON.stringify(annotationData);
           // console.log("state=", JSON.parse(JSON.stringify(state)));
        },
        setIndicatorData: function(state, indicatorData){
            state.indicatorData = indicatorData;
        },
        setMinZoomed(state, payload){
            state.minZoomed = payload;
        },
        setMaxZoomed(state, payload){
           // console.trace();
            state.maxZoomed = payload;
        }, 
        setMinYZoomed(state, payload){
           // console.trace();
            state.minYZoomed = payload;
        },
        setMaxYZoomed(state, payload){
            state.maxYZoomed = payload;
        },
        setVerticalAdaptiveScaling(state, payload){
           // console.log("setVerticalAdaptiveScaling() starting. payload=", payload);
            state.verticalAdaptiveScaling = payload;
        }
    },
    actions:{
        storeAnnotationData( {commit, getters, rootState}, annotation_data) {
            let email = rootState.user.email;
           // console.log("email=", email);

            commit('setAnnotationData', annotation_data);

            let parentState = JSON.parse(JSON.stringify(getters['parentState']));
            storeTab(parentState, email); //This is necessary because the watch on activeModuleJson in tabs-box.vue does not trigger on changes to annotationData.
        }
    }
};


