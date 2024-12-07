export default {
    namespaced: true,
    state: () => ({
            legColors: ["blue", "red", "teal", "orange", "navy", "purple"],
            rawCommoditiesObject: {},
            fullCommoditiesArray: [],

            baseUrl: "https://djscarr.com",
          //   baseUrl: "http://localhost:8080",
           contextName: "/a4a", // For windows see https://www.educative.io/edpresso/mklink-windows-10
          //  contextName: "",

            parameterOptions: [
                {value: "percentUp", text: "percent profitable"},
                {value: "avgAppd", text: "appd"},
                {value: "avgChange", text: "equity change"},
                {value: "avgDays", text: "avg days"},
                {value: "avgMin", text: "avg mae"},
                {value: "worstMin", text: "worst mae"},
                {value: "avgMax", text: "avg mpe"},
                {value: "bestMax", text: "best mpe"},
                {value: "rrr", text: "avg mpe / avg mae"}
            ],
            firebaseStorageDirectory: "maps3",
            portfolioAlarmTriggered: ""
        }),
    getters: {
        commoditiesArray(state, getters, rootState) {
            let arr = JSON.parse(JSON.stringify(state.fullCommoditiesArray));
           // console.log("arr=", arr);
            let returnArray;
            if (rootState.user.role === "guest") {
                let freeCommodities = ['CL', 'S'];
                returnArray=arr.filter(commodity => freeCommodities.includes(commodity.symbol));
            }else{
                returnArray = arr;
            }
           // console.log("commoditiesArray=", returnArray);
            return returnArray;
        }
    },
    mutations: {
        setFullCommoditiesArray: function (state, payload) {
           // console.log("setFullCommoditiesArray() starting.");
            state.fullCommoditiesArray = payload;
        }, 
        setBaseUrl: function(state, payload){
            state.baseUrl = payload;
        },
        setContextName: function(state, payload){
            state.contextName = payload;
        },
        setFirebaseStorageDirectory: function(state, payload){
            state.firebaseStorageDirectory = payload;
        },
        setPortfolioAlarmTriggered: function(state, payload){
            state.portfolioAlarmTriggered = payload;
        }
    }
};


