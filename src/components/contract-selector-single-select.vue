<template>
    <span>                                                         

        <b-form-select style="border:1px solid gray; color: black; font-size: 11px;  border-radius: 3px; width: auto; background-color: white"
                       v-model="selected[0]" :options="listTickerOptionsNoLegSwapping"
                       size="sm"></b-form-select>

    </span>
</template>

<script>
    import {listTickerOptions, loadBrowserSideOnlyData} from "@/js/main";

    export default {
        mounted() {
            // console.log("contract-selector-single-select.vue beforeMount() starting.)
        },
        props: ['namespace'],
        computed: {
            generalForm(){
                let generalForm=JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                delete generalForm.browserSideOnly.inputDivHeight;
                delete generalForm.playback;
                delete generalForm.chartParameters;   
                delete generalForm.indicators;  
                return generalForm;
            },
            spread(){
                return this.generalForm.sampleContract.slice(0, this.generalForm.legs).join('/');
            },
            listTickerOptionsNoLegSwapping() {
                console.log("listTickerOptionsNoLegSwapping() starting. this.sampleContract=", this.sampleContract);
                //console.trace();
                let includeUnitMoves = true;
               // let sameUnitsAndUnitMoves  = areSameUnitsAndUnitMoves(this.spread);

               let generalForm = {
                    instrument: "future",
                    legs: this.legs,
                    sampleContract: this.sampleContract,
                    selected: [],
                    p: this.p,
                    mult: this.mult,
                    unitMove: this.unitMove
               };

                let fullGeneralForm = loadBrowserSideOnlyData(generalForm);

                let options = listTickerOptions(fullGeneralForm, this.$store.state.user.symbols, includeUnitMoves);
                console.log("listTickerOptions=", options);
                return options;
            },
            legs(){
                return this.$store.state[this.namespace].legs;
            },
            sampleContract(){
                return this.$store.state[this.namespace].sampleContract;
            },
            p(){
                return this.$store.state[this.namespace].p;
            },
            mult(){
                return this.$store.state[this.namespace].mult;
            },
            unitMove(){
                return this.$store.state[this.namespace].unitMove;
            },
            selected: {
                get() {
                   // console.log("selected.get() starting.");
                    let selected = this.$store.state[this.namespace].selected;
                   // console.log("selected=", [...selected]);
                    return selected/*[0]*/;
                },
                set(selected) {
                   // console.log("selected set() starting. selected=", selected);
                    this.$store.commit(this.namespace + '/setSelected', [selected]);
                }
            }
        },
        watch: {
           /* generalForm(newGeneralForm, oldGeneralForm){
                console.log("watching newGeneralForm=", newGeneralForm, " oldGeneralForm=", oldGeneralForm);
                 console.log("differences=", difference(newGeneralForm, oldGeneralForm));
            },
            spread(newSpread, oldSpread){
                console.log("watching newSpread=", newSpread, " oldSpread=", oldSpread);
                console.log("differences=", difference(newSpread, oldSpread));
            }*/
        }
    }
</script>
