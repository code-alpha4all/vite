<template>
    <div :id="'trade-statistics-'+namespace">
        <table border="0" style="width: 100%; color: black; font-size: 10.5px" >
            <!--   <tr>
                   <td style="text-align: center;  padding: 3px 10px 3px 10px;">ticker</td>
                   <td colspan="2" style="color: red">{{ticker}}</td>
               </tr> -->
            <tr style="font-weight: bold; background-color: #e7edf5">  
                <td style="text-align: center; width: 70px">open</td>
                <td style="text-align: center; width: 70px">close</td>
                <td style="text-align: center; width: 48px">avg days</td>
                <td v-bind:style="{backgroundColor: avgChange < 0 ? 'red' : 'black' }" style="text-align: center;  color: white;  width: 75px">equity change</td>
                <td v-bind:style="{backgroundColor: avgChange < 0 ? 'red' : 'black' }" style="text-align: center;  color: white; width: 50px">appd</td>
                <td style="text-align: center; width: 40px">% prof.</td>
                <td style="text-align: center; width: 70px ">avg mae</td>
                <td style="text-align: center; ">worst mae</td>
                <td style="text-align: center; width: 70px">avg mpe</td>
                <td style="text-align: center; ">best mpe</td>
            </tr>

            <tr style=" padding: 3px 10px 3px 10px">
                <td style="padding-top: 1px; text-align: center;   white-space: nowrap">{{open}}</td>
                <td style="padding-top: 1px; text-align: center;   white-space: nowrap">{{close}}</td>
                <td style="padding-top: 1px; text-align: center;  ">{{avgDays}}</td>
                <td style="padding-top: 1px; text-align: center;  " v-bind:style="{color: avgChange < 0 ? 'red' : 'black' }">{{displayMoneyFormat(avgChange)}}</td>
                <td style="padding-top: 1px; text-align: center;  " v-bind:style="{color: avgAppd < 0 ? 'red' : 'black' }">{{displayMoneyFormat(avgAppd)}}</td>
                <td style="padding-top: 1px; text-align: center;  ">{{percentUp}}%</td>
                <td style="padding-top: 1px; text-align: center; color: red ">{{avgMinDisplay}}</td>
                <td style="padding-top: 1px; text-align: center; color: red ">{{worstMinDisplay}}</td>
                <td style="padding-top: 1px; text-align: center;  ">{{avgMaxDisplay}}</td>
                <td style="padding-top: 1px; text-align: center;  ">{{bestMaxDisplay}}</td>
            </tr>
        </table>
    </div>
</template>

<style scoped>
td{
    border-right: 1px solid gray;
    border-top: 1px solid gray;
    border-bottom: 1px solid gray;
}
</style>

<script>

    import moment from 'moment';
    import {displayMoneyFormat} from "@/js/main";

    export default {
        mounted: function () {
           // console.log("trade-statistics.vue mounted() starting.");
        },
        props: ['namespace'],
        data: function () {
            return {
                open: null,
                close: null,
                numberOfTrades: null,
                percentUp: null,
                percentDown: null,
                avgAppd: null,
                avgChange: null,
                avgMax: 0,
                bestMax: 0,
                avgMin: 0,
                worstMin: 0,
                avgDays: null
            }
        },
        computed: {
            avgMaxDisplay(){
              //  console.log("this.avgMax=", this.avgMax);
                return isNaN(this.avgMax) ? "------" : '$'+Math.abs(this.avgMax.toFixed(0)).toLocaleString("en-US");
            },
            bestMaxDisplay(){
                return isNaN(this.bestMax) ? "------" : '$'+Math.abs(this.bestMax.toFixed(0)).toLocaleString("en-US");
            },
            avgMinDisplay(){
                return isNaN(this.avgMin) ? "------" : '-$'+Math.abs(this.avgMin.toFixed(0)).toLocaleString("en-US");
            },
            worstMinDisplay(){
                return isNaN(this.worstMin) ? "------" : '-$'+Math.abs(this.worstMin.toFixed(0)).toLocaleString("en-US");
            }
        },
        methods: {
            customToFixed: function (number) {
               // console.log("number=", number);
                let returnValue;
                if (isNaN(number) || null == number) {
                    // console.log("missing data.");
                    returnValue = "\u00A0\u00A0------\u00A0\u00A0 ";
                } else {
                    returnValue = number.toFixed(this.digits);
                }
                // console.log("returnValue=", returnValue);
                return returnValue;
            },
            displayNumberFormat(number){
                new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 0 }).format(number)
            },
            displayMoneyFormat(number){
                return displayMoneyFormat(number);           
            },
            setStatistics: function (tradeStatistics) {
               // console.log("tradeStatistics=", {...tradeStatistics});
                // this.numberOfTrades = 0;
              
                if (Object.keys(tradeStatistics).length > 2) {
                    this.open = moment(tradeStatistics.open, "YYYY-MM-DD").format("MMM D, YYYY");
                    this.close = moment(tradeStatistics.close, "YYYY-MM-DD").format("MMM D, YYYY");
                    this.upNumber = 0;
                    this.avgDays = tradeStatistics.avgDays.toFixed(2);
                    this.percentUp = tradeStatistics.percentUp;
                    this.percentDown = tradeStatistics.percentDown;
                    this.avgChange = tradeStatistics.avgChange;
                    this.avgAppd = tradeStatistics.avgChange / tradeStatistics.avgDays;
                    this.avgMin = tradeStatistics.avgMin;
                    this.worstMin = tradeStatistics.worstMin;
                    this.avgMax = tradeStatistics.avgMax;
                    this.bestMax = tradeStatistics.bestMax;
                } else {
                    this.open = tradeStatistics.open === null ? "------" : moment(tradeStatistics.open, "YYYY-MM-DD").format("MMM D, YYYY");
                    this.close = tradeStatistics.close === null ? "------" : moment(tradeStatistics.close, "YYYY-MM-DD").format("MMM D, YYYY");
                    this.upNumber = "---";
                    this.avgDays = "-----";
                    this.percentUp = "----";
                    this.percentDown = "----";
                    this.avgChange = "----";
                    this.avgAppd = "----";
                    this.avgMin = "----";
                    this.worstMin = "----";
                    this.avgMax = "----";
                    this.bestMax = "----";
                }
            }
        }

    }
</script>
