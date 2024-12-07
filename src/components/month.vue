<template>
    <span> 
        <b-form-select style="width: auto; border-radius: 0px;"
                       size="sm"
                       v-bind:style="{color: $store.state.siteData.legColors[index], borderLeft: '0px solid gray'}"
                       v-model="month" :options="options"></b-form-select>

    </span>
</template>

<script>
    import {contractNameDecomposer, ConstrainSampleContract} from "@/js/main";

    export default {
        props: ['namespace', 'index'],
        computed: {
            commoditiesArray() {
                return JSON.parse(JSON.stringify(this.$store.getters["siteData/commoditiesArray"]));
            },
            month: {
                get() {
                    return this.$store.getters[this.namespace + "/m"][this.index];
                },
                set(month) {
                    let oldMonth = this.month;
                    if (month !== oldMonth) {
                        let year = contractNameDecomposer(this.$store.state[this.namespace].sampleContract[0]).year;
                       // console.log("month =", month);
                        let commodity = contractNameDecomposer(this.$store.state[this.namespace].sampleContract[this.index]).commoditySymbol;
                        let newSampleContractArray = this.$store.state[this.namespace].sampleContract.slice(0);
                        let newContract = commodity + year + month;
                       // console.log("newContract =", newContract);

                        newSampleContractArray[this.index] = newContract;

                        newSampleContractArray = ConstrainSampleContract(newSampleContractArray);
                        this.$store.commit(this.namespace + '/setSampleContract', newSampleContractArray);
                        this.$store.commit(this.namespace + '/setSelected', []);
                        this.$store.dispatch(this.namespace + '/getContractListsFromServer');
                    }
                }
            },
            options() {
                let commodity = this.$store.getters[this.namespace + "/c"][this.index];
               // console.log("commodity =", commodity);
               // console.log("this.commoditiesArray =", this.commoditiesArray);
                let monthObjects = this.commoditiesArray.find(x => x.symbol === commodity).months;

                return monthObjects.sort((a, b) => (a.symbol > b.symbol) ? 1 : -1).map(x => {
                    return {value: x.symbol, text: x.name};
                });
            },
            monthObjects: function () {
                // console.log("monthObjects() starting.");
                let commodity = this.$store.getters[this.namespace + "/c"][this.index];
                let commodityObject = this.commoditiesArray.find(x => x.symbol === commodity)[commodity];
                return commodityObject.months;
            }
        }
    }
</script>
