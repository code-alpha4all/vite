<template>
    <div>

        <div v-bind:id="namespace+'-error'"></div> 
        <basic-chart v-bind:ref="namespace"
                     v-bind:namespace="namespace"  
                     v-bind:div-name="namespace+'-chartDiv'"
                     v-bind:parsedData="parsedData"></basic-chart>  
    </div>
</template>

<script>

    import basicChart from '@/components/am5charts-basic-chart';
    // import {addSingleSeasonal} from "../../../js/am4charts-plugins/am4charts.single-seasonal";
    import $ from "jquery";
    //  import moment from 'moment';
    import {spreadTitle, spreadUnits, isSpreadOpen} from "@/js/main";

    export default {
        components: {
            basicChart
        },
        mounted() {
            console.log("basic-chart-output.vue mounted() starting.");
            this.$store.commit(this.namespace + '/setTabTitle', this.ticker);
        },
        props: ['namespace'],
        data: function () {
            return{
                parsedData: null,
                initialized: false
            }
        },
        computed: {
            ticker() {
                return this.$store.getters[this.namespace + "/ticker"];
            },
            activeModuleName() {
                return  this.$store.getters['activeModuleName'];
            },
            showPlaybackControl() {
                return this.$store.state[this.namespace].showPlaybackControl;
            }
        },
        watch: {
            ticker: function (newTicker, oldTicker) {
                console.log("watch newTicker=", newTicker, " oldTicker=", oldTicker, " namespace=", this.namespace);
                let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                if (newTicker !== null && newTicker !== oldTicker) {
                 // console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");
                  this.getData();
                    if (generalForm.program === "BasicCharts") {
                        this.$store.commit(this.namespace + '/setTabTitle', newTicker);
                    }
                }
            },
            activeModuleName: function (activeModuleName) {
                console.log("activeModuleName=", activeModuleName, " namespace=", this.namespace,
                        " this.initialized=", this.initialized);
                if (activeModuleName === this.namespace && !this.initialized) {
                 // console.log("CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC");
                    this.initialized = true;
                    this.getData();
                }
            }
        },
        methods: {
            normalizeForUnitMoveDifferencesBetweenBarchartAndEod(data, commodity) {
               // console.log("normalizeForUnitMoveDifferencesBetweenBarchartAndEod() starting. commodity=", commodity);

                let normalizationRatios = {
                    HG: 100,
                    SI: 100
                };

                let normalizedData;
                if (Object.keys(normalizationRatios).includes(commodity)) {
                  //  console.log("Normalizating data. data=", data);
                    normalizedData = data.map(x => {
                      //  console.log("x=", x);
                        ["open", "high", "low", "close"].forEach(y => {
                            x[y] = normalizationRatios[commodity] * x[y];
                        });
                        return x;
                    });
                } else {
                    normalizedData = data;
                }
                return normalizedData;
            },
            getData: function () {
                console.log("getData() starting.");
               // console.trace();
                this.initialized = true;
                this.$store.commit('incrementNumberOfAjaxCalls');
                // console.log("this.$refs=", this.$refs);
                this.$refs[this.namespace].removeChart();

                let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
               // console.log("generalForm=", generalForm);

                let isOpen = isSpreadOpen(generalForm.selected[0]);
               // console.log("isOpen=", isOpen);

                if (isOpen) {
                    this.$store.commit(this.namespace + '/setGeneralForm', generalFormToBarchartTicker(generalForm));
                } else {
                    this.$store.commit(this.namespace + '/setBarchartTicker', "");
                }
                generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
               // console.log("barchartTicker=", generalForm.barchartTicker);

                generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                delete generalForm.browserSideOnly;
                delete generalForm.chartParameters;
                delete generalForm.playback;
                generalForm.generator = "BasicBarsGenerator";
                generalForm.study = "basic";
              //  console.log("generalForm=", generalForm);

                let json = JSON.stringify(generalForm, null, 2);
                if (generalForm.selected.length > 0) {
                    let that = this;
                    var currentRequest = $.ajax({
                        url: this.$store.state.siteData.baseUrl + this.$store.state.siteData.contextName + "/BasicBarsControllerServlet/",
                        type: "POST",
                        data: {"json": json},
                        beforeSend: function () {
                          //  console.log("beforeSend starting.");
                            if (currentRequest != null) {
                              //  console.log("aborting previous request.");
                                currentRequest.abort();
                            }
                        },
                        success: function (data) {
                            // console.log("data=", data);
                            that.$store.commit('decrementNumberOfAjaxCalls');
                            let parsedData = JSON.parse(data);
                          //  console.log("parsedData=", parsedData);

                            if (parsedData.values === "none") {
                                that.parsedData = parsedData;
                          } else {
                           //     $('#' + that.namespace + "-error").hide();
                                let properties = Object.keys(parsedData);
                               // console.log("properties=", properties);
                                let contains = properties.includes("status");
                               // console.log("contains=", contains);
                               // console.log("parsedData=", parsedData);

                                if (!contains) {
                                  //  console.log("data source: eod");
                                    that.$store.commit(that.namespace + '/setDataSource', "eod");
                                    that.parsedData = parsedData;
                                } else {
                                   // console.log("data source: barchart");
                                    that.$store.commit(that.namespace + '/setDataSource', "barchart");
                                    parsedData = JSON.parse(data);
                                   // console.log("parsedData=", parsedData);
                                    let position = generalForm.spreadP;
                                    let spreadMult = generalForm.spreadMult;
                                    let commodity = that.$store.getters[that.namespace + '/c'][0];
                                   // console.log("commodity=", commodity);
                                   // console.log("spreadMult=", spreadMult);
                                  //  console.log("position=", position);

                                    let temp = parsedData.results.map(x => {
                                       // console.log("x=", x);
                                        let obj = {};
                                        obj.date = x.tradingDay;
                                        obj.open = position * spreadMult * x.open;
                                        obj.high = position > 0 ? position * spreadMult * x.high : position * spreadMult * x.low;
                                        obj.low = position > 0 ? position * spreadMult * x.low : position * spreadMult * x.high;
                                        obj.close = position * spreadMult * x.close;
                                        obj.volume = x.volume;
                                        obj.openInterest = x.openInterest;
                                        delete x.tradingDay;
                                        delete x.timestamp;
                                        delete x.symbol;
                                      //  console.log("obj=", obj);
                                        return obj;
                                    });
                                  //  console.log("temp=", temp);

                                    let normalizedTemp = that.normalizeForUnitMoveDifferencesBetweenBarchartAndEod(JSON.parse(JSON.stringify(temp)), commodity);
                                   // console.log("normalizedTemp=", normalizedTemp);

                                    let parsedData = {};
                                    parsedData.values = normalizedTemp.reduce((obj, item) => {
                                        obj[item["date"].replace(/-/g, "")] = item;
                                        return obj;
                                    }, {});

                                    parsedData.title = spreadTitle(generalForm); // + "  (" + symbol + ")";
                                    parsedData.units = spreadUnits(generalForm.selected[0]);
                                    // console.log(" basic-chart-output.vue getData() parsedData=", parsedData);
                                    that.parsedData = JSON.parse(JSON.stringify(parsedData));
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
                }
            }
        }
    };

</script>
