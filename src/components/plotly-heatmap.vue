<template>
    <div style="margin-top: 0px">
        <trade-statistics-column-chart v-if="showStatistics"
                                       ref="statistics-chart"
                                       v-bind:namespace="namespace"
                                       style="border-top: 0px solid darkgray;
                                              border-right: 1px solid darkgray;
                                              border-bottom: 0px solid darkgray; margin: 0 0px 6px 0px;"></trade-statistics-column-chart>
        
        <trade-statistics v-if="showStatistics" ref="statistics" v-bind:namespace="namespace" style="width: auto; margin: 0px 0px 0px 0px"></trade-statistics>

        <div style="border-top: 0px solid darkgray; border-right: 1px solid darkgray; margin: 0px 0px 0px 0px;">
            <div v-bind:id="namespace+'-plotlyRibbonChartInstructions'" v-if="showStatistics"
            style="color: #707070; font-size: 12.5px; font-weight: normal; margin: 0 0 -2px 5px">
            To <b>select</b> a trade, click on the chart.
            To <b>zoom</b>, click and drag on the chart. To <b>unzoom</b>, click on the house icon.
        </div>

        <h6 style="color: red; margin: 14px;">{{ error }}</h6>

        <div v-bind:id="namespace + '-plotlyHeatMapDiv'" v-bind:ref="namespace + '-plotlyHeatMapDiv'" style="border-top: 0px solid green; width: 620px; height: 536px; margin-top: -17px;"></div>
        </div>
    </div>
</template>

<script>
    import  Plotly  from 'plotly.js';
    import {transpose} from "@/js/main";
    import $ from "jquery";
    import Moment from 'moment';
    import { extendMoment } from 'moment-range';
    import tradeStatisticsColumnChart from '@/components/trade-statistics-column-chart';
    import tradeStatistics from '@/components/trade-statistics';

    const moment = extendMoment(Moment);

    export default {
        statisticsChartInitialized: false, // <-- non-reactive property

        components: {
            tradeStatisticsColumnChart, tradeStatistics
        },
        mounted() {
            console.log("plotly-heatmap.vue mounted() starting.");
            // Plotly.plot(this.divName, this.data);
        },
        props: ['namespace', 'error', 'showStatistics'],
        data: function () {
            return {
                tableExtrema: null,
            };
        },
        computed: {
            buySell() {
                let buySell = this.$store.state[this.namespace].buySell;
                return buySell !== null ? buySell.toUpperCase() : buySell;
            },
            displayTicker() {
                return this.$store.getters[this.namespace + "/displayTickerWithUnitMoves"];
            }
        },
        methods: {
            removeHeatmap() {
                // console.log("removeHeatmap() starting.");
                
                Plotly.purge(this.namespace + '-plotlyHeatMapDiv');
                
                let element = document.getElementById(this.namespace + '-plotlyHeatMapDiv');
               // console.log("element=", element);
               // console.log("typeof element.removeAllListeners=", typeof element.removeAllListeners);
                
                if(typeof element.removeAllListeners === 'function'){
                    // console.log("removing plotly listeners.");
                    element.removeAllListeners("plotly_click");
                    element.removeAllListeners("plotly_hover");
                }

                this.$options.statisticsChartInitialized = false;
             /*   let stats = {
                avgAppd: 0,
                avgChange: 0,
                avgDays: 0,
                avgMax: 0,
                bestMax: 0,
                close: 0,
                numberOfTrades: 0, 
                open: 0,
                percentDown: 0, 
                percentUp: 0,
                rrr: 0, 
                target: 0,
                avgMin: 0,
                worstMin: 0
                }

                let tableExtrema = {
                    maxBestMax: 0,
                    maxAvgMax: 0,

                    minWorstMin: 0,
                    minAvgMin: 0
                };*/
               // console.log("tableExtrema=", tableExtrema);

             //  this.$refs['statistics-chart'].makeBarChart(stats, tableExtrema);

               // this.$options.tradeStatisticsChartParsedData = {};
                //this.$refs.statistics.setStatistics({});
            },
            runPlotly(vectorMap, parameterToMap) {
                console.log("runPlotly() starting.");
                console.log("vectorMap=", JSON.parse(JSON.stringify(vectorMap)));
                       
                this.removeHeatmap();
               
                let columnExtrema = Object.values(vectorMap).map(column => {
                    let columnValues = Object.values(column);
                    // console.log("columnValues=", JSON.parse(JSON.stringify(columnValues)));
                    return {
                        maxBestMax: Math.max(...columnValues.map(trade => trade.bestMax), 0),
                        maxAvgMax: Math.max(...columnValues.map(trade => trade.avgMax), 0),

                        minWorstMin: Math.min(...columnValues.map(trade => trade.worstMin), 0),
                        minAvgMin: Math.min(...columnValues.map(trade => trade.avgMin), 0)
                    };
                });
                // console.log("columnExtrema=", columnExtrema);

                let tableExtrema = {
                    maxBestMax: Math.max(...columnExtrema.map(x => x.maxBestMax), 0),
                    maxAvgMax: Math.max(...columnExtrema.map(x => x.maxAvgMax), 0),

                    minWorstMin: Math.min(...columnExtrema.map(x => x.minWorstMin), 0),
                    minAvgMin: Math.min(...columnExtrema.map(x => x.minAvgMin), 0)
                };
               // console.log("tableExtrema=", tableExtrema);
                this.tableExtrema = tableExtrema;

                // console.log("vectorMap=", vectorMap);
                let openStartDate = Object.keys(vectorMap)[0];
              //  console.log("openStartDate=", openStartDate);
               // let openEndDate = Object.keys(vectorMap)[Object.keys(vectorMap).length - 1];
              //  console.log("openEndDate=", openEndDate);

                let open =  Object.keys(vectorMap);
                // console.log("open=", open);
                let close = Object.keys(vectorMap[openStartDate]);
                // console.log("close=", close);
                
                let obj = {};
                let nullVector = close.map(function (date) {
                    obj[date] = {"target": ""};
                    // console.log("obj=", obj);
                    return obj;
                })[0];
                //  console.log("nullVector=", nullVector);

                let target = parameterToMap;
               // console.log("target=", target);
                let values = Object.keys(vectorMap).map(function (close) {
                    //  console.log("close=", close);
                    let tradeVector = vectorMap[close];
                    let newTradeObject = {};
                    Object.keys(tradeVector).forEach(function (open) {
                        let value = tradeVector[open][target];
                        // console.log("close=", close, "  value=", value);
                        newTradeObject[open] = value;
                    });
                    //   console.log("newTradeObject=", newTradeObject);

                    let fullTradeVector = {...nullVector, ...newTradeObject};
                    return Object.values(fullTradeVector);
                });
                //console.log("values=", values);
                let text = Object.keys(vectorMap).map(function (close) {
                    //console.log("close=", close);
                    let tradeVector = vectorMap[close];
                    let newTradeObject = {};
                    Object.keys(tradeVector).forEach(function (open) {
                        let value = tradeVector[open];
                        //  value["appd"] = value.avgChange / value.avgDays;
                        //  value["close"] = close;
                        value["target"] = value[target];
                        // console.log("close=", close,"  value=",value);
                        newTradeObject[open] = value;
                    });
                    //   console.log("newTradeObject=", newTradeObject);

                    let fullTradeVector = {...nullVector, ...newTradeObject};
                    return Object.values(fullTradeVector);
                });
                // console.log("text=", text);

                let map = {};
                map.open = open;
                map.close = close;
                map.values = transpose(values);
                // console.log("map.values=", map.values);

                let form = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                let title = this.displayTicker; //spreadTitle(form);
                // console.log("title=", title);
                let parameterOptions=this.$store.state.siteData.parameterOptions;
                let parameterToMapText=parameterOptions.find(x => x.value === parameterToMap).text;
               // console.log("parameterToMapText=", parameterToMapText);

                map.title = {
                    text: this.buySell + " <b>" + title + '</b><span style="color: red">  ' + parameterToMapText.toUpperCase() + " </span>",
                    font: {
                        // family: 'Courier New, monospace',
                        family: 'Tahoma, sans-serif',
                        size: 12
                    }
                };
                // console.log("map=", map);
                // console.log("form=", form);

                if (map.values == "no map") {
                    $("#progress").hide();
                    $("#button").show();
                    let   temp1 = "<div style='white-space: nowrap; color: red; font-size: 11px; padding:5px; font-weight: bold'>Not enough data to make map.</div>";
                    $('#' + this.namespace + '-plotlyHeatMapDiv').html(temp1);
                    $('#' + this.namespace + '-plotlyHeatMapDiv').show();
                    return;
                }

                let textColor = 'black';
                let colorscaleValue = [
                    ['0.0', 'rgb(165,0,38)'],
                    ['0.111111111111', 'rgb(255,0,0)'],
                    ['0.222222222222', 'rgb(245,80,0)'],
                    ['0.333333333333', 'rgb(235,150,0)'],
                    ['0.444444444444', 'rgb(225,185,0)'],
                    ['0.555555555556', 'rgb(215, 235, 0)'],
                    ['0.666666666667', 'rgb(200, 235, 0)'],
                    ['0.777777777778', 'rgb(0, 255, 0)'],
                    ['0.888888888889', 'rgb(0, 204, 0)'],
                    ['1.0', 'rgb(0, 153, 0)']
                ];
                let that = this;
                let data = (function () {
                    let returnObject = [{
                            z: map.values,
                            x: map.open,
                            y: map.close,
                            text: transpose(text),
                            type: 'heatmap',
                            colorscale: colorscaleValue,
                            hoverinfo: 'text'
                        }];
                   // console.log("returnObject=", returnObject);
                    delete returnObject[0].hoverinfo;
                    returnObject[0].hovertemplate = `<span style="font-family: Tahoma, sans-serif; font-size: 10px;"><b>open</b>: %{x}<br><b>close</b>: %{y}` +
                            '<br><b>' + parameterToMapText + '</b>: %{text.target}<extra></extra></span>'; // <extra></extra> removes the "trace0" from the popup. 
                    return returnObject;
                })();
                this.data = data;

                let layout = {
                    font: {
                        family: 'Tahoma, sans-serif',
                        size: 11
                    },
                    xaxis: {
                        type: 'date',
                        title: 'open'
                    },
                    yaxis: {
                        type: 'date',
                        title: 'close'
                    },
                    title: map.title,
                    annotations: [],
                    hoverlabel: {
                        bgcolor: "#FFF",
                        align: "left"
                    },
                   /* margin: {
    l: 0,
    r: 0,
    b: 0,
    t: 0,
    pad: 4
  }*/

                };

                let language = "en";
                let config = {
                    locale: language,
                    displayModeBar: true,
                    showAxisDragHandles: false,
                    modeBarButtonsToRemove: ['sendDataToCloud', 'toggleSpikelines', 'pan2d', 'hoverClosest2d', 'zoom2d', 'zoomIn2d', 'zoomOut2d', 'hoverClosestCartesian', 'hoverCompareCartesian', 'autoScale2d'],
                    showLink: false,
                    responsive: true,
                    displaylogo: false
                };
                let xIndex = map.open.indexOf(form.open);
                let yIndex = map.close.indexOf(form.close);
                 console.log("form.open=", form.open + " form.close=", form.close);
                 console.log("xIndex=", xIndex + " yIndex=", yIndex);
                if (xIndex === -1 || yIndex === -1) {
                    xIndex = 0;
                    form.open = map.open[xIndex];

                    yIndex = map.close.length - 1;
                    form.close = map.close[yIndex];
                }
                /*  console.log("xIndex=", xIndex + " yIndex=", yIndex);
                 console.log("map[xIndex][yIndex]=", values[xIndex][yIndex]);
                 console.log("map.open[xIndex]=", map.open[xIndex]);
                 console.log("map.close[yIndex]=", map.close[yIndex]);
                 console.log("xIndex=", xIndex + " yIndex=", yIndex, "  map[" + xIndex + "][" + yIndex + "]=", values[xIndex][yIndex]);
                 */
                 // console.log("form.open=", form.open);
                 // console.log("form.close=", form.close);

                // console.log("xIndex=", xIndex + " yIndex=", yIndex, "  map[" + xIndex + "][" + yIndex + "]=", values[xIndex][yIndex]);
                while (values[xIndex][yIndex].target == "" && yIndex > 0) {
                    // console.log("xIndex=", xIndex + " yIndex=", yIndex, "  map[" + xIndex + "][" + yIndex + "]=", values[xIndex][yIndex]);
                    //  xIndex++;
                    yIndex--;
                    form.open = map.open[xIndex];
                    form.close = map.close[yIndex];
                }
                this.$store.commit(this.namespace + '/setOpen', form.open);
                this.$store.commit(this.namespace + '/setClose', form.close);

                if (typeof updateOtherCharts !== "undefined") {
                    // updateOtherCharts();
                }

                // console.log("transpose(text)=", transpose(text));
                // console.log("text=", text);
                // console.log("map.values=", map.values);

                let result = {
                    xref: 'x1',
                    yref: 'y1',
                    x: form.open,
                    y: form.close,
                    text: '<b>open</b>: ' + moment(form.open).locale(language).format("MMM D, YYYY") +
                            '<br><b>close</b>: ' + moment(form.close).locale(language).format("MMM D, YYYY") +
                            '<br><b>' + parameterToMapText + '</b>: ' + transpose(text)[yIndex][xIndex][parameterToMap],
                    showarrow: true,
                    font: {
                        color: textColor,
                        size: 10
                    },
                    bgcolor: 'white',
                    bordercolor: 'black',
                    borderwidth: 1,
                    borderpad: 3,
                    align: 'left',
                    opacity: 0.55
                };
                if (typeof form.open !== 'undefined') {
                    layout.annotations.push(result);
                }

                // this.divName = this.namespace + '-plotlyHeatMapDiv';
                Plotly.react(this.namespace + '-plotlyHeatMapDiv', data, layout, config);
                $('#' + this.namespace + '-plotlyHeatMapDiv').show();
                //  $('#temp2').show();
               // $("#chartdivfixed").css("visibility", "visible");


                //  let that = this;
                document.getElementById(this.namespace + '-plotlyHeatMapDiv').on('plotly_click', function (event) {
                    $("#button").hide();
                    $("#progress").show();
                    setTimeout(function () {
                        handleClick(event, that);
                    }, 100);
                });
                 let element = document.getElementById(this.namespace + '-plotlyHeatMapDiv');
               // console.log("element=", element);
               // console.log("typeof element.removeAllListeners=", typeof element.removeAllListeners);
              
                callAuxiliaryComponents(form.open, form.close);
                that.$options.statisticsChartInitialized = true;

                element.on('plotly_hover', function (data) {
                    // console.log("data.points[0]=", data.points[0]);
                    let open = data.points[0].x;
                    let close = data.points[0].y;
                    // console.log("open=", open);
                    // console.log("close=", close);
                    callAuxiliaryComponents(open, close);
                });

                element.on('plotly_unhover', function (/*data*/) {
                   // console.log("plotly_unhover triggered. data=", data);
                    that.$refs.statistics.setStatistics({open: null, close: null});
                    that.$refs['statistics-chart'].updateBarChartData(null);
                });

                function callAuxiliaryComponents(open, close) {
                  // console.log("callAuxiliaryComponents() starting");
                   // console.log("vectorMap=", vectorMap);
                    // eslint-disable-next-line 

                    let openVector = vectorMap[open];
                    //  console.log("openVector=", openVector);
                    let containsClose = Object.keys(openVector).includes(close);
                    // console.log("containsClose=", containsClose);

                    if (containsClose) {
                        let tradeStatistics = JSON.parse(JSON.stringify(vectorMap[open][close]));
                         // console.log("tradeStatistics=", {...tradeStatistics});
                        if (typeof tradeStatistics !== 'undefined') {
                            tradeStatistics.open = open;
                            let test = JSON.stringify(tradeStatistics);
                           // console.log("tradeStatistics=", tradeStatistics);
                            if (typeof test !== 'undefined') {
                               // that.$options.tradeStatisticsChartParsedData = tradeStatistics;
                               that.$refs.statistics.setStatistics(tradeStatistics);
                               if(that.$options.statisticsChartInitialized){
                                that.$refs['statistics-chart'].updateBarChartData(tradeStatistics);
                               } else {
                                   that.$refs['statistics-chart'].makeBarChart(tradeStatistics, that.tableExtrema);
                               }
                            }
                        }
                    } else {
                       // that.$options.tradeStatisticsChartParsedData = {};
                        that.$refs.statistics.setStatistics({open: open, close: close});
                    }
                }

                function handleClick(event, that) {
                    // console.log("handleClick() starting.");
                    let open = moment(event.points[0].x);
                    let close = moment(event.points[0].y);
                    let value = event.points[0].z;
                    // console.log("open=", event.points[0].x + " close=", event.points[0].y + "  value=", value);

                    let point = vectorMap[event.points[0].x][event.points[0].y];
                    // console.log("point=", point);

                    if (null === value) {
                        //  $("#progress").hide();
                        alert('Not enough trades.');
                        $("#button").show();
                        $("#progress").hide();
                        return;
                    } else if(typeof point !== 'undefined') {
                        that.$store.commit(that.namespace + '/setOpen', open.format("YYYY-MM-DD"));
                        that.$store.commit(that.namespace + '/setClose', close.format("YYYY-MM-DD"));

                        let generalForm = Object.assign({}, that.$store.state[that.namespace]);
                        // console.log("map=", map);

                      //  let xIndex = map.open.indexOf(generalForm.open);
                      //  let yIndex = map.close.indexOf(generalForm.close);
                        // console.log("xIndex=", xIndex + " yIndex=", yIndex);

                        let newResult = {
                            xref: 'x1',
                            yref: 'y1',
                            x: generalForm.open,
                            y: generalForm.close,
                            text: '<b>open</b>: ' + open.locale(language).format("MMM D, YYYY") + '<br><b>close</b>: ' + close.locale(language).format("MMM D, YYYY") +
                                    '<br><b>' + parameterToMapText + '</b>: ' + point.target,
                            showarrow: true,
                            font: {
                                color: textColor,
                                size: 10
                            },
                            bgcolor: 'white',
                            bordercolor: 'black',
                            borderwidth: 1,
                            borderpad: 3,
                            align: 'left',
                            opacity: 0.55
                        };
                        let annotations = [];
                        annotations.push(newResult);

                        Plotly.relayout(that.namespace + '-plotlyHeatMapDiv', {
                            annotations: annotations});

                       // $("#chartdivfixed").css("visibility", "visible");
                        //  that.getTrades(generalForm);
                    }
                }

                // console.log("runPlotly() done.");
            }
        }
    }
</script>