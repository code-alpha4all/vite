<template>
    <div>
        <div v-if="program !== 'TradeMaps'" 
             v-bind:id="this.namespace + 'OutputDiv'" style="width: fit-content; background-color: white">
            <div>
                <b-sidebar id="sidebar-help" title="Help" shadow right style="background-color: rgba(255, 0, 0, 0.5);">
                    <div style="padding: 1rem;">
                        <h2 class="pb-5" style="font-weight: 600;">Futures Chart</h2>
                        <h3 class="pt-5">Tools:</h3>
                        <h4>
                            <b>Show/Hide Label: </b>show or hide information labels on the
                            chart.
                        </h4>
                        <h4>
                            <b>P/L (Profit &amp; Loss calculator): </b>to measure the price
                            difference in USD between two points selected with the mouse.
                        </h4>
                        <h4>
                            <b>Download and Annotations: </b>accessible via the icon with a
                            symbol at the top left of the graph
                        </h4>
                        <hr />
                        <h4>
                            Need support? Click
                            <router-link to="/support" id="support">here.</router-link>
                        </h4>
                    </div>
                </b-sidebar>
            </div>

            <b-container v-if="namespace !== 'undefined'" fluid style="width: auto; margin-top: 0px; background-color: white;
                         margin-left: 0px; width: auto">
                <b-row align-h="start" align-v="end" style="background-color: white; padding: 1px;" class="row no-gutters">
                    <b-col id="step-1" cols="1" md="auto" style="margin: 0 2px 0 7px; padding: 1px">
                        <commodity-box v-bind:namespace="namespace" :ref="'commodity-box-'+namespace">
                            <template v-slot:contract-aligner>
                                <contract-aligner-selector
                                    v-bind:namespace="namespace"
                                    v-bind:title="'Aligner/Selector'"
                                    ></contract-aligner-selector>
                            </template>
                        </commodity-box>
                    </b-col>
                    <b-col cols="4.5">
                        <trade-specs
                            v-bind:namespace="namespace"
                            style="margin: -1px 2px -1px -3px"
                            ></trade-specs>
                    </b-col>
                    <b-col cols="3">
                        <b-button-group style="border: 1px solid gray; background-color: #E8E8E8;
                                        margin: 3px 1px 1px 1px; border-radius: 3px; padding: 1px">      

                            <seasonal-selector v-bind:namespace="namespace"></seasonal-selector>
                            <chart-features v-bind:namespace="namespace"></chart-features>
                          <!--  <spread-calculation-method-selector :namespace="namespace" v-if="['admin', 'superadmin'].includes($store.state.user.role)"
                                                 style="margin: 1px 0 0 10px"></spread-calculation-method-selector> -->

                            <truncate-selector v-bind:namespace="namespace" style="margin: 1px 0 0 10px"></truncate-selector>
                            <toggle-single-throw v-if="['admin', 'superadmin'].includes($store.state.user.role)" v-bind:namespace="namespace"
                                                 v-bind:property="'showPlaybackControl'" v-bind:label="'playback'" style="margin: 0px"></toggle-single-throw>
                            <toggle-single-throw v-bind:namespace="namespace"
                                                 v-bind:property="'addProfitLoss'" v-bind:label="'P/L'" :id="'profit-loss-toggle-'+namespace" style="margin: 0px"></toggle-single-throw>
                            <toggle-single-throw v-bind:namespace="namespace" :id="'cot-'+namespace"
                                                 v-bind:property="'addCOTPanel'" v-bind:label="'COT'" style="margin: 0px"></toggle-single-throw>
                            <add-to-portfolio-button v-bind:namespace="namespace" :ref="'add-to-portfolio-button-'+namespace" style="margin: 1px 0 0 0"></add-to-portfolio-button>   
                        </b-button-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col cols="12" style="width: fit-content">
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
                        </span>

                    </b-col>
                </b-row>
            </b-container>
        </div>
        <div v-else style="margin: 0 0 -12px 20px;">
            <span :id="'chartcontrols-' + namespace"></span>
        </div>
               
        <basic-chart
            v-bind:ref="namespace + '-basic-chart'"
            v-bind:namespace="namespace"
            v-bind:div-name="namespace + '-chartDiv'"
            style="margin: 0 0 0 0px">
        </basic-chart>
    </div>
</template>

<style scoped>
    .legend {
        margin: 0 3px 0 3px;
    }
</style>

<script>
    import basicChart from "@/components/am5charts-basic-chart";
    import $ from "jquery";
    import commodityBox from "@/components/commodity-box";
    import contractAlignerSelector from "@/components/contract-aligner-selector";
    import seasonalSelector from "@/components/seasonal-selector";
    import toggleSingleThrow from "@/components/toggle-single-throw";
    import addToPortfolioButton from "@/components/add-to-portfolio-button";
    import chartFeatures from "@/components/chart-features";
    import tradeSpecs from "@/components/trade-specs";
    import { spreadTitle } from "@/js/main";
    import truncateSelector from '@/components/truncate';
  //  import spreadCalculationMethodSelector from '@/components/spread-calculation-method-selector';

    export default {
        initialized: false, // <-- non-reactive property
        parsedData: {}, // <-- non-reactive property
        
        components: {
            basicChart,
            commodityBox,
            contractAlignerSelector,
            seasonalSelector,
            toggleSingleThrow,
            addToPortfolioButton,
            tradeSpecs,
            chartFeatures,
            truncateSelector,
          //  spreadCalculationMethodSelector
        },
        mounted() {
           // console.log("basic-chart-output.vue mounted() starting.");
            this.$store.commit(this.namespace + "/setTabTitle", this.displayTickerWithUnitMoves);

            if (this.activeModuleName === this.namespace && !this.$options.initialized) {
                this.getData();
            }

           if(this.program !== "TradeMaps"){
            let observer = new ResizeObserver(entries => {
                // console.log("ResizeObserver() starting. this.namespace=", this.namespace, " activeModuleName=", this.$store.getters['activeModuleName']);
                if (this.$store.getters['activeModuleName'] === this.namespace) {
                    // console.log("checking input height.");
                    for (let entry of entries) {
                       // console.log("entry=", entry);
                        // Now do something with the resized element
                      //  console.log("entry.contentRect.height=", entry.contentRect.height);
                        this.$store.commit(this.namespace + '/browserSideOnly/setOutputDivHeight', entry.contentRect.height);
                    }
                }
            });
            observer.observe(document.querySelector('#' + this.namespace + 'OutputDiv'));
           }
        },
        beforeDestroy() {
            this.$options.parsedData = null;
        },
        props: ["namespace"],
        computed: {
            ticker() {
                return this.$store.getters[this.namespace + "/ticker"];
            },
            displayTickerWithUnitMoves() {
                return this.$store.getters[this.namespace + "/displayTickerWithUnitMoves"];
            },
            activeModuleName() {
                return this.$store.getters["activeModuleName"];
            },
            showPlaybackControl() {
                return this.$store.state[this.namespace].showPlaybackControl;
            },
            symbols() {
                return this.$store.state.user.symbols;
            },
            tickerInputType() {
                return this.user.tickerInputType;
            },
            cols() {
                return this.tickerInputType === "text" ? 9 : 4;
            },
            legs() {
                return this.$store.state[this.namespace].legs;
            },
            title() {
                let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                let title = generalForm.chartParameters.hiddenFeatures.title ? "" : generalForm.instrument === "future" ?
                        this.$store.getters[this.namespace + "/displayTickerWithUnitMoves"] : spreadTitle(generalForm);
                return title;
            },
            program() {
                return this.$store.state[this.namespace].program;
            },
            truncate() {
                return this.$store.state[this.namespace].truncate;
            }
        },
        watch: {
            displayTickerWithUnitMoves: function (newTicker, oldTicker) {
                console.log("watch displayTickerWithUnitMoves=", newTicker, " oldTicker=", oldTicker,
                        " namespace=", this.namespace);

                let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                if (newTicker !== oldTicker && newTicker !== null) {
                    this.getData();
                    if (generalForm.program === "BasicChartsNew") {
                        this.$store.commit(this.namespace + "/setTabTitle", this.displayTickerWithUnitMoves);
                    }
                } else {
                    this.$options.parsedData = null;
                }
            },
            symbols(symbols) {
                console.log("watch: symbols=", symbols);
                console.log("this.displayTickerWithUnitMoves=", this.displayTickerWithUnitMoves);
                let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                if (generalForm.program === "BasicChartsNew") {
                    this.$store.commit(this.namespace + "/setTabTitle", this.displayTickerWithUnitMoves);
                }
            },
            activeModuleName: function (activeModuleName) {
                console.log("activeModuleName=", activeModuleName, " namespace=", this.namespace, " this.$options.initialized=", this.$options.initialized, " this.$store.state[this.namespace].selected[0]=",
                        this.$store.state[this.namespace].selected[0], " this.ticker=", this.$store.getters[this.namespace + "/ticker"]);

                if (activeModuleName === this.namespace && !this.$options.initialized && typeof this.$store.state[this.namespace].selected[0] !== "undefined") {
                    this.getData();
                }
            },
            truncate(truncate) {
                console.log("watch: truncate=", truncate);
                this.getData();
            }
        },
        methods: {
            normalizeForUnitMoveDifferencesBetweenBarchartAndEod(data, commodity) {
                console.log("normalizeForUnitMoveDifferencesBetweenBarchartAndEod() starting. commodity=", commodity);

                let normalizationRatios = {HG: 100, SI: 100};

                let normalizedData;
                if (Object.keys(normalizationRatios).includes(commodity)) {
                    //  console.log("Normalizating data. data=", data);
                    normalizedData = data.map((x) => {
                        //  console.log("x=", x);
                        ["open", "high", "low", "price"].forEach((y) => {
                            x[y] = normalizationRatios[commodity] * x[y];
                        });
                        return x;
                    });
                } else {
                    normalizedData = data;
                }
                return normalizedData;
            },
            addData(bar) {
                // console.log("addData() starting.");
                this.$refs[this.namespace + '-basic-chart'].addData(bar);
            },
            getData: function () {
                 console.log("getData() starting.");
                // console.trace();

                this.$store.commit("resetNumberOfAjaxCalls");
                this.$options.initialized = true;
               // console.log("this.$refs=", this.$refs);
                this.$refs[this.namespace + '-basic-chart'].removeChart();

               // console.log("this.ticker=", this.ticker);
                if (this.ticker !== null) {
                    this.$store.commit("incrementNumberOfAjaxCalls");
                    let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                    // console.log("generalForm=", generalForm);
                    // console.log("generalForm.selected[0]=", generalForm.selected[0]);

                    // let isOpen = isSpreadOpen(generalForm.selected[0]);
                    // console.log("isOpen=", isOpen);

                    /*  if (isOpen) {
                     this.$store.commit(this.namespace + '/setGeneralForm', generalFormToBarchartTicker(generalForm));
                     } else {
                     this.$store.commit(this.namespace + '/setBarchartTicker', "");
                     } */
                    generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                    // console.log("barchartTicker=", generalForm.barchartTicker);

                    generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                    delete generalForm.browserSideOnly;
                   // delete generalForm.chartParameters;
                    delete generalForm.playback;
                    generalForm.generator = "BasicBarsGenerator";
                    generalForm.study = "basic";
                  //  console.log("generalForm=", generalForm);

                   // console.log("this.$refs=", this.$refs);
                    let seasonalDataPromise = this.$refs[this.namespace + '-basic-chart'].getSeasonalData();

                    let json = JSON.stringify(generalForm, null, 2);
                    if (generalForm.selected.length > 0) {
                        let that = this;
                        var currentRequest = $.ajax({
                            url: this.$store.state.siteData.baseUrl + this.$store.state.siteData.contextName + "/BasicEodBarsControllerServlet/",
                            type: "POST",
                            data: {json: json},
                            beforeSend: function () {
                                //  console.log("beforeSend starting.");
                                if (currentRequest != null) {
                                    //  console.log("aborting previous request.");
                                    currentRequest.abort();
                                }
                            },
                            success: function (data) {
                                // console.log("data=", data);
                                that.$store.commit("decrementNumberOfAjaxCalls");
                                let parsedData = JSON.parse(data)[0];
                               // console.log("parsedData=", JSON.parse(JSON.stringify(parsedData)));
                                let dataSource = JSON.parse(data)[1].dataSource;
                                // console.log("dataSource=", dataSource, " parsedData=", JSON.parse(JSON.stringify(parsedData)));

                                that.$store.commit(that.namespace + "/setDataSource", dataSource);

                                that.$options.parsedData = parsedData;
                    
                               // console.log("that.$refs=", that.$refs);
                                setTimeout(function(){
                                   // console.log("AAAAAAAAAAAAAA");
                                    that.$refs[that.namespace + '-basic-chart'].createChart(parsedData, seasonalDataPromise);
                                }, 100);

                                /*  that.getLastData(parsedData).then(newBar => {
                                 console.log("newBar=", newBar);
                                 if (!["not_defined", "no_data", "not_open", "no_current_data"].includes(newBar)) {
                                 console.log("newBar=", JSON.parse(JSON.stringify(newBar)));
                                 let values = Object.values(parsedData.values);
                                 let lastBar = values[values.length - 1];
                                 console.log("lastBar=", JSON.parse(JSON.stringify(lastBar)));
                                 
                                 console.log("newBar.date=", moment(newBar.date).format("YYYYMMDD"), " lastBar.date=", lastBar.date);
                                 
                                 console.log("Inserting new bar.");
                                 parsedData.values[moment(newBar.date).format("YYYYMMDD")] = newBar;
                                 }
                                 that.parsedData = parsedData;
                                 });*/
                                


                            },
                            fail: function (data) {
                                that.$store.commit("decrementNumberOfAjaxCalls");
                                console.log("ajax call failed.");
                                $("#progress").hide();
                                $("#button").show();
                                console.log(data);
                            },
                        });
                    }
                }
            },
        },
    };
</script>
