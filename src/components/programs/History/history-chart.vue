<template>
    <div style="margin: 0px; width: 100%">
        <div :id="divName"></div>
    </div>
</template>

<script>
    import * as am4core from "@amcharts/amcharts4/core";
    import * as am4charts from "@amcharts/amcharts4/charts";
    import {spreadTitle, spreadUnits} from "@/js/main";
    import {showTradingPeriodIndicator} from "@/js/am4charts-plugins/tradingPeriod";
    
    export default {
        chart: {}, // <-- non-reactive property
        series: [], // <-- non-reactive property
        mounted() {
           // console.log("static-charts-chart.vue mounted() starting. this.data=", this.data);
        },
        props: ["namespace", "divName", "data"],
        computed: {
            inputDivWidth() {
                return this.$store.state[this.namespace].browserSideOnly.inputDivWidth;
            },
            browserSideOnly() {
                return this.$store.state[this.namespace].browserSideOnly;
            },
            chartsPerRow() {
                return this.$store.state[this.namespace].chartParameters.chartsPerRow;
            }
        },
        methods: {
            createTemplateChart(data) {
               // console.log("createTemplateChart() starting. data=", data, " this.divName=", this.divName);
                let that = this;
                return new Promise((resolve) => {
                    let elem = document.getElementById(this.divName);
                    elem.style.height = "320px";
                    console.log("that.browserSideOnly.inputDivWidth=", that.browserSideOnly.inputDivWidth);
                    elem.style.width = (that.browserSideOnly.inputDivWidth/that.chartsPerRow - that.chartsPerRow + 1) + "px";
                    elem.style.position = "fixed";
                    elem.style.top = "1000px";

                    // am4core.useTheme(am4themes_animated);
                    am4core.addLicense("CH208485191");
                    let chart = am4core.create(this.divName, am4charts.XYChart);

                    let title = chart.titles.create();
                    title.text = "test";  // data.names[0];

                    // Axes
                    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
                    dateAxis.id = "date-axis";

                    let mainAxis = chart.yAxes.push(new am4charts.ValueAxis());
                    mainAxis.id = "main-axis";
                    mainAxis.title.fontWeight = "normal";
                    mainAxis.title.fontSize = "11";
                    mainAxis.title.text = spreadUnits(data.names[0]);

                    // Series
                    var series = chart.series.push(new am4charts.LineSeries());
                    let id = "current";
                    series.id = id;
                    series.dataFields.dateX = "date";
                    series.data = data.values;
                    //  console.log("generalForm.selected=", generalForm.selected);
                    //  console.log("names["+i+"]=", names[i]);
                    series.dataFields.valueY = /* generalForm.program === "History" ? generalForm.selected[i] :*/ data.names[0];
                    series.yAxis = mainAxis;

                    let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                    let invertDatesMultiplier = 1;
                    let noLegSwapping = false;
                    generalForm.selected = [data.names[0]];
                    let includeUnitMoves = true;
                    let historyTicker = spreadTitle(JSON.parse(JSON.stringify(generalForm)), invertDatesMultiplier, noLegSwapping, this.symbols, includeUnitMoves);
                    series.name = historyTicker;

                    series.hiddenInLegend = false;
                    series.legendSettings.labelText = "[{color}]{name}[/]";
                    series.legendSettings.itemValueText = "[{color}]{valueY}";
                    series.tooltipText = "[{color}]{name}: [/][{color}]{valueY}";
                    series.tooltip.getFillFromObject = true;

                    series.stroke = "darkgray";
                    series.strokeWidth = 1;
                    series.fill = "darkgray";
                    series.showOnInit = false;
                    series.getFillFromObject = true;

                    chart.legend = new am4charts.Legend();
                    chart.legend.position = "top";
                    chart.legend.markers.template.disabled = false;
                    chart.legend.useDefaultMarker = true;
                    chart.legend.fontSize = 10;
                    chart.legend.fontWeight = "normal";

                    //space out the legend from the chart container
                    chart.legend.marginBottom = 12;

                    //reduce vertical height between each entry if you want them
                    //even closer together
                    chart.legend.itemContainers.template.paddingTop = 0;
                    chart.legend.itemContainers.template.paddingBottom = 0;

                    chart.legend.valueLabels.template.textAlign = "left";

                    // reduce the marker + container size so the text maintains alignment
                    let marker = chart.legend.markers.template;
                    marker.width = 8;
                    marker.height = 8;

                    // set the marker's corner radius to 1
                    chart.legend.markers.template.children
                            .getIndex(0)
                            .cornerRadius(1, 1, 1, 1);

                    chart.zoomOutButton.icon.disabled = true;
                    this.$options.chart = chart;

                    showTradingPeriodIndicator(chart, generalForm);

                    resolve("chart completed");
                });
            }
        }
    };
</script>