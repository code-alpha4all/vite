<template>
    <div style="margin: 0px; width: 100%">

       <!-- browserSideOnly.inputDivWidth:{{ browserSideOnly.inputDivWidth }}  -->

        <div style="font-size: 13px; padding: 4px 0 2px 10px">
            The charts below are not interactive. Click on a chart to go to an interactive version.
        </div>
        <div id="errorDiv"></div>
        <history-chart v-bind:namespace="namespace"  
                       :ref="namespace + '_historyChartsRef'"
                       :divName="namespace + 'historyChartsDiv'">
        </history-chart>

        <h6 style="color: red; margin: 14px;">{{ error }}</h6>

        <div :id="namespace + 'charts'"></div>

    </div>
</template>

<style scoped>

    svg {
        margin: 2px;
        overflow: visible;
        cursor: pointer;
    }

</style>

<script>
    import * as am4core from "@amcharts/amcharts4/core";
    import * as am4charts from "@amcharts/amcharts4/charts";
    import {spreadToColor, nearestOpenSpread, spreadTitle, yearToColor, contractNameDecomposer, listOptions} from "@/js/main";
    import historyChart from './history-chart';
    import $ from 'jquery';
    import moment from "moment";
    import _ from "lodash";

    export default {
        components: {
            historyChart
        },
        mounted() {
            console.log("static-charts-output.vue mounted() starting. this.namespace=", this.namespace);

            this.$store.commit(this.namespace + '/setTabTitle', "history: " + this.displayTickerWithUnitMoves);
            if (this.activeModuleName === this.namespace && !this.initialized) {
                this.createCharts();
            }
        },
        props: {
            namespace: {
                type: String,
                default: ""
            },
            divName: {
                type: String,
                default: "chartDiv"
            }
        },
        data: function () {
            return {
                count: 0,
                data: null,
                initialized: false,
                error: null
            };
        },
        computed: {
            numberOfChartsPerBatch() {
                return this.selectedArray.length - 1;
            },
            ticker() {
                return this.$store.getters[this.namespace + "/ticker"];
            },
            selectedArray() {
                let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                let closed = listOptions(generalForm).filter(x => !x.open).map(x => x.value);
                let nearestOpen = nearestOpenSpread(generalForm).value;

                closed.unshift(nearestOpen);
                // console.log("closed=", closed);
                return closed;
            },
            activeModuleName() {
                let activeModuleName = this.$store.getters['activeModuleName'];
                // console.log("activeModuleName=", activeModuleName);
                return activeModuleName;
            },
            height() {
                // let availableHeight = $("#chartDiv").height();
                // console.log("availableHeight=", availableHeight);
                return this.$store.state[this.namespace].chartParameters.height;
            },
            width() {
                return this.$store.state[this.namespace].chartParameters.width;
            },
            nearestOpen() {
                let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                return nearestOpenSpread(generalForm).value;
            },
            open() {
                return this.$store.state[this.namespace].open;
            },
            close() {
                return this.$store.state[this.namespace].close;
            },
            showTradingPeriod() {
                return this.$store.state[this.namespace].showTradingPeriod;
            },
            buySell() {
                return this.$store.state[this.namespace].buySell;
            },
            chartsPerRow() {
                console.log("chartsPerRow.set() starting");
                return this.$store.state[this.namespace].chartParameters.chartsPerRow;
            },
            currentValues() {
                return this.data.values.map(bar => bar[this.nearestOpen]).filter(x => typeof x !== 'undefined');
            },
            maxCurrentValues() {
                return Math.max(...this.currentValues);
            },
            minCurrentValues() {
                return Math.min(...this.currentValues);
            },
            displayTickerWithUnitMoves() {
                return this.$store.getters[this.namespace + "/displayTickerWithUnitMoves"];
            },            
            browserSideOnly() {
                return this.$store.state[this.namespace].browserSideOnly;
            },  
        },
        watch: {
            activeModuleName: function (activeModuleName) {
                console.log("watching activeModuleName=", activeModuleName, " namespace=", this.namespace, " this.initialized=", this.initialized);
                if (activeModuleName === this.namespace && !this.initialized && this.ticker !== null) {
                    this.createCharts();
                }
            },
            ticker: function (newTicker, oldTicker) {
                console.log("watch: newTicker=", newTicker, " oldTicker=", oldTicker, " namespace=", this.namespace);
                // let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                //console.log("generalForm=", generalForm);
                // console.log("typeof this.$refs[this.namespace] =", typeof this.$refs[this.namespace] );

                // let options = listTickerOptions(generalForm).map(x => x.value);
                // console.log("options=", options);

                if (newTicker !== null && newTicker !== oldTicker/* && !options.includes(newTicker)*/) {
                    // console.log("title=", this.$refs[this.namespace].$options.chart.titles.values[0].text);
                    /*  if (typeof this.$refs[this.namespace] !== 'undefined' &&
                     typeof this.$refs[this.namespace].$options.chart.titles !== 'undefined') {
                     this.$refs[this.namespace].$options.chart.titles.values[0].text = newTicker + " . . .  ";
                     } */
                    this.$store.commit(this.namespace + '/setTabTitle', "history: " + this.displayTickerWithUnitMoves);
                    this.createCharts();
                }
            },
            open: function () {
                // console.log("watch: open=", open);
                this.createCharts();
            },
            close: function () {
                // console.log("watch: close=", close);
                this.createCharts();
            },
            showTradingPeriod: function (showTradingPeriod) {
                console.log("watch showTradingPeriod = ", showTradingPeriod);
                this.createCharts();
            },
            buySell() {
                console.log("watching buySell");
                this.createCharts();
            },
            chartsPerRow() {
                console.log("watching chartsPerRow");
                this.createCharts();
            },
            inputDivWidth() {
                console.log("watching inputDivWidth");
                this.createCharts();
            }
        },
        methods: {
            createDivArray() {
                console.log("createDivArray() starting.");
                let elem = document.getElementById(this.namespace + "charts");
                // elem.innerHTML = "";

                for (let i = 0; i < this.selectedArray.length / this.chartsPerRow; i++) {
                    // console.log("i=", i);
                    const div = document.createElement("div");
                    // div.style.height = "auto";
                    // div.style.width = "auto";
                    div.style.border = "0px solid gray";
                    div.id = "chart" + i;
                    elem.append(div);
                }
                console.log("elem=", elem);
            },
            getChart(ticker) {
                console.log("getChart() starting. ticker=", ticker);
               // console.log("this.nearestOpenTicker=", this.nearestOpenTicker);

                let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                generalForm.selected = [ticker, this.nearestOpen];
                generalForm.program = "BasicChartsNew";
                generalForm.aligned = true;

                this.$store.commit("user/setInitializingState", generalForm);
                this.$store.dispatch('newTab', "BasicChartsNew")
            },
            createCharts: _.debounce(function () {
                if (this.activeModuleName === this.namespace) {
                    console.log("createCharts() starting.");

                    $('#errorDiv').empty();

                    this.initialized = true;
                    // console.log("this.count=", this.count);
                    this.count = 0;

                    let that = this;
                    let div = document.getElementById(that.namespace + "charts");
                    div.innerHTML = "";

                    this.data = this.getData().then(dataResult => {
                        console.log("dataResult=", dataResult);

                        if (dataResult !== "No open positions.") {
                            that.data = dataResult;
                            that.$refs[that.namespace + '_historyChartsRef'].createTemplateChart(dataResult).then(() => {
                                that.createDivArray();
                                that.processNextChart();
                            });
                        }
                    });
                }
            }, 200),
            getData() {
                console.log("getData() starting. this.nearestOpen=", this.nearestOpen);

                let that = this;
                return new Promise(resolve => {
                    if (!this.nearestOpen) {
                        console.log("Not trading.");
                        this.error = "No open positions.";
                        resolve("No open positions.");
                    } else {
                        this.error = null;


                        // if (this.count < this.numberOfChartsPerBatch) {

                        let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                        generalForm.instrument = "future";
                        generalForm.program = "History";
                        generalForm.aligned = true;

                       // delete generalForm.browserSideOnly;
                        delete generalForm.playback;
                        delete generalForm.chartParameters;
                        delete generalForm.indicators;
                        // console.log("generalForm=", generalForm);

                      //  let invertDatesMultiplier = 1;
                      //  let noLegSwapping = true;
                        generalForm.selected = [this.nearestOpen];
                     //   this.nearestOpenTicker = spreadTitle(JSON.parse(JSON.stringify(generalForm)), invertDatesMultiplier, noLegSwapping);
                        // console.log("this.nearestOpenTicker=", this.nearestOpenTicker);

                        // console.log("this.selectedArray=", this.selectedArray.slice());
                        generalForm.selected = this.selectedArray;

                        let colors = [spreadToColor(generalForm.selected[1]), "darkgray"];
                        // console.log("colors=", colors);

                        this.$store.commit('resetNumberOfAjaxCalls');
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
                                let names = new Set();
                                parsedData.values = Object.entries(temp).map(entry => {
                                    // console.log("entry=", entry);
                                    // console.log("entry[1]=", entry[1]);
                                    let obj = entry[1];
                                    obj.date = moment(entry[0], "YYYYMMDD").format("YYYY-MM-DD");
                                    //  console.log("obj=", obj);
                                    let keys = Object.keys(obj);
                                    // console.log("keys=", keys);
                                    keys.forEach(item => names.add(item));

                                    return obj;
                                }).filter(x => x.date !== "Invalid date");
                                // console.log("parsedData=", JSON.parse(JSON.stringify(parsedData)));

                                parsedData.colors = colors;
                                parsedData.names = generalForm.selected;

                                // console.log("parsedData=", parsedData);
                                resolve(parsedData);
                            },
                            fail: function (data) {
                                console.log("ajax call failed.");
                                $("#progress").hide();
                                $("#button").show();
                                console.log(data);
                            }
                        });
                    }
                });
            },
            createImage(ticker) {
                // console.log("createImage() starting.");
                // console.trace();
                let index = Math.floor((this.count - 1) / this.chartsPerRow);
                let div = document.getElementById("chart" + index);
                // console.log("div=", div); // Prevents error message to console.

                let that = this;
                am4core.registry.events.once("exitframe", function () {
                    let target = that.$refs[that.namespace + '_historyChartsRef'].$options.chart;
                    let svg = target.exporting.normalizeSVG(
                            target.exporting.serializeElement(target.dom), {},
                            target.pixelWidth, target.pixelHeight, 1);

                    const span = document.createElement("span");
                    span.style.display = "inline-block";
                    span.style.height = "auto";
                    span.style.cursor = "pointer";
                    span.style.margin = "2px";
                    span.style.border = "1px solid gray";
                    span.id = ticker;
                    span.innerHTML = svg;
                    span.onclick = function () {
                        // console.log("this.id=" + this.id);
                        that.getChart(this.id);
                    };

                    div.append(span);
                    that.processNextChart();
                });
            },
            processNextChart() {
                // console.log("processNextChart() starting.");
                if (this.count < this.numberOfChartsPerBatch) {
                    // Update chart and generate a snapshot
                    this.count++;

                    let chart = this.$refs[this.namespace + '_historyChartsRef'].$options.chart;
                    chart.zoomOutButton.disabled = true;

                    let oldSeries = chart.map.getKey("historical");
                    if (chart.series.indexOf(oldSeries) > -1) {
                        chart.series.removeIndex(chart.series.indexOf(oldSeries)).dispose(); //series.hide();  
                    }

                    let series = chart.series.push(new am4charts.LineSeries());
                    series.id = "historical";
                    series.dataFields.dateX = "date";
                    series.data = this.data.values;
                    series.dataFields.valueY = this.selectedArray[this.count];

                    let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                    let invertDatesMultiplier = 1;
                    let noLegSwapping = false;
                    generalForm.selected = [this.selectedArray[this.count]];
                    let includeUnitMoves = true;
                    let historyTicker = spreadTitle(JSON.parse(JSON.stringify(generalForm)), invertDatesMultiplier, noLegSwapping, this.symbols, includeUnitMoves);
                    series.name = historyTicker;

                    let title = chart.titles.values[0];
                    //  console.log("title=", title);
                    title.fontSize = 11;
                    title.fontWeight = "bold"; // Can't set fontWeight when color is specified.
                    title.marginTop = -8;
                    title.marginBottom = 6;

                    title.text = historyTicker;

                    series.hiddenInLegend = false;
                    series.legendSettings.labelText = "[{color}]{name}:[/]";
                    series.legendSettings.itemValueText = "[{color}]{valueY}";
                    series.tooltipText = "[{color}]{name}: [/][{color}]{valueY}";
                    series.tooltip.getFillFromObject = true;

                    let firstLeg = this.selectedArray[this.count].split('/')[0];
                    //console.log("firstLeg=", firstLeg);
                    let color = yearToColor(contractNameDecomposer(firstLeg).year);
                    series.stroke = color;
                    series.strokeWidth = 1;
                    series.fill = color;
                    series.showOnInit = false;
                    series.getFillFromObject = true;

                    series.hiddenInLegend = false;
                    series.legendSettings.labelText = "[{color}]{name}[/]";
                    series.legendSettings.itemValueText = "[{color}]{valueY}";
                    series.tooltipText = "[{color}]{name}: [/][{color}]{valueY}";
                    series.tooltip.getFillFromObject = true;

                    let historicalValues = this.data.values.map(bar => bar[this.selectedArray[this.count]]).filter(x => typeof x !== 'undefined');
                    // console.log("historicalValues=", historicalValues);

                    let max = Math.max(this.maxCurrentValues, ...historicalValues);
                    let min = Math.min(this.minCurrentValues, ...historicalValues);

                    let that = this;
                    series.events.once("dataitemsvalidated", function () {
                        setTimeout(function () {
                            /* let minYZoomed = mainAxis._minZoomed;
                             let maxYZoomed = mainAxis._maxZoomed;
                             console.log("minYZoomed=", minYZoomed, " maxYZoomed=", maxYZoomed); 
                             mainAxis.zoomToValues(minYZoomed, maxYZoomed); */

                            let mainAxis = chart.map.getKey("main-axis");
                            // console.log("mainAxis=", mainAxis);

                            mainAxis.zoomToValues(min, max);
                            that.createImage(generalForm.selected);
                        }, 50);
                    });
                } else {
                    // We're done - no more data. Dispose chart.
                    this.$refs[this.namespace + '_historyChartsRef'].$options.chart.dispose();
                }
            }
        }
    };
</script>
