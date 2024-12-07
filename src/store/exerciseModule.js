export default {
    namespaced: true,
    state: () => ({
            start: null,
            end: null,
            breakpoints: []
        }),
    mutations: {
        addBreakpoint(state, breakpoint) {
            state.breakpoints.push(breakpoint)
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
    }
};


