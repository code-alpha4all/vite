<template>
    <div id="subapp" style="background-color: white; font-weight: normal">

        <!-- {{ dateArrayJson }} 
    
         <div style="margin-bottom: 40px;">
            <b-button size="sm" @click="loadUnserializedIndicators">loadUnserializedIndicators</b-button> 
         </div>          -->

        <div v-if="error !== null" id="error" style="color: red; margin: 25px 0 28px 24px; font-size: 13px">{{ error }}</div>

        <div v-bind:id="divName"
             v-bind:style="styleObject"
             style="width: 100%; height: 81vh; margin: -17px 0 0 0;"
             ></div>
    </div>
</template>

<style scoped>
    #subapp {
        display: flex;
        justify-content: left;
        align-items: left;
        flex-wrap: wrap;
    }
</style>

<script>
    import * as am5 from "@amcharts/amcharts5";
    import * as am5xy from "@amcharts/amcharts5/xy";
    import * as am5stock from "@amcharts/amcharts5/stock";
    import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

// import $ from "jquery";
    import moment from "moment";

    import {getSpreadExpiration, storeTab, spreadDigits, spreadTitle, spreadUnits/*, waitForElm*/ } from "@/js/main";
    // import { bus } from "@/main";

    import seasonals from "@/mixins/seasonals";
    import seasonalsAdjusted from "@/mixins/seasonalsAdjusted";
    import tradingPeriod from "@/mixins/tradingPeriod";
    import expirationGuide from "@/mixins/expirationGuide";
    import profitLossNew from "@/mixins/profitLossNew";
    import cotNew from "@/mixins/cotNew";
    import _ from "lodash";

    export default {
        components: {
            // playback
        },
        root: {}, // <-- non-reactive property
        preparedData: [], // <-- non-reactive property
        checkingDate: "", // <-- non-reactive property
        expiration: "", // <-- non-reactive property
        parsedData: {}, // <-- non-reactive property

        mixins: [seasonals, seasonalsAdjusted, tradingPeriod, expirationGuide, profitLossNew, cotNew],
        mounted() {
            // console.log("am5charts-basic-chart.vue mounted. this.namespace=", this.namespace);
            // console.log("this.$options=", this.$options);
        },
        beforeDestroy() {
            console.log("beforeDestroy() starting.");

            let cursor = am5.registry.entitiesById["cursor-" + this.namespace];
            console.log("cursor=", cursor);
            if (typeof cursor !== 'undefined') {
                cursor.events.off("cursormoved");
            }

            let seriesSwitcher = am5.registry.entitiesById["seriesSwitcher-" + this.namespace];
            seriesSwitcher.events.off("selected");

            let stockChart = am5.registry.entitiesById["stockChart-" + this.namespace];
            stockChart.events.off("drawingsupdated");
            stockChart.events.off("indicatorsupdated");

            this.$options.root.events.off("frameended");


            //  this.$options.chart.dispose && this.$options.chart.dispose(); 
            if (this.$options.root.dispose) {
                //  console.log("disposing chart.");
                this.$options.root.dispose();
            }
            this.$options.root = null;

            // this.$root.$off("change-period", this.doChangePeriod);
        },
        props: {
            divName: {
                type: String
            },
            namespace: {
                type: String,
                default: "",
            }
        },
        data: function () {
            return {
                error: null,
                areSerializedIndicatorsLoaded: false,
            };
        },
        computed: {
            program() {
                return this.generalForm.program;
            },
            styleObject() {
                return this.program === "TradeMaps" ? {height: "374px"} : {};
            },
            loading() {
                return this.generalForm.loading;
            },
            skipEmptyPeriods() {
                return this.generalForm.chartParameters.skipEmptyPeriods;
            },
            showBullets() {
                return this.generalForm.showBullets;
            },
            locale() {
                return this.$store.state.settings.locale;
            },
            horizontalScrollbar() {
                return this.generalForm.chartParameters.hiddenFeatures.horizontalScrollbar;
            },
            symbols() {
                return this.$store.state.user.symbols;
            },
            zoomToSavedCoordinates() {
                return this.generalForm.zoomToSavedCoordinates;
            },
            dateArrayJson() {
                return this.$options.preparedData.map((bar) => bar.date);
            },
            displayTickerWithUnitMoves() {
                return this.$store.getters[this.namespace + "/displayTickerWithUnitMoves"];
            },
            generalForm() {
                // console.log("generalForm() starting.");
                let generalForm = this.$store.state[this.namespace];
                return {...generalForm};
            }
        },
        watch: {
            displayTickerWithUnitMoves: function (newTicker, oldTicker) {
                console.log("watch displayTickerWithUnitMoves=", newTicker, " oldTicker=", oldTicker, " namespace=", this.namespace);
                this.$options.seasonalDataArray = [];
                this.$options.adjustedSeasonalDataArray = [];
            },
            loading: function (loading) {
                // console.log("loading watch!");
                // console.log("this.divName=", this.divName);
                if (loading) {
                    // document.getElementById(this.divName).innerHTML = "";
                }
            },
            skipEmptyPeriods: function () {
                let dateAxis = am5.registry.entitiesById["dateAxis-" + this.namespace];
                if (typeof dateAxis !== "undefined") {
                    dateAxis.skipEmptyPeriods = this.skipEmptyPeriods;
                }
            },
            showBullets: function (showBullets) {
                console.log("watch showBullets = ", showBullets);

                let stockChart = am5.registry.entitiesById["stockChart-" + this.namespace];
                let currentSeries = stockChart.get("stockSeries");
                console.log("currentSeries=", {...currentSeries});

                showBullets ? this.addBullets(currentSeries) : this.removeBullets();
            },
            locale: function (locale) {
                console.log("watch: locale=", locale);
                //  this.createChart(this.generalForm, this.divName); Wrong parameters.
            },
            horizontalScrollbar: function (horizontalScrollbar) {
                // console.log("watch: horizontalScrollbar=", horizontalScrollbar);
                let scrollbar = am5.registry.entitiesById["scrollbar-" + this.namespace];
                console.log("scrollbar=", scrollbar);

                horizontalScrollbar ? scrollbar.hide() : scrollbar.show();
            },
            error(error) {
                console.log("watch: error=", error);
                /*  let stockChart = am5.registry.entitiesById["stockChart-" + this.namespace];
                 console.log("stockChart=", stockChart);
                 
                 if(error !== null){
                 stockChart.children.unshift(
                 am5.Label.new(this.$options.root, {
                 text: error,
                 fontSize: 11,
                 fontWeight: "500",
                 textAlign: "center",
                 x: am5.percent(48),
                 centerX: am5.percent(50),
                 y: am5.p50,
                 
                 paddingTop: 0,
                 paddingBottom: -23,
                 })
                 );
                 }*/
            }
        },
        methods: {
            removeChart: function () {
                // console.log("removeChart() starting.");
                //  console.log("divName=", this.divName);
                if (document.getElementById(this.divName) !== null) {
                    document.getElementById(this.divName).innerHTML = "";
                    // document.getElementById(this.divName).style.border = '0px solid gray';
                }
                if (this.$options.root.dispose) {
                    console.log("disposing chart.");
                    this.$options.root.dispose && this.$options.root.dispose();
                    this.$options.root = {};
                }
            },
            addData(bar) {
                console.log("addData() starting. bar=", JSON.parse(JSON.stringify(bar)));
                //  console.log("this.$options.chart=", this.$options.chart);
                // console.log("this.$options.chart.series=", this.$options.chart.series);

                let mainSeries = this.$options.chart.series.values.find(
                        (x) => x.id === "main-series"
                );
                console.log("mainSeries.data=", mainSeries.data);
                let lastBar = mainSeries.data[mainSeries.data.length - 1];
                console.log("bar.date=", moment(bar.date).format("YYYYMMDD"), " lastBar.date=", moment(lastBar.date).format("YYYYMMDD"));

                if (moment(bar.date).format("YYYYMMDD") === moment(lastBar.date).format("YYYYMMDD")) {
                    console.log("Replacing last bar.");

                    mainSeries.data[mainSeries.data.length - 1] = bar;

                    this.$options.chart.series.each(function (series) {
                        if (!series.id.includes("-y") && !series.id.includes("scrollbar") && !series.id.includes("profit-loss") && !series.id.includes("horizontal")) {
                            console.log("series.id=", series.id);
                            series.invalidateData();
                        }
                    });
                    // console.log("lastBar=", lastBar);
                    // console.log("mainSeries.data=", mainSeries.data);
                } else {
                    console.log("Adding new bar.");
                    mainSeries.addData(JSON.parse(JSON.stringify(bar)), 0);
                }
            },
            getNewSettings(series) {
                let newSettings = [];
                am5.array.each(
                        [
                            "name",
                            "valueYField",
                            "highValueYField",
                            "lowValueYField",
                            "openValueYField",
                            "calculateAggregates",
                            "valueXField",
                            "xAxis",
                            "yAxis",
                            "legendValueText",
                            "stroke",
                            "fill",
                        ],
                        function (setting) {
                            newSettings[setting] = series.get(setting);
                        }
                );
                return newSettings;
            },
            setSeriesType(seriesType) {
                console.log("setSeriesType() starting. seriesType=", seriesType);
                // let that = this;

                // Get current series and its settings

                // console.log("am5.registry.entitiesById=", {...am5.registry.entitiesById});

                let stockChart = am5.registry.entitiesById["stockChart-" + this.namespace];
                let currentSeries = stockChart.get("stockSeries");
                // console.log("currentSeries=", {...currentSeries});
                let newSettings = this.getNewSettings(currentSeries);

                // Remove previous series
                let data = currentSeries.data.values;
                let mainPanel = am5.registry.entitiesById["mainPanel-" + this.namespace];
                mainPanel.series.removeValue(currentSeries);

                //let key = "valueSeries-" + this.namespace;
                // console.log("key=", key);

                // let valueSeries = am5.registry.entitiesById[key];
                // console.log("valueSeries=", {...valueSeries});

                // Create new series
                let series;
                switch (seriesType) {
                    case "line":
                        series = mainPanel.series.push(am5xy.LineSeries.new(this.$options.root, newSettings));
                        this.showBullets ? this.addBullets(series) : this.removeBullets();
                        break;
                    case "candlestick":
                    case "procandlestick":
                        newSettings.clustered = false;
                        series = mainPanel.series.push(am5xy.CandlestickSeries.new(this.$options.root, newSettings));
                        if (seriesType == "procandlestick") {
                            series.columns.template.get("themeTags").push("pro");
                        }
                        break;
                    case "ohlc":
                        newSettings.clustered = false;
                        series = mainPanel.series.push(am5xy.OHLCSeries.new(this.$options.root, newSettings));
                        break;
                }

                // Set new series as stockSeries
                if (series) {
                    //  console.log("series=", series);
                    //    let valueLegend = am5.registry.entitiesById["valueLegend"];
                    //    valueLegend.data.removeValue(currentSeries);
                    series.data.setAll(data);
                    stockChart.set("stockSeries", series);
                    let cursor = am5.registry.entitiesById["cursor-" + this.namespace];
                    if (cursor) {
                        // console.log("cursor=", cursor);
                        cursor.set("snapToSeries", [series]);
                    }
                    //   valueLegend.data.insertIndex(0, series);

                    //  if (this.generalForm.legs === 1) {
                    this.$store.commit(this.namespace + "/setStockGraphType", seriesType);
                    //  }
                }

                if (this.generalForm.seasonals.length === 0 || this.generalForm.seasonalTypes.length === 0) {
                    series.events.once("datavalidated", function (ev) {
                        console.log("datavalidated event triggered. ev=", ev);
                        // that.initialZoom();
                    });
                }
            },
            /*  switchSeries() {
             // console.log("switchSeries() starting.");
             let seriesSwitcher = am5.registry.entitiesById["seriesSwitcher-" + this.namespace];
             
             let items = seriesSwitcher.get("items");
             
             if (this.generalForm.legs > 1) {
             items = items.filter((x) => x.id === "line");
             seriesSwitcher.set("items", items);
             seriesSwitcher.set("currentItem", "line");
             //  console.log('seriesSwitcher.get("currentItem")=', seriesSwitcher.get("currentItem"));
             this.setSeriesType("line");
             } else {
             // seriesSwitcher.set("currentItem", this.generalForm.stockGraphType);
             // console.log('seriesSwitcher.get("currentItem")=', seriesSwitcher.get("currentItem"));
             this.setSeriesType(this.generalForm.stockGraphType);
             }
             // console.log("items=", items);
             }, */
            createChart(parsedData, seasonalDataPromise) {
                console.log("createChart() starting. seasonalDataPromise=", seasonalDataPromise);
                //console.log("parsedData=", JSON.parse(JSON.stringify(parsedData)));
                this.areSerializedIndicatorsLoaded = false;
                let that = this;

                this.$options.root.dispose && this.$options.root.dispose();

                //  this.$options.chart.dispose && this.$options.chart.dispose(); //Not sure if this works.
                /*   if (this.$options.chart.dispose) {
                 //  console.log("disposing chart.");
                 this.$options.chart.dispose();
                 }*/

                this.loadLegendValues();

                if (parsedData === null || ["none", "Not enough data."].includes(parsedData.values)) {
                    //document.getElementById(this.divName).innerHTML =
                    this.error = "Unable to make a chart from the current selections.";
                    return;
                } else {
                    this.error = null;
                }

                // this.$store.commit(this.namespace + "/browserSideOnly/setMinUnreturnedSeasonal", 40);

                this.$options.parsedData = parsedData;
                if (this.generalForm.instrument !== "stock") {
                    this.$options.parsedData.values = this.truncateData();
                }

                this.$options.preparedData = Object.values(parsedData.values).map((bar) => {
                    bar.date = bar.date.toString();
                    bar.readableDate = bar.date.replace(/-/g, "");
                    bar.dayOfWeek = moment(bar.readableDate, "YYYYMMDD").format("dddd");
                    if (that.generalForm.legs > 1) {
                        // delete bar.open;
                        // delete bar.high;
                        // delete bar.low;
                        delete bar.volume;
                        delete bar.openInterest;
                    }
                    return bar;
                });
                console.log("this.$options.preparedData=", JSON.parse(JSON.stringify(this.$options.preparedData)));

                /*  if (that.generalForm.instrument === "future" && typeof parsedData.seasonal !== "undefined" && parsedData.seasonal !== "Not enough data.") {
                 let seasonalDataArray = Object.keys(parsedData.seasonal.values).map((date) => ({
                 date: moment(date, "YYYYMMDD").format("YYYY-MM-DD"), ...parsedData.seasonal.values[date],
                 })
                 );
                 // console.log("seasonalDataArray=", [...seasonalDataArray]);
                 parsedData.seasonal.values = seasonalDataArray;
                 }*/
                // console.log("parsedData=", JSON.parse(JSON.stringify(parsedData)));

                // console.log("this.$options.root=", this.$options.root);
                if (Object.keys(this.$options.root).length > 0)
                    this.$options.root.dispose();
                if (document.getElementById("chartcontrols-" + this.namespace) !== null) {
                    document.getElementById("chartcontrols-" + this.namespace).innerHTML = "";
                }

                // console.log("am5.registry.entitiesById=", {...am5.registry.entitiesById});

                // Create root element
                // -------------------------------------------------------------------------------
                // https://www.amcharts.com/docs/v5/getting-started/#Root_element

                this.$options.root = am5.Root.new(this.divName);

                /*   const myTheme = am5.Theme.new(this.$options.root);
                 
                 myTheme.rule("Grid", ["scrollbar", "minor"]).setAll({
                 visible: false,
                 });
                 
                 const tooltip = am5.Tooltip.new(this.$options.root, {
                 autoTextColor: false,
                 getFillFromSprite: false,
                 });
                 
                 tooltip.get("background").setAll({
                 fill: am5.color(0xffffff),
                 stroke: am5.color(0x000000),
                 strokeOpacity: 0.3,
                 });
                 
                 tooltip.label.setAll({
                 fill: am5.color(0x000000),
                 fontSize: "0.8em",
                 });
                 
                 myTheme.rule("RoundedRectangle", ["series", "column", "volumeprofile"])
                 .setAll({
                 tooltip: tooltip,
                 tooltipX: am5.p100,
                 tooltipText: "[#2E78E3]down: {down.formatNumber('0.0a')}[/] [#E3B30C]up: {up.formatNumber('0.0a')}[/] total: {total.formatNumber('0.0a')}",
                 });
                 
                 this.$options.root.setThemes([
                 am5themes_Animated.new(this.$options.root),
                 myTheme,
                 ]);*/

                const myTheme = am5.Theme.new(this.$options.root);

                myTheme.rule("Button", ["stocklegend", "control"]).setup = function (target) {
                    target.toBack();
                }

                this.$options.root.setThemes([
                    am5themes_Animated.new(this.$options.root),
                    myTheme
                ]);

                am5.addLicense("AM5C208485191");
                let stockChart = this.$options.root.container.children.push(
                        am5stock.StockChart.new(this.$options.root, {
                            paddingRight: 0,
                            id: "stockChart-" + this.namespace,
                        }));

                let digits = spreadDigits(this.generalForm.selected[0], this.generalForm.instrument) + 1;
                // console.log("digits=", digits);
                let formatString = "#,###." + "0".repeat(digits);
                this.$options.root.numberFormatter.set("numberFormat", formatString);

                let mainPanel = stockChart.panels.push(
                        am5stock.StockPanel.new(this.$options.root, {
                            wheelY: "zoomX",
                            panX: true,
                            panY: true,
                            id: "mainPanel-" + this.namespace,
                        }));

                let valueAxis = mainPanel.yAxes.push(
                        am5xy.ValueAxis.new(this.$options.root, {
                            id: "valueAxis-" + this.namespace,
                            renderer: am5xy.AxisRendererY.new(this.$options.root, {
                                pan: "zoom",
                            }),
                            extraMin: 0.1, // adds some space for for main series
                            tooltip: am5.Tooltip.new(this.$options.root, {}),
                            numberFormat: "#,###.00",
                            extraTooltipPrecision: 2,
                        }));
                valueAxis.children.push(am5.Label.new(this.$options.root, {
                    text: spreadUnits(this.generalForm.selected[0], this.generalForm.instrument, "old"),
                    textAlign: 'center',
                    y: am5.p50,
                    rotation: -90,
                    fontSize: 11,
                    fontWeight: 'normal',
                }));


                let dateAxis = mainPanel.xAxes.push(
                        am5xy.DateAxis.new(this.$options.root, {
                            id: "dateAxis-" + this.namespace,
                            baseInterval: {
                                timeUnit: "day",
                                count: 1,
                            },
                            renderer: am5xy.AxisRendererX.new(this.$options.root, {
                                pan: "zoom",
                                minorGridEnabled: true,
                            }),
                            groupData: true,
                            groupCount: 1500,

                            tooltip: am5.Tooltip.new(this.$options.root, {}),
                            // start: 0.9,
                        }));

                let valueSeries = mainPanel.series.push(
                        am5xy.LineSeries.new(this.$options.root, {
                            name: "valueSeries",

                            clustered: false,
                            valueXField: "date",
                            valueYField: "close",
                            highValueYField: "high",
                            lowValueYField: "low",
                            openValueYField: "open",
                            calculateAggregates: true,
                            xAxis: dateAxis,
                            yAxis: valueAxis,
                            legendValueText: "[bold]o: [normal]{openValueY}[/] [bold]h: [normal]{highValueY}[/] [bold]l: [normal]{lowValueY}[/] [bold]c: [normal]{valueY}[/]",
                            legendRangeValueText: "",
                            id: "valueSeries-" + this.namespace,
                            stroke: "darkblue",
                            fill: "darkblue"
                        }));

                stockChart.set("stockSeries", valueSeries);

                let valueLegend = mainPanel.plotContainer.children.push(
                        am5stock.StockLegend.new(this.$options.root, {
                            stockChart: stockChart,
                            id: "valueLegend-" + this.namespace,
                        }));
                valueLegend.visible = true;

                let volumeAxisRenderer = am5xy.AxisRendererY.new(this.$options.root, {
                    inside: true,
                });

                volumeAxisRenderer.labels.template.set("forceHidden", true);
                volumeAxisRenderer.grid.template.set("forceHidden", true);

                let volumeValueAxis = mainPanel.yAxes.push(
                        am5xy.ValueAxis.new(this.$options.root, {
                            numberFormat: "#.#a",
                            height: am5.percent(20),
                            y: am5.percent(100),
                            centerY: am5.percent(100),
                            renderer: volumeAxisRenderer,
                        }));

                let volumeSeries = mainPanel.series.push(
                        am5xy.ColumnSeries.new(this.$options.root, {
                            name: "volume",
                            clustered: false,
                            valueXField: "date",
                            valueYField: "volume",
                            xAxis: dateAxis,
                            yAxis: volumeValueAxis,
                            legendValueText: "[normal]{valueY.formatNumber('#,###.0a')}[/]",
                            id: "volumeSeries-" + this.namespace,
                        }));

                volumeSeries.columns.template.setAll({
                    strokeOpacity: 0,
                    fillOpacity: 0.5,
                });

                volumeSeries.columns.template.adapters.add("fill", function (fill, target) {
                    let dataItem = target.dataItem;
                    if (dataItem) {
                        // console.log("dataItem=", dataItem);
                        return stockChart.getVolumeColor(dataItem);
                    }
                    return fill;
                });

                stockChart.set("volumeSeries", volumeSeries);

                //  valueLegend.data.setAll([volumeSeries]);
                valueLegend.labels.template.setAll({
                    fontSize: 12,
                    fontWeight: "300"
                });

                let cursor = mainPanel.set(
                        "cursor",
                        am5xy.XYCursor.new(this.$options.root, {
                            yAxis: valueAxis,
                            xAxis: dateAxis,
                            snapToSeries: [valueSeries],
                            snapToSeriesBy: "y!",
                            id: "cursor-" + this.namespace,
                        }));

                cursor.events.on("cursormoved", function (ev) {
                    //  console.log("cursormoved starting.");
                    let x = ev.target.getPrivate("positionX");
                    // let y = ev.target.getPrivate("positionY");
                    // console.log("x=", x, " y=", y);

                    let dateX = dateAxis.positionToDate(dateAxis.toAxisPosition(x));
                    //   let dateXValue = dateAxis.positionToValue(dateAxis.toAxisPosition(x));
                    //  let valueY = valueAxis.positionToValue(dateAxis.toAxisPosition(y));
                    // console.log(dateX, " valueY=", valueY);

                    // let bar = dateAxis.getSeriesItem(valueSeries, x, null, true).dataContext;
                    let tempDate = moment(dateX).format("YYYYMMDD");
                    // console.log("tempDate=", tempDate);
                    // console.log("parsedData.values=", parsedData.values);
                    let bar = that.$options.preparedData.find(bar => bar.readableDate === tempDate);
                    that.loadLegendValues(dateX, bar);
                });

                let sbSeries;
                if (this.program !== 'TradeMaps') {
                    let scrollbar = mainPanel.set("scrollbarX", am5xy.XYChartScrollbar.new(this.$options.root, {
                        orientation: "horizontal",
                        height: 50,
                        id: "scrollbar-" + this.namespace,
                    }));
                    // stockChart.toolsContainer.children.push(scrollbar);
                    mainPanel.bottomAxesContainer.children.push(scrollbar);

                    let sbDateAxis = scrollbar.chart.xAxes.push(
                            am5xy.DateAxis.new(this.$options.root, {
                                baseInterval: {
                                    timeUnit: "day",
                                    count: 1,
                                },
                                renderer: am5xy.AxisRendererX.new(this.$options.root, {}),
                                id: "sbDateAxis-" + this.namespace

                            }));

                    let sbValueAxis = scrollbar.chart.yAxes.push(am5xy.ValueAxis.new(this.$options.root, {
                        renderer: am5xy.AxisRendererY.new(this.$options.root, {}),
                    }));

                    sbSeries = scrollbar.chart.series.push(am5xy.LineSeries.new(this.$options.root, {
                        valueYField: "close",
                        valueXField: "date",
                        xAxis: sbDateAxis,
                        yAxis: sbValueAxis,
                        id: "sbSeries-" + this.namespace

                    }));

                    sbSeries.fills.template.setAll({
                        visible: true,
                        fillOpacity: 0.3,
                    });

                    this.horizontalScrollbar ? scrollbar.hide() : scrollbar.show();
                }

                // zoom to some period
                am5stock.PeriodSelector.new(this.$options.root, {
                    stockChart: stockChart,
                    id: "periodSelector-" + this.namespace,
                    periods: [
                        {timeUnit: "month", count: 1, name: "1M"},
                        {timeUnit: "month", count: 6, name: "6M"},
                        {timeUnit: "ytd", name: "YTD"},
                        {timeUnit: "year", count: 1, name: "1Y"},
                        {timeUnit: "year", count: 2, name: "2Y"},
                        {timeUnit: "max", name: "Max"},
                    ],
                });

                let indicatorControl = am5stock.IndicatorControl.new(this.$options.root, {
                    stockChart: stockChart,
                    id: "indicatorControl-" + this.namespace,
                    legend: valueLegend,
                });
                console.log("indicatorControl=", indicatorControl);

                // console.log("this.generalForm.stockGraphType=", this.generalForm.stockGraphType);
                let seriesSwitcher = am5stock.SeriesTypeControl.new(this.$options.root, {
                    stockChart: stockChart,
                    id: "seriesSwitcher-" + this.namespace,
                    // currentItem: that.generalForm.legs === 1 ? that.generalForm.stockGraphType : "line",
                    currentItem: that.generalForm.stockGraphType,
                });

                seriesSwitcher.events.on("selected", function (ev) {
                    that.setSeriesType(ev.item.id);
                });

                let drawingControl = am5stock.DrawingControl.new(this.$options.root, {
                    stockChart: stockChart,
                    id: "drawingControl-" + this.namespace,
                });

                let drawingDebouncer;
                stockChart.events.on("drawingsupdated", function () {
                    if (drawingDebouncer) {
                        clearTimeout(drawingDebouncer);
                    }
                    drawingDebouncer = setTimeout(function () {
                        // Serialize drawings and store them,
                        // but only if there was 2 seconds of inactivity
                        // ...
                        // console.log("Debounced annotation storage.");
                        let drawings = drawingControl.serializeDrawings("object");
                        // console.log("drawings=", JSON.parse(drawings));
                        that.$store.dispatch(that.namespace + "/chartParameters/storeAnnotationData", drawings);
                    }, 2000);
                });

                let indicatorDebouncer;
                stockChart.events.on("indicatorsupdated", function () {
                    if (indicatorDebouncer) {
                        clearTimeout(indicatorDebouncer);
                    }
                    indicatorDebouncer = setTimeout(function () {
                        // Serialize indicators and store them,
                        // but only if there was 2 seconds of inactivity
                        // console.log("Debounced indicators storage.");
                        // console.log("am5.registry.entitiesById=", am5.registry.entitiesById);
                        // console.log("indicatorControl=", indicatorControl);
                        let indicators = JSON.parse(indicatorControl.serializeIndicators("string", "  "));
                        // console.log("indicators=", indicators);

                        /* let indicatorNameorIdArray = indicators.map((x) => {
                         let id;
                         if (typeof x.__indicator.settings !== "undefined") {
                         id = x.__indicator.settings.id;
                         } else {
                         id = x.__indicator.type;
                         }
                         return id;
                         }); */
                        // console.log("indicatorNameorIdArray=", indicatorNameorIdArray);

                        let filteredIndicators = indicators.filter((x) => {
                            let typeObject = x["__indicator"];
                            // console.log("typeObject=", typeObject);
                            return typeObject.type !== "Indicator" && typeof typeObject.settings !== 'undefined';
                        });
                        // console.log("filteredIndicators=", filteredIndicators);

                        /* let indicatorId = filteredIndicators.map(x => x.__indicator.settings.id);
                         console.log("indicatorId=", indicatorId);
                         
                         let indicatorType = filteredIndicators.map(x => x.__indicator.type);
                         console.log("indicatorType=", indicatorType); */

                        that.$store.commit(that.namespace + "/chartParameters/setIndicatorData", filteredIndicators);
                        storeTab(that.generalForm, that.$store.state.user.email);
                    }, 2000);
                });

                // set data to all series

                // Process data (convert dates and values)
                let processor = am5.DataProcessor.new(this.$options.root, {
                    dateFields: ["date"],
                    dateFormat: "yyyyMMdd",
                    numericFields: ["open", "high", "low", "close", "openInterest", "volume"],
                });
                processor.processMany(this.$options.preparedData);
                //  console.log("this.$options.preparedData=", JSON.parse(JSON.stringify(this.$options.preparedData)));

                /*  am5.array.each(series, function (item) {
                 // console.log("item=", item)
                 item.data.setAll(this.$options.preparedData);
                 }); */

                valueSeries.data.setAll(this.$options.preparedData);
                volumeSeries.data.setAll(this.$options.preparedData);
                // console.log("sbSeries=", sbSeries)
                if (typeof sbSeries !== 'undefined') {
                    sbSeries.data.setAll(this.$options.preparedData);
                }

                // that.switchSeries();
                this.setSeriesType(this.generalForm.stockGraphType);

                // console.log("this.program=", this.program);
                // if (this.program !== "TradeMaps") {
                that.loadChartControls();
                //  }

                // console.log("this.generalForm.instrument=", this.generalForm.instrument)
                if (this.generalForm.instrument === "future") {
                    that.addExpirationGuide();
                }

                if (that.showTradingPeriod) {
                    that.addTradingPeriod();
                }

                if (that.program === 'TradeMaps') {
                    let includeUnitMoves = true;
                    let invertDatesMultiplier = 1;
                    let noLegSwapping = false;
                    let ticker = spreadTitle(this.generalForm, invertDatesMultiplier, noLegSwapping, that.symbols, includeUnitMoves);
                    // console.log("ticker=", ticker);

                    stockChart.children.unshift(
                            am5.Label.new(this.$options.root, {
                                text: ticker,
                                fontSize: 11,
                                fontWeight: "500",
                                textAlign: "center",
                                x: am5.percent(48),
                                centerX: am5.percent(50),
                                paddingTop: 0,
                                paddingBottom: -23,
                            })
                            );
                }

// Create modal for a "no data" note
                /*var modal = am5.Modal.new(this.$options.root, {
                 content: "The chart has no data"
                 });
                 modal.open();*/


                let annotationData = this.generalForm.chartParameters.annotationData;
                // console.log("annotationData=", annotationData);
                if (typeof annotationData !== "undefined" && annotationData !== null) {
                    let drawings = JSON.parse(annotationData);
                    console.log("drawings=", drawings);
                    if (drawings.length > 0) {
                        drawingControl.unserializeDrawings(drawings);
                    }
                }

                // this.loadSerializedIndicators();

                let timeout; //https://www.amcharts.com/docs/v5/getting-started/root-element/#chart-ready-event
                this.$options.root.events.on("frameended", exportChart);

                function exportChart() {
                    // console.log("exportChart() starting.");

                    if (timeout) {
                        clearTimeout(timeout);
                    }

                    timeout = setTimeout(function () {
                        that.$options.root.events.off("frameended", exportChart);
                        console.log("Chart ready!");
                        if (that.generalForm.addProfitLoss) {
                            that.addClickListener();
                        }
                        if (that.generalForm.addCOTPanel && that.program !== 'TradeMaps') {
                            that.addCotIndicator();
                        }
                        if (that.program !== 'StockCharts') {
                            seasonalDataPromise.then(seasonalDataArray => {
                                console.log("seasonalDataArray=", JSON.parse(JSON.stringify(seasonalDataArray)));
                                that.handleSeasonalData(seasonalDataArray, that.generalForm).then(handleSeasonalDataResult => {
                                    console.log("handleSeasonalDataResult=", handleSeasonalDataResult);
                                    that.initialZoom();
                                });
                            });
                        } else {
                            that.initialZoom();
                        }
                        setTimeout(function () {
                            that.loadUnserializedIndicators();
                        }, 1000);
                    }, 100);
                }
            },
            loadSerializedIndicators() {
                console.log("loadSerializedIndicators() starting. this.namespace=", this.namespace);
                // console.trace();
                if (!this.areSerializedIndicatorsLoaded && typeof this.generalForm.chartParameters.indicatorData !== "undefined" && this.generalForm.chartParameters.indicatorData !== null) {
                    console.log("Unserializing indicators. this.namespace=", this.namespace);

                    let indicatorData = this.generalForm.chartParameters.indicatorData;
                    //  console.log("indicatorData=", indicatorData);
                    //  console.log("typeof indicatorData=", typeof indicatorData);
                    if (typeof indicatorData === "string") {
                        indicatorData = JSON.parse(indicatorData);
                    }

                    //  console.log("indicatorData.length=", indicatorData.length);
                    /*  let indicatorDataKeys = indicatorData.map(x => x.__indicator.type)
                     console.log("indicatorDataKeys=", indicatorDataKeys); */

                    //  let indicatorId = indicatorData.map(x => x.__indicator.settings.id);
                    //  console.log("indicatorId=", indicatorId);

                    let indicatorType = indicatorData.map(x => x.__indicator.type);
                    // console.log("indicatorType=", indicatorType);

                    if (indicatorType.includes("VolumeProfile")) {
                        this.$store.commit(this.namespace + "/setAddVolumeProfile", true);
                    }

                    // let registryKeys = Object.keys(am5.registry.entitiesById);
                    // console.log("registryKeys=", registryKeys);

                    if (indicatorData.length > 0 && typeof indicatorData !== 'string' && this.generalForm.program !== 'TradeMaps') {
                        let volumeProfileFilteredIndicators = indicatorData.filter((x) => {
                            let typeObject = x["__indicator"];
                            // console.log("typeObject=", JSON.parse(JSON.stringify(typeObject)));
                            // console.log("typeObject.type=", typeObject.type);
                            return /*(typeObject.type !== "VolumeProfile") && */!typeObject.type.includes("Seasonal");
                        });
                        // console.log("volumeProfileFilteredIndicators=", volumeProfileFilteredIndicators);

                        let indicatorControl = am5.registry.entitiesById["indicatorControl-" + this.namespace];
                        console.log("indicatorControl=", indicatorControl);
                        indicatorControl.unserializeIndicators(JSON.stringify(volumeProfileFilteredIndicators));
                    }
                }
                this.areSerializedIndicatorsLoaded = true;
            },
            loadUnserializedIndicators() {
                console.log("loadUnserializedIndicators() starting. this.namespace=", this.namespace);
                /* console.log("am5.registry.entitiesById=", am5.registry.entitiesById);
                 console.log("Object.keys(am5.registry.entitiesById)=", Object.keys(am5.registry.entitiesById));
                 console.log("Object.values(am5.registry.entitiesById)=", Object.values(am5.registry.entitiesById));*/

                let indicatorControl = am5.registry.entitiesById["indicatorControl-" + this.namespace];
                //  console.log("indicatorControl=", indicatorControl);

                let indicatorControlObject = JSON.parse(indicatorControl.serializeIndicators("string", "  "));
                // console.log("indicatorControlObject=", indicatorControlObject);

                let indicatorType = indicatorControlObject.map(x => x.__indicator.type);
                // console.log("indicatorType=", indicatorType);

                let valueLegend = am5.registry.entitiesById["valueLegend-" + this.namespace];
                // console.log("valueLegend=", valueLegend);  
                let stockChart = am5.registry.entitiesById["stockChart-" + this.namespace];
                let stockSeries = stockChart.get("stockSeries");
                let volumeSeries = am5.registry.entitiesById["volumeSeries-" + this.namespace];
                // console.log("volumeSeries=", volumeSeries);
                // console.log("this.generalForm.addVolumeProfile=", this.generalForm.addVolumeProfile);
                //  console.log("this.program =", this.program);

                let volumeProfileExists = indicatorType.includes("VolumeProfile");
                //  console.log("volumeProfileExists=", volumeProfileExists);
                if (this.generalForm.addVolumeProfile && this.program !== 'TradeMaps' && this.generalForm.legs == 1 && !volumeProfileExists) {
                    this.$store.commit(this.namespace + "/setAddVolumeProfile", false);

                    stockChart.indicators.push(am5stock.VolumeProfile.new(this.$options.root, {
                        stockChart: stockChart,
                        stockSeries: stockSeries,
                        volumeSeries: volumeSeries,
                        count: this.generalForm.volumeProfileColumns,
                        // id: "volumeProfile-" + this.namespace,
                        legend: valueLegend
                    }));
                }

                let rsiExists = indicatorType.includes("RelativeStrengthIndex");
                // console.log("rsiExists=", rsiExists);
                if (this.generalForm.addRSIPanel && this.program !== 'TradeMaps' && !rsiExists) {
                    this.$store.commit(this.namespace + "/setAddRSIPanel", false);
                    stockChart.indicators.push(
                            am5stock.RelativeStrengthIndex.new(this.$options.root, {
                                stockChart: stockChart,
                                stockSeries: stockSeries,
                                period: this.generalForm.rsiPeriod,
                                // id: "rsi-" + this.namespace,
                            }));
                }


                let macdExists = indicatorType.includes("MACD");
                //  console.log("macdExists=", macdExists);
                if (this.generalForm.addMACDPanel && this.program !== 'TradeMaps' && !macdExists) {
                    stockChart.indicators.push(
                            am5stock.MACD.new(this.$options.root, {
                                stockChart: stockChart,
                                stockSeries: stockSeries,
                                // id: "macd-" + this.namespace,
                            }));
                    this.$store.commit(this.namespace + "/setAddMACDPanel", false);
                }

                let cciExists = indicatorType.includes("CommodityChannelIndex");
                // console.log("cciExists=", cciExists);
                if (this.generalForm.addCCIPanel && this.program !== 'TradeMaps' && !cciExists) {
                    stockChart.indicators.push(
                            am5stock.CommodityChannelIndex.new(this.$options.root, {
                                stockChart: stockChart,
                                stockSeries: stockSeries,
                                period: this.generalForm.cciPeriod,
                                //  id: "cci-" + this.namespace,
                            }));
                    this.$store.commit(this.namespace + "/setAddCCIPanel", false);
                }

                let atrExists = indicatorType.includes("AverageTrueRange");
                //  console.log("atrExists=", atrExists);
                if (this.generalForm.addATRPanel && this.program !== 'TradeMaps' && !atrExists) {
                    stockChart.indicators.push(
                            am5stock.AverageTrueRange.new(this.$options.root, {
                                stockChart: stockChart,
                                stockSeries: stockSeries,
                                // id: "atr-" + this.namespace,
                            }));
                    this.$store.commit(this.namespace + "/setAddATRPanel", false);
                }

                let bbExists = indicatorType.includes("BollingerBands");
                // console.log("bbExists=", bbExists);
                if (this.generalForm.addBollinger && this.program !== 'TradeMaps' && !bbExists) {
                    stockChart.indicators.push(
                            am5stock.BollingerBands.new(this.$options.root, {
                                stockChart: stockChart,
                                stockSeries: stockSeries,
                                // id: "bb-" + this.namespace,
                                period: this.generalForm.bollingerPeriod,
                                legend: valueLegend
                            }));
                    this.$store.commit(this.namespace + "/setAddBollinger", false);
                }

                let smaExists = indicatorType.includes("MovingAverage");
                //  console.log("smaExists=", smaExists);
                if (this.generalForm.addSMA && this.program !== 'TradeMaps' && !smaExists) {
                    stockChart.indicators.push(
                            am5stock.MovingAverage.new(this.$options.root, {
                                stockChart: stockChart,
                                stockSeries: stockSeries,
                                // id: "sma-" + this.namespace,
                                period: this.generalForm.smaLength,
                                legend: valueLegend
                            }));
                    this.$store.commit(this.namespace + "/setAddSMA", false);
                }

            },
            addBullets(series) {
                // console.log("addBullets() starting.");
                let that = this;
                // let series = this.$options.chart.map.getKey("main-series");

                series.bullets.push(function () {
                    var bulletCircle = am5.Circle.new(that.$options.root, {
                        radius: 2,
                        fill: series.get("fill"),
                    });
                    return am5.Bullet.new(that.$options.root, {
                        sprite: bulletCircle,
                    });
                });
            },
            removeBullets() {
                let stockChart = am5.registry.entitiesById["stockChart-" + this.namespace];
                let currentSeries = stockChart.get("stockSeries");
                // console.log("currentSeries=", {...currentSeries});

                currentSeries.bulletsContainer.children.clear();
                currentSeries.bullets.clear();
            },
            loadChartControls() {
                let stockChart = am5.registry.entitiesById["stockChart-" + this.namespace];
                // console.log("stockChart=", stockChart);

                if (this.program !== "TradeMaps") {
                    am5stock.StockToolbar.new(this.$options.root, {
                        container: document.getElementById("chartcontrols-" + this.namespace),
                        stockChart: stockChart,
                        controls: [
                            am5.registry.entitiesById["indicatorControl-" + this.namespace],
                            /* am5stock.DateRangeSelector.new(this.$options.root, {
                             stockChart: stockChart
                             }), */
                            am5.registry.entitiesById["periodSelector-" + this.namespace],
                            am5.registry.entitiesById["drawingControl-" + this.namespace],
                            am5stock.ResetControl.new(this.$options.root, {
                                stockChart: stockChart,
                            }),
                            /* am5stock.SettingsControl.new(this.$options.root, {
                             stockChart: stockChart
                             }),*/
                            am5.registry.entitiesById["seriesSwitcher-" + this.namespace],
                        ],
                    });
                } else {
                    am5stock.StockToolbar.new(this.$options.root, {
                        container: document.getElementById("chartcontrols-" + this.namespace),
                        stockChart: stockChart,
                        controls: [
                            am5.registry.entitiesById["periodSelector-" + this.namespace],
                        ],
                    });
                }
            },
            loadLegendValues(dateX, bar) {
                //  console.log("loadLegendValues() starting. bar=", bar);
                let dateElement = document.getElementById("date-" + this.namespace);
                let openElement = document.getElementById("open-" + this.namespace);
                let highElement = document.getElementById("high-" + this.namespace);
                let lowElement = document.getElementById("low-" + this.namespace);
                let closeElement = document.getElementById("close-" + this.namespace);
                let volumeElement = document.getElementById("volume-" + this.namespace);

                // console.log("closeElement=", closeElement);
                if (dateElement !== null && typeof dateElement !== 'undefined') {
                    dateElement.innerHTML = moment(dateX).format("MMM DD, YYYY, dddd");
                    if (typeof bar !== "undefined") {
                        // console.log("bar=",JSON.parse(JSON.stringify(bar)));

                        // console.log('moment(dateX).format("MMM DD, YYYY")', moment(dateX).format("MMM DD, YYYY"));
                        // bar.date = moment(dateX).format("MMM DD, YYYY");

                        //console.log("dateAxis=", dateAxis);

                        if (this.generalForm.legs === 1) {
                            openElement.innerHTML = "<b>o: </b> " + bar.open;
                            highElement.innerHTML = "<b>h: </b> " + bar.high;
                            lowElement.innerHTML = "<b>l: </b> " + bar.low;
                            closeElement.innerHTML = "<b>c: </b> " + bar.close;
                            volumeElement.innerHTML = "<b>vol: </b> " + bar.volume;
                        } else {
                            openElement.innerHTML = "<b>o: </b> " + bar.open;
                            highElement.innerHTML = "<b>h: </b> " + bar.high;
                            lowElement.innerHTML = "<b>l: </b> " + bar.low;
                            closeElement.innerHTML = "<b>c: </b> " + bar.close;
                            volumeElement.innerHTML = "";
                        }
                    } else {
                        // date.innerHTML = "";
                        openElement.innerHTML = "";
                        highElement.innerHTML = "";
                        lowElement.innerHTML = "";
                        closeElement.innerHTML = "";
                        volumeElement.innerHTML = "";
                    }
                }
            },
            truncateData() {
                // console.log("truncateData() starting. this.generalForm.chartParameters=", this.generalForm.chartParameters);

                const {truncate, selected} = this.generalForm;
                //console.log("truncate=", truncate, "  selected=", selected);

                this.expiration = typeof this.$options.parsedData.expiration !== "undefined" ? this.$options.parsedData.expiration : getSpreadExpiration(selected[0]);
                // console.log("this.expiration=", this.expiration);

                let seasonalDataObject = this.$options.parsedData.seasonal;
                // console.log("seasonalDataObject=", {...seasonalDataObject});

                let lastDateOfSeasonal;
                if (typeof seasonalDataObject !== "undefined" && seasonalDataObject !== "Not enough data.") {
                    lastDateOfSeasonal = seasonalDataObject.values[seasonalDataObject.values.length - 1].date;
                } else {
                    lastDateOfSeasonal = this.expiration;
                }

                let end = moment(Math.min(this.expiration, lastDateOfSeasonal.toString().replace(/-/g, "")), "YYYYMMDD").add(1, "days").format("YYYY-MM-DD");
                // console.log("end=", end);
                this.generalForm.chartParameters.end = end;
                this.$store.commit(this.namespace + "/chartParameters/setEnd", end);

                this.$options.checkingDate = moment(this.expiration, "YYYYMMDD").subtract(6, "months");
                // console.log("this.$options.checkingDate=", this.$options.checkingDate.format("MMM D, YYYY"));

                let currentDate = moment();
                // console.log("currentDate=", currentDate);

                let start;
                if (!currentDate.isBefore(this.$options.checkingDate)) {
                    // console.log("currentDate is after this.$options.checkingDate");
                    start = moment(end).subtract(truncate, "year").format("YYYY-MM-DD");
                } else {
                    // console.log("currentDate is NOT after this.$options.checkingDate");
                    start = currentDate.clone().subtract(6 + (truncate - 1) * 12, "months").format("YYYY-MM-DD");
                }
                // console.log("start=", start, " end=", end);
                this.$store.commit(this.namespace + "/chartParameters/setStart", start);
                // this.generalForm.chartParameters.start = start;

                // console.log("this.$options.parsedData=", JSON.parse(JSON.stringify(this.$options.parsedData)));
                let values = Object.values(this.$options.parsedData.values).filter(
                        (x) => !moment(x.date, "YYYYMMDD").isBefore(moment(start))
                // (x) => x.date >= start
                );
                // console.log("values=", values);
                return values;
            },
            initialZoom: _.debounce(function () {
                if (this.program !== "StockCharts") {
                    console.log("initialZoom() starting.");
                    console.log("this.zoomToSavedCoordinates=", this.zoomToSavedCoordinates);

                    let dateAxis = am5.registry.entitiesById["dateAxis-" + this.namespace];

                    let firstChartDate = moment(this.$options.preparedData[0].readableDate).format("YYYY-MM-DD");
                    let lastChartDate = moment(this.$options.preparedData[this.$options.preparedData.length - 1].readableDate).format("YYYY-MM-DD");
                    console.log("firstChartDate=", firstChartDate, ", lastChartDate=", lastChartDate);

                    let minZoomed = this.generalForm.chartParameters.minZoomed;
                    let maxZoomed = this.generalForm.chartParameters.maxZoomed;
                    console.log("minZoomed=", minZoomed + " maxZoomed=", maxZoomed);

                    if (typeof maxZoomed === 'undefined' || [null, "Invalid date", ""].includes(maxZoomed) ||
                            moment(minZoomed).isBefore(moment(firstChartDate)) || moment(minZoomed).isAfter(moment(lastChartDate)) ||
                            moment(maxZoomed).isBefore(moment(firstChartDate)) || moment(maxZoomed).isAfter(moment(lastChartDate))) {
                        console.log("Resetting minZoomed and maxZoomed.");
                        this.$store.commit(this.namespace + "/setZoomToSavedCoordinates", false);
                        this.$store.commit(this.namespace + "/chartParameters/setMinZoomed", firstChartDate);
                        this.$store.commit(this.namespace + "/chartParameters/setMaxZoomed", lastChartDate);
                        minZoomed = firstChartDate;
                        maxZoomed = lastChartDate;
                    }

                    //    if(this.program !== "TradeMaps"){

                    console.log("this.zoomToSavedCoordinates=", this.zoomToSavedCoordinates);
                    if (this.zoomToSavedCoordinates && this.program !== 'TradeMaps' && typeof minZoomed !== 'undefined' && typeof maxZoomed !== 'undefined') {
                        this.$store.commit(this.namespace + "/chartParameters/setStart", minZoomed);
                        this.$store.commit(this.namespace + "/chartParameters/setEnd", maxZoomed);

                        console.log("Zooming to saved coordinates.");
                        //  console.log("start.toDate()=", moment(minZoomed).toDate());
                        //  console.log("end.toDate()=", moment(maxZoomed).toDate());

                        console.log("minZoomed=", minZoomed + " maxZoomed=", maxZoomed);
                        dateAxis.zoomToDates(moment(minZoomed).toDate(), moment(maxZoomed).toDate());

                    } else /*if (this.generalForm.chartParameters.initialZoom)*/ {

                        let {truncate} = this.generalForm;
                        console.log("this.$options.checkingDate=", this.$options.checkingDate);
                        let currentDate = moment();
                        // console.log("currentDate=", currentDate);                    

                        minZoomed = firstChartDate;
                        this.$store.commit(this.namespace + "/chartParameters/setMinZoomed", minZoomed);

                        // console.log("this.expiration=", this.expiration);
                        this.expiration = getSpreadExpiration(this.generalForm.selected[0]);
                        console.log("this.expiration=", this.expiration);
                        maxZoomed = moment(this.expiration, "YYYYMMDD").format("YYYY-MM-DD");
                        this.$store.commit(this.namespace + "/chartParameters/setMaxZoomed", maxZoomed);

                        // this.$store.commit('generalForm/chartParameters/setFirstChartDate', firstChartDate.format('YYYY-MM-DD'));
                        // this.$store.commit('generalForm/chartParameters/setLastChartDate', this.$options.preparedData[this.$options.preparedData.length - 1].readableDate);

                        //  console.log("truncate=", truncate);

                        let start, end;
                        if (!currentDate.isBefore(this.$options.checkingDate)) {
                            console.log("currentDate is after checkingDate");
                            this.expiration = typeof this.$options.parsedData.expiration !== "undefined" ? this.$options.parsedData.expiration : getSpreadExpiration(this.generalForm.selected[0]);

                            console.log("this.expiration=", this.expiration);
                            end = moment(this.expiration, "YYYYMMDD").add(1, "days");
                            console.log("end=", end);

                            start = moment(end).subtract(truncate, "year");
                        } else {
                            console.log("currentDate is NOT after checkingDate");
                            end = currentDate.clone().add(6, "months").add(1, "days");
                            start = currentDate.clone().subtract(6 + (truncate - 1) * 12, "months");
                        }

                        if (start.isBefore(firstChartDate)) {
                            start = moment(firstChartDate);
                        }

                        console.log("start=", start);
                        // console.log("end=", end.format('YYYY-MM-DD'));
                        //   console.log("Zooming....................");

                        this.$store.commit(this.namespace + "/chartParameters/setStart", start.clone().add(6, "months").format("YYYY-MM-DD"));
                        this.$store.commit(this.namespace + "/chartParameters/setEnd", end.format("YYYY-MM-DD"));
                        // this.$store.commit(this.namespace + "/chartParameters/setMaxZoomed", end.format("YYYY-MM-DD"));


                        console.log("Zooming to 'startup' coordinates.");
                        console.log("start.toDate()=", start.toDate());
                        console.log("end.toDate()=", end.toDate());

                        dateAxis.zoomToDates(start.toDate(), end.toDate());

                        //  dateAxis.zoomToDates(start.toDate(), end.clone().add(4, "days").toDate());

                    }


                    let that = this;
                    dateAxis.onPrivate("selectionMin", function (min) {
                        // console.log('dateAxis.onPrivate("selectionMin") starting.');
                        that.onSelectionMinChange(min);
                    });
                    dateAxis.onPrivate("selectionMax", function (max) {
                        // console.log('dateAxis.onPrivate("selectionMax") starting.');
                        that.onSelectionMaxChange(max);
                    });


                    this.loadSerializedIndicators();
                    //  bus.$emit("setChartHeight");
                    //  console.log("initialZoom() done.");
                }
            }, 50),
            onSelectionMinChange: _.debounce(function (min) {
                // console.log("min=", min);
                let minZoomed = moment(min).format("YYYY-MM-DD");
                console.log("minZoomed=", minZoomed);
                this.$store.commit(this.namespace + "/chartParameters/setMinZoomed", minZoomed);
                this.$store.commit(this.namespace + "/setZoomToSavedCoordinates", true);

                storeTab(this.generalForm, this.$store.state.user.email);
            }, 500),
            onSelectionMaxChange: _.debounce(function (max) {
                // console.log("max=", max);
                let maxZoomed = moment(max).format("YYYY-MM-DD");
                console.log("maxZoomed=", maxZoomed);
                this.$store.commit(this.namespace + "/chartParameters/setMaxZoomed", maxZoomed);
                this.$store.commit(this.namespace + "/setZoomToSavedCoordinates", true);

                storeTab(this.generalForm, this.$store.state.user.email);
            }, 500),
        },
    };
</script>
