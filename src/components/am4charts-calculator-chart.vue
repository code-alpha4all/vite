<template>
    <div v-bind:style="{ width: width}" style="background-color: white; text-align: right">
       
        <!--  <div id="chartdiv-unauthorized"></div> -->
        <div v-bind:id="divName" 
             v-bind:style="{ height: height, width: width}"
             style="margin: 0px; padding: 0px;" class="resize"></div>                                               

    </div>
</template>

<script>

    import * as am4core from "@amcharts/amcharts4/core";
    import * as am4charts from "@amcharts/amcharts4/charts";
    import am4lang_en_US from "@amcharts/amcharts4/lang/en_US";
    import am4lang_it_IT from "@amcharts/amcharts4/lang/it_IT";
    import am4lang_es_ES from "@amcharts/amcharts4/lang/es_ES";
    import am4lang_de_DE from "@amcharts/amcharts4/lang/de_DE";
    import {spreadTitle} from "@/js/main";

    import {showTradingPeriodIndicator} from "@/js/am4charts-plugins/tradingPeriod";

    export default {
        chart: {}, // <-- non-reactive property
        mounted() {
            console.log("am4charts-calculator-chart.vue mounted. height=", this.height);
        },
        beforeDestroy() {
            //  this.$options.chart.dispose && this.$options.chart.dispose(); //Not sure if this works.
            if (this.$options.chart.dispose) {
                console.log("disposing chart.");
                this.$options.chart.dispose();
            }
        },
        props: {
            divName: {
                type: String,
                default: "chartDiv"
            },
            namespace: {
                type: String,
                default: ""
            },
            parsedData: {
                type: Array
            },
            height: {
                type: String,
                default: "270px"
            },
            width: {
                type: String,
                default: "600px"
            }
        },
        data: function () {
            return {
                generalForm: {},
                chartData: []
            }
        },
        computed: {
            locale() {
                return localStorage.getItem("language");
            },
            open() {
                return this.$store.state[this.namespace].open;
            },
            close() {
                return this.$store.state[this.namespace].close;
            },
            showText() {
                console.log("this.$store.state[this.namespace].program === 'SpreadCoverage'", this.$store.state[this.namespace].program === "SpreadCoverage");
                return this.$store.state[this.namespace].program === "SpreadCoverage" ? false : true;
            },
            buySell() {
                return this.$store.state[this.namespace].buySell;
            },
            symbols(){
                return this.$store.state.user.symbols;
            }
        },
        watch: {
            symbols(symbols){
                console.log("watch symbols=", symbols);
                let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                this.createGanttChart(generalForm, this.divName);
            },
            buySell(){
                console.log("watching buySell");
                let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                let showLabels = false;
                showTradingPeriodIndicator(this.$options.chart, generalForm, showLabels);
            },
            parsedData: function (newParsedData, oldParsedData) {
                console.log("watch newParsedData = ", JSON.parse(JSON.stringify(newParsedData)), " oldParsedData = ", JSON.parse(JSON.stringify(oldParsedData)));
                let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));

                if (oldParsedData !== null) {
                    oldParsedData.forEach(obj => delete obj.tooltip);
                    console.log("oldParsedData = ", JSON.parse(JSON.stringify(oldParsedData)));
                }
                if (newParsedData.length > 0 && newParsedData !== null /*&& JSON.stringify(newParsedData) !== JSON.stringify(oldParsedData)*/) {

                    if (oldParsedData !== null) {
                        newParsedData.forEach((obj, index) => {
                            if (obj !== oldParsedData[index]) {
                                //  console.log("mismatch! index=", index);
                                //  console.log("obj=", JSON.stringify(obj), " oldParsedData[index]=", JSON.stringify(oldParsedData[index]));
                            }
                        })
                    }

                    this.createGanttChart(generalForm, this.divName);
                }else{
                 document.getElementById(this.divName).innerHTML = 
                 "<div style='color: red; font-size: 12px; text-align: center; font-weight: normal'>Unable to make a chart from the current selections.</div>";
                 }
            },
            locale: function (locale) {
                console.log("watch: locale=", locale);
                let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                if (this.parsedData.length > 0) {
                    this.createGanttChart(generalForm, this.divName);
                } else {
                    document.getElementById(this.divName).innerHTML =
                            "<div style='color: red; font-size: 12px; font-weight: normal'>Unable to make a chart from the current selections.</div>";
                }
            },
            open: function (open) {
                console.log("watch: open=", open);
                let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                console.log("this.$options.chart=", this.$options.chart);
                if (Object.keys(this.$options.chart).length > 0) {
                    let showLabels = false;
                    showTradingPeriodIndicator(this.$options.chart, generalForm, showLabels);
                }
            },
            close: function (close) {
                console.log("watch: close=", close);
                let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                if (Object.keys(this.$options.chart).length > 0) {
                    let showLabels = false;
                    showTradingPeriodIndicator(this.$options.chart, generalForm, showLabels);
                }
            }
        },
        methods: {
            removeChart: function () {
                //  console.log("removeChart() starting.");
                // console.log("divName=", this.divName);
                if (document.getElementById(this.divName) !== null) {
                   document.getElementById(this.divName).innerHTML = "";
                    // document.getElementById(this.divName).style.border = '0px solid gray';
                }
            },
            createGanttChart: function (generalForm, divName = "chartDiv") {
                console.log("createGanttChart() starting.");
                this.$options.chart.dispose && this.$options.chart.dispose(); //Not sure if this works.
                if (this.$options.chart.dispose) {
                    console.log("disposing chart.");
                    this.$options.chart.dispose();
                }

                this.parsedData.forEach(x => {
                            // console.log("x=", x);
                            generalForm.selected = [x.selected];
                            // console.log("generalForm=", generalForm);
                            let invertDatesMultiplier = 1;
                            let noLegSwapping = false;
                            let includeUnitMoves = true;
                             let ticker = spreadTitle(generalForm, invertDatesMultiplier, noLegSwapping, this.symbols, includeUnitMoves);
                           // console.log("ticker=", ticker);

                            x.tooltip = ticker;
                        }); 
                console.log("this.parsedData=", JSON.parse(JSON.stringify(this.parsedData)));
                
                am4core.addLicense("CH208485191");
                let chart = am4core.create(divName, am4charts.XYChart);
                chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

                console.log("localStorage.getItem('language')=", localStorage.getItem("language"));
                let localeFile;
                switch (localStorage.getItem("language")) {
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
                console.log("localeFile=", localeFile);
                //chart.language.locale = localeFile;

                chart.paddingRight = 30;
                chart.dateFormatter.inputDateFormat = "yyyy-MM-dd";

                let colorSet = new am4core.ColorSet();
                colorSet.saturation = 0.4;               

                let title = chart.titles.create();
                console.log("this.parsedData[0].tooltip=", this.parsedData[0].tooltip);
                title.text = this.$store.getters[this.namespace + "/displayTickerWithUnitMoves"] + ", . . .  " //+ this.parsedData[this.parsedData.length - 1].tooltip;
                title.fontSize = 12;
                title.fontWeight = "bold";
                title.marginTop = 0;
                title.marginBottom = 10;

                chart.data = this.parsedData;
                console.log("chart.data=", JSON.parse(JSON.stringify(chart.data)));

                chart.dateFormatter.dateFormat = "yyyy-MM-dd";
                chart.dateFormatter.inputDateFormat = "yyyy-MM-dd";

                let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
                categoryAxis.dataFields.category = "year";
                categoryAxis.renderer.grid.template.location = 0;
                categoryAxis.renderer.inversed = true;

                let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
                dateAxis.id = "date-axis";
                dateAxis.renderer.minGridDistance = 70;
                dateAxis.baseInterval = {count: 1, timeUnit: "day"};
                // dateAxis.max = new Date(2018, 0, 1, 24, 0, 0, 0).getTime();
                //dateAxis.strictMinMax = true;
                dateAxis.renderer.tooltipLocation = 0;

                let series1 = chart.series.push(new am4charts.ColumnSeries());
                series1.columns.template.height = am4core.percent(15);
                series1.columns.template.tooltipText = "{tooltip}, first date: {openDateX.formatDate('MMM dd, yyyy')}[/], last date: {dateX.formatDate('MMM dd, yyyy')}[/]";
                series1.dataFields.openDateX = "open";
                series1.dataFields.dateX = "close";
                series1.dataFields.categoryY = "year";
                series1.columns.template.propertyFields.fill = "color"; // get color from data
                series1.columns.template.propertyFields.stroke = "color";
                series1.columns.template.strokeOpacity = 1;

                this.$options.chart = chart;
                let showLabels = false;
                showTradingPeriodIndicator(this.$options.chart, generalForm, showLabels);
            }
        }
    }
</script>
