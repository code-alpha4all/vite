<template>
    <div>
         <div v-bind:id="this.namespace + 'OutputDiv'">     
        <div>
           <!-- <div>
             <b-sidebar id="sidebar-help" title="Help" shadow right>
                <div style="padding: 1rem;">
                    <h2 class="pb-5" style="font-weight: 600;">Stock Charts</h2>
                    <h3 class="pb-3">Indicators:<br>
                        <span style="font-size: 12px;">(the following indicators are available) </span>
                    </h3>
                    <h4><b>ATR: </b>Average True Range</h4>
                    <h4><b>BB: </b>Bollinger Bands</h4>
                    <h4><b>MACD: </b>Moving Average Convergence / Divergence</h4>
                    <h4><b>CCI: </b>Commodity Channel Index</h4>
                    <h4><b>RSI: </b>Relative Strength Index</h4>
                    <h4><b>SMA: </b>Simple Moving Average</h4>
                    <h4><b>VOL: </b>Volume and Open Interest</h4>
                    <h4><b>VP: </b>Volume Profile</h4><h4>Seasonals are made using the "average percentage method".</h4>
                    <h3 class="pt-5">Tools:</h3>
                    <h4><b>Show/Hide Label: </b>show or hide information labels on the chart.</h4>
                    <h4><b>P/L (Profit &amp; Loss calculator): </b>to measure the price difference in USD between two points selected with the mouse.</h4>
                    <h4><b>Download and Annotations: </b>accessible via the icon with a symbol at the top left of the graph</h4>
                    <hr>
                    <h4>Need support? Click
                            <router-link to="/support" id="support">here.</router-link></h4>
                </div>
             </b-sidebar>
            </div> -->

         <table v-if="namespace !== 'undefined'" style="text-align: left; margin-bottom: 0px; margin-top: 2px; vertical-align: bottom;
               width: 100%;"> 
            <tr style="text-align: left; margin-bottom: 0px; vertical-align: bottom;">
                <td>
            <b-container fluid style="width: auto; margin-top: 0px; background-color: white; margin-left: -15px;">
                <b-row align-h="start" align-v="end" style="background-color: white; width: auto; padding: 1px;" class="row no-gutters">
                    <b-col md="auto" style="margin-right: 1px; margin: 0px -4px -2px 16px; padding: 1px; width: auto; background-color: white">  
                        <stock-box v-bind:namespace="namespace"></stock-box>                      
                    </b-col>
                    <b-col cols="3">
                        <b-button-group style="border: 1px solid gray; background-color: #E8E8E8;
                                        margin: 3px 1px 1px 6px; border-radius: 3px;">      

                            <chart-features v-bind:namespace="namespace"></chart-features>

                            <toggle-single-throw v-if="['admin', 'superadmin'].includes($store.state.user.role)" v-bind:namespace="namespace"
                                                 v-bind:property="'showPlaybackControl'" v-bind:label="'playback'" style="margin: 0px"></toggle-single-throw>
                            <toggle-single-throw v-bind:namespace="namespace" :id="'profit-loss-toggle-'+namespace"
                                                 v-bind:property="'addProfitLoss'" v-bind:label="'P/L'" style="margin: 0px"></toggle-single-throw>
                        </b-button-group>
                    </b-col>
                </b-row>
            </b-container>
            </td>
            </tr>
            <tr>
                <td>

                </td>
            </tr>
         </table>
        </div>

        <div>
    <table style="width: 100%">
        <tr>
            <td>
                <span :id="'chartcontrols-' + namespace"></span>

<span style="border: 1px solid rgb(233, 231, 231); border-radius: 4px; font-size: 11px; height: 25px;
      padding: 2px 3px 3px 3px; margin: 2px 0 -2px 2px; display: inline-block">
    <span style="font-weight: bold; font-size: 12px; margin: 0 0px 0 2px;"> {{ title }}: </span> 
    <span :id="'date-' + this.namespace" class="legend" style="padding-right: 5px"></span>
    <span :id="'open-' + this.namespace" class="legend" style="width: 9ch"><b></b></span>
    <span :id="'high-' + this.namespace" class="legend" style="width: 9ch"><b></b></span>
    <span :id="'low-' + this.namespace" class="legend" style="width: 9ch"><b></b></span>
    <span :id="'close-' + this.namespace" class="legend" style="width: 9ch"><b></b></span>
    <span :id="'volume-' + this.namespace" class="legend" style="width: 9ch"><b></b></span>
    <span :id="'seasonal-' + this.namespace" class="legend" style="width: 9ch; white-space: nowrap"></span>
</span>



            </td>
        </tr>
        </table>   
        </div>
    </div> 
        <basic-chart v-bind:ref="namespace + '-basic-chart'"
                    style="margin: 0 0 0 0px"
                     v-bind:namespace="namespace"  
                     v-bind:div-name="namespace+'-chartDiv'"></basic-chart>  
    </div>
</template>

<style scoped>
    .legend {
        margin: 0 3px 0 3px;
    }
</style>

<script>

    import basicChart from "@/components/am5charts-basic-chart";
    import {spreads} from "@/js/am4charts-plugins/am4charts.spread-bars.js";
    import moment from 'moment';
    import $ from "jquery";
    import { spreadTitle } from "@/js/main.js";

    import stockBox from '@/components/stock-box';
    import toggleSingleThrow from '@/components/toggle-single-throw';
    //import tradeSpecs from '@/components/trade-specs';
    import chartFeatures from "@/components/chart-features";

   // import * as fb from "@/firebase";

    export default {
        components: {
            basicChart,
            stockBox,
            toggleSingleThrow,
            chartFeatures
        },
        mounted() {
           // console.log("stock-chart-output.vue mounted() starting. this.namespace=", this.namespace);
            this.$store.commit(this.namespace + '/setTabTitle', this.ticker);          

            if (this.activeModuleName === this.namespace && !this.initialized) {
                    this.initialized = true;
                   // console.log("symbolArray=", this.symbolArray);
                    this.symbolArray.slice(0, this.$store.state[this.namespace].legs).forEach((x, i) => {
                       // console.log("x=", x);
                        this.getData(x, i);
                    });
            }

            let observer = new ResizeObserver(entries => {
                // console.log("ResizeObserver() starting. this.namespace=", this.namespace, " activeModuleName=", this.$store.getters['activeModuleName']);
                if (this.$store.getters['activeModuleName'] === this.namespace) {
                    // console.log("checking input height.");
                    for (let entry of entries) {
                       // console.log("entry=", entry);
                        // Now do something with the resized element
                        console.log("entry.contentRect.height=", entry.contentRect.height);
                        this.$store.commit(this.namespace + '/browserSideOnly/setOutputDivHeight', entry.contentRect.height);
                    }
                }
            });
            observer.observe(document.querySelector('#' + this.namespace + 'OutputDiv'));
        },
        props: ['namespace'],
        data: function () {
            return{
                parsedData: null,
                parsedDataArray: Array(2),
                initialized: false,
                error: null,
            }
        },
        computed: {
            ticker() {
                return this.$store.getters[this.namespace + "/ticker"];
            },
            legs() {
                return this.$store.state[this.namespace].legs;
            },
            symbolArray() {
                return this.$store.state[this.namespace].stockArray.slice(0).map(x => x.split(',')[0].replace(/\s/g, ''));
                // return this.ticker.replace(/\s+/g, '').split('+').join(', ').split('-').join(', ').split(', ');
            },
            symbol1() {
                return this.symbolArray[0];
            },
            symbol2() {
                return this.symbolArray[1];
            },
            mult1() {
                return this.$store.state[this.namespace].mult[0];
            },
            mult2() {
                return this.$store.state[this.namespace].mult[1];
            },
            activeModuleName() {
                let activeModuleName = this.$store.getters['activeModuleName'];
                // console.log("activeModuleName=", activeModuleName);
                return activeModuleName;
            },
            truncate() {
                return this.$store.state[this.namespace].truncate;
            },
            stockDataSource(){
                return this.$store.state[this.namespace].stockDataSource;
            },
            title(){
                let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                return spreadTitle(generalForm);
            }
        },
        watch: {
            truncate() {
                console.log("watching truncate");
                //this.truncateData();
                console.log("symbolArray=", this.symbolArray);
                    this.symbolArray.slice(0, this.$store.state[this.namespace].legs).forEach((x, i) => {
                        console.log("x=", x);
                        this.getData(x, i);
                    });            },
            ticker: function (ticker) {
                console.log("watch ticker=", ticker);
                this.$store.commit(this.namespace + '/setTabTitle', ticker);
            },
            symbol1: function (newSymbol1, oldSymbol1) {
                console.log("watch newSymbol1=", newSymbol1, " oldSymbol1=", oldSymbol1);
                let legIndex = 0;
                this.getData(newSymbol1, legIndex);
            },
            symbol2: function (newSymbol2, oldSymbol2) {
                console.log("watch newSymbol2=", newSymbol2, " oldSymbol2=", oldSymbol2);
                let legIndex = 1;
                if (typeof newSymbol2 !== 'undefined') {
                    this.getData(newSymbol2, legIndex);
                }
            },
            mult1: function (mult1) {
                console.log("watch mult1=", mult1);
                this.update();
            },
            mult2: function (mult2) {
                console.log("watch mult2=", mult2);
                this.update();
            },
            legs: function (legs) {
                console.log("watch legs=", legs);
                console.log("symbolArray=", this.symbolArray);

                let newArray = this.$store.state[this.namespace].stockArray.slice(0, 1);
                this.$store.commit(this.namespace + '/setStockArray', newArray);

                if (legs === 1) {
                    this.update();
                } else {
                    console.log("this.newSymbol2=", this.newSymbol2);
                    if (typeof this.newSymbol2 !== 'undefined') {
                        this.getData(this.newSymbol2, 1);
                    }
                }
            },
            activeModuleName: function (activeModuleName) {
               // console.log("activeModuleName=", activeModuleName, " namespace=", this.namespace, " this.initialized=", this.initialized);
                if (activeModuleName === this.namespace && !this.initialized) {
                    this.initialized = true;
                    //this.getData();
                    console.log("symbolArray=", this.symbolArray);
                    this.symbolArray.slice(0, this.$store.state[this.namespace].legs).forEach((x, i) => {
                       // console.log("x=", x);
                        this.getData(x, i);
                    });
                }
            },
            stockDataSource: function (stockDataSource) {
                console.log("watch stockDataSource=", stockDataSource);
                console.log("symbolArray=", this.symbolArray);
                    this.symbolArray.slice(0, this.$store.state[this.namespace].legs).forEach((x, i) => {
                        console.log("x=", x);
                        this.getData(x, i);
                    });    
            },
        },
        methods: {
            getData(ticker, legIndex) {
               // console.log("stock-chart-output.vue getData() starting. ticker=", ticker);
                this.$store.commit('resetNumberOfAjaxCalls');
                this.$store.commit('incrementNumberOfAjaxCalls');
               // console.log("symbolArray=", this.symbolArray);

               // let open = moment().subtract(this.$store.state[this.namespace].truncate, 'years').format("YYYY-MM-DD");
                // console.log("open=", open);

               // let url = "https://app.charts.alpha4all.it/rapi.php?symbols=" + ticker.split(',')[0].replace(/\s/g, '') + "&start=" + open;
                let url = "https://app.charts.alpha4all.it/history_y.php?symbol="+ticker;
                console.log("calling alpha4all.it server for ", ticker);
               // console.log("url=", url);
                let that = this;
                $.ajax({
                    url: url,
                    type: "POST",
                    success: function (data) {
                        that.$store.commit('decrementNumberOfAjaxCalls');
                       // console.log("data=", data);
                        let parsedData = JSON.parse(data);
                        console.log("parsedData=", parsedData);

                        let dataLength = parsedData.data.length;
                        console.log("dataLength=", dataLength);

                        if(dataLength === 0){
                            console.log("no data");
                            that.error = "Data is not available for this stock.";
                        } else {
                            that.error = null;

                        parsedData.values = parsedData.data;
                       // console.log("parsedData.values=", parsedData.values);
                        if (parsedData.values !== null) {
                            parsedData.values.forEach(x => {
                                x.date = moment.utc(x.Date).format("YYYY-MM-DD");
                                x.open = x.Open.toFixed(2);
                                x.high = x.High.toFixed(2);
                                x.low = x.Low.toFixed(2);
                                x.close = x.Close.toFixed(2);
                                x.volume = x.Volume;

                                delete x.Date;
                                delete x["Adj Close"];
                                delete x.Open;
                                delete x.High;
                                delete x.Low;
                                delete x.Close;
                                delete x.Volume;
                                return x;
                            });

                           // parsedData.title = that.stock;
                           // console.log("parsedData=", parsedData);
                            that.parsedDataArray[legIndex] = parsedData;
                           console.log("that.parsedDataArray=", JSON.parse(JSON.stringify(that.parsedDataArray)));

                            that.update();
                        }
                    }
                    },
                    fail: function (data) {
                        that.$store.commit('decrementNumberOfAjaxCalls');
                        console.log("ajax call failed.");
                        $("#progress").hide();
                        $("#button").show();
                        console.log(data);
                    }
                });
            },
            update() {
                console.log("update() starting.");

                /*    console.log("this.$store.state[this.namespace].stockArray=", JSON.stringify(this.$store.state[this.namespace].stockArray));
                 console.log("this.oldStockArray=", JSON.stringify(this.oldStockArray));
                 if (JSON.stringify(this.$store.state[this.namespace].stockArray) !== JSON.stringify(this.oldStockArray)) {
                 console.log("this.$refs=", this.$refs);
                 let parsedDataArray = Object.values(this.$refs).slice(0, this.$store.state[this.namespace].legs).map(x => x[0].parsedData);
                 console.log("parsedDataArray=", JSON.parse(JSON.stringify(parsedDataArray))); */

                let that = this;
                let ready = !this.parsedDataArray.some(x => typeof x.values === 'undefined');
               // console.log("ready=", ready);

                if (!ready) {
                   // console.log("Waiting for data from other leg.");
                } else {
                   // console.log("Calculating spread.");

                    let combinedSeries = [];
                    let series = this.parsedDataArray.slice(0, this.$store.state[this.namespace].legs).map(x => x.values);
                    console.log("series=", series);

                    series.forEach(function (x, index) {
                        console.log("index=", index);
                       // console.log("x=", x);

                        x.forEach(z => {
                            // console.log("z=", z);
                            let dailyBar = {...z};
                           // dailyBar.date = dailyBar.tradingDay;
                            if (index == 0) {
                                let open = [], high = [], low = [], close = [];

                                open.push(dailyBar.open);
                                high.push(dailyBar.high);
                                low.push(dailyBar.low);
                                close.push(dailyBar.close);

                                dailyBar["open"] = open;
                                dailyBar["high"] = high;
                                dailyBar["low"] = low;
                                dailyBar["close"] = close;

                                /*   if (series.length === 1) {
                                 dailyBar["volume"] = dailyBar.volume;
                                 dailyBar["openInterest"] = dailyBar.openInterest;
                                 }   */
                                combinedSeries.push(dailyBar);
                            } else {
                                let obj = combinedSeries.find(x => x.date === dailyBar.date);
                                if (typeof obj !== 'undefined') {
                                    obj.open.push(dailyBar.open);
                                    obj.high.push(dailyBar.high);
                                    obj.low.push(dailyBar.low);
                                    obj.close.push(dailyBar.close);
                                }
                            }
                        });
                    });
                   // console.log("series=", series);
                    console.log("combinedSeries=", combinedSeries);
                    let mult = this.$store.state[this.namespace].mult;
                    let p = this.$store.state[this.namespace].p;
                    let totalMult = [];
                    for (let leg = 0; leg < 2; leg++) {
                        totalMult[leg] = mult[leg] * p[leg];
                    }
                    let spreadSeries = spreads(combinedSeries, totalMult);
                   // console.log("spreadSeries=", spreadSeries);

                    let parsedData = {};
                    parsedData.values = spreadSeries;
                    parsedData.title = "spread title";
                   // this.parsedData = parsedData;
                    // console.log("this.parsedData=", this.parsedData);
                    that.$refs[that.namespace + '-basic-chart'].createChart(parsedData);
                }
            }
        }
    };

</script>
