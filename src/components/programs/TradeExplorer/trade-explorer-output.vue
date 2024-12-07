<template>
    <div style="border: 0px solid #505050; width: 100%;">

        <b-button-group style="margin: 6px 20px 0 -4px; font-size: 1.1rem">
            <b-form-group
                label="Filter"
                label-for="filter-input"
                label-cols-sm="3"
                label-align-sm="right"
                label-size="sm"
                class="mb-0"
                >
                <b-input-group size="sm">
                    <b-form-input
                        id="filter-input"
                        v-model="filter"
                        type="search"
                        placeholder="Type to Search"
                        ></b-form-input>

                    <b-input-group-append>
                        <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
                    </b-input-group-append>
                </b-input-group>
            </b-form-group>

            <span style="padding: 6px 30px 0 10px">
                number of results: {{numberOfTrades}}
            </span>
            <span style="padding: 6px 3px 0 10px">page:
            </span>
            <b-pagination size="md" style="margin: 0px 30px 0px 0; border: 0px solid gray; padding: 0px"
                          v-model="page"
                          :total-rows="trades.length"
                          :per-page="rowsPerPage">
            </b-pagination>

            <span style="margin: -2px 0px 2px 0; "> &nbsp;rows/page:
                <b-form-select size="md" style="border: 1px solid lightgray; width: auto;" v-model="rowsPerPage" :options="rowsPerPageOptions"></b-form-select>
            </span>
        </b-button-group>


        <b-table :items="trades" :fields="fields" striped sort-icon-left class="trade-explorer-table"
                 :per-page="rowsPerPage"
                 :current-page="page"
                 small
                 :filter="filter"
                 :filter-included-fields="filterOn"
                 @filtered="onFiltered"
                 style="border: 1px solid silver; width: auto; font-size: 12px; margin: 0 -0px 0 13px; border-radius: 3px">

            <template #head()="data">
                <div  style="padding: 0 20px 0 5px; "><b>{{ data.label }}</b></div>
            </template>

            <template #head(actions)="data">
                <b-row>
                    <b-col class="text-sm-center"><b>{{ data.label }}</b></b-col>
                </b-row>
            </template>

            <template #head(rsi)="data">

                <div style="font-weight: bolder;">
                    current <b-form-select size="sm" style="border: 1px solid gray; width: 50px; padding: 0px 0 0px 12px;
                                           margin: -1px 1px 0 0; height: 20px;"
                                           v-model="rsiPeriod" :options="rsiPeriodOptions">
                    </b-form-select>-day rsi
                </div>

            </template>

            <template v-slot:cell(legs)="{value}">
                <b-row>
                    <b-col class="text-sm-center">{{ value }}</b-col>
                </b-row>
            </template>

            <template v-slot:cell(days)="{value}">
                <b-row>
                    <b-col class="text-sm-center">{{ value }}</b-col>
                </b-row>
            </template>

            <template v-slot:cell(position)="{value}">
                <b-row>
                    <b-col class="text-sm-center">{{ value }}</b-col>
                </b-row>
            </template>

            <template v-slot:cell(profitability)="{value}">
                <b-row>
                    <b-col class="text-sm-center">{{ value }}</b-col>
                </b-row>
            </template>

            <template v-slot:cell(rsi)="{value}">
                <b-row>
                    <b-col class="text-sm-center">{{ value }}</b-col>
                </b-row>
            </template>

            <template v-slot:cell(actions)="{item}">
                <b-row>
                    <b-col class="text-sm-center">
                        <b-form-select style="border: 1px solid gray; width: auto; margin: -1px 0 0 0; padding-top: 1px;
                                       background-color: #05386B; color: white; height: 22px;"
                                       v-model="newProgram" :options="programOptions"
                                       size="sm" @change="getChart(item)" id="program-select"></b-form-select>
                    </b-col>
                </b-row>
            </template>

        </b-table>

    </div>
</template>

<style scoped>
    .trade-explorer-table td{
        color: black;
        padding: 3px 6px 3px 6px;
        height: 20px;
    }

    #program-select {
        background: #05386b  
            url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='4' height='5' viewBox='0 0 4 5'%3e%3cpath fill='white' d='M2 0L0 2h4zm0 5L0 3h4z'/%3e%3c/svg%3e")
            no-repeat right 0.75rem center/8px 10px !important;
    }
</style>

<script>
    var ajaxRequest = null;

    import axios from "axios";
    import moment from 'moment';
    import {tickerToGeneralForm, contractNameDecomposer, storeTab,
            getGroup, isTickerInDatabase, tickerConverter/*, getSymbolSetsOfCompleteTicker*/}  from "@/js/main.js";
    import { createInitialState } from '@/js/createInitialState.js';

    import $ from "jquery";

    export default {
        mounted() {
            console.log("trade-explorer-output.vue mounted() starting.");
            this.$store.commit(this.namespace + '/setTabTitle', "Trade Explorer");

            if (this.activeModuleName === this.namespace && !this.initialized) {
                this.initialized = true;
                this.getTrades();
            }
        },
        props: ['namespace'],
        data: function () {
            return{
                initialized: false,
                trades: [],
                numberOfTrades: 0,
                totalPages: 1,
                rowsPerPageOptions: Array(4).fill(null).map((x, i) => ({value: 10 * (i + 1), text: 10 * (i + 1)})),
                newProgram: null,
                rsiPeriodOptions: Array(13).fill(null).map((x, i) => ({value: i + 2, text: i + 2})),
                fields: [
                    {key: 'ticker', label: "ticker", sortable: true, formatter: this.tickerSymbolsFormat},
                    {key: 'legs', label: "legs", sortable: true},
                    {key: 'group', label: "group", sortable: true},
                    {key: 'position', label: "buy/sell", sortable: true},
                    {key: 'open', label: "open", sortable: true, formatter: this.fullTableFormatDateAssigned},
                    {key: 'close', label: "close", sortable: true, formatter: this.fullTableFormatDateAssigned},
                    {key: 'days', label: "days", sortable: true},
                    {key: 'profitability', label: "% profitable", sortable: true},
                    {key: 'days', label: "days", sortable: true},
                    {key: 'rsi', label: "7-day rsi", sortable: true},
                    {key: 'actions', label: "actions", sortable: false},
                ],
                rsiArray: [],
                filter: null,
                filterOn: [],
            }
        },
        computed: {
            programOptions() {
                return [
                    {value: null, text: 'Select Chart'},
                    {value: 'Calculator', text: 'Calculator'},
                    {value: 'BasicChartsNew', text: 'Futures Chart'},
                    {value: 'History', text: 'History Charts'},
                    {value: 'LongTermCharts', text: 'Long Term Charts'},
                   // {value: 'TradeMaps', text: 'Trade Maps'} // The open is no longer shown on the map since it is in the past.
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
            },
            rsiPeriod: {
                get() {
                    return this.$store.state[this.namespace].rsiPeriod;
                },
                set(period) {
                    this.$store.commit(this.namespace + '/setRsiPeriod', period);
                }
            },
            symbols() {
                return this.$store.state.user.symbols;
            }
        },
        watch: {
            activeModuleName: function (activeModuleName) {
                console.log("activeModuleName=", activeModuleName, " namespace=", this.namespace,
                        " this.initialized=", this.initialized);
                // console.log("this.query=", this.query);
                if (activeModuleName === this.namespace && !this.initialized && typeof this.query !== 'undefined' && !this.initialized) {
                    this.initialized = true;
                    this.getTrades();
                }
            },
            rsiPeriod(rsiPeriod) {
                console.log("watching rsiPeriod=", rsiPeriod);
                this.getTrades();
            },
            rowsPerPage: function (rowsPerPage) {
                console.log("watch: rowsPerPage=", rowsPerPage);

            },
            page: function (page) {
                console.log("watch: page=", page);
                this.loadRsi();
                let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                storeTab(generalForm, this.$store.state.user.email);
            },
            /*  symbols(symbols) {
             console.log("watching symbols=", symbols);
             let ticker = tickerConverter(this.tickerInput, "eod", newSymbols);
             console.log(" ticker=", ticker);
             },*/
        },
        methods: {
            tickerSymbolsFormat(ticker) {
                const formattedTicker = tickerConverter(ticker, "eod", this.symbols);
                return formattedTicker;
            },
            fullTableFormatDateAssigned(date) {
                const formattedDate = moment(date).format("MMM D YYYY");
                return formattedDate;
            },
            onFiltered(filteredItems) {
                // Trigger pagination to update the number of buttons/pages due to filtering
                this.totalRows = filteredItems.length;
                this.currentPage = 1;
            },
            getRsiForTicker(ticker) {
                console.log("getRsiForTicker() starting. ticker=", ticker);

                let rsi = this.rsiArray[ticker];
                // let rsi = typeof element !== 'undefined' ? element.rsi : null;
                // console.log("rsi=", rsi);
                return rsi;
            },
            getChart(item) {
                console.log("getChart() starting. item=", item);
                //  this.mouseClicked(index);
                /*  let ticker = element.target.textContent;
                 console.log("element=", element);
                 console.log("ticker=", ticker);*/

                let program = this.newProgram;
                this.newProgram = null;
                console.log("program=", program, " this.newProgram=", this.newProgram);

                let trade = item;
                console.log("trade=", trade);
                let open = moment(trade.open, "YYYYMMDD").format("YYYY-MM-DD");
                let close = moment(trade.close, "YYYYMMDD").format("YYYY-MM-DD");
                console.log("open=", open, " close=", close);

                let generalForm = tickerToGeneralForm(trade.ticker);
                generalForm.open = open;
                generalForm.close = close;

                /* if (trade.position === "SHORT") {
                 generalForm.p = [-1, 1, 1, 1];
                 } */

                if (program === "LongTermCharts") {
                    generalForm.aligned = false;
                    generalForm.normalization = "off";
                    generalForm.longtermChartColors = "yearly";
                    generalForm.truncate = 1;
                    generalForm.showTradingPeriod = false;
                }

                // delete generalForm.program;
                generalForm.program = program;
                generalForm.buySell = trade.position === "LONG" ? "buy" : "sell";
                generalForm.intracommodity = true;
                generalForm.showTradingPeriod = !(!generalForm.aligned && generalForm.program === "LongTermCharts");
                generalForm.zoomToSavedCoordinates = false;

                generalForm.addRSIPanel = true;
                generalForm.rsiPeriod = this.rsiPeriod;
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

                /*let mergedForm = {...tradeMapsInitialState, ...generalForm};
                 console.log("mergedForm=", mergedForm);
                 this.$emit('newTabWithInitialState', mergedForm); */
                 
                let role = this.$store.state.user.role;
                let initialState = createInitialState(program, role, generalForm);
                //this.$emit('newTabWithInitialState', initialState); 
                this.$store.dispatch('newTabWithInitialState', initialState);                
            },
            loadRsi() {
                console.log("loadRsi() starting.");

                return new Promise(resolve => {
                    // let url = this.$store.state.siteData.baseUrl + this.$store.state.siteData.contextName + "/RsiArrayControllerServlet";
                    let url = this.$store.state.siteData.baseUrl + this.$store.state.siteData.contextName + "/TradeExplorerRsiArrayControllerServlet";
                    $.ajax({
                        url: url,
                        type: "POST",
                        success: function (data) {
                            // that.$store.commit('decrementNumberOfAjaxCalls');
                            let parsedData = JSON.parse(data);
                           // console.log("parsedData=", parsedData);
                            // let tickers = Object.keys(parsedData);
                            // console.log("tickers=", tickers);
                            resolve(parsedData);

                        }
                    });
                });
            },
            getTrades() {
                console.log("getTrades() starting.");

                let that = this;
                this.loadRsi().then(rsiArray => {
                    console.log("rsiArray=", rsiArray);

                    let dates = Object.values(rsiArray).map(x => x.date);
                    let lastDate = Math.max(...dates);
                  //  console.log("lastDate=", lastDate);

                    that.$store.commit('resetNumberOfAjaxCalls');
                    that.$store.commit('incrementNumberOfAjaxCalls');

                    that.trades = [];
                    let url = "https://app.charts.alpha4all.it/trade_explorer.php?Service=Explorer&Action=Get&SecureCode=@fpnr3bu5b3lud3";

                    if (ajaxRequest) {
                        console.log("ajaxRequest=", ajaxRequest);
                        ajaxRequest.cancel();
                    }

                    ajaxRequest = axios.CancelToken.source();

                    axios.get(url, {
                        cancelToken: ajaxRequest.token
                    })
                            .then(apiResponse => {
                                that.$store.commit('decrementNumberOfAjaxCalls');
                               // console.log("apiResponse=", apiResponse);
                                let data = apiResponse.data;
                                // console.log("data=", data);
                                let temp = data.explorers;
                               // console.log("temp=", temp);

                                // let symbols = getSymbolSetsOfCompleteTicker("ZCH24-2*C2024H");  //getSymbolSetsOfCompleteTicker(o.ticker);
                                // console.log("symbols=", symbols);

                                let result = temp.map(function (el, index) {
                                    let o = Object.assign({}, el);
                                   // console.log("o.ticker=", o.ticker);

                                    if (isTickerInDatabase(o.ticker)) {
                                        // let contract = spread.replace(/ /g, '').split("/");
                                        // console.log("contract=", contract);

                                        o.id = index;
                                        let open = el.open_date;
                                        let close = el.close_date;
                                        //  let days = el.days;
                                        o.open = open; //.format("MMM D, YYYY");
                                        o.close = close; //.format("MMM D, YYYY");
                                        o.days = el.days;
                                        o.avgMae = el.avgMin;
                                        o.worstMae = el.worstMin;
                                        o.avgMpe = el.avgMax;
                                        o.worstMpe = el.bestMax;
                                        o.rrr = el.rrr;

                                        let tickerRsiArray = rsiArray[o.ticker];
                                       // console.log("tickerRsiArray=", tickerRsiArray);

                                        if (typeof tickerRsiArray !== 'undefined') {
                                            let date = tickerRsiArray.date;

                                            o.rsi = date === lastDate ? rsiArray[o.ticker].rsi.find(x => x.period === that.rsiPeriod).rsi : null;
                                            // o.rsi = (el.position === "LONG" ? el.rsi : (100 - el.rsi)).toFixed(1);
                                        }
                                        o.ticker = el.ticker;
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
                                        //  console.log("Bad symbol, o.ticker=", o.ticker);
                                        o = "null";
                                    }
                                    return o;
                                });
                                // console.log("result=", result);
                                that.trades = result.filter(x => x !== "null");
                                // console.log("that.trades=", JSON.parse(JSON.stringify(that.trades)));

                                that.numberOfTrades = that.trades.length;
                                that.totalPages = Math.ceil(that.numberOfTrades / that.rowsPerPage);
                                // console.log("numberOfTrades=", that.numberOfTrades, " that.rowsPerPage=", that.rowsPerPage +" that.totalPages=", that.totalPages);

                                that.loadRsi();
                                let generalForm = JSON.parse(JSON.stringify(that.$store.state[that.namespace]));
                                storeTab(generalForm, that.$store.state.user.email);

                            })
                            .catch((err) => {
                                that.$store.commit('decrementNumberOfAjaxCalls');
                                console.log("err=", err);
                            });
                });


            }
        }
    };

</script>
