<template>
    <div style="border-radius: 3px; border: 0px solid gray; background-color: #e7edf5; margin: 1px 3px 0px -2px; width: fit-content;
         height: auto">
        <table>
            <tr>
                <td style="vertical-align: bottom">

                 <!--   <table v-if="!['form', 'both'].includes(tickerInputType)" border="0" style="margin: 0 10px 2px 0;">
                        <tr>
                            <td style="">
                                <div style="text-align: right; margin: 1px 8px -10px 0;">
                                    <ticker-input-type v-bind:namespace="namespace"></ticker-input-type>
                                </div> 
                            </td>
                            <td>
                                <div style="margin: 2px 0 0 0; font-size: .95rem; font-weight: bold">symbols:</div> 
                            </td>
                            <td>
                        <b-form-select style="border: 1px solid gray; backgound-color: white; color: black;
                                       font-size: 12px; width: auto; margin: 0 0 1px 1px"
                                       v-model="symbols"
                                       :options="symbolOptions"
                                       size="sm"
                                       ></b-form-select>
                </td>          
            </tr>
        </table>  -->
        </td>

        <td>
            <table>
                <tr>
                    <td style="padding: 2px; vertical-align: bottom;">
                        <table style="margin-bottom: 3px; width: 100%; vertical-align: top" class="row-one">
                            <tr style="">
                                <td> <legs v-bind:max="maxLegs" v-bind:namespace="namespace"></legs></td>
                    <td><intracommodity v-if="$store.state[namespace].legs > 1 && program !== 'Search'"
                                    v-bind:namespace="namespace" style="margin-left: 0px;"></intracommodity></td>  
          
        <td v-if="['SpreadCoverage', 'Calculator', 'LongTermCharts'].includes(program)" >  
            <span style="margin: 9px 0 0 0; font-size: .95rem; font-weight: bold;"> years:</span>
            <y1 v-bind:namespace="namespace"></y1>
        </td>
        </tr>
        </table>                    

        <table :id="'tour-select-ticker-'+namespace" class="commoditytable tour" border=1 style="margin: 0 0 0px 0">
            <tr style="text-align: center; border: 0px solid gray; background-color: black; color: white">
                <th v-if="showMultSelector">contracts</th>
                <th>position</th>
                <th>commodity</th>
                <th>month</th>
                <th v-show="showUnitMoves">unit move ($)</th>
            </tr>
            <tr v-for="(number, index) in $store.state[namespace].legs" 
                v-bind:key="index" style="white-space: nowrap; border: 0px solid gray;">  
                <td v-if="showMultSelector" ><mult v-bind:namespace="namespace" v-bind:index="index"></mult> </td>
            <td> <position v-if="showPositionForSingleLeg || legs > 1" v-bind:namespace="namespace" v-bind:index="index"></position></td>
            <td>  <commodity v-bind:namespace="namespace" v-bind:index="index"></commodity></td>
            <td>  <month v-bind:namespace="namespace" v-bind:index="index"></month></td>
            <td>  <unit-move v-show="showUnitMoves" v-bind:namespace="namespace" v-bind:index="index"></unit-move></td> 
            </tr>
        </table>
        </td>
        <td v-if="!(legs === 1 && program === 'LongTermCharts')" style="padding: 3px 3px 2px 0px; vertical-align: bottom">
        <slot name="contract-aligner"></slot>
        </td>

        </tr>
        </table>
        </td>
     
        </tr>
        </table>

    </div>
</template>

<script>

    import intracommodity from '@/components/intracommodity.vue';
    import commodity from '@/components/commodity.vue';
    import month from '@/components/month.vue';
    import position from '@/components/position.vue';
    import mult from '@/components/mult.vue';
    import unitMove from '@/components/unit-move.vue';
    import legs from '@/components/legs.vue';
    import y1 from '@/components/y1.vue';
    import * as fb from '@/firebase';
    import { getUnitMove } from '@/js/main';
    //import tickerInputType from '@/components/ticker-input-type';
    //import tradeSpecs from '@/components/trade-specs';

    export default {
        components: {
            commodity, month, legs, intracommodity, mult, unitMove, position, y1, //tickerInputType, tradeSpecs
        },
        mounted() {
            // console.log("commodity-box.vue mounted() starting.");
            // console.log("this.namespace=", this.namespace);
        },
        props: {
            namespace: {
                type: String,
                default: ""
            },
            showPositionForSingleLeg: {
                type: Boolean,
                default: true
            },
            showMultSelector: {
                type: Boolean,
                default: true
            }
        },
        data: function () {
            return {
                symbolOptions: [
                    {value: "new", text: "new"},
                    {value: "old", text: "old"},
                    {value: "ib", text: "IB"}
                ]
            };
        },
        computed: {
            maxLegs(){
                return this.program === 'Search' ? 3 : 4;
            },
            legs() {
                return this.$store.state[this.namespace].legs;
            },
            user() {
                return this.$store.state.user;
            },
            program() {
                return this.$store.state[this.namespace].program;
            },
            email() {
                return this.user.email;
            },
            symbols: {
                get() {
                    return this.user.symbols;
                },
                set(symbols) {
                    //this.$store.commit("user/setSymbols", symbols);
                    fb.usersCollection.doc(this.email)
                            .update({"symbols": symbols})
                            .then(() => {
                                console.log('symbols updated.')
                            });
                }
            },
            c() {
                return this.$store.getters[this.namespace + "/c"];
            },
            showUnitMoves() {
                // console.log("showUnitMoves() starting.");
                let unitMove = this.$store.state[this.namespace].unitMove.slice(0, this.legs);
               // console.log("unitMove=", unitMove);

                let areUnitMovesStandard = unitMove.every((x, i) => x === getUnitMove(this.c[i]));
                // console.log("areUnitMovesStandard=", areUnitMovesStandard);

                let areCommoditiesTheSame = this.c.slice(0, this.legs).every(x => x === this.c[0]);
                // console.log("areCommoditiesTheSame=", areCommoditiesTheSame);

                return (!areUnitMovesStandard && this.legs > 1) || !areCommoditiesTheSame;
            },
            showRestoreStandardUnitMovesButton() {
                let unitMove = this.$store.state[this.namespace].unitMove.slice(0, this.legs);
                let areUnitMovesStandard = unitMove.every((x, i) => x === getUnitMove(this.c[i]));
                console.log("areUnitMovesStandard=", areUnitMovesStandard);
                return !areUnitMovesStandard;
            },
            aligned() {
                return this.$store.state[this.namespace].aligned;
            },
            tickerInputType: {
                get() {
                    return this.user.tickerInputType;
                },
                set() {}
            },
            seasonalSelectionMode: {
                get() {
                    return this.$store.state[this.namespace].seasonalSelectionMode;
                },
                set(seasonalSelectionMode) {
                    console.log("selected seasonalSelectionMode() starting. seasonalSelectionMode=", seasonalSelectionMode + " this.namespace=", this.namespace);
                    this.$store.commit(this.namespace + '/setSeasonalSelectionMode', seasonalSelectionMode);
                }
            }
        },
        watch: {
            tickerInputType(tickerInputType) {
                console.log("watching tickerInputType=", tickerInputType);
                this.updateTickerInputTypeToFirebase(tickerInputType);
            }
        },
        methods: {
            restoreStandardUnitMoves() {
                console.log("restoreStandardUnitMoves() starting.");
                let unitMove = this.c.map(commodity => getUnitMove(commodity));
                console.log("unitMove=", unitMove);
                this.$store.commit(this.namespace + '/setUnitMove', unitMove);

            },
            updateTickerInputTypeToFirebase(tickerInputType) {
                console.log("updateTickerInputTypeToFirebase() starting. tickerInputType=", tickerInputType);
                this.tickerInputType = tickerInputType;
                fb.usersCollection
                        .doc(this.email)
                        .update({"tickerInputType": tickerInputType})
                        .then(() => {
                            console.log('tickerInputType updated.');
                        }).catch((error) => {
                    // The document probably doesn't exist.
                    console.error("Error updating document: ", error);
                });
            }
        }
    }
</script>

