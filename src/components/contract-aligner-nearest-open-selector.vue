<template>
    <div style="text-align: center; color: black; background-color: black; color: white; font-weight: normal; padding: 0px 1px 1px 1px;
         margin: 0 1px 0px 0px; border-radius: 3px; font-size: 11px"
         v-bind:style="borderStyle">

        <div v-if="$store.state[namespace].legs > 1" style="padding: 1px; text-align: center">                                                         
            <b> {{title}}</b>
            <contract-aligner v-bind:namespace="namespace" ></contract-aligner>     
        </div>
        <div style="font-weight: bold; margin: 0 2px 0 2px;">Nearest Open</div>
        <div v-bind:style="colorStyle" style="padding: 0 1px 0 1px; background-color: white; width: auto">{{nearestOpen}}</div>

    </div>
</template>

<script>

    import contractAligner from '@/components/contract-aligner';
    import {nearestOpenSpread} from "@/js/main";

    export default {
        components: {
            contractAligner
        },
        mounted: function () {
            // console.log("contract-aligner-nearest-open-selector.vue mounted() starting.");
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
            borderStyle() {
                return this.multiple ? {borderBottom: '1px solid gray'} : {border: '1px solid gray'};
            },
            colorStyle() {
                // console.log("this.nearestOpen=", this.nearestOpen);
                return this.nearestOpen === "no open spreads" ? {color: "red", fontWeight: "bold"} : {color: "black"};
            },
            nearestOpen() {
                let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                console.log("generalForm.selected=", generalForm.selected);

                let spread = nearestOpenSpread(generalForm);
                console.log("spread=", spread);          
                return spread.text;

               
                /* this.$store.commit(this.namespace + "/setSelected", spread.value === null ? [] : [spread.value]);
                 return spread.value === null ? "no open spreads" : this.$store.getters[this.namespace + "/displayTickerWithUnitMoves"];*/
            }
        }
    }
</script>

