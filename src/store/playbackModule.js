//import moment from "moment";

export default {
    namespaced: true,
    state: () => ({
           // i: null,
            interval: 1,
            start: null,
            end: null,
            breakpoints: []
        }),
    mutations: {
        addBreakpoint(state, breakpoint) {
            state.breakpoints.push(breakpoint)
        },
     /*   setI: function (state, i) {
            state.i = i;
        },
        incrementI: function (state) {
            state.i++;
        },
        decrementI: function (state) {
            state.i--;
        },*/
        setInterval: function (state, interval) {
            state.interval = interval;
        },
        setStart: function (state, start) {
            state.start = start;
        },
        setEnd: function (state, end) {
            state.end = end;
        },
        setBreakpoints: function (state, breakpoints) {
            state.breakpoints = breakpoints;
        }
    },
    actions: {

    }
};


