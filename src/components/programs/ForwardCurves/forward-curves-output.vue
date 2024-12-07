<template>
    <div style="border: 0px solid gray; margin: 0">
        <div v-bind:id="divName" class="resize-forward-chart"></div>
    </div>
</template>

<style scoped>
    .resize-forward-chart {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0px;
        width: auto;
        /* height: 79vh; */
        overflow: hidden;
        resize: both;
    }
</style>

<script>
    import * as am4core from "@amcharts/amcharts4/core";
    import * as am4charts from "@amcharts/amcharts4/charts";
//import * as am4plugins_annotation from "@amcharts/amcharts4/plugins/annotation";
   // import $ from "jquery";
    import moment from 'moment/min/moment-with-locales';
    import {contractNameDecomposer, omit, commodityName, FrontMonthContract, getCommoditiesArray,
            contractConverter, contractDigits, yearToColor, displayCommodity} from "@/js/main";
    import * as fb from '@/firebase';

    const axios = require('axios');

    export default {
        chart: {}, // <-- non-reactive property
        mounted() {
            // console.log("forward-curves-output.vue mounted() starting.");
            // console.log("this.$options.chart=", this.$options.chart);
            this.$store.commit(this.namespace + "/setTabTitle", "forward: " + displayCommodity(this.commodity, this.symbols));
            this.$root.$on("change-period", this.doChangePeriod);

            if (this.activeModuleName === this.namespace && !this.initialized) {
                this.getData();
            }
        },
        beforeDestroy() {
            if (typeof this.$options.chart.dispose === "function") {
                // console.log("Destroying chart.");
                this.$options.chart.dispose();
            }
            this.$root.$off("change-period", this.doChangePeriod);
        },
        props: ["namespace"],
        data: function () {
            return {
                contracts: [],
                initialized: false,
                data: [],
                dates: []
            };
        },
        computed: {
            divName() {
                return this.namespace + "-chartDiv";
            },
            commodity() {
                return this.$store.getters[this.namespace + "/c"][0];
            },
            forwardCurveStudy() {
                let forwardCurveStudy = this.$store.state[this.namespace].forwardCurveStudy;
               // console.log("forwardCurveStudy=", forwardCurveStudy);
                return forwardCurveStudy;
            },
            y1() {
                return this.$store.state[this.namespace].y1;
            },
            yearOptionsLength(){
                console.log("this.$store.state[this.namespace].yearOptionsLength=", this.$store.state[this.namespace].yearOptionsLength);
                return this.$store.state[this.namespace].yearOptionsLength;
            },
            numberOfMonths: function () {
                return getCommoditiesArray().find(x => x.symbol === this.commodity).months.length;
            },
            normalization() {
                return this.$store.state[this.namespace].normalization;
            },
            activeModuleName() {
                let activeModuleName = this.$store.getters["activeModuleName"];
                // console.log("activeModuleName=", activeModuleName);
                return activeModuleName;
            },
            locale() {
                return this.$store.state.settings.locale;
            },
            balloons() {
                return this.$store.state[this.namespace].chartParameters.balloons;
            },
            symbols(){
                return this.$store.state.user.symbols;
            },
            monthSpecs() {
                let specs = getCommoditiesArray().find(x => x.symbol === "CL").months.map(x => ({symbol: x.symbol, name: x.name}));
               // console.log("specs=", specs);
                return specs;
            }
        },
        watch: {
            commodity: function (commodity) {
                console.log("watch commodity=", commodity);
                this.getData();
            },
            forwardCurveStudy: function (forwardCurveStudy) {
                console.log("watch forwardCurveStudy=", forwardCurveStudy);
                this.makeChart();
            },
            y1(y1) {
                console.log("watch: y1=", y1);
                this.makeChart();
            },
            normalization(normalization) {
                console.log("watch: normalization=", normalization);
                this.getData();
            },
            activeModuleName: function (activeModuleName) {
                console.log("activeModuleName=", activeModuleName, " namespace=", this.namespace, " this.initialized=", this.initialized);
                if (activeModuleName === this.namespace && !this.initialized) {
                    this.initialized = true;
                    this.getData();
                }
            },
            locale: function (locale) {
                console.log("watch: locale=", locale);
                this.getData();
            },
            balloons: function (balloons) {
                console.log("watch: balloons=", balloons);
                this.setSeriesLabels();
            },
            symbols(symbols) {
                console.log("watch: symbols=", symbols);
                this.$store.commit(this.namespace + "/setTabTitle", "forward: " + displayCommodity(this.commodity, this.symbols));
                this.makeChart()
            },
        },
        methods: {
            setSeriesLabels() {
                // console.log("this.$options.chart.series=", this.$options.chart.series);
                this.$options.chart.series.values.forEach(values => {
                    if (typeof values !== 'undefined') {
                        values.tooltipText = this.balloons ? values.name + ": {valueY.value}" : "";
                    }
                });
            },
            /*   changeYearsShown: function (years) {
             this.y1 = parseInt(years);
             this.dates = this.data.map((x) => x.date);
             console.log("dates=", this.dates);
             //console.log("data=", this.data);
             this.makeChart();
             
             if (this.forwardCurveStudy === "unaligned") {
             this.zoomChart(this.y1 - 1);
             }
             },*/
            doChangePeriod(years) {
                console.log("doChangePeriod() starting. years=", years, " this.activeModuleName=", this.activeModuleName, " namespace=", this.namespace);
                if (this.activeModuleName === this.namespace) {
                    this.zoomChart(years);
                }
            },
            getDataFromFirebaseStorage(){
                console.log("getDataFromFirebaseStorage() starting.");
                let storage = fb.storage;
                let path = "/forwardCurves/" + this.commodity + ".json";
                let pathReference = storage.ref(path);
                console.log("pathReference=", pathReference._delegate.fullPath);

                this.$store.commit('resetNumberOfAjaxCalls');
                this.$store.commit('incrementNumberOfAjaxCalls');
                this.initialized = true;
                let that = this;
                pathReference.getDownloadURL()
                            .then((url) => {
                                console.log("url=", url);
                                axios.get(url)
                                        .then(apiResponse => {
                                            this.$store.commit('decrementNumberOfAjaxCalls');
                                            console.log("apiResponse=", apiResponse);
                                            let parsedData = apiResponse.data;
                                            console.log("parsedData=", parsedData);
                                            
                                            let values = parsedData.values.filter(x => x !== "no");
                                            console.log("values=", values);

                                            that.$store.commit(that.namespace + "/setYearOptionsLength", values.length - 1);
                                            if(that.y1 >= values.length){
                                                that.$store.commit(that.namespace + "/setY1", values.length - 1);
                                            }

                                        that.lastDate = parsedData.lastDate;
                                        //  console.log("that.lastDate=", that.lastDate);
                                        that.$store.commit(that.namespace + "/setTabTitle", "forward: " + displayCommodity(that.commodity, that.symbols));

                                        that.data = values;
                                        that.dates = that.data.map((x) => x.date);
                                        //  console.log("dates=", that.dates);
                                     //  console.log("data=", that.data);

                                        that.makeChart();
                                        });
                            })
                            .catch((err) => {
                                this.$store.commit('decrementNumberOfAjaxCalls');
                                console.log("err=", err);
                                /*   $('#' + this.namespace + '-plotlyHeatMapDiv').html("<H4 style='color: red; text-align: left; margin: 20px 0 0 10px'>\n\
                                 No map data.</H3>");*/
                            });
            },   
            getData() {
                console.log("getData() starting.");
                this.getDataFromFirebaseStorage();
              /*  let url = this.$store.state.siteData.baseUrl + this.$store.state.siteData.contextName + "/ForwardCurveServlet?commodity=" + this.commodity;
                this.$store.commit('incrementNumberOfAjaxCalls');
                this.initialized = true;
                let that = this;
                $.ajax({
                    url: url,
                    type: "GET",
                    success: function (data) {
                        that.$store.commit('decrementNumberOfAjaxCalls');
                        let parsedData = JSON.parse(JSON.parse(data).values);
                        // let parsedData = JSON.parse(data);
                        console.log("parsedData=", parsedData);
                        let values = parsedData.values.filter(x => x !== "no");
                        console.log("values=", values);

                        that.$store.commit(that.namespace + "/setYearOptionsLength", values.length - 1);
                        if(that.y1 >= values.length){
                            that.$store.commit(that.namespace + "/setY1", values.length - 1);
                        }

                        that.lastDate = parsedData.lastDate;
                        //  console.log("that.lastDate=", that.lastDate);
                        that.$store.commit(that.namespace + "/setTabTitle", "forward: " + displayCommodity(that.commodity, that.symbols));

                        that.data = values;
                        that.dates = that.data.map((x) => x.date);
                        //  console.log("dates=", that.dates);
                        //  console.log("data=", that.data);

                        that.makeChart();
                    },
                    fail: function (data) {
                        console.log("call failed.");
                        that.$store.commit('decrementNumberOfAjaxCalls');
                        console.log(data);
                    },
                }); */
            },
            zoomChart: function (period) {
                // console.log("zoomChart() starting. period=", period);
                period = Math.min(period, this.y1);
                // console.log("period=", period);
                // console.log("this.$options.chart.data=", JSON.parse(JSON.stringify(this.$options.chart.data)));

                let start;
                let end;
                let index;
                if (this.forwardCurveStudy === "unaligned") {
                    let frontMonthContract = FrontMonthContract(this.commodity);
                    // console.log("frontMonthContract=", frontMonthContract);

                    let month = contractNameDecomposer(frontMonthContract).monthSymbol;
                    let year = parseInt(contractNameDecomposer(frontMonthContract).year);
                    start = this.commodity + (year - period) + month;
                    index = this.contracts.length - 1;
                    end = this.contracts[index];
                } else if (this.forwardCurveStudy === "aligned") {
                    start = this.contracts[0];
                    // console.log("this.numberOfMonths=", this.numberOfMonths);
                    index = Math.min(period * this.numberOfMonths - 1, this.contracts.length - 1);

                    let found = false;
                    while (!found) {
                        end = this.contracts[index];
                        // console.log("end=", end, " index=", index);
                        let testEnd = Object.keys(this.$options.chart.data.find((x) => x.contract === end));
                        // console.log("testEnd=", testEnd);
                        let seriesNames = this.$options.chart.series.values.map((x) =>
                            x.id.toString()
                        );
                        // console.log("seriesNames=", seriesNames);
                        found = seriesNames.some((r) => testEnd.includes(r));
                        // console.log("found=", found);
                        index--;
                    }
                } else {
                    start = this.monthsWithAverageOrCurrent[0];
                    index = Math.min(period * this.numberOfMonths - 1, this.monthsWithAverageOrCurrent.length - 1);
                    end = this.monthsWithAverageOrCurrent[index];
                }
                // console.log("start=", start, "  end=", end);
                this.$options.chart.xAxes.values[0].zoomToCategories(start, end);
            },
            makeChart: function () {
                console.log("makeChart() starting. this=", this);
                let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                // console.log("generalForm=", generalForm);
                //  console.log("this.data=", JSON.parse(JSON.stringify(this.data)));
                // updateState(generalForm);

                moment.locale(this.locale);
                // console.log("moment()=", moment()); 
                // console.log("moment.locale()=", moment.locale()); 

                if (this.$options.chart.dispose) {
                    // console.log("disposing chart.");
                    this.$options.chart.dispose();
                }
                // console.log("this.$options.chart=", this.$options.chart);

                let data;
                let normalization = generalForm.normalization;
                // console.log("normalization=", normalization);
                if (normalization /* && this.forwardCurveStudy === "aligned"*/) {
                    data = this.data.map((forwardCurveObject) => {
                        //  console.log("forwardCurveObject=", forwardCurveObject);
                        let forwardCurveContracts = Object.keys(forwardCurveObject)
                                .filter((x) => x !== "date")
                                .reverse();
                        //  console.log("forwardCurveContracts=", forwardCurveContracts);
                        let nearestOpenContract = forwardCurveContracts[0];
                        let normalizationValue = forwardCurveObject[nearestOpenContract];
                        //  console.log("nearestOpenContract=", nearestOpenContract, " normalizationValue=", normalizationValue);
                        let obj = {...forwardCurveObject};
                        forwardCurveContracts.forEach((contract) => {
                            let close = forwardCurveObject[contract];
                            let normalizedClose = close - normalizationValue;
                            obj[contract] = normalizedClose;
                        });
                        return obj;
                    });
                } else {
                    data = this.data;
                }
                data = data.slice(0, this.y1 + 1);
                console.log("data=", JSON.parse(JSON.stringify(data)));

                let chartData = [];
                for (let i = 0; i < data.length; i++) {
                    // console.log("data[" + i + "]=", JSON.parse(JSON.stringify(data[i])));
                    let yearlyData = [...Object.keys(data[i])].filter((x) => x !== "date");
                    // console.log("yearlyData=", yearlyData);
                    for (let key of yearlyData) {
                        let date = data[i].date;
                        // console.log("key=", key, " date=", date);
                        let month = contractNameDecomposer(key).monthSymbol;
                        let year = contractNameDecomposer(key).year;
                        let newKey = this.forwardCurveStudy === "unaligned" ? key : this.commodity + (year - 0 + i) + month;

                        let point = chartData.find((x) => x.contract === newKey);
                        // console.log("point=", point);
                        if (typeof point === "undefined") {
                            let obj = {};
                            obj[date] = data[i][key];
                            obj["contract"] = newKey;
                            chartData.push(obj);
                        } else {
                            point[date] = data[i][key];
                        }
                    }
                }
                // console.log("chartData=", chartData);

                chartData.sort(function (a, b) {
                    return a.contract > b.contract ? 1 : b.contract > a.contract ? -1 : 0;
                });

                this.contracts = chartData.map((x) => x.contract);
                //  console.log("this.contracts=", this.contracts);
                // console.log("this.frontMonthContract=", this.frontMonthContract);

                if (this.forwardCurveStudy !== "unaligned") {
                    //Calculate averages.

                    let digits = 1 + contractDigits(generalForm.sampleContract[0], "future");
                    console.log("digits=", digits);
                    let that = this;
                    chartData.forEach(function (month) {
                        // console.log("month=", month);
                        let monthSubset1 = omit(month, "contract");
                        delete monthSubset1[that.lastDate.replace(/-/g, "")]; // This removes the current contract from the averages.
                        // console.log("monthSubset1=", monthSubset1);

                        let monthValues15 = Object.values(monthSubset1);
                        let avg15 = (monthValues15.reduce((a, b) => a + b, 0) / monthValues15.length).toFixed(digits);
                        // console.log("avg15=", avg15);
                        month.years = monthValues15.length;
                        if (month.years == 15) {
                            month.avg15 = avg15;
                        }

                        let keySubset = that.dates.slice(1, 6); /*/.map(x => x.replace(/-/g, ""))*/
                        // console.log("keySubset=", keySubset);

                        const getSubset = (obj, ...keys) =>
                            keys.reduce((a, c) => ({...a, [c]: obj[c]}), {}); // https://stackoverflow.com/questions/17781472/how-to-get-a-subset-of-a-javascript-objects-properties

                        let monthSubset2 = getSubset(monthSubset1, ...keySubset);
                        //  console.log("monthSubset2=", monthSubset2);

                        let monthValues5 = Object.values(monthSubset2);
                        let avg5 = (monthValues5.reduce((a, b) => a + b, 0) / monthValues5.length).toFixed(digits);
                        // console.log("avg5=", avg5);
                        if (!isNaN(avg5)) {
                            if (monthValues5.length == 5) {
                                month.avg5 = avg5;
                            }
                        }
                    });
                }
                console.log("chartData=", chartData);

                let monthsWithoutCurrent = chartData
                        .filter((x) => typeof x[this.lastDate.replace(/-/g, "")] === "undefined")
                        .map((x) => x.contract);
                // console.log("monthsWithoutCurrent=", monthsWithoutCurrent, "  this.contracts[this.contracts.length-1]=", this.contracts[this.contracts.length - 1]);
                let monthsWithoutAverage = chartData
                        .filter((x) => typeof x.avg5 === "undefined")
                        .map((x) => x.contract);
                //console.log("monthsWithoutAverage=", monthsWithoutAverage);

                let monthsWithoutAverageOrCurrent = [monthsWithoutCurrent, monthsWithoutAverage, ].reduce((a, b) => a.filter((c) => b.includes(c)));
                // console.log("monthsWithoutAverageOrCurrent=", monthsWithoutAverageOrCurrent);
                this.monthsWithAverageOrCurrent = this.contracts.filter(
                        (x) => !monthsWithoutAverageOrCurrent.includes(x)
                );
                //  console.log("this.monthsWithAverageOrCurrent=", this.monthsWithAverageOrCurrent);

                am4core.addLicense("CH208485191");
                // am4core.useTheme(am4themes_animated); // Themes end

                let chart = am4core.create(this.divName, am4charts.XYChart);
                chart.responsive.enabled = true;
                
                let normalizationText = this.normalization ? ",  Normalized" : "";
                let title = chart.titles.create();
                title.text = commodityName(this.commodity) + ":  " + moment(this.lastDate, "YYYY-MM-DD").format("MMMM D") + normalizationText;
                title.fontSize = 12;
                title.marginBottom = 10;
                chart.data = chartData;
                chart.padding(10, 10, 10, 10);
                let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
                categoryAxis.title.fontWeight = "bold";
                categoryAxis.title.fontSize = 15;
                categoryAxis.dataFields.category = "contract";

                categoryAxis.renderer.minGridDistance = 12;
                categoryAxis.renderer.labels.template.fontSize = 12;
                categoryAxis.renderer.labels.template.fontWeight = "normal";
                categoryAxis.renderer.labels.template.rotation = 90; //this.forwardCurveStudy === "unaligned" ? 90 : 0;
                categoryAxis.renderer.labels.template.verticalCenter = "middle";
                categoryAxis.renderer.labels.template.horizontalCenter = "left";

                //categoryAxis.cursorTooltipEnabled = false;
                let that = this;

                if (that.forwardCurveStudy !== "unaligned") {
                    console.log("that.monthSpecs", JSON.parse(JSON.stringify(that.monthSpecs)));
                    categoryAxis.title.text = "Contract Month";

                    categoryAxis.renderer.labels.template.adapter.add("text", function (text, target) {
                        if (target.dataItem && target.dataItem.category) {
                            let temp = target.dataItem.category;                          
                            // console.log("target=", target.dataItem.category);

                            let monthSymbol = temp.charAt(temp.length - 1);
                            let newLabel = monthSymbol +" ("+that.monthSpecs.find(x => x.symbol === monthSymbol).name +")";
                          //  console.log("newLabel=", newLabel);
                            return newLabel;
                        }
                    });

                    categoryAxis.tooltip.label.adapter.add("text", function (text, target) {
                        if (target.dataItem && target.dataItem.category) {
                            let temp = target.dataItem.category;
                            // console.log("target=", target.dataItem.category);
                            let newLabel = that.monthSpecs.find(x => x.symbol === temp.charAt(temp.length - 1)).name;
                            // console.log("newLabel=", newLabel);
                            return newLabel;
                        }
                    });
                }else{
                    categoryAxis.title.text = "Contract";

                    let that = this;
                    categoryAxis.renderer.labels.template.adapter.add("text", function (text, target) {
                        if (target.dataItem && target.dataItem.category) {
                            let temp = target.dataItem.category;
                            let newLabel = that.symbols === "old" ? temp : contractConverter(temp, "eod", that.symbols);
                            // console.log("target=", target.dataItem.category);
                            return newLabel;
                        }
                    });

                    categoryAxis.tooltip.label.adapter.add("text", function (text, target) {
                        if (target.dataItem && target.dataItem.category) {
                            let temp = target.dataItem.category;
                            let newLabel = that.symbols === "old" ? temp : contractConverter(temp, "eod", that.symbols);
                            // console.log("target=", target.dataItem.category);
                            return newLabel;
                        }
                    });
                }

                let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
                valueAxis.renderer.labels.template.fontWeight = "normal";

                let numberOfSeries = this.forwardCurveStudy === "averages" ? 1 : this.y1 + 1;
                console.log("numberOfSeries=", numberOfSeries);
                console.log("this.y1=", this.y1);
                // console.log("data=", data);
                let series = [];
                for (let i = 0; i < numberOfSeries; i++) {
                    series[i] = chart.series.push(new am4charts.LineSeries());
                    series[i].id = data[i].date;
                    series[i].name = moment(data[i].date, "YYYYMMDD").format("MMM D, YYYY");
                    series[i].dataFields.categoryX = "contract";
                    series[i].dataFields.valueY = data[i].date;

                    let year = moment(data[i].date, "YYYYMMDD").format("YYYY");
                    let color = yearToColor(year);
                    series[i].stroke = color;
                    series[i].fill = color;
                    // console.log("data["+i+"].date=", data[i].date);
                    // console.log("series[" + i + "].dataFields.valueY=",series[i].dataFields.valueY);
                    let circleBullet = series[i].bullets.push(new am4charts.CircleBullet());

                    if (i === 0) {
                        series[0].strokeWidth = 2;
                        circleBullet.circle.radius = 3;
                    } else {
                        circleBullet.circle.radius = 2;
                    }

                    /*   if (this.showTooltips) {
                     series[i].tooltipText = series[i].name + "JJJJJJJJJJJJJJ";
                     } */
                }
                if (this.forwardCurveStudy !== "unaligned") {

                    if (this.y1 === 15) {
                        console.log("inside loop.");
                        series[numberOfSeries] = chart.series.push(new am4charts.LineSeries());
                        series[numberOfSeries].id = "15";
                        series[numberOfSeries].name = "15y avg";
                        series[numberOfSeries].dataFields.categoryX = "contract";
                        series[numberOfSeries].dataFields.valueY = "avg15";

                        let circleBullet = series[numberOfSeries].bullets.push(new am4charts.CircleBullet());
                        circleBullet.circle.radius = 3;
                        circleBullet.stroke = am4core.color("black");
                        circleBullet.circle.fill = circleBullet.stroke;
                        series[numberOfSeries].tooltipText = series[numberOfSeries].name;
                        series[numberOfSeries].stroke = "black";
                        series[numberOfSeries].fill = "black";
                        series[numberOfSeries].strokeWidth = 2;
                        series[numberOfSeries].propertyFields.strokeDasharray = "strokeDasharray15";
                    }

                    series[numberOfSeries + 1] = chart.series.push(new am4charts.LineSeries());
                    series[numberOfSeries + 1].id = "5";
                    series[numberOfSeries + 1].name = "5y avg";
                    series[numberOfSeries + 1].dataFields.categoryX = "contract";
                    series[numberOfSeries + 1].dataFields.valueY = "avg5";

                    let circleBullet2 = series[numberOfSeries + 1].bullets.push(new am4charts.CircleBullet());
                    circleBullet2.circle.radius = 3;
                    circleBullet2.stroke = am4core.color("gray");
                    circleBullet2.circle.fill = circleBullet2.stroke;
                    // series[numberOfSeries + 1].tooltipText = series[numberOfSeries + 1].name;
                    series[numberOfSeries + 1].stroke = "gray";
                    series[numberOfSeries + 1].fill = "gray";
                    series[numberOfSeries + 1].strokeWidth = 2;
                    series[numberOfSeries + 1].propertyFields.strokeDasharray = "strokeDasharray5";
                }
                // this.series = series;

                chart.cursor = new am4charts.XYCursor();
                chart.legend = new am4charts.Legend();
                chart.legend.position = "left";
                chart.legend.labels.template.fontWeight = "normal";
                chart.legend.scrollable = false;
                chart.legend.itemContainers.template.paddingTop = 0;
                chart.legend.itemContainers.template.paddingBottom = 3;
//renderer.labels.template.fontWeight
                // let months = commodityMonths(this.commodity);

                let groupedContracts = this.contracts.reduce(function (obj, contract) {
                    let year = contractNameDecomposer(contract).year;

                    if (!Object.prototype.hasOwnProperty.call(obj, year)) {
                        // if (!obj.hasOwnProperty(year)) {
                        obj[year] = [];
                    }
                    obj[year].push(contract);
                    return obj;
                }, {});
                //console.log("groupedContracts=", groupedContracts);
                let categoryLimits = Object.values(groupedContracts).map((x) => x[0]);
                // console.log("categoryLimits=", categoryLimits);
                categoryLimits.push(this.contracts[this.contracts.length - 1]);
                // if (this.forwardCurveStudy !== "unaligned") {
                let rangeArray = [];
                for (let i = 0; i < 10; i++) {
                    rangeArray[i] = categoryAxis.axisRanges.create();
                    rangeArray[i].category = categoryLimits[2 * i + 1];
                    rangeArray[i].endCategory = categoryLimits[2 * i + 2];
                    rangeArray[i].axisFill.fillOpacity = 0.1;
                    rangeArray[i].locations.category = 0.5;
                    rangeArray[i].locations.endCategory = 0.5;
                    rangeArray[i].label.disabled = true;
                    rangeArray[i].grid.strokeOpacity = 0.0;
                }
                // }

                chart.exporting.menu = new am4core.ExportMenu();
                chart.exporting.menu.align = "left";
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

                //chart.zoomOutButton.disabled = true;
                chart.zoomOutButton.align = "right";

                this.$options.chart = chart;
                this.setSeriesLabels();

                let inputDiv = document.querySelector('#' + this.namespace + 'InputDiv');
                // console.log("inputDiv=", inputDiv);
                let inputHeight = inputDiv !== null ? inputDiv.offsetHeight : 0;
                // console.log("inputHeight=", inputHeight);
                this.$store.commit(this.namespace + '/browserSideOnly/setInputDivHeight', inputHeight);

                // console.log("this.$parent.$parent.$parent=", this.$parent.$parent.$parent);
                this.$parent.$parent.$parent.setChartHeight();

                chart.events.on("ready", () => {
                    // console.log("ready");
                    let period = 2;
                    if (this.forwardCurveStudy !== "unaligned") {
                        this.zoomChart(period);
                    }
                    hideIndicator();
                });

                chart.preloader.disabled = true;

var indicator;
var indicatorInterval;

function showIndicator() {
  
  if (!indicator) {
    indicator = chart.tooltipContainer.createChild(am4core.Container);
    indicator.background.fill = am4core.color("#fff");
    indicator.background.fillOpacity = 0.8;
    indicator.width = am4core.percent(100);
    indicator.height = am4core.percent(100);

    var indicatorLabel = indicator.createChild(am4core.Label);
    indicatorLabel.text = "Loading ...";
    indicatorLabel.align = "center";
    indicatorLabel.valign = "middle";
    indicatorLabel.fontSize = 20;
    indicatorLabel.dy = 50;
    
    var hourglass = indicator.createChild(am4core.Image);
    hourglass.href = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-160/hourglass.svg";
    hourglass.align = "center";
    hourglass.valign = "middle";
    hourglass.horizontalCenter = "middle";
    hourglass.verticalCenter = "middle";
    hourglass.scale = 0.7;
  }
  
  indicator.hide(0);
  indicator.show();
  
  clearInterval(indicatorInterval);
  indicatorInterval = setInterval(function() {
    hourglass.animate([{
      from: 0,
      to: 360,
      property: "rotation"
    }], 2000);
  }, 3000);
}

function hideIndicator() {
  indicator.hide();
  clearInterval(indicatorInterval);
}

showIndicator();
            },
        },
    };
</script>
