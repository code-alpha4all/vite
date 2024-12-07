<template>
    <div>
        <table border="0" style="border-right: 1px solid lightgray; border-top: 1px solid darkgray; font-weight: normal;">
            <tr>
                <td style="vertical-align: top; margin: 0px;">
                  <!--  nearestOpenTicker:{{ nearestOpenTicker }},
                    displayTickerWithUnitMovesWithoutSpaces:{{ displayTickerWithUnitMovesWithoutSpaces }} -->
                    <div v-if="!isTickerOpen" class="d-block text-center" style="padding: 10px;">
                        <span style="color: red; font-size: 14px;">Maps cannot be made for closed positions.</span>
                    </div>
                      <div v-if="isTickerOpen && (displayTickerWithUnitMovesWithoutSpaces !== nearestOpenTicker)" style="padding: 10px;">
                        <span style="color: red; font-size: 14px;">Maps can only be made for the nearest open position.
                            Change input to {{nearestOpenTicker}}.
                        </span>
                </div>

            <plotly-heatmap ref="heatmap" v-bind:namespace="namespace" :showStatistics="nearestOpenTicker !== null && displayTickerWithUnitMovesWithoutSpaces === nearestOpenTicker" v-bind:error="error"></plotly-heatmap>
            </td>
            <td style="vertical-align: top; padding-bottom: 0px; width: 800px">

                <div style="margin: 0px 0px 0px 0px; border-right: 0px solid darkgray; border-top: 0px solid darkgray;">
                    <basic-chart-output v-bind:namespace="namespace" ref="basic-chart-output"></basic-chart-output>  
                </div>
                <div style="margin: 0 0px 0px 0px; border: 0px solid darkgray;">
                    <calculator-output v-bind:namespace="namespace" v-bind:width="'740px'"></calculator-output>  
                </div>  

            </td>
            </tr>
        </table>   

        <!--  <b-modal v-if="activeModuleName === namespace" ref="trade-map-output-modal" hide-footer hide-header title="">
              <div class="d-block text-center">
                  <h4>Maps can only be made for the nearest open position.</h4>
                  <b-button v-if="nearestOpenTicker !== null" variant="success" v-on:click="changeToNearestOpen" style="margin: 20px 0 0 0; font-size: 1.2rem">
                      Change input to {{nearestOpenTicker}}.</b-button>
              </div>
          </b-modal> -->

    </div>
</template>

<script>
    // import moment from 'moment';
    import $ from "jquery";
    import basicChartOutput from '@/components/programs/BasicChartNew/basic-chart-output-new';
    import calculatorOutput from '@/components/programs/Calculator/calculator-output';
    import plotlyHeatmap from '@/components/plotly-heatmap';
    import {orderContracts, nearestOpenSpread, getCommoditiesArray, areSameUnitsAndUnitMoves, listOpenTickerOptions/*, spreadTitle*/} from '@/js/main';
    import {decompress} from "@/js/jsonhNew";
    import * as fb from '@/firebase';
    import _ from 'lodash';
    import { bus } from '@/main';

    const axios = require('axios');

    export default {
        components: {
            calculatorOutput, basicChartOutput, plotlyHeatmap
        },
        vectorMap: {}, // <-- non-reactive property
        rawData: {}, // <-- non-reactive property
        initialized: false, // <-- non-reactive property

        mounted() {
            // console.log("trade-maps-output.vue mounted() starting. this.ticker=", this.ticker);
            this.$store.commit(this.namespace + '/setTabTitle', "map: " + this.displayTickerWithUnitMoves);
            // this.seasonalTypes = ["unadjusted"];
            // console.log("this.ticker=", this.ticker);
            //  this.$store.commit(this.namespace + '/setShowTradingPeriod', true);

            if (this.activeModuleName === this.namespace && !this.$options.initialized && this.ticker !== null) {
                this.getData();
            }

            /*   this.$root.$on('bv::modal::hide', (bvEvent, modalId) => {
             console.log('trade-map-output-modal is about to be hidden.', bvEvent, modalId);
             this.result = "";
             });*/
        },
        beforeDestroy() {
            console.log("trade-map-output-modal beforeDestroy() starting.");
            /*  this.$root.$off('bv::modal::hide', (bvEvent, modalId) => {
             console.log('trade-map-output-modal is about to be hidden.', bvEvent, modalId);
             this.result = "";
             });*/
        },
        props: ['namespace'],
        data: function () {
            return {
                error: null,
            };
        },
        computed: {
            mapEndpoint: {
                get() {
                    return this.$store.state.user.mapEndpoint;
                },
                set(mapEndpoint) {
                    // console.log("mapEndpoint=", mapEndpoint);
                    this.$store.commit('user/setMapEndpoint', mapEndpoint);
                }
            },
            open() {
                return this.$store.state[this.namespace].open;
            },
            close() {
                return this.$store.state[this.namespace].close;
            },
            ticker() {
                return this.$store.getters[this.namespace + "/ticker"];
            },
            displayTickerWithUnitMovesWithoutSpaces(){
                return this.displayTickerWithUnitMoves.replace(/\s/g, '')
;            },
            displayTickerWithUnitMoves() {
                return this.$store.getters[this.namespace + "/displayTickerWithUnitMoves"];
            },
            activeModuleName() {
                let activeModuleName = this.$store.getters['activeModuleName'];
                // console.log("activeModuleName=", activeModuleName);
                return activeModuleName;
            },
            parameterToMap() {
                return this.$store.state[this.namespace].chartParameters.parameterToMap;
            },
            firebaseStorageDirectory() {
                return this.$store.state.siteData.firebaseStorageDirectory;
            },
            buySell() {
                return this.$store.state[this.namespace].buySell;
            },
            direction() {
                let isBefore = true;
                let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                let contract = generalForm.sampleContract.slice(0, generalForm.legs);
                if (generalForm.legs > 1) {
                    let newOrder = orderContracts(contract[0], contract[1])
                    isBefore = (contract[0] == newOrder[0]);
                }
                // console.log("isBefore=" + isBefore);
                if (!isBefore) {
                    contract = contract.reverse();
                }
                // console.log("contract=", contract);

                let directionCoefficient = 1;
                console.log("this.mapEndpoint=", this.mapEndpoint);
                if (this.mapEndpoint !== 'servlet' && ((generalForm.legs == 1 && generalForm.p[0] == -1) ||
                        (generalForm.legs == 2 && generalForm.p[0] == 1 && !isBefore) ||
                        (generalForm.legs == 2 && generalForm.p[0] == -1 && isBefore))) {
                    directionCoefficient = -1;
                }
                console.log("directionCoefficient=", directionCoefficient);

                let buySellCoefficient = this.buySell === "buy" ? 1 : -1;

                let direction = directionCoefficient * buySellCoefficient === 1 ? "up" : "down";
                console.log("direction=" + direction);
                return direction;
            },
            symbols() {
                return this.$store.state.user.symbols;
            },
            nearestOpen() {
                let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                let nearestOpenWithSpaces = nearestOpenSpread(generalForm).value;
                console.log("nearestOpenWithSpaces=", nearestOpenWithSpaces);

                if (nearestOpenWithSpaces !== null) {
                    let nearestOpen = nearestOpenWithSpaces.replace(/\s/g, '')
                    console.log("nearestOpen=", nearestOpen);
                    return nearestOpen;
                } else {
                    return null;
                }
            },
            openTickers(){
                let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                let openOptions = listOpenTickerOptions(generalForm).map(x => x.text.replace(/\s/g, ''));
                console.log("openOptions=", openOptions);
                return openOptions;
            },
            nearestOpenTicker() {               
                let nearestOpenTicker = this.openTickers.length === 0 ? null : this.openTickers[this.openTickers.length - 1].replace(/\s/g, '');
                console.log("nearestOpenTicker=", nearestOpenTicker);
                return nearestOpenTicker;
            },
            isTickerOpen(){
                return this.openTickers.includes(this.displayTickerWithUnitMovesWithoutSpaces);
            }
        },
        watch: {
            firebaseStorageDirectory(firebaseStorageDirectory) {
                console.log("watch firebaseStorageDirectory=", firebaseStorageDirectory);
                this.getData();
            },
            symbols(symbols) {
                console.log("watch symbols=", symbols);
                this.getCharts();
            },
            ticker: function (newTicker, oldTicker) {
                console.log("watch: newTicker=", newTicker, " oldTicker=", oldTicker, " namespace=", this.namespace);

                this.$refs["heatmap"].removeHeatmap();
                this.$store.commit(this.namespace + '/setTabTitle', "map: " + this.displayTickerWithUnitMoves);
                if (newTicker !== null && newTicker !== oldTicker) {
                    //removeStatChart();
                    this.getData();
                } else {
                    this.error = null;
                }
            },
            activeModuleName: function (activeModuleName) {
                // console.log("activeModuleName=", activeModuleName, " namespace=", this.namespace, " this.$options.initialized=", this.$options.initialized);
                if (activeModuleName === this.namespace && !this.$options.initialized && this.ticker !== null) {
                    this.$refs["heatmap"].removeHeatmap();
                    this.getData();
                }
            },
            parameterToMap() {
                // console.log("watching parameterToMap");
                if (this.activeModuleName === this.namespace) {
                    this.$refs["heatmap"].runPlotly(this.$options.vectorMap, this.parameterToMap);
                }
            },
            buySell() {
                console.log("watching buySell");
                this.getCharts();
            },
            displayTickerWithUnitMoves() {
                this.$store.commit(this.namespace + '/setTabTitle', "map: " + this.displayTickerWithUnitMoves);
            }
        },
        methods: {
            changeToNearestOpen() {
                console.log("changeToNearestOpen() starting. this.nearestOpenTicker=", this.nearestOpenTicker);

                //  this.$refs['trade-map-output-modal'].hide();
                if (this.nearestOpenTicker !== null) {
                    this.$store.commit(this.namespace + '/setTickerInput', this.nearestOpenTicker);
                    bus.$emit('updateState', this.nearestOpenTicker);
                }
            },
            getCharts() {
                this.$options.vectorMap = decompress(JSON.stringify(this.$options.rawData));
                // console.log("this.$options.vectorMap=", JSON.parse(JSON.stringify(this.$options.vectorMap)));

                let openStartDate = Object.keys(this.$options.vectorMap)[0];
                // console.log("openStartDate=", openStartDate);

                if (typeof openStartDate !== 'undefined') {
                    let startingCloseDates = Object.keys(this.$options.vectorMap[openStartDate]);
                    // console.log("startingCloseDates=", startingCloseDates);

                    if (typeof startingCloseDates !== 'undefined'/* && startingCloseDates.length > 0*/) {
                        let commodity = this.$store.getters[this.namespace + "/c"][0];
                        // console.log("commodity=", commodity);

                        let unitMove = areSameUnitsAndUnitMoves(this.$store.state[this.namespace].selected[0]) ?
                                getCommoditiesArray().find(x => x.symbol === commodity).unitMove : 1;
                        console.log("unitMove=", unitMove);

                        let mult = this.mapEndpoint === "servlet" ? 1 : this.$store.state[this.namespace].mult[0];
                        console.log("mult=", mult);

                        // let totalMult = 

                        let newTradeObject = {};
                        let upValue;
                        let downValue;
                        console.log("this.direction=", this.direction);
                        if (this.direction === "down") {
                            for (let open in this.$options.vectorMap) {
                                let openVector = this.$options.vectorMap[open];
                                // console.log("open=", open + ':', openVector);
                                for (let close in openVector) {
                                    //  console.log(open + ':', closeVector[open]);
                                    upValue = openVector[close];
                                    downValue = Object.assign({}, openVector[close])

                                    downValue["close"] = close;
                                    downValue["avgAppd"] = -(mult * unitMove * upValue.avgChange / upValue.avgDays).toFixed(2);
                                    downValue["avgChange"] = -(mult * unitMove * upValue.avgChange).toFixed(2);
                                    downValue["avgMax"] = -mult * upValue.avgMin;
                                    downValue["bestMax"] = -mult * upValue.worstMin;
                                    downValue["avgMin"] = -mult * upValue.avgMax;
                                    downValue["worstMin"] = -mult * upValue.bestMax;
                                    downValue["rrr"] = -(upValue.avgMin / upValue.avgMax).toFixed(3);
                                    downValue["percentUp"] = upValue.percentDown;
                                    downValue["percentDown"] = upValue.percentUp;
                                    downValue["rrr"] = -(upValue.avgMin / upValue.avgMax).toFixed(3);
                                    openVector[close] = downValue;
                                }
                                newTradeObject[open] = openVector;
                            }
                            // console.log("newTradeObject=", newTradeObject);
                            this.$options.vectorMap = newTradeObject;
                        } else {
                            for (let open in this.$options.vectorMap) {
                                let openVector = this.$options.vectorMap[open];
                                // console.log("open=", open + ':', openVector);
                                for (let close in openVector) {
                                    // console.log(close + ':', openVector[close]);
                                    upValue = openVector[close];

                                    upValue["open"] = open;
                                    upValue["avgAppd"] = (mult * unitMove * upValue.avgChange / upValue.avgDays).toFixed(2);
                                    upValue["avgChange"] = (mult * unitMove * upValue.avgChange).toFixed(2);

                                    upValue["avgMax"] = mult * upValue.avgMax;
                                    upValue["bestMax"] = mult * upValue.bestMax;
                                    upValue["avgMin"] = mult * upValue.avgMin;
                                    upValue["worstMin"] = mult * upValue.worstMin;

                                    upValue["rrr"] = -(upValue.avgMax / upValue.avgMin).toFixed(3);
                                    openVector[close] = upValue;
                                }
                                if (Object.keys(openVector).length !== 0) {
                                    newTradeObject[open] = openVector;
                                }
                            }
                            //  console.log("newTradeObject=", newTradeObject);
                            this.$options.vectorMap = newTradeObject;
                        }

                        this.$refs["heatmap"].runPlotly(this.$options.vectorMap, this.parameterToMap);
                    } else {
                        this.error = "The maps end at the First Notice Date. Next years' map will be created after the current spread expires.";
                       // this.$refs["heatmap"].runPlotly([], this.parameterToMap);

                    }
                } else {
                    this.error = "The maps end at the First Notice Date. Next years' map will be created after the current spread expires.";
                }
            },
            getFirebasePathReference() {
                console.log("getFirebasePathReference() starting.");

                let that = this;
                return new Promise((resolve/*, reject*/) => {
                    this.$options.initialized = true;
                    this.$store.commit('incrementNumberOfAjaxCalls');
                    that.error = null;

                    let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                    generalForm.generator = "TradeMapGenerator";
                    console.log("selected[0]=", generalForm.selected[0]);

                    let contract = generalForm.sampleContract.slice(0, generalForm.legs).sort();
                    console.log("contract=", contract);
                    if (this.nearestOpen !== null) {
                        if (generalForm.legs == 1 || (contract[0] !== contract[1] && generalForm.legs == 2)) {
                            console.log("this.nearestOpen=", this.nearestOpen, " selected[0]=", generalForm.selected[0]);
                            if (this.nearestOpen !== generalForm.selected[0]) {
                                // alert("Put info here.");
                                resolve("no pathReference");
                            } else {
                                //  let splitSpread = nearestOpen.split('/');
                                //  console.log("splitSpread=", splitSpread);
                                let orderedNearestOpen = generalForm.legs == 2 ? orderContracts(...this.nearestOpen.split('/')) : this.nearestOpen;
                                console.log("orderedNearestOpen=", orderedNearestOpen);

                                let orderedSpread = generalForm.legs == 2 ? orderedNearestOpen.join('-') : orderedNearestOpen;
                                console.log("orderedSpread=", orderedSpread);

                                let commodity = this.$store.getters[this.namespace + "/c"][0];

                                let storage = fb.storage;
                                let path = this.firebaseStorageDirectory + "/" + commodity + "/" + orderedSpread;
                                let pathReference = storage.ref(path);
                                console.log("pathReference=", pathReference._delegate.fullPath);

                                pathReference.getDownloadURL()
                                        .then((url) => {
                                            // console.log("url=", url);
                                            resolve(url);
                                        })
                                        .catch((error) => {
                                            // Handle any errors
                                            console.log("error=", error);
                                            resolve("no pathReference");
                                        });
                            }
                        } else if ((contract[0] === contract[1] && generalForm.legs == 2)) {
                            this.$store.commit('decrementNumberOfAjaxCalls');
                            //console.log("Nothing to map.");
                            that.error = "Nothing to map.";
                        }
                    } else {
                        console.log("No open position.");
                        this.$store.commit('decrementNumberOfAjaxCalls');
                    }
                });
            },
            getData: _.debounce(function () {
                console.log("getData() starting.");

                let that = this;
                let generalForm = JSON.parse(JSON.stringify(that.$store.state[that.namespace]));


                if (this.nearestOpen === generalForm.selected[0]) {
                    that.$store.commit('resetNumberOfAjaxCalls');


                    let c = that.$store.getters[that.namespace + "/c"].slice(0, generalForm.legs);
                    console.log("c=", c);
                    let sameCommodity = c.every(x => x === c[0]);
                    console.log("sameCommodity=", sameCommodity);

                    let mult = generalForm.mult.slice(0, generalForm.legs);
                    //  console.log("mult=", mult);
                    let sameMult = mult.every(x => x === mult[0]);
                    console.log("sameMult=", sameMult);

                    if (sameCommodity && sameMult && generalForm.legs <= 2) {
                        that.getFirebasePathReference().then(pathReference => {
                            // console.log("pathReference=", pathReference);
                            if (pathReference !== "no pathReference") {
                                that.getMapData(pathReference);
                            } else {
                                that.$store.commit('decrementNumberOfAjaxCalls');
                                that.createMapData();
                            }
                        });
                    } else {
                        that.createMapData();
                    }
                } else {
                    console.log("YYYYYYYYYYYYYYY");
                    // that.$refs['trade-map-output-modal'].show();
                }
            }, 50),
            createMapData() {
                console.log("createMapData() starting.");
                this.$options.initialized = true;

                this.$store.commit('incrementNumberOfAjaxCalls');
                this.error = null;

                let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                generalForm.numberOfContractsApart = null; // This prevents loading the data into the trades table in mysql.

                delete generalForm.browserSideOnly;
                delete generalForm.search;
                delete generalForm.indicators;
                delete generalForm.playback;
                delete generalForm.chartParameters;
                // console.log("generalForm=", generalForm);

                let json = JSON.stringify(generalForm, null, 2);
                let that = this;
                $.ajax({
                    url: this.$store.state.siteData.baseUrl + this.$store.state.siteData.contextName + "/TradeMapControllerServlet/",
                    type: "POST",
                    data: {"json": json},
                    success: function (data) {
                        // console.log("data=", data);
                        that.$store.commit('decrementNumberOfAjaxCalls');
                        that.mapEndpoint = "servlet";

                        let parsedData = JSON.parse(data);
                        // console.log("parsedData=", parsedData);

                        that.$options.rawData = parsedData;
                        that.getCharts();
                    },
                    fail: function (data) {
                        console.log("call failed.");
                        console.log(data);
                    }
                });
            },
            getMapData(url) {
                // console.log("getMapData() starting.");

                axios.get(url)
                        .then(apiResponse => {
                            this.$store.commit('decrementNumberOfAjaxCalls');
                            // console.log("apiResponse=", apiResponse);
                            this.$options.rawData = apiResponse.data;
                            // console.log("rawData=", JSON.stringify(this.$options.rawData));
                            this.mapEndpoint = "firebaseStorage";
                            this.getCharts();
                        })
                        .catch(() => {
                            this.$store.commit('decrementNumberOfAjaxCalls');
                            this.error = "Cannot make map from current selection.";
                            this.createMapData();
                        });
            }
        }
    };

</script>
