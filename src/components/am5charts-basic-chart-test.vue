<template>
    <div id="subapp" style="background-color: white; font-weight: normal">

        <div id="chartcontrols"></div>

        <div
            v-bind:id="divName"
            v-bind:style="styleObject"
            style=" width: 100%; height: 72vh;"
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

  //  var seriesSwitcher;
 //   var valueSeries;
 //   var valueLegend;
 //   var indicatorControl;
    var root;

    import * as am5 from "@amcharts/amcharts5";
    import * as am5xy from "@amcharts/amcharts5/xy";
    import * as am5stock from "@amcharts/amcharts5/stock";
    import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

    import $ from "jquery";
    import moment from "moment";

  //  import {spreadDigits, waitForElm} from "@/js/main";
  //  import _ from 'lodash';

    export default {
        root: {}, // <-- non-reactive property
        created: function () {
            // console.log("this.$data=", this.$data);
        },
        mounted() {
            //  console.log("am4charts-basic-chart.vue mounted.");
            this.$root.$on("change-period", this.doChangePeriod);
        },
        beforeDestroy() {
            console.log("beforeDestroy() starting. this.$options=", this.$options);
            //  this.$options.chart.dispose && this.$options.chart.dispose(); //Not sure if this works.
            if (/*this.$options.*/root.dispose) {
                //  console.log("disposing chart.");
                /*this.$options.*/root.dispose();
            }
            this.$root.$off("change-period", this.doChangePeriod);
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
                checkingDate: "",
                expiration: "",
                //  chart: {},
            };
        },
        computed: {
            styleObject() {
                return this.$store.state[this.namespace].program === "TradeMaps"
                        ? {height: "374px"}
                : {};
            },
            stockGraphType() {
                return this.$store.state[this.namespace].stockGraphType;
            },
            indicators() {
                console.log("testing here.");
                return  this.$store.state[this.namespace].indicators.indicators;
            },
            selectedIndicators() {
                return this.$store.getters[this.namespace + "/indicators/selectedIndicators"].map(x => x.shortName);
            },
            addBollinger() {
                return this.$store.state[this.namespace].addBollinger;
            },
            bollingerPeriod() {
                return this.$store.state[this.namespace].bollingerPeriod;
            },
            addVolumeProfile() {
                return this.$store.state[this.namespace].addVolumeProfile;
            },
            volumeProfileColumns() {
                return this.$store.state[this.namespace].volumeProfileColumns;
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
            showBullets() {
                return this.$store.state[this.namespace].showBullets;
            },
            showTradingPeriod() {
                return this.$store.state[this.namespace].showTradingPeriod;
            },
            open() {
                return this.$store.state[this.namespace].open;
            },
            close() {
                return this.$store.state[this.namespace].close;
            },
            locale() {
                return this.$store.state.settings.locale;
            },
            showPlaybackControl() {
                return this.$store.state[this.namespace].showPlaybackControl;
            },
            horizontalScrollbar() {
                return this.$store.state[this.namespace].chartParameters.hiddenFeatures.horizontalScrollbar;
            },
            buySell() {
                return this.$store.state[this.namespace].buySell;
            },
            symbols() {
                return this.$store.state.user.symbols;
            },
            zoomToSavedCoordinates() {
                return this.$store.state[this.namespace].zoomToSavedCoordinates;
            },
            verticalAdaptiveScaling: {
                get() {
                    return this.$store.state[this.namespace].chartParameters.verticalAdaptiveScaling;
                },
                set(verticalAdaptiveScaling) {
                    console.log("verticalAdaptiveScaling.set() starting. verticalAdaptiveScaling=", verticalAdaptiveScaling);
                    this.$store.commit(this.namespace + '/chartParameters/setVerticalAdaptiveScaling', verticalAdaptiveScaling);
                }
            }
        },
        watch: {
            symbols(symbols) {
                console.log("watch symbols=", symbols);
                let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                this.createChart(generalForm, this.divName);
            },
            parsedData: function (parsedData) {
                console.log("watch parsedData = ", JSON.parse(JSON.stringify(parsedData)));
                let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                if (parsedData !== null) {
                    this.createChart(generalForm, this.divName);
                } else {
                    if (this.$options.chart.dispose) {
                        //  console.log("disposing chart.");
                        this.$options.chart.dispose();
                    }
                }
            },
             open: function (newOpen, oldOpen) {
                console.log("watch: newOpen=", newOpen, " oldOpen=", oldOpen);
                //  let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                // console.log("this.$options.root=", this.$options.root);
                if (Object.keys(this.$options.root).length > 0) {
                    // showTradingPeriodIndicator(this.$options.root, generalForm);
                }
            },
            close: function (newClose, oldClose) {
                console.log("watch: newClose=", newClose, " oldClose=", oldClose);
                //  let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                if (Object.keys(this.$options.root).length > 0) {
                    // showTradingPeriodIndicator(this.$options.root, generalForm);
                }
            },
            locale: function (locale) {
                console.log("watch: locale=", locale);
                let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                this.createChart(generalForm, this.divName);
            },
            horizontalScrollbar: function (horizontalScrollbar) {
                console.log("watch: horizontalScrollbar=", horizontalScrollbar);
                if (typeof this.$options.chart.scrollbarX !== 'undefined') {
                    this.$options.chart.scrollbarX.disabled = horizontalScrollbar;
                }
            },
            buySell() {
                console.log("watching buySell");
                // let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                // showTradingPeriodIndicator(this.$options.chart, generalForm);
            }
        },
        methods: {
            clickHandler() {
                console.log("clickHandler() starting.");
                //  console.log("this.$options.chart.plugins=", this.$options.chart.plugins);
                //  console.log("this.$options.chart.plugins.values[0].data=", this.$options.chart.plugins.values[0].data);
                let annotation_data = this.$options.chart.plugins.values[0].data;
                console.log("annotation_data=", annotation_data);
                if (annotation_data.objects.length > 0) {
                    //  this.verticalAdaptiveScaling = false;
                }
                this.$store.dispatch(this.namespace + "/chartParameters/storeAnnotationData", annotation_data);

            },
        
            removeChart: function () {
                console.log("removeChart() starting.");
                //  console.log("divName=", this.divName);
                if (document.getElementById(this.divName) !== null) {
                    document.getElementById(this.divName).innerHTML = "";
                    // document.getElementById(this.divName).style.border = '0px solid gray';
                }
            },
            createChart: function (generalForm, divName = "chartDiv") {
                console.log("createChart() starting. divName=", divName);

                let that = this;
      //  var indicatorControl;
        var valueSeries;
        var volumeSeries;
        var valueLegend;
        var mainPanel;
        var dateAxis;
        var valueAxis;

         generalForm = {
            "p": [1, -1, 1, 1],
            "unitMove": [50, 50, 50, 50],
            "sampleContract": ["S2024H", "C2023N", "C2023U", "C2023H"],
            selected: ["S2024H"],
            "mult": [1, 1, 1, 1],
            "legs": 1
        };

        function getData() {
            return new Promise(resolve => {

                let json = JSON.stringify(generalForm, null, 2);
                $.ajax({
                    url: "https://dscarr.com/a4a/BasicEodBarsControllerServlet/",
                    type: "POST",
                    data: { "json": json },
                    success: function (data) {
                        let parsedData = JSON.parse(data)[0];
                        // console.log("parsedData=", parsedData);
                        resolve(parsedData);

                    }
                });
            });
        }

        function loadChartControls() {
            console.log("loadChartControls() starting.");
            let stockChart = root.container.children.values[0];

            // Stock toolbar
            // -------------------------------------------------------------------------------
            // https://www.amcharts.com/docs/v5/charts/stock/toolbar/
             am5stock.StockToolbar.new(root, {
                container: document.getElementById("chartcontrols"),
                stockChart: stockChart,
                controls: [
                    am5stock.IndicatorControl.new(root, {
                        stockChart: stockChart
                    }),
                    am5stock.DateRangeSelector.new(root, {
                        stockChart: stockChart
                    }),
                    am5stock.PeriodSelector.new(root, {
                        stockChart: stockChart
                    }),
                    am5stock.SettingsControl.new(root, {
                        stockChart: stockChart
                    })
                ]
            });
        }
      
        function createChart() {
            console.log("createChart starting.");

            // Create root element
            root = am5.Root.new(that.divName);


            // Set themes
            root.setThemes([
                am5themes_Animated.new(root)
            ]);


            // Create a stock chart
            var stockChart = root.container.children.push(am5stock.StockChart.new(root, {
                // layout: root.verticalLayout
            }));

            // Set global number format
            root.numberFormatter.set("numberFormat", "#,###.00");

            // Create a main stock panel (chart)
            mainPanel = stockChart.panels.push(am5stock.StockPanel.new(root, {
                wheelY: "zoomX",
                panX: true,
                panY: true
            }));

            // Create value axis
            // 
            valueAxis = mainPanel.yAxes.push(am5xy.ValueAxis.new(root, {
                renderer: am5xy.AxisRendererY.new(root, {
                    pan: "zoom"
                }),
                extraMin: 0.1, // adds some space for for main series
                tooltip: am5.Tooltip.new(root, {}),
                numberFormat: "#,###.00",
                extraTooltipPrecision: 2
            }));

            dateAxis = mainPanel.xAxes.push(am5xy.DateAxis.new(root, {
                baseInterval: {
                    timeUnit: "day",
                    count: 1
                },
                renderer: am5xy.AxisRendererX.new(root, {}),
                tooltip: am5.Tooltip.new(root, {})
            }));


            // Add series
            valueSeries = mainPanel.series.push(am5xy.CandlestickSeries.new(root, {
                name: "MSFT",
                clustered: false,
                valueXField: "date",
                valueYField: "close",
                highValueYField: "high",
                lowValueYField: "low",
                openValueYField: "open",
                calculateAggregates: false,
                xAxis: dateAxis,
                yAxis: valueAxis,
                //  legendValueText: "date: [bold]{valueX.formatDate('MMM dd, yyyy')}[/] open: [bold]{openValueY}[/] high: [bold]{highValueY}[/] low: [bold]{lowValueY}[/] close: [bold]{valueY}[/]",
                legendValueText: "open: [bold]{openValueY}[/] high: [bold]{highValueY}[/] low: [bold]{lowValueY}[/] close: [bold]{valueY}[/]",
                legendRangeValueText: "",
                snapTooltip: true
            }));

            // Set main value series
            stockChart.set("stockSeries", valueSeries);

            var volumePanel = stockChart.panels.push(am5stock.StockPanel.new(root, {
                wheelY: "zoomX",
                panX: true,
                panY: true,
                height: am5.percent(30)
            }));

            var volumeValueAxis = volumePanel.yAxes.push(am5xy.ValueAxis.new(root, {
                numberFormat: "#.#a",
                renderer: am5xy.AxisRendererY.new(root, {
                    pan: "zoom"
                })
            }));

            var volumeAxisRenderer = am5xy.AxisRendererX.new(root, {});
            var volumeDateAxis = volumePanel.xAxes.push(am5xy.DateAxis.new(root, {
                baseInterval: {
                    timeUnit: "day",
                    count: 1
                },
                renderer: volumeAxisRenderer,
                tooltip: am5.Tooltip.new(root, {
                    forceHidden: false,
                    animationDuration: 200
                })
            }));

            // hide labels
            // volumeAxisRenderer.labels.template.set("forceHidden", true);

            volumeSeries = volumePanel.series.push(am5xy.ColumnSeries.new(root, {
                name: "volume",
                valueXField: "date",
                valueYField: "volume",
                xAxis: volumeDateAxis,
                yAxis: volumeValueAxis,
                legendValueText: "{valueY}",
                snapTooltip: true
            }));

            stockChart.set("volumeSeries", volumeSeries);

            // Add a stock legend
            valueLegend = mainPanel.plotContainer.children.push(am5stock.StockLegend.new(root, {
                stockChart: stockChart,
                background: am5.Rectangle.new(root, {
                    fill: am5.color(0xFFFFFF),
                    fillOpacity: .5
                })
            }));

            // Set main series
            // -------------------------------------------------------------------------------
            // https://www.amcharts.com/docs/v5/charts/stock-chart/#Setting_main_series
            stockChart.set("volumeSeries", volumeSeries);
            valueLegend.data.setAll([valueSeries, volumeSeries]);

            var volumeLegend = volumePanel.topPlotContainer.children.push(am5stock.StockLegend.new(root, {
                stockChart: stockChart
            }));
            volumeLegend.data.setAll([volumeSeries]);

            // Add cursor(s)
            mainPanel.set("cursor", am5xy.XYCursor.new(root, {
                yAxis: valueAxis,
                xAxis: dateAxis,
                // snapToSeries: [valueSeries],
                //  snapToSeriesBy: "y!"
            }));


            // hide y line on volume panel
            // volumeCursor.lineY.set("forceHidden", true);

            // Add scrollbar
            var scrollbar = mainPanel.set("scrollbarX", am5xy.XYChartScrollbar.new(root, {
                orientation: "horizontal",
                height: 50
            }));
            stockChart.toolsContainer.children.push(scrollbar);

            var sbDateAxis = scrollbar.chart.xAxes.push(am5xy.DateAxis.new(root, {
                baseInterval: {
                    timeUnit: "day",
                    count: 1
                },
                renderer: am5xy.AxisRendererX.new(root, {})
            }));

            var sbValueAxis = scrollbar.chart.yAxes.push(am5xy.ValueAxis.new(root, {
                renderer: am5xy.AxisRendererY.new(root, {})
            }));

            var sbSeries = scrollbar.chart.series.push(am5xy.LineSeries.new(root, {
                valueYField: "close",
                valueXField: "date",
                xAxis: sbDateAxis,
                yAxis: sbValueAxis
            }));

            sbSeries.fills.template.setAll({
                visible: true,
                fillOpacity: 0.3
            });

            stockChart.indicators.push(am5stock.VolumeProfile.new(root, {
                stockChart: stockChart,
                stockSeries: valueSeries,
                volumeSeries: volumeSeries,
                legend: valueLegend
            }));

            loadChartControls();

            // set data to all series

            getData().then(parsedData => {
                let values = JSON.parse(JSON.stringify(Object.values(parsedData.values)));
                console.log("values=", values);

                var data = am5.JSONParser.parse(values);
                console.log("data=", data);

                // Process data (convert dates and values)
                /*    var processor = am5.DataProcessor.new(root, {
                 dateFields: ["date"],
                 dateFormat: "yyyyMMdd",
                 numericFields: ["open", "high", "low", "close", "volume", "openInterest"]
                 });
                 processor.processMany(data);
                 console.log("data=", data); */

                let newData = data.map(bar => {
                    // console.log("bar=", JSON.parse(JSON.stringify(bar)));
                    let momentDate = moment(bar.date, "YYYYMMDD").format("YYYY-MM-DD");
                    let timestamp = Date.parse(momentDate);
                    bar.date = timestamp;
                    return bar;
                });
                console.log("newData=", newData);

                valueSeries.data.setAll(newData);
                volumeSeries.data.setAll(newData);
                sbSeries.data.setAll(newData);

                console.log("Done.");
            });
        }

        createChart();
            },
            loadChartControls() {
                console.log("loadChartControls() starting.");
               // this.addIndicators();
                let stockChart = this.$options.root.container.children.values[0];


                /* var toolbar = */  am5stock.StockToolbar.new(this.$options.root, {
                    container: document.getElementById("chartcontrols"),
                    stockChart: stockChart,
                    controls: [
                      //  seriesSwitcher,
                        am5stock.ResetControl.new(this.$options.root, {
                            stockChart: stockChart
                        }),
                        am5stock.SettingsControl.new(this.$options.root, {
                            stockChart: stockChart
                        }),
                        am5stock.IndicatorControl.new(this.$options.root, {
                            stockChart: stockChart
                        }),
                        am5stock.DrawingControl.new(this.$options.root, {
                            stockChart: stockChart
                        }),
                        am5stock.PeriodSelector.new(this.$options.root, {
                            stockChart: stockChart,
                            periods: [
                                {timeUnit: "month", count: 1, name: "1M"},
                                {timeUnit: "month", count: 6, name: "6M"},
                                {timeUnit: "year", count: 1, name: "1Y"},
                                {timeUnit: "max", name: "Max"},
                            ]
                        })
                    ]
                });
              
            }
          
        }
    };
</script>
