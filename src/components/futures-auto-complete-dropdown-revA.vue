<template>
    <table>
      <!--  <tr>
              <td>
                  empty:{{ empty}}
              </td>
        </tr>
        <tr>
              <td>
                  show:{{ show}}
              </td>
          </tr> 

          <tr>
              <td>
                  cursorIndex:{{ cursorIndex }}
              </td>
          </tr> -->
 
         <tr>
            <td>
           <!--     <button type="button" ref="caller" @click="open" >Open</button>  -->

        <v-dropdown :ref="'drop'+index"
                    :toggle="true"
                    :manual="false"
                    :open="show && !empty"
                    :close="empty"
                    v-bind:namespace="namespace" 
                    v-bind:index="index" style="">
            <!-- named slot -->
            <template #caller>
                <!-- dropdown container trigger -->
                <b-button-group style="border: 0px solid gray; margin: 2px -22px 0px 1px; padding: 0 0px 0 0; width: 100%;">
                    <input autocomplete="off" style="border: 1px solid gray; text-align: left; padding: 1px 2px 0 1px; border-radius: 3px; font-weight: bold;
                           font-size: 12px; background-color: white; margin: 1px 1px 2px 0"
                           :id="'tickerInput_'+index"
                           size="lg"
                           v-model="tickerInput"
                           placeholder="Enter ticker"
                           ref='input'
                           @keyup.enter="returnKeyup"
                           type="text"
                           v-autowidth="{maxWidth: '130px', minWidth: '12px', comfortZone: 20}"
                           @click="clickHandler"
                           @input="changeHandler"/>

                </b-button-group>
            </template>


            <div v-if="(focusIndex === index) /*&& show*/" style="margin: 6px">
                {{errorMessage}}
            </div>

         
           <div v-show="(focusIndex === index) && !expanded" style="padding: 20px; width: auto; overflow-y: scroll;
                 height: 500px;
                 overflow-x: hidden;">
                <vue-tree-list
                    @click="onDropdownClick"
                    :model="data1"
                    v-bind:default-expanded="false"
                    style="font-size: 1.0rem; line-height: 0.8em;"
                    >
                    <template v-slot:leafNameDisplay="slotProps">
                        <span>
                            {{ slotProps.model.name }} 
                        </span>
                    </template>
                    <span class="icon" slot="addTreeNodeIcon"></span>
                    <span class="icon" slot="addLeafNodeIcon"></span>
                    <span class="icon" slot="editNodeIcon"></span>
                    <span class="icon" slot="delNodeIcon"></span>
                    <span class="icon" slot="leafNodeIcon"></span>
                    <span class="icon" slot="treeNodeIcon"></span>
                </vue-tree-list>
            </div> 

            <div v-show="(focusIndex === index) && expanded" style="padding: 20px; width: auto; overflow-y: scroll;
                 height: 500px;
                 overflow-x: hidden;">
                <vue-tree-list
                    @click="onDropdownClick"
                    :model="data1"
                    v-bind:default-expanded="true"
                    style="font-size: 1.0rem; line-height: 0.8em;"
                    >
                    <template v-slot:leafNameDisplay="slotProps">
                        <span>
                            {{ slotProps.model.name }} 
                        </span>
                    </template>
                    <span class="icon" slot="addTreeNodeIcon"></span>
                    <span class="icon" slot="addLeafNodeIcon"></span>
                    <span class="icon" slot="editNodeIcon"></span>
                    <span class="icon" slot="delNodeIcon"></span>
                    <span class="icon" slot="leafNodeIcon"></span>
                    <span class="icon" slot="treeNodeIcon"></span>
                </vue-tree-list>
            </div> 
        </v-dropdown>  
        </td>
        </tr>
    </table>
</template>

<style scoped>
    input:focus {
        outline:none;
    }
</style>

<script>
    import {groupsObject, Contracts, OpenContracts, getCommoditiesArray, contractConverter, symbolConverter,
            isContract, tickerLegDecomposer, contractNameDecomposer, isCommodity, getSymbolArray} from "@/js/main";
    import { VueTreeList, Tree } from 'vue-tree-list';
    import Dropdown from 'v-dropdown';
    // import _ from 'lodash';
    import VueInputAutowidth from 'vue-input-autowidth'
    import Vue from 'vue';

    Vue.use(VueInputAutowidth);

    export default {
        components: {
            VueTreeList, 'v-dropdown': Dropdown
        },
        mounted() {
           /* console.log("futures-auto-complete-dropdown-revA.vue starting. this.index=", this.index, " this.tickerInputLeg=", this.tickerInputLeg,
                    " this.contract=", this.contract, " this.symbols=", this.symbols);*/

            var elem = document.getElementById("tickerInput_" + this.index);
            elem.setSelectionRange(this.cursorIndex, this.cursorIndex);

            this.data1 = this.commoditiesArrayTree();

            if(this.index === 0){
                this.empty = true;
            }
        },
        props: ['namespace', 'index', 'tickerInputLeg', 'contract', 'focusIndex', 'cursorIndex'],
        data() {
            // console.log("groupsObject=", groupsObject);
            return{
                expanded: false,
                data1: this.commoditiesArrayTree(),
                errorMessage: "",
                name: "",
                dropdownComponentKey: 0,
                show: false,
                empty: false
            }
        },
        computed: {
            tickerInput: {
                get() {
                    return this.tickerInputLeg;
                },
                set() {}
            },
            displayTickerWithUnitMoves() {
                return this.$store.getters[this.namespace + "/displayTickerWithUnitMoves"];
            },
            symbols() {
                return this.$store.state.user.symbols;
            },
            program() {
                return this.$store.state[this.namespace].program;
            }
        },
        watch: {
            symbols(symbols){
                console.log("watching symbols=", symbols);
                this.data1.children = [];
                this.data1 = this.commoditiesArrayTree();
            },
           // contract(/*contract*/) {
               // console.log("watching contract=", contract);
           // },
            focusIndex(focusIndex) {
               // console.log("watching focusIndex=", focusIndex + " this.index=", this.index);
                if (focusIndex === this.index) {
                    this.showDropdown();
                } else {
                    this.hideDropdown();
                }
            },
            tickerInput(tickerInput) {
               console.log("watching tickerInput=", tickerInput);

                    let newTree = this.commoditiesArrayTree();
                   // console.log("newTree=", newTree);
                    if (newTree !== undefined) {
                        this.data1 = newTree;
                    }
                    if (tickerInput === "") {
                        this.errorMessage = "";
                    }
            }
        },
        methods: {
            forceRerender() {
                console.log("forceRerender() starting. this.dropdownComponentKey=", this.dropdownComponentKey);
                this.dropdownComponentKey += 1;
            },
            clickHandler(/*e*/) {
              //  console.log("clickHandler() starting. this.index=", this.index+ " this.show=", this.show);
                // let cursorIndex = e.target.selectionStart;
                // this.$emit('cursorIndex', cursorIndex);
                this.$emit('focusIndex', this.index);
            },
            changeHandler(e) {
               // console.log("changeHandler() starting. this.index=", this.index);
                let cursorIndex = e.target.selectionStart;
               // console.log("cursorIndex=", cursorIndex);
                this.show = true;

                // emit value to futures-auto-complete.
                this.$emit('legChange', {
                    index: this.index,
                    value: e.target.value.toUpperCase(),
                    cursorIndex: cursorIndex
                });
            },
            open(){
               // console.log("open() starting. this.index=", this.index);
                if(!this.show) this.$refs['drop' + this.index].$emit('show', this.$refs.caller);
            },
            showChange(/*val*/) {
               // console.log("showChange() starting. val=", val);
               // this.show = val;
            },
            hideDropdown() {
               // console.log("hideDropdown() starting. this.index=", this.index);
                this.show = false;
               // this.$refs['drop' + this.index].visible(false);
            },
            showDropdown() {
               // console.log("showDropdown() starting. this.index=", this.index);          
                this.show = !this.show;
               // this.$refs['drop' + this.index].visible(true);
            },
            toggleDropdown() {
                console.log("toggleDropdown() starting. this.index=", this.index);
              //  this.show = !this.show;
              //  this.show ? this.showDropdown() : this.hideDropdown();
            },
            onDropdownClick(params) {
                console.log("onDropdownClick() starting. params=", params, " this.tickerInput=", this.tickerInput, " this.symbols=", this.symbols + " this.index=", this.index);
               // console.log("params.id=", params.id);
                // console.log("params.id === '*'=", params.id === '*');
                // let lastCharacterOfTickerInput = this.tickerInput.replace(/\s+/g, '').slice(-1);
                //  console.log("lastCharacterOfTickerInput=", lastCharacterOfTickerInput);
                params.toggle();

                if (params.isLeaf) {
                   // console.log("params.id=", params.id);
                    let replaceText = true;
                    if(["+", "-", "*"].includes(params.id)){
                        this.tickerInput = this.tickerInput + params.id;
                        replaceText = false;
                    }
                   // console.log("this.tickerInput=", this.tickerInput);
                    let decomposedLeg = this.tickerInput === "" ? "" : tickerLegDecomposer(this.tickerInput.toUpperCase());
                   // console.log("decomposedLeg=", decomposedLeg);

                    let newTickerInput;
                    if (replaceText && typeof decomposedLeg.contract !== 'undefined' && decomposedLeg.contract !== "") {
                        newTickerInput = this.tickerInput.replace(decomposedLeg.contract, params.id);
                    } else {
                        newTickerInput = this.tickerInput + params.id;
                    }
                  //  console.log("newTickerInput=", newTickerInput);


                    if (!["+", "-"].includes(newTickerInput.charAt(0)) && this.index !== 0) {
                        newTickerInput = "+" + newTickerInput;
                    }

                    this.$emit('legChange', {
                        index: this.index,
                        value: newTickerInput,
                        cursorIndex: 100
                    });

                }
            },
            onTickerInputClick() {
               // console.log("onTickerInputClick() starting.");
                // this.show = true;
            },
            returnKeyup() {
              //  console.log("returnKeyup() starting.");
                //this.getChart();
            },
            newSymbolsSortFunction(a, b) {
                // console.log("newSymbolsSortFunction() starting. this.symbols=", this.symbols); // This can be sped up!!!!!!!!!!!!
                let tempA = contractConverter(a, this.symbols, "eod"); 
                let tempB = contractConverter(b, this.symbols, "eod");
                //  console.log("tempA=", tempA, " tempB=", tempB, "["+tempA+","+ tempB+"].sort()[0]=="+a, [tempA, tempB].sort()[0] === tempA);
                return [tempA, tempB].sort()[0] === tempA ? 1 : -1;
            },
            matchingCommodityChildren(commodity) {
              // console.log("matchingCommodityChildren() starting. commodity=", commodity, " this.contract=", this.contract, " this.program=", this.program);
          
                let contracts = this.program === "TradeMaps" ? OpenContracts(commodity, null, this.symbols) : Contracts(commodity, null, this.symbols);
                // console.log("contracts=", contracts);

                let filteredContracts = (this.symbols === "old" ? contracts.sort().reverse() : contracts.sort(this.newSymbolsSortFunction))
                        .filter(contract => contract.startsWith(this.contract));
               // console.log("filteredContracts=", filteredContracts);

                if(typeof this.tickerInput === "undefined"){
                    return [];
                } else {
                let children = filteredContracts.filter(x => !this.tickerInput.includes(x))
                        .map(contract => {
                            //console.log("contract =", contract);
                            return {
                                name: contract,
                                id: contract,
                                isLeaf: true
                            };
                        });
               // console.log(" children=", children);
                return children;
                }
            },
            allCommodityChildren(commodity) {
                //console.log("allCommodityChildren() starting. commodity=", commodity, "this.symbols=", this.symbols);
                if (typeof this.symbols !== 'undefined') {
                    let contracts = OpenContracts(commodity, null, this.symbols);
                   // console.log("contracts=", contracts);

                    let oldCommodity = isCommodity(commodity, this.symbols).commodityObject.symbol;
                   // console.log("oldCommodity=", oldCommodity);

                    let commodityName = getCommoditiesArray().find(x => x.symbol === oldCommodity).name;
                   // console.log("commodityName=", commodityName);
                    let sortedContracts = this.symbols === "old" ? contracts.sort() : contracts.sort(this.newSymbolsSortFunction).reverse();
                    return {
                        name:  commodity + ", " + commodityName,
                        id:  commodity,
                        children: sortedContracts
                                .reverse()
                                .map(contract => {
                                    return {
                                        name: contract,
                                        id: contract,
                                        isLeaf: true
                                    };
                                })
                    }
                } else {
                    return [];
                }
            },
            commoditiesArrayTree() {
              //  console.log("commoditiesArrayTree() starting. this.contract=", this.contract);
                this.empty = false;
                this.show = true;
                if (typeof this.contract === 'undefined' || this.contract === "") {
                        return this.groupTree();
                    } else {
                    let contractParts = contractNameDecomposer(this.contract.replace("+", "").replace("-", ""), this.symbols);
                   // console.log("contractParts=", contractParts);
                    let commodity = typeof contractParts.commoditySymbol !== 'undefined' ? contractParts.commoditySymbol : this.contract.replace("+", "").replace("-", "");
                   // let year = contractParts.year;
                   // let yearDigits = year === undefined ? 0 : year.length;
                  //  console.log("commodity=", commodity + " year=", year + " this.symbols=", this.symbols);
                  //  console.log("commodity=", commodity);

                if(typeof this.symbols !== 'undefined'){
                    let commodities = getSymbolArray(this.symbols);

                   let matchingCommodities = /*isCommodity(commodity, this.symbols).isCommodity ? [commodity] :*/ commodities.filter(x => x.startsWith(commodity)).sort();
                  // console.log("matchingCommodities=", matchingCommodities);
                   // this.expanded = /*(commodity !== undefined && year !== undefined) ||*/ matchingCommodities.length === 1 ? true : false;
                   // console.log("this.expanded=", this.expanded);

                            if (commodity !== undefined) {
                                let that = this;
                                let tree = new Tree(
                                        matchingCommodities.map(commodity => {
                                             // console.log("commodity=", commodity);
                                              let commodityName = isCommodity(commodity, this.symbols).commodityObject.name;
                                             // console.log("commodityName=", commodityName);
                                            let obj = {
                                                name: commodity + ", " + commodityName,
                                                id: commodity,
                                                children: that.matchingCommodityChildren(commodity)
                                            }
                                            return obj;
                                        }).filter(commodity => {
                                              // console.log("commodity=", commodity);
                                              return commodity.children.length > 0;
                                           })
                                        );
                                // console.log("tree=", tree);
                               
                                if(tree.children === null){
                                  /* setTimeout(() => {
                                    console.log("hiding dropdown");
                                   that.show = false;
                                    }, 500);*/
                                    
                                  if(isContract(this.contract, this.symbols).isContract && typeof this.tickerInput !== 'undefined'){ // Add more restrictions!!
                                    that.empty = true;
                                    that.empty = false;
                                    that.empty = true;
                                   // return this.mathOperationsTree();
                                  } else {
                                    this.loadErrorMessage(tree);
                                  }
                                }else{
                                    this.show = true;
                                    this.expanded = tree.children.length > 1 ? false : true;
                                   // console.log("this.expanded=", this.expanded);
                                }
                                 this.loadErrorMessage(tree);
                                 return tree;
                            }
                         } else {
                               // console.log("Calling this.groupTree();");
                                return this.groupTree();
                            }
                        }
            },
            groupTree() {
               // console.log("groupTree() starting. this.symbols=", this.symbols, " this.index=", this.index);
                    if (typeof this.symbols === 'undefined') {
                        return this.mathOperationsTree();
                    } else {
                        let that = this;
                        this.expanded = false;
                        return new Tree(
                                Object.values(groupsObject).map(group => {
                            //console.log("group=", group);
                            let obj = {};
                            obj.name = group.name;
                            obj.id = group.name;
                            obj.children = group.commodities.sort().map(commodity => {
                                let com = this.symbols === "old" ? commodity : symbolConverter(commodity, "eod", this.symbols);
                                // console.log("com=", com);

                                let children = that.allCommodityChildren(com);
                                //  console.log("children=", children);
                                return children;
                            }).filter(commodityObject => {
                               // console.log("commodityObject=", commodityObject);
                                return commodityObject.children.length > 0 || typeof this.tickerInput === 'undefined';
                            }).sort((a, b) => (a.id > b.id) ? 1 : -1);
                            return obj;
                        }).filter(groupObject => {
                            // console.log("groupObject=", groupObject);
                            return groupObject.children.length > 0 || typeof this.tickerInput === 'undefined';
                        })
                                );
                    }
              
            },
            mathOperationsTree() {
               // console.log("mathOperationsTree() starting. this.tickerInput=", this.tickerInput);
                this.errorMessage = "";
                return new Tree(
                        [{
                                name: "- subtract",
                                id: "-",
                                isLeaf: true
                            }, {
                                name: "+ add",
                                id: "+",
                                isLeaf: true
                            },
                            {
                                name: "* multiply",
                                id: "*",
                                isLeaf: true
                            }]
                        );
            },
            loadErrorMessage(tree) {
               // console.log("loadErrorMessage() starting. this.contract=", this.contract, "this.symbols=", this.symbols + " this.index=", this.index);
                this.errorMessage = "";

               // let contractParts = newContractNameDecomposer(this.contract);
               // console.log("contractParts=", contractParts);
                /*    if (contractParts.symbols !== null && index === 0) {
                 that.symbols = contractParts.symbols.replace("both", "old");
                 }*/

                let isContractObject = isContract(this.contract, this.symbols);
              //  console.log("isContractObject =", isContractObject);
                if (tree.children === null) {
                    if(["new", "barchart"].includes(this.symbols)){
                        if (!isContractObject.isCommodity && this.tickerInput !== "") {
                            this.errorMessage = "Not a valid commodity symbol.";
                        } else if (!isContractObject.isMonth) {
                            this.errorMessage = "Not a valid month.";
                        } else if (!isContractObject.isYear && isContractObject.year !== undefined) {
                            this.errorMessage = "Not a valid year.";
                        }
                    } else if(["old", "eod"].includes(this.symbols)) {
                        if (!isContractObject.isCommodity && this.tickerInput !== "") {
                            this.errorMessage = "Not a valid commodity symbol.";
                        } else if (!isContractObject.isYear) {
                            this.errorMessage = "Not a valid year.";
                        } else if (!isContractObject.isMonth) {
                            this.errorMessage = "Not a valid month.";
                        }
                    }
                } else {
                    this.errorMessage = "";
                }
            }
        }
    }


</script>