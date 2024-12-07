<template>
    <span>
        <auto-complete
            v-model="test"
            :data-source="dataSource"
            :id="'stock-auto-complete-'+namespace"
            style="width: 400px; font-size: 1.1rem; background-color: white;  border: 0px solid gray;"
            placeholder="input here"
            @select="onSelect"
            @search="onSearch"
            @change="onChange"
            />

    </span>
</template>

<script>
  //  import $ from "jquery";
    import { AutoComplete } from 'ant-design-vue';
   // import {getSymbols} from '@/assets/js/stock_symbols.js';
    const axios = require('axios');

    export default {
        components: {
            AutoComplete
        },
        mounted() {
            console.log("stock-auto-complete.vue mounted starting.");
            console.log("this.$store.state[this.namespace].stockArray=", this.$store.state[this.namespace].stockArray);
            this.test = this.selectedStock;
            this.getInstrumentDefinitionsFromBarchart();
        },
        props: ['namespace', 'index'],
        data() {
            return {
                dataSource: [],
                autoCompleteList: [],
                test: null
            };
        },
        computed: {
            selectedStock: {
                get(){
                    return this.$store.state[this.namespace].stockArray[this.index];
                },
                set(){}
            }
        },
        watch: {
           /* selectedStock(val) {
                console.log('selectedStock=', val);
                //  this.getHistory(val.split(',')[0]);
            }*/
        },
        methods: {
            onSearch(searchText) {
                let capitalizedSearchText = searchText.toUpperCase();
                console.log("onSearch() starting. capitalizedSearchText=", capitalizedSearchText);
                if(capitalizedSearchText.indexOf(',') === -1){
                   this.getInstrumentDefinitionsFromBarchart(searchText);
                }
            },
            onSelect(value) {
                console.log('onSelect', value);
                let ticker = value.split(',')[0];
                console.log("ticker=", ticker);

                let tickerArray = [...this.autoCompleteList].map(x => x.split(',')[0]);
                console.log("tickerArray=", tickerArray);

                if(/*this.selectedStock.includes(',') &&*/ tickerArray.includes(ticker)) {
                    // this.getHistory(ticker);
                    let newArray = this.$store.state[this.namespace].stockArray.slice(0);
                    //  console.log("autoCompleteList=", this.autoCompleteList);
                    let listString = this.autoCompleteList.find(x => x.split(',')[0] == ticker);
                    //  console.log("listString=", listString);

                    newArray[this.index] = listString;
                    console.log("newArray=", newArray);

                    this.$store.commit(this.namespace + '/setStockArray', newArray);
                    let selected = [];
                  /*  selected.push(newArray.slice(0, this.$store.state[this.namespace].legs).join("/"));
                    console.log("selected=", selected); */
                    this.$store.commit(this.namespace + '/setSelected', selected); 
                }

                // this.getHistory(ticker);
            },
            onChange(value) {
                console.log('onChange', value);
            },
          /*  getInstrumentDefinitionsFromServer(keyword){
                console.log("getInstrumentDefinitionsFromServer() starting. keyword=", keyword);
                let symbols = typeof keyword === 'undefined' ? [] :
                     getSymbols().filter(x => x.Symbol.startsWith(keyword.toUpperCase()) || x.Name.toUpperCase().startsWith(keyword.toUpperCase())).slice(0, 20);
                console.log("symbols=", symbols);

                let temp = symbols.map(x => x.Symbol + ",  " + x.Name).sort();
                //  console.log("temp=", temp);
                this.autoCompleteList = temp;
                this.dataSource = temp;
            },*/
            getInstrumentDefinitionsFromBarchart(keyword) {
            console.log("getInstrumentDefinitionsFromBarchart() starting. keyword=", keyword);
                let that = this;
                this.autoCompleteList = [];
                this.dataSource = [];
                console.log("api call for auto-complete.");

                let url = "https://app.charts.alpha4all.it/search-feature/catcomp_stocks.php?searchTerm=" + keyword;
                axios.get(url).then(data => {
                                             let parsedData = data.data;
                        console.log("parsedData=", parsedData);
                        let temp = parsedData.map(x => x.Symbol + ",  " + x.Name).sort();
                        console.log("temp=", temp);
                        that.autoCompleteList = temp;
                        that.dataSource = temp;
                        console.log("that.dataSource=", that.dataSource);
                });

            /*    $.ajax({
                    // url: baseUrl + "/node/get-auto-complete",
                    // url: "https://ondemand.websol.barchart.com/getInstrumentDefinition.json?apikey=b1c49578e1c86ad86ed719375aff6f49&exchanges=NYSE,NASDAQ&maxRecords=10000",
                    // url: "https://test.charts.alpha4all.com/instrument_definition.php?exchanges=NYSE,NASDAQ&maxRecords=1000",
                    // url: "http://localhost:8080/StockDefinitionsServlet?letter=" + letter,
                   //   url: "https://ondemand.websol.barchart.com/getSymbolLookUp.json?apikey=b1c49578e1c86ad86ed719375aff6f49&keyword="+keyword+"&exchanges=NASDAQ,NYSE,AMEX",
                    url: "https://app.charts.alpha4all.it/search-feature/catcomp_stocks.php?searchTerm=" + keyword,
                    type: "GET",
                    success: function (data) {
                        let parsedData = JSON.parse(data);
                        console.log("parsedData=", parsedData);
                        let temp = parsedData.map(x => x.Symbol + ",  " + x.Name).sort();
                        //  console.log("temp=", temp);
                        that.autoCompleteList = temp;
                        that.dataSource = temp;

                    }
                }); */
            } 
        }
    };


</script>