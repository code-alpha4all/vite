<template>
    <div :id="'trade-statistics-column-chart-'+namespace">
        <div style="height: 165px; width: 100%" v-bind:id="namespace + '-chartStatsDiv'"></div>
    </div>
</template>

<script>
    import * as am4core from "@amcharts/amcharts4/core";
    import * as am4charts from "@amcharts/amcharts4/charts";

    export default {
        statChart: {}, // <-- non-reactive property
        mounted() {
           // console.log("trade-statistics-column-chart.vue mounted() starting.");
        },
        props: ['namespace'],
        methods: {
            updateBarChartData(temp) {
               // console.log("updateBarChartData() starting.");
               if(temp !== null){
                //console.log("temp=", JSON.parse(JSON.stringify(temp)));
                let statChartData = [];
                delete temp.open;
                delete temp.close;
                delete temp.percentUp;
                delete temp.percentDown;
                delete temp.avgDays;
                delete temp.numberOfTrades;
                delete temp.avgAppd;
                delete temp.target;
                delete temp.rrr;

                delete temp.bestMax;
                delete temp.worstMin;

               // delete temp.statisticsMap;

                let parameterOptions=this.$store.state.siteData.parameterOptions;

                Object.keys(temp).forEach(function (key) {
                  //  console.log(key, temp[key]);
                    statChartData.push({"parameter": parameterOptions.find(x => x.value === key).text,
                        "value": temp[key]});
                });
                let sortedChartData = statChartData.reverse();
                //console.log("sortedChartData=", sortedChartData);

                // console.log("Object.keys(this.$options.statChart=", Object.keys(this.$options.statChart));
                if (this.$options.statChart && Object.keys(this.$options.statChart).length > 0) {
                    this.$options.statChart.data = sortedChartData;
                    this.$options.statChart.validateData();
                    // console.log("New chart data.");
                }
              }else{
                let sortedChartData = [
                    {parameter: 'equity change', value: 0},
                    {parameter: 'avg mpe', value: 0},
                    {parameter: 'avg mae', value: 0}
                ];
                this.$options.statChart.data = sortedChartData;
                this.$options.statChart.validateData();
              }
            },
            makeBarChart(temp, tableExtrema) {
                console.log("makeBarChart() starting. this.namespace=", this.namespace);
                console.log("temp=", temp);
               
                delete temp.open;
                delete temp.close;
                delete temp.percentUp;
                delete temp.percentDown;
                delete temp.avgDays;
                delete temp.numberOfTrades;
                delete temp.avgAppd;
                delete temp.target;
                delete temp.rrr;

                delete temp.bestMax;
                delete temp.worstMin;
                console.log("temp=", temp);
                console.log("tableExtrema=", tableExtrema);

                let statChartData = [];

                delete temp.avgAppd;
               // console.log("temp=", temp);

                let parameterOptions=this.$store.state.siteData.parameterOptions;
                console.log("parameterOptions=", JSON.parse(JSON.stringify(parameterOptions)));

                Object.keys(temp).forEach(function (key) {
                    console.log(key, temp[key]);
                    if(!["numberOfTrades", "percentDown"].includes(key)){
                       console.log("key=", key);
                       statChartData.push({"parameter": parameterOptions.find(x => x.value === key).text, "value": temp[key]});
                    }
                });
                let sortedChartData = statChartData.reverse();
               // console.log("sortedChartData=", sortedChartData);

               // console.log("New barchart.");
                am4core.addLicense("CH208485191");
                this.$options.statChart = am4core.createFromConfig({
                   // id: "stat-chart",
                    data: sortedChartData,
                    yAxes: [{
                            type: "CategoryAxis",
                            renderer: {
                                inversed: true,
                                minGridDistance: 20,
                                minWidth: 120,
                                labels: {
                                    wrap: true,
                                    truncate: true
                                },
                                grid: {
                                    strokeWidth: 4,
                                    disabled: true
                                }
                            },
                            dataFields: {
                                category: "parameter",
                            }
                        }],
                    xAxes: [{
                            id: "statistics-axis",
                            type: "ValueAxis",
                            min: tableExtrema.minAvgMin,
                            max: tableExtrema.maxAvgMax,
                            title: {
                                text: "USD"
                            }
                        }],
                    series: [{
                            type: "ColumnSeries",
                            dataFields: {
                                valueX: "value",
                                categoryY: "parameter"
                            },
                            columns: {
                                tooltipText: "\nProgram: {categoryY}\nUSD: {valueX}",
                                stroke: "#ff0000",
                                fill: "#00ff00"
                            }
                        }]
                }, this.namespace + "-chartStatsDiv", am4charts.XYChart);
               // console.log("this.$options.statChart.series=", this.$options.statChart.series);
                let columnTemplate = this.$options.statChart.series.values[0].columns.template;
                columnTemplate.tooltipText = "{categoryY}: [bold]${valueX}[/]";
                columnTemplate.fillOpacity = .8;
                columnTemplate.strokeOpacity = 0;
                columnTemplate.fill = am4core.color("black");
                columnTemplate.adapter.add("fill", function (fill, target) {
                    if (target.dataItem && (target.dataItem.valueX < 0)) {
                        return am4core.color("red");
                    } else {
                        return fill;
                    }
                });

                let valueAxis = this.$options.statChart.map.getKey("statistics-axis");
                valueAxis.renderer.line.strokeOpacity = 1;
                valueAxis.renderer.line.strokeWidth = 1;
                valueAxis.renderer.line.stroke = am4core.color("#A2B5CD");

                let minRange = valueAxis.axisRanges.create();
                minRange.value = tableExtrema.minAvgMin;
                minRange.grid.stroke = "red";
                minRange.grid.strokeWidth = 2;
                minRange.grid.strokeOpacity = 1;
                minRange.grid.strokeDasharray = "2,2";

                minRange.label.text = "map min avg mae";
                minRange.label.fill = "red";
                minRange.label.inside = true;
                minRange.label.valign = "top";
                minRange.label.rotation = 90;
                minRange.label.verticalCenter = "top";
                minRange.label.horizontalCenter = "left";
                minRange.label.fontSize =10;

                let maxRange = valueAxis.axisRanges.create();
                maxRange.value = tableExtrema.maxAvgMax;
                maxRange.grid.stroke = "black";
                maxRange.grid.strokeWidth = 2;
                maxRange.grid.strokeOpacity = 1;
                maxRange.grid.strokeDasharray = "2,2";

                maxRange.label.text = "map max avg mpe";
                maxRange.label.fill = "black";
                maxRange.label.inside = true;
                maxRange.label.valign = "top";
                maxRange.label.rotation = 90;
                maxRange.label.verticalCenter = "bottom";
                maxRange.label.horizontalCenter = "left";
                maxRange.label.fontSize = 10;

                this.$options.statChart.padding(10, 25, 0, -34);
            }
        }
    }
</script>