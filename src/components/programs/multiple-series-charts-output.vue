<template>
    <table style="width: 100%">
        <!--  <tr>
              <td>
                  selectedTickers: {{selectedTickers}}
              </td>
               <td>
                  selected: {{selected}}
              </td>
          </tr> 
        
                  customSelected:{{ customSelected }}
        -->

        <tr> 
            <td v-if="seasonalSelectionMode === 'custom'"
                style="vertical-align: top; background-color: white; padding: 0 2px 0 2px; text-align: left; width: auto ">

                <div  style="text-align: center; color: white; background-color: black; font-weight: normal;
                      padding: 0px 1px 1px 1px; width: auto; border-radius: 3px;">
                    <div v-if="$store.state[namespace].legs > 1 && tickerInputType === 'form'" style="padding: 1px; text-align: center;">                                                         
                        <b>Aligner</b>
                        <contract-aligner v-bind:namespace="namespace" ></contract-aligner>     
                    </div>

                    <div v-if="program === 'StackedCharts'">                                                         
                        Selector
                        <contract-selector v-bind:namespace="namespace" ref="contract-selector" ></contract-selector>  
                    </div>
                </div>

            </td>
            <td style="vertical-align: top; width: 100%; border-left: 0px solid darkgray; border-right: 0px solid darkgray;">
        <multiple-series-chart v-bind:ref="namespace"
                               v-bind:namespace="namespace" 
                               v-bind:div-name="namespace+'-chartDiv'"
                               v-bind:parsedData="transformedParsedData"></multiple-series-chart>  
        </td>
        </tr>
    </table> 
</template>

<script>

    import contractSelector from '@/components/contract-selector';
    import contractAligner from '@/components/contract-aligner';
    import $ from "jquery";
    import {spreadTitle, spreadToColor, isSpreadOpen, OpenSpreads, contractNameDecomposer, monthToColor, spreadDigits} from "@/js/main";
    import multipleSeriesChart from '@/components/am4charts-multiple-series-chart';
    import moment from "moment";
    import _ from 'lodash';

    export default {
        components: {
            contractSelector, contractAligner, multipleSeriesChart
        },
        mounted() {
            console.log("multiple-series-charts-output.vue mounted() starting. this.program=", this.program);
           // this.$store.commit(this.namespace + '/setTabTitle', (this.program === "OpenSpreads" ? "open: " : "long-term: ") + this.displayTickerWithUnitMoves);
            this.$store.commit(this.namespace + '/setTabTitle', this.tabTextObject[this.program] + ": " + this.displayTickerWithUnitMoves);
            if (this.activeModuleName === this.namespace && !this.initialized) {
                this.getData();
            }
        },
        props: ['namespace'],
        data: function () {
            return{
                parsedData: null,
                transformedParsedData: null,
                initialized: false,
                data: [],
                layout: {},
                modeBarButtonsToRemove: ['sendDataToCloud', 'orbitRotation', 'pan3d', 'hoverClosest3d'],
                tabTextObject: {
                    LongTermCharts: "long-term",
                    OpenSpreads: "open",
                    StackedCharts: "stacked"
                },
                lastTime: null
            }
        },
        computed: {
            customSelected: {
                get(){
                    return this.$store.state[this.namespace].customSelected;
                },
                set(selected){
                    this.$store.commit(this.namespace + '/setCustomSelected', selected);
                }
            },
            hideInput() {
                return this.$store.state[this.namespace].hideInput;
            },
            ticker() {
                return this.$store.getters[this.namespace + "/ticker"];
            },
            tickerInputWithUnitMoves() {
                return this.$store.state[this.namespace].tickerInputWithUnitMoves;
            },
            displayTickerWithUnitMoves() {
                return this.$store.getters[this.namespace + "/displayTickerWithUnitMoves"];
            },
            activeModuleName() {
                let activeModuleName = this.$store.getters['activeModuleName'];
                // console.log("activeModuleName=", activeModuleName);
                return activeModuleName;
            },
            normalization() {
                return this.$store.state[this.namespace].normalization;
            },
            normalizationMonth() {
                return this.$store.state[this.namespace].normalizationMonth;
            },
            normalizationDate() {
                return this.$store.state[this.namespace].normalizationDate;
            },
            selected: {
                get() {
                    return this.$store.state[this.namespace].selected;
                },
                set(selected) {
                    // console.log("selected set() starting.");
                    this.$store.commit(this.namespace + '/setSelected', selected);
                }
            },
            selectedTickers() {
                let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                 // console.log("generalForm=", generalForm);
                 // console.log("this.selected=", this.selected);
                return this.selected.map(x => {
                    // console.log("x=", x);
                    generalForm.selected = [x];
                    let invertDatesMultiplier = 1;
                    let noLegSwapping = true;
                    let includeUnitMoves = true;
                    let ticker = spreadTitle(JSON.parse(JSON.stringify(generalForm)), invertDatesMultiplier, noLegSwapping, this.symbols, includeUnitMoves);
                    // console.log("ticker=", ticker);
                    return ticker;
                });
            },
            aligned() {
                return this.$store.state[this.namespace].aligned;
            },
            chartType() {
                return this.aligned ? "aligned" : "unaligned";
            },
            program() {
                return this.$store.state[this.namespace].program;
            },
            stockGraphType() {
                return this.$store.state[this.namespace].stockGraphType;
            },
            numberOfContractsApart() {
                return this.$store.state[this.namespace].numberOfContractsApart;
            },
            truncate() {
                return this.$store.state[this.namespace].truncate;
            },
            symbols() {
                return this.$store.state.user.symbols;
            },
            commodity() {
                return this.$store.getters[this.namespace + "/c"][0];
            },
            seasonalSelectionMode() {
                return this.$store.state[this.namespace].seasonalSelectionMode;
            },
            y1() {
                return this.$store.state[this.namespace].y1;
            },
            tickerInputType() {
                return this.$store.state.user.tickerInputType;
            }
        },
        watch: {
            /*  symbols(symbols) {
             console.log("watch: symbols=", symbols);
             console.log("this.displayTickerWithUnitMoves=", this.displayTickerWithUnitMoves);
             let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
             if (generalForm.program === "BasicCharts") {
             this.$store.commit(this.namespace + '/setTabTitle', this.displayTickerWithUnitMoves);
             }
             },*/
            selectedTickers: function (newSelectedTickers, oldSelectedTickers) {
                if (JSON.stringify(newSelectedTickers) !== JSON.stringify(oldSelectedTickers)/* && this.program !== "OpenSpreads"*/) {
                   //  console.log("JSON.stringify(newSelectedTickers) !== JSON.stringify(oldSelectedTickers)=", JSON.stringify(newSelectedTickers) !== JSON.stringify(oldSelectedTickers));
                    if (newSelectedTickers.length === 0 || newSelectedTickers === null) {
                        this.transformedParsedData = {};
                        if (this.program === "LongTermCharts") {
                            console.log("watch: JSON.stringify(newSelectedTickers)=", JSON.stringify(newSelectedTickers), " JSON.stringify(oldSelectedTickers)=", JSON.stringify(oldSelectedTickers), " namespace=", this.namespace);
                            this.getData();
                        }
                    } else {
                       this.getData();
                    }
                    if(this.seasonalSelectionMode === "custom"){
                        this.customSelected = this.selected;
                    }
                }
            },
            activeModuleName: function (activeModuleName) {
               // console.log("watch activeModuleName=", activeModuleName, " namespace=", this.namespace, " this.initialized=", this.initialized);
                if (activeModuleName === this.namespace && !this.initialized && this.selectedTickers.length > 0) {
                    this.getData();
                }
            },
            normalization: function (/*normalization*/) {
               // console.log("watch normalization = ", normalization);
                this.transformParsedData();
            },
            normalizationMonth: function (/*normalizationMonth*/) {
               // console.log("watch normalizationMonth=", normalizationMonth);
                this.transformParsedData();
            },
            normalizationDate: function (/*normalizationDate*/) {
               // console.log("watch normalizationDate=", normalizationDate);
                this.transformParsedData();
            },
            chartType: function (/*chartType*/) {
              //  console.log("watch chartType=", chartType);
                this.getData();
            },
            stockGraphType: function () {
               // console.log("watching stockGraphType.");
                // let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                // console.log("generalForm=", generalForm);
                this.getData();
            },
            numberOfContractsApart: function (/*numberOfContractsApart*/) {
              //  console.log("watch numberOfContractsApart=", numberOfContractsApart);
                // if (this.selectedTickers.length > 0) {
                this.getData();
                // }
            },
            truncate() {
               // console.log("watching truncate");
                this.getData();
            },
            commodity(newCommodity, oldCommodity) {
               // console.log("watching newCommodity=", newCommodity, " oldCommodity=", oldCommodity);
                if (newCommodity !== oldCommodity) {
                    this.getData();
                }
            },
            y1(/*y1*/) {
              //  console.log("watching y1=", y1);
                this.$store.dispatch(this.namespace + '/getContractListsFromServer');
                this.getData();
            },
            seasonalSelectionMode(seasonalSelectionMode) {
                console.log("watching seasonalSelectionMode=", seasonalSelectionMode);
                if (seasonalSelectionMode === 'standard') {
                    this.$store.dispatch(this.namespace + '/getContractListsFromServer');
                    this.getData();
                } else {
                    this.selected = this.customSelected;
                }
            },
            /*  tickerInputWithUnitMoves(tickerInputWithUnitMoves){
             console.log("watching tickerInputWithUnitMoves=", tickerInputWithUnitMoves);
             this.getData();               
             }*/
        },
        methods: {
            transformParsedData() {
               // console.log("transformParsedData() starting. this.aligned=", this.aligned);
                if (!this.aligned || ["OpenSpreads", "StackedSpreads"].includes(this.program)) {
                    console.log("this.parsedData=", JSON.parse(JSON.stringify(this.parsedData)));
                    this.transformedParsedData = this.parsedData;
                  //  console.log("this.transformedParsedData=", JSON.parse(JSON.stringify(this.transformedParsedData)));
                } else if (this.parsedData !== null) {
                    //  console.log("this.parsedData=", this.parsedData);
                    let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                    let parsedData = this.ungapData(JSON.parse(JSON.stringify(this.parsedData)));
                    // console.log("this.normalization=", this.normalization);

                    if (this.normalization === "on") {
                        let normalizationVector = this.createNormalizationVector(parsedData, generalForm.normalizationMonth, generalForm.normalizationDate);
                        parsedData = this.normalizeData(parsedData, normalizationVector);
                    }
                    parsedData = this.createSeasonal(parsedData);
                    this.transformedParsedData = parsedData;
                } else {
                    this.transformedParsedData = null;
                }
            },
            ungapData(parsedData) {
                // console.log("ungapData() starting. values=", JSON.parse(JSON.stringify(parsedData)));
                let ungappedValues = [];
                let firstDate = parsedData.values[0].date;
                let lastDate = parsedData.values[parsedData.values.length - 1].date;
                let endDates = parsedData.names.map(name => {
                    // console.log("name=", name);
                    let j = parsedData.values.length - 1;
                    while (j > 0 && isNaN(parsedData.values[j][name])) {
                        j--;
                    }
                    let endDate = parsedData.values[j].date;
                    // console.log(name + ": endDate=", endDate);
                    return {name: name, endDate: endDate};
                });
                // console.log("lastDate=", lastDate);
                // console.log("endDates=", endDates);

                let date = moment(parsedData.values[0].date);
                while (!date.isAfter(lastDate)) {
                    // console.log(date.format("YYYY-MM-DD"));
                    let values = parsedData.values.find(x => x.date === date.format("YYYY-MM-DD"));
                    values = typeof values === 'undefined' ? {} : values;
                    // console.log("values=", values);

                    if (date.isAfter(firstDate)) {
                        parsedData.names.map(name => {
                            if (!date.isAfter(endDates.find(x => x.name === name).endDate)) {
                                if (isNaN(values[name])) {
                                    let previousDate = date.clone().subtract(1, "days").format("YYYY-MM-DD");
                                    // console.log("previousDate=", previousDate);
                                    let previousValues = ungappedValues.find(x => x.date === previousDate);
                                    // console.log("previousValues=", previousValues);
                                    values[name] = previousValues[name];
                                }
                            }
                        });
                    }

                    let obj = values;
                    obj.date = date.format("YYYY-MM-DD");
                    ungappedValues.push(obj);
                    date.add(1, "days");
                }
                // console.log("ungappedValues=", JSON.parse(JSON.stringify(ungappedValues)));
                parsedData.values = ungappedValues;
                return parsedData;
            },
            createNormalizationVector(parsedData, normalizationMonth, normalizationDate) {
                //  console.log("createNormalizationVector() starting. normalizationMonth=", normalizationMonth, " normalizationDate=", normalizationDate);
                let firstDate = parsedData.values[0].date;
                let lastDate = parsedData.values[parsedData.values.length - 1].date;
                let date = moment(lastDate);
                while (!date.isBefore(firstDate)) {
                    // console.log(date.format("YYYY-MM-DD"));
                    let month = date.format("MMMM");
                    //  console.log("month=", month);
                    if (month === normalizationMonth) {
                        // console.log(date.format("D"));
                        if (parseInt(date.format("D")) === normalizationDate || date.format("D") === normalizationDate) {
                            parsedData.normalizationDate = date.format("YYYY-MM-DD");
                            break;
                        }
                    }
                    date.subtract(1, "days");
                }
                let normalizationVector = parsedData.values.find(x => x.date === date.format("YYYY-MM-DD"));
                // console.log("normalizationVector=", {...normalizationVector});
                return normalizationVector;
            },
            normalizeData(parsedData, normalizationVector) {
                console.log("normalizeData() starting. normalizationVector=", normalizationVector);

                if (typeof normalizationVector !== 'undefined') {
                    const {...vector} = normalizationVector;
                    parsedData.values.forEach(x => {
                        // console.log(x.date);
                        Object.keys(x).forEach(key => {
                            if (key !== "date") {
                                // console.log(key, " x[" + key + "]=", x[key]);
                                if (typeof x[key] !== 'undefined' && Object.keys(vector).includes(key)) {
                                    x[key] = x[key] - vector[key];
                                } else {
                                    x[key] = null;
                                }
                            }
                        });
                        // console.log("x=", x);
                    });
                }
                return parsedData;
            },
            createSeasonal(parsedData) {
                // console.log("createSeasonal() starting. parsedData=", JSON.parse(JSON.stringify(parsedData)));
                let numberOfClosedNames = parsedData.names.filter(x => (typeof x !== 'undefined' && !isSpreadOpen(x))).length;
                // console.log("numberOfClosedNames=", numberOfClosedNames);

                if (numberOfClosedNames > 1) {
                    let endIndex;
                    for (let j = parsedData.values.length - 1; j > 0; j--) {
                        const {...values} = parsedData.values[j];
                        // console.log(moment(values.date).format("YYYY-MM-DD"));
                        delete values.date;

                        let names = Object.keys(values);
                        let closedNames = names.filter(x => {
                            return typeof values[x] !== 'undefined' && values[x] !== null && !isSpreadOpen(x);
                        });
                        if (closedNames.length === numberOfClosedNames) {
                            endIndex = j;
                            break;
                        }
                    }
                    //  console.log("endIndex=", endIndex);

                    if (typeof endIndex === 'undefined') {
                        return parsedData;
                    }

                    let endDate = moment(parsedData.values[endIndex].date);
                    // console.log("endDate=", endDate.format("YYYY-MM-DD"));

                    let startDate = endDate.subtract(1, "years").add(1, "days");
                    //  console.log("startDate=", startDate.format("YYYY-MM-DD"));

                    let dates = parsedData.values.map(x => x.date);
                    //console.log("dates=", dates);

                    let startIndex = dates.indexOf(startDate.format("YYYY-MM-DD"));
                    if (startIndex == -1)
                        startIndex = 0;
                    // console.log("startIndex=", startIndex);

                    for (let j = startIndex; j < parsedData.values.length - 1; j++) {
                        // console.log("parsedData.values[" + j + "]", parsedData.values[j]);
                        const {...values} = parsedData.values[j];
                        // console.log("j=", j);
                        // console.log("values=", values);
                        // console.log(moment(values.date).format("YYYY-MM-DD"));
                        delete values.date;

                        let names = Object.keys(values);
                        let closedNames = names.filter(x => {
                            return typeof values[x] !== 'undefined' && values[x] !== null && !isSpreadOpen(x);
                        });
                        // console.log("closedNames.length=", closedNames.length);
                        if (closedNames.length === numberOfClosedNames) {
                            startIndex = j;
                            break;
                        }
                    }
                    //  console.log("startIndex=", startIndex);

                    let digits = spreadDigits(parsedData.names[0], "future") + 1;
                    // console.log("digits=", digits);

                    for (let j = startIndex; j <= endIndex; j++) {
                        const {...values} = parsedData.values[j];
                        // console.log(moment(values.date).format("YYYY-MM-DD"));
                        delete values.date;
                        // console.log("values=", values);

                        let names = Object.keys(values);
                        let closedValues = names.filter(x => {
                            return typeof values[x] !== 'undefined' && !isSpreadOpen(x);
                        }).map(x => parsedData.values[j][x]);
                        // console.log("closedValues=", closedValues);

                        const sum = closedValues.reduce((a, b) => a + b, 0) / numberOfClosedNames;
                        parsedData.values[j].seasonal = sum.toFixed(digits);
                    }
                    parsedData.names.unshift("seasonal");
                    parsedData.colors.unshift("#000000");
                }
                // console.log("parsedData=", parsedData);
                return parsedData;
            },
            getData: _.debounce(function () {
               console.log("getData() starting.");
                this.initialized = true;

                console.log("this.program=", this.program);                      
                this.$store.commit(this.namespace + '/setTabTitle', this.tabTextObject[this.program] + ": " + this.selectedTickers[0] + "...");       

                const currentTime = performance.now();
                console.log("currentTime=", currentTime, " this.lastTime=", this.lastTime);
                if (this.lastTime) {
                    const timeDifference = 0.001*Math.round(currentTime - this.lastTime);
                    console.log("Time since last invocation:", timeDifference, "s");
                }
                this.lastTime = currentTime;

                let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));

             //   put test for same commodity and month of all elements of the the selected array here.  

                if (generalForm.program === "LongTermCharts" && ["ohlc", "candlestick", "procandlestick"].includes(generalForm.stockGraphType)/* && generalForm.legs === 1 */) {
                        this.getBarData();
                } else {
                    this.getLineData();
                }
            }, 600),
            getBarData() {
               // console.log("getBarData() starting.");
                this.$refs[this.namespace].removeChart();

                let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                generalForm.study = "basic";
                generalForm.generator = "LongTermCandlesticksGenerator";

                let selected = generalForm.selected;
                // console.log("selected=", selected, " selected.length=", selected.length);

                if (selected == "" || selected.length == 0 || typeof selected == 'undefined') {
                    let openList = this.$store.getters[this.namespace + '/listOptions'].filter(x => x.open === true);
                    // console.log("openList=", openList);
                    if (openList.length > 0) {
                        selected[0] = openList.slice(-1)[0].value;
                    } else {
                        selected[0] = this.$store.getters[this.namespace + '/listOptions'].filter(x => x.open === false)[0].value;
                    }
                    console.log("generalForm.selected=", selected);
                    this.$store.commit(this.namespace + '/setSelected', selected);
                }

                let url = this.$store.state.siteData.baseUrl + this.$store.state.siteData.contextName + "/ControllerServlet2";
                this.$store.commit('resetNumberOfAjaxCalls');
                this.$store.commit('incrementNumberOfAjaxCalls');
                let that = this;
                $.ajax({
                    url: url,
                    type: "POST",
                    data: {"json": JSON.stringify(generalForm, null, 2)},
                    success: function (data) {
                        that.$store.commit('decrementNumberOfAjaxCalls');
                        // console.log("data=", data);
                        let parsedData = JSON.parse(data);
                        // console.log("parsedData=", parsedData);
                        if (["ohlc", "candlestick", "procandlestick"].includes(generalForm.stockGraphType)) {

                            let values = Object.values(parsedData.values);
                            //  console.log("values=", values);
                            let earliestDate = 88888888;
                            let endDates = [];
                            for (let i = 0; i < values.length; i++) {
                                let dates = Object.keys(values[i]);
                                // console.log("dates=", dates);
                                let firstDate = dates[0];
                                earliestDate = Math.min(earliestDate, firstDate);
                                endDates[i] = dates[dates.length - 1];
                            }
                            //  console.log("earliestDate=", earliestDate);
                            //  console.log("endDates=", endDates);

                            let reversedEndDates = endDates.reverse();
                            // console.log("reversedEndDates=", reversedEndDates);

                            let guides = [];
                            for (let i = 0; i < reversedEndDates.length; i = i + 2) {
                                guides.push({
                                    date: new Date(moment(reversedEndDates[i], "YYYYMMDD").add(1, 'days')),
                                    toDate: new Date(moment(reversedEndDates[i + 1], "YYYYMMDD").add(1, 'days')),
                                });
                            }
                            //  console.log("guides=", guides);
                            parsedData.guides = guides;
                            that.transformedParsedData = parsedData;
                        }
                    },
                    fail: function (data) {
                        console.log("ajax call failed.");
                        console.log(data);
                    }
                });
            },
            getLineData() {
                console.log("getLineData() starting.");
                // console.trace();                
                this.$refs[this.namespace].removeChart();

                if (this.program === "OpenSpreads") {
                    // console.log("create 'Open Spreads'");
                    let commodity = this.$store.getters[this.namespace + "/c"][0]
                    let spreads = OpenSpreads(commodity, this.numberOfContractsApart);
                    console.log("spreads=", spreads);
                    this.$store.commit(this.namespace + '/setSelected', spreads);
                    this.$store.commit(this.namespace + '/setLegs', parseInt(this.numberOfContractsApart) === 0 ? 1 : 2);
                }

                let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                // generalForm.program = "LongTermCharts";
                // generalForm.study = "stacked";
                // generalForm.generator = "SeasonalsGenerator";  // "LongTermCandlesticksGenerator";

                delete generalForm.browserSideOnly;
                delete generalForm.playback;
                delete generalForm.chartParameters;

                //console.log("generalForm=", generalForm);

                let that = this;
                if (generalForm.selected.length === 0) {
                    this.transformedParsedData = {};
                } else {
                    this.$store.commit('incrementNumberOfAjaxCalls');
                    let json = JSON.stringify(generalForm, null, 2);
                    let url = this.$store.state.siteData.baseUrl + this.$store.state.siteData.contextName + "/SeriesControllerServlet";
                    $.ajax({
                        url: url,
                        type: "POST",
                        data: {"json": json},
                        success: function (data) {
                            that.$store.commit('decrementNumberOfAjaxCalls');
                            let temp = JSON.parse(data);
                            // console.log("temp=", JSON.parse(JSON.stringify(temp)));

                            let parsedData = {};
                            if (temp === null) {
                                that.transformedParsedData = {};
                            } else {
                                parsedData.values = Object.entries(temp).map(entry => {
                                    // console.log("entry=", entry);
                                    // console.log("entry[1]=", entry[1]);
                                    let obj = entry[1];
                                    obj.date = moment(entry[0], "YYYYMMDD").format("YYYY-MM-DD");
                                    //  console.log("obj=", obj);
                                    return obj;
                                }).filter(x => x.date !== "Invalid date");
                                // console.log("parsedData=", parsedData);

                                if (typeof parsedData.values !== 'undefined') {
                                    /*  parsedData.forEach(x => {
                                     if (x[1] !== null) {
                                     x[1] = x[1].toFixed(digits);
                                     }
                                     }); // This is for the seasonal.  */
                                    //  console.log("parsedData=", JSON.parse(JSON.stringify(parsedData)));
                                    parsedData.eye = that.$store.state[that.namespace].chartParameters.eye;

                                    let names = generalForm.selected;
                                    // console.log("names=", names);


                                    let colors;
                                    if (generalForm.program === "OpenSpreads") {
                                        colors = names.map(x => {
                                            let secondLeg = x.replace(/\s+/g, '').split('/')[0];
                                            let month = contractNameDecomposer(secondLeg).monthSymbol;
                                            return monthToColor(month);
                                        });
                                    } else {
                                        colors = names.map(x => spreadToColor(x));
                                    }
                                    // console.log("colors=", colors);

                                    parsedData.names = names;
                                    parsedData.colors = colors;
                                }

                                let start = parsedData.values[0].date;
                                let end = parsedData.values[parsedData.values.length - 1].date;
                                that.$store.commit(that.namespace + "/chartParameters/setStart", start);
                                that.$store.commit(that.namespace + "/chartParameters/setEnd", end);

                                that.parsedData = parsedData;
                                that.transformParsedData();
                            }
                        },
                        fail: function (data) {
                            console.log("ajax call failed.");
                            that.$store.commit('decrementNumberOfAjaxCalls');
                            $("#progress").hide();
                            $("#button").show();
                            console.log(data);
                        }
                    });
                }
            }
        }
    };

</script>
