<template>
    <div style="margin: 0px; width: 100%;">

        <calculator-chart v-if="program === 'Calculator' && showCalculatorChart"
                          v-bind:ref="namespace" v-bind:namespace="namespace"  
                          v-bind:div-name="namespace+'-calculatorChartDiv'" 
                          v-bind:parsedData="tradeChartParsedData"
                          v-bind:height="height"
                          v-bind:width="width"
                          style="border: 0px solid gray;"></calculator-chart>  

        <div v-bind:id="namespace+'-tradeTableDiv'">
            <trade-table v-if="program === 'Calculator'" v-bind:namespace="namespace" v-bind:parsedData="tradeTableParsedData" v-bind:width="width"
                 style="border-left: 0px solid gray; border-right: 0px solid gray; border-bottom: 0px solid gray;"></trade-table>

            <trade-table-for-trade-map v-if="program === 'TradeMaps'" v-bind:namespace="namespace" v-bind:parsedData="tradeTableParsedData" v-bind:width="width"
                 style="border-left: 0px solid gray; border-right: 0px solid gray; border-bottom: 0px solid gray;"></trade-table-for-trade-map>
        </div>

    </div>
</template>

<script>
    import tradeTable from '@/components/trade-table';
    import tradeTableForTradeMap from '@/components/trade-table-for-trade-map';
    
    import moment from 'moment';
    import $ from "jquery";
    import calculatorChart from '@/components/am4charts-calculator-chart';
    import _ from 'lodash';

    export default {
        components: {
            tradeTable, tradeTableForTradeMap, calculatorChart
        },
        created() {
            // console.log("created() started.");
        },
        mounted() {
            // console.log("calculator-output.vue mounted() starting. this.width=", this.width);
            let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
            if (generalForm.program === "Calculator") {
                this.$store.commit(this.namespace + '/setTabTitle', "calc: " + this.displayTickerWithUnitMoves);
            }

            if (!this.initialized) {
                this.getData();
            }
        },
        props: {
            namespace: {
                type: String,
                default: ""
            },
            height: {
                type: String,
                default: "250px"
            },
            width: {
                type: String,
                default: "100%"
            }
        },
        data: function () {
            return{
                tradeTableParsedData: null,
                tradeChartParsedData: null,
                parsedData: null,
                initialized: false,
                title: null
            }
        },
        computed: {
            openMonth() {
                return this.$store.getters[this.namespace + '/openMonth'];
            },
            openDate() {
                return this.$store.getters[this.namespace + '/openDate'];
            },
            closeMonth() {
                return this.$store.getters[this.namespace + '/closeMonth'];
            },
            closeDate() {
                return this.$store.getters[this.namespace + '/closeDate'];
            },
            totalDate() {
                return this.openMonth + " " + this.openDate + " " + this.closeMonth + " " + this.closeDate;
            },
            ticker() {
                return this.$store.getters[this.namespace + "/ticker"];
            },
            displayTickerWithUnitMoves() {
                return this.$store.getters[this.namespace + "/displayTickerWithUnitMoves"];
            },
            activeModuleName() {
                let activeModuleName = this.$store.getters['activeModuleName'];
                // console.log("activeModuleName=", activeModuleName);
                return activeModuleName;
            },
            y1() {
                return this.$store.state[this.namespace].y1;
            },
            program() {
                return this.$store.state[this.namespace].program;
            },
            symbols() {
                return this.$store.state.user.symbols;
            },
            showCalculatorChart(){
                return this.$store.state[this.namespace].showCalculatorChart;
            }
        },
        watch: {
            totalDate: function (newTotalDate, oldTotalDate) {
                console.log("watch: newTotalDate=", newTotalDate, " oldTotalDate=", oldTotalDate);
                this.getData();
            },
            ticker: function (newTicker, oldTicker) {
              //  console.log("watch: newTicker=", newTicker, " oldTicker=", oldTicker, " namespace=", this.namespace);
                let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                //console.log("generalForm=", generalForm);
                // console.log("typeof this.$refs[this.namespace] =", typeof this.$refs[this.namespace] );

                this.tradeTableParsedData = {};
                //this.tradeChartParsedData = [];

                if (newTicker !== null && newTicker !== oldTicker) {
                    // console.log("title=", this.$refs[this.namespace].$options.chart.titles.values[0].text);
                    if (typeof this.$refs[this.namespace] !== 'undefined' &&
                            typeof this.$refs[this.namespace].$options.chart.titles !== 'undefined') {
                        this.$refs[this.namespace].$options.chart.titles.values[0].text = newTicker + " . . .  ";
                    }
                    this.getData();
                    if (generalForm.program === "Calculator") {
                        this.$store.commit(this.namespace + '/setTabTitle', "calc: " + this.displayTickerWithUnitMoves);
                    }
                }
            },
            activeModuleName: function (activeModuleName) {
                console.log("activeModuleName=", activeModuleName, " namespace=", this.namespace, " this.initialized=", this.initialized);
                if (activeModuleName === this.namespace && !this.initialized && this.ticker !== null) {
                    this.getData();
                }
            },
            y1(y1) {
                console.log("watch: y1=", y1);
                this.getData();
            },
            symbols(symbols) {
                console.log("watch: symbols=", symbols);
                let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                if (generalForm.program === "Calculator") {
                    console.log("this.displayTickerWithUnitMoves=", this.displayTickerWithUnitMoves);
                    this.$store.commit(this.namespace + '/setTabTitle', "calc: " + this.displayTickerWithUnitMoves);
                }
            }
        },
        methods: {
            getData: _.debounce(function () {
              //  console.log("getData() starting.");
                this.initialized = true;
                this.$store.commit('resetNumberOfAjaxCalls');
                this.$store.commit('incrementNumberOfAjaxCalls');
                // console.log("this.$refs=", this.$refs);

                this.tradeTableParsedData = {};
                if (typeof this.$refs[this.namespace] !== 'undefined') {
                    this.$refs[this.namespace].removeChart();
                }
                //  $('#' + this.namespace + '-tradeTableDiv').css('visibility', 'hidden');

                let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                this.trades = [];

                generalForm.study = "calculator";
                generalForm.generator = "SeasonalsGenerator";
                generalForm.showTradingPeriod = true;
                generalForm.openMonth = this.openMonth;
                generalForm.openDate = this.openDate;
                generalForm.closeMonth = this.closeMonth;
                generalForm.closeDate = this.closeDate;

                delete generalForm.browserSideOnly;
                delete generalForm.playback;
                delete generalForm.search;
                delete generalForm.indicators;
                delete generalForm.chartParameters;
               // console.log("generalForm=", JSON.parse(JSON.stringify(generalForm)));

                let json = JSON.stringify(generalForm, null, 2);
                let url = this.$store.state.siteData.baseUrl + this.$store.state.siteData.contextName + "/ControllerServlet2";
                let that = this;
                var currentRequest = $.ajax({
                    url: url,
                    type: "POST",
                    data: {"json": json},
                    beforeSend: function () {
                        // console.log("beforeSend starting.");
                        if (currentRequest != null) {
                            console.log("aborting previous request.");
                            currentRequest.abort();
                        }
                    },
                    success: function (data) {
                        //  $("#" + that.namespace + '-tradeTableDiv').css('visibility', 'visible');
                        // console.log("data=", data);
                        that.parsedData = JSON.parse(data);
                        that.loadData();
                    },
                    fail: function (data) {
                        console.log("ajax call failed.");
                        $("#progress").hide();
                        $("#button").show();
                        console.log(data);
                    }
                });
            }, 500),
            loadData() {
                console.log("loadData() starting.");
                this.$store.commit('decrementNumberOfAjaxCalls');
                this.tradeTableParsedData = this.parsedData;
                console.log("parsedData=", JSON.parse(JSON.stringify(this.parsedData)));
               // console.log("parsedData.values=", this.parsedData.values);

                if (this.program !== "TradeMaps") {

                    if (this.parsedData.open !== 0 && this.parsedData.close !== 0) {
                        this.$store.commit(this.namespace + '/setOpen', moment(this.parsedData.open, "YYYYMMDD").format("YYYY-MM-DD"));
                        this.$store.commit(this.namespace + '/setClose', moment(this.parsedData.close, "YYYYMMDD").format("YYYY-MM-DD"));
                    }

                    let chartJson = this.parsedData.chartJson; //.filter(x => typeof x.open !== 'undefined');
                    if (typeof chartJson !== 'undefined' && chartJson !== null) {
                        let temp = chartJson.reverse().map(x => {
                            x.open = moment(x.open, "YYYYMMDD").format("YYYY-MM-DD");
                            x.close = moment(x.close, "YYYYMMDD").format("YYYY-MM-DD");
                            x.year = x.year.toString(); // This prevents number formatting with insertion of commas.
                            // console.log("x=", {...x});
                            return x;
                        });

                        this.tradeChartParsedData = temp;
                    } else {
                        this.tradeChartParsedData = [];
                    }
                }
            }
        }
    };

</script>
