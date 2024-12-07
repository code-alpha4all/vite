<template>
    <div v-if="legs > 1 || ['BasicCharts', 'BasicChartsNew', 'LongTermCharts'].includes(program)" style="text-align: center; color: white; background-color: black;
                     font-weight: normal; padding: 0px 1px 1px 1px;
         width: auto; border-radius: 3px;"
         v-bind:style="borderStyle">
        <div v-if="$store.state[namespace].legs > 1" style="padding: 1px; text-align: center;">                                                         
          <b> {{title}}</b>
          <contract-aligner v-bind:namespace="namespace" ></contract-aligner>     
        </div>

        <div v-if="!multiple && !['Calculator', 'History'].includes($store.state[namespace].program)" style=" padding: 1px;">                                                         
            <div v-if="$store.state[namespace].legs === 1" style="font-weight: bold;">                                                         
                Selector
            </div>
            <contract-selector-single-select v-bind:namespace="namespace"></contract-selector-single-select>
        </div>
        <div v-if="multiple && $store.state[namespace].program === 'LongTermCharts'">                                                         
            <div v-if="$store.state[namespace].program !== 'Calculator'" style="font-weight: bold;">
                Selector
            </div>
            <contract-selector v-bind:namespace="namespace"  ref="contract-selector" ></contract-selector>  
        </div>
    </div>
</template>

<script>

    import contractSelectorSingleSelect from '@/components/contract-selector-single-select';
    import contractSelector from '@/components/contract-selector';
    import contractAligner from '@/components/contract-aligner';

    export default {
        components: {
            contractSelectorSingleSelect,
            contractSelector,
            contractAligner
        },
        mounted: function () {
            // console.log("contract-aligner-selector.vue mounted() starting.);
        },
        props: {
            namespace: {
                type: String,
                default: ""
            },
            title: {
                type: String,
                default: ""
            },
            multiple: {
                type: Boolean
            }
        },
        computed: {
            borderStyle(){
               return this.multiple ? {borderBottom: '1px solid gray'} : {border: '1px solid gray'}; 
            },
            program(){
                return this.$store.state[this.namespace].program;
            },
            legs(){
                return this.$store.state[this.namespace].legs;
            }
        }
    }
</script>

