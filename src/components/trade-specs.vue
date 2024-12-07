<template>
    <div>

   <!--   <b-button v-if="program !== 'Calculator'" v-b-modal.period_popup size="sm" style="font-weight: bold; margin: 0 0px 0 0px;
                 border: 1px solid gray; color: black; background-color: #ffdf00">
         period
        </b-button> -->

         <table :id="'trade-specs-'+namespace" colspan="2" style="margin: 0 0 2px 0; background-color: #ffdf00;  border: 1px solid gray">   
            <tr>
                <td v-if="program !== 'Calculator'">
                    <toggle-single-throw v-bind:namespace="namespace" v-bind:property="'showTradingPeriod'" :id="'show-trading-period-'+namespace"
                        v-bind:label="showTradingPeriod ? 'hide' : 'show'" style="margin: 0px"></toggle-single-throw>
                </td>
                <td>
                    <b-form-group label="" v-slot="{ ariaDescribedby }" style="margin: 0 10px -3px 0px;  padding: 0 0 1px 0; font-weight: bold;">
               <!--   <b-form-radio-group
                    id="radio-group-1"
                    v-model="buySell"
                    :options="options"
                    :aria-describedby="ariaDescribedby"
                    name="radio-options"
                    size="sm"></b-form-radio-group> -->

                        <b-form-select v-model="buySell" :options="options" :id="'buy-sell-'+namespace" size="sm"
                               style="border:1px solid gray; margin: 0 0 2px 0;" >
                        </b-form-select>
                    </b-form-group>  
                </td>                
                <td :id="'open-close-selector-'+namespace">    
                    <open-close-selector-no-year v-if="program === 'Calculator'" v-bind:namespace="namespace"
                                 style="width: 100%; margin: -2px 0 -2px 0"></open-close-selector-no-year>
                                 
                    <open-close-selector v-if="program !== 'Calculator'" v-bind:namespace="namespace" style=""></open-close-selector>
                </td>
                </tr>
                </table>

    </div>
</template>

<style scoped>
table {
    border-collapse: separate;
    border-radius: 3px;
}
</style>

<script>
    import openCloseSelector from '@/components/open-close-selector';
    import openCloseSelectorNoYear from '@/components/open-close-selector-no-year';
    import toggleSingleThrow from '@/components/toggle-single-throw';

    export default {
        components: {
            openCloseSelector, openCloseSelectorNoYear, toggleSingleThrow
        },
        mounted() {
          // console.log("trade-specs.vue mounted() starting.");
           // console.log("this.namespace=", this.namespace);
        },
        props: ['namespace', 'title'],
        data() {
            return {
                selected: 'first',
                options: [
                    {text: 'buy', value: 'buy'},
                    {text: 'sell', value: 'sell'}
                ]
            }
        },
        computed: {
            program(){
                return this.$store.state[this.namespace].program;
            },
            buySell: {
                get() {
                    return this.$store.state[this.namespace].buySell;
                },
                set(buySell) {
                    this.$store.commit(this.namespace + '/setBuySell', buySell);
                }
            },
            showTradingPeriod: {
                get(){
                    return this.$store.state[this.namespace].showTradingPeriod;
                },
                set(showTradingPeriod){
                    this.$store.commit(this.namespace + '/setShowTradingPeriod', showTradingPeriod);
                }
            }
        }
    }
</script>

