<template>
    <div style="background-color: black;  padding: 0 1px 0 1px; width: auto; text-align: center;">

      <!--  <div>isTickerInputValid:{{ isTickerInputValid }}</div> -->

        <div :id="'seasonal-selection-mode-'+namespace" 
                    style="margin: 0px 1px 6px 1px; padding: 1px; background-color: white; border-radius: 3px; text-align: center;">

            <b-form-group v-if="program === 'StackedCharts'" label="" v-slot="{ ariaDescribedby }" style="margin: 0 0 -1px 2px; font-weight: bold; 
                                                                        text-align: left; background-color: white;">
                  <b-form-radio-group
                    v-model="seasonalSelectionMode"
                    :options="options"
                    :aria-describedby="ariaDescribedby"
                    size="sm"
                    style="margin: 0 0 0 0px;"></b-form-radio-group>
            </b-form-group>
        </div>
        <div v-if="seasonalSelectionMode === 'custom' && program === 'StackedCharts'">

            <div style="color: red; font-size: 1rem; margin: 0 0 2px 0;" v-if="$store.state[this.namespace].selected.length == 0">
                Please select.
            </div>

            <div class="selectDiv" style="width: 100%; border: 1px solid gray; border-radius: 3px; margin-left: 0px;">       

                <select v-model="selected" 
                    v-bind:size="listOptions.length" 
                    :id="'custom-select-'+namespace"
                    v-bind:multiple="true" class="list">
                    <option style="text-align: center"
                        v-for="(option, i) in listOptions" :key="i" 
                        v-bind:value="option.value">
                        {{option.text}}
                    </option>
                </select>
            </div>
        </div>

        <div v-if="seasonalSelectionMode === 'standard'" style="background-color: white; margin: 1px; border-bottom-right-radius: 3px; 
                                                                    border-bottom-left-radius: 3px; color: black; font-size: 1rem;">
            <div v-if="program === 'StackedCharts'" style="padding: 2px; margin: -8px 0 0 0;">
                <span style="margin: 9px 0 0 0; font-size: 1rem;"> years:</span>
                 <y1 v-bind:namespace="namespace" ></y1>
            </div>
        </div>
    </div>
</template>

<style scoped>
    ::v-deep .selectDiv {
        display:inline-block;
        vertical-align:top; overflow:hidden;
        border:solid grey 0px; 
        background-color: white;
        margin: -3px 6px 4px 6px;
    }

    ::v-deep .list {
        padding: 5px 13px 6px 22px;
        margin:-4px -30px -11px -20px;
        border:solid grey 0px; 
        background-color: rgb(255, 255, 255);
    }

    ::v-deep .selectTitle{
        margin:3px 2px -4px 2px;
        font-weight: bold;
        font-size: 12px;
        height: 100%;
        background-color: white
    }

    .contractAligner{
        margin: 0px 0px 3px 0px;
    }
</style>

<script>
    import {listTickerOptions} from "@/js/main";
    import y1 from '@/components/y1';

    export default {
        components: {y1},
        mounted: function () {
          // console.log("contract-selector.vue mounted() starting. this.namespace=", this.namespace);
        },
        props: ['namespace'],
        data() {
            return {
                options: [
                    {text: 'custom', value: 'custom'},
                    {text: 'standard', value: 'standard'}
                ]
            }
        },
        computed: {
            listOptions() {
                console.log("listOptions() starting.")
                let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                console.log("generalForm=", generalForm);

              let options;
              let includeUnitMoves = true;

              if(!this.isTickerInputValid){
                    options = [];
              } else {
                options = listTickerOptions(generalForm, this.$store.state.user.symbols, includeUnitMoves);
              }

          
              console.log("options=", options);
              return options;
            },
            selected: {
                get() {
                    return this.$store.state[this.namespace].selected;
                },
                set(selected) {
                    console.log("selected set() starting. selected=", selected);
                    this.$store.commit(this.namespace + '/setSelected', selected);
                }
            },
            selectedTickers(){
                return this.selected.map(value => this.listOptions.find(x => x.value === value).text);
            },
            seasonalSelectionMode: {
                get() {
                    return this.$store.state[this.namespace].seasonalSelectionMode;
                },
                set(seasonalSelectionMode) {
                    console.log("selected seasonalSelectionMode() starting. seasonalSelectionMode=", seasonalSelectionMode + " this.namespace=", this.namespace);
                    this.$store.commit(this.namespace + '/setSeasonalSelectionMode', seasonalSelectionMode);
                }
            },
            program(){
                return this.$store.state[this.namespace].program;
            },
            isTickerInputValid(){
                console.log("isTickerInputValid.get() starting.");
                let isTickerInputValid = this.$store.state[this.namespace].isTickerInputValid;
                console.log("isTickerInputValid=", isTickerInputValid)
                return isTickerInputValid;
            },
            tickerInput(){
                return this.$store.state[this.namespace].tickerInput;
            },
            tickerInputWithUnitMoves(){
                return this.$store.state[this.namespace].tickerInputWithUnitMoves;
            },
            tickerInputType(){
                return this.$store.state.user.tickerInputType;
            }
        }
    }
</script>