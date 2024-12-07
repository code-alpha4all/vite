<template>
    <span>
        <b-form inline align-h="start"  style=" background-color: white; margin-bottom: 2px; width: min-content; margin-left: -11px;
           margin-right: 5px; border: 1px solid gray; padding: 2px; white-space: nowrap; background-color: #e7edf5; border-radius: 3px;">
            <b-col md="auto"> 
                <legs v-bind:max="2" v-bind:namespace="namespace" :id="'stock-legs-'+namespace" 
                    style=" margin-left: -10px; margin-right: 15px; padding-top: 2px"></legs>              

                <b-button-group  md="auto" v-for="n in $store.state[namespace].legs" v-bind:key="n">  

                    <span v-if="n === 2" style="font-weight: bold; font-size: 1.3rem; margin: 5px 11px 0 -7px">-</span>
                    <span :id="'stock-mult'+n+'-'+namespace">
                        <mult v-bind:namespace="namespace" v-bind:index="n-1" style="width: 45px; margin: 2px 3px 0px 1px;
                            border: 1px solid gray; border-radius: 3px;">
                        </mult>
                    </span>
                    
                    <span style="padding: 9px 3px 0 0; font-weight: bold;"> share<span v-if="mult[n-1] > 1">s</span> of</span>

                    <stock-auto-complete v-bind:index="n-1" v-bind:namespace="namespace" style="border: 1px solid gray; margin-right: 20px"></stock-auto-complete>
                     
                </b-button-group >
                     
            </b-col>
        </b-form>

    </span>
</template>

<script>
    import mult from '@/components/mult.vue';
   // import position from '@/components/position.vue';
    import legs from '@/components/legs';
    import stockAutoComplete from '@/components/stock-auto-complete';


    export default {
        components: {
            legs, stockAutoComplete, mult
        },
        mounted() {
           console.log("stock-box.vue mounted() starting. this.namespace=", this.namespace);
        },
        props: ['namespace'],
        data: function () {
            return {
                oldStockArray: []
            };
        },
        computed: {
            mult() {
                return this.$store.state[this.namespace].mult;
            }
        }
    }
</script>

