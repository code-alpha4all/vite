<template>
    <div v-if="$store.state[namespace].legs > 1" style="text-align: center; background-color: white; border: 0px solid gray; 
                    padding: 1px; border-radius: 3px; font-size: 11px; width: auto">
        <div style="font-weight: bold; color: black;">
            {{title}}
        </div>
        <table style="text-align: center; background-color: white; width: 100%; margin-top: 1px;">
            <tbody>
                <tr style="width: auto">
                    <td v-for="(value, index) in displayOptions[0]" 
                    v-bind:key="index"
                    v-bind:style="{paddingRight: index + 1 < displayOptions[0].length ? '1px' : '0px'}"
                    style="text-align: center; width: auto; border: 0px solid gray">

                     <div style="border-radius: 2px; margin: 0;  whitespace: nowrap !important; background-color: white; min-width: 47px; width: auto"
                      v-bind:style="{border: program === 'TradeMaps'? '0px solid gray' : '1px solid gray',
                                     padding: program === 'TradeMaps'? '0px' : '2px'}"> 

                        <b-button type="button" style="text-align: center; cursor: pointer; height: 20px; padding: 0px; color: white; margin: 0px;
                                    border-radius: 2px; border: 1px solid gray"                                                 
                            v-bind:style="{backgroundColor: rowColorArray[index],
                             width: '20px'}"
                            v-bind:id="index"
                            v-on:click="raiseColumn">{{String.fromCharCode(9650)}}
                        </b-button>
                        <b-button type="button" style="text-align: center; cursor: pointer; width: 20px; height: 20px; padding: 0px; color: white; 
                                             border-radius: 2px; border: 1px solid gray; margin: 0px 0px 0 1px"                                                 
                            v-bind:style="{backgroundColor: rowColorArray[index]}"
                            v-bind:id="index"
                            v-on:click="lowerColumn">{{String.fromCharCode(9660)}}
                        </b-button>
                     </div>
                    </td>
                </tr>
            <template>
                <tr style="font-style: verdana; line-height: 14px;"
                    v-for="(option, outerIndex) in displayOptions" v-bind:key="outerIndex">
                    <td  v-for="(value, index) in option" v-bind:key="index" style="padding: 0 1px 0 1px; white-space: nowrap;"
                         v-bind:style="{color: option.some(x => x.includes('---')) ? 'gray' : rowColorArray[index]}">{{value}}
                    </td>
                </tr>
            </template>
                <tr style="font-style: verdana; line-height: 4px;">
                <td v-for="(value, index) in displayOptions[0]" style="margin: 0px; padding-bottom: 6px;"
                    v-bind:key="index"
                    v-bind:style="{color: rowColorArray[index]}">{{String.fromCharCode(8942)}}
                </td>
            </tr>
            </tbody>
        </table> 

    </div>
</template>

<script>
    import {spreadTitleLegs} from "@/js/main";

    export default {
        mounted: function () {
           // console.log("contract-aligner.vue mounted() starting. this.title=", this.title);
        },
        props: ['namespace', 'title'],
        computed: {
            displayOptions() {
                let optionsSubset = JSON.parse(JSON.stringify(this.$store.state[this.namespace].browserSideOnly.alignerOptions
                                        .slice(0, this.$store.state[this.namespace].browserSideOnly.numberOfIncompleteSpreads + 2)));
               // console.log("optionsSubset=", optionsSubset);

                let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                let invertDatesMultiplier = 1;
                let noLegSwapping = true;
                let includeUnitMoves = true;

                let displayOptions = optionsSubset.map(rowArray => {
                    generalForm.selected = [rowArray.join('/')];

                    let tickerLegs = spreadTitleLegs(JSON.parse(JSON.stringify(generalForm)),
                                         invertDatesMultiplier, noLegSwapping, this.$store.state.user.symbols, includeUnitMoves);
                   // console.log("tickerLegs=",tickerLegs);

                    let leadingCharacter = tickerLegs[0].charAt(0);

                    if (tickerLegs[0].indexOf("--") === -1 && leadingCharacter === "+") {
                        tickerLegs[0] = tickerLegs[0].substring(1);
                    }
                    return tickerLegs;
                });
                //console.log("displayOptions=",displayOptions);
                return displayOptions;
            },
            rowColorArray() {
                return this.$store.state.siteData.legColors;
            },
            program(){
                return this.$store.state[this.namespace].program;
            },
           /* hideButtonArray() {
                let contractSeparation = ContractSeparationCounter(this.$store.state[this.namespace].sampleContract[0], this.$store.state[this.namespace].sampleContract[1]);
               // console.log("Math.sign(contractSeparation)=", Math.sign(contractSeparation));
                let arr =  [true, true, true, true];
                if (Math.sign(contractSeparation) > 0 && this.program === "TradeMaps") {
                    arr = [false, true, true, true];
                } else if (Math.sign(contractSeparation) < 0 && this.program === "TradeMaps") {
                    arr = [true, false, true, true];
                } 
               // console.log("arr=", arr);
                return arr;
            }*/
        },
        methods: {
            raiseColumn(e) {
               // console.log("handleButtonClick() starting.");
                this.$store.dispatch([this.namespace] + '/shiftSampleContract', {index: e.target.id, direction: "up"});
            },
            lowerColumn(e) {
               // console.log("handleButtonClick() starting.");
                this.$store.dispatch([this.namespace] + '/shiftSampleContract', {index: e.target.id, direction: "down"});
            }
        }
    }
</script>