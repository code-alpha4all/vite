//import moment from "moment";

export default {
    namespaced: true,
    state: () => ({
          // ticker: null,
         //  openPrice: null,
         //  openDate: null,
         //  closeDate: null,
         //  lastPrice: null,
         //  profit: null
        // numberOfPositions: null
        folder: "",
        trades: []
        }),
    mutations: {
        set: function(state, {key, value}){
            console.log("set() starting. key=", key, " value=", value);
            state[key] = value;
        }
    }
};


