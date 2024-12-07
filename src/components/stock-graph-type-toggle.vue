<template>
    <span :id="'stock-graph-type-toggle-'+namespace" style="padding: 1px; background-color: #e7edf5; width: fit-content"> 

        <b-form-select v-model="stockGraphType" :options="options" size="sm"
                       style="border: 1px solid gray; width: fit-content"></b-form-select>

    </span>
</template>

<script>

    export default {
        props: ['clickHandler', 'namespace'],
        mounted() {
          //  console.log("stock-graph-type-toggle.vue mounted() starting.");
        },
        data() {
            return {
                options: [
                    {value: 'line', text: 'line'},
                    {value: 'ohlc', text: 'ohlc'},
                    {value: 'candlestick', text: 'candlestick'}
                ]
            }
        },
        computed: {
            stockGraphType: {
                get() {
                    //  console.log("stockGraphType: get() starting.");
                    let temp = this.$store.state[this.namespace].stockGraphType;
                    // console.log("stockGraphType =", temp);
                    return temp;
                },
                set(stockGraphType) {
                    console.log("stockGraphType =", stockGraphType);
                    console.log("this.clickHandler =", this.clickHandler);
                    this.$store.commit(this.namespace + '/setStockGraphType', stockGraphType);
                  /*  console.log("this.$store.state[this.namespace].generator =", this.$store.state[this.namespace].generator);
                    if (this.$store.state[this.namespace].generator === "LongTermCandlesticksGenerator") {
                        genericFunction(this.clickHandler)(stockGraphType);
                    }*/
                }
            }
        }
    }
</script>
