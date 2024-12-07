<template>

    <b-dropdown ref='tradeSpecsDropdown' :toggle="true" variant="transparent "
                v-bind:namespace="namespace" 
                style="height: 31px; background-color: #ffdf00; border: 1px solid gray; border-radius: 4px;"
                @hide='handleHide($event)' @hidden='isCloseable=false'>
        <!-- named slot -->
        <template #button-content>
            <!-- dropdown container trigger -->
            <span style="color: black; font-weight: bold; position: relative; bottom: 3px; margin: -4px 0 4px 0;">trade specs</span>
        </template>


            <table border=0 style="font-weight: normal; border: 0 solid gray; color: black; margin: 0 11px 0 0px;
                     padding: 1px 0 1px 0; width: 100%">
            
            <tr>
                 <td v-if="program !== 'Calculator'" style="padding: 0 10px 0 4px; white-space: nowrap">
                    <b-form-checkbox
                         v-model="showTradingPeriod"
                         name="checkbox-1"
                         :value="true"
                         :unchecked-value="false">
                          show period
                    </b-form-checkbox>
               
                 <!--   <b-form-group label="" v-slot="{ ariaDescribedby }" v-if="showTradingPeriod || showPlaybackControl || program === 'Calculator'"
                            style="margin: 20px 1px 2px 5px; font-weight: bold;"> -->
                  <b-form-group label="" v-slot="{ ariaDescribedby }" style="margin: 0px 1px 0px 0px; font-weight: bold;">
                  <b-form-radio-group
                    id="radio-group-1"
                    v-model="buySell"
                    :options="options"
                    :aria-describedby="ariaDescribedby"
                    name="radio-options"
                    size="sm"
                    style="white-space: nowrap"></b-form-radio-group>
                  </b-form-group>
                </td>     
         
                <td style="padding: 3px 2px 0px 2px">       
                    <open-close-selector v-bind:namespace="namespace" style=""></open-close-selector>
                </td>

                <td>
                    <b-dropdown-item @click='closeMe()' style="border: 1px solid gray; border-radius: 4px; margin: 3px 3px 0 0;
                        background-color: lightblue; color: white">Close</b-dropdown-item>
                </td>
            </tr>
        </table>
            

    </b-dropdown>  

</template>

<script>
    import openCloseSelector from '@/components/open-close-selector';

    export default {
        components: {
            openCloseSelector
        },
        props: ['namespace'],
        data() {
            return {
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
            },
        },
        methods: {
            handleHide(bvEvent) {
                if (!this.isCloseable) {
                    bvEvent.preventDefault();  
                } else {
                    this.$refs.tradeSpecsDropdown.hide();
                }
            },
            closeMe() {
                this.isCloseable = true;
                this.$refs.tradeSpecsDropdown.hide();
            }
        }
    }
</script>
