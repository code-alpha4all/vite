<template>
    <div style="border: 0px solid #505050; width: 100%;">

        <b-button-group style="margin: 6px 10px 0 14px; font-size: 1.1rem">
            <span style="padding: 6px 30px 0 10px">
                number of results: {{numberOfTrades}}
            </span>
            <span style="padding: 6px 3px 0 10px">page:
            </span>
            <b-pagination size="md" style="margin: 0px 30px 0px 0; border: 0px solid gray; padding: 0px"
                          v-model="page"
                          :total-rows="totalPages*rowsPerPage"
                          :per-page="rowsPerPage">
            </b-pagination>

            <span style="margin: -2px 0px 2px 0; "> &nbsp;rows/page:
                <b-form-select size="md" style="border: 1px solid lightgray; width: auto;" v-model="rowsPerPage" :options="rowsPerPageOptions"></b-form-select>
            </span>
        </b-button-group>

        <table id="trades" style="width: 100%;">
            <tr>
                <th style="text-align: center;" v-bind:style="{backgroundColor: sortParameter == 'ticker' ? 'red' : 'teal' }">ticker</th>
                <th style="text-align: center; backgroundColor: teal">legs</th>
                <th style="text-align: center; backgroundColor: teal">group</th>
                <th style="text-align: center;" v-bind:style="{backgroundColor: sortParameter == 'position' ? 'red' : 'teal' }">buy/sell</th>
                <th style="text-align: center;" v-bind:style="{backgroundColor: sortParameter == 'open' ? 'red' : 'teal' }">open</th>
                <th style="text-align: center;" v-bind:style="{backgroundColor: sortParameter == 'close' ? 'red' : 'teal' }">close</th>
                <th style="text-align: center;" v-bind:style="{backgroundColor: sortParameter == 'avgDays' ? 'red' : 'teal' }">avg days</th>
                <th style="text-align: center;" v-bind:style="{backgroundColor: sortParameter == 'percentUp' ? 'red' : 'teal' }">% profitable</th>
                <th style="text-align: center;" v-bind:style="{backgroundColor: sortParameter == 'rsi' ? 'red' : 'teal' }">current rsi</th>
                <th style="text-align: center;">actions</th>
            </tr>
            <tr v-for="n in trades" v-bind:key="n.id" style="white-space: nowrap;">
                <td v-bind:style="{textAlign: 'center', color: tickerColor[n.id]}">{{n.ticker}}</td>
                <td v-bind:style="{textAlign: 'center', color: tickerColor[n.id]}">{{n.legs}}</td>
                <td v-bind:style="{textAlign: 'center', color: tickerColor[n.id]}">{{n.group}}</td>
                <td v-bind:style="{textAlign: 'center', color: sortParameter == 'position' ? 'red' : 'black' }">{{n.position === "LONG" ? "BUY" : "SELL"}}</td>
                <td v-bind:style="{textAlign: 'center', color: sortParameter == 'open' ? 'red' : 'black' }">{{n.open}}</td>
                <td v-bind:style="{textAlign: 'center', color: sortParameter == 'close' ? 'red' : 'black' }">{{n.close}}</td>
                <td v-bind:style="{textAlign: 'center', color: sortParameter == 'close' ? 'red' : 'black' }">{{Math.round(1000*n.avgDays)/1000}}</td>
                <td v-bind:style="{textAlign: 'center', color: sortParameter == 'percentProfitable' ? 'red' : 'black' }">{{Math.round(10*n.percentProfitable)/10}}</td>
                <td v-bind:style="{textAlign: 'center', color: sortParameter == 'rsi' ? 'red' : 'black' }">{{n.rsi}}</td>
                <td style=" text-align: center"> <b-form-select style="border: 1px solid gray; width: auto; margin: -1px 0 0 0; padding-top: 1px; background-color: #05386B;
                                     color: white; height: 22px;"
                                   v-model="newProgram" :options="programOptions"
                                   size="sm" @change="getChart(n.id)" id="program-select"></b-form-select></td>
            </tr>
        </table>      

    </div>
</template>

<style scoped>
    #program-select {
        background: #05386b  
            url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='4' height='5' viewBox='0 0 4 5'%3e%3cpath fill='white' d='M2 0L0 2h4zm0 5L0 3h4z'/%3e%3c/svg%3e")
            no-repeat right 0.75rem center/8px 10px !important;
    }
    #trades {
        /* font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;*/
        font-weight: normal;
        color: darkgray;
        border-collapse: collapse;
        width: 100%;
    }

    #trades td {
        padding: 2px 14px 2px 14px;
        border: 1px solid #ddd;
    }

    #trades tr:nth-child(even){background-color: #f2f2f2;}

    #trades tr:hover {background-color: #ddd;}

    #trades th {
        border: 1px solid #ddd;
        padding: 4px;
        text-align: center;
        background-color: teal;
        color: white;
    }

    .linkable {
        cursor: pointer;
        color: darkblue;
    }

</style>

<script>
    var ajaxRequest = null;

    import axios from "axios";
    import moment from 'moment';
    import {tickerToGeneralForm, createContractLists, ContractWeightedN_tuplets, contractNameDecomposer,
        displayMoneyFormat, getGroup}  from "@/js/main.js";

    export default {
        components: {
        },
        mounted() {
            console.log("watch-list-output.vue mounted() starting.");

            if (this.activeModuleName === this.namespace && !this.initialized && typeof this.query !== 'undefined') {
                this.initialized = true;
                this.getTrades(this.query);
            }
        },
        props: ['namespace'],
        data: function () {
            return{
                initialized: false,
                trades: [],
                numberOfTrades: 0,
                totalPages: 1,
                rowsPerPageOptions: Array(10).fill(null).map((x, i) => ({value: 10 * (i + 1), text: 10 * (i + 1)})),
                tickerColor: [],
                newProgram: null
            }
        },
        computed: {
             programOptions() {
                return [
                    { value: null, text: 'Select Chart' },
                    { value: 'Calculator', text: 'Calculator' },
                    { value: 'BasicCharts', text: 'Futures Charts' },
                    { value: 'TradeMaps', text: 'Trade Maps' }/*,
                    { value: 'LongTermCharts', text: 'Long Term Charts' } */
                ];
            },
            sortParameter: {
                get() {
                    return this.$store.state[this.namespace].search.sortParameter;
                },
                set(sortParameter) {
                    this.$store.commit(this.namespace + '/search/set', {key: "sortParameter", value: sortParameter});
                }
            },
            rowsPerPage: {
                get() {
                    return this.$store.state[this.namespace].chartParameters.rowsPerPage;
                },
                set(rowsPerPage) {
                    this.$store.commit(this.namespace + '/chartParameters/setRowsPerPage', rowsPerPage);
                }
            },
            page: {
                get() {
                    return this.$store.state[this.namespace].chartParameters.page;
                },
                set(page) {
                    this.$store.commit(this.namespace + '/chartParameters/setPage', page);
                }
            },
            query() {
                return this.$store.state[this.namespace].search.query;
            },
            activeModuleName() {
                return  this.$store.getters['activeModuleName'];
            }
        },
        watch: {
            query: function (query) {
               // console.log("watch: query=", query);
                this.initialized = true;
                this.getTrades(query);
            },
            activeModuleName: function (activeModuleName) {
                console.log("activeModuleName=", activeModuleName, " namespace=", this.namespace,
                        " this.initialized=", this.initialized);
                // console.log("this.query=", this.query);
                if (activeModuleName === this.namespace && !this.initialized && typeof this.query !== 'undefined' && !this.initialized) {
                    this.initialized = true;
                    this.getTrades(this.query);
                }
            }
        },
        methods: {
            displayMoneyFormat(number){
                return displayMoneyFormat(number);           
            },
          /*  mouseClicked(index) {
                console.log("mouseClicked() starting. index=", index);
                let arr = Array(this.numberOfTrades).fill(null).map(() => "darkblue");
                arr[index] = "red";
                this.tickerColor = arr;
            }, */
            getChart(index) {
                console.log("getChart() starting. index=", index);
              //  this.mouseClicked(index);
              /*  let ticker = element.target.textContent;
               console.log("element=", element);
                console.log("ticker=", ticker);*/

                let program = this.newProgram;
                this.newProgram = null;
                console.log("program=", program, " this.newProgram=", this.newProgram);

                let trade = this.trades[index];
                console.log("trade=", trade);
                let open = moment(trade.open, "MMM DD, YYYY").format("YYYY-MM-DD");
                let close = moment(trade.close, "MMM DD, YYYY").format("YYYY-MM-DD");
                console.log("open=", open, " close=", close);

                let generalForm = tickerToGeneralForm(trade.ticker);
                generalForm.open = open;
                generalForm.close = close;

               /* if (trade.position === "SHORT") {
                    generalForm.p = [-1, 1, 1, 1];
                } */

                if(program === "LongTermCharts"){
                    generalForm.aligned = true;
                    generalForm.normalization = "off";
                    generalForm.longtermChartColors= "yearly";

                    let contractListsObject = createContractLists(generalForm.sampleContract, generalForm.legs);
                    console.log("contractListsObject=", contractListsObject);          

                    let alignerOptionsObject = ContractWeightedN_tuplets(generalForm.sampleContract.slice(0, generalForm.legs), contractListsObject.contractsArray.slice());
                    console.log("alignerOptionsObject=", alignerOptionsObject);

                }

               // delete generalForm.program;
                generalForm.program = program;
                generalForm.buySell = trade.position === "LONG" ? "buy" : "sell";
                generalForm.intracommodity = true;
                generalForm.showTradingPeriod = true;
                generalForm.chartParameters = {};
                generalForm.chartParameters.parameterToMap = this.sortParameter === "appd" ? "avgAppd" : this.sortParameter;
                generalForm.chartParameters.hiddenFeatures = {
                    expiration: false,
                    title: false,
                    legends: false,
                    horizontalScrollbar: true,
                    verticalScrollbar: true
                };
                console.log("generalForm=", generalForm);

                this.$store.commit("user/setInitializingState", generalForm);
                this.$store.dispatch('newTab', program)


                /*let mergedForm = {...tradeMapsInitialState, ...generalForm};
                console.log("mergedForm=", mergedForm);
                this.$emit('newTabWithInitialState', mergedForm); */
            },
            getTrades: function (query) {
                console.log("getTrades() starting. query=", query);
                this.$store.commit('resetNumberOfAjaxCalls');
                this.$store.commit('incrementNumberOfAjaxCalls');

                if (query !== false) {
                    this.trades = [];
                    //  let url = "http://localhost:8080/SearchTradesServlet?query=" + encodeURIComponent(query);
                    //  let url = "http://46.101.206.208/SearchTradesServlet?query=" + encodeURIComponent(query);
                    //  let url = "https://danscarr.com/SearchTradesServlet?query=" + encodeURIComponent(query);
                    let url = this.$store.state.siteData.baseUrl + this.$store.state.siteData.contextName + 
                                    "/SearchTradesServlet?query=" + encodeURIComponent(query);
                    let that = this;

                    if (ajaxRequest) {
                        console.log("ajaxRequest=", ajaxRequest);
                        ajaxRequest.cancel();
                    }

                    ajaxRequest = axios.CancelToken.source();

                    axios.get(url, {
                        cancelToken: ajaxRequest.token
                    })
                            .then(apiResponse => {
                                this.$store.commit('decrementNumberOfAjaxCalls');
                                console.log("apiResponse=", apiResponse);
                                let data = apiResponse.data;
                                let temp = data.trades; //JSON.parse(data).trades;
                                console.log("temp=", temp);

                                let result = temp.map(function (el, index) {
                                    let o = Object.assign({}, el);
                                    let spread = o.spread;
                                    // console.log("o=", o);
                                    if (spread !== null) {
                                        // let contract = spread.replace(/ /g, '').split("/");
                                        // console.log("contract=", contract);

                                        o.id = index;
                                        let open = moment(el.open, "YYYYMMDD");
                                        let close = moment(el.close, "YYYYMMDD");
                                        //  let days = el.days;
                                        o.open = open.format("MMM D, YYYY");
                                        o.close = close.format("MMM D, YYYY");
                                        o.avgDays = el.avgDays;
                                        o.avgMae = el.avgMin;
                                        o.worstMae = el.worstMin;
                                        o.avgMpe = el.avgMax;
                                        o.worstMpe = el.bestMax;
                                        o.rrr = el.rrr;
                                        o.rsi = (el.position === "LONG" ? el.rsi : (100 - el.rsi)).toFixed(1);

                                        o.ticker = el.spread;
                                        let generalForm = tickerToGeneralForm(o.ticker);
                                        o.legs = generalForm.legs;

                                        let commodity = contractNameDecomposer(generalForm.sampleContract[0]).commoditySymbol;
                                        o.group = getGroup(commodity);

                                        delete o.avgMin;
                                        delete o.worstMin;
                                        delete o.avgMax;
                                        delete o.bestMax;
                                       // console.log("o=", o);
                                    } else {
                                        console.log("no open positions. o.ticker=", o.ticker);
                                        o = "null";
                                    }
                                    return o;
                                });
                               // console.log("result=", result);
                                let filteredResult = result.filter(x => x !== "null");
                                console.log("filteredResult=", JSON.parse(JSON.stringify(filteredResult)));
                                that.trades = filteredResult;
                                that.numberOfTrades = data.numberOfTrades;
                                that.totalPages = Math.ceil(that.numberOfTrades / that.rowsPerPage);
                                console.log("numberOfTrades=", that.numberOfTrades, "  that.totalPages=", that.totalPages);

                                that.tickerColor = Array(that.numberOfTrades).fill(null).map(() => "darkblue");
                            })
                            .catch(() => {
                                this.$store.commit('decrementNumberOfAjaxCalls');
                                console.log("error");
                            });
                }
            }
        }
    };

</script>
