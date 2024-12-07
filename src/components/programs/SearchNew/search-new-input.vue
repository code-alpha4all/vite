<template>
    <div style="text-align: left; width: fit-content; background-color: white; margin: 0 0 -4px -13px">

        <b-form inline id="search-step-1" style="padding-left: 1px; background-color: white; margin-top: 1px">

            <b-button-group id="search-step-1" style="border: 1px solid gray; padding: 3px; margin: 1px 5px 3px -2px;
                            background-color: darkblue; border-radius: 3px;">

             <b-form-select v-model="source" :options="sourceOptions" style="border:1px solid gray; margin: 1px -10px 0 0"></b-form-select>

                <span v-if="source !== 'spread'" style="border-radius: 4px; margin: 1px 5px 1px 10px">
                    <b-form-select v-if="source == 'singleCommodity'" v-model="commodity" :options="commodityOptions" style="border:1px solid gray;
                                   margin: 0px 0 -3px 0" ></b-form-select>
                    <group-selector v-if="source === 'group'" v-bind:namespace="namespace"></group-selector>
                </span>

             <commodity-box v-if="source === 'spread'" v-bind:namespace="namespace" style="margin: 0 0px 0 13px"
                               v-bind:max-legs="3"
                               v-bind:showMultSelector="false">
                    <template v-slot:contract-aligner>
                        <contract-aligner-nearest-open-selector v-bind:namespace="namespace"
                                                                v-bind:title="' Spread Aligner'"></contract-aligner-nearest-open-selector>     
                    </template>
                </commodity-box>   
              
            </b-button-group>                 

           
            <div id="search-step-0"></div>
            <v-tour name="searchTour" :steps="searchSteps" :options="{ debug: true }"></v-tour>

       

            <b-button-group style="color: white; border: 1px solid gray; padding: 3px; margin: 0px 5px 2px -2px; background-color: #9A7D0A; border-radius: 3px;">

                <span style="padding: 9px 0px 0 5px; font-weight: bold">trade period selectors:</span>
                <b-form-select v-model="tradePeriodExcludedSelector" :options="tradePeriodExcludedSelectorOptions"
                               style="border:1px solid gray; margin: 0px 6px 0px 2px;" ></b-form-select>
            
            </b-button-group>    

           <!-- <b-button v-on:click="startSearchTour"
                style="background-color: #9A0A54;  color: white; border: 1px solid gray; margin: 0 15px 0px 0px;">
                      Page Tour
            </b-button> -->
           
        </b-form>

    </div>
</template>

<style scoped>
    #checkbox-group-1 label {
        color: white
    }
</style>

<script>
    import {groupsObject, commodityMonths} from '@/js/main';
    import commodityBox from '@/components/commodity-box';
    import groupSelector from '@/components/group-selector';
    import contractAlignerNearestOpenSelector from '@/components/contract-aligner-nearest-open-selector';

    export default {
        components: {
            commodityBox, contractAlignerNearestOpenSelector, groupSelector
        },
        mounted() {
            console.log("search-input.vue mounted() starting. this.namespace=", this.namespace, "  this.$store.state[this.namespace].search.openStart=", this.$store.state[this.namespace].search.openStart);
            this.makeQuery();
        },
        props: ['namespace'],
        data: function () {
            let that = this;
            return {
                selectedLegs: [], // Must be an array reference!
                tradePeriodExcludedSelectorOptions: [
                    {value: 'endingRange', text: 'starting range, trade length'},
                    {value: 'startingRange', text: 'ending range, trade length'},
                    {value: 'tradeLength', text: 'starting range, ending range'}
                ],
                searchSteps: [
                    /* {
                     target: '#search-step-0',  // We're using document.querySelector() under the hood
                     header: {
                     title: 'Search Tour',
                     },
                     content: `Take a brief tour.`,
                     params: {
                     enableScrolling: false
                     }
                     }, */
                    {
                        target: '#search-step-1',
                        content: 'Select the instrument.',
                        params: {
                            placement: 'left',
                            enableScrolling: false
                        },
                        before: function () {
                            return new Promise((resolve) => {
                                // Time-consuming UI/async operation here.
                                console.log("that.$parent.$parent.$parent.$refs.tabsBox.$refs.sidebar=", that.$parent.$parent.$parent.$refs.tabsBox.$refs.sidebar);

                                that.$parent.$parent.$parent.$refs.tabsBox.$refs.sidebar.sidebarClosed = false;
                                resolve("foo");
                            });
                        }
                    },
                    {
                        target: '#search-step-2',
                        content: 'Select the date window.',
                        params: {
                            placement: 'left', // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
                            enableScrolling: false
                        }
                    },
                    {
                        target: '#search-step-3',
                        content: 'Select the ranking criterion.',
                        params: {
                            placement: 'left',
                            enableScrolling: false
                        }
                    },
                    {
                        target: '#search-step-4',
                        content: 'Add/remove further conditions.',
                        params: {
                            placement: 'left',
                            enableScrolling: false
                        }
                    },
                    {
                        target: '#search-step-5',
                        content: 'Name the tab (optional).',
                        params: {
                            placement: 'left',
                            enableScrolling: false
                        },
                        before: function () {
                            return new Promise((resolve) => {
                                // Time-consuming UI/async operation here.
                                console.log("that.$parent.$parent.$parent.$refs.tabsBox=", that.$parent.$parent.$parent.$refs.tabsBox);
                                console.log("that.$parent.$parent.$parent.$refs.tabsBox.$refs.sidebar=", that.$parent.$parent.$parent.$refs.tabsBox.$refs.sidebar);

                                // that.$parent.$parent.$parent.$refs.tabsBox.$refs.sidebar.sidebarClosed = true;
                                resolve("foo");
                            });
                        }
                    },
                ]
            }
        },
        computed: {
            numberOfContractsApartComparator: {
                get() {
                    return this.$store.state[this.namespace].search.numberOfContractsApartComparator;
                },
                set(numberOfContractsApartComparator) {
                    this.$store.commit(this.namespace + '/search/set', {key: "numberOfContractsApartComparator", value: numberOfContractsApartComparator});
                    this.makeQuery();
                }
            },
            numberOfContractsApartOptions() {
                console.log("numberOfContractsApartOptions() starting. this.source=", this.source);
                let numberOfMonths;
                if (["singleCommodity", "spread"].includes(this.source)) {
                    console.log("singleCommodity");
                    let commodity = this.$store.getters[this.namespace + '/c'][0];
                    numberOfMonths = commodityMonths(commodity).length;
                } else if (this.source === "all") {
                    numberOfMonths = 12;
                } else if (this.source === "group") {
                    let commodities = groupsObject[this.group].commodities;
                    console.log("commodities=", commodities);
                    let commodityMonthsArray = commodities.map(commodity => commodityMonths(commodity).length);
                    console.log("commodityMonthsArray=", commodityMonthsArray);
                    numberOfMonths = Math.max(...commodityMonthsArray);
                }
               // console.log("numberOfMonths=", numberOfMonths);

                let lowerBound = this.legs.includes(3) ? 2 : 1;
                let temp = Array(numberOfMonths + 1 -lowerBound).fill()
                        .map((x, i) => {
                            return {value: i + lowerBound, text: i + lowerBound};
                        });
                return temp;
            },
            numberOfContractsApart: {
                get() {
                    console.log("numberOfContractsApart.get() starting.");
                    return this.$store.state[this.namespace].numberOfContractsApart;
                },
                set(numberOfContractsApart) {
                    console.log("numberOfContractsApart.set() starting. numberOfContractsApart=", numberOfContractsApart);
                    this.$store.commit(this.namespace + '/setNumberOfContractsApart', numberOfContractsApart);
                }
            },
            sourceOptions() {
                let disabled = this.$store.state.user.role === "guest";
                let options = [
                    {value: 'singleCommodity', text: 'commodity'},
                    {value: 'group', text: 'group', disabled: disabled},
                    {value: 'all', text: 'all commodities', disabled: disabled}
                ];
                if (this.$store.state.user.email === "danscarr9@gmail.com") {
                    options.push({value: 'spread', text: 'contract or spread'});
                }
                return options;
            },
            ticker() {
                let ticker = this.$store.getters[this.namespace + "/ticker"];
                //console.log("ticker=", ticker);
                return ticker;
            },
            sortParameterOptions() {
                let options = [
                    {value: 'appd', text: 'appd'},
                    {value: 'rrr', text: 'avg mpe/avg mae '},
                    {value: 'avgMin', text: 'avg mae'},
                    {value: 'worstMin', text: 'worst mae'},
                    {value: 'avgMax', text: 'avg mpe'},
                    {value: 'bestMax', text: 'best mpe'}
                ];
                /*  if (this.$store.state.user.role === "superadmin") {
                 options.push({value: 'open', text: 'open'});
                 }*/
                return options;
            },
            tabTitle: {
                get() {
                    return this.$store.state[this.namespace].tabTitle;
                },
                set(tabTitle) {
                    this.$store.commit(this.namespace + '/setTabTitle', tabTitle);
                }
            },
            rowsPerPage: {
                get() {
                    return this.$store.state[this.namespace].chartParameters.rowsPerPage;
                },
                set(rowsPerPage) {
                    this.$store.commit(this.namespace + '/chartParameters/setRowsPerPage', rowsPerPage);
                    this.makeQuery();
                }
            },
            page: {
                get() {
                    return this.$store.state[this.namespace].chartParameters.page;
                },
                set(page) {
                    console.log("page=", page);
                    // this.$store.commit(this.namespace + '/chartParameters/setPage', page);
                    // this.makeQuery();
                }
            },
            commodityOptions() {
                return this.$store.getters["siteData/commoditiesArray"].map(x => {
                    return {value: x.symbol, text: x.name};
                });
            },
            commodity: {
                get() {
                    let commodity = this.$store.getters[this.namespace + '/c'][0];
                    return  commodity;
                },
                set(commodity) {
                    console.log("commodity.set() starting. this.numberOfContractsApart=", this.numberOfContractsApart);
                    this.$store.dispatch(this.namespace + '/changeCommodityLeg', {commodity: commodity, index: 0});
                    this.makeQuery();
                }
            },
            group() {
                return this.$store.getters[this.namespace + "/group"];
            },
            legs: {
                get() {
                    console.log("legs.get() starting.");
                    let temp = this.$store.state[this.namespace].search.legs;
                    if (!Array.isArray(temp)) {
                        temp = [1, 2, 3];
                        this.$store.commit(this.namespace + '/search/set', {key: "legs", value: temp});
                    }
                    return temp;
                },
                set(legs) {
                    this.$store.commit(this.namespace + '/search/set', {key: "legs", value: legs});
                    this.makeQuery();
                }
            },
            sortParameter: {
                get() {
                    return this.$store.state[this.namespace].search.sortParameter;
                },
                set(sortParameter) {
                    this.$store.commit(this.namespace + '/search/set', {key: "sortParameter", value: sortParameter});
                    this.makeQuery();
                }
            },
            position() {
                    return this.$store.state[this.namespace].search.position;
            },
            direction: {
                get() {
                    return this.$store.state[this.namespace].search.direction;
                },
                set(direction) {
                    this.$store.commit(this.namespace + '/search/set', {key: "direction", value: direction});
                    this.makeQuery();
                }
            },
            source: {
                get() {
                    return this.$store.state[this.namespace].search.source;
                },
                set(source) {
                    this.$store.commit(this.namespace + '/search/set', {key: "source", value: source});
                    this.makeQuery();
                }
            },
            minDays: {
                get() {
                    return this.$store.state[this.namespace].search.minDays;
                },
                set(minDays) {
                    console.log("minDays.set() starting. minDays=", minDays);
                    this.$store.commit(this.namespace + '/search/set', {key: "minDays", value: minDays});
                    this.makeQuery();
            }
            },
            maxDays: {
                get() {
                    return this.$store.state[this.namespace].search.maxDays;
                },
                set(maxDays) {
                    this.$store.commit(this.namespace + '/search/set', {key: "maxDays", value: maxDays});
                    this.makeQuery();
                }
            },
            userConditions() {
                return this.$store.state[this.namespace].search.userConditions;
            },
            indicatorConditions() {
                return this.$store.state[this.namespace].search.indicatorConditions;
            },
            rsi() {
                let rsi = this.indicatorConditions.find(x => x.parameter === 'rsi');
                console.log("rsi=", rsi);
                return typeof rsi !== 'undefined' ? rsi : {comparator: null, parameter: null, value: null};
            },
            openStart: {
                get() {
                    let openStart = this.$store.state[this.namespace].search.openStart;
                    console.log("get() openStart=", openStart);
                    return openStart;
                },
                set(openStart) {
                    this.$store.commit(this.namespace + '/search/setOpenStart', openStart);
                    // this.makeQuery();
                }
            },
            openEnd: {
                get() {
                    return this.$store.state[this.namespace].search.openEnd;
                },
                set(openEnd) {
                    this.$store.commit(this.namespace + '/search/setOpenEnd', openEnd);
                    // this.makeQuery();
                }
            },
            closeStart: {
                get() {
                    let closeStart = this.$store.state[this.namespace].search.closeStart;
                    console.log("get() closeStart=", closeStart);
                    return closeStart;
                },
                set(closeStart) {
                    this.$store.commit(this.namespace + '/search/setCloseStart', closeStart);
                    // this.makeQuery();
                }
            },
            closeEnd: {
                get() {
                    return this.$store.state[this.namespace].search.closeEnd;
                },
                set(closeEnd) {
                    this.$store.commit(this.namespace + '/search/setCloseEnd', closeEnd);
                    // this.makeQuery();
                }
            },
            tradePeriodExcludedSelector: {
                get() {
                    return this.$store.state[this.namespace].search.tradePeriodExcludedSelector;
                },
                set(tradePeriodExcludedSelector) {
                    this.$store.commit(this.namespace + '/search/setTradePeriodExcludedSelector', tradePeriodExcludedSelector);
                    // this.makeQuery();
                }
            },
        },
        watch: {
            direction(direction){
                console.log("watch: direction=", direction);
                this.makeQuery();
            },
            sortParameter(sortParameter) {
                console.log("watch: sortParameter=", sortParameter);
                this.makeQuery();
            },
            position(position) {
                console.log("watch: position=", position);
                this.makeQuery();
            },
            openStart(newOpenStart, oldOpenStart) {
                console.log("watch: newOpenStart=", newOpenStart, " oldOpenStart=", oldOpenStart);
                this.makeQuery();
            },
            openEnd(openEnd) {
                console.log("watch: openEnd=", openEnd);
                this.makeQuery();
            },
            closeStart(newCloseStart, oldCloseStart) {
                console.log("watch: newCloseStart=", newCloseStart, " oldCloseStart=", oldCloseStart);
                this.makeQuery();
            },
            closeEnd(closeEnd) {
                console.log("watch: closeEnd=", closeEnd);
                this.makeQuery();
            },
            minDays(minDays) {
                console.log("watch: minDays=", minDays);
              //  this.$store.commit(this.namespace + '/search/set', {key: "minDays", value: minDays});                
                this.makeQuery();
            },
            maxDays(maxDays) {
                console.log("watch: maxDays=", maxDays);
                this.makeQuery();
            },
            userConditions(userConditions) {
                console.log("watch: userConditions=", userConditions);
                this.makeQuery();
            },
            indicatorConditions(indicatorConditions) {
                console.log("watch: indicatorConditions=", indicatorConditions);
                this.makeQuery();
            },
            page: function (page) {
                console.log("watch: page=", page);
                this.makeQuery();
            },
            rowsPerPage: function (rowsPerPage) {
                console.log("watch: rowsPerPage=", rowsPerPage);
                this.makeQuery();
            },
            ticker: function (ticker) {
                console.log("watch: ticker=", ticker);
                this.makeQuery();
            },
            group: function (group) {
                console.log("watch: group=", group);
                this.makeQuery();
            },
            tradePeriodExcludedSelector: function (tradePeriodExcludedSelector) {
                console.log("watch: tradePeriodExcludedSelector=", tradePeriodExcludedSelector);
                this.makeQuery();
            },
            numberOfContractsApart: function (numberOfContractsApart) {
                console.log("watch: numberOfContractsApart=", numberOfContractsApart);
                this.makeQuery();
            },
            numberOfContractsApartOptions(numberOfContractsApartOptions) {
                console.log("watch: numberOfContractsApartOptions=", numberOfContractsApartOptions);
                let numberOfMonths = numberOfContractsApartOptions[numberOfContractsApartOptions.length-1].value;
                console.log("numberOfMonths=", numberOfMonths);
                console.log("this.numberOfContractsApart=", this.numberOfContractsApart);
                this.numberOfContractsApart = Math.min(this.numberOfContractsApart, numberOfMonths);

                this.makeQuery();
            }
        },
        methods: {
            startSearchTour() {
                console.log("startSearchTour() starting.");
                this.$tours['searchTour'].start();
            },
            makeQuery(resetPage = true) {
                console.log("makeQuery() starting.");
                let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                console.log("generalForm=", generalForm);

                //  console.log("minDays=", this.minDays);
                //  console.log("typeof minDays=", typeof this.minDays);
                if (this.minDays === '' || this.maxDays === '') {
                    return;
                }
                //updateState(generalForm);

                this.trades = []
                if (resetPage) {
                    this.page = 1;
                }

                let query;
                let sourceCondition = "";
                let positionCondition = "";
                let legsCondition = "";

                //  console.log("this.$store.state[this.namespace]=", this.$store.state[this.namespace]);
                //  console.log("this.$store.state[this.namespace].search=", this.$store.state[this.namespace].search);
                //  console.log("this.$store.state[this.namespace].search.openStart=", this.$store.state[this.namespace].search.openStart);
                //  console.log("this.openStart=", this.openStart, " this.openEnd=", this.openEnd);
                let startingRangeConditions = this.tradePeriodExcludedSelector === 'startingRange' ? "" 
                                                : " open BETWEEN '" + this.openStart + "' AND '" + this.openEnd + "'";
                console.log("startingRangeConditions=", startingRangeConditions);

                console.log("this.legs=", this.legs);
                let numberOfContractsApartConditions =/* this.legs.some(x => x > 1) ?*/ " numberOfContractsApart <= " + this.numberOfContractsApart + " ";
                      //  " AND " : "";
                console.log("numberOfContractsApartConditions=", numberOfContractsApartConditions);

                let endingRangeConditions = this.tradePeriodExcludedSelector === 'endingRange' ? "" : " AND close BETWEEN '" + this.closeStart + "' AND '" + this.closeEnd + "'";
                console.log("endingRangeConditions=", endingRangeConditions);

                let tradeLengthConditions = this.tradePeriodExcludedSelector === 'tradeLength' ? "" : (this.tradePeriodExcludedSelector === 'startingRange' ? "" : " AND ") + " DATEDIFF(close, open ) >= " + this.minDays +
                        " and DATEDIFF(close, open ) <= " + this.maxDays;
                console.log("tradeLengthConditions=", tradeLengthConditions);

                let addOn = this.tradePeriodExcludedSelector === 'startingRange' ? " AND " : "";
                console.log("addOn=", addOn);

                let userCondition = "";
                console.log("this.userConditions=", this.userConditions);
                console.log("this.userConditions.length=", this.userConditions.length);
                if (this.userConditions.length > 0 && typeof this.userConditions[0] !== 'undefined') {
                    for (let i = 0; i < this.userConditions.length; i++) {
                        userCondition = userCondition + this.userConditions[i].parameter + " " + this.userConditions[i].comparator + " " + this.userConditions[i].value + " and ";
                    }
                }
                console.log("userCondition=", userCondition);

                let indicatorCondition = "";
                console.log("this.indicatorConditions=", this.indicatorConditions);
                console.log("this.indicatorConditions.length=", this.indicatorConditions.length);
                if (this.indicatorConditions.length > 0 && typeof this.indicatorConditions[0] !== 'undefined') {
                    for (let i = 0; i < this.indicatorConditions.length; i++) {
                        indicatorCondition = indicatorCondition + this.indicatorConditions[i].parameter + " " + this.indicatorConditions[i].comparator + " " + this.indicatorConditions[i].value + " and ";
                    }
                }
                console.log("indicatorCondition=", indicatorCondition);

                if (this.source == "spread") {
                    sourceCondition = " spread like '" + this.spread + "'";

                    query = `select * FROM data.trades3 where` + sourceCondition + ` and` + startingRangeConditions + 
                            tradeLengthConditions + endingRangeConditions + userCondition + 
                            ` ORDER BY ` + this.sortParameter + ` ` + this.direction +
                            ` LIMIT ` + (this.page - 1) * this.rowsPerPage + ` , ` + this.rowsPerPage + `;`;
                            console.log("query=", query);

                } else {
                    if (this.source == "singleCommodity") {
                        sourceCondition = " and t_data.ticker_key like '" + this.commodity + "-%'";
                    } else if (this.source == "group") {
                        // console.log("this.group=", this.group);
                        let commodities = groupsObject[this.group].commodities;
                        // console.log("commodities=", commodities);

                        sourceCondition = commodities.reduce((result, commodity) => {
                            // console.log("result=", result);
                            // console.log("commodity=", commodity);
                            return result + " or t_data.ticker_key like '" + commodity + "-%'";
                        }, "");
                        sourceCondition = " and ( " + sourceCondition.replace("or", "") + " ) ";
                        // console.log("sourceCondition=", sourceCondition);
                    }

                    if (this.position !== "either") {
                        positionCondition = " position like '%" + this.position + "%'";
                    }

                    legsCondition = " legs IN (" + this.legs.join(',') + ") and ";

                    let aggregator = "max";
                    if (this.direction === "asc") {
                        aggregator = "min";
                    }

                    console.log("this.page=", this.page, " this.rowsPerPage=", this.rowsPerPage);

                    query = `select SQL_CALC_FOUND_ROWS * FROM data.ticker_data t_data
                    JOIN ticker_trade t_trade ON t_data.ticker_key = t_trade.ticker_key	
                    WHERE `+ indicatorCondition + legsCondition + numberOfContractsApartConditions + sourceCondition + `
                    AND (t_data.ticker_key, t_trade.rrr) IN (
                        SELECT ticker_key, ` + aggregator + `(` + this.sortParameter + `) AS ` + this.sortParameter + `
                        FROM ticker_trade
                        WHERE ` + positionCondition + userCondition + startingRangeConditions + tradeLengthConditions + endingRangeConditions + `
                        GROUP BY ticker_key
                    )
                    ORDER BY rrr desc  LIMIT 0 , 20;`

           /*     INNER JOIN
                   (
                                SELECT ticker, ` + aggregator + `(` + this.sortParameter + `) AS ` + this.sortParameter + `
                                FROM data.trades3
                                where ` + legsCondition + numberOfContractsApartConditions + startingRangeConditions + tradeLengthConditions + endingRangeConditions +
                             sourceCondition + positionCondition + userCondition + ` GROUP BY ticker
                    ) AS trade2
                ON trade.ticker = trade2.ticker AND trade.` + this.sortParameter + ` = trade2.` + this.sortParameter +
                            ` HAVING ` + legsCondition + numberOfContractsApartConditions + startingRangeConditions + tradeLengthConditions + endingRangeConditions +
                             sourceCondition + positionCondition + userCondition +
                            ` ORDER BY ` + this.sortParameter + ` ` + this.direction +
                            ` LIMIT ` + (this.page - 1) * this.rowsPerPage + ` , ` + this.rowsPerPage + `;`; */

                }
               // console.log("query=", query);
               this.$store.commit(this.namespace + '/search/setQuery', query);
            }
        }
    };

</script>
