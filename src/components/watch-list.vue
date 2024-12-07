<template>
    <b-container fluid style="width: auto;">
        <b-form-row align-h="start" style="">
            <b-col md="auto">  
                <b-form-select size="sm" :select-size="48" @change="selectTicker" v-b-toggle.sidebar-1
                               :options="watchList">
            </b-form-select>

            <page-selector></page-selector>

            <div id="chartdiv" style="width: 100%; border: 0px solid gray; margin-top: 0px; padding: 0px; background-color: white">
                <chart-table ref="chart_table"></chart-table>
            </div>
        </b-col>
    </b-form-row>
</b-container>
</template>

<script>
    module.exports = {
        beforeMount: function () {
            console.log("watch-list.vue beforeMount() starting.");
            this.getWatchList();
        },
        computed: {
            watchList() {
                let watchlist = this.$store.state.generalForm.watchList.map(x => {
                    return {value: x.ticker, text: x.ticker};
                });
                return watchlist;
            }
        },
        methods: {
            selectTicker(ticker) {
                console.log("selectTicker() starting. ticker=", ticker);
                console.log("watchList=", this.$store.state.generalForm.watchList);
                let index = this.$store.state.generalForm.watchList.map(x => x.ticker).indexOf(ticker);
                console.log("index=", index);
                let chartsPerPage = this.$store.state.generalForm.chartParameters.chartsPerRow * this.$store.state.generalForm.chartParameters.rowsPerPage;
                let page = 1 + Math.floor(index / chartsPerPage);
                this.$store.commit("generalForm/chartParameters/setPage", page);
            },
            getWatchList() {
                console.log("getWatchList() starting.");
                let that = this;
                $.ajax({
                    url: "https://app.charts.alpha4all.it/trade_explorer.php?Service=Explorer&Action=Get&SecureCode=@fpnr3bu5b3lud3",
                    type: "GET",
                    crossDomain: true,
                    success: function (data) {
                        let  watchlistData = JSON.parse(data).Explorer;
                        console.log("watchlistData=", watchlistData);
                        let tickers = watchlistData.filter(x => x !== "")
                                .sort((a, b) => (a.ticker > b.ticker) ? 1 : -1);
                        // console.log("tickers=", tickers);
                        that.$store.commit('generalForm/setWatchList', tickers);
                        that.$store.commit('generalForm/chartParameters/setNumberOfCharts', tickers.length);

                        //   $("#chartdiv").empty();
                        //  $("#chart-table").empty();

                        var watchList = programVue.$store.state.generalForm.watchList.slice(0);
                        let generalFormArray = watchList.map(form => {
                            form.sampleContract = form.selected[0].replace(/\s/g, '').split('/');
                            form.legs = form.sampleContract.length;
                            form.user = "A4A-user0";
                            form.password = "M1-K8xQgmR";
                            form.generator = "BasicBarsGenerator";
                            form.study = "basic";
                            form.chartParameters = {};
                            form.chartParameters.verticalScrollbar = true;
                            let newForm = Object.assign(JSON.parse(JSON.stringify(programVue.$store.state.generalForm)), form);
                            delete newForm.watchList;
                            // console.log("form=", form);
                            return newForm;
                        })/*.filter(x => {
                         console.log("x.selected[0]=", x.selected[0]);
                         isSpreadInDatabase(x.selected[0])
                         })*/;
                        console.log("generalFormArray=", generalFormArray);

                        function ajax(form) {
                            console.log("ajax() starting.");
                            let json = JSON.stringify(form, null, 2);
                            let url = baseUrl + "ControllerServlet2";
                            return   currentRequest = $.ajax({
                                url: url,
                                type: "POST",
                                data: {"json": json},
                                success: function (data) { },
                                fail: function (data) {
                                    console.log("ajax call failed.");
                                    $("#progress").hide();
                                    $("#button").show();
                                    console.log(data);
                                }
                            });
                        }

                        (function waitForElement() {
                            if (typeof programVue.$refs.chart_table !== "undefined") {
                                //variable exists, do what you want
                                console.log("programVue.$refs.chart_table=", programVue.$refs.chart_table);
                                programVue.$refs.chart_table.setGeneralFormArray(generalFormArray, ajax);
                            } else {
                                console.log("programVue.$refs.chart_table=", programVue.$refs.chart_table);
                                setTimeout(waitForElement, 100);
                            }
                        })();

                        $("#progress").hide();
                        $("#button").show();
                    }
                });
            }
        },
        components: {
            'chart-table': httpVueLoader('https://scarrtrading.nyc3.digitaloceanspaces.com/FormElements-V3/chart-table.vue')
        }
    }
</script>
