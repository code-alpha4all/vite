<template>
    <div v-bind:style="{width: width + 'px'}">
        <table border="1" class="trade-table" id="table" v-bind:style="{fontSize: fontSize}">
            <tr style="background-color: darkslategrey; color: white; padding: 2px; font-size: 0.8rem">
                <th style="text-align: center;">ticker</th>
                <th colspan=2 style="text-align: center;" v-bind:style="{backgroundColor: buySell === 'buy' ? 'green' : 'red'}">
                    {{ sameUnitsAndUnitMoves ? "open (" : "open equity (" }}{{ buySell === 'buy'? 'buy' : 'sell'}})</th>
                <th colspan=2 style="text-align: center;" v-bind:style="{backgroundColor: buySell === 'buy' ? 'red' : 'green'}">{{ sameUnitsAndUnitMoves ? "close (" : "close equity (" }}{{ buySell === 'buy'? 'sell' : 'buy'}})</th>
                <th v-if="sameUnitsAndUnitMoves && program === 'Calculator'" style="text-align: center;">change = sell - buy</th> 
                <th style="text-align: center;">equity change</th>
                <th style="text-align: center;">days</th>
                <th style="text-align: center;">avg. profit/day</th>
                <th colspan=2 style="text-align: center;">max adverse excursion</th>
                <th colspan=2 style="text-align: center;">max profitable excursion</th>
            </tr>
            <tr v-for="n in trades" v-bind:key="n.index" style="text-align: right; font-weight: normal">
                <td style="white-space: nowrap; padding: 2px; text-align: center">{{n.spread}}</td>
                <td style="white-space: nowrap; padding: 2px">{{n.openDate}}</td>
                <td v-if="sameUnitsAndUnitMoves" style="white-space: nowrap; padding: 2px">{{n.open}}</td>
                <td v-if="!sameUnitsAndUnitMoves" style="white-space: nowrap; padding: 2px">{{displayMoneyFormat(n.openEquity)}}</td>
                <td style="white-space: nowrap; padding: 2px">{{n.closeDate}}</td>
                <td v-if="sameUnitsAndUnitMoves" style="white-space: nowrap; padding: 2px">{{n.close}}</td>
                <td v-if="!sameUnitsAndUnitMoves" style="white-space: nowrap; padding: 2px">{{displayMoneyFormat(n.closeEquity)}}</td>
                <td v-if="sameUnitsAndUnitMoves && program === 'Calculator'" v-bind:style="{color: n.change < 0 ? 'red' : 'black' }" style="white-space: nowrap; padding: 2px">{{n.change}}</td>
                <td v-bind:style="{color: n.change < 0 ? 'red' : 'black' }" style="white-space: nowrap; padding: 2px">{{displayMoneyFormat(n.equityChange)}}</td>

                <td style="white-space: nowrap; padding: 2px">{{n.days}}</td>
                <td  v-bind:style="{color: n.appd < 0 ? 'red' : 'black' }" style="white-space: nowrap; padding: 2px">{{displayMoneyFormat(n.appd)}}</td>

                <td style="white-space: nowrap; padding: 2px">{{n.minDate}}</td>
                <td v-bind:style="{color: n.min < 0 ? 'red' : 'black' }" style="white-space: nowrap; padding: 2px">{{displayMoneyFormat(n.min)}}</td>
                <td style="white-space: nowrap; padding: 2px">{{n.maxDate}}</td>
                <td style="white-space: nowrap; padding: 2px; color: black">{{displayMoneyFormat(n.max)}}</td>
            </tr>
            <tr style="font-weight: bold; text-align: right; white-space: nowrap; font-size: 0.95rem">
                <td colspan="3" style="text-align: center">{{numberOfTrades}} trades:  &nbsp;&nbsp; {{percentUp}}% profitable</td>
                <td colspan="2" style="text-align: right; padding-right: 2px;">averages:</td>
                <td v-if="sameUnitsAndUnitMoves && program === 'Calculator'" v-bind:style="{color: avgChange < 0 ? 'red' : 'black' }" style="padding-right: 2px;">{{avgChange}}</td> 
                <td v-bind:style="{color: avgChange < 0 ? 'red' : 'black' }" style="padding-right: 2px;">{{displayMoneyFormat(avgEquityChange)}}</td>
                <td style="padding-right: 2px;">{{avgDays}}</td>
                <td v-bind:style="{color: avgChange < 0 ? 'red' : 'black' }" style="padding-right: 2px;">{{displayMoneyFormat(avgAppd)}}</td>

                <td colspan="2" style="color: red; padding-right: 2px;">{{displayMoneyFormat(avgMin)}}</td>
                <td colspan="2" style="color: black; padding-right: 2px;">{{displayMoneyFormat(avgMax)}}</td>
            </tr>
        </table>    
    </div>
</template>

<style scoped>
    #table {
        font-family: Verdana, sans-serif;
        border-collapse: collapse;
        width: 100%;
    }

    #table td, #table th {
        border: 1px solid #ddd;
        padding-right: 5px;
        padding-left: 5px;
    }

    #table tr:nth-child(even){background-color: #f2f2f2;}

    #table tr:hover {background-color: #ddd;}

    #table th {
        padding-top: 4px;
        padding-bottom: 4px;
        text-align: left;
        background-color: rgb(15, 15, 15);
        color: white;
       /* white-space: nowrap; // This causes width to jump when map is clicked.*/
    }
</style>

<script>

    import $ from "jquery";
    import {contractNameDecomposer, spreadTitle, displayMoneyFormat} from "@/js/main";
    import moment from 'moment';
    import {getCommoditiesArray} from '../js/main';

    export default {
        mounted: function () {
            // this.loadParsedData();
        },
        props: {
            namespace: {
                type: String,
                default: ""
            },
            parsedData: {
                type: Object
            },
             width: {
                type: String,
                default: "100%"
            }
        },
        data: function () {
            return {
                sameUnitsAndUnitMoves: true,
                trades: [],
                upNumber: 0,
                numberOfTrades: 0,
                percentUp: 0,
                percentDown: 0,
                avgChange: 0,
                avgEquityChange: 0,
                avgMax: 0,
                avgMin: 0,
                avgDays: 0,
                avgAppd: 0,
                busy: false
            }
        },
        computed: {
            avgMaxDisplay() {
                // console.log("this.avgMax=", this.avgMax);
                return isNaN(this.avgMax) ? "------" : '$' + Math.abs(this.avgMax).toLocaleString("en-US");
            },
            avgMinDisplay() {
                return isNaN(this.avgMin) ? "------" : '-$' + Math.abs(this.avgMin).toLocaleString("en-US");
            },
            program(){
              //  console.log("program=", this.$store.state[this.namespace].program);
                return this.$store.state[this.namespace].program;
            },            
            fontSize(){
                return this.program === "Calculator" ? "0.90rem" : "0.84rem";
            },
            buySell() {
                return this.$store.state[this.namespace].buySell;
            },
            symbols(){
                return this.$store.state.user.symbols;
            },
            unitMove(){
                return this.$store.state[this.namespace].unitMove;
            }
        },
        watch: {
            symbols(symbols){
                console.log("watch symbols=", symbols);
                this.loadParsedData();
            },
            parsedData: function (parsedData) {
                // console.log("watch parsedData = ", JSON.parse(JSON.stringify(parsedData)));
                //let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                if (typeof parsedData.values === 'undefined' || parsedData.values === null) {
                    this.parsedData.values = [];
                }
                this.loadParsedData();
            },
            loading: function (loading) {
                // console.log("loading watch!");
                if (loading) {
                    document.getElementById(this.namespace).innerHTML = "";
                }
            },
            buySell(){
                console.log("watching buySell");
                this.loadParsedData();
            }
        },
        methods: {
            customToFixed: function (number) {
                // console.log("number=", number);
                let returnValue;
                if (isNaN(number) || null == number) {
                    // console.log("missing data.");
                    returnValue = "\u00A0\u00A0------\u00A0\u00A0 ";
                } else {
                   // console.log("this.digits=", this.digits);
                    returnValue = number.toFixed(this.digits);
                }
                // console.log("returnValue=", returnValue);
                return returnValue;
            },
            displayMoneyFormat(number){
                return displayMoneyFormat(number);           
            },
            loadParsedData() {
               // console.log("loadParsedData() starting.");
                if (typeof this.parsedData.unit === 'undefined' && Object.keys(this.parsedData.values).length !== 0) {
                    this.trades = [];
                    this.numberOfTrades = 0;
                    this.upNumber = 0;
                    this.percentUp = 0;
                    this.avgChange = 0;
                    this.avgEquityChange = 0;
                    this.avgMin = 0;
                    this.avgMax = 0;
                    this.avgDays = 0;
                    this.avgAppd = 0;

                    this.digits = this.parsedData.digits;
                    this.sameUnitsAndUnitMoves = this.parsedData.sameUnitsAndUnitMoves;

                    let temp = JSON.parse(JSON.stringify(this.parsedData.values));
                    console.log("temp=", temp);
                    if (typeof temp !== 'undefined' && temp !== null) {
                        Object.keys(temp).forEach(function (key) {
                            if (Array.isArray(temp[key])) {
                                // console.log("temp[", key, "]=", temp[key]);
                                temp[key] = temp[key].reverse();
                            }
                        });

                        let numberOfRows = temp.spreads.length;
                        let contract = temp.spreads[0].split("/");
                        // console.log("contract=", contract + " contract.length=", contract.length);
                        let commodity = contractNameDecomposer(contract[0].trim()).commoditySymbol;
                        let unitMove = 1;
                        if (this.sameUnitsAndUnitMoves) {
                            unitMove = getCommoditiesArray().find(x => x.symbol === commodity).unitMove;
                        }
                        console.log("unitMove=", unitMove);

                        let tempForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));

                        let invertDatesMultiplier = this.$store.state[this.namespace].browserSideOnly.invertDatesMultiplier;
                        // console.log("invertDatesMultiplier=", invertDatesMultiplier);
                        let noLegSwapping = false;
                        let includeUnitMoves = true;

                        for (let i = 0; i < numberOfRows; i++) {
                            tempForm.selected[0] = temp.spreads[i].trim();

                            let row = {};
                            let title =  spreadTitle(tempForm, invertDatesMultiplier, noLegSwapping, this.$store.state.user.symbols, includeUnitMoves);
                           // console.log("title=", title);
                            /* if (title[0] === '-' && contract.length == 1) {
                             title = title.substr(1);
                             } */
                            row.spread = title;

                            let open = this.customToFixed(temp.openVector[i]);
                            row.open = isNaN(open) ? open : invertDatesMultiplier * open;
                            row.openEquity = unitMove * row.open;
                            let openDate = moment(temp.openDateVector[i], "YYYYMMDD");
                            row.openDate = isNaN(open) ? "\u00A0\u00A0----------\u00A0\u00A0 " : openDate.format("MMM D, YYYY");

                            let close = this.customToFixed(temp.closeVector[i]);
                            row.close = isNaN(close) ? close : invertDatesMultiplier * close;
                            row.closeEquity = unitMove * row.close;
                            let closeDate = moment(temp.closeDateVector[i], "YYYYMMDD");
                            row.closeDate = isNaN(close) ? "\u00A0\u00A0----------\u00A0\u00A0 " : closeDate.format("MMM D, YYYY");

                            if (closeDate.isAfter(openDate)) {
                                row.change = this.customToFixed(temp.changeVector[i] * (this.buySell === 'buy' ? 1 : -1 ));
                                row.equityChange = unitMove * this.customToFixed(temp.changeVector[i] * (this.buySell === 'buy' ? 1 : -1 ));

                                let minDate = this.buySell === 'buy' ? temp.minDateVector[i] : temp.maxDateVector[i];
                                row.minDate = minDate === null ? "\u00A0\u00A0----------\u00A0\u00A0 " : moment(minDate, "YYYYMMDD").format("MMM D, YYYY");
                                row.min = unitMove * this.customToFixed(this.buySell === 'buy' ? temp.minVector[i] : -temp.maxVector[i]);

                                let maxDate = this.buySell === 'buy' ? temp.maxDateVector[i] : temp.minDateVector[i];
                                row.maxDate = maxDate === null ? "\u00A0\u00A0----------\u00A0\u00A0 " : moment(maxDate, "YYYYMMDD").format("MMM D, YYYY");
                                row.max = unitMove * this.customToFixed(this.buySell === 'buy' ? temp.maxVector[i] : -temp.minVector[i]);

                                let days = temp.daysVector[i];
                                row.days = days === null ? "\u00A0\u00A0------\u00A0\u00A0 " : days;

                                let appd = unitMove * temp.appdVector[i] * (this.buySell === 'buy' ? 1 : -1 );
                                row.appd = isNaN(appd) ? appd : invertDatesMultiplier * appd;
                            } else {
                                row.openDate = "\u00A0\u00A0----------\u00A0\u00A0 ";
                                row.closeDate = "\u00A0\u00A0----------\u00A0\u00A0 ";
                                row.open = "\u00A0\u00A0------\u00A0\u00A0 ";
                                row.close = "\u00A0\u00A0------\u00A0\u00A0 ";
                                row.change = "\u00A0\u00A0------\u00A0\u00A0 ";
                                row.equityChange = "\u00A0\u00A0------\u00A0\u00A0 ";
                                row.minDate = "\u00A0\u00A0----------\u00A0\u00A0 ";
                                row.min = "\u00A0\u00A0----------\u00A0\u00A0 ";
                                row.maxDate = "\u00A0\u00A0----------\u00A0\u00A0 ";
                                row.max = "\u00A0\u00A0----------\u00A0\u00A0 ";
                                row.days = "\u00A0\u00A0----------\u00A0\u00A0 ";
                                row.appd = "\u00A0\u00A0----------\u00A0\u00A0 ";
                            }
                            this.trades.push(row);
                        }

                        let stats = this.parsedData.statsJson;
                        console.log("stats=", JSON.parse(JSON.stringify(stats)));
                        this.percentUp = this.buySell === 'buy' ? stats.percentUp.toFixed(1) : stats.percentDown.toFixed(1);
                        this.avgChange = (stats.avgChange * (this.buySell === 'buy' ? 1 : -1)).toFixed(2 + this.digits);
                        this.avgEquityChange = (unitMove * stats.avgChange * (this.buySell === 'buy' ? 1 : -1)).toFixed(2);
                        this.avgMax = (this.buySell === 'buy' ? stats.avgMax : -stats.avgMin).toFixed(2);
                        this.avgMin = (this.buySell === 'buy' ? stats.avgMin : -stats.avgMax).toFixed(2);
                        this.numberOfTrades = stats.numberOfTrades;
                        this.avgAppd = stats.avgAppd * (this.buySell === 'buy' ? 1 : -1);
                        this.avgDays = stats.avgDays.toFixed(2);
                    }
                } else {
                    this.trades = [];
                    this.numberOfTrades = 0;
                    this.upNumber = 0;
                    this.percentUp = 0;
                    this.avgChange = 0;
                    this.avgEquityChange = 0;
                    this.avgMin = 0;
                    this.avgMax = 0;
                    this.avgDays = 0;
                    this.avgAppd = 0;
                    $("#progress").hide();
                    // $("#button").show();
                }
            }
        }

    }
</script>