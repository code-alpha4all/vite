import $ from "jquery";
import moment from 'moment';
import * as fb from "../firebase";
import _ from "lodash";
import { bus } from '@/main';

const basicChartInputNew = () => import("@/components/programs/BasicChartNew/basic-chart-input-new");
// const basicChartInputTest = () => import("@/components/programs/BasicChartTest/basic-chart-input-test");
const stockChartInput = () => import("@/components/programs/StockChart/stock-chart-input");
const calculatorInput = () => import("@/components/programs/Calculator/calculator-input");
const openSpreadsInput = () => import("@/components/programs/OpenSpreads/open-spreads-input");
const forwardCurvesInput = () => import("@/components/programs/ForwardCurves/forward-curves-input");
const searchInput = () => import("@/components/programs/Search/search-input");
// const searchNewInput = () => import("@/components/programs/SearchNew/search-new-input");
const tradeMapsInput = () => import("@/components/programs/TradeMaps/trade-maps-input");
const spreadCoverageInput = () => import("@/components/programs/SpreadCoverage/spread-coverage-input");
const longTermChartsInput = () => import("@/components/programs/LongTermCharts/long-term-charts-input");
const stackedChartsInput = () => import("@/components/programs/StackedCharts/stacked-charts-input");
const historyInput = () => import("@/components/programs/History/history-input");
// const timeSeriesInput = () => import("@/components/programs/TimeSeriesChart/time-series-chart-input");
const firestoreSearchInput = () => import("@/components/programs/FirestoreSearch/firestore-search-input");
const watchListInput = () => import("@/components/programs/WatchList/watch-list-input");
const tradeExplorerInput = () => import("@/components/programs/TradeExplorer/trade-explorer-input");
const portfolioInput = () => import("@/components/programs/Portfolio/portfolio-input");
const savedChartsAdminInput = () => import("@/components/programs/SavedChartsAdmin/saved-charts-admin-input");
const quotesInput = () => import("@/components/programs/Quotes/quotes-input");

import { basicChartInitialStateNew } from "@/components/programs/BasicChartNew/basic-chart-initial-state";
// import { basicChartInitialStateTest } from "@/components/programs/BasicChartTest/basic-chart-initial-state";
import { stockChartInitialState } from "@/components/programs/StockChart/stock-chart-initial-state";
import { calculatorInitialState } from "@/components/programs/Calculator/calculator-initial-state";
import { openSpreadsInitialState } from "@/components/programs/OpenSpreads/open-spreads-initial-state";
import { forwardCurvesInitialState } from "@/components/programs/ForwardCurves/forward-curves-initial-state";
import { searchInitialState } from "@/components/programs/Search/search-initial-state";
// import { searchNewInitialState } from "@/components/programs/SearchNew/search-new-initial-state";
import { tradeMapsInitialState } from "@/components/programs/TradeMaps/trade-maps-initial-state";
import { spreadCoverageInitialState } from "@/components/programs/SpreadCoverage/spread-coverage-initial-state";
import { longTermChartsInitialState } from "@/components/programs/LongTermCharts/long-term-charts-initial-state";
import { stackedChartsInitialState } from "@/components/programs/StackedCharts/stacked-charts-initial-state";
import { historyInitialState } from "@/components/programs/History/history-initial-state";
// import { timeSeriesChartInitialState } from "@/components/programs/TimeSeriesChart/time-series-chart-initial-state";
import { firestoreSearchInitialState } from "@/components/programs/FirestoreSearch/firestore-search-initial-state";
import { watchListInitialState } from "@/components/programs/WatchList/watch-list-initial-state";
import { tradeExplorerInitialState } from "@/components/programs/TradeExplorer/trade-explorer-initial-state";
import { portfolioInitialState } from "@/components/programs/Portfolio/portfolio-initial-state";
import { savedChartsAdminInitialState } from "@/components/programs/SavedChartsAdmin/saved-charts-admin-initial-state";
import { quotesInitialState } from "@/components/programs/Quotes/quotes-initial-state";

import store from "@/store";

const { inspect } = require('util');
const transform = require('lodash.transform');
const isEqual = require('lodash.isequal');
const isArray = require('lodash.isarray');
const isObject = require('lodash.isobject');

const symbolArray = [
    { eod: "TY", barchart: "ZN", ib: "ZN", tickSize: 0.015625 },
    { eod: "TU", barchart: "ZT", ib: "ZT", tickSize: 0.0078125 },
    { eod: "US", barchart: "ZB", ib: "ZB", tickSize: 0.03125 },
    { eod: "FV", barchart: "ZF", ib: "ZF", tickSize: 0.0078125 },
    { eod: "AD", barchart: "A6", ib: "AUD", tickSize: 0.0001 },
    { eod: "B", barchart: "CB", ib: "BZ", tickSize: 0.01 },
    { eod: "BP", barchart: "B6", ib: "GBP", tickSize: 0.0001 },
    { eod: "CB", barchart: "BD", ib: "CB", tickSize: 0.025 },
    { eod: "CC", barchart: "CC", ib: "CC", tickSize: 1 },
    { eod: "RC", barchart: "RM", ib: "RC", tickSize: 1 },
    { eod: "HG", barchart: "HG", ib: "HG", tickSize: 0.05 },
    { eod: "CD", barchart: "D6", ib: "CAD", tickSize: 0.00005 },
    { eod: "DC", barchart: "DL", ib: "DA", tickSize: 0.01 },
    { eod: "C", barchart: "ZC", ib: "ZC", tickSize: 0.25 },
    { eod: "CT", barchart: "CT", ib: "CT", tickSize: 0.01 },
    { eod: "CL", barchart: "CL", ib: "CL", tickSize: 0.01 },
    { eod: "YM", barchart: "YM", ib: "YM", tickSize: 1 },
    { eod: "NQ", barchart: "NQ", ib: "NQ", tickSize: 0.25 },
    { eod: "CSC", barchart: "BJ", ib: "BJ", tickSize: 0.001 },
    { eod: "EC", barchart: "E6", ib: "EUR", tickSize: 0.00005 },
    { eod: "ED", barchart: "GE", ib: "GE", tickSize: 0.0025 },
    { eod: "ZQ", barchart: "ZQ", ib: "ZQ", tickSize: 0.005 },
    { eod: "FC", barchart: "GF", ib: "GF", tickSize: 0.025 },
    { eod: "RB", barchart: "RB", ib: "RB", tickSize: 0.0001 },
    { eod: "GC", barchart: "GC", ib: "GC", tickSize: 0.1 },
    { eod: "GO", barchart: "LF", ib: "GOIL", tickSize: 0.25 },
    { eod: "HO", barchart: "HO", ib: "HO", tickSize: 0.0001 },
    { eod: "JY", barchart: "J6", ib: "JPY", tickSize: 0.00005 },
    { eod: "KC", barchart: "KC", ib: "KC", tickSize: 0.05 },
    { eod: "KW", barchart: "KE", ib: "KE", tickSize: 0.25 },
    { eod: "LB", barchart: "LS", ib: "LS", tickSize: 0.0001 },
    { eod: "LC", barchart: "LE", ib: "LE", tickSize: 0.025 },
    { eod: "LH", barchart: "HE", ib: "HE", tickSize: 0.025 },
    { eod: "MW", barchart: "MW", ib: "MW", tickSize: 0.25 },
    { eod: "NG", barchart: "NG", ib: "NG", tickSize: 0.001 },
    { eod: "O", barchart: "ZO", ib: "ZO", tickSize: 0.25 },
    { eod: "OJ", barchart: "OJ", ib: "OJ", tickSize: 0.05 },
    { eod: "PA", barchart: "PA", ib: "PA", tickSize: 0.05 },
    { eod: "PL", barchart: "PL", ib: "PL", tickSize: 0.1 },
    { eod: "PRK", barchart: "KM", ib: "PRK", tickSize: 0.00025 },
    { eod: "RR", barchart: "ZR", ib: "ZR", tickSize: 0.005 },
    { eod: "ES", barchart: "ES", ib: "ES", tickSize: 0.25 },
    { eod: "SM", barchart: "ZM", ib: "ZM", tickSize: 0.1 },
    { eod: "BO", barchart: "ZL", ib: "ZL", tickSize: 0.01 },
    { eod: "S", barchart: "ZS", ib: "ZS", tickSize: 0.25 },
    { eod: "SF", barchart: "S6", ib: "CHF", tickSize: 0.0001 },
    { eod: "SR", barchart: "SR", ib: "SR", tickSize: .0025 },
    { eod: "SI", barchart: "SI", ib: "SI", tickSize: 0.5 },
    { eod: "SB", barchart: "SB", ib: "SB", tickSize: 0.01 },
    { eod: "SW", barchart: "SW", ib: "SW", tickSize: 0.1 },
    { eod: "W", barchart: "ZW", ib: "ZW", tickSize: 0.25 },
    { eod: "VX", barchart: "VI", ib: "VIX", tickSize: 0.05 },
    { eod: "DX", barchart: "DX", ib: "DX", tickSize: 0.001 }
];

/**
 * Find difference between two objects
 * @param  {object} origObj - Source object to compare newObj against
 * @param  {object} newObj  - New object with potential changes
 * @return {object} differences
 */
function difference(origObj, newObj) {
    function changes(newObj, origObj) {
        let arrayIndexCounter = 0
        return transform(newObj, function (result, value, key) {
            if (!isEqual(value, origObj[key])) {
                let resultKey = isArray(origObj) ? arrayIndexCounter++ : key
                result[resultKey] = (isObject(value) && isObject(origObj[key])) ? changes(value, origObj[key]) : value
            }
        })
    }
    return changes(newObj, origObj)
}

let commoditiesArray = {};

function getCommoditiesArray() {
    return commoditiesArray;
}

function setCommoditiesArray(array) {
    commoditiesArray = array;
    // test();

}

function areSameUnits(spread, symbols = "old") {
    // console.log("areSameUnits() starting. spread=", spread);
    let normalizedSpread = spread.replace(/\/---------/g, '').replace(/---------\//g, '').replace(/\s/g, '');
    // console.log("spread=", spread, " normalizedSpread=", normalizedSpread);
    let contracts = normalizedSpread.split('/');
    let units = contracts.map(x => commodityUnits(contractNameDecomposer(x, symbols).commoditySymbol));
    let sameUnits = units.every(x => x === units[0]);
    return sameUnits;
}

function areSameUnitMoves(spread, symbols = "old") {
    // console.log("areSameUnitMoves() starting. spread=", spread);
    let normalizedSpread = spread.replace(/\/---------/g, '').replace(/---------\//g, '').replace(/\s/g, '');
    // console.log("spread=", spread, " normalizedSpread=", normalizedSpread);
    let contracts = normalizedSpread.split('/');
    // console.log("contracts=", contracts);
    let unitMove = contracts.map(x => getUnitMove(contractNameDecomposer(x, symbols).commoditySymbol));
    // console.log("unitMove=", unitMove);
    let sameUnitMoves = unitMove.every(x => x === unitMove[0])
    return sameUnitMoves;
}

function areSameUnitsAndUnitMoves(spread, symbols = "old") {
    // console.log("areSameUnitsAndUnitMoves() starting. spread=", spread, " symbols=", symbols);
    return areSameUnitMoves(spread, symbols) && areSameUnits(spread, symbols);
}

function commodityUnits(commodity) {
    // console.log("commodityUnits() starting. commodity=", commodity);
    return getCommoditiesArray().find(x => x.symbol === commodity).units;
}

function getUnitMove(commodity) {
    // console.log("getUnitMove() starting. commodity=", commodity);       
    return getCommoditiesArray().find(x => x.symbol === commodity).unitMove;
}

function getSymbolSetsOfCompleteTicker(ticker) {
    console.log("getSymbolSetsOfCompleteTicker() starting. ticker=", ticker);
    let tickerLegs = ticker.replace(/\s/g, '').split(/(?=[-+\s])/);
    // console.log("tickerLegs=", tickerLegs);

    let contractArray = tickerLegs.map(leg => tickerLegDecomposer(leg).contract);
    // console.log("contractArray=", contractArray);

    let symbolSetsArray = contractArray.map(contract => getSymbolSetsOfCompleteContractName(contract));
    console.log("symbolSetsArray=", symbolSetsArray);

    let symbolSets = symbolSetsArray[0].filter(symbols => {
        console.log("symbols=", symbols);

        let symbolSetsArraySubset = symbolSetsArray.shift();
        console.log("symbolSetsArraySubset=", symbolSetsArraySubset);

    })
    console.log("symbolSets=", symbolSets);
    return symbolSets;  //symbolsArray;
}

function getSymbolSetsOfCompleteContractName(contract) {
    console.log("getSymbolSetsOfCompleteContractName() starting. contract=", contract);
    let contractPartsArray = contract.split(/(\d+)/).filter(el => el != ""); //https://stackoverflow.com/questions/6060352/splitting-a-string-into-chunks-by-numeric-or-alpha-character-with-javascript
    console.log("contractPartsArray=", contractPartsArray);

    let symbolSets;
    if (contractPartsArray.length === 3) {
        symbolSets = ["eod"];
    } else {
        let commodity = contractPartsArray[0];
        symbolSets = ["barchart", "ib"].filter(symbols => {
            return isCommodity(commodity, symbols).isCommodity;
        });

    }
    return symbolSets;
}
// getSymbolSetsOfCompleteContractName("ZCH24");

function contractNameDecomposer(contract, symbols = "old") {
   // console.log("contractNameDecomposer() starting. contract=", contract, " symbols=", symbols);
    if (typeof contract === 'undefined' || contract.split("/").length > 1) {
       // console.trace();
        console.log("contractNameDecomposer() starting. contract=", contract, " symbols=", symbols);
    }

    let commodity, year, fullYear, month;
    if (typeof contract != 'undefined') {
        let contractPartsArray = contract.split(/(\d+)/).filter(el => el != ""); //https://stackoverflow.com/questions/6060352/splitting-a-string-into-chunks-by-numeric-or-alpha-character-with-javascript
        // console.log("contractPartsArray=", contractPartsArray);
        if (["old", "eod"].includes(symbols)) {
            // console.log("decomposing contract with old symbols.");
            commodity = isNaN(contractPartsArray[0]) ? contractPartsArray[0] : undefined;

            year = contractPartsArray.find(x => !isNaN(x));
            fullYear = year;
            // console.log("year=", year);
            let yearIndex = contractPartsArray.indexOf(year);
            // console.log("yearIndex=", yearIndex);

            month = typeof year === 'undefined' ? undefined : contractPartsArray[yearIndex + 1];
        } else if (["new", "barchart"].includes(symbols)) {
            // console.log("decomposing contract with new symbols.");

            commodity = contract.substring(0, 2);
            month = contract.substring(2, 3);
            year = parseInt(contract.substring(3, 5));
            fullYear = isNaN(year) ? '' : (year > 70 ? 1900 : 2000) + year;
            // console.log("commodity=", commodity + " month=", month + " year=", year + " fullYear=", fullYear);

            /*  if (contractPartsArray.length >= 1) {
                  year = parseInt(contractPartsArray[1]);
                  fullYear = isNaN(year) ? '' : (year > 70 ? 1900 : 2000) + year;
  
                  let commodityMonthCharacterArray = [...contractPartsArray[0]];
                  if (contract.length > 2) {
                      month = commodityMonthCharacterArray.pop();  // https://www.samanthaming.com/tidbits/83-4-ways-to-convert-string-to-character-array/
                      // console.log("commodityMonthCharacterArray=", commodityMonthCharacterArray);
                  }
                  commodity = commodityMonthCharacterArray.join("");
              } */
        } else if (["ib"].includes(symbols)) {
            // console.log("decomposing contract with ib symbols.");
            let contractPartsArray = contract.split(/(\d+)/).filter(el => el != ""); //https://stackoverflow.com/questions/6060352/splitting-a-string-into-chunks-by-numeric-or-alpha-character-with-javascript
            // console.log("contractPartsArray=", contractPartsArray);

            year = parseInt(contractPartsArray[1]);
            fullYear = isNaN(year) ? '' : (year > 70 ? 1900 : 2000) + year;

            let commodityMonth = contractPartsArray[0];
            // console.log("commodityMonth=", commodityMonth);

            let arr = symbolArray.map(x => x[symbols]);
            // console.log("arr=", arr);

            if (typeof commodityMonth !== 'undefined') {
                commodity = arr.find(x => commodityMonth.includes(x));
                commodity = typeof commodity === 'undefined' ? contract : commodity;
                month = commodityMonth.replace(commodity, '');
            }
        }
        // console.log("commodity=", commodity + " month=", month + " year=", year + " fullYear=", fullYear);
    }
    return { commoditySymbol: commodity, year: year, fullYear: fullYear, monthSymbol: month };
}
////console.log("contractNameDecomposer('ZCK23')=", contractNameDecomposer('ZCK23'));

function tickerLegDecomposer(leg) {
    // console.log("tickerLegDecomposer() starting.  leg=", leg);
    let tickerLeg = leg.replace(/[\s]/g, "");
    // console.log("tickerLeg=", tickerLeg);

    if (tickerLeg === "") {
        return;
    } else {
        let tickerLegParts = tickerLeg.split('*');
        // console.log("tickerLegParts=", tickerLegParts);

        // let contract = tickerLegParts.find(x => isContract(x));
        let contract = tickerLegParts.filter(x => isNaN(x))[0];
        //  console.log("contract=", contract);

        if (typeof contract === 'undefined') {
            return { contract: "" };
        } else {
            if (contract.includes('-')) {
                contract = contract.replace("-", "");
                tickerLegParts = ["-1", contract];
            }
            if (contract.includes('+')) {
                contract = contract.replace("+", "");
                tickerLegParts = ["1", contract];
            }
            //  console.log("tickerLegParts=", tickerLegParts);

            let mult, unitMove;
            switch (tickerLegParts.length) {
                case 1:
                    mult = 1;
                    unitMove = 1;   /*legIndex > 0 ? 1 : */  /* getUnitMove(contractNameDecomposer(contract).commoditySymbol);*/
                    break;
                case 2:
                    if (tickerLegParts.indexOf(contract) === 0) {
                        mult = 1;
                        unitMove = parseInt(tickerLegParts[1]);
                    } else {
                        mult = parseFloat(tickerLegParts[0]);
                        unitMove = 1;  //getUnitMove(contractNameDecomposer(contract).commoditySymbol);
                    }
                    break;
                case 3:
                    mult = parseFloat(tickerLegParts[0]);
                    unitMove = parseInt(tickerLegParts[2]);
            }
            let result = { mult: mult, contract: contract.toUpperCase(), unitMove: unitMove };
            // console.log("result=", result);
            return result;
        }
    }
}

function isCommodity(input, symbols) {
    // console.log("isCommodity() starting. input  =", input, " symbols=", symbols);
    if (symbols === "old") {
        symbols = "eod";
    }
    if (symbols === "new") {
        symbols = "barchart";
    }

    let arr = symbolArray.map(x => x[symbols]);
    // console.log("arr=", arr);
    /* if (typeof arr[0] === 'undefined') {
         console.trace();
     }*/

    let isCom = arr.some(x => input === x);
    // console.log("isCom=", isCom);

    let commodity;
    let commodityObject = {};
    if (isCom) {
        commodity = input;
        // console.log("commodity=", commodity);

        let eodCommodity = ["old", "eod"].includes(symbols) ? commodity : symbolConverter(commodity, symbols, "eod");
        if (typeof eodCommodity !== 'undefined') {
            commodityObject = commoditiesArray.find(x => x.symbol === eodCommodity);
        }
    }

    let obj = { isCommodity: isCom, commodity: commodity, symbols: symbols, commodityObject: commodityObject };
    return obj;
}

function isContract(contract, symbols = "old") {
    // console.log("isContract() starting.  contract=", contract, " symbols=", symbols);

    if (symbols === "old") {
        symbols = "eod";
    }
    if (symbols === "new") {
        symbols = "barchart";
    }

    let contractObject = contractNameDecomposer(contract, symbols);
    //console.log("contractObject=", contractObject);

    switch (symbols) {
        case "eod":
            // console.log("using eod symbols.");
            break;
        case "barchart":
            // console.log("using barchart symbols.");
            break;
    }

    let commodity;
    let month;
    let year;

    let isCommodity;
    let isMonth
    let isYear;

    let returnObject;

    if (symbols === "eod") {
        // console.log("using eod symbols.");
        commodity = contractObject.commoditySymbol;
        isCommodity = getCommoditiesArray().map(x => x.symbol).includes(commodity);
        // console.log("commodity=", commodity, " isCommodity=", isCommodity);

        isMonth = false;
        if (isCommodity) {
            month = contractObject.monthSymbol;
            let monthsArray = commoditiesArray.find(x => x.symbol === commodity).months.map(x => x.symbol);
            // console.log("monthsArray=", monthsArray);
            isMonth = monthsArray.includes(month);
            // console.log("month=", month, " isMonth=", isMonth);
        }

        year = parseInt(contractObject.year);
        if (isCommodity /*&& isMonth*/) {
            let dummyMonth = isMonth ? month : commodityMonths(commodity)[0];
            // console.log("dummyMonth=", dummyMonth);
            let yearsArray = Contracts(commodity, dummyMonth, symbols).map(x => contractNameDecomposer(x, symbols).year);
            //  console.log("yearsArray=", yearsArray);

            isYear = yearsArray.includes(contractObject.year);
        } else {
            isYear = undefined;
        }
        //  isYear =  year > 1970 && year <2100;
        returnObject = { isContract: isCommodity && isMonth && isYear, isCommodity: isCommodity, isMonth: isMonth, isYear: isYear };
        // console.log("isContract(" + contract + ")=", returnObject)
        return returnObject;
    } else if (["new", "barchart", "ib"].includes(symbols)) {
        // console.log("using new symbols.");
        commodity = contractObject.commoditySymbol;
        // console.log("commodity=", commodity);
        isCommodity = symbolArray.map(x => x[symbols]).includes(commodity);
        // console.log("isCommodity=", isCommodity);

        isMonth = false;
        if (isCommodity) {
            let month = contractObject.monthSymbol;
            let oldCommodity = symbolConverter(commodity, symbols, "eod");
            let monthsArray = commoditiesArray.find(x => x.symbol === oldCommodity).months.map(x => x.symbol);
            // console.log("monthsArray=", monthsArray);
            isMonth = monthsArray.includes(month);
            // console.log("month=", month, " isMonth=", isMonth);
        }

        year = contractObject.year;
        // console.log("year=", year, " year.length=", year.toString().length);
        isYear = typeof year === 'undefined' ? undefined : year.toString().length === 2;
        returnObject = { isContract: isCommodity && isMonth && isYear, isCommodity: isCommodity, isMonth: isMonth, isYear: isYear };
        // console.log("isContract(" + contract + ")=", returnObject)
        return returnObject;
    } /*else if (symbols === "ib") {
        console.log("using ib symbols.");


    }*/
}

function displayCommodity(commodity, symbols) {
    let com = (symbols === "old" || typeof symbols === "undefined") ? commodity : symbolConverter(commodity, "eod", symbols);
    return com;
}

function compareContracts(contract1, contract2) {
    //  console.log("contract1=", contract1, " contract2=", contract2);
    let cND = contractNameDecomposer(contract1);
    let month1 = cND.monthSymbol;
    let month2 = contractNameDecomposer(contract2).monthSymbol;
    let year1 = cND.year;
    let year2 = contractNameDecomposer(contract2).year;

    let compare;
    if (year1 < year2) {
        compare = -1;
    } else if (year1 > year2) {
        compare = 1;
    } else if (month1 < month2) {
        compare = -1;
    } else {
        compare = 1;
    }
    return compare;
}



function getSymbolArray(symbols) {
    if (symbols === "old") {
        symbols = "eod";
    }
    if (symbols === "new") {
        symbols = "barchart";
    }

    return symbolArray.map(x => x[symbols]);
}

function symbolConverter(symbol, sourceSymbolSet, targetSymbolSet) {
   // console.log("symbolConverter() starting. symbol=", symbol + " sourceSymbolSet=", sourceSymbolSet, " targetSymbolSet=", targetSymbolSet);
    let returnValue;

    if (sourceSymbolSet === "old") {
        sourceSymbolSet = "eod";
    }
    if (sourceSymbolSet === "new") {
        sourceSymbolSet = "barchart";
    }

    if (targetSymbolSet === "old") {
        targetSymbolSet = "eod";
    }
    if (targetSymbolSet === "new") {
        targetSymbolSet = "barchart";
    }

    let obj = symbolArray.find(x => x[sourceSymbolSet] === symbol);
   // console.log("obj=", obj);

    try {
        if (typeof obj !== 'undefined') {
            returnValue = obj[targetSymbolSet];
           // console.log("returnValue=", returnValue);
        } else {
            returnValue = null;
        }
    }
    catch (err) {
        console.log("err=", err);
        console.log("symbol=", symbol);
    }
    return returnValue;
}

function contractConverter(contract, sourceSymbolSet, targetSymbolSet) {
    // console.log("contractConverter() starting. contract=", contract, " sourceSymbolSet=", sourceSymbolSet, " targetSymbolSet=", targetSymbolSet);
    if (sourceSymbolSet === "old") {
        sourceSymbolSet = "eod";
    }
    if (sourceSymbolSet === "new") {
        sourceSymbolSet = "barchart";
    }

    if (targetSymbolSet === "old") {
        targetSymbolSet = "eod";
    }
    if (targetSymbolSet === "new") {
        targetSymbolSet = "barchart";
    }

    if (contract.includes("------")) {
        return '---------';
    }
    let commodity = contractNameDecomposer(contract, sourceSymbolSet).commoditySymbol;
    let month = contractNameDecomposer(contract, sourceSymbolSet).monthSymbol;
    let year = contractNameDecomposer(contract, sourceSymbolSet).year;
    // let shortYear = contractNameDecomposer(contract, sourceSymbolSet).year;
    let fullYear = contractNameDecomposer(contract, sourceSymbolSet).fullYear;
    // console.log("commodity=", commodity, " year=", year + " fullYear=", fullYear);

    let newCommodity = symbolConverter(commodity, sourceSymbolSet, targetSymbolSet);
    // console.log("newCommodity=", newCommodity);

    let twoDigitYear = sourceSymbolSet === 'eod' ? newCommodity + month + year.toString().substring(2, 4) : newCommodity + month + year;
    let fourDigitYear = newCommodity + fullYear + month;

    if (targetSymbolSet === "eod") {
        // console.log("fourDigitYear=", fourDigitYear);
        return fourDigitYear;
    } else {
        // console.log("twoDigitYear=", twoDigitYear);
        return twoDigitYear;
    }
}

function tickerConverter(ticker, sourceSymbolSet, targetSymbolSet) {
    // console.log("tickerConverter() starting. ticker=", ticker + " sourceSymbolSet=", sourceSymbolSet, " targetSymbolSet=", targetSymbolSet);
    let tickerLegs = ticker.replace(/\s/g, '').split(/(?=[-+])/);
    // console.log("tickerLegs=", tickerLegs);

    let newLegs = tickerLegs.map((leg, i) => {
        let decomposedLeg = leg === "" ? "" : tickerLegDecomposer(leg.toUpperCase());
        // console.log("decomposedLeg=", decomposedLeg);
        if (isContract(decomposedLeg.contract, sourceSymbolSet).isContract) {
            //console.log("isContract = true");
            let convertedContract = contractConverter(decomposedLeg.contract, sourceSymbolSet, targetSymbolSet);
            // console.log("convertedContract=", convertedContract);
            decomposedLeg.contract = convertedContract;
        } else {
            // console.log("isContract = false");
            decomposedLeg.contract = "";
        }
        // console.log("decomposedLeg=", decomposedLeg);

        let newLeg = (Math.abs(decomposedLeg.mult) == 1.0 ? (Math.sign(decomposedLeg.mult) === -1 ? "-" : i === 0 ? "" : "+") :
            decomposedLeg.mult + "*") + decomposedLeg.contract;
        return newLeg;
    });
    // console.log("newLegs=", newLegs);
    return newLegs.join("");
}

/*function test() {
    console.log("test() starting. commoditiesArray=", commoditiesArray);
    console.log("commoditiesArray.length=", commoditiesArray.length);

    commoditiesArray.map(x => x.symbol).forEach(oldSymbol => {
        let barchartSymbol;
        try {
            barchartSymbol = symbolConverter(oldSymbol, "eod", "barchart");
            let ibSymbol = symbolConverter(oldSymbol, "eod", "ib");
            
            let same = barchartSymbol === ibSymbol;
            console.log("barchartSymbol=", barchartSymbol, " ibSymbol=", ibSymbol, "same=", same);
        } catch {
            console.log("error: barchartSymbol=", barchartSymbol);
        }
    });
}*/

function incrementContract(contract, years) {
    let commodity = contractNameDecomposer(contract).commoditySymbol;
    let month = contractNameDecomposer(contract).monthSymbol;
    let year = contractNameDecomposer(contract).year;
    return commodity + (parseInt(year) + years) + month;
}

function decrementSampleContract(contracts) {
    let newSampleContract = contracts.map(contract => incrementContract(contract, -1));
    return newSampleContract;
}

function createContractLists(sampleContract, legs) {
   // console.log("createContractLists() starting. sampleContract=", JSON.parse(JSON.stringify(sampleContract)));
    let contractsArray = [];
    let openContractsArray = [];
    for (let i = 0; i < legs; i++) {
        let commodity = contractNameDecomposer(sampleContract[i]).commoditySymbol;
        let month = contractNameDecomposer(sampleContract[i]).monthSymbol;
        let contracts = Contracts(commodity, month);
        // console.log("contracts=", contracts);

        let openContracts = OpenContracts(commodity, month);
        contractsArray.push(contracts);
        openContractsArray.push(openContracts);
    }
    // console.log("contractsArray=", contractsArray);
    // console.log("openContractsArray=", openContractsArray);
    return { contractsArray: contractsArray, openContractsArray: openContractsArray };
}

function ContractWeightedN_tuplets(sampleContract, list) {
    // console.log("ContractWeightedN_tuplets starting.");
    // console.log("truncated sampleContract=", sampleContract);
    // console.log("list=", list);
    // console.log("openList=", openList);
    let numberOfLegs = sampleContract.length;

    let offset = [];
    for (let i = 0; i < list.length; i++) {
        let tempOffset = 0;
        for (let j = 0; j < list[i].length; j++) {
            //   console.log("list[i].length=" + list[i].length);
            //   console.log(list[i][j] + "   " + sampleContract[i]);
            if (list[i][j] == sampleContract[i])
                break;
            tempOffset++;
        }
        if (tempOffset == list[i].length) {
            tempOffset = 0;
        }
        offset[i] = tempOffset;
        //  console.log("offset[" + i + "]=" + offset[i]);
    }

    let offsetMax = 0;
    let offsetMin = 9999;
    for (let i = 0; i < numberOfLegs; i++) {
        offsetMax = Math.max(offsetMax, offset[i]);
        offsetMin = Math.min(offsetMin, offset[i]);
    }
    // console.log("offsetMax=" + offsetMax + " offsetMin=" + offsetMin);

    // The next loop re-normalizes the offset array.
    let newSampleContract = [];
    for (let i = 0; i < numberOfLegs; i++) {
        newSampleContract.push(list[i][offset[i] - offsetMin]);
        offset[i] = offset[i] - offsetMax;
        //console.log("After renormalization: offsetMax=" + offsetMax + " offset[" + i + "]=" + offset[i]);
    }
    //console.log("newSampleContract=", newSampleContract);

    let maxNumberOfSpreads = 0;
    for (let i = 0; i < numberOfLegs; i++) {
        let numberOfContracts = list[i].length;
        // console.log("numberOfContracts=" + numberOfContracts);
        maxNumberOfSpreads = Math.max(maxNumberOfSpreads, numberOfContracts);
    }
    // console.log("maxNumberOfSpreads=" + maxNumberOfSpreads);

    let returnArray = [];
    for (let j = 0; j < maxNumberOfSpreads; j++) {
        let rowArray = [];
        let save = true;
        for (let i = 0; i < numberOfLegs; i++) {
            let index = j + offset[i];
            // console.log("i=" + i + " j=" + j + " index=" + index + " list=" + list[i][index]);
            if (list[i][index] == undefined && index >= 0) {
                save = false;
            }
            if (index < 0) {
                rowArray[i] = "---------";
            } else {
                rowArray[i] = list[i][index];
            }
        }
        // console.log("rowArray=", rowArray);

        if (save) {
            returnArray.push(rowArray);
        }
    }

    let returnOpenArray = returnArray.filter(arr => {
        //  console.log("arr=", arr);
        let spread = arr.join('/');
        // console.log("spread=", spread);
        if (!spread.includes("-")) {
            let isOpen = isSpreadOpen(spread);
            // console.log("isOpen=", isOpen);

            /*  for (let i = 0; i < numberOfLegs; i++) {
             if (!contracts[i].includes("-") && openList[i].indexOf(contracts[i]) == -1) {
             open = false;
             break;
             }
             }*/
            return isOpen;
        } else {
            return;
        }
    });

    //  console.log("returnOpenArray=", returnOpenArray);
    //  console.log("returnArray=", returnArray);

    let combinedArray = [];
    combinedArray.push(returnArray);
    combinedArray.push(returnOpenArray);
    combinedArray.push(newSampleContract);
    //console.log("newSampleContract=", newSampleContract);
    //  console.log("ContractWeightedN_tuplets done.");
    return { alignerOptions: returnArray, openAlignerOptions: returnOpenArray, sampleContract: newSampleContract };
}

function loadBrowserSideOnlyData(generalForm) {
   // console.log("loadBrowserSideOnlyData() starting.");

    let contractListsObject = createContractLists(generalForm.sampleContract, generalForm.legs);
   // console.log("contractListsObject=", contractListsObject);

    generalForm.browserSideOnly = {};
    generalForm.browserSideOnly.contractLists = contractListsObject.contractsArray;
    generalForm.browserSideOnly.openContractLists = contractListsObject.openContractsArray;

    let alignerOptionsObject = ContractWeightedN_tuplets(generalForm.sampleContract.slice(0, generalForm.legs),
        contractListsObject.contractsArray.slice());
   // console.log("alignerOptionsObject=", alignerOptionsObject);

    generalForm.browserSideOnly.alignerOptions = alignerOptionsObject.alignerOptions;
    generalForm.browserSideOnly.alignerOpenOptions = alignerOptionsObject.openAlignerOptions;

    if (typeof generalForm.browserSideOnly.invertDatesMultiplier === 'undefined') {
        generalForm.browserSideOnly.invertDatesMultiplier = 1;
    }

    if (generalForm.selected.length === 0 && generalForm.instrument === "future") {
        let selected = nearestOpenSpreadOrLatestClosedSpread(generalForm);
       // console.log("selected=", selected);
        generalForm.selected = [selected.value];
    }

    if (typeof generalForm.tickerInput === 'undefined') {
        let invertDatesMultiplier = 1;
        let noLegSwapping = false;
        let includeUnitMoves = true;
        let ticker = spreadTitle(generalForm, invertDatesMultiplier, noLegSwapping, generalForm.symbols, includeUnitMoves).replace(/\s/g, '');
       // console.log("ticker=", ticker);
        generalForm.tickerInput = ticker;
    }
    generalForm.isTickerInputValid = true;
    return generalForm;
}

function isTickerInDatabase(ticker/*, symbols = "eod"*/) {
    // console.log("isTickerInDatabase() starting. ticker=", ticker, " symbols=", symbols);
    try {
        let spread = tickerToGeneralForm(ticker).selected[0];
        // console.log("spread=", spread);
        return isSpreadInDatabase(spread);
    } catch (err) {
        return false;
    }
}

function isSpreadInDatabase(spread/*, symbols = "eod"*/) {
    // console.log("isSpreadInDatabase() starting. spread=", spread, " symbols=", symbols);
    let contracts = spread.replace(/\s/g, '').split('/');
    // console.log("contracts=", contracts);
    let filteredContracts = contracts.filter(function (x) {
        try {
            let commodity = contractNameDecomposer(x).commoditySymbol;
            // console.log("commodity=", commodity);
            if (!Contracts(commodity).includes(x)) {
                // console.log("bad contract.")
                return;
            } else {
                // console.log("OK.")
                return x;
            }
        } catch (err) {
            //  console.log("err=", err);
            console.log("error: ", x, " spread=", spread);
            return;
        }
    });
    //  console.log("filteredContracts=", filteredContracts);

    if (filteredContracts.length === contracts.length) {
        return true;
    } else {
        // console.log("bad contract.");
        return false;
    }
}

function Contracts(commodity, month, symbols = "eod") {
    // console.log("Contracts() starting. commodity=", commodity, "  month=", month, " symbols=", symbols);
    let testCommodity = symbolConverter(commodity, symbols, "eod");
    // console.log("testCommodity=", testCommodity);

    let commodityObject = commoditiesArray.find(x => x.symbol === testCommodity);
    if (typeof commodityObject !== 'undefined') {
        let monthsArray = commodityObject.months;
        let contracts = [];
        if (month !== undefined && month !== null) {
            contracts = monthsArray.find(x => x.symbol === month).contracts.map(x => x.ticker);
        } else {
            // console.log("monthsArray=", monthsArray);
            monthsArray.map(x => x.symbol).forEach(function (month) {
                let monthContracts = monthsArray.find(x => x.symbol === month).contracts.map(x => x.ticker);
                // console.log("monthContracts=", monthContracts);
                contracts = contracts.concat(monthContracts);
            });
        }
        // console.log("contracts=", contracts);

        let returnContracts = ["eod", "old"].includes(symbols) ? contracts : contracts.map(x => {
            // console.log("x=", x);           
            let convertedContract = contractConverter(x, "eod", symbols);
            // console.log("convertedContract=", convertedContract);
            return convertedContract;
        });

        //console.log("returnContracts=", returnContracts);
        return returnContracts;
    } else {
        return [];
    }
}

function ConstrainSampleContract(sampleContract) {
    // console.log("Starting ConstrainSampleContract().");
    // console.log("sampleContract =", sampleContract);
    let newSampleContract = sampleContract.map(contract => {
        let commodity = contractNameDecomposer(contract).commoditySymbol;
        let month = contractNameDecomposer(contract).monthSymbol;
        let contracts = Contracts(commodity, month);
        let openContracts = OpenContracts(commodity, month);
        // console.log("contracts=", contracts);

        let closedContracts = contracts.filter(x => !openContracts.includes(x));
        // console.log("closedContracts=", closedContracts);

        // let newContract = 
        return closedContracts[0];
    });

    /* let numberOfContractsOfSeparation = ContractSeparationCounter(contract[0], contract[1]);
     console.log("numberOfContractsOfSeparation =", numberOfContractsOfSeparation);
     
     let commodity = contractNameDecomposer(contract[0]).commoditySymbol;
     let month = contractNameDecomposer(contract[0]).monthSymbol;
     let year0 = contractNameDecomposer(contract[0]).year;
     
     let index = 0;
     let numberOfMonths = getCommoditiesArray().find(x => x.symbol === commodity).months.length;
     while (Math.abs(numberOfContractsOfSeparation) > numberOfMonths) {
     console.log("numberOfContractsOfSeparation =", numberOfContractsOfSeparation, " year0=", year0);
     if (numberOfContractsOfSeparation >= 0) {
     year0++;
     numberOfContractsOfSeparation = numberOfContractsOfSeparation - numberOfMonths;
     } else {
     year0--;
     numberOfContractsOfSeparation = numberOfContractsOfSeparation + numberOfMonths;
     }
     index++;
     if (index > 1000)
     break;
     }
     let newContract = commodity + year0 + month;
     contract[0] = newContract;
     */
    // console.log("newSampleContract=", newSampleContract);
    return newSampleContract;
}

function intraCommodityArrayTest(array) {
    let intracommodity = true;
    let commodity = contractNameDecomposer(array[0]).commoditySymbol;
    for (let i = 1; i < array.length; i++) {
        let tempCommodity = contractNameDecomposer(array[i]).commoditySymbol;
        if (tempCommodity !== commodity) {
            intracommodity = false;
            break;
        }
    }
    // console.log("intracommodity =", intracommodity);
    return intracommodity;
}

function ContractSeparationCounter(contract1, contract2) {
    // console.log("contract1=", contract1, " contract2=", contract2);
    let cND1 = contractNameDecomposer(contract1);
    let cND2 = contractNameDecomposer(contract2);
    let commodity1 = cND1.commoditySymbol;
    // let commodity2 = cND2.commoditySymbol;
    let month1 = cND1.monthSymbol;
    let month2 = cND2.monthSymbol;
    let year1 = cND1.year;
    let year2 = cND2.year;

    let months = getCommoditiesArray().find(x => x.symbol === commodity1).months.map(x => x.symbol);
    let numberOfMonths = months.length;
    // console.log("months =", months, " numberOfMonths=", numberOfMonths);

    let earlierContract;
    let laterContract;
    let counterSign = 1
    if (year1 < year2) {
        earlierContract = contract1;
        laterContract = contract2;
    } else if (year1 > year2) {
        earlierContract = contract2;
        laterContract = contract1;
        counterSign = -1;
    } else if (month1 < month2) {
        earlierContract = contract1;
        laterContract = contract2;
    } else {
        earlierContract = contract2;
        laterContract = contract1;
        counterSign = -1;
    }
    // console.log("earlierContract =", earlierContract);

    let counter = 0;
    let testContract = earlierContract;
    let testContractMonth = contractNameDecomposer(earlierContract).monthSymbol;
    let testContractMonthIndex = months.indexOf(testContractMonth);
    let testContractYear = contractNameDecomposer(earlierContract).year;
    while (testContract !== laterContract) {
        //  console.log("testContractMonth=", testContractMonth, " testContractMonthIndex=", testContractMonthIndex);
        if (testContractMonthIndex == numberOfMonths - 1) {
            testContractYear++;
            testContractMonthIndex = 0;
        } else {
            testContractMonthIndex++;
        }
        testContractMonth = months[testContractMonthIndex];

        testContract = commodity1 + testContractYear + testContractMonth;
        // console.log("testContract =", testContract);
        counter++;
        if (counter > 300)
            break;
    }
    // console.log("counter =", counter);
    return counterSign * counter;
}

function OpenSpreads(commodity, numberOfContractsApart) {
    let openContracts = OpenContracts(commodity);
    let numberOfMonths = getCommoditiesArray().find(x => x.symbol === commodity).months.length;
    // console.log("openContracts=", openContracts, " numberOfContractsApart=", numberOfContractsApart, " numberOfMonths=", numberOfMonths);
    let spreads = [];
    for (let i = 0; i < numberOfMonths; i++) {
        if (i + numberOfContractsApart < openContracts.length) {
            let spread = parseInt(numberOfContractsApart) === 0 ? "" : "/" + openContracts[i + numberOfContractsApart];
            spread = openContracts[i] + spread;
            // console.log("spread=", spread);
            if (spread !== 'undefined') {
                spreads.push(spread);
            }
        }
    }
    return spreads.sort();
}

function OpenContracts(commodity, month, symbols = "eod") {
    // console.log("OpenContracts() starting. commodity=", commodity, "  month=", month, " symbols=", symbols);
    let testCommodity = ["eod", "old"].includes(symbols) ? commodity : symbolConverter(commodity, symbols, "eod");
    // console.log("testCommodity=", testCommodity);

    let monthsArray = commoditiesArray.find(x => x.symbol === testCommodity).months;
    let contracts = [];
    if (month !== undefined && month !== null) {
        contracts = monthsArray.find(x => x.symbol === month).openContracts.map(x => x.ticker);
        // console.log("contracts=", contracts);
    } else {
        // console.log("monthsArray=", monthsArray);
        monthsArray.map(x => x.symbol).forEach(function (month) {
            let monthContracts = monthsArray.find(x => x.symbol === month).openContracts.map(x => x.ticker);
            // console.log("monthContracts=", monthContracts);
            contracts = contracts.concat(monthContracts);
        });
    }
    let tempContracts = ["eod", "old"].includes(symbols) ? contracts : contracts.map(x => contractConverter(x, "eod", symbols));
    // console.log("tempContracts=", tempContracts);
    let returnContracts = tempContracts.sort();
    // console.log("returnContracts=", returnContracts);
    return returnContracts;
}

function decode(text) {
    //  console.log("main.jsp decode():  text=" + text);
    let decodedText;
    if (text == '%') {
        decodedText = "%";
    } else {
        decodedText = decodeURIComponent(text);
        // console.log("decodedText=" + decodedText);
        // decodedText = decodedText.replace(/2F/g, '/');
        decodedText = decodedText.replace(/\+/g, ' ');
        // console.log("decodedText=" + decodedText);
    }
    return decodedText;
}

function getExpiration(contract) {
    // console.log("getExpiration() starting.");
    let commodity = contractNameDecomposer(contract).commoditySymbol;
    let month = contractNameDecomposer(contract).monthSymbol;
    let contractInCommoditiesObject = getCommoditiesArray().find(x => x.symbol === commodity).months
        .find(x => x.symbol === month).contracts
        .find(x => x.ticker === contract)

    // console.log("contractInCommoditiesObject=", contractInCommoditiesObject);
    return typeof contractInCommoditiesObject !== 'undefined' ? contractInCommoditiesObject.expiration : null;
}

function getSpreadExpiration(spread) {
    //  console.log("spread = ", spread);
    let contracts = spread.replace(/\s/g, '').split('/');
    let expiration = Math.min(...contracts.map(contract => getExpiration(contract)));
    return expiration === 0 ? null : expiration;
}

function spreadTitle(generalForm, invertDatesMultiplier = 1, noLegSwapping = false, symbols, includeUnitMoves = false) {
    // console.log("spreadTitle() starting. includeUnitMoves=", includeUnitMoves);
    let form = JSON.parse(JSON.stringify(generalForm));
   // console.log("form=", form);

    let contract;
    if (form.instrument === "future") {
        if (typeof form.selected !== 'undefined' && form.selected.length > 0 && form.selected[0] !== null) {
            // console.log("form.selected=", form.selected);
            contract = form.selected[0].replace(/\s/g, '').split("/");
        } else {
            contract = form.sampleContract.slice(0, form.legs);
        }
    } else {
        contract = form.stockArray.slice(0, form.legs).map(x => x.split(',')[0].replace(/\s/g, ''));
    }
   // console.log(" contract=", contract);

    let legs = contract.length;
    let mult = form.mult;
    let p = form.p;
    let unitMove = form.unitMove.slice(0, form.legs);
   // console.log("unitMove=", unitMove);

    let sameUnitsAndUnitMoves = form.instrument === "future" ? areSameUnitsAndUnitMoves(contract.join("/")) : true;
    // console.log("sameUnitsAndUnitMoves=", sameUnitsAndUnitMoves);
    let areUnitMovesStandard = form.instrument === "stock" ? true :
        unitMove.every((unitMove, i) => {
            // console.log("contract=", contract[i], " unitMove=", unitMove);

            let standardUnitMove = getUnitMove(contractNameDecomposer(contract[i]).commoditySymbol);
            // console.log("standardUnitMove=", standardUnitMove);

            return unitMove === standardUnitMove;
        });
    // console.log("areUnitMovesStandard=", areUnitMovesStandard);
    includeUnitMoves = includeUnitMoves && (!sameUnitsAndUnitMoves || !areUnitMovesStandard);

    if (p[0] < 0 && noLegSwapping === false) {
        let positivePositionIndex = 0;
        while (p[positivePositionIndex] < 0 && positivePositionIndex < legs) {
            positivePositionIndex++;
        }
        //  console.log("positivePositionIndex=", positivePositionIndex, " invertDatesMultiplier=", invertDatesMultiplier);
        if (positivePositionIndex < legs && invertDatesMultiplier == 1) {
            // console.log("Swapping legs.")
            p[0] = 1;
            p[positivePositionIndex] = -1;

            let temp = contract[0];
            contract[0] = contract[positivePositionIndex];
            contract[positivePositionIndex] = temp;

            temp = mult[0];
            mult[0] = mult[positivePositionIndex];
            mult[positivePositionIndex] = temp;
        } else if (legs !== 1) {
            for (let i = 0; i < legs; i++) {
                p[i] = -1 * p[i];
            }
        }
    }
    // console.log("p=" + p);

    let title = "";
    for (let i = 0; i < legs; i++) {
        // console.log('contractConverter(contract[i], "eod", symbols)=', contractConverter(contract[i], "eod", symbols));
        let displayContract = (symbols === "old" || typeof symbols === "undefined" || form.instrument !== "future") ? contract[i] :
            contractConverter(contract[i], "eod", symbols);
        // console.log("displayContract=" + displayContract);

        let position = "+";
        if (p[i] == -1) {
            position = "-";
        }
        // console.log("position=" + position);

        if (mult[i] == 1) {
            title = title + position + (i === 0 ? "" : " ") + displayContract + (includeUnitMoves && unitMove[i] !== 1 ? "*" + unitMove[i] : "") + " ";
        } else {
            title = title + position + (i === 0 ? "" : " ") + mult[i] + "*" + displayContract + (includeUnitMoves && unitMove[i] !== 1 ? "*" + unitMove[i] : "") + " ";
        }
    }
    // console.log(title[0]);
    if (title[0] === '+') {
        title = title.substr(1);
    }
    //console.log("title=", title);
    return title.trim();
}

function spreadTitleLegs(generalForm, invertDatesMultiplier = 1, noLegSwapping = false, symbols, includeUnitMoves = false) {
    // console.log("spreadTitleLegs() starting. symbols=", symbols);
    // console.trace();
    let form = JSON.parse(JSON.stringify(generalForm));
    // console.log("form=", form);

    let contract;
    if (form.instrument === "future") {
        if (typeof form.selected !== 'undefined' && form.selected.length > 0) {
            contract = form.selected[0].split("/");
        } else {
            return null;
        }
    } else {
        contract = form.stockArray.slice(0, form.legs).map(x => x.split(',')[0].replace(/\s/g, ''));
    }
    // console.log("contract=", contract);

    let legs = contract.length;

    let mult = form.mult;
    let p = form.p;
    let unitMove = form.unitMove.slice(0, form.legs);
    //  console.log("unitMove=", unitMove);  
    let sameUnitsAndUnitMoves = areSameUnitsAndUnitMoves(form.sampleContract.slice(0, form.legs).join("/"));
    //  console.log("sameUnitsAndUnitMoves=", sameUnitsAndUnitMoves);
    let areUnitMovesStandard = unitMove.every((x, i) => x === getUnitMove(contractNameDecomposer(form.sampleContract[i]).commoditySymbol));
    //  console.log("areUnitMovesStandard=", areUnitMovesStandard);

    includeUnitMoves = includeUnitMoves && (!sameUnitsAndUnitMoves || !areUnitMovesStandard);
    //  console.log("includeUnitMoves=", includeUnitMoves);

    // let allSameUnitMoves = unitMove.every(x => x === unitMove[0]);
    // includeUnitMoves = includeUnitMoves && !allSameUnitMoves;

    if (p[0] < 0 && noLegSwapping === false) {
        let positivePositionIndex = 0;
        while (p[positivePositionIndex] < 0 && positivePositionIndex < legs) {
            positivePositionIndex++;
        }
        //  console.log("positivePositionIndex=", positivePositionIndex, " invertDatesMultiplier=", invertDatesMultiplier);
        if (positivePositionIndex < legs && invertDatesMultiplier == 1) {
            // console.log("Swapping legs.")
            p[0] = 1;
            p[positivePositionIndex] = -1;

            let temp = contract[0];
            contract[0] = contract[positivePositionIndex];
            contract[positivePositionIndex] = temp;

            temp = mult[0];
            mult[0] = mult[positivePositionIndex];
            mult[positivePositionIndex] = temp;
        } else if (legs !== 1) {
            for (let i = 0; i < legs; i++) {
                p[i] = -1 * p[i];
            }
        }
    }
    //console.log("p=" + p);

    // let title = "";
    let tickerLegs = [];
    for (let i = 0; i < legs; i++) {
        let displayContract = (symbols === "old" || typeof symbols === "undefined") ? contract[i] :
            contractConverter(contract[i], "eod", symbols);
        // console.log("displayContract=", displayContract);
        if (contract[i].indexOf("--") === -1) {
            let position = "+";
            if (p[i] == -1) {
                position = "-";
            }
            // console.log("position=" + position);

            if (mult[i] == 1) {
                tickerLegs[i] = position + (i === 0 ? "" : " ") + displayContract + (includeUnitMoves ? "*" + unitMove[i] : "") + " ";
            } else {
                tickerLegs[i] = position + (i === 0 ? "" : " ") + mult[i] + "*" + displayContract + (includeUnitMoves ? "*" + unitMove[i] : "") + " ";
            }
        } else {
            tickerLegs[i] = displayContract;
        }
    }
    // console.log(title[0]);
    /*   if (title[0] === '+') {
     title = title.substr(1);
     }*/
    //  console.log("tickerLegs=" + tickerLegs);
    return tickerLegs;
}

function FrontMonthContract(commodity) {
    let contracts = OpenContracts(commodity);
    return contracts[0];
}

function omit(obj, omitKey) {
    return Object.keys(obj).reduce((result, key) => {
        if (key !== omitKey) {
            result[key] = obj[key];
        }
        return result;
    }, {});
}

function commodityName(symbol) {
    return commoditiesArray.find(x => x.symbol === symbol).name;
}

function commodityMonths(commodity) {
    return getCommoditiesArray().find(x => x.symbol === commodity).months.map(x => x.symbol);
}

function contractDigits(contract, instrument = "future") {
    //console.log("contract=" + contract);
    let digits;
    if (instrument == "future") {
        let commodity = contractNameDecomposer(contract).commoditySymbol;
        // console.log("commoditySymbol=" + commoditySymbol);
        digits = getCommoditiesArray().find(x => x.symbol === commodity).digits;
    } else {
        digits = 2;
    }
    return digits;
}

function spreadDigits(spread, instrument = "future", symbols) {
   // console.log("spreadDigits() starting. instrument=", instrument);
    let digits;
    if (instrument !== "future") {
        digits = 2;
    } else {
        let sameUnitsAndUnitMoves = areSameUnitsAndUnitMoves(spread, symbols);
        // console.log("sameUnitsAndUnitMoves =", sameUnitsAndUnitMoves);
        if (sameUnitsAndUnitMoves) {
            let contracts = spread.replace(/\s/g, '').split('/');
            digits = contractDigits(contracts[0]);
        } else {
            digits = 2;
        }
    }
    return digits;
}

function heightControl(operation, chart) {
    // console.log("am4charts.heightControl() starting.");
    //  console.log("operation=", operation);
    let height = $("#chartDiv").height();
    // console.log("height before adding axis=", height);

    let nominalNumberOfAxes = 0.13 * chart.yAxes.length + 3.5;
    let shim = 0.68;
    // console.log("nominalNumberOfAxes=", nominalNumberOfAxes);

    if (operation === "adding") {
        $("#chartDiv").height(height * (nominalNumberOfAxes + shim) / (nominalNumberOfAxes));
        // console.log("height after adding axis=", $("#chartDiv").height());
        let axisPercentage = 100 / (nominalNumberOfAxes);
        //  console.log("axisPercentage=", axisPercentage);
        return axisPercentage;
    } else {
        $("#chartDiv").height(height * (nominalNumberOfAxes) / (nominalNumberOfAxes + shim));
        //  console.log("height after adding axis=", $("#chartDiv").height());
    }
}

function removeNaNs(array, valueFieldName) {
    // console.log("removeNaNs() starting."); // This also removes weekends and days without data.
    //  console.log("valueFieldName=", valueFieldName);
    // console.log("array=", array);
    let fields = Object.keys(array[0]);
    //  console.log("fields=", fields);
    if (typeof valueFieldName === 'undefined' || fields.indexOf(valueFieldName) === -1) {
        valueFieldName = "close";
    }
    // console.log("valueFieldName=", valueFieldName);

    let returnArray = array.filter(x => !isNaN(x[valueFieldName]));
    //  let nAnArray = array.filter(x => isNaN(x[valueFieldName]));
    // console.log("nAnArray=", nAnArray);
    // console.log("returnArray=", returnArray);
    return returnArray;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getFND(contract) {
    // console.log("contract = ", contract);
    let commodity = contractNameDecomposer(contract).commoditySymbol;
    let month = contractNameDecomposer(contract).monthSymbol;
    let contractObject = getCommoditiesArray().find(x => x.symbol === commodity).months
        .find(x => x.symbol === month).contracts
        .find(x => x.ticker === contract)

    // console.log("contractObject = ", contractObject);
    let contractFND;
    if (typeof contractObject !== 'undefined') {
        contractFND = contractObject.fnd;
        // console.log("contractFND = ", contractFND);
    }
    return contractFND;
}

function getSpreadFND(spread) {
    // console.log("getSpreadFND() starting. spread=", spread);
    let contracts = spread.replace(/\s/g, '').split('/');
    return Math.min(...contracts.map(contract => getFND(contract)));
}

function tickerToGeneralForm(ticker, symbols = "old") {
    // console.log("tickerToGeneralForm() starting. ticker=", ticker, " symbols=", symbols);
    // console.trace();
    let formmattedTicker = ticker.replace(/\s/g, '');
    // console.log("formmattedTicker=", formmattedTicker);

    let tickerLegs = formmattedTicker.split(/[+-]/);
    //  console.log("tickerLegs=", tickerLegs);
    if (tickerLegs[0] === '') {
        tickerLegs.shift();
    }
    // console.log("tickerLegs=", tickerLegs);

    let legs = tickerLegs.length;

    let tickerLegObjects = tickerLegs.map((x, i) => tickerLegDecomposer(x, i, legs));
    // console.log("tickerLegObjects=", tickerLegObjects);
    if (tickerLegObjects.some(x => x === "incomplete_ticker_leg")) {
        return;
    }

    let mult = Object.assign([1, 1, 1, 1], tickerLegObjects.map(x => x.mult));
    // console.log("mult=", mult);

    let arr = [...ticker].filter(x => ['-', '+'].includes(x));
    //  console.log("arr=", arr);
    if (arr.length < legs) {
        arr.unshift('+');
    }
    let p = Object.assign([1, 1, 1, 1], arr.map(x => x === '+' ? 1 : -1));
    // console.log("p=", p);

    let generalForm = {};
    generalForm.legs = legs;
    generalForm.mult = mult;
    generalForm.p = p;
    let selected = [tickerLegObjects.map(x => symbols === "old" ? x.contract : contractConverter(x.contract, symbols, "eod")).join('/')];
    // console.log("selected=", selected);

    generalForm.selected = selected;
    // console.log("arr=", arr);

    let contracts = generalForm.selected[0].split('/');
    // console.log("contracts=", contracts);
    let commodity = contractNameDecomposer(contracts[0]).commoditySymbol;
    //  console.log("commodity=", commodity);

    let openContracts = OpenContracts(commodity).filter(x => !contracts.includes(x)).sort();
    // console.log("openContracts=", openContracts);
    let contractsForPadding = openContracts.slice(contracts.length, 4);
    // console.log("contractsForPadding=", contractsForPadding);
    generalForm.sampleContract = [...contracts, ...contractsForPadding];

    let test = Array(legs).fill(getUnitMove(commodity));
    // console.log("test=", test);

    let unitMove = legs === 1 ? [getUnitMove(commodity)] : areSameUnitsAndUnitMoves(selected[0]) ? test : tickerLegObjects.map(x => x.unitMove);
    // console.log("unitMove=", unitMove);
    let unitMoveForPadding = contractsForPadding.map(contract => getUnitMove(contractNameDecomposer(contract).commoditySymbol));
    // console.log("unitMoveForPadding=", unitMoveForPadding);
    generalForm.unitMove = [...unitMove, ...unitMoveForPadding];

    // console.log("generalForm=", generalForm);
    return generalForm;
}

function getExchange(commodity) {
    let group = getGroup(commodity);
    // console.log("group=", group);

    switch (group) {
        case "Grains":
            if (commodity == "KW") {
                return "KCBT";
            }
            if (commodity == "MW") {
                return "MGEX";
            } else {
                return "CBOT";
            }
        case "Energies":
            return "NYMEX";
        case "Metals":
            if (["PA", "PL"].includes(commodity)) {
                return "NYMEX";
            } else {
                return "COMEX";
            }
        case "Interest Rates":
            if (commodity == "ED") {
                return "CME";
            } else {
                return "CBOT";
            }
        case "Currencies":
            if (["EC", "DX"].includes(commodity)) {
                return "ICEUS";
            } else {
                return "CME";
            }
        case "Softs and Fibers":
            if (commodity == "SW") {
                return "LCE";
            }
            if (["CB", "LB"].includes(commodity)) {
                return "CME";
            } else {
                return "ICEUS";
            }
        case "Indices":
            if (commodity == "VX") {
                return "CFE";
            }
            if (["NQ", "SP"].includes(commodity)) {
                return "GBLX";
            } else {
                return "CBOTM";
            }
        case "Meats":
            return "CME";
    }
}

function isContractOpen(contract) {
    let commodity = contractNameDecomposer(contract).commoditySymbol;
    let month = contractNameDecomposer(contract).monthSymbol;
    return OpenContracts(commodity, month).includes(contract);
}

function isSpreadOpen(spread) {
    // console.log("isSpreadOpen() starting. spread=", spread);
    if (spread === "seasonal") {
        return false;
    } else {
        let contracts = spread.replace(/\s/g, '').split('+').join('/').split('-').join('/').split('/');
        // console.log("contracts=", contracts);
        return !contracts.some(x => !isContractOpen(x));
    }
}

let groupsObject = {
    "Currencies": { "commodities": ["AD", "BP", "CD", "EC", "JY", "SF", "DX"], "name": "Currencies" },
    "Energies": { "commodities": ["B", "CL", "GO", "RB", "HO", "NG"], "name": "Energies" },
    "Grains": { "commodities": ["C", "KW", "MW", "O", "SM", "BO", "S", "W", "RR"], "name": "Grains" },
    "Indices": { "commodities": ["YM", "NQ", "ES", "VX"], "name": "Indices" },
    "Interest Rates": { "commodities": ["TY", "TU", "US", "FV", "ED", "ZQ", "SR"], "name": "Interest Rates" },
    "Meats": { "commodities": ["FC", "LH", "LC"], "name": "Meats" },
    "Metals": { "commodities": ["HG", "GC", "PA", "PL", "SI"], "name": "Metals" },
    "Softs and Fibers": { "commodities": ["CB", "CSC", "DC", "CC", "KC", "CT", "LB", "OJ", "RC", "SB", "SW"], "name": "Softs and Fibers" }
};

function getGroup(commodity) {
    let returnGroup = "";
    let groups = Object.keys(groupsObject);
    groups.forEach(function (group) {
        let commodities = groupsObject[group].commodities;
        // console.log(group + ": " + commodities);
        let isInGroup = commodities.includes(commodity);
        if (isInGroup) {
            returnGroup = group;
        }

    });
    return returnGroup;
}

function contractUnits(contract) {
    // console.log("contractUnits() starting. contract=" + contract);
    let commodity = contractNameDecomposer(contract).commoditySymbol;
    return getCommoditiesArray().find(x => x.symbol === commodity).units;
}

function spreadUnits(spread, instrument = "future", symbols = "old") {
    // console.log("spreadUnits() starting. spread=" + spread);
    let units;
    if (instrument !== "future") {
        units = "USD";
    } else {
        let sameUnitsAndUnitMoves = areSameUnitsAndUnitMoves(spread, symbols);
        // console.log("sameUnitsAndUnitMoves =", sameUnitsAndUnitMoves);
        if (sameUnitsAndUnitMoves) {
            let contracts = spread.replace(/\s/g, '').split('/');
            units = contractUnits(contracts[0]);
        } else {
            units = "USD";
        }
    }
    return units;
}

function getDaysArray(start, end, timePeriod) {
    console.log("start=", start, " end=", end, " timePeriod=", timePeriod);
    let arr = [];
    for (let dt = moment(start).add(-1, timePeriod); dt <= end; dt.add(1, timePeriod)) {
        arr.push(moment(dt));
    }
    return arr;
}

function getBarchartMultsAndPositionsArray(legs, spreadP = 1) {
    console.log("getBarchartMultsAndPositionsArray() starting. spreadP=", spreadP);
    // console.log("barchartMultsAndPositionsMatrix =", barchartMultsAndPositionsMatrix);
    let barchartMultsAndPositionsMatrix = [
        { legs: 1, p: [1, -1, 1, 1], mult: [1, 1, 1, 1] },
        { legs: 2, p: [1, -1, 1, 1], mult: [1, 1, 1, 1] },
        { legs: 3, p: [1, -1, 1, 1], mult: [1, 2, 1, 1] },
        { legs: 4, p: [1, -1, -1, 1], mult: [1, 1, 1, 1] }
    ];

    let barchartMultsAndPositionsArray = barchartMultsAndPositionsMatrix.find(x => x.legs === legs);
    console.log("barchartMultsAndPositionsArray=", barchartMultsAndPositionsArray);
    barchartMultsAndPositionsArray.p.forEach((p, index, arr) => {
        arr[index] = p * spreadP;
        console.log("p=", p, "arr=", arr);
    });
    console.log("barchartMultsAndPositionsArray=", barchartMultsAndPositionsArray);
    return barchartMultsAndPositionsArray;
}

function hexToRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function transpose(a) {
    return Object.keys(a[0]).map(function (c) {
        return a.map(function (r) {
            return r[c];
        });
    });
}

function orderContracts(contract1, contract2) {
    // console.log("orderContracts() starting. contract1=", contract1, " contract2=", contract2);
    let cND = contractNameDecomposer(contract1);
    let month1 = cND.monthSymbol;
    let month2 = contractNameDecomposer(contract2).monthSymbol;
    let year1 = cND.year;
    let year2 = contractNameDecomposer(contract2).year;

    let earlierContract;
    let laterContract;
    if (year1 < year2) {
        earlierContract = contract1;
        laterContract = contract2;
    } else if (year1 > year2) {
        earlierContract = contract2;
        laterContract = contract1;
    } else if (month1 < month2) {
        earlierContract = contract1;
        laterContract = contract2;
    } else {
        earlierContract = contract2;
        laterContract = contract1;
    }
    return [earlierContract, laterContract];
}

const kebabize = str => {
    return str.split('').map((letter, idx) => {
        return letter.toUpperCase() === letter
            ? `${idx !== 0 ? '-' : ''}${letter.toLowerCase()}`
            : letter;
    }).join('');
}

function bfs(tree, key, collection) {
    if (!tree[key] || tree[key].length === 0)
        return;
    for (var i = 0; i < tree[key].length; i++) {
        var child = tree[key][i]
        collection[child.id] = child;
        bfs(child, key, collection);
    }
    return;
}

function monthToColor(month) {
    let colors = {
        F: "#FFD700",
        G: "#FFA500",
        H: "#D2691E",
        J: "#FF0000",
        K: "#FF1493",
        M: "#800080",
        N: "#8A2BE2",
        Q: "#0000FF",
        U: "#1E90FF",
        V: "#00CED1",
        X: "#008080",
        Z: "#9ACD32"
    };
    return colors[month];
}

function yearToColor(year) {
    let colors = ["#0000FF", "#1E90FF", "#00CED1", "#008080", "#9ACD32", "#FFA500", "#D2691E", "#FF0000", "#800080", "#8A2BE2"];

    let yearString = String(year);
    // console.log("yearString=", yearString);

    let currentYear = moment().format("YYYY");
    // console.log("currentYear=", currentYear);

    let lastDigitOfYear = yearString.substring(3);
    let lastDigitOfCurrentYear = currentYear.substring(3);
    // console.log("lastDigitOfYear=", lastDigitOfYear, " lastDigitOfCurrentYear=", lastDigitOfCurrentYear);

    let index = lastDigitOfYear - lastDigitOfCurrentYear - 3;
    if (index < 0) {
        index = index + 10;
    }

    return colors[index];
}

function spreadToColor(spread) {
    //.console.log("spreadToColor() starting. spread=", spread);
    if (spread === "seasonal") {
        return "black";
    } else {
        let contract = spread.replace(/\s/g, '').split('/')[0];
        // console.log("contract=", contract);

        let year = contractNameDecomposer(contract).year;
        // console.log("year=", year);
        return yearToColor(year);
    }
}

function changeCommodityLeg(commodity, index, generalForm) {
   // console.log("changeCommodityLeg() starting. commodity=", commodity, " index=", index, " generalForm=", JSON.parse(JSON.stringify(generalForm)));
    let months = getCommoditiesArray().find(x => x.symbol === commodity).months.map(x => x.symbol);
    // console.log("months =", months);
    let year = contractNameDecomposer(generalForm.sampleContract[0]).year;
    let newUnitMove = getCommoditiesArray().find(x => x.symbol === commodity).unitMove;
    //  console.log("year =", year);
    //  console.log("newUnitMove =", newUnitMove);

    let newSampleContractArray = [];
    let newUnitMoveArray = [];
    let newContract;
   // console.log("generalForm.intracommodity =", generalForm.intracommodity);
    if (JSON.parse(generalForm.intracommodity) === false) {
        newSampleContractArray = generalForm.sampleContract.slice(0);
        newContract = commodity + year + months[index];
        // console.log("newContract =", newContract);
        if (!isSpreadInDatabase(newContract)) {
            newContract = decrementSampleContract([newContract])[0];
        }
        //  console.log("newContract =", newContract);
        newSampleContractArray[index] = newContract;

        if (typeof generalForm.unitMove !== 'undefined') {
            newUnitMoveArray = generalForm.unitMove.slice(0);
        } else {
            newUnitMoveArray = newSampleContractArray.slice(0).map(x => getUnitMove(contractNameDecomposer(x).commoditySymbol));
        }
        newUnitMoveArray[index] = newUnitMove;
    } else {
        let currentCommodity = contractNameDecomposer(generalForm.sampleContract[0]).commoditySymbol;
        // console.log("currentCommodity =", currentCommodity);
        let startIndex;
        if (currentCommodity === commodity) {
            let allContracts = allCommodityContracts(commodity);
            let listIndex = allContracts.indexOf(generalForm.sampleContract[0]);
            newSampleContractArray = allContracts.slice(listIndex, listIndex + 4);
           // console.log("newSampleContractArray=", newSampleContractArray);

            if (newSampleContractArray.length < 4) {
                listIndex = allContracts.indexOf(incrementContract(generalForm.sampleContract[0], -1));
                newSampleContractArray = allContracts.slice(listIndex, listIndex + 4);
               // console.log("newSampleContractArray=", newSampleContractArray);
            }

        } else {
            startIndex = 0;
        }
        //console.log("startIndex =", startIndex);

        for (let i = startIndex; i < 4; i++) {
            newContract = commodity + year + months[i];
            if (!isSpreadInDatabase(newContract)) {
                newContract = decrementSampleContract([newContract])[0];
            }
            // console.log("newContract =", newContract);
            newSampleContractArray.push(newContract);
        }
        newUnitMoveArray = newSampleContractArray.slice(0).map(x => getUnitMove(contractNameDecomposer(x).commoditySymbol));
    }
   // console.log("newSampleContractArray =", newSampleContractArray);
   // console.log("newUnitMoveArray =", newUnitMoveArray);
    generalForm.sampleContract = newSampleContractArray;
    generalForm.unitMove = newUnitMoveArray;
    generalForm.selected = [];
    if (generalForm.program !== "Search") {
        generalForm.numberOfContractsApart = 0;
    }
    generalForm.constrainSampleContract = false;
   // generalForm.zoomToSavedCoordinates = false;

    // delete generalForm.chartParameters.indicatorData;
    return generalForm;
}

function allCommodityContracts(commodity) {
    let months = getCommoditiesArray().find(x => x.symbol === commodity).months;
    let allContracts = months.reduce((arr, month) => {
        arr.push(...month.contracts.map(x => x.ticker));
        return arr;
    }, []).sort();
    //  console.log("allContracts=", allContracts);
    return allContracts;
}

function nearestOpenSpreadOrLatestClosedSpread(generalForm) {
   // console.log("nearestOpenSpreadOrLatestClosedSpread() starting.");
    let openTickers = listOpenTickerOptions(generalForm);
    if (openTickers.length > 0) {
        return openTickers[openTickers.length - 1];
    } else {
        return listTickerOptions(generalForm)[0];
    }
}

function nearestOpenSpread(generalForm) {
    // console.log("nearestOpenSpread() starting. generalForm.selected=", generalForm.selected);
    let openTickers = listOpenTickerOptions(generalForm);
    console.log("openTickers =", openTickers);
        if (openTickers.length > 0) {
        return openTickers[openTickers.length - 1];
    } else {
        return { value: null, text: "no open spreads" };
    }
}

function listTickerOptions(generalForm, symbols, includeUnitMoves = false) {
    // console.log("listTickerOptions() starting. generalForm.selected=", generalForm.selected);

    return listOptions(generalForm).map(x => {
        // console.log("x=", x);
        generalForm.selected = [x.value];
        let invertDatesMultiplier = 1;
        let noLegSwapping = true;
        let ticker = spreadTitle(JSON.parse(JSON.stringify(generalForm)), invertDatesMultiplier, noLegSwapping, symbols, includeUnitMoves);
        // console.log("ticker=", ticker);
        return { value: x.value, text: ticker };
    });
}

function listOpenTickerOptions(form, symbols = "old", includeUnitMoves = true) {
    // console.log("listOpenTickerOptions() starting. form.selected=", form.selected);
    let generalForm = JSON.parse(JSON.stringify(form));
    return listOptions(generalForm).filter(x => x.open).map(x => {
        // console.log("x=", x);
        generalForm.selected = [x.value];
        let invertDatesMultiplier = 1;
        let noLegSwapping = true;
        let ticker = spreadTitle(JSON.parse(JSON.stringify(generalForm)), invertDatesMultiplier, noLegSwapping, symbols, includeUnitMoves);
        // console.log("ticker=", ticker);
        return { value: x.value, text: ticker };
    });
}

function listClosedTickerOptions(generalForm, symbols = "old", includeUnitMoves = true) {
    //  console.log("listClosedTickerOptions() starting. generalForm=", generalForm");

    return listOptions(generalForm).filter(x => !x.open).map(x => {
        // console.log("x=", x);
        generalForm.selected = [x.value];
        let invertDatesMultiplier = 1;
        let noLegSwapping = true;
        let ticker = spreadTitle(JSON.parse(JSON.stringify(generalForm)), invertDatesMultiplier, noLegSwapping, symbols, includeUnitMoves);
        // console.log("ticker=", ticker);

        return { value: x.value, text: ticker };
    });
}

function listOptions(generalForm) {
   // console.log("listOptions() starting. generalForm=", JSON.parse(JSON.stringify(generalForm)));
    let returnArray = [];
    // let alignerOpenOptions = state.browserSideOnly.alignerOpenOptions;
    //  console.log("alignerOpenOptions=", alignerOpenOptions)

    let alignerOpenSpreads = generalForm.browserSideOnly.alignerOpenOptions.map(x => x.join('/'));
   // console.log("alignerOpenSpreads=", alignerOpenSpreads)

    generalForm.browserSideOnly.alignerOptions.forEach(optionArray => {
        let optionSpread = optionArray.join('/');
        // console.log("optionSpread=", optionSpread)
        if (optionSpread.indexOf("-") == -1) {
            // console.log("optionArray=", optionArray)
            let open = alignerOpenSpreads.includes(optionSpread); /*&& ["seasonal", "history"].includes(state.study); */
            returnArray.push({ value: optionSpread, open: open });
        }
    });
    return returnArray;
}

function programCompositionArray(role) {
    let returnarray = [
        { input: openSpreadsInput, initialState: openSpreadsInitialState, value: 'OpenSpreads', text: 'Open Spreads' },
        { input: stockChartInput, initialState: stockChartInitialState, value: 'StockCharts', text: 'Stock Charts' },
        { input: calculatorInput, initialState: calculatorInitialState, value: 'Calculator', text: 'Calculator' },
        { input: forwardCurvesInput, initialState: forwardCurvesInitialState, value: 'ForwardCurves', text: 'Forward Curves' },
        { input: searchInput, initialState: searchInitialState, value: 'Search', text: 'Search' },
        { input: tradeMapsInput, initialState: tradeMapsInitialState, value: 'TradeMaps', text: 'Trade Maps' },
        { input: longTermChartsInput, initialState: longTermChartsInitialState, value: 'LongTermCharts', text: 'Long Term Charts' },
        { input: stackedChartsInput, initialState: stackedChartsInitialState, value: 'StackedCharts', text: 'Stacked Charts' },
        { input: historyInput, initialState: historyInitialState, value: 'History', text: 'History' },
        { input: portfolioInput, initialState: portfolioInitialState, value: 'Portfolio', text: 'Portfolio' },
        { input: quotesInput, initialState: quotesInitialState, value: 'Quotes', text: 'Quotes' },
        { input: basicChartInputNew, initialState: basicChartInitialStateNew, value: 'BasicChartsNew', text: 'Futures Charts' }];

    if (['admin', 'superadmin'].includes(role)) {
        returnarray.push({ input: spreadCoverageInput, initialState: spreadCoverageInitialState, value: 'SpreadCoverage', text: 'Spread Coverage' });
        // returnarray.push({ input: timeSeriesInput, initialState: timeSeriesChartInitialState, value: 'TimeSeriesCharts', text: 'Time Series Charts' });
        returnarray.push({ input: firestoreSearchInput, initialState: firestoreSearchInitialState, value: 'FirestoreSearch', text: 'Firestore Search' });
        returnarray.push({ input: watchListInput, initialState: watchListInitialState, value: 'WatchList', text: 'Watch List' });
        returnarray.push({ input: tradeExplorerInput, initialState: tradeExplorerInitialState, value: 'TradeExplorer', text: 'Trade Explorer' });
        returnarray.push({ input: savedChartsAdminInput, initialState: savedChartsAdminInitialState, value: 'SavedChartsAdmin', text: 'Saved Charts Admin' });
       // returnarray.push({ input: searchNewInput, initialState: searchNewInitialState, value: 'SearchNew', text: 'Search New' });
       // returnarray.push({ input: basicChartInputTest, initialState: basicChartInitialStateTest, value: 'BasicChartsTest', text: 'Futures Charts Test' });
    }
    return returnarray.sort((a, b) => (a.text > b.text) ? 1 : -1);
}

function getProgramComposition(program, role) {
   // console.log("program=", program, " role=", role);
    // console.trace();
    if(program !== "" && program !== null){
    // console.log("programCompositionArray(role)=", programCompositionArray(role));
    let returnObject = programCompositionArray(role).find(x => x.value === program);
   // console.log("returnObject=", JSON.parse(JSON.stringify(returnObject)));
    return returnObject;
    }else{
        return { input: null, initialState: null, value: null, text: 'Get Started' };
    }
}

let storeTab = _.debounce(function (form, email) {
    console.log("storeTab() starting. email=", email);
    // console.trace();
    // console.log("this.activeModuleJson=", this.activeModuleJson);
    // console.log("this.activeModuleName=", this.activeModuleName);
    bus.$emit("setChartHeight");

    let generalForm = JSON.parse(JSON.stringify(form));
    if (generalForm !== null) {
        delete generalForm.playback;
        delete generalForm.chartParameters.levels;
       // console.log("generalForm=", generalForm);
        // console.log("generalForm.moduleName=", generalForm.moduleName);

        store.dispatch('user/updateInitializingState', generalForm);

        delete generalForm.browserSideOnly;
        if (typeof generalForm.moduleName !== "undefined") {
            fb.db
                .collection("tabs")
                .doc(email)
                .collection("tabs")
                .doc(generalForm.moduleName)
                .set(generalForm)
                .then(() => console.log("tab saved."));

            fb.db
                .collection("tabs")
                .doc(email)
                .collection("activeModuleName")
                .doc("activeModuleName-document")
                .set({ "activeModuleName": generalForm.moduleName })
                .then(() => {
                    // console.log("activeModuleName saved.");
                });
        }
    }
}, 2100);

/*function waitForElm(selector) {
    console.log("waitForElm() starting. selector=", selector);
    return new Promise(resolve => {
        const interval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(interval);
                resolve(element);
            }
        }, 100);
    });
}*/

function enumerateDaysBetweenDates(startDate, endDate) {
    var now = startDate.clone(), dates = [];

    while (now.isSameOrBefore(endDate)) {
        dates.push(now.format('YYYYMMDD'));
        now.add(1, 'days');
    }
    return dates;
}

function displayMoneyFormat(number) {
    // console.log("number=", number);
    let returnValue;
    if (isNaN(number) || null == number) {
        // console.log("missing data.");
        returnValue = "------\u00A0\u00A0\u00A0 ";
    } else {
        returnValue = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(number);
    }
    // console.log("returnValue=", returnValue);
    return returnValue;
}

function transformLegacyState(state) {
   // console.log("transformLegacyState() starting.");
   if (state.program === "LongTermCharts" && state.aligned === true) {
        state.program = "StackedCharts";
        state.seasonalSelectionMode = "custom";
        state.truncate = 10;
    }
   // console.log("state=", state);
    return state;
}

export {
    areSameUnits, areSameUnitMoves, areSameUnitsAndUnitMoves, commodityUnits, contractNameDecomposer, isContract, tickerLegDecomposer,
    getUnitMove, incrementContract, decrementSampleContract, ContractWeightedN_tuplets,
    isSpreadInDatabase, isTickerInDatabase, ConstrainSampleContract, intraCommodityArrayTest, ContractSeparationCounter,
    Contracts, OpenContracts, OpenSpreads, setCommoditiesArray, getCommoditiesArray, decode, getSpreadExpiration, spreadTitle,
    spreadTitleLegs, FrontMonthContract, omit, commodityName, spreadDigits, heightControl, removeNaNs, capitalizeFirstLetter,
    getSpreadFND, tickerToGeneralForm, getExchange, spreadUnits, isSpreadOpen, getDaysArray, getBarchartMultsAndPositionsArray,
    hexToRgb, commodityMonths, transpose, orderContracts, kebabize,
    bfs, contractDigits, groupsObject, getGroup, yearToColor, spreadToColor, monthToColor, changeCommodityLeg, allCommodityContracts,
    createContractLists, listOptions, listTickerOptions, listOpenTickerOptions, listClosedTickerOptions, nearestOpenSpread,
    nearestOpenSpreadOrLatestClosedSpread, getProgramComposition, programCompositionArray, storeTab, displayCommodity, difference,
    inspect, compareContracts, isCommodity, symbolConverter, tickerConverter, getSymbolArray, symbolArray,
    contractConverter, getSymbolSetsOfCompleteContractName, getSymbolSetsOfCompleteTicker, enumerateDaysBetweenDates,
    loadBrowserSideOnlyData, displayMoneyFormat, transformLegacyState
};
