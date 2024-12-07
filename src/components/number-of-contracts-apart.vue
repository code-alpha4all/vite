<template>
    <span  style="font-weight: bold">
                        <span style="padding: 7px 2px 0 5px; font-weight: bold;"> 
    number of contracts of separation:
    </span>
    <span style=" color: black">
        <b-form-select size="sm" style="border:1px solid gray; width: auto"
                       v-model="numberOfContractsApart" :options="options"></b-form-select> 
    </span>
    </span>
</template>

<script>
    import {commodityMonths} from "@/js/main";

    export default {
        props: ['namespace'],
        computed: {
            options() {
                let commodity = this.$store.getters[this.namespace + '/c'][0];
                let numberOfMonths = commodityMonths(commodity).length;
                let temp = Array(numberOfMonths + 1).fill()
                        .map((x, i) => {
                            return {value: i, text: i};
                        });
                return temp;
            },
            numberOfContractsApart: {
                get() {
                    return this.$store.state[this.namespace].numberOfContractsApart;
                },
                set(numberOfContractsApart) {
                    console.log("numberOfContractsApart.set() starting. numberOfContractsApart=", numberOfContractsApart);
                    this.$store.commit(this.namespace + '/setNumberOfContractsApart', numberOfContractsApart);
                }
            }
        }
    }
</script>
