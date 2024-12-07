<template>
    <div>
        <H2 style="text-align: left;">Trades</H2>
       
        <b-table :items="item.portfolio.trades" :fields="fields" sort-icon-right v-bind:foot-clone="footCloneParameter" no-footer-sorting	
                 class="portfolio-trades-table" style="border: 1px solid silver; width: fit-content; text-align: right;">     

            <template #head(numberOfPositions)="data">
                <span style="color: black; background-color: white;"><b>{{ data.label }}</b></span>
            </template>

            <template #head(openDate)="data">
                <span style="color: green; background-color: white;"><b>{{ data.label }}</b></span>
            </template>
            <template #head(openPrice)="data">
                <span style="color: green; background-color: white;"><b>{{ data.label }}</b></span>
            </template>

            <template #head(closeDate)="data">
                <span style="color: red; background-color: white;"><b>{{ data.label }}</b></span>
            </template>
            <template #head(closePrice)="data">
                <span style="color: red; background-color: white;"><b>{{ data.label }}</b></span>
            </template>

            <template #head(realizedProfit)="data">
                <span style="color: blue; background-color: white;"><b>{{ data.label }}</b></span>
            </template>
            <template #head(unrealizedProfit)="data">
                <span style="color: blue; background-color: white;"><b>{{ data.label }}</b></span>
            </template>
            <template #head(commission)="data">
                <span style="color: blue; background-color: white;"><b>{{ data.label }}</b></span>
            </template>

            <template #head(actions)="data">
                <b-row><b-col class="text-sm-center"><b>{{ data.label }}</b></b-col></b-row>
            </template>
            <template #head(tools)="data">
                <b-row><b-col class="text-sm-center"><b>{{ data.label }}</b></b-col></b-row>
            </template>


            <template v-slot:cell(numberOfPositions)="{value, item, field}">
                <b-form-select v-if="(tradeRow && tradeRow.id === item.id) || item.edit === true"
                               size="sm" style="border: 1px solid gray; width: auto; border-radius: 3px; margin: -7px -2px 0 0px;"
                               v-model="item.numberOfPositions" :options="numberOfPositionsOptions">
                </b-form-select> 

                <template v-else>{{ value }}</template>
            </template> 

            <template v-slot:cell(openDate)="{value, item, field}">
                    <b-form-datepicker v-if="tradeRow && tradeRow.id === item.id"
                                   v-model="item.openDate" size="sm" 
                                   :date-format-options="{ year: 'numeric', month: 'short', day: 'numeric' }"
                                   locale="en"
                                   style="border: 1px solid gray; margin: -7px 0 0 2px">
                    </b-form-datepicker>
                <template v-else>{{ value }}</template>
            </template> 

            <template v-slot:cell(openPrice)="{value, item, field}">
                <b-input v-if="tradeRow && tradeRow.id === item.id" 
                         style="width: 80px; border: 1px solid gray; text-align: right; border-radius: 3px; margin: -7px 0 0 3px"
                         size="sm"
                         v-model.number="item.openPrice">
                </b-input>
                <template v-else>{{ value }}</template>
            </template>

            <template v-slot:cell(closeDate)="{value, item, field}">
                <b-form-datepicker v-if="tradeRow && tradeRow.id === item.id"
                                   v-model="item.closeDate" size="sm" 
                                   :date-format-options="{ year: 'numeric', month: 'short', day: 'numeric' }"
                                   locale="en"
                                   style="border: 1px solid gray; margin: -7px 0 0 2px"></b-form-datepicker>

                <template v-else >{{ value }}</template>
            </template>

            <template v-slot:cell(closePrice)="{value, item, field}">
                <b-input v-if="tradeRow && tradeRow.id === item.id" 
                         style="width: 80px; border: 1px solid gray; text-align: right; border-radius: 3px; margin: -7px 0 0 3px"
                         size="sm"
                         v-model.number="item.closePrice">
                </b-input>
                <template v-else>{{ value }}</template>
            </template>

            <template v-slot:cell(commission)="{value, item, field}">
                <b-input v-if="tradeRow && tradeRow.id === item.id" 
                         style="width: 65px; border: 1px solid gray; text-align: right; border-radius: 3px; margin: -7px 0 0 24px"
                         size="sm"
                         v-model.number="item.commission">
                </b-input>
                <template v-else>{{ value }}</template>
            </template>

            <template v-slot:cell(actions)="{ item }">
                <b-button-group v-if="tradeRow && tradeRow.id === item.id" style="margin: -7px 0 0 0">
                    <b-button size="sm" variant="success" @click="saveEdit(item)" >
                        Save
                    </b-button>
                    <b-button size="sm" variant="danger" @click="resetEdit">
                        Cancel
                    </b-button>
                </b-button-group>

                <span v-else >
                    <span @click="editTrade(item)" :id="'portfolio-trades-edit-icon'"> 
                        <Icon style="color: #404040; margin: -4px 4px 0px 0px; cursor: pointer;" icon="material-symbols:edit-document-outline-rounded" width="27" height="27"
                              v-b-tooltip.noninteractive.hover.topleft="'edit'"/>
                    </span>
                    <span @click="duplicateTrade(item)" :id="'portfolio-trades-duplicate-icon'"> 
                        <Icon style="color: black; margin: -4px 4px 0px 0px; cursor: pointer;" icon="ion:duplicate-outline" width="25" height="25"
                              v-b-tooltip.noninteractive.hover.topleft="'duplicate row'"  />
                    </span>
                    <span @click="removeTrade(item)"  :id="'portfolio-trades-delete-icon'">
                        <Icon style="margin: -4px 4px 0px 0px; cursor: pointer;" icon="ion:trash-outline" width="25" height="25"
                              v-b-tooltip.noninteractive.hover.topleft="'delete'"  />
                    </span>
                </span>
            </template>

            <template v-slot:cell(tools)="{ item }">
               <!-- <span @click="getCalculator(item)"> 
                    <Icon style="margin: -4px 4px 0px 0px; cursor: pointer;" icon="fluent:calculator-20-regular" width="27" height="27"
                          v-b-tooltip.noninteractive.hover.topleft="'calculator'"/>
                </span>
                <span @click="getChart(item)"> 
                    <Icon style="color: #404040; margin: -4px 4px 0px 0px; cursor: pointer;" icon="mdi:graph-line" width="25" height="25"
                          v-b-tooltip.noninteractive.hover.topleft="'chart'"  />
                </span>
                  <span @click="getMap(item)"> 
                      <Icon style="color: #404040; margin: -4px 3px 0px 0px; cursor: pointer;" icon="material-symbols:map-outline-rounded" width="25" height="25"
                            v-b-tooltip.noninteractive.hover.topleft="'heatmap'"  />
                  </span>  -->
                  <span @click="editTrade(item)" :id="'portfolio-trades-select-chart-icon'"> 
                  <b-form-select style="border: 1px solid black; width: auto; margin: -1px 0 0 0;
                           padding-top: 1px; background-color: gray; color: white; height: 22px"
                           v-model="newProgram" :options="programOptions"
                           size="sm" @change="getChart(item)">
                </b-form-select>
                </span>
            </template>


            <template #foot()="data">
                <span style="color: black; background-color: white;" ></span>
            </template>

            <template v-slot:foot(numberOfPositions)="data">
                <b-form-select size="sm" style="border:1px solid gray; width: auto; border-radius:3px; margin: 0px -5px 0 0;"
                               :options="numberOfPositionsOptions"
                               v-model="newTrade.numberOfPositions">
                </b-form-select> 
            </template> 

            <template v-slot:foot(openDate)="data">
                <span id="portfolio-trades-openDate-selector">
                <b-form-datepicker v-model="newTrade.openDate" size="sm" 
                                   :date-format-options="{ year: 'numeric', month: 'short', day: 'numeric' }"
                                   locale="en"
                                   style="border: 1px solid gray; margin: 0px 0px 0 5px">
                </b-form-datepicker>
                </span>
            </template>

            <template v-slot:foot(closeDate)="data">
                <b-form-datepicker v-model="newTrade.closeDate" size="sm" 
                                   :date-format-options="{ year: 'numeric', month: 'short', day: 'numeric' }"
                                   locale="en"
                                   style="border: 1px solid gray; margin: 0px 0 0 5px">
                </b-form-datepicker>
            </template> 

            <template v-slot:foot(openPrice)="data">
                <span id="portfolio-trades-openPrice-selector">
                    <b-input style="width: 80px; border: 1px solid gray; text-align: right; border-radius: 3px; margin: 0px -12px 0 0"
                         size="sm"
                         v-model.number="newTrade.openPrice">
                    </b-input>
                </span>
            </template>

            <template v-slot:foot(closePrice)="data">
                <b-input style="width: 80px; border: 1px solid gray; text-align: right; border-radius: 3px; margin: 0px -12px 0 0"
                         size="sm"
                         v-model.number="newTrade.closePrice">
                </b-input>
            </template>

            <template v-slot:foot(unrealizedProfit)="data">
                <span id="portfolio-trades-unrealizedProfit-selector" style="color: black; background-color: white;"></span> 
            </template> 

            <template v-slot:foot(commission)="data">
                <b-input style="width: 65px; border: 1px solid gray; text-align: right; border-radius: 3px; margin: 0px -10px 0 21px"
                         size="sm"
                         v-model.number="newTrade.commission">
                </b-input>
            </template>           

            <template #foot(last)="data">
                <div style="font-weight: normal; margin: 5px -2px 0 0px">{{ item.last }}</div>
            </template>

            <template #foot(actions)="data">
                <b-button-group style="margin: 0px 0 0 0">
                    <span :id="'portfolio-trades-add-trade-button'">
                        <b-button size="sm" variant="success" @click="addTrade()" >
                       Add Trade                        
                        </b-button>
                    </span>
                </b-button-group>
            </template>            

        </b-table>

    </div>
</template>

<style scoped>
    ::v-deep .portfolio-trades-table tfoot {
        background-color: rgb(235, 233, 233);
        text-align: right;
    }
</style>

<script>
    import { Icon } from '@iconify/vue2';
    import moment from 'moment';
    import { createInitialState } from '@/js/createInitialState.js';

    export default {
        components: {
            Icon
        },
        mounted() {
            console.log("mounted() starting. this.item=", this.item);
            this.newTrade = {numberOfPositions: 1, 
                             openDate: moment(this.open).format("YYYY-MM-DD"), 
                             openPrice: null,
                             closeDate: moment(this.close).format("YYYY-MM-DD"), 
                             closePrice: null,
                             last: this.item.last,
                             realizedProfit: null,
                             unrealizedProfit: null,
                            };
        },
        props: ['namespace', 'item'],
        data: function () {
            return{
                tradeRow: null,
                newTrade: {},
                footCloneParameter: 'foot-clone',
                sortBy: 'open',
                sortDesc: false,
                fields: [
                   // {key: 'id', label: "id"},
                    {key: 'numberOfPositions', label: "size", sortable: true, editable: true, id: 1},
                    {key: 'openDate', label: "entry date", sortable: true, formatter: this.fullTableFormatDateAssigned},
                    {key: 'openPrice', label: "entry price", sortable: true},
                    {key: 'closeDate', label: "exit date", sortable: true, formatter: this.fullTableFormatDateAssigned},
                    {key: 'closePrice', label: "exit price", sortable: true},
                    {key: 'realizedProfit', label: "realized profit", sortable: true, formatter: this.formatMonetaryQuantities},
                    // {key: 'last', label: "last price", sortable: true},
                    {key: 'unrealizedProfit', label: "unrealized profit", sortable: true, formatter: this.formatMonetaryQuantities},
                    {key: 'commission', label: "commission", sortable: true, formatter: this.formatMonetaryQuantities},
                    {key: 'actions', label: 'actions'},
                    {key: 'tools', label: 'tools'},
                ],
                options: [
                    {text: 'buy', value: 'buy'},
                    {text: 'sell', value: 'sell'}
                ],
                programOptions: [
                    {value: null, text: 'Select Chart'},
                    {value: 'Calculator', text: 'Calculator'}, 
                    {value: 'BasicChartsNew', text: 'Futures Chart'},
                    {value: 'History', text: 'History Charts'},
                    {value: 'LongTermCharts', text: 'Long Term Charts'},
                    // {value: 'TradeMaps', text: 'Trade Maps'} // close might not exist.
                ],
                newProgram: null,
                numberOfPositionsOptions: Array(1000).fill().map((x, i) => ({value: i + 1, text: i + 1})),
                newFolder: "",
                showNewFolderName: false
            };
        },
        computed: {
            open() {
                    let open = this.$store.state[this.namespace].open;
                    if(!open.includes('-')){
                        open = moment(open, "YYYYMMDD").format("YYYY-MM-DD");
                    }
                    console.log("open=", open);
                    return open;
            },
            close() {
                    let close = this.$store.state[this.namespace].close;
                    if(!close.includes('-')){
                        close = moment(close, "YYYYMMDD").format("YYYY-MM-DD");
                    }
                    console.log("close=", close);
                    return close;
            }
        },
        methods: {
            fullTableFormatDateAssigned(date) {
                const formattedDate = moment(date).format("MMM D, YYYY");
                return formattedDate;
            },
            formatMonetaryQuantities(value) {
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                }).format(value);
            },
            editTrade(trade) {
                console.log("editTrade() starting. trade=", JSON.parse(JSON.stringify(trade)));
                let doEdit = true;
                console.log("this.tradeRow=", this.tradeRow);
                if (this.tradeRow && !confirm("You have unsaved changes, are you sure you want to continue?")) {
                    doEdit = false;
                }

                if (doEdit) {
                    this.$parent.$parent.$parent.$parent.$parent.getStrategies();
                    this.tradeRow = {...trade};
                }

                //  this.footCloneParameter = null;
            },
            resetEdit() {
                console.log("resetEdit() starting.");
                this.tradeRow = null;
                this.footCloneParameter = "foot-clone";
                this.$parent.$parent.$parent.$parent.$parent.getStrategies();
            },
            saveEdit(row) {
                console.log("saveEdit() starting. row=", row);
                let afterCloseDate = moment().isAfter(moment(row.closeDate));
                console.log("afterCloseDate=", afterCloseDate);
               /* if (afterCloseDate && (typeof row.close === 'undefined' || row.close !== "")) {
                    alert("Please add an exit price.");
                } else { */
                    let newStrategy = JSON.parse(JSON.stringify(this.item));
                    this.$parent.$parent.$parent.$parent.$parent.updateStrategies(newStrategy);
                    this.newTrade = {numberOfPositions: 1, openDate: moment(this.open).format("YYYY-MM-DD"), closeDate: moment(this.close).format("YYYY-MM-DD"), last: this.item.last};
                    this.resetEdit();
              //  }
            },
            addTrade() {
                console.log("addTrade() starting. this.newTrade=", JSON.parse(JSON.stringify(this.newTrade)));
                this.duplicateTrade(this.newTrade);
            },
            removeTrade(trade) {
                console.log("removeTrade() starting. trade=", JSON.parse(JSON.stringify(trade)));
                if (confirm("Are you sure you want to delete this trade?")) {
                    let trades = JSON.parse(JSON.stringify(this.item.portfolio.trades));
                    let tradesSubset = trades.filter(x => x.id !== trade.id);
                    console.log("trades=", JSON.parse(JSON.stringify(trades)));
                    console.log("tradesSubset=", JSON.parse(JSON.stringify(tradesSubset)));

                    let newStrategy = JSON.parse(JSON.stringify(this.item));
                    newStrategy.portfolio.trades = tradesSubset;
                    this.$parent.$parent.$parent.$parent.$parent.updateStrategies(newStrategy);
                    this.newTrade = {numberOfPositions: 1, openDate: moment().format("YYYY-MM-DD"), closeDate: moment().format("YYYY-MM-DD"), last: this.item.last};
                }
            },
            duplicateTrade(trade) {
                console.log("duplicateTrade() starting. trade=", JSON.parse(JSON.stringify(trade)));
                let trades = JSON.parse(JSON.stringify(this.item.portfolio.trades));
                console.log("trades=", trades);

                let maxId = trades.length === 0 ? -1 : Math.max(...this.item.portfolio.trades.map(x => x.id));
                console.log("maxId=", maxId);
                trade.id = maxId + 1;
                trades.push(trade);
                console.log("trades=", JSON.parse(JSON.stringify(trades)));

                let newStrategy = JSON.parse(JSON.stringify(this.item));
                newStrategy.portfolio.trades = trades;
                // console.log("this.$parent.$parent.$parent.$parent.$parent=", this.$parent.$parent.$parent.$parent.$parent);
                this.$parent.$parent.$parent.$parent.$parent.updateStrategies(newStrategy);
               // this.newTrade = {numberOfPositions: 1, openDate: moment().format("YYYY-MM-DD"), closeDate: moment().format("YYYY-MM-DD"), last: this.item.last};
            },
            getChart(trade) {
                console.log("getChart() starting. trade=", trade);
                let program = this.newProgram;
                this.newProgram = null;
                // console.log("program=", program, " this.newProgram=", this.newProgram);

                let mergedItem = JSON.parse(JSON.stringify(this.item));
                console.log("mergedItem=", mergedItem);

                mergedItem.program = program;
                mergedItem.open = trade.openDate;
                mergedItem.close = trade.closeDate;
                mergedItem.showTradingPeriod = true;
                mergedItem.zoomToSavedCoordinates = false;
                mergedItem.aligned = false;
                mergedItem.y1 = 15;
                
                let role = this.$store.state.user.role;
               let initialState = createInitialState(program, role, mergedItem);
               console.log("initialState =", JSON.parse(JSON.stringify(initialState)));
               this.$store.dispatch('newTabWithInitialState', initialState);
            }
        }
    }
</script>
