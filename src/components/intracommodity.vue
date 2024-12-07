<template>
    <span v-if="$store.state[namespace].legs > 1 && $store.state[namespace].generator !== 'PercentProfitableMapGenerator'">

        <b-form-select v-model="intracommodity" :options="options" 
        size="sm"
        @change="changeIntracommodity"
        style="border:1px solid gray; width: auto;"></b-form-select>

    </span>
</template>

<script>
    export default {
        mounted() {
           // console.log("intracommodity.vue starting.");
        },
        props: ['namespace'],
        data() {
            return {
                options: [
                    {value: true, text: 'intracommodity'},
                    {value: false, text: 'intercommodity'}
                ]
            }
        },
        methods: {
            changeIntracommodity(intracommodity) {
               // console.log("changeIntracommodity() starting.");
                this.$store.commit(this.namespace + '/setIntracommodity', intracommodity);

                let commodityArray = this.$store.getters[this.namespace + "/c"];
                const allTheSame = commodityArray.every(x => x === commodityArray[0]);
               // console.log("allTheSame=", allTheSame);

                if (intracommodity && !allTheSame) {
                    let commodity = this.$store.getters[this.namespace + '/c'][0];
                    this.$store.dispatch(this.namespace + '/changeCommodityLeg', {commodity: commodity, index: null});
                }
            }
        },
        computed: {
            intracommodity: {
                get() {
                   // console.log("intracommodity.get() starting.");
                    return this.$store.state[this.namespace].intracommodity;
                },
                 set() {
                    // The following statement gets called during initialization and causes problems.
                }
            }
        }
    }
</script>
