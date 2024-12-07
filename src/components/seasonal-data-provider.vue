<template>
    <div>
        <slot :seasonalData="seasonalData"></slot>
    </div>
</template>

<script>

    import $ from "jquery";
    //import moment from 'moment';
    import {} from "../js/main";
    export default {
        mounted() {
            console.log("seasonal-data-provider.vue starting.");
            this.getSeasonalData();
        },
        props: ['namespace'],
        data: function(){
            return {
                seasonalData: {}
            };
        },
        computed: {
            ticker() {
                return this.$store.getters[this.namespace + "/ticker"];
            },
            seasonals() {
                return this.$store.state[this.namespace].seasonals;
            }
        },
        watch: {
            ticker: function (newTicker, oldTicker) {
                console.log("newTicker=", newTicker, " oldTicker=", oldTicker, " namespace=", this.namespace);
                this.getSeasonalData();
            },
            seasonals: function (newSeasonals, oldSeasonals) {
                console.log("newSeasonals=", newSeasonals, " oldSeasonals=", oldSeasonals, " namespace=", this.namespace);
                this.getSeasonalData();
            }
        },
        methods: {
            getSeasonalData: function () {
                console.log("getSeasonalData() starting.");
                this.$store.commit(this.namespace + '/setLoading', true);

                let generalForm = this.$store.state[this.namespace];
                var json = JSON.stringify(generalForm, null, 2);
                console.log("generalForm=", generalForm);
                var that = this;
                $.ajax({
                    url: that.$store.state.siteData.baseUrl + that.$store.state.siteData.contextName + "/StandardSeasonalsServlet",
                    type: "POST",
                    data: {"requestJson": json},
                    success: function (data) {
                        // console.log("data=", data);
                        let parsedData = JSON.parse(data);
                        console.log("seasonal parsedData=", parsedData);

                        that.seasonalData = parsedData;
                        /*  let selected = generalForm.selected[0];
                         let seasonals = generalForm.seasonals.slice();
                         console.log("seasonals=", seasonals);
                         
                         if (typeof parsedData.dataset !== 'undefined') {
                         let returnedSeasonals = parsedData.dataset.map(x => parseInt(x.split('-')[0]));
                         console.log("returnedSeasonals=", returnedSeasonals);
                         let newSeasonals = [];
                         let addSeries = false;
                         if (returnedSeasonals[0] < years) {
                         console.log("Some seasonals not available.");
                         //  programVue.$store.commit('browserSideOnly/setMinUnreturnedSeasonal', years);
                         newSeasonals = seasonals.filter(x => x !== years);
                         // .push(returnedSeasonals[0]).sort();
                         
                         if (seasonals.length === newSeasonals.length) {
                         addSeries = true;
                         }
                         console.log("newSeasonals=", newSeasonals);
                         //  programVue.$store.commit('generalForm/setSeasonals', newSeasonals);
                         } else {
                         //  newSeasonals = seasonals;
                         addSeries = true;
                         }
                         
                         let digits = 1 + spreadDigits(selected);
                         
                         console.log("addSeries=", addSeries);
                         if (addSeries && parsedData.values !== "none") {
                         console.log("mainParsedData.seasonal=", mainParsedData.seasonal);
                         if (typeof mainParsedData.seasonal.dataset === "undefined") {
                         mainParsedData.seasonal = {};
                         mainParsedData.seasonal.dataset = [];
                         mainParsedData.seasonal.values = [];
                         }
                         mainParsedData.seasonal.dataset.push(parsedData.dataset[0]);
                         mainParsedData.seasonal.dataset = [...new Set(mainParsedData.seasonal.dataset)];
                         console.log("mainParsedData.seasonal.dataset=", mainParsedData.seasonal.dataset);
                         console.log("mainParsedData.seasonal.values=", mainParsedData.seasonal.values);
                         
                         let additionalSeasonalDataArray = Object.keys(parsedData.values).map(date => {
                         //  console.log(date, ":  ", parsedData.values[date]);
                         return {
                         date: moment(parseInt(date), "YYYYMMDD").format("YYYY-MM-DD"),
                         [years]: parseFloat(parsedData.values[date][years].toFixed(digits))
                         }
                         }).filter(x => !isNaN(x[years]));
                         // console.log("additionalSeasonalDataArray=", [...additionalSeasonalDataArray]);
                         
                         let concatenatedSeries = [...mainParsedData.seasonal.values, ...additionalSeasonalDataArray];
                         //console.log("concatenatedSeries=", concatenatedSeries);
                         
                         let uniqueDates = [...new Set(concatenatedSeries.map(x => x.date))].sort();
                         // console.log("uniqueDates=", uniqueDates);
                         
                         let combinedSeries = uniqueDates.map(date => (
                         concatenatedSeries.filter(x => x.date == date)
                         .reduce((combinedBar, bar) => ({...combinedBar, ...bar}), {})
                         ));
                         // console.log("combinedSeries=", combinedSeries);
                         
                         mainParsedData.seasonal.values = combinedSeries;
                         console.log("mainParsedData=", mainParsedData);
                         }
                         }*/
                    },
                    fail: function (data) {
                        console.log("ajax call failed.");
                        $("#progress").hide();
                        $("#button").show();
                        console.log(data);
                    }
                });

            }
        }
    };

</script>