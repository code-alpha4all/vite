<template>
    <div>
        <slot :data="this.parsedData"></slot>
    </div>
</template>

<script>

    import $ from "jquery";
    import moment from 'moment';
    import {/*getExchange, */spreadTitle, spreadUnits} from "../js/main";
    export default {
        props: ["namespace", "url"],
        mounted() {
            var that = this;
            setTimeout(function () {
                that.getData();
            }, 1000);

        },
        data: () => ({
                parsedData: {}
            }),
        computed: {
            ticker() {
                return this.$store.getters[this.namespace + "/ticker"];
            }
        },
        watch: {
            ticker: function (newTicker, oldTicker) {
                console.log("newTicker=", newTicker, " oldTicker=", oldTicker, " namespace=", this.namespace);
                this.getData();
            }
        },
        methods: {
            getData: function () {
                console.log("getData() starting.");
                this.$store.commit(this.namespace + '/setLoading', true);
                // console.trace();
                /* let levels = [
                 {from: "0.200", to: "0.3", color: "orange", name: "horizontal-bronze-series"},
                 //  {from: "205", to: "240", color: "silver", name: "horizontal-silver-series"},
                 //  {from: "240", to: "350", color: "gold", name: "horizontal-gold-series"}
                 ];
                 this.$store.commit('generalFormPlaybackChart/chartParameters/setLevels', levels);*/

                var that = this;
                let selected = this.$store.state[this.namespace].selected;
                // console.log("selected=", selected);
                // let firstSelected = this.$store.state[this.namespace].selected[0];
                // console.log("firstSelected=", firstSelected);

                let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                // console.log("generalForm=", generalForm);
                // console.log("selected=", this.$store.state[this.namespace].selected);
                // console.log("selected.length=", selected.length);

                if (this.$store.state[this.namespace].program === "StockCharts") {
                    console.log("stock chart");

                }else if (this.$store.state[this.namespace].dataSource === "barchart") {
                    let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                    if (typeof generalForm.selected[1] === 'undefined') {
                        //  let barchartOptions = this.$store.state[this.namespace].browserSideOnly.barchartOptions.slice(0);
                        // console.log("barchartOptions=", barchartOptions);

                        // let barchartTicker = barchartOptions.find(x => x.text === generalForm.selected[0]);
                        //  console.log("barchartTicker=", barchartTicker);
                    }

                    if (generalForm.selected.length > 0) {
                        let today = moment().format('YYYYMMDD');
                        let position = generalForm.spreadP;
                        //  let commodity = this.$store.getters[this.namespace + '/c'][0];
                        // let exchange = getExchange(commodity);
                        // console.log("exchange=", exchange);

                        currentRequest = $.ajax({
                            url: 'https://ondemand.websol.barchart.com/getHistory.json?apikey=b1c49578e1c86ad86ed719375aff6f49&symbol=' +
                                    generalForm.selected[1] + '&startDate=20000102&endDate=' + today +
                                    '&order=asc&volume=sum&nearby=1&type=daily',
                            type: "GET",
                            crossDomain: true,
                            success: function (data) {
                                that.$store.commit(that.namespace + '/setLoading', false);
                                console.log("data=", data);
                                // let symbol = data.results[0].symbol;
                                let temp = data.results.map(x => {
                                    let obj = {};
                                    obj.date = x.tradingDay;
                                    delete x.tradingDay;
                                    delete x.timestamp;
                                    delete x.symbol;
                                    obj.open = position * x.open;
                                    obj.high = position > 0 ? position * x.high : position * x.low;
                                    obj.low = position > 0 ? position * x.low : position * x.high;
                                    obj.close = position * x.close;
                                    obj.volume = x.volume;
                                    obj.openInterest = x.openInterest;
                                    return obj;
                                });
                                console.log("temp=", temp);
                                let parsedData = {};
                                parsedData.values = temp.reduce((obj, item) => {
                                    obj[item["date"].replace(/-/g, "")] = item;
                                    return obj;
                                }, {});

                                parsedData.title = spreadTitle(generalForm); // + "  (" + symbol + ")";
                                parsedData.units = spreadUnits(generalForm.selected[0]);
                                console.log("parsedData=", parsedData);
                                that.parsedData = JSON.parse(JSON.stringify(parsedData));

                                // am4charts.createChart(parsedData, generalForm, ["line", "ohlc", "candlestick"]);
                                //  programVue.$refs.chartref.createChart(parsedData, generalForm, ["line", "ohlc", "candlestick"]);

                            },
                            fail: function (data) {
                                console.log("ajax call failed.");
                                $("#progress").hide();
                                $("#button").show();
                                console.log(data);
                            }
                        });
                    }
                } else {
                    //   let identical = JSON.stringify(generalForm) === JSON.stringify(this.generalForm);
                    console.log("this.namespace =  ", this.namespace);
                    delete generalForm.browserSideOnly;
                    generalForm.generator = "BasicBarsGenerator";
                    generalForm.study = "basic";

                    console.log("generalForm=", generalForm);
                    let json = JSON.stringify(generalForm, null, 2);
                    if (selected.length > 0) {
                        var currentRequest = $.ajax({
                            url: this.$store.state.siteData.baseUrl + "/ControllerServlet2/",
                            type: "POST",
                            data: {"json": json},
                            beforeSend: function () {
                                console.log("beforeSend starting.");
                                if (currentRequest != null) {
                                    console.log("aborting previous request.");
                                    currentRequest.abort();
                                }
                            },
                            success: function (data) {
                                that.$store.commit(that.namespace + '/setLoading', false);
                                that.parsedData = JSON.parse(data);
                                console.log("that.parsedData=", that.parsedData);
                            }
                        });
                    }
                }
            }
        }
    };

</script>