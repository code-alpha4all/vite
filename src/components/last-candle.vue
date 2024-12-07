<template>

    <b-input style="width: 55px; border: 0px solid gray; text-align: right; border-radius: 0px"
              size="sm"
              v-model.number="mult" 
              v-bind:style="program !== 'StockCharts' ? {color: $store.state.siteData.legColors[index]} : ''">
    </b-input>

</template>

<script>
    module.exports = {
        beforeMount: function () {
            // console.log("mult.vue starting. index=", this.index, "  mult=", this.mult);
        },
        props: ['namespace', 'index'],
        computed: {
            mult: {
                get() {
                    return this.$store.state[this.namespace].mult[this.index];
                },
                set(mult) {
                    // console.log("mult=", mult);
                    // console.log("typeof mult=", typeof mult);

                    if (mult !== "") {
                        let newArray = this.$store.state[this.namespace].mult.slice(0);
                        newArray[this.index] = mult;
                        this.$store.commit(this.namespace + '/setMult', newArray);
                        this.$store.commit(this.namespace + '/chartParameters/setPage', 1);
                        // updateChart();
                    }
                }
            },
            program(){
                return this.$store.state[this.namespace].program;
            }
        }
    }
</script>
