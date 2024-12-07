import browserSideOnly from "./browserSideOnlyModule";
import chartParameters from "./chartParametersModule";
import search from "./searchModule";
import portfolio from "./portfolioModule";

import { searchInitialState } from "@/components/programs/Search/search-initial-state";

import moment from 'moment';
import _ from "lodash";

import {ConstrainSampleContract, decrementSampleContract, contractNameDecomposer,
        ContractWeightedN_tuplets, nearestOpenSpreadOrLatestClosedSpread,
        getGroup, spreadTitle, changeCommodityLeg, listOptions, loadBrowserSideOnlyData} from "@/js/main";

export default {
    namespaced: true,
    modules: {
        browserSideOnly, chartParameters, search, portfolio
    },

    // State must be a function so we can re-use this module across multiple routes
    state: () => ({
            moduleName: null,
            instrument: null,
            legs: null,
            sampleContract: [],
            unitMove: [],
            selected: [],
            customSelected: [],
            intracommodity: null,
            p: [],
            mult: [],
            y1: 15,
            yearOptionsLength: null,
            generator: null,
            program: null,
            stockGraphType: null,
            seasonals: [],
            dataSource: null,
            spreadP: 1,
            spreadMult: 1,
            stockArray: [],
            loading: false,
            addRSIPanel: null,
            rsiPeriod: null,
            addCCIPanel: null,
            cciPeriod: null,
            cciSource: null,
            addMACDPanel: null,
            addATRPanel: null,
            addBollinger: null,
            bollingerPeriod: null,
            addSMA: null,
            addEMA: null,
            smaLength: null,
            emaLength: null,
            addVolumePanel: null,
            showBullets: null,
            addCOTPanel: null,
            addVolumeProfile: null,
            volumeProfileColumns: null,
            showTradingPeriod: null,
            showPlaybackControl: null,
            showBreakpoints: null,
            show3D: null,
            showCalculatorChart: true,
            addProfitLoss: null,
            addHorizontalLine: null,
            open: null,
            close: null,
            study: null,
            tabTitle: null,
            manualTabTitle: null,
            hideInput: false,
            barchartTicker: null,
            truncate: null,
            numberOfContractsApart: null,
            normalization: null,
            normalizationMonth: null,
            normalizationDate: null,
            forwardCurveStudy: null,
            constrainSampleContract: true,
            user: null,
            buySell: null,
            saveName: "",
            longtermChartColors: null,
            aligned: false,
            stockDataSource: "rapidapi",
            tickerInput: "", //"2*C2023H - 3*S2023F+W2024F",
            tickerInputWithUnitMoves: "",
            isTickerInputValid: false,
            treeType: null,
            tabTitleMode: "auto",
            zoomToSavedCoordinates: null,
            seasonalSelectionMode: "standard",
            seasonalTypes: ["adjusted", "unadjusted"],
            spreadCalculationMethod: "a4a", // or "csi"
        }),
    getters: {
        openMonth(state) {
           // console.log("openMonth() starting. state.open=", state.open, "state=", JSON.parse(JSON.stringify(state)));
            return moment(state.open).locale("en").format("MMMM");
        },
        openDate(state) {
           // console.log("openDate() starting. state.open=", state.open, "state=", JSON.parse(JSON.stringify(state)));
            return moment(state.open).locale("en").format("D");
        },
        closeMonth(state) {
            return moment(state.close).locale("en").format("MMMM");
        },
        closeDate(state) {
            return moment(state.close).locale("en").format("D");
        },
        c(state) {
            return state.sampleContract.map(x => contractNameDecomposer(x).commoditySymbol);
        },
        m(state) {
            return state.sampleContract.map(x => contractNameDecomposer(x).monthSymbol);
        },
        group(state, getters) {
            let commodity = getters['c'][0];
            //console.log("commodity=", commodity);
            let group = getGroup(commodity);
            //console.log("group=", group);
            return group;
        },
        ticker(state) {
            // console.log("ticker getter starting.");
            // console.trace();
            let generalForm = JSON.parse(JSON.stringify(state));
            //console.log("state=", generalForm);
            // console.log("state.selected=", state.selected.slice());

            let ticker = spreadTitle(generalForm);
            // console.log("ticker=", ticker);
            return ticker;
        },
        displayTicker(state, getters, rootState) {
            // console.log("displayTicker getter starting.");
            // console.trace();
            let generalForm = JSON.parse(JSON.stringify(state));
            // console.log("state=", generalForm);
            // console.log("state.selected=", state.selected.slice());

            let symbols = rootState.user.symbols;
            // console.log("symbols=", symbols);

            let invertDatesMultiplier = 1;
            let noLegSwapping = false;
            let ticker = spreadTitle(generalForm, invertDatesMultiplier, noLegSwapping, symbols);
            // console.log("ticker=", ticker);
            return ticker;
        },
        displayTickerWithUnitMoves(state, getters, rootState) {
           // console.log("displayTickerWithUnitMoves getter starting.");
            //console.trace();
            let generalForm = JSON.parse(JSON.stringify(state));
           // console.log("generalForm=", generalForm);

            let symbols = rootState.user.symbols;
            let includeUnitMoves = true;
            let invertDatesMultiplier = 1;
            let noLegSwapping = false;
            let ticker = spreadTitle(generalForm, invertDatesMultiplier, noLegSwapping, symbols, includeUnitMoves);
            // console.log("ticker=", ticker);
            return ticker;
        },
        tickerNoLegSwapping(state) {
            //  console.log("ticker getter starting.");
            //  console.log("state=", JSON.parse(JSON.stringify(state)));
            if (typeof state.selected !== 'undefined' && state.selected.length > 0) {
                let noLegSwapping = true;
                let invertDatesMultiplier = 1;
                let ticker = spreadTitle(JSON.parse(JSON.stringify(state)), invertDatesMultiplier, noLegSwapping);
                // console.log("ticker=", ticker);
                return ticker;
            } else {
                return null;
            }
        },
        listOptions(state) {
            // console.log("listOptions getter starting.");
            return listOptions(JSON.parse(JSON.stringify(state)));
        },
        /*  listTickerOptions(state, getters) {
         let returnArray = [];
         //  console.log("state.browserSideOnly.alignerOptions=", state.browserSideOnly.alignerOptions);
         
         getters['browserSideOnly/tickerOptions'].map(function (temp) {
         //console.log("temp =", temp);
         let option = temp.join('');
         if (option.indexOf("--") == -1) {
         let open = true; //state.browserSideOnly.openOptions.includes(option); //&& ["seasonal", "history"].includes(state.study); 
         returnArray.push({ value: option, open: open });
         // console.log("returnArray =", returnArray);
         }
         });
         console.log("returnArray=", returnArray);
         return returnArray;
         },*/
        seasonalOptions(state, getters) {
            // console.log("seasonalOptions() starting.");
            let seasonalColors = ["orange", "darksalmon", "crimson", "brown", "black"];
            let maxYears = getters['maxSeasonalYears'];

            let possibleOptions = [5, 10, 15, 20, 30];
            let availableOptions = possibleOptions.filter(x => x <= maxYears);

            let maxAvailableOption = Math.max(...availableOptions);
            //  console.log("maxAvailableOption=", maxAvailableOption);
            if (maxAvailableOption < maxYears) {
                availableOptions.push(maxYears);
            }
            // console.log("availableOptions=", availableOptions);

            // console.log("state.browserSideOnly.minUnreturnedSeasonal=", state.browserSideOnly.minUnreturnedSeasonal);
            let availableOptionObjects = availableOptions.map((value, index) => ({value: value, color: seasonalColors[index]}));
            //  console.log("availableOptionObjects=", availableOptionObjects);
            return availableOptionObjects;
        },
        maxSeasonalYears(state, getters) {
            if (typeof state.selected[0] !== 'undefined') {
                let selected = state.selected[0].split("/")[0];
                // console.log("selected=", selected);
                let year = contractNameDecomposer(selected).year;  // Fix this!
                //  console.log("year=", year);            

                // console.log("getters['listOptions']=", getters['listOptions']);
                let closedOptions = getters['listOptions'].filter(x => !x.open);
                // console.log("closedOptions=", closedOptions);            
                let earlierClosedOptions = closedOptions.filter(x => {
                    return contractNameDecomposer(x.value.split("/")[0]).year < year;
                });
                // console.log("earlierClosedOptions=", earlierClosedOptions);

                let maxYears = Math.min(30, earlierClosedOptions.length);
                // console.log("maxYears=", maxYears);
                return maxYears;
            }
        },
        availableSeasonals(state, getters) {
            let availableSeasonals = state.seasonals.slice()
                    .filter(x => getters['seasonalOptions']
                                .map(x => x.value).includes(x))
                    .sort(function (a, b) {
                        return a - b;
                    });
            // console.log("availableSeasonals=", availableSeasonals);
            return availableSeasonals;
        },
        normalizedStockGraphType(state) {
            if (state.legs > 1) {
                // state.stockGraphType = "line";
                return "line";
            } else {
                return state.stockGraphType;
            }
        }
    },
    mutations: {
        setGeneralForm: function (state, newState) {
            // console.log("newState=", newState);
            Object.assign(state, newState);
        },
        setSampleContract: function (state, sampleContract) {
            state.sampleContract = sampleContract;
        },
        setLegs: function (state, legs) {
            state.legs = legs;
        },
        setUnitMove: function (state, unitMove) {
            console.log("setUnitMove() starting. unitMove=", unitMove);
            state.unitMove = unitMove.map(x => parseInt(x));
            // state.playback.i = null;
        },
        setSelected: function (state, payload) {
           // console.log("setSelected() starting. payload=", payload);
           // console.trace();
            state.zoomToSavedCoordinates = false;
            state.selected = payload;
            state.chartParameters.annotationData = null;
            // state.playback.i = null;
        },
        setCustomSelected: function (state, customSelected) {
            state.customSelected = customSelected;
        },
        setY1: function (state, y1) {
            state.y1 = y1;
        },
        setYearOptionsLength: function (state, yearOptionsLength) {
            state.yearOptionsLength = yearOptionsLength;
        },
        setP: function (state, p) {
            state.p = p;
            // state.playback.i = null;
        },
        setInstrument: function (state, instrument) {
            state.instrument = instrument;
        },
        setIntracommodity: function (state, intracommodity) {
            state.intracommodity = intracommodity;
        },
        setMult: function (state, mult) {
            state.mult = mult;
        },
        setStudy: function (state, study) {
            state.study = study;
        },
        setStockGraphType: function (state, stockGraphType) {
            state.stockGraphType = stockGraphType;
        },
        setSeasonals: function (state, seasonals) {
            state.seasonals = seasonals;
        },
        setAddRSIPanel: function (state, addRSIPanel) {
            state.addRSIPanel = addRSIPanel;
        },
        setRsiPeriod: function (state, rsiPeriod) {
            state.rsiPeriod = rsiPeriod;
        },
        setAddCCIPanel: function (state, addCCIPanel) {
            state.addCCIPanel = addCCIPanel;
        },
        setCciPeriod: function (state, cciPeriod) {
            state.cciPeriod = cciPeriod;
        },
        setCciSource: function (state, cciSource) {
            state.cciSource = cciSource;
        },
        setAddMACDPanel: function (state, addMACDPanel) {
            state.addMACDPanel = addMACDPanel;
        },
        setAddATRPanel: function (state, addATRPanel) {
            state.addATRPanel = addATRPanel;
        },
        setAddBollinger: function (state, addBollinger) {
            state.addBollinger = addBollinger;
        },
        setBollingerPeriod: function (state, bollingerPeriod) {
            state.bollingerPeriod = bollingerPeriod;
        },
        setAddSMA: function (state, addSMA) {
            state.addSMA = addSMA;
        },
        setSmaLength: function (state, smaLength) {
            state.smaLength = smaLength;
        },
        setAddEMA: function (state, addEMA) {
            state.addEMA = addEMA;
        },
        setEmaLength: function (state, emaLength) {
            state.emaLength = emaLength;
        },
        setAddVolumePanel: function (state, addVolumePanel) {
            state.addVolumePanel = addVolumePanel;
        },
        setShowBullets: function (state, showBullets) {
            state.showBullets = showBullets;
        },
        setShowPlaybackControl: function (state, showPlaybackControl) {
            state.showPlaybackControl = showPlaybackControl;
        },
        setShowBreakpoints: function (state, showBreakpoints) {
            state.showBreakpoints = showBreakpoints;
        },
        setShow3D: function (state, show3D) {
           // console.log("setShow3D() starting. show3D=", show3D);
            state.show3D = show3D;
        },
        setAddCOTPanel: function (state, addCOTPanel) {
            state.addCOTPanel = addCOTPanel;
        },
        setDataSource: function (state, dataSource) {
            state.dataSource = dataSource;
        },
        setSpreadP: function (state, spreadP) {
            state.spreadP = spreadP;
        },
        setSpreadMult: function (state, spreadMult) {
            state.spreadMult = spreadMult;
        },
        setLoading: function (state, loading) {
            state.loading = loading;
        },
        setStockArray: function (state, stockArray) {
            state.stockArray = stockArray;
        },
        setProgram: function (state, program) {
            state.program = program;
        },
        setModuleName: function (state, moduleName) {
           // console.log("setModuleName() starting.");
            state.moduleName = moduleName;
        },
        setAddVolumeProfile: function (state, addVolumeProfile) {
            state.addVolumeProfile = addVolumeProfile;
        },
        setVolumeProfileColumns: function (state, volumeProfileColumns) {
            state.volumeProfileColumns = volumeProfileColumns;
        },
        setShowTradingPeriod: function (state, showTradingPeriod) {
           // console.log("setShowTradingPeriod() starting. showTradingPeriod=", showTradingPeriod);
           // console.trace();
            state.showTradingPeriod = showTradingPeriod;
        },
        setAddProfitLoss: function (state, addProfitLoss) {
            state.addProfitLoss = addProfitLoss;
        },
        setAddHorizontalLine: function (state, addHorizontalLine) {
            state.addHorizontalLine = addHorizontalLine;
        },
        setOpen: function (state, open) {
            // console.log("open=", open);
           // console.trace();
            state.open = open;
        },
        setClose: function (state, close) {
           // console.log("setClose() starting. close=", close);
           // console.trace();
            state.close = close;
        },
        setTabTitle: function (state, payload) {
            // console.log("setTabTitle() starting. payload=", payload);
            //  if(state.tabTitleMode === "auto"){
            state.tabTitle = payload;
            //  }
        },
        setTabTitleManually: function (state, payload) {
            // console.log("setTabTitleManually() starting. payload=", payload);
            //  if(state.tabTitleMode === "manual"){
            state.tabTitle = payload;
            //  }
        },
        setHideInput: function (state, hideInput) {
            state.hideInput = hideInput;
        },
        setBarchartTicker: function (state, barchartTicker) {
            state.barchartTicker = barchartTicker;
        },
        setTruncate: function (state, truncate) {
            state.truncate = truncate;
        },
        setNumberOfContractsApart: function (state, payload) {
            console.log("setNumberOfContractsApart() starting. payload=", payload);
            // console.trace();
            state.numberOfContractsApart = payload;
        },
        setNormalization: function (state, normalization) {
            console.log("setNormalization() starting. normalization=", normalization);
           // console.trace();
            state.normalization = normalization;
        },
        setNormalizationMonth: function (state, normalizationMonth) {
            state.normalizationMonth = normalizationMonth;
        },
        setNormalizationDate: function (state, normalizationDate) {
            state.normalizationDate = normalizationDate;
        },
        setForwardCurveStudy: function (state, forwardCurveStudy) {
            state.forwardCurveStudy = forwardCurveStudy;
        },
        setConstrainSampleContract: function (state, payload) {
            state.constrainSampleContract = payload;
        },
        setUser: function (state, user) {
            state.user = user;
        },
        setBuySell: function (state, buySell) {
            state.buySell = buySell;
        },
        setSaveName: function (state, saveName) {
            state.saveName = saveName;
        },
        setLongtermChartColors: function (state, longtermChartColors) {
            state.longtermChartColors = longtermChartColors;
        },
        setAligned: function (state, aligned) {
            state.aligned = aligned;
        },
        setStockDataSource: function (state, payload) {
            state.stockDataSource = payload;
        },
        setTickerInput: function (state, payload) {
           // console.log("setTickerInput() starting. payload=", payload);
            state.tickerInput = payload;
        },

        /* pushToTickerLegs: function (state, payload) {
         console.log("payload=", payload);
         let newArray = JSON.parse(JSON.stringify(state.tickerLegs));
         newArray[payload.index] = payload.value;
         console.log("newArray=", newArray);
         state.tickerLegs = newArray;
         console.log("state.tickerLegs=", JSON.parse(JSON.stringify(state.tickerLegs)));
         },
         removeLegFromTickerLegs: function (state, index) {
         console.log("removeLegFromTickerLegs() starting. index=", index);
         let arr = JSON.parse(JSON.stringify(state.tickerLegs));
         console.log("arr=", arr);
         arr.splice(index, 1);
         console.log("arr=", arr);
         state.tickerLegs = arr;
         }, */
        setTreeType: function (state, payload) {
            state.treeType = payload;
        },
        setTabTitleMode: function (state, tabTitleMode) {
            state.tabTitleMode = tabTitleMode;
        },
        setManualTabTitle: function (state, manualTabTitle) {
            state.manualTabTitle = manualTabTitle;
        },
        setZoomToSavedCoordinates: function (state, zoomToSavedCoordinates) {
           // console.trace();
            state.zoomToSavedCoordinates = zoomToSavedCoordinates;
        },
        setSeasonalSelectionMode: function (state, payload) {
            state.seasonalSelectionMode = payload;
        },
        setSeasonalTypes: function (state, seasonalTypes) {
            state.seasonalTypes = seasonalTypes;
        },
        setShowCalculatorChart: function (state, showCalculatorChart) {
            state.showCalculatorChart = showCalculatorChart;
        },
        setIsTickerInputValid: function (state, isTickerInputValid) {
            console.log("setIsTickerInputValid() starting. isTickerInputValid=", isTickerInputValid);
            state.isTickerInputValid = isTickerInputValid;
        },
        setTickerInputWithUnitMoves: function (state, payload) {
            state.tickerInputWithUnitMoves = payload;
        },
        setSpreadCalculationMethod: function (state, payload) {
            state.spreadCalculationMethod = payload;
        }
    },
    actions: {
        shiftSampleContract( { getters, commit, state, dispatch }, payload) {
            console.log("shiftSampleContract() starting.");
            // console.log("state=", state);
            let index = payload.index;
            let direction = payload.direction;
            console.log("index=", index + " direction=", direction);
            let oldContract = state.sampleContract[index];
            let temp = contractNameDecomposer(oldContract);
            let newContract = temp.commoditySymbol + parseInt(parseInt(temp.year) - (direction === "up" ? 1 : -1)) + temp.monthSymbol;
            console.log("index=" + index + " oldContract=" + oldContract + " newContract=" + newContract);

            let earliestContractIndex = state.browserSideOnly.contractLists[index].length - 1;
            let earliestContract = state.browserSideOnly.contractLists[index][earliestContractIndex];
            // console.log("earliestContract=" + earliestContract);
            let earliestYear = contractNameDecomposer(earliestContract).year;
            if (temp.year > earliestYear) {
                commit('setSelected', []);

                let arr = state.sampleContract.slice(0);  //, this.$store.state.legs); //slice(0) 
                arr[index] = newContract;
                if (direction === "down") {
                    arr = decrementSampleContract(arr);
                }
                //  this.$store.commit('setSampleContract', arr);
                let alignerOptionsObject = ContractWeightedN_tuplets(arr.slice(0, state.legs), state.browserSideOnly.contractLists.slice());
                // console.log("alignerOptionsObject=", alignerOptionsObject);

                for (let i = 0; i < state.legs; i++) {
                    arr[i] = alignerOptionsObject.sampleContract[i];
                }
                console.log("arr=", arr);
                commit('setSampleContract', arr);
                commit('browserSideOnly/setAlignerOptions', alignerOptionsObject.alignerOptions);
                commit('browserSideOnly/setAlignerOpenOptions', alignerOptionsObject.openAlignerOptions);

                let openSpreads = getters['listOptions'].filter(x => x.open === true);
                console.log("last openSpreads=", openSpreads[openSpreads.length - 1]);

                //  let openSpreads = this.$store.getters['generalForm/listOptions'].filter(x => x.open === true);
                // dispatch('hideOpenContracts');
                //  commit('browserSideOnly/setMinUnreturnedSeasonal', 40);
                dispatch('setOptionColors');
                dispatch('addSelected');

                commit('setZoomToSavedCoordinates', false);
                commit("chartParameters/setMinZoomed", null);
                commit("chartParameters/setMaxZoomed", null);
        }
        },
        changeCommodityLeg( { commit, dispatch, state }, payload) {
              console.log("changeCommodityLeg() starting.");
            // console.log("payload =", payload);
            let commodity = payload.commodity;
            let index = payload.index;
            //  console.log("commodity =", commodity);
            // console.log("index =", index);

            let newState = changeCommodityLeg(commodity, index, JSON.parse(JSON.stringify(state)));

            commit('setGeneralForm', newState);
            commit('setZoomToSavedCoordinates', false);
            commit("chartParameters/setMinZoomed", null);
            commit("chartParameters/setMaxZoomed", null);

            dispatch('getContractListsFromServer', null);
        },
        checkPositions( { commit, state }, index = 0) {
            // console.log("checkPositions() starting. legs=" + state.legs);
            //  console.log("state.generator=", state.generator);
            //  console.log("state.p=", state.p);

            let newArray = state.p.slice(0);
            /*   if (state.legs === 1 && !(state.generator === "SeasonalsGenerator" && state.study === "calculator")) {
             newArray[0] = 1;
             } else */ if (state.legs == 2) {
                if (index == 0) {
                    newArray[1] = -state.p[0];
                }
                if (index == 1) {
                    newArray[0] = -state.p[1];
                }
            }
            commit('setP', newArray);
            // console.log("state.p=", state.p);
        },
        addSelected( { commit, state, getters }) {
            console.log("addSelected() starting.");
           // console.log("state=", JSON.parse((JSON.stringify(state))));
          /*  let length = state.selected.length;
            let program = state.program;
            console.log("length=", length, " program=", program); */

           // console.log("typeof state.selected === 'undefined' || state.selected.length === 0 || state.selected[0] === null=", typeof state.selected === 'undefined' || state.selected.length === 0 || state.selected[0] === null);
           // console.log(' ["Calculator", "SpreadCoverage", "BasicCharts", "BasicChartsNew", "History", "TimeSeriesCharts", "TradeMaps"].includes(state.program)=',  ["Calculator", "SpreadCoverage", "BasicCharts", "BasicChartsNew", "History", "OpenSpreads", "TimeSeriesCharts", "TradeMaps"].includes(state.program));
            
            if ((typeof state.selected === 'undefined' || state.selected.length === 0 || state.selected[0] === null) &&
                    ["Calculator", "SpreadCoverage", "BasicCharts", "BasicChartsNew", "History", "TimeSeriesCharts", "TradeMaps"].includes(state.program)) {

                let spread = nearestOpenSpreadOrLatestClosedSpread(state);
                console.log("Adding selected. spread=", spread);
                commit('setSelected', [spread.value]);
            } else if ((state.program === "StackedCharts" && state.seasonalSelectionMode === "standard") || state.program === "LongTermCharts") {
                let selected = getters['listOptions'].map(x => x.value).slice(0, state.y1);
                 console.log("selected=", selected);
                 commit('setSelected', selected);
            }
        },
        getContractListsFromServer( { commit, dispatch, state }) {
            if (state.instrument === "future") {
                console.log("getContractListsFromServer() starting.");
                console.log("state=", JSON.parse(JSON.stringify(state)));

                if(state.program === "BasicCharts"){
                    commit('setProgram', "BasicChartsNew");
                   // commit('setShowTradingPeriod', false);
                }

                if(["Search", "SearchNew"].includes(state.program)){
                    console.log("state.search.userConditions=", state.search.userConditions);
                    console.log("searchInitialState=", searchInitialState);
                    let mergedUserConditions = _.merge(searchInitialState.search.userConditions, state.search.userConditions);
                    console.log("mergedUserConditions=", mergedUserConditions);
                    commit('search/setUserConditions', mergedUserConditions);

                    commit('setNumberOfContractsApart', 4);                    
                }
                
                if (state.open === "") {
                    let today = moment().format("YYYY-MM-DD");
                    // console.log("today=", today);
                    commit('setOpen', today);
                }
                // console.log("this.close=", this.close);
                if (state.close === "") {
                    commit('setClose', moment().add(7, 'days').format("YYYY-MM-DD"));
                }

                commit('setSpreadMult', 1);

                let constrainedContract = state.constrainSampleContract ? ConstrainSampleContract(state.sampleContract) : [...state.sampleContract];
                // console.log("constrainedContract=", constrainedContract);
                commit('setSampleContract', constrainedContract); 
              //  commit('setConstrainSampleContract', true);  // This causes problems with the TradeMaps.

                let fullInitialState = loadBrowserSideOnlyData(state);
               // console.log("fullInitialState=", fullInitialState);

                commit('setGeneralForm', fullInitialState);

                /*  let arr = state.sampleContract.slice(0);
                 // console.log("arr=", [...arr]);
                 for (let i = 0; i < state.legs; i++) {
                 arr[i] = alignerOptionsObject.sampleContract[i];
                 }
                 //  console.log("arr=", arr);
                 commit('setSampleContract', arr); */
                //   dispatch('displaySelectedOpenOptionsCorrectly');  // Apparently, this statement is not needed.

                dispatch('setOptionColors');
                dispatch('addSelected');
        }
        },
        setOptionColors( { commit, state }) {
            // console.log("setOptionColors() starting.");
            // let contractSeparation = ContractSeparationCounter(state.sampleContract[0], state.sampleContract[1]);
            // console.log("Math.sign(contractSeparation)=", Math.sign(contractSeparation));
            commit('browserSideOnly/setNumberOfIncompleteSpreads', 0);
            let tickerOptions = state.browserSideOnly.alignerOptions;
            //  console.log("tickerOptions =", tickerOptions);
            if (tickerOptions !== null) {
                tickerOptions.map(function (temp) {
                    // console.log("temp ", temp);
                    if (temp.join().indexOf("--") > -1) {
                        commit('browserSideOnly/incrementNumberOfIncompleteSpreads');
                    }
                });
        }
        //console.log("numberOfIncompleteSpreads", state.browserSideOnly.numberOfIncompleteSpreads);
        }
    }
};


