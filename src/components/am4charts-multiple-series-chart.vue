<template>   
    <div style="border: 1px solid gray; border-radius: 3px;">
    <table style="width: 100%; height: 100%; border: 0px solid gray;">
        <tr style="height: 100%;">
            <td style="border: 0px solid gray; height: 100%">
                <div v-bind:id="divName" style="text-align: center;" class="resize-multiple-line-chart"></div>
            </td>

            <td v-if="show3D && (aligned || program === 'OpenSpreads')" style="vertical-align: top; width: 40%; border-left: 1px solid darkgray;">
        <plotly-ribbon-chart v-bind:namespace="namespace"
                             v-bind:parsedData="plotlyParsedData"></plotly-ribbon-chart> 
        </td>
        </tr>
    </table>
</div>
</template>

<style scoped>
    .resize-multiple-line-chart {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 2px;
        width: 100%;
        height: 100%;
        overflow: hidden;
        resize: both;
    }
</style>

<script>
    import * as am4core from "@amcharts/amcharts4/core";
    import * as am4charts from "@amcharts/amcharts4/charts";
    import am4lang_en_US from "@amcharts/amcharts4/lang/en_US";
    import am4lang_it_IT from "@amcharts/amcharts4/lang/it_IT";
    import am4lang_es_ES from "@amcharts/amcharts4/lang/es_ES";
    import am4lang_de_DE from "@amcharts/amcharts4/lang/de_DE";
// import $ from "jquery";
    import moment from "moment";
    import { spreadTitle, isSpreadOpen, spreadUnits, yearToColor, contractNameDecomposer, storeTab } from "@/js/main";
    import normalization from "@/mixins/normalization";
    import cot from "@/mixins/cotForLongTermCharts";
    import plotlyRibbonChart from '@/components/plotly-ribbon-chart';
    import {showTradingPeriodIndicator, hideTradingPeriod} from "@/js/am4charts-plugins/tradingPeriod";
    //import profitLoss from "@/mixins/profitLoss";

    export default {
        components: {plotlyRibbonChart},
        chart: {}, // <-- non-reactive property
        mixins: [normalization, cot],
        mounted() {
           // console.log("am4charts-multiple-line-chart.vue mounted. this.divName=", this.divName);
            //  console.log("this.$options.chart=", this.$options.chart);  // <-- use non-reactive property
        },
        beforeDestroy() {
            if (typeof this.$options.chart.dispose === "function") {
                console.log("Destroying chart.");
                this.$options.chart.dispose();
            }
        },
        props: {
            divName: {
                type: String,
                default: "chartDiv",
            },
            namespace: {
                type: String,
                default: "",
            },
            parsedData: {
                type: Object,
            },
        },
        data: function () {
            return {
                //  generalForm: {},
              //  chartData: [],
                guides: [],
                endDates: []
            };
        },
        computed: {
            program() {
                return this.$store.state[this.namespace].program;
            },
            show3D() {
                return this.$store.state[this.namespace].show3D;
            },
            aligned() {
                return this.$store.state[this.namespace].aligned;
            },
            start() {
                console.log("computed start() starting.");
                let start = this.$store.state[this.namespace].chartParameters.start;
                console.log("start=", start);
                return typeof start === 'undefined' ? null : start.toString();
            },
            end() {
                let end = this.$store.state[this.namespace].chartParameters.end;
                console.log("end=", end);
                return typeof end === 'undefined' ? null : end.toString();
            },
            open() {
                return this.$store.state[this.namespace].open;
            },
            close() {
                return this.$store.state[this.namespace].close;
            },
            stockGraphType() {
                return this.$store.state[this.namespace].stockGraphType;
            },
            showTradingPeriod() {
                return this.$store.state[this.namespace].showTradingPeriod;
            },
            loading() {
                return this.$store.state[this.namespace].loading;
            },
            skipEmptyPeriods() {
                return this.$store.state[this.namespace].chartParameters.skipEmptyPeriods;
            },
            balloons() {
                return this.$store.state[this.namespace].chartParameters.balloons;
            },
            locale() {
                return this.$store.state.settings.locale;
            },
            horizontalScrollbar() {
                return this.$store.state[this.namespace].chartParameters.hiddenFeatures.horizontalScrollbar ||  
                    ["OpenSpreads"].includes( this.$store.state[this.namespace].program);
            },
            plotlyParsedData() {
                console.log("plotlyParsedData() starting. this.start=", this.start, " this.end=", this.end, " this.parsedData=", JSON.parse(JSON.stringify(this.parsedData)));
                let newParsedData = JSON.parse(JSON.stringify(this.parsedData));
                console.log("this.start=", this.start, "this.end=", this.end);
                if (this.parsedData !== null && typeof this.parsedData.values !== 'undefined' && this.start !== null && this.end !== null) {
                    newParsedData.values = newParsedData.values.filter(x => {
                        let date = x.date.replaceAll("-", "");
                        return date >= this.start.replaceAll("-", "") && date <= this.end.replaceAll("-", "");
                    });
                }
                // console.log("newParsedData=", newParsedData);
                return newParsedData;
            },
            selectedTickers() {
                let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                return this.$store.state[this.namespace].selected.map(x => {
                   // console.log("x=", x);
                    generalForm.selected = [x];
                    let invertDatesMultiplier = 1;
                    let noLegSwapping = false;
                    let includeUnitMoves = true;
                    let ticker = spreadTitle(JSON.parse(JSON.stringify(generalForm)), invertDatesMultiplier, noLegSwapping, this.symbols, includeUnitMoves);
                   // console.log("ticker=", ticker);
                    return ticker;
                });
            },
            longtermChartColors() {
                return this.$store.state[this.namespace].longtermChartColors;
            },
            buySell() {
                return this.$store.state[this.namespace].buySell;
            },
            symbols(){
                return this.$store.state.user.symbols;
            },
            seasonalSelectionMode() {
                return this.$store.state[this.namespace].seasonalSelectionMode;
            }
        },
        watch: {
             symbols(symbols){
                console.log("watch symbols=", symbols);
                let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                if (generalForm.program !== "History"){
                    this.createChart(generalForm, this.divName);
                }
            },
            parsedData: function () {
              //  console.log("watch parsedData = ", JSON.parse(JSON.stringify(parsedData)));
                let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                if(this.program !== "History"){
                    this.createChart(generalForm, this.divName);
                }
            },
            loading: function (loading) {
                // console.log("loading watch!");
                if (loading) {
                    // document.getElementById(this.namespace).innerHTML = "";
                }
            },
            /*   stockGraphType: function () {
             console.log("watching stockGraphType.");
             let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
             console.log("generalForm=", generalForm);
             // if (typeof this.$options.chart.series !== "undefined") {
             this.createChart(generalForm, this.divName);
             // }
             },*/
            skipEmptyPeriods: function () {
                if (typeof this.$options.chart.series !== "undefined") {
                    let dateAxis = this.$options.chart.map.getKey("date-axis");
                    dateAxis.skipEmptyPeriods = this.$store.state[this.namespace].chart.plotParameters.skipEmptyPeriods;
                }
            },
            balloons: function (balloons) {
                if (typeof this.$options.chart.series !== "undefined") {
                    this.$options.chart.series.values.forEach((series) => {
                        // console.log("series-", series.id, " ", series.name);
                        if (typeof series !== "undefined") {
                            series.tooltipText = balloons ? "[{color}]{name}: [/][{color}]{valueY}" : "";
                        }
                    });
                }
            },
            locale: function (locale) {
                console.log("watch: locale=", locale);
                let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                this.createChart(generalForm, this.divName);
            },
            horizontalScrollbar: function (horizontalScrollbar) {
                console.log("watch: horizontalScrollbar=", horizontalScrollbar);
                console.log("this.$options.chart.scrollbarX=", this.$options.chart.scrollbarX);
                if (typeof this.$options.chart.scrollbarX !== 'undefined') {
                    this.$options.chart.scrollbarX.disabled = horizontalScrollbar;
                }
            },
            longtermChartColors() {
                console.log("watching longtermChartColors");
                //this.truncateData();
                let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                this.createChart(generalForm, this.divName);
            },
            open: function () {
               // console.log("watch: open=", open);
                let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
               // console.log("this.$options.chart=", this.$options.chart);
                if (Object.keys(this.$options.chart).length > 0) {
                    let showLabels = true;
                    generalForm.showTradingPeriod ? showTradingPeriodIndicator(this.$options.chart, generalForm, showLabels) : hideTradingPeriod(this.$options.chart);
                }
            },
            close: function () {
               // console.log("watch: close=", close);
                let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                if (Object.keys(this.$options.chart).length > 0) {
                    let showLabels = true;
                    generalForm.showTradingPeriod ? showTradingPeriodIndicator(this.$options.chart, generalForm, showLabels) : hideTradingPeriod(this.$options.chart);
                }
            },
            showTradingPeriod: function (showTradingPeriod) {
                console.log("watch showTradingPeriod = ", showTradingPeriod);
                let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                showTradingPeriod ? showTradingPeriodIndicator(this.$options.chart, generalForm) : hideTradingPeriod(this.$options.chart);
            },
            buySell(){
                console.log("watching buySell");
                let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                showTradingPeriodIndicator(this.$options.chart, generalForm);
            }
        },
        methods: {
            removeChart: function () {
               // console.log("removeChart() starting.");
                // console.trace();
                // console.log("divName=", this.divName);
                if (document.getElementById(this.divName) !== null) {
                    document.getElementById(this.divName).innerHTML = "";
                    document.getElementById(this.divName).style.border = "0px solid gray";
                }
            },
            createChart(generalForm, divName = "chartDiv") {
              //  console.log("createChart() starting. this.parsedData=", JSON.parse(JSON.stringify(this.parsedData)));
                if ( typeof this.parsedData === 'undefined' || !this.parsedData || !this.parsedData.values) {
                   // console.log("parsedData.values = 'undefined' generalForm.selected=", generalForm.selected);
                    if (generalForm.selected.length > 0 ||  generalForm.program === "OpenSpreads") {
                        console.log("showing error");
                        document.getElementById(this.divName).innerHTML =
                                "<p style='color: red; font-size: 12px; font-weight: normal; height: 100%; margin-top: 100px'>Unable to make a chart from the current selections.</p>";
                    } else {
                        document.getElementById(this.divName).innerHTML = "";
                    }
                    return;
                }else{
                if (generalForm.program === "LongTermCharts" && ["ohlc", "candlestick", "procandlestick"].includes(generalForm.stockGraphType)/* && generalForm.legs === 1*/) {
                    this.createMultipleOhlcChart(generalForm, divName);
                } else {
                    this.createMultipleLineChart(generalForm, divName);
            }
            }
            },
            createHistoryChart(generalForm, divName, chartId, parsedData){
               // console.log("createHistoryChart() starting. parsedData=", JSON.parse(JSON.stringify(parsedData)));
                this.createMultipleLineChart(generalForm, divName, chartId, JSON.parse(JSON.stringify(parsedData)));
            },
            createMultipleOhlcChart(generalForm, divName = "chartDiv", chartId = "multiple-line-chart") {
               // console.log("createMultipleOhlcChart() starting. this.parsedData=", this.parsedData);
                //  this.$options.chart.dispose && this.$options.chart.dispose(); //Not sure if this works.
                if (this.$options.chart.dispose) {
                    // console.log("disposing chart.");
                    this.$options.chart.dispose();
                }

                let parsedData = this.parsedData;
                let names = Object.keys(parsedData.values);

                console.log("names=", names);

                am4core.addLicense("CH208485191");
                let chart = am4core.create(divName, am4charts.XYChart);
                chart.id = chartId;
                chart.padding(0, 10, 10, 10);
                chart.dateFormatter.dateFormat = "MMM dd, yyyy";
                chart.responsive.enabled = true;
                chart.leftAxesContainer.layout = "vertical";

                let title = chart.titles.create();
                title.text = this.selectedTickers[0] + "...";
                title.fontSize = 11;
                title.fontWeight = "bold";
                title.marginTop = 4;
                title.marginBottom = 4;
                
                let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
                dateAxis.id = "date-axis";
                dateAxis.renderer.grid.template.location = 0;
                dateAxis.renderer.ticks.template.length = 8;
                dateAxis.renderer.ticks.template.strokeOpacity = 0.1;
                dateAxis.renderer.grid.template.disabled = false;
                dateAxis.renderer.ticks.template.disabled = true;
                dateAxis.renderer.ticks.template.strokeOpacity = 0.2;
                dateAxis.renderer.minLabelPosition = 0.01;
                dateAxis.renderer.maxLabelPosition = 0.99;
                dateAxis.keepSelection = true;
                dateAxis.minHeight = 30;
                dateAxis.dateFormats.setKey("day", "MMM dd, yyyy");
                dateAxis.tooltipDateFormat = ("day", "EEEE, MMM dd, yyyy");
                dateAxis.groupData = true;
                dateAxis.groupCount = 420;
                dateAxis.groupIntervals.setAll([
                    {timeUnit: "day", count: 1},
                    {timeUnit: "week", count: 1},
                    {timeUnit: "month", count: 1}
                ]);

               // console.log("guides=", parsedData.guides);
                for (let i = 0; i < parsedData.guides.length; i++) {
                    let  range = dateAxis.axisRanges.create();
                    range.date = parsedData.guides[i].date;
                    range.endDate = parsedData.guides[i].toDate;
                    range.grid.strokeWidth = 0;
                    range.axisFill.fill = "gray";
                    range.axisFill.fillOpacity = 0.1;
                }

                let mainAxis = chart.yAxes.push(new am4charts.ValueAxis());
                mainAxis.id = "main-axis";
                mainAxis.tooltip.disabled = false;
                mainAxis.renderer.baseGrid.disabled = true;
                mainAxis.renderer.inside = true;
                mainAxis.renderer.labels.template.verticalCenter = "bottom";
                mainAxis.renderer.labels.template.padding(2, 2, 2, 2);
                mainAxis.renderer.fontSize = "0.8em"

                let chartData;

                let tickerArray = names.map(x => {
                    let form = JSON.parse(JSON.stringify(generalForm));
                    form.selected = [x];
                    let invertDatesMultiplier = 1;
                    let noLegSwapping = false;
                    let includeUnitMoves = true;
                    let ticker = x.includes("seasonal") ? x : spreadTitle(JSON.parse(JSON.stringify(form)), invertDatesMultiplier, noLegSwapping, this.symbols, includeUnitMoves);
                    //  console.log("ticker=", ticker);
                    return ticker;
                });
               // console.log("tickerArray=", tickerArray);

                for (let i = 0; i < names.length; i++) {
                    let tempData = Object.values(Object.values(parsedData.values)[i]);
                    // console.log("endDates[" + i + "]=", endDates[i]);
                    tempData.forEach(x => {
                        x.date = moment(x.date, 'YYYYMMDD').format("YYYY-MM-DD");
                        //  x.open = x.close;
                        //  x.high = x.close;
                        //  x.low = x.close;
                        return x;
                    });
                    // console.log("tempData=", tempData);

                    if (i < this.endDates.length - 1) {
                        let testDate = this.endDates[i + 1];
                        // console.log("testDate=", testDate);
                        chartData = tempData.filter(x => parseInt(x.date.replace(/-/g, "")) >= testDate);
                    } else {
                        chartData = tempData;
                    }
                    // console.log("chartData=", chartData);

                    let stockGraphType = generalForm.stockGraphType;
                   // console.log("stockGraphType=", stockGraphType);
                    let series = stockGraphType === "candlestick" ? chart.series.push(new am4charts.CandlestickSeries()) : chart.series.push(new am4charts.OHLCSeries());
                    series.id = "series-" + i;
                    series.dataFields.dateX = "date";
                    series.name = tickerArray[i];
                    series.clustered = false;
                    series.data = chartData;
                    series.dataFields.dateX = "date";
                    series.dataFields.openValueY = "open";
                    series.dataFields.valueY = "close";
                    series.dataFields.lowValueY = "low";
                    series.dataFields.highValueY = "high";
                    series.tooltipText = tickerArray[i] + "\nopen: {openValueY.value}\nlow: {lowValueY.value}\nhigh: {highValueY.value}\nclose: {valueY.value}";

                   // series.name = parsedData.title;
                    series.yAxis = mainAxis;
                    //  series.name = names[i];
                    series.hiddenInLegend = false;
                    series.legendSettings.labelText = "[{color}]{name}:[/]";
                    series.legendSettings.itemValueText = "[{color}]{valueY}";

                    if (generalForm.longtermChartColors === "yearly") {
                        let contract = names[i].split('/')[0];
                       // console.log("contract=", contract);

                        let cND = contractNameDecomposer(contract);
                       // console.log("cND=", cND);
                       
                        let color = yearToColor(cND.year);
                        series.riseFromOpenState.properties.fill = color;
                        series.riseFromOpenState.properties.stroke = color;
                        series.dropFromOpenState.properties.fill = color;
                        series.dropFromOpenState.properties.stroke = color;
                    } else {
                        series.riseFromOpenState.properties.fill = "teal";
                        series.riseFromOpenState.properties.stroke = "teal";
                        series.dropFromOpenState.properties.fill = "firebrick";
                        series.dropFromOpenState.properties.stroke = "firebrick";
                    }

                    // series.showOnInit = false;
                }

                chart.exporting.menu = new am4core.ExportMenu();
                chart.exporting.menu.align = "left";
                chart.exporting.menu.verticalAlign = "top";

                chart.exporting.menu.items = [{
                        "label": "...",
                        "menu": [
                            {
                                "label": "Image",
                                "menu": [
                                    {"type": "png", "label": "PNG"},
                                    {"type": "jpg", "label": "JPG"},
                                    {"type": "svg", "label": "SVG"},
                                    {"type": "pdf", "label": "PDF"}
                                ]
                            }, {
                                "label": "Print", "type": "print"
                            }
                        ]
                    }];

                //  let annotation = chart.plugins.push(new am4plugins_annotation.Annotation());

                chart.cursor = new am4charts.XYCursor();

               /* let scrollbarX = new am4charts.XYChartScrollbar();
                let sbSeries = chart.series.push(new am4charts.LineSeries());
                sbSeries.id = "scrollbar-series";
                sbSeries.data = chartData;
                sbSeries.dataFields.valueY = "close";
                sbSeries.dataFields.dateX = "date";
                sbSeries.hiddenInLegend = true;
                scrollbarX.series.push(sbSeries);
                sbSeries.disabled = true;
                scrollbarX.marginBottom = 0;
                chart.scrollbarX = scrollbarX;
                chart.scrollbarX.parent = chart.bottomAxesContainer;
                chart.scrollbarX.disabled = false; */

                this.$options.chart = chart;

                let that = this;
                chart.events.on("ready", function () {
                    console.log("chart ready. chart=", chart);
                   // that.profitLoss();

                    let generalForm = that.$store.state[that.namespace];
                    console.log("generalForm=", generalForm);

                    if (generalForm.normalization) {
                        that.addNormalization(chart);
                    }
                    
                    if (generalForm.addCOTPanel && that.program !== 'TradeMaps') {
                        console.log("Adding cot panel.");
                        that.addCotPanel();
                    }

                    dateAxis.events.on("selectionextremeschanged", function () {
                        console.log("selectionextremeschanged that.namespace=", that.namespace);
                        let start = moment(dateAxis.minZoomed).format("YYYYMMDD");
                        //console.log("start=", start);
                        let end = moment(dateAxis.maxZoomed).format("YYYYMMDD");
                        that.$store.commit(that.namespace + "/chartParameters/setStart", start);
                        that.$store.commit(that.namespace + "/chartParameters/setEnd", end);
                    });
                });

             /*  chart.cursor.events.on("zoomstarted", function (event) {
                    console.log("Zoom starting.");
                    // mytimestamp = new Date().getTime();
                }); */
                //let inputFieldFormat = "yyyy-MM-dd";
            },
            createMultipleLineChart(generalForm, divName = "chartDiv", chartId = "multiple-line-chart", parsedData) {
                console.log("createMultipleLineChart() starting. divName=", divName, " chartId=", chartId, " parsedData=", parsedData);
                //  this.$options.chart.dispose && this.$options.chart.dispose(); //Not sure if this works.
                if (this.$options.chart.dispose) {
                    // console.log("disposing chart.");
                    this.$options.chart.dispose();
                }

                if(typeof parsedData === 'undefined'){
                    parsedData = this.parsedData;
                }
                // console.log("parsedData=", JSON.parse(JSON.stringify(parsedData)));

                let names = parsedData.names;
                let colors = parsedData.colors;
                // console.log("names=", names);
               // console.log("colors=", colors);

                this.generalForm = generalForm;
                am4core.addLicense("CH208485191");
                let chart = am4core.create(divName, am4charts.XYChart);
                chart.id = chartId;
                // console.log("chartId=", chartId);

                // console.log("this.$store.state.settings.locale=", this.$store.state.settings.locale);
                let localeFile;
                switch (this.$store.state.settings.locale) {
                    case "de-DE":
                        localeFile = am4lang_de_DE;
                        break;
                    case "en-US":
                        localeFile = am4lang_en_US;
                        break;
                    case "es-ES":
                        localeFile = am4lang_es_ES;
                        break;
                    case "it-IT":
                        localeFile = am4lang_it_IT;
                        break;
                }
                chart.language.locale = localeFile;

                chart.padding(0, 10, 10, 10);
                chart.dateFormatter.dateFormat = "MMM dd, yyyy";
                chart.responsive.enabled = this.program !== "History";
               // console.log("chart.responsive.enabled=", chart.responsive.enabled);

                let title = chart.titles.create();
              //  console.log("this.selectedTickers=", this.selectedTickers);
               // console.log("generalForm.selected=", generalForm.selected);
               
                let historyTicker;
                if(generalForm.program === "History"){
                    let invertDatesMultiplier = 1;
                    let noLegSwapping = false;
                  //  generalForm.selected = [names[0]];
                    let includeUnitMoves = true;
                    historyTicker = spreadTitle(JSON.parse(JSON.stringify(generalForm)), invertDatesMultiplier, noLegSwapping, this.symbols, includeUnitMoves);
                  //  console.log("historyTicker=", historyTicker);
                }
               
                title.text = generalForm.program === "History" ? historyTicker : this.selectedTickers[0] + "...";
                title.fontSize = generalForm.program === "History" ? 11 : 11;
                title.fontWeight = generalForm.program === "History" ? "bold" : "bold"; // Can't set fontWeight when color is specified.
                title.marginTop = 4;
                title.marginBottom = 4;
               // title.stroke = generalForm.program === "History" ? colors[0] : null;
                // the following line makes value axes to be arranged vertically.
                chart.leftAxesContainer.layout = "vertical";

                let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
                dateAxis.id = "date-axis";
                dateAxis.renderer.grid.template.location = 0;
                dateAxis.renderer.ticks.template.length = 8;
                dateAxis.renderer.grid.template.disabled = false;
                dateAxis.renderer.ticks.template.disabled = true;
                dateAxis.renderer.ticks.template.strokeOpacity = 0.2;
                dateAxis.renderer.labels.template.fontWeight = "normal";
                dateAxis.renderer.minLabelPosition = 0.01;
                dateAxis.renderer.maxLabelPosition = 0.99;
                dateAxis.keepSelection = false;
                dateAxis.minHeight = 30;
                dateAxis.dateFormats.setKey("day", "MMM dd, yyyy");
                dateAxis.tooltipDateFormat = ("day", "EEEE, MMM dd, yyyy");
                dateAxis.groupData = true;
                dateAxis.groupCount = 2700;
                dateAxis.groupIntervals.setAll([
                    {timeUnit: "day", count: 1},
                    {timeUnit: "week", count: 1},
                    {timeUnit: "month", count: 1}
                ]);
               // dateAxis.minZoomCount = 3;

                let mainAxis = chart.yAxes.push(new am4charts.ValueAxis());
                mainAxis.id = "main-axis";
                mainAxis.tooltip.disabled = false;
                mainAxis.renderer.baseGrid.disabled = false;
                mainAxis.height = am4core.percent(100);

                // mainAxis.renderer.gridContainer.background.fill = am4core.color("#000000");
                // mainAxis.renderer.gridContainer.background.fillOpacity = 0.05;
                mainAxis.renderer.inside = true;
                mainAxis.renderer.labels.template.verticalCenter = "bottom";
                mainAxis.renderer.labels.template.padding(2, 2, 2, 2);
                //mainAxis.renderer.maxLabelPosition = 0.95;
                mainAxis.renderer.fontSize = 10;
                mainAxis.renderer.baseGrid.strokeOpacity = 0.4;
                mainAxis.title.fontWeight = "bold";
                mainAxis.title.fontSize = "11";
                mainAxis.renderer.labels.template.fontWeight = "normal";
                //let t = generalForm.selected.filter(x => x !== 'seasonal')[0];
              //  console.log("t=", generalForm.selected);
              //  console.log("t=", generalForm.selected.filter(x => x !== 'seasonal'));
                mainAxis.title.text = spreadUnits(generalForm.selected.filter(x => x !== 'seasonal')[0]);

                /*  let chartData = parsedData.values.map(x => {
                 x.date = moment(x.date, "YYYYMMDD").format("YYYY-MM-DD");
                 return x;
                 }).filter(x => x.date !== "Invalid date");
                 console.log("chartData=", JSON.parse(JSON.stringify(chartData))); */
                let chartData = parsedData.values;

                let tickerArray = names.map(x => {
                    let form = JSON.parse(JSON.stringify(generalForm));
                    form.selected = [x];
                    let invertDatesMultiplier = 1;
                    let noLegSwapping = false;
                    let includeUnitMoves = true;
                    let ticker = x.includes("seasonal") ? x : spreadTitle(JSON.parse(JSON.stringify(form)), invertDatesMultiplier, noLegSwapping, this.symbols, includeUnitMoves);
                    //  console.log("ticker=", ticker);
                    return ticker;
                });
               // console.log("tickerArray=", tickerArray);

                for (let i = 0; i < names.length; i++) {
                    let series = chart.series.push(new am4charts.LineSeries());
                    series.id = "series-" + i;
                    series.dataFields.dateX = "date";
                    series.clustered = false;
                    series.data = chartData;
                  //  console.log("generalForm.selected=", generalForm.selected);
                  //  console.log("names["+i+"]=", names[i]);
                    series.dataFields.valueY =/* generalForm.program === "History" ? generalForm.selected[i] :*/ names[i];
                    series.yAxis = mainAxis;
                    series.name = tickerArray[i];

                    series.hiddenInLegend = false;
                    series.legendSettings.labelText = "[{color}]{name}:[/]";
                    series.legendSettings.itemValueText = "[{color}]{valueY}";
                    series.tooltipText = this.$store.state[this.namespace].chartParameters.balloons ? "[{color}]{name}: [/][{color}]{valueY}" : "";
                    series.tooltip.getFillFromObject = true;

                    series.stroke = colors[i];
                    series.strokeWidth = (isSpreadOpen(names[i]) || names[i] === "seasonal") && !["OpenSpreads", "History"].includes(generalForm.program) && generalForm.aligned === true ? 2 : 1;
                    series.fill = colors[i];
                    series.showOnInit = false;
                    series.getFillFromObject = true;
                }

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

                chart.exporting.menu = new am4core.ExportMenu();
                chart.exporting.menu.align = "right";
                chart.exporting.menu.verticalAlign = "top";

                chart.exporting.menu.items = [
                    {
                        label: "...",
                        menu: [
                            {
                                label: "Image",
                                menu: [
                                    {type: "png", label: "PNG"},
                                    {type: "jpg", label: "JPG"},
                                    {type: "svg", label: "SVG"},
                                    {type: "pdf", label: "PDF"},
                                ],
                            },
                            {
                                label: "Print",
                                type: "print",
                            },
                        ],
                    },
                ];

                chart.cursor = new am4charts.XYCursor();
                // Date format to be used in input fields
                // let inputFieldFormat = "yyyy-MM-dd";

                /*   let endDate = moment(chartData[chartData.length - 1].date);
                 let startDate = endDate.clone().subtract(1, 'years');
                 console.log("startDate=", startDate, " endDate=", endDate);  */

             /*   let scrollbarX = new am4charts.XYChartScrollbar();
                let sbSeries = chart.series.push(new am4charts.LineSeries());
                sbSeries.id = "scrollbar-series";
                sbSeries.data = chartData;
                sbSeries.dataFields.valueY = "seasonal";
                sbSeries.dataFields.dateX = "date";
                sbSeries.hiddenInLegend = true;
                scrollbarX.series.push(sbSeries);
                sbSeries.disabled = true;
                scrollbarX.marginBottom = 0;
                chart.scrollbarX = scrollbarX;
                chart.scrollbarX.parent = chart.bottomAxesContainer;
                chart.scrollbarX.disabled = false;  //this.horizontalScrollbar; */

                this.$options.chart = chart;

                let inputDiv = document.querySelector('#' + this.namespace + 'InputDiv');
                //console.log("inputDiv=", inputDiv);
                let inputHeight = inputDiv !== null ? inputDiv.offsetHeight : 0;
               // console.log("inputHeight=", inputHeight);
                this.$store.commit(this.namespace + '/browserSideOnly/setInputDivHeight', inputHeight);

               // console.log("this.$parent.$parent.$parent.$parent=", this.$parent.$parent.$parent.$parent);
                if(generalForm.program === "History"){
                    this.$parent.$parent.$parent.$parent.$parent.setChartHeight();
                }else{
                    this.$parent.$parent.$parent.$parent.setChartHeight();
                }

                parsedData.eye = this.$store.state[this.namespace].chartParameters.eye;
                //  runPlotly(parsedData);

                let that = this;
                chart.events.on("ready", function () {
                   // console.log("chart ready.");
                   // that.profitLoss();

                    if (that.$store.state[that.namespace].normalization) {
                        that.addNormalization(chart);
                    }

                    if (typeof callRunPlotly !== "undefined") {
                        parsedData.eye = that.$store.state[this.namespace].chartParameters.eye;
                        //runPlotly(parsedData);
                    }

                    if (generalForm.addCOTPanel && that.program !== 'TradeMaps') {
                        console.log("Adding cot panel.");
                        that.addCotPanel();
                      //  that.setCotTooltips();
                    }
              
                    dateAxis.events.on("selectionextremeschanged", function () {
                        console.log("selectionextremeschanged that.namespace=", that.namespace);
                        let start = moment(dateAxis.minZoomed).format("YYYYMMDD");
                        //console.log("start=", start);
                        let end = moment(dateAxis.maxZoomed).format("YYYYMMDD");
                        that.$store.commit(that.namespace + "/chartParameters/setStart", start);
                        that.$store.commit(that.namespace + "/chartParameters/setEnd", end);
                        let generalForm = JSON.parse(JSON.stringify(that.$store.state[that.namespace]));
                        storeTab(generalForm, that.$store.state.user.email);
                    });
                });

                showTradingPeriodIndicator(chart, generalForm);
            }
        }
    };
</script>
