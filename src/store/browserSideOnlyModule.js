//import {spreadTitleLegs} from "@/js/main";

export default {
    namespaced: true,
    state: () => ({
            numberOfIncompleteSpreads: 0,
            alignerOptions: [],
            alignerOpenOptions: [],
            contractLists: [],
            openContractLists: [],
            disabledSelected: [],
            invertDatesMultiplier: 1,
          //  minUnreturnedSeasonal: 40,
            barchartOptions: [],
            inputDivHeight: null,
            inputDivWidth: null,
            outputDivHeight: null,
        }),
    getters: {
      /*  tickerOptions: function (state, getters) {
            console.log("tickerOptions getter starting.");
            let parentState = getters['parentState'];

            if (typeof parentState !== 'undefined') {
                let newList = state.options.map(rowArray => {
                    //console.log("rowArray=", rowArray);

                    parentState.selected = [rowArray.join('/')];
                    let invertDatesMultiplier = 1;
                    let noLegSwapping = true;
                    let tickerLegs = spreadTitleLegs(JSON.parse(JSON.stringify(parentState)), invertDatesMultiplier, noLegSwapping);
                    //  console.log("tickerLegs=", tickerLegs);
                    return tickerLegs;
                });
                console.log("newList=", newList);
                return newList;
            } else {
                return null;
            }
        },
        openTickerOptions: function (state, getters) {
            console.log("openTickerOptions starting.");
            let tickerOptions = getters['tickerOptions'];
            let openTickerOptions = tickerOptions.filter(optionArray => optionArray);
            return openTickerOptions;
        },*/
        parentState: function (state, getters, rootState, rootGetters) {
           // console.log("state=", state);
           // console.log("rootState=", rootState);

            let activeModuleName = rootGetters['activeModuleName'];
            let parentState = rootState[activeModuleName];
            return parentState;
        }
    },
    mutations: {
        setAlignerOptions: function (state, alignerOptions) {
            // console.log("alignerOptions=", alignerOptions);
            state.alignerOptions = alignerOptions;
        },
        setAlignerOpenOptions: function (state, alignerOpenOptions) {
            state.alignerOpenOptions = alignerOpenOptions;
        },
        setContractLists: function (state, contractLists) {
            state.contractLists = contractLists;
        },
        setOpenContractLists: function (state, openContractLists) {
            state.openContractLists = openContractLists;
        },
        setDisabledSelected: function (state, disabledSelected) {
            state.disabledSelected = disabledSelected;
        },
        incrementNumberOfIncompleteSpreads: function (state) {
            // console.log("incrementNumberOfIncompleteSpreads() starting.");
            state.numberOfIncompleteSpreads++;
        },
        setNumberOfIncompleteSpreads: function (state, numberOfIncompleteSpreads) {
            state.numberOfIncompleteSpreads = numberOfIncompleteSpreads;
        },
        setInvertDatesMultiplier: function (state, invertDatesMultiplier) {
            state.invertDatesMultiplier = invertDatesMultiplier;
        },
     /*   setMinUnreturnedSeasonal: function (state, minUnreturnedSeasonal) {
            state.minUnreturnedSeasonal = minUnreturnedSeasonal;
        }, */
        setBarchartOptions: function (state, barchartOptions) {
            state.barchartOptions = barchartOptions;
        },
        setInputDivHeight: function (state, inputDivHeight) {
           // console.log("setInputDivHeight() starting. inputDivHeight=", inputDivHeight);
            state.inputDivHeight = inputDivHeight;
        },
        setInputDivWidth: function (state, inputDivWidth) {
          // console.log("setInputDivWidth() starting. setInputDivWidth=", inputDivWidth);
           state.inputDivWidth = inputDivWidth;
        },
        setOutputDivHeight: function (state, outputDivHeight) {
           // console.log("setOutputDivHeight() starting. outputDivHeight=", outputDivHeight);
            state.outputDivHeight = outputDivHeight;
        },
    }
};


