<template>
    <b-container fluid style="width: auto; margin-bottom: 0px; background-color: white; ">
        <b-row
            align-h="start"
            align-v="start"
            class="row no-gutters"
            style=" background-color: white; padding-bottom: 1px"
            >
            <b-col>
                <span
                    class="font-size-18 font-weight-bold text-uppercase"
                    v-bind:style="{color: color}"
                    style="margin-right: 10px"
                    >{{group}}</span>

                <span class="font-size-16 font-weight-normal" style="margin-right: 10px; color: black">
                    <label style="margin-right:3px; font-weight: bold">entry price:</label>
                    {{entryPrice}}
                </span>

                <label style="margin-right:3px; font-weight: bold">P/L:</label>
                <span
                    class="font-size-16 font-weight-normal"
                    style="margin-right: 10px; color: black"
                    v-bind:style="{color: equity.color}"
                    >{{equity.value}}</span>
            </b-col>
        </b-row>
    </b-container>
</template>
<script>
    import {spreadDigits} from "../js/main";
    export default {
        props: ['namespace', 'group', 'dailyClose'],
        data: function () {
            return {
                triggered: false
            }
        },
        computed: {
            color() {
                let colors = [
                    {group: "bronze", color: "orange"},
                    {group: "silver", color: "silver"},
                    {group: "gold", color: "gold"}
                ];
                return colors.find(x => x.group === this.group).color;
            },
            entryPrice() {
                let levels = this.$store.state[this.namespace].chartParameters.levels;
                let level = levels.find(x => x.name.includes(this.group));
                console.log("level=", level);
                if(typeof level !== 'undefined'){
                     let digits=this.$store.state[this.namespace].instrument === "stock" ? 2 : spreadDigits(this.$store.state[this.namespace].selected[0], "future");
                    console.log("digits=", digits);

                    let price = ((parseFloat(level.from) + parseFloat(level.to)) / 2.0).toFixed(digits);
                    return price;
                } else {
                    return null;
                }
            },
            equity() {
                // console.log("this.dailyClose=", this.dailyClose);
                if (this.triggered && typeof this.dailyClose !== 'undefined' && this.dailyClose !== null && this.dailyClose !== "-") {
                    let buySellFactor = this.buySell === "buy" ? 1 : -1;
                    //  console.log("buySellFactor=", buySellFactor);

                    let value = this.$store.state[this.namespace].instrument === "future" ? buySellFactor * (this.dailyClose - this.entryPrice) * this.$store.state[this.namespace].unitMove[0] : buySellFactor * (this.dailyClose - this.entryPrice);

                    let formattedValue = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(value);
                    let color = value < 0 ? 'red' : 'black'
                    return {value: formattedValue, color: color};
                } else {
                    return {value: "-", color: "black"};
                }
            },
            buySell() {
                return this.$store.state[this.namespace].buySell;
            },
            entryType() {
                return this.$store.state[this.namespace].chartParameters.entryType;
            }
        },
        watch: {
            dailyClose: function (dailyClose) {
               /* console.log("watch dailyClose=", dailyClose, ", this.buySell=", this.buySell, "this.entryType=",
                 this.entryType, ", this.entryPrice=", this.entryPrice, ", this.triggered=", this.triggered); */
                if (!this.triggered && !dailyClose !== "-") {
                    if ((this.buySell === "buy" && dailyClose >= this.entryPrice && this.entryType === "stop") ||
                    (this.buySell === "buy" && dailyClose <= this.entryPrice && this.entryType === "limit") ||
                    (this.buySell === "sell" && dailyClose <= this.entryPrice && this.entryType === "stop") ||
                    (this.buySell === "sell" && dailyClose >= this.entryPrice && this.entryType === "limit")){
                        this.triggered = true;
                    }
                }
            },
            buySell: function (buySell) {
                console.log("watch buySell = ", buySell);
                this.triggered = false;
            }
        },
    }
</script>
<style lang="scss" module>
    /*@import "./style.module.scss"; */
</style>
