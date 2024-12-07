<template>
    <div style="border: 1px solid gray; border-radius: 4px; background-color: white; width: max-content">

        <!-- isTicker:{{ isTicker }} -->

        <table :id="'futures-auto-complete-'+namespace" border="0" style="width: auto;">
            <tr>
                <!--     <td style="padding: 0 4px 9px 4px; vertical-align: bottom; font-size: 12px;">
                 <b-form-checkbox
                     id="checkbox-1"
                     name="checkbox-1"
                     value="accepted"
                     unchecked-value="not_accepted"
                     >
                     automatically add unit moves
                 </b-form-checkbox> 
                   </td>  
    
            <td>   <div>    state.tickerInput:{{ tickerInput }} tickerLegs:{{ tickerLegs }} </div>
           
                   decomposedLegsArray:   <div v-for="(dummy, index) in decomposedLegsArray" v-bind:key="index">
                       <div>  {{ decomposedLegsArray[index] }} </div> 
                   </div> 
           
                   <div>focusIndex:{{ focusIndex }}  cursorIndex:{{ cursorIndex }} unitMove: {{unitMove}} symbols:{{ symbols }} </div>   
            </td>  -->

                <td style="padding: 1px; margin: 0px 0 2px 0; width: auto;">
                    <table border="0" style="width: auto">
                        <!-- <tr>
                             <td colspan="100%" style="padding: 0 0 0 7px; font-size: 11px; color: rgb(201, 2, 2);">
                                 symbols: {{ symbols }}
                             </td>
                         </tr> -->
                        <tr style="border: 0px solid gray; background-color: white;">
                            <td v-for="(number, index) in numberOfLegs" v-bind:key="index" style="">

                                <table border="0">
                                    <tr>
                                        <td style="vertical-align: bottom; ">

                                    <futures-auto-complete-dropdown 
                                        style="margin: -2px 2px -1px 1px; border: 0px solid gray; min-width: 20px;"
                                        v-bind:namespace="namespace" 
                                        v-bind:index="index"
                                        v-bind:tickerInputLeg="tickerLegs[index]"
                                        v-bind:contract="contractArray[index]"
                                        v-bind:cursorIndex="cursorIndex"
                                        v-bind:focusIndex="focusIndex"
                                        :ref="'tickerLeg'+index"
                                        @legChange="updateTickerInput"
                                        @focusIndex="setFocusIndex"></futures-auto-complete-dropdown> 

                            </td>
                            <td v-if="unitMove.length > 0" style="padding: 1.5px 4px 0 1px; white-space: nowrap;">
                                <span style="cursor: none; background-color: white; font-size: 12px; margin: 0 -1.5px 0 1px">* </span>
                                <span style="font-size: 12px;">{{ unitMove[index] }}</span> 
                            </td>
                        </tr>
                    </table> 
                </td>
                <!--   <td style="text-align: bottom;">       
               <b-button-group v-if="program !== 'LongTermCharts'"  style="margin: 0px 3px 0px 7px;">
                   <b-button v-on:click="getChart" ref="submit" size="sm" style="font-weight: bold; border: 1px solid gray; width: auto; height: 22px;
                             padding: 0 4px 0px 4px; background-color: blue; color: white; whitespace: nowrap"><span>get</span>&nbsp;<span>chart</span></b-button>
               </b-button-group>
               </td> -->
            </tr>
        </table>
        </td>
        </tr>
        </table>

        <b-modal ref="futures-auto-complete-not-a-subscriber-modal" hide-footer hide-header title="Using Component Methods">
            <div class="d-block text-center">
                <h4>Non-subscribers can only access crude oil and soybeans.</h4>
            </div>
        </b-modal>

    </div>
</template>

<style scoped>
    .vtl-node-main .vtl-operation {
        display: none;
    }
</style>

<script>

    import futuresAutoCompleteDropdown from '@/components/futures-auto-complete-dropdown-revA.vue';
    import {tickerToGeneralForm, getUnitMove, tickerLegDecomposer, commodityUnits, contractNameDecomposer,
            tickerConverter, isCommodity, isContract, symbolConverter} from "@/js/main";

    export default {
        components: {
            futuresAutoCompleteDropdown
        },
        mounted() {
            // console.log("futures-auto-complete.vue mounted.");
            window.addEventListener('keydown', this.handleKeyDownEvent);
            let ticker = this.$store.getters[this.namespace + "/displayTicker"].replace(/\s/g, '');
            this.$store.commit(this.namespace + "/setTickerInput", ticker);
        },
        destroyed() {
            console.log("futures-auto-complete.vue destroyed.");
            window.removeEventListener('keydown', this.handleKeyDownEvent);
        },
        props: ['namespace'],
        data: function () {
            return {
                componentKey: 0,
                focusIndex: 0,
                cursorIndex: 0
            };
        },
        computed: {
            role(){
                return this.$store.state.user.role;
            },
            email() {
                return this.$store.state.user.email;
            },
            commodityArray() {
               // console.log("commodityArray() starting.");
                return this.getCommodityArray(this.tickerLegs);
            },
            contractArray() {
                let arr = this.tickerLegs.map((leg/*, index*/) => {
                    let decomposedLeg = (leg === "" || typeof leg === 'undefined') ? "" : tickerLegDecomposer(leg.toUpperCase());
                    // console.log("decomposedLeg=", decomposedLeg, " index=", index);
                    return typeof decomposedLeg !== 'undefined' ? decomposedLeg.contract : "";
                }); //.filter(x => typeof x !== 'undefined');

                // console.log("arr=", arr);
                return arr;
            },
            decomposedLegsArray() {
                let arr = this.tickerLegs.map((leg) => {
                    let decomposedLeg = leg === "" ? "" : tickerLegDecomposer(leg.toUpperCase());
                    // console.log("decomposedLeg=", decomposedLeg);
                    return decomposedLeg;
                }); //.filter(x => typeof x !== 'undefined');

                // console.log("arr=", arr);
                return arr;
            },
            tickerInput() {
                return this.$store.state[this.namespace].tickerInput;
            },
            tickerLegs() {
                return this.getTickerLegs(this.tickerInput);
            },
            tickerLegsLength() {
                return this.tickerLegs.length;
            },
            numberOfLegs() {
                // console.log("this.tickerLegs.length=", this.tickerLegs.length);
                //return Math.max(1, this.tickerLegs.length);
                return this.tickerLegs.length;
            },
            symbols() {
                return this.$store.state.user.symbols;
            },
            unitMove() {
                // console.log("unitMove() starting. this.commodityArray=", this.commodityArray);
                let unitMoveArray = this.commodityArray.map(commodity => {
                    let isCommodityObject = isCommodity(commodity, this.symbols);
                    //console.log("isCommodityObject=", isCommodityObject);

                    let oldCommodity = isCommodityObject.commodityObject.symbol;
                    // console.log("oldCommodity=", oldCommodity);

                    return isCommodityObject.isCommodity ? getUnitMove(oldCommodity) : null;
                });
                // console.log("unitMoveArray=", unitMoveArray);
                let allSameUnitMoves = unitMoveArray.filter(x => x !== null).every(x => x === unitMoveArray[0] || x === null);
                // console.log("allSameUnitMoves=", allSameUnitMoves);

                let units = this.commodityArray.map(commodity => {
                    let isCommodityObject = isCommodity(commodity, this.symbols);
                    // console.log("isCommodityObject=", isCommodityObject);

                    let oldCommodity = isCommodityObject.commodityObject.symbol;
                    // console.log("oldCommodity=", oldCommodity);

                    return isCommodityObject.isCommodity ? commodityUnits(oldCommodity) : null;
                });
                // console.log("units=", units);
                let allSameUnits = units.every(x => x === units[0]);
                // console.log("allSameUnits=", allSameUnits);

                return allSameUnitMoves && allSameUnits ? [] : unitMoveArray;
            },
            tickerInputWithUnitMoves: {
                get() {
                    return this.$store.state[this.namespace].tickerInputWithUnitMoves
                },
                set(tickerInputWithUnitMoves) {
                    this.$store.commit(this.namespace + "/setTickerInputWithUnitMoves", tickerInputWithUnitMoves);
                }
            },
            program() {
                let program = this.$store.state[this.namespace].program;
                console.log("program=", program);
                return program;
            },
            isTicker() {
                let isTicker = this.$store.state[this.namespace].isTickerInputValid;
                console.log("isTicker=", isTicker);
                return isTicker;
            }
        },
        watch: {
            symbols(newSymbols, oldSymbols) {
                console.log("watching newSymbols=", newSymbols, " oldSymbols=", oldSymbols, " this.tickerInput=", this.tickerInput);
                let ticker = tickerConverter(this.tickerInput, oldSymbols, newSymbols);
                console.log(" ticker=", ticker);
                this.$store.commit(this.namespace + "/setTickerInput", ticker);
            },
            tickerLegsLength(newTickerLegsLength, oldTickerLegsLength) {
                console.log("watching newTickerLegsLength=", newTickerLegsLength, " oldTickerLegsLength=", oldTickerLegsLength, " this.focusIndex=",
                        this.focusIndex);
                let that = this;
                if (newTickerLegsLength > oldTickerLegsLength) {
                    //  console.log("increasing tickerLegsLength.");
                    // this.focusIndex++;
                    this.cursorIndex = 1;
                    this.$nextTick(function () {
                        // console.log("that.$refs=", that.$refs);
                        // console.log("that.$refs['tickerLeg" + that.focusIndex + "'][0]=", that.$refs['tickerLeg' + that.focusIndex][0]);
                        // console.log("TTTTTTTTTTTTTT this.focusIndex=", this.focusIndex);
                        //  console.log("that.$refs['tickerLeg' + (that.focusIndex-1)][0]=", that.$refs['tickerLeg' + (that.focusIndex-1)][0]);
                        that.$refs['tickerLeg' + that.focusIndex][0].$refs.input.focus();
                        that.$refs['tickerLeg' + that.focusIndex][0].$refs.input.setSelectionRange(that.cursorIndex, that.cursorIndex);
                        if (that.focusIndex > 0) {
                            that.$refs['tickerLeg' + (that.focusIndex - 1)][0].forceRerender();
                        }
                    });
                } else {
                    // console.log("decreasing tickerLegsLength.");
                    if (this.focusIndex >= newTickerLegsLength) {
                        console.log("decreasing this.focusIndex");
                        this.focusIndex--;
                        this.cursorIndex = this.tickerLegs[this.focusIndex].length;
                    } else {
                        this.cursorIndex = 0;
                    }

                    console.log("this.focusIndex=", this.focusIndex);
                    this.$nextTick(function () {
                        // console.log("that.$refs=", that.$refs);
                        // console.log("that.$refs['tickerLeg" + that.focusIndex + "'][0]=", that.$refs['tickerLeg' + that.focusIndex][0]);
                        // console.log("TTTTTTTTTTTTTT this.focusIndex=", this.focusIndex);
                        //  console.log("that.$refs['tickerLeg' + (that.focusIndex-1)][0]=", that.$refs['tickerLeg' + (that.focusIndex-1)][0]);
                        that.$refs['tickerLeg' + that.focusIndex][0].$refs.input.focus();
                        that.$refs['tickerLeg' + that.focusIndex][0].$refs.input.setSelectionRange(that.cursorIndex, that.cursorIndex);
                        that.$refs['tickerLeg' + that.focusIndex][0].showDropdown();
                        //  that.$refs['tickerLeg' + that.focusIndex][0].show = true;
                    });
                }
            }/*,
             unitMove(unitMove){
             console.log("watching unitMove=", unitMove);
             this.$store.commit(this.namespace + '/setUnitMove', this.unitMove);
             }*/
        },
        methods: {
            getTickerLegs(tickerInput) {
                return tickerInput.replace(/\s/g, '').split(/(?=[-+\s])/); // Removing "replace(/\s/g, '')." causes problems.
            },
            getCommodityArray(tickerLegs) {
                let that = this;
                let arr = tickerLegs.map((leg/*, i*/) => {
                    let decomposedLeg = leg === "" ? "" : tickerLegDecomposer(leg.toUpperCase());
                    // console.log("i=", i, " decomposedLeg=", decomposedLeg);

                    if (decomposedLeg === "" || typeof decomposedLeg === 'undefined')
                        return;
                    let contractParts = contractNameDecomposer(decomposedLeg.contract, this.symbols);
                    // console.log("contractParts=", contractParts);

                    // let isContractObject = isContract(decomposedLeg.contract, this.symbols);
                    // console.log("isContractObject=", isContractObject);

                    return contractParts.commoditySymbol;
                }).filter(x => typeof x !== 'undefined' && x !== '' && isCommodity(x, that.symbols).isCommodity);
                return arr;
            },
            setCursorIndex(cursorIndex) {
                console.log("setCursorIndex() starting. cursorIndex=", cursorIndex);
                this.cursorIndex = cursorIndex;
            },
            setFocusIndex(index) {
                // console.log("setFocusIndex() starting. index=", index);
                this.focusIndex = index;
                // console.log("this.$refs['tickerLeg' + this.focusIndex][0]=", this.$refs['tickerLeg' + this.focusIndex][0]);
            },
            handleKeyDownEvent(event) {
                console.log("handleKeyDownEvent() starting.");
                let that = this;
                setTimeout(() => {
                    let target = event.target.id;
                    console.log("target=", target);
                    console.log("event.target.value=", event.target.value);
                    console.log(event.key, " pressed.");
                    if (event.key === "ArrowLeft" && target !== "") {
                        // console.log("arrow key pressed");
                        // console.log(event.key, " pressed.");
                        // console.log("selectionStart=", event.target.selectionStart, " selectionEnd=", event.target.selectionEnd);
                        that.cursorIndex = event.target.selectionStart; //that.cursorIndex + (event.key === "ArrowRight" ? 1 : -1);

                        // console.log("that.focusIndex=", that.focusIndex);

                        if (that.cursorIndex === 0 && this.focusIndex > 0) {
                            // console.log("BBBBBBBB");
                            this.focusIndex--;
                            // console.log("event.target.value=", that.tickerLegs[that.focusIndex]);
                            //  console.log("valueLength=", that.tickerLegs[that.focusIndex].length);
                            that.cursorIndex = that.tickerLegs[that.focusIndex].length;
                            that.$nextTick(function () {
                                // console.log("that.$refs=", that.$refs);
                                // console.log("that.$refs['tickerLeg" + that.focusIndex + "'][0]=", that.$refs['tickerLeg' + that.focusIndex][0]);
                                // console.log("that.$refs['tickerLeg" + that.focusIndex + "'][0].$refs=", that.$refs['tickerLeg' + that.focusIndex][0].$refs);

                                //  console.log("GGGGGGGGGGGGG");
                                // console.log("that.$refs['tickerLeg" + that.focusIndex + "'][0]=", that.$refs['tickerLeg' + that.focusIndex][0]);
                                that.$refs['tickerLeg' + that.focusIndex][0].$refs.input.focus();
                                that.$refs['tickerLeg' + that.focusIndex][0].$refs.input.setSelectionRange(that.cursorIndex, that.cursorIndex);
                                //  that.$refs['tickerLeg' + that.focusIndex][0].show = true;

                            });
                        }
                    }
                    if (event.key === "ArrowRight" && target !== "") {
                        // console.log("arrow key pressed");
                        // console.log("target=", target);
                        // console.log(event.key, " pressed.");
                        // console.log("selectionStart=", event.target.selectionStart, " selectionEnd=", event.target.selectionEnd);
                        that.cursorIndex = event.target.selectionStart; //that.cursorIndex + (event.key === "ArrowRight" ? 1 : -1);

                        let valueLength = event.target.value.length;
                        //  console.log("valueLength=", valueLength + " that.focusIndex=", that.focusIndex);

                        if (that.cursorIndex === valueLength && that.focusIndex < that.tickerLegsLength - 1) {
                            console.log("AAAAAAAA");
                            that.focusIndex++;
                            that.cursorIndex = 1;
                            that.$nextTick(function () {
                                // console.log("that.$refs=", that.$refs);
                                // console.log("that.$refs['tickerLeg" + that.focusIndex + "'][0].$refs=", that.$refs['tickerLeg' + that.focusIndex][0].$refs);

                                console.log("EEEEEEEEEEEEEEEE");
                                //  console.log("that.$refs['tickerLeg'" + that.focusIndex + "][0]=", that.$refs['tickerLeg' + that.focusIndex][0]);
                                that.$refs['tickerLeg' + that.focusIndex][0].$refs.input.focus();
                                that.$refs['tickerLeg' + that.focusIndex][0].$refs.input.setSelectionRange(that.cursorIndex, that.cursorIndex);
                                // that.$refs['tickerLeg' + that.focusIndex][0].show = true;
                            });
                        }
                    }
                    that.$refs['tickerLeg' + that.focusIndex][0].showDropdown();
                }, 100);
            },
            forceRerender() {
                console.log("forceRerender() starting. this.componentKey=", this.componentKey = " this.index=", this.index);
                this.componentKey += 1;
            },
            updateState(newTickerInput) {
                console.log("updateState() starting. newTickerInput=", newTickerInput);

                let commodityArray = this.getCommodityArray(this.getTickerLegs(newTickerInput));
                console.log("commodityArray=", commodityArray);

                let guestLimitedCommodities = ['CL', 'S'].map(commodity => symbolConverter(commodity, "eod", this.symbols));
                console.log("guestLimitedCommodities=", JSON.stringify(guestLimitedCommodities));

                console.log("this.role=", this.role); // Check expiration of subscription!!!!!!!!!!!
                
                if (this.role === "guest" && newTickerInput.length > 1 && commodityArray.length > 0 && !commodityArray.some(element => guestLimitedCommodities.includes(element))) {
                    this.$refs['futures-auto-complete-not-a-subscriber-modal'].show();
                } else {
                    this.$store.commit(this.namespace + "/setTickerInput", newTickerInput);

                    let ticker;
                    if (this.unitMove.length > 0) {
                        ticker = this.tickerLegs.map((leg, index) => leg + '*' + this.unitMove[index]).join('');
                    } else {
                        ticker = this.tickerInput;
                    }
                    this.tickerInputWithUnitMoves = ticker;

                    let areTickerLegsValid = this.decomposedLegsArray.every((decomposedLeg, index) => {
                        console.log("index=", index, " decomposedLeg=", decomposedLeg);
                        let isContractObject = isContract(decomposedLeg.contract, this.symbols);
                        console.log("isContractObject=", isContractObject);
                        return isContractObject.isContract;
                    });

                    let areTickerLegsSeparatedBySigns = this.tickerLegs.every((leg, index) => {
                        console.log("index=", index, " leg=", leg);
                        return index === 0 || leg.includes('+') || leg.includes('-');
                    });
                    console.log("areTickerLegsSeparatedBySigns=", areTickerLegsSeparatedBySigns);

                    let isTickerValid = areTickerLegsValid && areTickerLegsSeparatedBySigns;
                    console.log("isTickerValid=", isTickerValid);

                    this.$store.commit(this.namespace + '/setIsTickerInputValid', isTickerValid);

                    if (isTickerValid) {
                        let tickerGeneralForm = tickerToGeneralForm(ticker, this.symbols);
                        tickerGeneralForm.zoomToSavedCoordinates = false;
                        console.log("tickerGeneralForm=", tickerGeneralForm);
                        this.$store.commit(this.namespace + "/setGeneralForm", tickerGeneralForm);
                        this.$store.dispatch(this.namespace + "/getContractListsFromServer");
                    }
                }
            },
            updateTickerInput(obj) {
                console.log("updateTickerInput() starting. obj=", obj);
                // if (obj.value !== "") {
                let currentLegInput = this.tickerLegs[obj.index];
                // console.log("currentLegInput=", currentLegInput, " obj.value=", obj.value);

                let newTickerLegs = [...this.tickerLegs];
                let diff = currentLegInput.replace(obj.value, "");
                console.log("diff=", diff);
                if (currentLegInput.length > obj.value.length && ['+', '-'].includes(diff) && obj.value.replace(" ", "").length > 0) {
                    // console.log("+ or - deleted.")
                    newTickerLegs[obj.index] = " " + obj.value;
                } else {
                    if (obj.value.includes('+') || obj.value.includes('-') || obj.index === 0 || obj.value.replace(" ", "").length === 0) {
                        // console.log("removing spaces.");
                        obj.value = obj.value.replace(" ", "");
                    }
                    newTickerLegs[obj.index] = obj.value;
                    //  console.log("newTickerLegs=", newTickerLegs);
                }

                let newTickerInput;
                //    if (obj.value.includes("+") || obj.value.includes("-") || obj.index === 0 || obj.value.replace(/\s/g, '') === "") {
                newTickerInput = newTickerLegs.join('');
                // console.log("newTickerInput=", newTickerInput);
                this.updateState(newTickerInput);
                //  this.forceRerender();
                //   }

                this.focusIndex = obj.index;
                // console.log("obj.value.slice(-1)=", obj.value.slice(-1));
                if (["+", "-"].includes(obj.value.slice(-1)) && obj.value.length > 1) {
                    this.focusIndex++;
                }
                this.cursorIndex = obj.cursorIndex; // obj.value.length + (obj.index > 0 ? 2 : 0); //...for the spaces after + and -.
                let that = this;
                this.$nextTick(function () {
                    // console.log("that.$refs=", that.$refs);
                    // console.log("that.$refs['tickerLeg" + obj.index + "'][0]=", that.$refs['tickerLeg' + obj.index][0]);

                    if (typeof that.$refs['tickerLeg' + obj.index][0] !== 'undefined') {
                        //console.log("else WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW");
                        //  console.log("that.$refs['tickerLeg" + obj.index + "'][0].$refs=", that.$refs['tickerLeg' + obj.index][0].$refs);
                        that.$refs['tickerLeg' + obj.index][0].$refs.input.focus();
                        that.$refs['tickerLeg' + obj.index][0].$refs.input.setSelectionRange(that.cursorIndex, that.cursorIndex);
                    } else {
                        // console.log("else XXXXXXXXXXXXXXXXXXXXXXXXXXX");
                    }
                });
                // }
            }
        }
    }

</script>