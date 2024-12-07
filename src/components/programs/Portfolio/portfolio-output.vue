<template>
    <div style="border-top: 1px solid darkgray; border-right: 1px solid darkgray; border-bottom: 1px solid darkgray; width: 100%;
         padding: 10px; background-color: white; font-size: 1.0rem; margin: -8px 0 0 0">

        <!--showAllPortfolioFolders={{showAllPortfolioFolders}} -->

        <table>
            <tr>
                <td style="font-size: 2.5rem; padding: 0 0 4px 0"> Portfolio </td> 
                <td>
            <portfolio-folders v-bind:namespace="namespace"></portfolio-folders>
            </td>
            <td >
            <b-button v-if="!showAllPortfolioFolders" @click="deleteFolder" variant="warning" size="sm" id="portfolio-delete-folder"
                      style="border: 1px solid darkgray; margin: 0 0 2px 5px;">
                delete folder
            </b-button> 
            </td>
            </tr>
        </table>

        <div style="border: 1px solid darkgray; width: 1150px;">

            <b-table :items="filteredStrategies" :fields="fields" sort-icon-right class="portfolio-output-table" :key="componentKey" style="text-align: right">

                <template #head()="data">
                    <b-row><b-col class="text-sm-right"><b>{{ data.label }}</b></b-col></b-row>
                </template>

                <template #head(actions)="data">
                    <b-row><b-col class="text-sm-center"><b>{{ data.label }}</b></b-col></b-row>
                </template>

                <template #head(tools)="data">
                    <b-row><b-col class="text-sm-center"><b>{{ data.label }}</b></b-col></b-row>
                </template>


                <template #row-details="row">

                    <portfolio-trades-table
                        v-if="row.item.portfolio.detailsType === 'trades'"
                        v-bind:namespace="namespace"
                        v-bind:item="row.item"
                        :ref="'portfolio-trades-table'"
                        style="margin: 0 0px 16px 30px"></portfolio-trades-table> 

                    <alarms-table
                        v-if="row.item.portfolio.detailsType === 'alarms'"
                        v-bind:namespace="namespace"
                        v-bind:ticker="row.item.ticker"
                        v-bind:portfolioId="row.item.portfolio.id"
                        v-bind:alarms="alarms[row.item.portfolio.id]"
                        v-bind:item="row.item"
                        :ref="'portfolio-alarms-table'"
                        style="margin: 0 0px 16px 30px"></alarms-table>

                </template>

                <template v-slot:cell(displayTickerWithUnitMoves)="{value, item, field}">
                   <span :id="'portfolioTicker-'+strategyIds.indexOf(item.portfolio.id)">{{ value }}</span>
                </template>

                <template v-slot:cell(buySell)="{value, item, field}">
                   <span :id="'portfolioBuySell-'+strategyIds.indexOf(item.portfolio.id)">{{ value }}</span>
                </template>

                <template v-slot:cell(portfolio.numberOfOpenPositions)="{value, item, field}">
                   <span :id="'portfolioNumberOfOpenPositions-'+strategyIds.indexOf(item.portfolio.id)">{{ value }}</span>
                </template>

                <template v-slot:cell(portfolio.folder)="{value, item, field}">
                    <b-form-select v-if="userRow && userRow.portfolio.id === item.portfolio.id" size="sm" 
                                   style="border: 1px solid gray; width: auto; border-radius: 3px; margin: -7px 0 0 0"
                                   v-model="item.portfolio.folder" :options="folderOptions.map(x => x.folder).sort()" @change="updateStrategies(item)">
                    </b-form-select> 
                    <template v-else>{{ value }}</template>
                </template>

                <template v-slot:cell(actions)="{ item }">
                    <span>
                        <span @click="toggleTrades(item)" :id="'tradesIcon-'+strategyIds.indexOf(item.portfolio.id)"> 
                            <Icon style="color: #404040; margin: -4px 0px 0px 0px; cursor: pointer;" icon="ci:search-magnifying-glass" width="27" height="27"
                                  v-b-tooltip.noninteractive.hover.topleft="'show/hide trades'"/>
                        </span>
                        <span @click="toggleAlarms(item)" :id="'portfolio-alarms-icon-'+strategyIds.indexOf(item.portfolio.id)"> 
                            <Icon style="color: #404040; margin: -4px 4px 0px 0px; cursor: pointer;" icon="mdi:bell-alert-outline" width="27" height="27"
                                  v-b-tooltip.noninteractive.hover.topleft="'show/hide alarms'"
                                  v-bind:style="{color: item.portfolio.alarmTriggered ? 'red' : 'black'}"
                                  />
                        </span>
                        <span v-if="showAllPortfolioFolders" @click="changeFolder(item)"> 
                            <Icon style="color: #404040; margin: -4px 4px 0px 0px; cursor: pointer;" icon="codicon:file-symlink-directory" width="27" height="27"
                                  v-b-tooltip.noninteractive.hover.topleft="'change folder'"/>
                        </span>
                        <span @click="removeStrategy(item)" :id="'portfolio-delete-icon-'+strategyIds.indexOf(item.portfolio.id)">
                            <Icon style="margin: -4px 4px 0px 0px; cursor: pointer;" icon="ion:trash-outline" width="25" height="25"
                                  v-b-tooltip.noninteractive.hover.topleft="'delete'"  />
                        </span>
                    </span>
                </template>

                <template v-slot:cell(tools)="{ item }">
                    <b-form-select style="border: 1px solid black; width: auto; margin: -1px 0 0 0;
                                   padding-top: 1px; background-color: gray; color: white; height: 22px"
                                   v-model="newProgram" :options="programOptions"
                                   size="sm" @change="getChart(item)">
                    </b-form-select>
                </template>

            </b-table>
        </div>

        <div style=" padding: 10px 0 0px 0">
            <table style="font-size: 1.5rem;">
                <tr>
                    <td style="padding: 0 60px 0 10px">total realized profit: {{totalRealizedProfit}}</td>
                    <td style="padding: 0 60px 0 10px">total unrealized profit: {{totalUnrealizedProfit}}</td>
                    <td>total profit: {{totalProfit}}</td>
                </tr>
            </table> 
        </div>
    </div>
</template>

<style scoped>

    ::v-deep .portfolio-output-table td{
        color: black;
        padding: 9px 6px 2px 6px;
    }

    ::v-deep .portfolio-output-table tfoot{
        background-color: white;
        border-top: 1px solid gray;
    }

</style>

<script>

    import * as fb from "@/firebase";
    import {spreadTitle, areSameUnitsAndUnitMoves, storeTab} from "@/js/main";
    import $ from "jquery";
    import moment from 'moment';
    import { Icon } from '@iconify/vue2';
    import portfolioFolders from '@/components/portfolio-folders';
    import portfolioTradesTable from '@/components/portfolio-trades-table';
    import alarmsTable from '@/components/alarms-table';
    import { createInitialState } from '@/js/createInitialState.js';

    export default {
        components: {
            Icon, portfolioFolders, portfolioTradesTable, alarmsTable
        },
        ruleComparatorTextToSymbol: [// <-- non-reactive property
            {text: 'above', symbol: '>'},
            {text: 'at or above', symbol: '>='},
            {text: 'below', symbol: '<'},
            {text: 'at or below', symbol: '<='}
        ],
        mounted() {
            console.log("portfolio-output.vue mounted() starting. this.namespace=", this.namespace/*, " this.strategyIds=", this.strategyIds*/);
            this.userEmail = this.$store.state.user.email;

            this.$store.dispatch('user/bindStrategies').then(() => {  // Take a look at https://stackoverflow.com/questions/60601094/how-to-wait-on-vuex-state-initialization-from-a-view-component
                //console.log("data=", data);
                this.getStrategies();
            });

            //  let that = this;
            //  var CronJob = require('cron').CronJob;
            //  new CronJob(
            //          '0 */2 18-20 * * 1-5', // */2 is for testing. Change to */20 for production
            //          function () {
            //              that.getStrategies();
            //              console.log('Retrieving strategies, America/Los_Angeles time=', moment().format("h:mm:ss a"));
            //          },
            //          null,
            //          true,
            //          'America/Los_Angeles'
            //          );

        },
        props: ['namespace'],
        data: function () {
            return{
                componentKey: 0,
                strategies: [],
                strategyIds: [],
                alarms: [],
                alarmSnapshot: {},
                userRow: null,
                totalRealizedProfit: null,
                totalUnrealizedProfit: null,
                totalProfit: null,
                lastBarArray: [],
                sortBy: 'open',
                sortDesc: false,
                fields: [
                    // {key: 'portfolio.id', label: "id", sortable: true, editable: true},
                    {key: 'displayTickerWithUnitMoves', label: "ticker", sortable: true},
                    {key: 'buySell', label: "side", sortable: true},
                    {key: 'portfolio.numberOfOpenPositions', label: "# open", sortable: true, editable: true},
                    {key: 'portfolio.numberOfClosedPositions', label: "# closed", sortable: true, editable: true},
                    //   {key: 'open', label: "entry date", sortable: true, formatter: this.fullTableFormatDateAssigned},
                    // {key: 'portfolio.openPrice', label: "entry price", sortable: true},
                    //    {key: 'close', label: "exit date", sortable: true, formatter: this.fullTableFormatDateAssigned},
                    //  {key: 'portfolio.closePrice', label: "exit price", sortable: true},
                    // {key: 'portfolio.commission', label: "commission", sortable: true, formatter: this.formatMonetaryQuantities},
                    {key: 'last', label: "last price", sortable: true},
                    {key: 'portfolio.realizedProfit', label: "realized profit", sortable: true, formatter: this.formatMonetaryQuantities},
                    {key: 'portfolio.unrealizedProfit', label: "unrealized profit", sortable: true, formatter: this.formatMonetaryQuantities},
                    //   {key: 'portfolio.profit', label: "profit", sortable: true, formatter: this.formatMonetaryQuantities},
                    {key: 'portfolio.folder', label: 'folder', sortable: true},
                    {key: 'actions', label: 'actions'},
                    {key: 'tools', label: 'tools'},
                ],
                options: [
                    {text: 'buy', value: 'buy'},
                    {text: 'sell', value: 'sell'}
                ],
                numberOfPositionsOptions: Array(1000).fill().map((x, i) => ({value: i + 1, text: i + 1})),
                programOptions: [
                    {value: null, text: 'Select Chart'},
                    {value: 'Calculator', text: 'Calculator'},
                    {value: 'BasicChartsNew', text: 'Futures Chart'},
                    {value: 'History', text: 'History Charts'},
                    {value: 'LongTermCharts', text: 'Long Term Charts'},
                            //  {value: 'TradeMaps', text: 'Trade Maps'} // close might not exist.
                ],
                newProgram: null,
                newFolder: "",
                showNewFolderName: false
            };
        },
        computed: {
            filteredStrategies() {
                return this.showAllPortfolioFolders == true ? this.strategies : this.strategies.filter(x => x.portfolio.folder === this.portfolioDirectory);
            },
            symbols() {
                return this.$store.state.user.symbols;
            },
            email() {
                return this.$store.state.user.email;
            },
            portfolioDirectory: {
                get() {
                    return this.$store.state.user.portfolioDirectory;
                },
                set(/*portfolioDirectory*/) {
                    //this.$store.commit('user/setPortfolioDirectory', portfolioDirectory);
                }
            },
            folderOptions() {
                let options = this.$store.getters["user/portfolioFolders"];
                if (this.newFolder !== "") {
                    options.push(this.newFolder);
                    // console.log("options=", options);
                }
                return options.sort();
            },
            showAllPortfolioFolders: {
                get() {
                    return this.$store.state.user.showAllPortfolioFolders;
                },
                set() {}
            },
            uid() {
                return this.$store.state.user.uid;
            },
            activeModuleName() {
                let activeModuleName = this.$store.getters["activeModuleName"];
                console.log("activeModuleName=", activeModuleName);
                return activeModuleName;
            },
            getStrategiesFromStore() {
                console.log("getStrategiesFromStore() starting.");
                return this.$store.state.user.strategies;
            }
        },
        watch: {
            activeModuleName(activeModuleName) {
                console.log("watching activeModuleName=", activeModuleName);
                if (activeModuleName === this.namespace) {
                    this.forceRerender();
                }
            },
            portfolioDirectory(portfolioDirectory) {
                console.log("watching portfolioDirectory=", portfolioDirectory);
                this.totalProfit = this.setTotalProfit();
                this.calculateStrategyProfits();
            },
            showAllPortfolioFolders(showAllPortfolioFolders) {
                // console.log("watching showAllPortfolioFolders=", showAllPortfolioFolders);
                this.totalProfit = this.setTotalProfit();
                this.upDateShowAllPortfolioFolders(showAllPortfolioFolders);
                this.calculateStrategyProfits();
            },
            symbols(symbols) {
                console.log("watching symbols=", symbols);
                this.getStrategies();
            },
            getStrategiesFromStore(getStrategiesFromStore) {
                console.log("watching getStrategiesFromStore=", getStrategiesFromStore);
                this.getStrategies();
            }
        },
        methods: {
            forceRerender() {
                this.componentKey += 1;
            },
            deleteFolder() {
                console.log("deleteFolder() starting. this.portfolioDirectory=", this.portfolioDirectory);
                console.log("this.folderOptions=", this.folderOptions);
                if (['Tradebook', 'Watchlist', 'Archive'].includes(this.portfolioDirectory)) {
                    alert('Cannot delete "Tradebook" , "Watchlist" or "Archive" folders.');
                } else {
                    let that = this;
                    let folderId = this.folderOptions.find(x => x.folder === that.portfolioDirectory).id;
                    console.log("folderId=", folderId);

                    this.removeFolder(folderId);

                    let strategiesToDelete = this.strategies.filter(x => {
                        console.log("x=", JSON.parse(JSON.stringify(x)));
                        return x.portfolio.folder === that.portfolioDirectory;
                    });
                    console.log("strategiesToDelete=", strategiesToDelete);

                    strategiesToDelete.forEach(x => that.removeStrategy(x));
                }
                console.log("this.folderOptions=", this.folderOptions);
            },
            ruleTargetToValue(target, lastBar) {
                //console.log("ruleTargetToValue() starting. target=", target, " lastBar=", lastBar);
                return target.includes("rsi") ? lastBar.rsi : lastBar.close;
            },
            checkAlarmRules() {
                console.log("checkAlarmRules() starting.");
                // console.log("this.lastBarArray=", JSON.parse(JSON.stringify(this.lastBarArray)));
                // console.log("this.alarms=", JSON.parse(JSON.stringify(this.alarms)));

                let that = this;
                let strategyAlarmTestArray = [];
                this.strategyIds.forEach((strategyId, i) => {
                    // console.log("strategyId=", strategyId);
                    let strategyAlarms = that.alarms[strategyId];
                    // console.log("strategyAlarms=", strategyAlarms);

                    let strategy = that.strategies.find(x => x.portfolio.id === strategyId);
                    if (typeof strategyAlarms !== 'undefined') {
                        strategyAlarms.forEach(alarm => {
                            // console.log("alarm.id=", alarm.id);
                            let lastBar = that.lastBarArray.find(bar => bar.ticker === alarm.ticker);
                            if (!['triggered', 'notified'].includes(alarm.status) && that.checkAlarmRule(alarm, lastBar)) {
                                // console.log("AAAAAAAAAAAAAAA");
                                alarm.status = "triggered";
                                alarm.notificationDate = moment().format("MMM D, YYYY");
                                fb.database.ref('alarms/' + this.uid + '/' + alarm.portfolioId + '/' + alarm.id).set(alarm);
                            }
                        });

                        strategyAlarmTestArray[i] = strategyAlarms.some(x => x.status === "triggered");
                        // console.log("strategyAlarmTestArray[" + i + "]=", strategyAlarmTestArray[i]);
                        strategy.portfolio.alarmTriggered = strategyAlarmTestArray[i];
                    } else {
                        strategy.portfolio.alarmTriggered = false;
                    }
                });
                // console.log("strategyAlarmTestArray=", strategyAlarmTestArray);
                let portfolioAlarmTriggered = strategyAlarmTestArray.some(x => x === true);
                // console.log("portfolioAlarmTriggered=", portfolioAlarmTriggered);
                this.$store.commit('siteData/setPortfolioAlarmTriggered', portfolioAlarmTriggered);
            },
            checkAlarmRule(alarm, lastBar) {
                //console.log("checkAlarmRule() starting. alarm=", JSON.parse(JSON.stringify(alarm)), " lastBar=", JSON.parse(JSON.stringify(lastBar)));
                let targetValue = this.ruleTargetToValue(alarm.ruleTarget, lastBar);
                // console.log("targetValue=", targetValue);

                let comparatorSymbol = this.$options.ruleComparatorTextToSymbol.find(x => x.text === alarm.ruleComparator).symbol;
                //console.log("comparatorSymbol=", comparatorSymbol);

                let testEquation = targetValue + " " + comparatorSymbol + " " + alarm.value;
                // console.log("testEquation=", testEquation);

                let result = eval(testEquation);
                // console.log("result=", result);
                return result;
            },
            getAlarms() {
                console.log("getAlarms() starting.");
                fb.database.ref('alarms/' + this.uid).on('value', snapshot => {
                    // console.log("alarms snapshot=", snapshot.val());
                    //  let alarmSnapshot = snapshot.val();
                    //  console.log("this.alarmSnapshot=", this.alarmSnapshot);

                    if (snapshot.val() !== null) {
                        let strategyIds = this.strategyIds;
                        //  console.log("strategyIds=", strategyIds);

                        let result = strategyIds.reduce((accumulator, strategyId) => {
                            // console.log("strategyId=", strategyId);
                            // console.log("accumulator=", accumulator);
                            // console.log("snapshot.val()[strategyId]=", snapshot.val()[strategyId]);
                            let alarms = typeof snapshot.val()[strategyId] !== 'undefined' ? Object.values(snapshot.val()[strategyId]) : [];
                            // console.log("alarms=", alarms);
                            let filteredAlarms = alarms.filter(x => x !== 'empty');
                            // console.log("filteredAlarms=", filteredAlarms);
                            //  let obj = {[strategyId]: Array.isArray(filteredAlarms) ? filteredAlarms : Object.values(filteredAlarms)};
                            //  console.log("obj=", obj);
                            accumulator[strategyId] = Array.isArray(filteredAlarms) ? filteredAlarms : Object.values(filteredAlarms);
                            // console.log("accumulator=", accumulator);
                            return accumulator;
                        }, {});
                        // console.log("result=", result);
                        this.alarms = JSON.parse(JSON.stringify(result));
                    } else {
                        console.log("no alarms");
                    }
                    this.checkAlarmRules();
                });
            },
            toggleAlarms(item) {
                console.log("toggleAlarms() starting. item.portfolio.detailsType=", item.portfolio.detailsType);
                item._showDetails = item.portfolio.detailsType === 'alarms' ? !item._showDetails : true;
                item.portfolio.detailsType = "alarms";
                this.userRow = item;
                this.updateStrategies();
                this.userRow = null;
            },
            openAlarms(item) {
                console.log("toggleAlarms() starting. item.portfolio.detailsType=", item.portfolio.detailsType);
                item._showDetails = true;
                item.portfolio.detailsType = "alarms";
                this.userRow = item;
                this.updateStrategies();
                this.userRow = null;
            },
            toggleTrades(item) {
                console.log("toggleTrades() starting. item.portfolio.detailsType=", item.portfolio.detailsType);
                item._showDetails = item.portfolio.detailsType === 'trades' ? !item._showDetails : true;
                item.portfolio.detailsType = "trades";
                this.userRow = item;
                this.updateStrategies();
                this.userRow = null;
            },
            openTrades(item){
                console.log("openTrades() starting. item.portfolio.detailsType=", item.portfolio.detailsType);
                item._showDetails =  true;
                item.portfolio.detailsType = "trades";
                this.userRow = item;
                this.updateStrategies();
                this.userRow = null;
            },
            upDateShowAllPortfolioFolders(showAllPortfolioFolders) {
                console.log("upDateShowAllPortfolioFolders() starting. showAllPortfolioFolders=", showAllPortfolioFolders);
                fb.usersCollection
                        .doc(this.email)
                        .update({"showAllPortfolioFolders": showAllPortfolioFolders})
                        .then(() => {
                            console.log('showAllPortfolioFolders updated.');
                        }).catch((error) => {
                    // The document probably doesn't exist.
                    console.error("Error updating document: ", error);
                });
            },
            changeFolder(item) {
                console.log("changeFolder() starting. item=", item);
                this.userRow = this.userRow === item ? null : item;
            },
            duplicate(item) {
                console.log("duplicate() starting. item=", item);
                fb.db.collection("portfolio-alpha")
                        .doc(this.email)
                        .collection("strategies")
                        .add(item)
                        .then((/*docRef*/) => {
                            // console.log("Document written with ID: ", docRef.id);
                            // console.log('chart saved.');
                            this.result = "Success.";
                        });
            },
            getChart(item) {
                console.log("getChart() starting. item=", item);
                let program = this.newProgram;
                this.newProgram = null;
                console.log("program=", program, " this.newProgram=", this.newProgram);

                item.program = program;
                item.showTradingPeriod = false;
                item.aligned = false;
                item.y1 = 15;
                item.seasonalTypes = ["adjusted"];
                item.showCalculatorChart = true;
                item.addVolumeProfile = true;
                item.chartParameters.chartsPerRow = 2;
                item.zoomToSavedCoordinates = false;

                let role = this.$store.state.user.role;
                let initialState = createInitialState(program, role, item);
                console.log("initialState =", JSON.parse(JSON.stringify(initialState)));
                this.$store.dispatch('newTabWithInitialState', initialState);
            },
            formatDateAssigned(date) {
                const formattedDate = moment(date).format("YYYY-MM-DD");
                return formattedDate;
            },
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
            mySortCompare(a, b, key) {
                if (['open', 'close'].includes(key)) {
                    // Assuming the date field is a `Date` object, subtraction
                    // works on the date serial number (epoch value)
                    //  console.log("mySortCompare() starting. a=", a, " b=", b, "key=", key);
                    //  console.log("a[" + key + "]=", a[key]);
                    return moment(a[key]).unix() - moment(b[key]).unix();
                } else {
                    // Let b-table handle sorting other fields (other than `date` field)
                    return false;
                }
            },
            getStrategies() {
                console.log("getStrategies() starting.");
                console.log("this.getStrategiesFromStore=", this.getStrategiesFromStore);

                let stateArray = this.getStrategiesFromStore;
                stateArray.forEach(form => {
                    // console.log("form.id=", form.id);
                    form.portfolio.id = form.id;
                });

                console.log("stateArray=", stateArray);
                console.log("stateArray.length=", stateArray.length);

                let that = this;
                if (stateArray.length > 0) {
                    this.getLastBar(stateArray).then(parsedData => {
                        console.log("parsedData=", parsedData);

                        if (parsedData !== null) {
                            stateArray.forEach(form => {
                                let ticker = that.getTicker(form, "old");
                                console.log("ticker=", ticker);

                                form.ticker = ticker;
                                form.displayTickerWithUnitMoves = that.getTicker(form, that.symbols);
                                let lastBar = parsedData.find(x => x.ticker === form.ticker);
                                // console.log("form.ticker=", form.ticker, " lastBar=", lastBar);
                                form.last = lastBar.close;
                                // form.portfolio._showDetails = false;
                            });
                            that.lastBarArray = parsedData;
                            that.strategies = stateArray;
                            // console.log("that.strategies=", that.strategies);
                            that.strategyIds = that.strategies.map(x => x.portfolio.id);
                            // console.log("that.strategyIds=", that.strategyIds);
                            that.calculateStrategyProfits();
                            that.getAlarms();
                        }
                    });
                } else {
                    that.lastBarArray = [];
                    that.strategies = [];
                    that.strategyIds = [];
                    that.calculateStrategyProfits();
                }
                console.log("that.namespace=", that.namespace);

                console.log("that.$store.state[that.namespace]=", that.$store.state[that.namespace]);
                let generalForm = JSON.parse(JSON.stringify(that.$store.state[that.namespace]));
                console.log("generalForm=", generalForm);
                storeTab(generalForm, that.$store.state.user.email);
            },
            updateStrategies(row) {
                console.log("updateStrategies() starting. row=", row);
                // console.log("this.userRow=", this.userRow);
              /*  if (typeof row !== 'undefined') {
                    console.log("row.portfolio=", JSON.parse(JSON.stringify(row.portfolio)));
                    console.log("row.portfolio.trades=", JSON.parse(JSON.stringify(row.portfolio.trades)));
                    row.portfolio.trades.forEach(trade => {
                        console.log("trade=", trade);
                        if (typeof trade.closePrice === 'undefined') {
                            trade.closeDate = "";
                        }
                    });
                } */
                let uploadItem = typeof row === 'undefined' ? JSON.parse(JSON.stringify(this.userRow)) : row;
                fb.db.collection("portfolio-alpha")
                        .doc(this.email)
                        .collection("strategies")
                        .doc(uploadItem.portfolio.id)
                        .update(uploadItem)
                        .then(() => {
                            console.log('Update complete.');
                            this.userRow = null;
                        });

            },
            upDatePortfolioDirectory(portfolioDirectory) {
                console.log("upDatePortfolioDirectory() starting. portfolioDirectory=", portfolioDirectory);
                fb.usersCollection
                        .doc(this.email)
                        .update({"portfolioDirectory": portfolioDirectory})
                        .then(() => {
                            console.log('portfolioDirectory updated.');
                            this.getStrategies();
                        }).catch((error) => {
                    // The document probably doesn't exist.
                    console.error("Error updating document: ", error);
                });
            },
            moment(date) {              // https://stackoverflow.com/questions/34308004/moment-js-with-vuejs
                return moment(date);
            },
            getTicker(form, symbols) {
                let invertDatesMultiplier = 1;
                let noLegSwapping = true;
                let includeUnitMoves = true;
                let ticker = spreadTitle(JSON.parse(JSON.stringify(form)), invertDatesMultiplier, noLegSwapping, symbols, includeUnitMoves);
                // console.log("ticker=", ticker);
                return ticker;
            },
            removeStrategy(item) {
                console.log("removeStrategy() starting. item.portfolio=", item.portfolio);
                // if (confirm("Are you sure you want to delete this strategy?")) {
                fb.db.collection("portfolio-alpha")
                        .doc(this.email)
                        .collection("strategies")
                        .doc(item.portfolio.id).delete().then(() => {
                    console.log("strategy deleted. this.folderOptions=", this.folderOptions);
                    /*  this.folderOptions.length > 0 ? this.upDatePortfolioDirectory(this.folderOptions[0]) : 
                     this.upDatePortfolioDirectory("main"); */

                    fb.database.ref('alarms/' + this.uid + '/' + item.portfolio.id).remove();
                });
                // } 
            },
            removeFolder(id) {
                console.log("removeFolder() starting. id=", id);
                if (confirm("Are you sure you want to delete this folder?")) {
                    fb.db.collection("portfolio-alpha")
                            .doc(this.email)
                            .collection("folders")
                            .doc(id).delete().then(() => {
                        console.log("folder deleted. this.folderOptions=", this.folderOptions);
                        console.log("this.folderOptions.length=", this.folderOptions.length);
                        if (this.folderOptions.length > 0) {
                            this.upDatePortfolioDirectory(this.folderOptions[0].folder);
                        } else {
                            this.upDatePortfolioDirectory("tradebook");
                        }
                    });
                }
            },
            calculateTradeRowProfit(trade) {
                console.log("calculateTradeRowProfit() starting. trade=", JSON.parse(JSON.stringify(trade)));
                //  console.log(trade.ticker + ": trade.last=", trade.last);

                let commission = typeof trade.commission === 'undefined' ? 0.00 : trade.commission;
                // console.log("trade.openPrice=", trade.openPrice);
                if (typeof trade.openPrice !== 'undefined' && trade.openPrice !== null && trade.openPrice !== "") {
                    // console.log("trade.numberOfPositions=", trade.numberOfPositions);

                    if (typeof trade.closePrice !== 'undefined' && trade.closePrice !== null && trade.closePrice !== "") {
                        let profit = (trade.numberOfPositions * (trade.closePrice - trade.openPrice) * trade.unitMove) - commission;
                        console.log("profit=", profit);
                        trade.realizedProfit = profit;
                        trade.profit = profit;
                        trade.unrealizedProfit = 0;
                    } else {
                        // console.log("No exit price.");
                        trade.realizedProfit = 0;
                        trade.unrealizedProfit = trade.numberOfPositions * (trade.last - trade.openPrice) * trade.unitMove;
                        trade.profit = trade.unrealizedProfit;
                        console.log("trade=", JSON.parse(JSON.stringify(trade)));
                    }
                } else {
                    trade.realizedProfit = 0;
                    trade.profit = 0;
                    trade.unrealizedProfit = 0;
                }
                return trade;
            },
            calculateStrategyRowProfit(form) {
                console.log("calculateStrategyRowProfit() starting. form.ticker=", form.ticker);

                let lastBar = this.lastBarArray.find(x => x.ticker === form.ticker);
                //  console.log("lastBar=", lastBar);
                form.last = lastBar.close;
                // console.log("form.last=", form.last);

                let areSame = areSameUnitsAndUnitMoves(form.selected[0])
                // console.log("areSame=", areSame);
                let unitMove = areSame ? form.unitMove[0] : 1;

                form.portfolio.trades.forEach(trade => {
                    trade.last = form.last;
                    trade.ticker = form.ticker;
                    trade.unitMove = unitMove;
                    this.calculateTradeRowProfit(trade);
                });

                let tradesRealizedProfitArray = form.portfolio.trades.map(x => x.realizedProfit);
                let tradesUnrealizedProfitArray = form.portfolio.trades.map(x => x.unrealizedProfit);
                let tradesProfitArray = form.portfolio.trades.map(x => x.profit);
                // let entryPriceArray = form.portfolio.trades.map(x => x.openPrice);
                // let exitPriceArray = form.portfolio.trades.map(x => x.closePrice);
                let entryExitPriceArray = form.portfolio.trades.map(x => ({open: x.openPrice, close: x.closePrice}));

                /*  console.log("tradesRealizedProfitArray=", tradesRealizedProfitArray);
                 console.log("tradesUnrealizedProfitArray=", tradesUnrealizedProfitArray);
                 console.log("tradesProfitArray=", tradesProfitArray);
                 console.log("exitPriceArray=", exitPriceArray); 
                 console.log("entryExitPriceArray=", entryExitPriceArray); */

                let totalTradesRealizedProfit = tradesRealizedProfitArray
                        .filter(x => typeof x !== 'undefined')
                        .reduce((sum, x) => sum + x, 0);

                let totalTradesUnrealizedProfit = tradesUnrealizedProfitArray
                        .filter(x => typeof x !== 'undefined')
                        .reduce((sum, x) => sum + x, 0);

                let totalTradesProfit = tradesProfitArray
                        .filter(x => typeof x !== 'undefined')
                        .reduce((sum, x) => sum + x, 0);

                let numberOfClosedPositions = entryExitPriceArray.filter(x => (typeof x.open !== 'undefined' && x.open !== "" && typeof x.close !== 'undefined' && x.close !== "")).length;
                let numberOfOpenPositions = entryExitPriceArray.filter(x => (typeof x.open !== 'undefined' && x.open !== "" && (typeof x.close === 'undefined' || x.close === ""))).length;

                /*   console.log("totalTradesRealizedProfit=", totalTradesRealizedProfit);
                 console.log("totalTradesUnrealizedProfit=", totalTradesUnrealizedProfit);
                 console.log("totalTradesProfit=", totalTradesProfit);
                 console.log("numberOfOpenPositions=", numberOfOpenPositions);
                 console.log("numberOfClosedPositions=", numberOfClosedPositions); */

                form.portfolio.unrealizedProfit = totalTradesUnrealizedProfit;
                form.portfolio.realizedProfit = totalTradesRealizedProfit;
                form.portfolio.profit = totalTradesProfit;
                form.portfolio.numberOfOpenPositions = numberOfOpenPositions;
                form.portfolio.numberOfClosedPositions = numberOfClosedPositions;
            },
            calculateStrategyProfits() {
                console.log("calculateStrategyProfits() starting.");
                this.strategies.forEach(form => {
                    this.calculateStrategyRowProfit(form);
                    // console.log("form.portfolio=", form.portfolio);
                });
                this.setTotalProfit();
            },
            setTotalProfit() {
                //  console.log("setTotalProfit() starting.");
                let realizedProfitArray = this.filteredStrategies.map(x => x.portfolio.realizedProfit);
                // console.log("realizedProfitArray=", realizedProfitArray);
                let totalRealizedProfit = this.formatMonetaryQuantities(realizedProfitArray
                        .filter(x => typeof x !== 'undefined')
                        .reduce((sum, x) => sum + x, 0));
                this.totalRealizedProfit = totalRealizedProfit;

                let unrealizedProfitArray = this.filteredStrategies.map(x => x.portfolio.unrealizedProfit);
                // console.log("unrealizedProfitArray=", unrealizedProfitArray);
                let totalUnrealizedProfit = this.formatMonetaryQuantities(unrealizedProfitArray
                        .filter(x => typeof x !== 'undefined')
                        .reduce((sum, x) => sum + x, 0));
                this.totalUnrealizedProfit = totalUnrealizedProfit;

                let profitArray = this.filteredStrategies.map(x => {
                    // console.log("realizedProfit=", x.realizedProfit);
                    return x.portfolio.profit;
                });
                // console.log("profitArray=", profitArray);
                let totalProfit = this.formatMonetaryQuantities(profitArray
                        .filter(x => typeof x !== 'undefined')
                        .reduce((sum, x) => sum + x, 0));
                this.totalProfit = totalProfit;
            },
            getLastBar(generalFormArray) {
                console.log("getLastBar() starting. this.activeModuleName=", this.activeModuleName, " this.namespace=", this.namespace);
                console.log("generalFormArray=", generalFormArray);
                // console.trace();
                let that = this;
                return new Promise((resolve) => {
                    // if (that.activeModuleName === that.namespace) {

                    // let generalFormArray = JSON.parse(JSON.stringify(that.strategies));
                    // console.log("generalFormArray=", generalFormArray);

                    let json = JSON.stringify(generalFormArray, null, 2);
                    var currentRequest = $.ajax({
                        url: that.$store.state.siteData.baseUrl + that.$store.state.siteData.contextName + "/RsiArrayControllerServlet/",
                        type: "POST",
                        data: {"json": json},
                        beforeSend: function () {
                            //  console.log("beforeSend starting.");
                            if (currentRequest != null) {
                                //  console.log("aborting previous request.");
                                currentRequest.abort();
                            }
                        },
                        success: function (data) {
                            // console.log("data=", data);
                            let parsedData = JSON.parse(data);
                            // console.log("parsedData=", parsedData);
                            resolve(parsedData);

                        }
                    });
                    /* } else {
                     resolve(null);
                     }*/
                });
            }
        }
    }
</script>
