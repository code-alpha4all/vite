<template>
    <div style="margin: 0px; width: 100%;">

        <calculator-chart v-if="['Calculator', 'SpreadCoverage'].includes(program)"
                          v-bind:ref="namespace" v-bind:namespace="namespace"  
                          v-bind:div-name="namespace+'-calculatorChartDiv'" 
                          v-bind:parsedData="tradeChartParsedData"
                          v-bind:height="'600px'"
                          v-bind:width="'100%'"
                          style="border: 0px solid gray;"></calculator-chart>  

    </div>
</template>

<script>
    import moment from 'moment';
    import $ from "jquery";
    import calculatorChart from '@/components/am4charts-calculator-chart';
    import {spreadTitle} from "@/js/main";

    export default {
        components: {
            calculatorChart
        },
        created() {
            console.log("created() started.");
        },
        mounted() {
            console.log("spread-coverage-output.vue mounted() starting. this.width=", this.width);
            let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
            if (generalForm.program === "SpreadCoverage") {
                this.$store.commit(this.namespace + '/setTabTitle', "coverage: " + this.displayTicker);
            }

            if (this.activeModuleName === this.namespace && !this.initialized) {
                this.getData();
            }
        },
        props: {
            namespace: {
                type: String,
                default: ""
            },
            width: {
                type: Number,
                default: 900
            }
        },
        data: function () {
            return{
                tradeChartParsedData: null,
                initialized: false,
                title: null
            }
        },
        computed: {
            ticker() {
                return this.$store.getters[this.namespace + "/ticker"];
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
            displayTicker() {
                return this.$store.getters[this.namespace + "/displayTicker"];
            }
        },
        watch: {
            ticker: function (newTicker, oldTicker) {
                console.log("watch: newTicker=", newTicker, " oldTicker=", oldTicker, " namespace=", this.namespace);
                let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                console.log("generalForm=", generalForm);
               // console.log("typeof this.$refs[this.namespace] =", typeof this.$refs[this.namespace] );

                this.tradeTableParsedData = {};
                //this.tradeChartParsedData = [];

                if (newTicker !== null && newTicker !== oldTicker) {
                   // console.log("title=", this.$refs[this.namespace].$options.chart.titles.values[0].text);
                   if(typeof this.$refs[this.namespace] !== 'undefined' && 
                        typeof this.$refs[this.namespace].$options.chart.titles !== 'undefined'){
                        this.$refs[this.namespace].$options.chart.titles.values[0].text = newTicker + " . . .  ";
                    }
                    this.getData();
                    if (generalForm.program === "SpreadCoverage") {
                        this.$store.commit(this.namespace + '/setTabTitle', "coverage: " + this.displayTicker);
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
            displayTicker(){
                this.$store.commit(this.namespace + '/setTabTitle', "coverage: " + this.displayTicker);
            }
        },
        methods: {
            getData() {
                console.log("getData() starting.");
                this.initialized = true;
                this.$store.commit('incrementNumberOfAjaxCalls');
                console.log("this.$refs=", this.$refs);

                this.tradeChartParsedData = [];
                if(typeof this.$refs[this.namespace] !== 'undefined'){
                    this.$refs[this.namespace].removeChart();
                }

                let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                generalForm.generator = "SpreadCoverageGenerator";
                
                delete generalForm.browserSideOnly;
                let json = JSON.stringify(generalForm, null, 2);
                let url = this.$store.state.siteData.baseUrl + this.$store.state.siteData.contextName + "/ControllerServlet2";
                let that = this;
                $.ajax({
                    url: url,
                    type: "POST",
                    data: {"json": json},
                    success: function (data) {
                        // console.log("data=", data);
                        that.$store.commit('decrementNumberOfAjaxCalls');
                        let parsedData = JSON.parse(data);
                        that.tradeTableParsedData = parsedData;
                        console.log("parsedData=", parsedData);

                        that.$store.commit(that.namespace + '/setOpen', moment(parsedData.open, "YYYYMMDD").format("YYYY-MM-DD"));
                        that.$store.commit(that.namespace + '/setClose', moment(parsedData.close, "YYYYMMDD").format("YYYY-MM-DD"));

                        if (typeof parsedData.chartJson !== 'undefined' && parsedData.chartJson !== null) {
                            let temp = parsedData.chartJson.reverse().map(x => {
                                x.open = moment(x.open, "YYYYMMDD").format("YYYY-MM-DD");
                                x.close = moment(x.close, "YYYYMMDD").format("YYYY-MM-DD");
                                // console.log("x=", {...x});
                                return x;
                            });
                            console.log("temp=", JSON.parse(JSON.stringify(temp)));
                            let latestDate = temp.reduce((prev, curr) => prev.close > curr.close ? prev : curr);
                            console.log("latestDate=", latestDate);

                            let i = 0;
                            while (moment(generalForm.close).isAfter(moment(latestDate.close))) {
                                console.log("Shifting dates.");
                                temp.forEach(x => {
                                    x.open = moment(x.open).add(1, 'years').format("YYYY-MM-DD");
                                    x.close = moment(x.close).add(1, 'years').format("YYYY-MM-DD");
                                });
                                console.log("temp=", JSON.parse(JSON.stringify(temp)));
                                latestDate = temp.reduce((prev, curr) => prev.close > curr.close ? prev : curr);
                                console.log("latestDate.close=", latestDate.close);
                                i++;
                                if (i > 4)
                                    break;
                            }

                            temp.forEach(x => {
                                // console.log("x=", x);
                                generalForm.selected = [x.selected];
                                // console.log("generalForm=", generalForm);
                                let invertDatesMultiplier = 1;
                                let noLegSwapping = false;
                                let ticker = spreadTitle(generalForm, invertDatesMultiplier, noLegSwapping);
                                console.log("ticker=", ticker);

                                x.tooltip = ticker;
                            });
                            console.log("temp=", temp);

                            that.tradeChartParsedData = temp;
                        } else {
                            that.tradeChartParsedData = [];
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
    };

</script>
