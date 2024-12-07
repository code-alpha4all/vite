<template>

    <table v-if="contract.length > 0" border="0" cellpadding="3x" id="quotes">
        <tr>
            <th style="text-align: center;">Contract</th>
            <th style="text-align: center;">Last</th>
            <th style="text-align: center;">Change</th>
            <th style="text-align: center;">Open</th>
            <th style="text-align: center;">High</th>
            <th style="text-align: center;">Low</th>
            <th style="text-align: center;">Volume</th>
            <th style="text-align: center;">Open Interest</th>
        </tr>
        <tr v-for="n in contract" :key="n.contracts" style="white-space: nowrap;">
            <td style="textAlign: center"><a v-bind:href="n.url">{{n.contract}}</a></td>
            <td style="textAlign: left"><a v-bind:href="n.url">{{n.last}}</a></td>
            <td  v-bind:style="[n.change < 0 ? {color: 'red'} : {color: 'black'}]" style="textAlign: left"><a v-bind:href="n.url">{{n.change}}</a></td>
            <td style="textAlign: left"><a v-bind:href="n.url">{{n.open}}</a></td>
            <td style="textAlign: left"><a v-bind:href="n.url">{{n.high}}</a></td>
            <td style="textAlign: left"><a v-bind:href="n.url">{{n.low}}</a></td>
            <td style="textAlign: right"><a v-bind:href="n.url">{{n.volume}}</a></td>
            <td style="textAlign: right"><a v-bind:href="n.url">{{n.openInterest}}</a></td>
        </tr>
    </table>  

</template>

<script>
    import $ from "jquery";
    import {getCommoditiesObject} from '../js/main';

    export default {
        mounted: function () {
            console.log("quotesVueModel starting.");
            this.getQuotes();
        },
        data: function () {
            return {
                contract: [],
                commodity: "NG"
            }
        },
        methods: {
            getQuotes: function () {
                let quoteState =
                        {
                            "sampleContract": ["W2020Z", "RB2021H", "C2020U", "C2020Z"],
                            "legs": 1,
                            "generator": "QuotesGenerator",
                            "language": "en",
                            user: "A4A-user0",
                            password: "M1-K8xQgmR",
                            chartParameters: {},
                            search: {}
                        };

                this.contract = [];
                let months = Object.keys(getCommoditiesObject()[this.commodity].months);
                console.log("months=", months);
                let year = new Date().getFullYear();
                let contract = this.commodity + year + months[0];
                console.log("contract=", contract);
                let sampleContract = this.$store.state.generalForm.sampleContract;
                sampleContract[0] = contract;
                this.$store.commit('generalForm/setSampleContract', sampleContract);

                let url = "https://danscarr.com/ControllerServlet2";
                let that = this;
                $.ajax({
                    url: url,
                    type: "POST",
                    data: {"json": JSON.stringify(quoteState, null, 2)},
                    success: function (data) {
                        // console.log("data=", data);
                        //console.log("JSON.parse(data).unit=", JSON.parse(data).unit);
                        if (JSON.parse(data).unit === "Unauthorized.") {
                            alert("Unauthorized.");
                        } else {
                            let values = JSON.parse(data).values.map;
                            console.log("values=", values);

                            Object.keys(values).forEach(function (key) {
                                // console.log("key=", key, " values[key]=", values[key].currentBar);
                                let obj = {};
                                obj.contract = key;
                                obj.last = values[key].currentBar.last;
                                obj.change = values[key].currentBar.change;
                                obj.open = values[key].currentBar.open;
                                obj.high = values[key].currentBar.high;
                                obj.low = values[key].currentBar.low;
                                obj.close = values[key].currentBar.close;
                                obj.volume = values[key].currentBar.volume;
                                obj.openInterest = values[key].currentBar.openInterest;
                                that.contract.push(obj).currentBar;
                            });

                            // console.log("result=", result);
                            //  that.contract = Object.keys(values);
                        }
                    },
                    fail: function (data) {
                        console.log("call failed.");
                        console.log(data);
                    }
                });
            }
        }
    }
</script>
