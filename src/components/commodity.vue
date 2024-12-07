<template>
    <span>
    <b-form-select style="border: 0px solid gray; width: 100%; border-radius: 0px; width: auto"
                   size="sm"
                   v-bind:disabled="disabled"
                   @change="changeCommodity"
                   v-bind:style="[{backgroundColor: null, color: $store.state.siteData.legColors[index], borderLeft: '0px solid gray'}]"
                   v-model="commodity" :options="options"></b-form-select>

</span>
</template>

<script>

    export default {
        mounted() {
          //  console.log("commodity.vue mounted() starting.");
          //  console.log("this.namespace=", this.namespace);
        },
        props: ['namespace', 'index'],
        methods: {
            changeCommodity(commodity) {
                console.log("changeCommodity() starting.");
                this.$store.dispatch(this.namespace + '/changeCommodityLeg', {commodity: commodity, index: this.index});
                // updateChart();
            }
        },
        computed: {
           commodity: {
                get() {
                    return this.$store.getters[this.namespace + "/c"][this.index];
                },
                set() {
                    // The following statement gets called during initialization and causes problems.
                    // this.$store.dispatch(this.namespace + '/changeCommodityLeg', {commodity: commodity, index: this.index});
                }
            },
            options() {
                return this.$store.getters["siteData/commoditiesArray"].map(x => {
                    return {value: x.symbol, text: x.name};
                });
            },
            disabled() {
                // console.log("disabled() starting.");
                let disabled = JSON.parse(this.$store.state[this.namespace].intracommodity) && (this.index > 0);
                return disabled;
            }/*,
             tooltip() {
             console.log("tooltip starting. subscriber: " + subscriber);
             let returnString = "";
             if (subscriber == "false") {
             returnString = aLangKeys[language]['Limited_Set'];
             }
             return returnString;
             }*/
        }
    }
</script>
