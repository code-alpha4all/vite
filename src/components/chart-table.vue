<template>
    <span style="resize: both;">
        
        <table v-if="nearestOpen" v-bind:id="namespace + '-chartTable'" style="margin: 3px; height: 100%; width: 100%; table-layout:fixed">
            <tr v-for="m in allRowObjects.length"
                v-bind:key="m"
                style="border: 0px solid gray;"
                v-show="page == allRowObjects[m-1].class.replace('page','')"
                v-bind:id="allRowObjects[m-1].id"
                v-bind:class="allRowObjects[m-1].class"
                v-bind:style="{width: '100%'}">

                <!--   <td>
                       <div style="padding: 3px; border: 0px solid gray">{{allRowObjects[m-1].id}}</div>
                       <span>width: {{width}}</span>&nbsp;&nbsp;&nbsp;&nbsp; <span>height: {{height}}</span>
                   </td>  -->

                <td v-for="n in allRowObjects[0].cellObjects.length"
                    v-bind:key="n"
                    style="padding: 3px; border: 1px solid gray; height: 50%"
                    v-bind:id="allRowObjects[0].cellObjects[n-1].id.replace('chartDiv_','')">

                    <!--   <div style="padding: 3px; border: 1px solid gray">{{allRowObjects[m-1].cellObjects[n-1].id}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          {{allRowObjects[m-1].cellObjects[n-1].ref}}</div>  -->

            <multiple-series-chart v-if="allRowObjects[m-1].cellObjects[n-1].id.replace('chartDiv_','') !== ''"
                                v-bind:namespace="namespace"  
                                v-bind:ref="allRowObjects[m-1].cellObjects[n-1].ref"
                                v-bind:div-name="allRowObjects[m-1].cellObjects[n-1].id">
            </multiple-series-chart>  

            </td>
            <!--  <td>
                  <div style="padding: 3px; border: 0px solid gray">{{allRowObjects[m-1].class}}</div>
              </td> -->
            </tr>
        </table>

        <div v-else style="color: red; margin: 10px; font-size: 14px">Not currently trading.</div>

    </span>
</template>

<style scoped>
    .resize-chart-table {
       /* display: flex;
        justify-content: center;
        align-items: center;
        margin: 2px;
        width: 100%;
        overflow: hidden;
        resize: both;*/
    }
</style>

<script>

    import multipleSeriesChart from '@/components/am4charts-multiple-series-chart';
    import $ from 'jquery';
    import moment from "moment";
    import {spreadToColor, tickerToGeneralForm, nearestOpenSpread, spreadTitle} from "@/js/main";

    export default {
        components: {
            multipleSeriesChart
        },
        mounted: function () {
            // console.log("chart-table.vue starting.");
        },
        props: {
            namespace: {
                type: String
            },
            tickers: {
                type: Array
            }
        },    
        data() {
            return {
                ajax: null,
                chartLoadedArray: []
            }
        },
        computed: {
            page() {
                return parseInt(this.$store.state[this.namespace].chartParameters.page);
            },
            legs() {
                return this.$store.state[this.namespace].legs;
            },
            chartsPerRow() {
                return parseInt(this.$store.state[this.namespace].chartParameters.chartsPerRow);
            },
            rowsPerPage() {
                return parseInt(this.$store.state[this.namespace].chartParameters.rowsPerPage);
            },
            height() {
               // let availableHeight = $("#chartDiv").height();
               // console.log("availableHeight=", availableHeight);
                return this.$store.state[this.namespace].chartParameters.height;
            },
            width() {
                return this.$store.state[this.namespace].chartParameters.width;
            },
            nearestOpen(){
                let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                return nearestOpenSpread(generalForm).value; 
            },
            allRowObjects() {
                let numberOfCharts = this.tickers.length;
                let numberOfPages = Math.ceil(numberOfCharts / (this.chartsPerRow * this.rowsPerPage));
                // console.log("numberOfCharts=", numberOfCharts, " numberOfPages=", numberOfPages);

                let allRowObjectsArrays = Array(numberOfPages).fill()
                        .map((x, pageIndex) => {
                            let rowObjectArray = Array(this.rowsPerPage).fill()
                                    .map((x, i) => {
                                        let rowIndex = parseInt((pageIndex) * this.rowsPerPage + i);
                                        return{
                                            id: "chartrow_" + rowIndex,
                                            class: "page" + (pageIndex + 1),
                                            cellObjects: Array(this.chartsPerRow).fill()
                                                    .map((x, j) => {
                                                        let cellIndex = parseInt((rowIndex * this.chartsPerRow) + j);
                                                        return cellIndex < numberOfCharts ? {
                                                            id: this.namespace + "-chartDiv_" + cellIndex,
                                                            ref: "chartref_" + cellIndex,
                                                            page: "page" + (pageIndex + 1),
                                                            chartrow: rowIndex,
                                                            ticker: [this.tickers[cellIndex]]
                                                        } : {
                                                            id: "",
                                                            ref: "",
                                                            page: "",
                                                            chartrow: ""
                                                        };
                                                    })
                                        };
                                    });
                            // console.log("rowObjectArray=", rowObjectArray);
                            return rowObjectArray;
                        });
                       // console.log("allRowObjectsArrays.flat()=", allRowObjectsArrays.flat().map(x => x.cellObjects[0].generalForm.selected));

                return allRowObjectsArrays.flat();
            }
        },
        watch: {
            allRowObjects: function () {
                // console.log("watching allRowObjects");
                // this.loadCharts();
            },
            legs: function () {
                // console.log("watching legs");
                this.chartLoadedArray = [];
                // updateChart();
            },
            page: function () {
                // console.log("watching page");
                this.loadCharts();
            },
            chartsPerRow: function () {
                // console.log("watching chartsPerRow");
                this.chartLoadedArray = [];
              //  this.removeAllCharts();
              //  this.loadCharts();
            },
            rowsPerPage: function (rowsPerPage) {
                console.log("watching rowsPerPage. rowsPerPage=", rowsPerPage);
                let scrollHeight = document.documentElement.scrollHeight;
                console.log("scrollHeight=", scrollHeight);
                this.chartLoadedArray = [];
                let height =  Math.round((scrollHeight - 40) / rowsPerPage);
                console.log("height=", height);
                this.$store.commit(this.namespace + '/chartParameters/setHeight', height);
                //this.removeAllCharts();
               // this.loadCharts();
            },
            height: function(height){
                console.log("watching height. height=", height);
            },
            tickers: function(/*tickers*/){
              //  console.log("watching tickers. tickers=", tickers);
                this.removeAllCharts();
                this.loadCharts();
            }
        },
        methods: {
            loadCharts() {
                console.log("loadCharts() starting.");
               if(!this.nearestOpen){
                console.log("Not trading.");
                return;
               }
               let that = this;

               // console.log("this.allRowObjects.map(x => x.cellObjects[0].generalForm.selected=", this.allRowObjects.map(x => x.cellObjects[0].generalForm.selected));
                let currentPageChartDivArray = this.allRowObjects.filter(x => x.class.replace('page', '') == that.page)
                        .map(x => {
                          //  console.log("x.cellObjects[0].generalForm.selected=", x.cellObjects[0].generalForm.selected.slice());
                            return x.cellObjects;
                        }).flat();
              //  console.log("currentPageChartDivArray=", currentPageChartDivArray);
               // console.log("currentPageChartDivArray.map(x => x.ticker)=", currentPageChartDivArray.map(x => x.ticker));

                let filteredCurrentPageChartDivArray = currentPageChartDivArray.filter(x => x.id !== "")
                        .filter(x => !that.chartLoadedArray.includes(x.ref));
              //  console.log("filteredCurrentPageChartDivArray=", filteredCurrentPageChartDivArray);

               // console.log("this.$refs=", this.$refs);

                let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                delete generalForm.browserSideOnly;
                delete generalForm.playback;
                delete generalForm.chartParameters;   
                delete generalForm.indicators;   
                let combinedTickers = filteredCurrentPageChartDivArray.map(x => x.ticker).flat();
                console.log("combinedTickers=", combinedTickers.slice());

                console.log("this.nearestOpen=", this.nearestOpen);
                if(this.nearestOpen === null){
                    console.log("not currently trading.");
                }

                let invertDatesMultiplier = 1;
                let noLegSwapping = true;
                generalForm.selected = [this.nearestOpen];
                let nearestOpenTicker = spreadTitle(JSON.parse(JSON.stringify(generalForm)), invertDatesMultiplier, noLegSwapping);
                console.log("nearestOpenTicker=", nearestOpenTicker);

                combinedTickers.unshift(nearestOpenTicker);
                console.log("combinedTickers=", combinedTickers.slice());

                let combinedSelected = combinedTickers.map(x => tickerToGeneralForm(x).selected[0]);
               // console.log("combinedSelected=", combinedSelected);
                generalForm.selected = combinedSelected;
          
          if (filteredCurrentPageChartDivArray.length > 0) {
            this.$store.commit('incrementNumberOfAjaxCalls');
            let json = JSON.stringify(generalForm, null, 2);
                    let url = this.$store.state.siteData.baseUrl + this.$store.state.siteData.contextName + "/SeriesControllerServlet";
                    return  $.ajax({
                        url: url,
                        type: "POST",
                        data: {"json": json},
                        success: function (data) { 
                            that.$store.commit('decrementNumberOfAjaxCalls');
                            let temp = JSON.parse(data);
                           // console.log("temp=", JSON.parse(JSON.stringify(temp)));
                            let parsedData = {};
                            let names = new Set();
                            parsedData.values = Object.entries(temp).map(entry => {
                                   // console.log("entry=", entry);
                                    // console.log("entry[1]=", entry[1]);
                                    let obj = entry[1];
                                    obj.date = moment(entry[0], "YYYYMMDD").format("YYYY-MM-DD");
                                    //  console.log("obj=", obj);
                                    let keys = Object.keys(obj);
                                   // console.log("keys=", keys);
                                    keys.forEach(item => names.add(item));

                                    return obj;
                                }).filter(x => x.date !== "Invalid date");
                          
                           // console.log("parsedData=", JSON.parse(JSON.stringify(parsedData)));
                           // console.log("that.tickers=", that.tickers);

                            currentPageChartDivArray.forEach(x => {
                               // console.log(" x=", x);

                                let selected = [tickerToGeneralForm(x.ticker[0]).selected[0], that.nearestOpen];
                               // console.log("selected=", selected);
                                generalForm.selected = selected;
                                let colors = [spreadToColor(selected[0]), "darkgray"];

                                parsedData.names = selected;
                                parsedData.colors = colors;
                                that.createChart(parsedData, generalForm, ["line"], x.ref);                                
                                that.chartLoadedArray.push(x.ref);
                            });
                        },
                        fail: function (data) {
                            console.log("ajax call failed.");
                            $("#progress").hide();
                            $("#button").show();
                            console.log(data);
                        }
                    });                     
                }
            },
            createChart: function (parsedData, generalForm, chartTypes, chartref) {
              //  console.log("createChart() starting. chartref=", chartref, "generalForm.selected[0]=", generalForm.selected[0], " parsedData=", parsedData);
              //  console.log("this.$refs[chartref]=", this.$refs[chartref]);
              //  console.log("this.$refs[chartref][0]=", this.$refs[chartref][0]);
               // console.log("this.$refs[chartref][0].chart.id=", this.$refs[chartref][0].chart.id);
                if (typeof this.$refs[chartref] !== 'undefined') {
                   // this.parsedData = parsedData;
                    let index = chartref.replace("chartref_", "");
                    let chartId = "multiple-series-chart_" + index;
                    this.$refs[chartref][0].createHistoryChart(generalForm, this.namespace + "-chartDiv_" + index, chartId, parsedData);
                }
            },
            removeAllCharts: function () {
               // console.log("removeAllCharts() starting.");
                // let that = this;
               // console.log("this.chartLoadedArray=", JSON.parse(JSON.stringify(this.chartLoadedArray)));
                this.chartLoadedArray.forEach((x, i) => {
                  //  console.log("x=", x, " i=", i);
                  //  console.log("this.$children[" + i + "]=", this.$children[i]);
                    if (typeof this.$children[i] !== 'undefined') {
                        this.$children[i].removeChart();
                    }
                });
                this.chartLoadedArray = [];
               // console.log("this.chartLoadedArray=", JSON.parse(JSON.stringify(this.chartLoadedArray)));
            }
        }
    }

</script>

