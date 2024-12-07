import _ from "lodash";
import { getProgramComposition, Contracts, OpenContracts, contractNameDecomposer, getUnitMove } from "@/js/main.js";
import { baseInitialState } from "@/components/programs/base-initial-state";
// import store from "@/store";

function createInitialState(targetProgram, role, initializingState) {
    console.log("createInitialState() starting. targetProgram=", targetProgram);
    
    try {
        console.log("initializingState=", JSON.parse(JSON.stringify(initializingState)));
    } catch (err) {
        console.log("error: initializingState=", initializingState);
    }

    console.log("baseInitialState=", JSON.parse(JSON.stringify(baseInitialState)));

    let programComposition = getProgramComposition(targetProgram, role);
    console.log("programComposition=", programComposition);

    let programInitialState = programComposition.initialState;
    console.log("programInitialState=", JSON.parse(JSON.stringify(programInitialState)));

    let initialState;
    if (typeof initializingState === 'undefined' || initializingState === null || Object.keys(initializingState).length === 0 ||
        ["StockCharts", "Search"].includes(targetProgram)) {
        console.log("returning programInitialState.");
        initialState = _.merge(JSON.parse(JSON.stringify(baseInitialState)), programInitialState);
        console.log("initialState=", JSON.parse(JSON.stringify(initialState)));
    } else {
        console.log("returning merged state.");
        initialState = _.merge(JSON.parse(JSON.stringify(baseInitialState)), initializingState);
        initialState.program = targetProgram;

        initialState = _.merge(initialState, programInitialState);
        console.log("initialState=", JSON.parse(JSON.stringify(initialState)));

        if (typeof initialState.selected !== 'undefined' && initialState.selected.length > 0) {
            let commodity = contractNameDecomposer(initialState.sampleContract[0]).commoditySymbol;
            let paddingContracts = OpenContracts(commodity).sort().slice(0,4);
            console.log("paddingContracts=", paddingContracts);

            if(paddingContracts.length < 4){
                paddingContracts = Contracts(commodity).sort().slice(1).slice(-4);
            }
            console.log("paddingContracts=", paddingContracts);

            initialState.sampleContract = ["OpenSpreads"].includes(targetProgram) ? paddingContracts : 
                    _.merge(paddingContracts, initialState.selected[0].replace(/\s/g, '').split('/'));
            console.log("initialState.sampleContract=", initialState.sampleContract);

            if(["OpenSpreads"].includes(targetProgram)){
                initialState.selected = [];
                initialState.legs = 1;
                initialState.mult = [1,1,1,1];
            }

            // reset unitMoves.
            let newUnitMoveArray = initialState.sampleContract.map(x => getUnitMove(contractNameDecomposer(x).commoditySymbol));
            initialState.unitMove = newUnitMoveArray;
        }

       // let nextModuleName = store.getters["nextModuleName"];
       // console.log("nextModuleName=", nextModuleName);

        /* switch (targetProgram) {
             
             case "LongTermCharts": {
                     console.log("target=LongTermCharts, oldProgram=", oldProgram);
                   
                     //  let includeUnitMoves = true;
                     initialState.symbols = "old";
                     initialState.showTradingPeriod = false;
                     initialState.aligned = false;
 
                     let fullInitialState = loadBrowserSideOnlyData(initialState);
                     console.log("fullInitialState=", fullInitialState);
                 }
                 break;
             case "OpenSpreads":
                 console.log("target=OpenSpreads, oldProgram=", oldProgram);
                 initialState.selected = initialState.selected.map(spread => {
                     let contracts = spread.replace(/\s/g, '').split('/');
                     // console.log("contracts=", contracts);
 
                     let commodity = contractNameDecomposer(contracts[0]).commoditySymbol;
                     return OpenContracts(commodity)[0];
                 });
                 initialState.numberOfContractsApart = 0;
                 break;
 
         } */
    }
    console.log("initialState=", JSON.parse(JSON.stringify(initialState)));
    return initialState;


    /*  

          if (initializingState !== null && this.activeModuleName !== null && Object.keys(initializingState).length > 0) {
              if (["TradeMaps", "OpenSpreads"].includes(targetProgram)) {
                      if (targetProgram === "OpenSpreads") { // Don't remove this block!
                      initialState.selected = initializingState.selected.map(spread => {
                          let contracts = spread.replace(/\s/g, '').split('/');
                          // console.log("contracts=", contracts);

                          let commodity = contractNameDecomposer(contracts[0]).commoditySymbol;
                          return OpenContracts(commodity)[0];
                      });
                      initializingState.legs = 1;

                      console.log("initialState.selected=", initialState.selected);
                  }
              } else if (["LongTermCharts"].includes(targetProgram)) {
                  initialState.aligned = initializingState.aligned;
                  initialState.truncate = initializingState.truncate;
                  initialState.selected = initializingState.selected;
              } else if (!["StockCharts"].includes(targetProgram)) {
                  initialState.selected = initializingState.selected;
              }

              initialState.unitMove = initializingState.unitMove;
              initialState.sampleContract = initializingState.sampleContract;

              // console.log("initialState.unitMove=", initialState.unitMove);

              initialState.mult = ["StockCharts", "OpenSpreads"].includes(targetProgram) ? [1, 1, 1, 1] : initializingState.mult;
              initialState.legs = targetProgram === "StockCharts" ? 1 : initializingState.legs;
              initialState.p = ["StockCharts", "OpenSpreads"].includes(targetProgram) ? [1, -1, 1, 1] : initializingState.p;
               // if (targetProgram === "TradeMaps") {
              // initialState.p = initializingState.p[0] > 0 ? [1, -1, 1, 1] : [-1, 1, 1, 1];
             //  }

              initialState.open = initializingState.open;
              initialState.close = initializingState.close;
              initialState.buySell = initializingState.buySell;
              if (targetProgram != "TradeMaps") { //This block handles Search actions.
                  initialState.addRSIPanel = initializingState.addRSIPanel;
                  initialState.rsiPeriod = initializingState.rsiPeriod;
              }

              if (["TradeMaps", "Calculator"].includes(targetProgram)) {
                  initialState.showTradingPeriod = true;
              } else {
                  initialState.showTradingPeriod = initializingState.showTradingPeriod;
              }
          }

          initialState.hideInput = false;
          //initialState.seasonals = 
          console.log("initialState.seasonals=", initialState.seasonals);

         
          if (typeof initialState.browserSideOnly.invertDatesMultiplier === 'undefined') {
              initialState.browserSideOnly.invertDatesMultiplier = 1;
          }

          if (initialState.selected.length === 0 && initialState.instrument === "future") {
              let selected = nearestOpenSpreadOrLatestClosedSpread(initialState);
              console.log("selected=", selected);
              initialState.selected = [selected.value];
          }

          if (typeof initialState.tickerInput === 'undefined') {
              let invertDatesMultiplier = 1;
              let noLegSwapping = false;
              let includeUnitMoves = true;
              let ticker = spreadTitle(initialState, invertDatesMultiplier, noLegSwapping, this.symbols, includeUnitMoves).replace(/\s/g, '');
              console.log("ticker=", ticker);

              initialState.tickerInput = ticker;
          }
          initialState.isTickerInputValid = true;

          if (typeof programInitialState.rowsPerPage !== 'undefined') {
              initialState.chartParameters.rowsPerPage = programInitialState.chartParameters.rowsPerPage;
          }

          if (typeof programInitialState.numberOfContractsApart !== 'undefined') {
              initialState.numberOfContractsApart = programInitialState.numberOfContractsApart;
          }

          console.log("initialState=", initialState);
          return initialState;
      } */
}

export {
    createInitialState
};
