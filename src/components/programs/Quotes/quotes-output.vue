<template>
    <div style="border: 0px solid #505050; width: 100%;">
        <b-form-select  v-model="commodity" :options="commodityOptions" 
                        v-bind:size="'1'" v-on:change="getQuotes"
            style="border:1px solid gray; margin: 10px; width: min-content" ></b-form-select>

            <b-button @click="getDelayedData" variant="warning" size="sm" style="border: 1px solid darkgray; margin: 1px;">get delayed data</b-button> 


        <table v-if="contractObjects.length > 0" id="quotes" border="0" cellpadding="3x" style="width: 100%;">
            <tr>
                <th style="text-align: center;">Contract</th>
                <th style="text-align: center;">Open</th>
                <th v-if="['admin', 'superadmin'].includes($store.state.user.role)"
                         style="text-align: center; background-color: orange">RTH Open</th>
                <th style="text-align: center;">High</th>
                <th v-if="['admin', 'superadmin'].includes($store.state.user.role)"
                         style="text-align: center; background-color: orange">RTH High</th>
                <th style="text-align: center;">Low</th>
                <th v-if="['admin', 'superadmin'].includes($store.state.user.role)"
                         style="text-align: center; background-color: orange">RTH Low</th>
                <th style="text-align: center;">Close</th>
                <th style="text-align: center;">Previous Close</th>
                <th style="text-align: center;">Change</th>
                <th style="text-align: center;">Last</th>
                <th style="text-align: center; background-color: orange">Delayed</th>
                <th style="text-align: center;">Volume</th>
                <th style="text-align: center;">Open Interest</th>
            </tr>
            <tr v-for="n in contractObjects" :key="n.ticker" style="white-space: nowrap;">
                <td style="textAlign: center"><a v-bind:href="n.url">{{contractConverterForTemplate(n.ticker, "eod", symbols)}}</a></td> 
                <td style="textAlign: left"><a v-bind:href="n.url">{{n.open}}</a></td>
                <td v-if="['admin', 'superadmin'].includes($store.state.user.role)" 
                        style="textAlign: left; color: orange"><a v-bind:href="n.url">{{n.regularMarketOpen}}</a></td>
                <td style="textAlign: left"><a v-bind:href="n.url">{{n.high}}</a></td>
                <td v-if="['admin', 'superadmin'].includes($store.state.user.role)"
                         style="textAlign: left; color: orange"><a v-bind:href="n.url">{{n.regularMarketDayHigh}}</a></td>
                <td style="textAlign: left"><a v-bind:href="n.url">{{n.low}}</a></td>
                <td v-if="['admin', 'superadmin'].includes($store.state.user.role)"
                         style="textAlign: left; color: orange"><a v-bind:href="n.url">{{n.regularMarketDayLow}}</a></td>
                <td style="textAlign: left"><a v-bind:href="n.url">{{n.close}}</a></td>
                <td style="textAlign: left"><a v-bind:href="n.url">{{n.previous}}</a></td>
                <td  v-bind:style="[n.change < 0 ? {color: 'red'} : {color: 'black'}]" style="textAlign: left"><a v-bind:href="n.url">{{n.change}}</a></td>
                <td style="textAlign: left"><a v-bind:href="n.url">{{n.last}}</a></td>
                <td style="textAlign: left; color: orange"><a v-bind:href="n.url">{{n.delayed}}</a></td>
                <td style="textAlign: right"><a v-bind:href="n.url">{{n.volume}}</a></td>
                <td style="textAlign: right"><a v-bind:href="n.url">{{n.openInterest}}</a></td>
            </tr>
        </table>    

    </div>
</template>

<style scoped>
    #quotes {
        /* font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;*/
        font-weight: normal;
        color: black;
        border-collapse: collapse;
        width: 100%;
    }

    #quotes td {
        padding: 2px 14px 2px 14px;
        border: 1px solid #ddd;
    }

    #quotes tr:nth-child(even){
        background-color: #f2f2f2;
    }

    #quotes tr:hover {
        background-color: #ddd;
    }

    #quotes th {
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

    import $ from "jquery";
    import {contractConverter, OpenContracts, contractNameDecomposer, storeTab} from "@/js/main";
    import {getSymbolConversions} from "@/assets/js/TableConversionEOD_YAHOO";

    export default {

        mounted() {
            console.log("quotesVueModel starting.");
            this.getQuotes();
        },
        data: function () {
            return {
                contractObjects: [],
            }
        },
        props: ['namespace'],
        computed: {
            commodityOptions() {
                return this.$store.getters["siteData/commoditiesArray"].map(x => {
                    return {value: x.symbol, text: x.name};
                });
            },
            commodity: {
                get() {
                    let commodity = this.$store.getters[this.namespace + '/c'][0];
                    console.log("commodity=", commodity);
                    return  commodity;
                },
                set(commodity) {
                    this.$store.dispatch(this.namespace + '/changeCommodityLeg', {commodity: commodity, index: 0});
                }
            },
            symbols() {
                return this.$store.state.user.symbols;
            }
        },
        methods: {
            contractConverterForTemplate(contract, sourcesymbols, targetSymbols){
                return contractConverter(contract, sourcesymbols, targetSymbols);
            },
            getQuotes() {
                console.log("getQuotes() starting.");
                this.contractObjects = [];

                let url = this.$store.state.siteData.baseUrl + this.$store.state.siteData.contextName +
                        "/CurrentBarServlet?commodity=" + this.commodity;
                let that = this;
                $.ajax({
                    url: url,
                    type: "GET",
                    success: function (data) {
                        // that.$store.commit('decrementNumberOfAjaxCalls');
                        let parsedData = JSON.parse(data);
                        console.log("parsedData=", parsedData);
                     
                        that.contractObjects = parsedData;
                        that.getDelayedData();

                        let generalForm = JSON.parse(JSON.stringify(that.$store.state[that.namespace]));
                        storeTab(generalForm, that.$store.state.user.email);

                    }
                });
            },
            getYahooContractAndPostfix(contract){
                let symbolConversions = getSymbolConversions();
               // console.log("symbolConversions=", symbolConversions);

                let that = this;
                let yahooObject = symbolConversions.find(x => {
                   // console.log("x.EOD=", x.EOD, " that.commodity=", that.commodity);
                     return x.EOD === that.commodity;
                });
                console.log("yahooObject=", yahooObject);
              
                let tempContract = contractConverter(contract, "eod", "barchart");
                console.log("tempContract=", tempContract);

                let cND = contractNameDecomposer(tempContract, "barchart");
                console.log("cND=", cND);

                let yahooCommodity = yahooObject.SYMBOL;
                console.log("yahooCommodity=", yahooCommodity);

                let yahooContract = yahooCommodity + cND.monthSymbol +  cND.year;
                console.log("yahooContract=", yahooContract);

                return yahooContract+yahooObject.POSTFIX;
            },
            getDelayedData(){
                console.log("getDelayedData() starting.");

              //  let nearestOpenContract = OpenContracts(this.commodity)[0];
              //  console.log("nearestOpenContract=", nearestOpenContract);

                let yahooObjectArray = OpenContracts(this.commodity).map(contract => {
                    return {[this.symbols]: contract, yahoo: this.getYahooContractAndPostfix(contract)};
                });
                console.log("yahooObjectArray=", yahooObjectArray);

                let list = yahooObjectArray.map(x => x.yahoo).join(',');
                console.log("list=", list);

                let url = "https://app.charts.alpha4all.it/quote_b.php?symbol="+list;
                
                let that = this;
                $.ajax({
                    url: url,
                    type: "GET",
                    success: function (data) {
                        // that.$store.commit('decrementNumberOfAjaxCalls');
                        let parsedData = JSON.parse(data).quoteResponse.result;
                        console.log("parsedData=", parsedData);

                        that.contractObjects = that.contractObjects.slice().map(obj => {
                       
                           let yahooObject = yahooObjectArray.find(x => x[that.symbols] === obj.ticker);
                           // console.log("obj=", JSON.parse(JSON.stringify(obj)), " yahooObject=", yahooObject);

                           let delayedData = parsedData.find(x => x.underlyingExchangeSymbol === yahooObject.yahoo);
                          // console.log("delayedData=", delayedData);
                        
                           obj.delayed = typeof delayedData !== 'undefined' ? delayedData.regularMarketPrice : "";
                           obj.regularMarketDayLow = typeof delayedData !== 'undefined' ? delayedData.regularMarketDayLow : "";
                           obj.regularMarketDayHigh = typeof delayedData !== 'undefined' ? delayedData.regularMarketDayHigh : "";
                           obj.regularMarketOpen = typeof delayedData !== 'undefined' ? delayedData.regularMarketOpen : "";
                           return obj;
                            
                        });
                    }
                });
            }
        }
    }
</script>