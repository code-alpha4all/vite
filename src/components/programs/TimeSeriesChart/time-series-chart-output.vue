<template>
    <div>


         <basic-chart v-bind:ref="namespace"
                     v-bind:namespace="namespace"  
                     v-bind:div-name="namespace+'-chartDiv'"
                     v-bind:parsedData="parsedData"></basic-chart>  
        
    </div>
</template>

<script>

    import $ from "jquery";
    //  import moment from 'moment';
    import {spreadTitle, spreadUnits, generalFormToBarchartTicker, isSpreadOpen} from "../../../js/main";
    import basicChart from '@/components/am5charts-basic-chart';

    export default {
        components: {
            basicChart
        },
        mounted() {
            // console.log("basic-chart-output.vue mounted() starting.");
            this.$store.commit(this.namespace + '/setTabTitle', this.ticker);
            if (this.activeModuleName === this.namespace && !this.initialized) {
                this.getData();
            }
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
            },
            truncate() {
                return this.$store.state[this.namespace].truncate;
            }
        },
        watch: {
            ticker: function (newTicker, oldTicker) {
                console.log("watch newTicker=", newTicker, " oldTicker=", oldTicker, " namespace=", this.namespace);

                let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                if (newTicker !== oldTicker && newTicker !== null) {
                    // console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");
                    this.getData();
                    if (generalForm.program === "BasicCharts") {
                        this.$store.commit(this.namespace + '/setTabTitle', newTicker);
                    }
                } else {
                    this.parsedData = null;
                }
            },
            truncate() {
                console.log("watching truncate");
                this.getData();
            },
            activeModuleName: function (activeModuleName) {
                console.log("activeModuleName=", activeModuleName, " namespace=", this.namespace,
                        " this.initialized=", this.initialized, " this.$store.state[this.namespace].selected[0]=", this.$store.state[this.namespace].selected[0],
                        " this.ticker=", this.$store.getters[this.namespace + "/ticker"]);

                if (activeModuleName === this.namespace && !this.initialized
                        && typeof this.$store.state[this.namespace].selected[0] !== 'undefined') {
                    // console.log("CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC");
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
                // console.log("getData() starting.");
                this.initialized = true;
                // console.log("this.$refs=", this.$refs);
                // this.$refs[this.namespace].removeChart();

                if (this.ticker !== null) {
                    this.$store.commit('incrementNumberOfAjaxCalls');
                    let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));

                    // console.log("generalForm.selected[0]=", generalForm.selected[0]);

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
                    let url = "https://app.charts.alpha4all.it/history.php?symbol=E6M22&type=minutes&order=asc";

                    if (generalForm.selected.length > 0) {
                        let that = this;
                        var currentRequest = $.ajax({
                            url: url, //this.$store.state.siteData.baseUrl + this.$store.state.siteData.contextName + "/BasicBarsControllerServlet/",
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
                                let parsedData = JSON.parse(data).results;
                               // console.log("parsedData=", JSON.parse(JSON.stringify(parsedData)));


                                let position = generalForm.spreadP;
                                let spreadMult = generalForm.spreadMult;
                                // let commodity = that.$store.getters[that.namespace + '/c'][0];
                                // console.log("commodity=", commodity);
                                // console.log("spreadMult=", spreadMult);
                                //  console.log("position=", position);
                                // console.log("parsedData=", parsedData);

                                let temp = parsedData.map(x => {
                                    // console.log("x=", x);
                                    // let y=x.timestamp.replace("TO", " ");
                                    // console.log("y=", y);
                                    let obj = {};
                                    obj.date = new Date(x.timestamp);
                                    obj.open = position * spreadMult * x.open;
                                    obj.high = position > 0 ? position * spreadMult * x.high : position * spreadMult * x.low;
                                    obj.low = position > 0 ? position * spreadMult * x.low : position * spreadMult * x.high;
                                    obj.close = position * spreadMult * x.close;
                                    obj.volume = x.volume;
                                    // obj.openInterest = x.openInterest;
                                    delete x.tradingDay;
                                    delete x.timestamp;
                                    delete x.symbol;
                                    //  console.log("obj=", obj);
                                    return obj;
                                });
                                console.log("temp=", temp);

                                // let normalizedTemp = that.normalizeForUnitMoveDifferencesBetweenBarchartAndEod(JSON.parse(JSON.stringify(temp)), commodity);
                                // console.log("normalizedTemp=", normalizedTemp);

                                parsedData = {};
                                parsedData.values = temp;

                                parsedData.title = spreadTitle(generalForm); // + "  (" + symbol + ")";
                                parsedData.units = spreadUnits(generalForm.selected[0]);
                                console.log("parsedData=", parsedData);
                                that.parsedData = JSON.parse(JSON.stringify(parsedData));
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
        }
    };

</script>
