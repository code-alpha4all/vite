<template>
    <div style="border: 0px solid #505050; width: 100%;">

        <table id="searchTrades" style="width: 100%;">
            <tr>
                <th style="text-align: center; vertical-align: bottom; background-color: darkblue; font-size: 1rem; width: auto">
                    ticker
                </th>

                <th style="text-align: center; vertical-align: bottom; background-color: darkblue;"> 
                    <span v-if="source !== 'spread'" style="color: white;">
                        <b-form-group label="legs:" v-slot="{ ariaDescribedby }" style="margin: 0 -4px 0 3px; width: auto;">
                            <b-form-checkbox-group
                                id="checkbox-group-1"
                                v-model="legs"
                                :options="legOptions"
                                name="flavour-1"
                                ></b-form-checkbox-group>
                        </b-form-group>
                    </span>
                    <span v-else>legs</span>
                </th>

                <th style="text-align: center; vertical-align: bottom; background-color: darkblue;">
                    <div style= "width: auto;">
                        <span style="font-weight: bold; color: white"> 

                            width &le;

                        </span>
                        <b-form-select size="sm" style="border: 1px solid gray; width: auto; border: 1px solid gray;
                                       margin: 1px 0px 0 1px; border-radius: 4px;"
                                       v-model="numberOfContractsApart" :options="numberOfContractsApartOptions"></b-form-select> 
                       </div>
                </th>

                <th style="text-align: left; vertical-align: bottom; background-color: darkblue;">
            <b-form-radio-group
                v-model="position"
                :options="positionOptions"
                style="width: auto; margin: 0 0px 0 2px"
                ></b-form-radio-group>
            </th>

            <th style="text-align: center; vertical-align: bottom; background-color: #9A7D0A">

                open <span v-show="tradePeriodExcludedSelector !== 'startingRange'">(range)</span>

                <div v-show="tradePeriodExcludedSelector !== 'startingRange'" style="text-align: center;">
                    <b-button-group>
                        <b-form-datepicker v-model="openStart" size="sm"
                                       :date-format-options="{ year: 'numeric', month: 'short', day: 'numeric' }"
                                       style="border: 1px solid gray; padding: 0 0 0px 0; height: 28px;"></b-form-datepicker>

                        <b-form-datepicker v-model="openEnd" size="sm"
                                       :date-format-options="{ year: 'numeric', month: 'short', day: 'numeric' }"
                                       style="border: 1px solid gray; padding: 0 0 0px -10px; height: 28px;"></b-form-datepicker>
                    </b-button-group>
                </div>
            </th>

            <th style="text-align: center; vertical-align: bottom; background-color: #9A7D0A">

                close  <span v-show="tradePeriodExcludedSelector !== 'endingRange'">(range)</span>

                <div v-show="tradePeriodExcludedSelector !== 'endingRange'" style="text-align: center">                 
                    <b-button-group>
                        <b-form-datepicker v-model="closeStart" size="sm"
                                       :date-format-options="{ year: 'numeric', month: 'short', day: 'numeric' }"
                                       style="border: 1px solid gray; padding: 0 0 0px 0; height: 28px; width: auto"></b-form-datepicker>

                        <b-form-datepicker v-model="closeEnd" size="sm"
                                       :date-format-options="{ year: 'numeric', month: 'short', day: 'numeric' }"
                                       style="border: 1px solid gray; padding: 0 0 0px 0; height: 28px; width: 80px"></b-form-datepicker>
                    </b-button-group>
                </div>
            </th>

            <th style="text-align: center; vertical-align: bottom; background-color: #9A7D0A; width: auto">

                    days  <span v-show="tradePeriodExcludedSelector !== 'tradeLength'">(range)</span>

                    <div v-show="tradePeriodExcludedSelector !== 'tradeLength'" style="white-space: nowrap;">
                    <b-button-group>
                        <b-input size="sm" v-model.lazy.number="minDays" 
                                style="border: 1px solid gray; width: 41px; text-align: right; height:fit-content;"
                                v-autowidth="{maxWidth: '60px', minWidth: '8px', comfortZone: 0}">
                        </b-input> 

                        <b-input size="sm" v-model.lazy.number="maxDays" 
                            style="border: 1px solid gray; width: 39px; text-align: right; height:fit-content;"
                            v-autowidth="{maxWidth: '60px', minWidth: '8px', comfortZone: 0}">
                        </b-input>
                    </b-button-group>
                </div>

            </th>

            <th style="text-align: center; vertical-align: bottom" v-bind:style="{backgroundColor: sortParameter == 'percentProfitable' ? 'blue' : 'teal' }">

                % profitable

                <div style="white-space: nowrap;">
                    <b-button-group>
                        <b-form-select size="sm" style="border: 1px solid gray; margin-top: 1px; border-top-left-radius: 4px;
                                       border-bottom-left-radius: 4px; width: 48px;
                                       border-top-right-radius: 0px; border-bottom-right-radius: 0px"
                                       v-model="percentProfitable.comparator" :options="comparatorOptions">
                        </b-form-select> 

                        <b-input size="sm" style="width: 39px; border:1px solid gray; margin: 1px 0px 0 0;
                                 border-top-right-radius: 4px; border-bottom-right-radius: 4px;
                                 border-top-left-radius: 0px; border-bottom-left-radius: 0px;"
                                 v-model.number="percentProfitable.value" @keydown.enter.prevent="">
                        </b-input>
                    </b-button-group>
                </div>

            </th>

            <th style="text-align: center; vertical-align: bottom" v-bind:style="{backgroundColor: sortParameter == 'appd' ? 'blue' : 'teal' }">                    
                <div @click=sort style="white-space: nowrap">
                    <i id="appd" class="fas fa-sort"></i>

                    appd

                </div>
                <div style="white-space: nowrap;">
                    <b-button-group>
                        <b-form-select size="sm" style="border: 1px solid gray; margin-top: 1px; border-top-left-radius: 4px;
                                       border-bottom-left-radius: 4px; width: 48px;
                                       border-top-right-radius: 0px; border-bottom-right-radius: 0px"
                                       v-model="appd.comparator" :options="comparatorOptions">
                        </b-form-select> 

                        <b-input size="sm" style="width: 50px; height:fit-content; border:1px solid gray;
                                 margin: 1px 0px 0 0; border-top-right-radius: 4px;
                                 border-bottom-right-radius: 4px;
                                 border-top-left-radius: 0px; border-bottom-left-radius: 0px;"
                                 v-model.number="appd.value" @keydown.enter.prevent=""
                                 v-autowidth="{maxWidth: '60px', minWidth: '8px', comfortZone: 0}">
                        </b-input>
                    </b-button-group>
                </div>
            </th>

            <th style="text-align: center; vertical-align: bottom" v-bind:style="{backgroundColor: sortParameter == 'rrr' ? 'blue' : 'teal' }">
                <div @click=sort style="white-space: nowrap">
                    <i id="rrr" class="fas fa-sort"></i>
                    <span style="white-space: nowrap">

                        avg mpe/avg mae

                    </span>
                </div>
              <!--  <div>
                    <span style="white-space: nowrap">(return / risk)</span>
                </div> -->
                <div style="white-space: nowrap">
                    <b-button-group>
                        <b-form-select size="sm" style="border: 1px solid gray; margin-top: 1px; border-top-left-radius: 4px; border-bottom-left-radius: 4px; width: 48px;
                                       border-top-right-radius: 0px; border-bottom-right-radius: 0px"
                                       v-model="rrr.comparator" :options="comparatorOptions"></b-form-select> 

                        <b-input size="sm" style="width: 40px; border:1px solid gray; margin: 1px 0px 0 0; border-top-right-radius: 4px; border-bottom-right-radius: 4px;
                                 border-top-left-radius: 0px; border-bottom-left-radius: 0px;"
                                 v-model.number="rrr.value" @keydown.enter.prevent="">
                        </b-input>
                    </b-button-group>
                </div>
            </th>

            <th style="text-align: center; vertical-align: bottom" v-bind:style="{backgroundColor: sortParameter == 'avgMax' ? 'blue' : 'teal' }">
                <div @click=sort style="white-space: nowrap">
                    <i id="avgMax" class="fas fa-sort"></i>

                    avg mpe

                </div>
                <div style="white-space: nowrap;">
                    <b-button-group>
                        <b-form-select size="sm" style="border: 1px solid gray; margin-top: 1px; border-top-left-radius: 4px;
                                       border-bottom-left-radius: 4px; width: 48px;
                                       border-top-right-radius: 0px; border-bottom-right-radius: 0px"
                                       v-model="avgMax.comparator" :options="comparatorOptions">
                        </b-form-select> 

                        <b-input size="sm" style="width: 46px; height:fit-content; border:1px solid gray; margin: 1px 0px 0 0; 
                                 border-top-right-radius: 4px;
                                 border-bottom-right-radius: 4px;
                                 border-top-left-radius: 0px; border-bottom-left-radius: 0px;"
                                 v-model.number="avgMax.value" @keydown.enter.prevent=""
                                 v-autowidth="{maxWidth: '60px', minWidth: '8px', comfortZone: 0}">
                        </b-input>
                    </b-button-group>
                </div>
            </th>

            <th style="text-align: center; vertical-align: bottom" v-bind:style="{backgroundColor: sortParameter == 'bestMax' ? 'blue' : 'teal' }">
                <div @click=sort style="white-space: nowrap">
                    <i id="bestMax" class="fas fa-sort"></i>

                    best mpe

                </div>
                <div style="white-space: nowrap;">
                    <b-button-group>
                        <b-form-select size="sm" style="border: 1px solid gray; margin-top: 1px; border-top-left-radius: 4px;
                                       border-bottom-left-radius: 4px; width: 48px;
                                       border-top-right-radius: 0px; border-bottom-right-radius: 0px"
                                       v-model="bestMax.comparator" :options="comparatorOptions">
                        </b-form-select> 

                        <b-input size="sm" style="width: 46px; height:fit-content; border:1px solid gray; 
                                 margin: 1px 0px 0 0; border-top-right-radius: 4px;
                                 border-bottom-right-radius: 4px;
                                 border-top-left-radius: 0px; border-bottom-left-radius: 0px;"
                                 v-model.number="bestMax.value" @keydown.enter.prevent=""
                                 v-autowidth="{maxWidth: '60px', minWidth: '8px', comfortZone: 0}">
                        </b-input>
                    </b-button-group>
                </div>
            </th>

            <th style="text-align: center; vertical-align: bottom" v-bind:style="{backgroundColor: sortParameter == 'avgMin' ? 'blue' : 'teal' }">
                <div @click=sort style="white-space: nowrap">
                    <i id="avgMin" class="fas fa-sort"></i>

                    avg mae

                </div>
                <div style="white-space: nowrap;">
                    <b-button-group>
                        <b-form-select size="sm" style="border: 1px solid gray; margin-top: 1px; border-top-left-radius: 4px;
                                       border-bottom-left-radius: 4px; width: 48px;
                                       border-top-right-radius: 0px; border-bottom-right-radius: 0px"
                                       v-model="avgMin.comparator" :options="comparatorOptions">
                        </b-form-select> 

                        <b-input size="sm" style="width: 46px; height: fit-content; border:1px solid gray; margin: 1px 0px 0 0; border-top-right-radius: 4px;
                                 border-bottom-right-radius: 4px;
                                 border-top-left-radius: 0px; border-bottom-left-radius: 0px;"
                                 v-model.number="avgMin.value" @keydown.enter.prevent=""
                                 v-autowidth="{maxWidth: '60px', minWidth: '8px', comfortZone: 0}">
                        </b-input>
                    </b-button-group>
                </div>
            </th>

            <th style="text-align: center; vertical-align: bottom" v-bind:style="{backgroundColor: sortParameter == 'worstMin' ? 'blue' : 'teal' }">
                <div @click=sort style="white-space: nowrap">
                    <i id="worstMin" class="fas fa-sort"></i>

                    worst mae

                </div>
                <div style="white-space: nowrap;">
                    <b-button-group>
                        <b-form-select size="sm" style="border: 1px solid gray; margin-top: 1px; border-top-left-radius: 4px;
                                       border-bottom-left-radius: 4px; width: 48px;
                                       border-top-right-radius: 0px; border-bottom-right-radius: 0px"
                                       v-model="worstMin.comparator" :options="comparatorOptions">
                        </b-form-select> 

                        <b-input size="sm" style="width: 46px; height: fit-content; border:1px solid gray; margin: 1px 0px 0 0; border-top-right-radius: 4px;
                                 border-bottom-right-radius: 4px;
                                 border-top-left-radius: 0px; border-bottom-left-radius: 0px;"
                                 v-model.number="worstMin.value" @keydown.enter.prevent=""
                                 v-autowidth="{maxWidth: '60px', minWidth: '8px', comfortZone: 0}">
                        </b-input>
                    </b-button-group>
                </div>
            </th>

            <th style="text-align: center; vertical-align: bottom" v-bind:style="{backgroundColor: sortParameter == 'appd' ? 'blue' : 'teal' }">                    
                <div @click=sort style="white-space: nowrap">
                    <i id="rsi" class="fas fa-sort"></i>

                    7-day rsi

                </div>
                <div style="white-space: nowrap;">
                    <b-button-group>
                        <b-form-select size="sm" style="border: 1px solid gray; margin-top: 1px; border-top-left-radius: 4px;
                                       border-bottom-left-radius: 4px; width: 48px;
                                       border-top-right-radius: 0px; border-bottom-right-radius: 0px"
                                       v-model="rsi.comparator" :options="comparatorOptions">
                        </b-form-select> 

                        <b-input size="sm" style="width: auto; height: fit-content; border:1px solid gray; margin: 1px 0px 0 0; border-top-right-radius: 4px;
                                 border-bottom-right-radius: 4px;
                                 border-top-left-radius: 0px; border-bottom-left-radius: 0px;"
                                 v-model.number="rsi.value" @keydown.enter.prevent=""
                                 v-autowidth="{maxWidth: '60px', minWidth: '8px', comfortZone: 0}">
                        </b-input>
                    </b-button-group>
                </div>
            </th>

            <th style="text-align: center; background-color: black">actions</th> 
            </tr>
            <tr v-for="n in trades" v-bind:key="n.id" style="white-space: nowrap;">
                <td v-bind:style="{textAlign: 'left', color: 'black'}">{{tickerConverter(n.ticker)}}</td>
                <td v-bind:style="{textAlign: 'center', color: 'black'}">{{n.legs}}</td>
                <td v-bind:style="{textAlign: 'center', color: 'black'}">{{n.numberOfContractsApart}}</td>
                <td v-bind:style="{textAlign: 'center', color: sortParameter == 'position' ? 'blue' : 'black' }">{{n.position === "LONG" ? "BUY" : "SELL"}}</td>
                <td v-bind:style="{textAlign: 'center', color: sortParameter == 'open' ? 'blue' : 'black' }">{{n.open}}</td>
                <td v-bind:style="{textAlign: 'center', color: sortParameter == 'close' ? 'blue' : 'black' }">{{n.close}}</td>
                <td v-bind:style="{textAlign: 'center', color: sortParameter == 'close' ? 'blue' : 'black' }">{{Math.round(1000*n.days)/1000}}</td>
                <td v-bind:style="{textAlign: 'center', color: sortParameter == 'percentProfitable' ? 'blue' : 'black' }">{{Math.round(10*n.percentProfitable)/10}}</td>
                <td v-bind:style="{textAlign: 'right', color: sortParameter == 'appd' ? 'blue' : 'black' }">{{displayMoneyFormat(Math.round(100*n.appd)/100)}}</td>
                <td v-bind:style="{textAlign: 'center', color: sortParameter == 'rrr' ? 'blue' : 'black', fontWeight: sortParameter == 'rrr' ? 'bold' : 'normal'  }">{{Math.abs(Math.round(100*n.rrr))/100}}</td>
                <td v-bind:style="{textAlign: 'right', color: sortParameter == 'avgMax' ? 'blue' : 'black' }">{{displayMoneyFormat(Math.round(100*n.avgMpe)/100)}}</td>
                <td v-bind:style="{textAlign: 'right', color: sortParameter == 'bestMax' ? 'blue' : 'black' }">{{displayMoneyFormat(Math.round(100*n.worstMpe)/100)}}</td>
                <td v-bind:style="{textAlign: 'right', color: sortParameter == 'avgMin' ? 'blue' : 'black' }">{{displayMoneyFormat(Math.round(100*n.avgMae)/100)}}</td>
                <td v-bind:style="{textAlign: 'right', color: sortParameter == 'worstMin' ? 'blue' : 'black' }">{{displayMoneyFormat(Math.round(100*n.worstMae)/100)}}</td>
                <td v-bind:style="{textAlign: 'center', color: sortParameter == 'rsi' ? 'blue' : 'black' }">{{n.rsi}}</td>
                <td style="text-align: center">
            <b-form-select style="border: 1px solid black; width: auto; margin: -1px 0 0 0;
                           padding-top: 1px; background-color: gray; color: white; height: 22px"
                           v-model="newProgram" :options="programOptions"
                           size="sm" @change="getChart(n.id)">
            </b-form-select></td> 
            </tr>
        </table>    

        <div style="background-color: black">
            <b-button-group style="margin: 3px 3px 3px 2px; font-size: 1.1rem; border: 0px solid gray;
                            padding: 3px 3px 3px 3px; border-radius: 4px; background-color: black; color: white">
                <span style="padding: 6px 30px 0 10px; font-weight: bold">
                    number of results: {{numberOfTrades}}
                </span>
                <span v-if="['admin', 'superadmin'].includes($store.state.user.role)" style="padding: 6px 30px 0 10px; font-weight: bold">
                    search time: {{searchTime}}&nbsp;s
                </span>
                <span style="padding: 6px 3px 0 10px; font-weight: bold">page:
                </span>
                <b-pagination size="md" style="margin: 0px 30px 0px 0; border: 1px solid silver; padding: 0px; color: black"
                              v-model="page"
                              :total-rows="totalPages*rowsPerPage"
                              :per-page="rowsPerPage">
                </b-pagination>

                <span style="margin: 0px 0px 0px 0; font-weight: bold"> &nbsp;rows/page:
                    <b-form-select size="sm" style="border: 1px solid lightgray; width: auto;" v-model="rowsPerPage" :options="rowsPerPageOptions"></b-form-select>
                </span>
            </b-button-group>
        </div>

    </div>
</template>

<style scoped>
    #searchTrades {
        /* font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;*/
        font-weight: normal;
        color: darkgray;
        border-collapse: collapse;
        width: 100%;
    }

    #searchTrades td {
        padding: 2px 4px 2px 4px;
        border: 1px solid #ddd;
    }

    #searchTrades tr:nth-child(even){
        background-color: #f2f2f2;
    }

    #searchTrades tr:hover {
        background-color: #ddd;
    }

    #searchTrades th {
        border: 1px solid #ddd;
        padding: 2px;
        text-align: center;
        background-color: teal;
        color: white;
    }

    .linkable {
        cursor: pointer;
        color: blue;
    }

</style>

<script>
    let ajaxRequest = null;

    import axios from "axios";
    import moment from 'moment';
    import {tickerToGeneralForm, tickerLegDecomposer, contractNameDecomposer, getGroup, groupsObject,
        tickerConverter, commodityMonths, displayMoneyFormat, storeTab}  from "@/js/main.js";
    import _ from "lodash";
    import { createInitialState } from '@/js/createInitialState.js';
    
    import VueInputAutowidth from 'vue-input-autowidth'
    import Vue from 'vue';

    Vue.use(VueInputAutowidth);

    export default {
        components: {},
        mounted() {
            // console.log("search-output.vue mounted() starting.");

            if (this.activeModuleName === this.namespace && !this.initialized && typeof this.query !== 'undefined') {
                this.initialized = true;
                this.getTrades(this.query);
            }
        },
        props: ['namespace'],
        data: function () {
            return{
                initialized: false,
                trades: [],
                numberOfTrades: 0,
                totalPages: 1,
                searchTime: 0,
                rowsPerPageOptions: Array(10).fill(null).map((x, i) => ({value: 10 * (i + 1), text: 10 * (i + 1)})),
                positionOptions: [
                    {value: 'long', text: 'BUY'},
                    {value: 'short', text: 'SELL'},
                    {value: 'either', text: 'both'}
                ],
                legOptions: [
                    {value: 1, text: '1'},
                    {value: 2, text: '2'},
                    {value: 3, text: '3'}
                ],
                programOptions: [
                    {value: null, text: 'Select Chart'},
                    {value: 'Calculator', text: 'Calculator'},
                    {value: 'BasicChartsNew', text: 'Futures Chart'},
                    {value: 'History', text: 'History Charts'},
                    {value: 'LongTermCharts', text: 'Long Term Charts'},
                    {value: 'TradeMaps', text: 'Trade Maps'}
                ],
                comparatorOptions: [
                    {value: '<', text: '<'},
                    {value: '<=', text: '<='},
                    {value: '>', text: '>'},
                    {value: '>=', text: '>='},
                ],
                newProgram: null,
                value: null,
                currentSortParameter: null
            }
        },
        computed: {
            minDays: {
                get() {
                    return this.$store.state[this.namespace].search.minDays;
                },
                set(minDays) {
                    this.$store.commit(this.namespace + '/search/set', {key: "minDays", value: minDays});
                    //this.makeQuery();
                }
            },
            maxDays: {
                get() {
                    return this.$store.state[this.namespace].search.maxDays;
                },
                set(maxDays) {
                    this.$store.commit(this.namespace + '/search/set', {key: "maxDays", value: maxDays});
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
            direction: {
                get() {
                    return this.$store.state[this.namespace].search.direction;
                },
                set(direction) {
                    this.$store.commit(this.namespace + '/search/set', {key: "direction", value: direction});
                }
            },
            userConditions() {
                console.log("userConditions() starting.");
                return this.$store.state[this.namespace].search.userConditions;
            },
            userConditionsJson() {
                // console.log("userConditionsJson() starting.");
                let json = JSON.parse(JSON.stringify(this.userConditions));
                console.log("json=", json);
                if (typeof json !== 'undefined' && json !== null) {
                    return JSON.stringify(json);
                } else {
                    return null;
                }
            },
            indicatorConditions() {
                return this.$store.state[this.namespace].search.indicatorConditions;
            },
            indicatorConditionsJson() {
                console.log("indicatorConditionsJson() starting.");
                let json = typeof this.indicatorConditions !== 'undefined' ? JSON.parse(JSON.stringify(this.indicatorConditions)) : null;
                console.log("json=", json);
                if (typeof json !== 'undefined' && json !== null) {
                    return JSON.stringify(json);
                } else {
                    return null;
                }
            },
            rrr() {
                return this.userConditions.find(x => x.parameter === 'rrr');
            },
            appd() {
                let appd = this.userConditions.find(x => x.parameter === 'appd');
                console.log("appd=", appd);
                return typeof appd !== 'undefined' ? appd : {comparator: null, parameter: null, value: null};
            },
            percentProfitable() {
                let percentProfitable = this.userConditions.find(x => x.parameter === 'percentProfitable');
                console.log("percentProfitable=", percentProfitable);
                return typeof percentProfitable !== 'undefined' ? percentProfitable : {comparator: null, parameter: null, value: null};
            },
            rsi() {
                let rsi = this.indicatorConditions.find(x => x.parameter === 'rsi');
                console.log("rsi=", rsi);
                return typeof rsi !== 'undefined' ? rsi : {comparator: null, parameter: null, value: null};
            },
            avgMax() {
                let avgMax = this.userConditions.find(x => x.parameter === 'avgMax');
                console.log("avgMax=", avgMax);
                return typeof avgMax !== 'undefined' ? avgMax : {comparator: null, parameter: null, value: null};
            },
            bestMax() {
                let bestMax = this.userConditions.find(x => x.parameter === 'bestMax');
                console.log("bestMax=", bestMax);
                return typeof bestMax !== 'undefined' ? bestMax : {comparator: null, parameter: null, value: null};
            },
            avgMin() {
                let avgMin = this.userConditions.find(x => x.parameter === 'avgMin');
                console.log("avgMin=", avgMin);
                return typeof avgMin !== 'undefined' ? avgMin : {comparator: null, parameter: null, value: null};
            },
            worstMin() {
                let worstMin = this.userConditions.find(x => x.parameter === 'worstMin');
                console.log("worstMin=", worstMin);
                return typeof worstMin !== 'undefined' ? worstMin : {comparator: null, parameter: null, value: null};
            },
            
            group() {
                return this.$store.getters[this.namespace + "/group"];
            },
            commodity: {
                get() {
                    let commodity = this.$store.getters[this.namespace + '/c'][0];
                    return  commodity;
                },
                set(commodity) {
                    console.log("commodity.set() starting. this.numberOfContractsApart=", this.numberOfContractsApart);
                    this.$store.dispatch(this.namespace + '/changeCommodityLeg', {commodity: commodity, index: 0});
                }
            },
            commodityOptions() {
                return this.$store.getters["siteData/commoditiesArray"].map(x => {
                    return {value: x.symbol, text: x.name};
                });
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
            source: {
                get() {
                    return this.$store.state[this.namespace].search.source;
                },
                set(source) {
                    this.$store.commit(this.namespace + '/search/set', {key: "source", value: source});
                }
            },
            position: {
                get() {
                    return this.$store.state[this.namespace].search.position;
                },
                set(position) {
                    this.$store.commit(this.namespace + '/search/set', {key: "position", value: position});
                }
            },
            numberOfContractsApartComparator: {
                get() {
                    return this.$store.state[this.namespace].search.numberOfContractsApartComparator;
                },
                set(numberOfContractsApartComparator) {
                    this.$store.commit(this.namespace + '/search/set', {key: "numberOfContractsApartComparator", value: numberOfContractsApartComparator});
                }
            },
            numberOfContractsApart: {
                get() {
                    return this.$store.state[this.namespace].numberOfContractsApart;
                },
                set(numberOfContractsApart) {
                    console.log("numberOfContractsApart.set() starting. numberOfContractsApart=", numberOfContractsApart);
                    this.$store.commit(this.namespace + '/setNumberOfContractsApart', numberOfContractsApart);
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
                    console.log("groupsObject=", groupsObject, " this.group=", this.group);
                    let commodities = groupsObject[this.group].commodities;
                    console.log("commodities=", commodities);
                    let commodityMonthsArray = commodities.map(commodity => commodityMonths(commodity).length);
                    console.log("commodityMonthsArray=", commodityMonthsArray);
                    numberOfMonths = Math.max(...commodityMonthsArray);
                }
                // console.log("numberOfMonths=", numberOfMonths);

                let lowerBound = 1;   // this.legs.includes(3) ? 2 : 1;
                let temp = Array(numberOfMonths + 1 - lowerBound).fill()
                        .map((x, i) => {
                            return {value: i + lowerBound, text: i + lowerBound};
                        });
                return temp;
            },
            sortParameter: {
                get() {
                    return this.$store.state[this.namespace].search.sortParameter;
                },
                set(sortParameter) {
                    this.$store.commit(this.namespace + '/search/set', {key: "sortParameter", value: sortParameter});
                }
            },
            rowsPerPage: {
                get() {
                    return this.$store.state[this.namespace].chartParameters.rowsPerPage;
                },
                set(rowsPerPage) {
                    this.$store.commit(this.namespace + '/chartParameters/setRowsPerPage', rowsPerPage);
                }
            },
            page: {
                get() {
                    return this.$store.state[this.namespace].chartParameters.page;
                },
                set(page) {
                    this.$store.commit(this.namespace + '/chartParameters/setPage', page);
                }
            },
            query() {
                return this.$store.state[this.namespace].search.query;
            },
            activeModuleName() {
                return  this.$store.getters['activeModuleName'];
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
                }
            },
            symbols() {
                return this.$store.state.user.symbols;
            }
        },
        watch: {
            tradePeriodExcludedSelector: function (tradePeriodExcludedSelector) {
                console.log("watch: tradePeriodExcludedSelector=", tradePeriodExcludedSelector);
                //this.makeQuery();
            },
            userConditionsJson(userConditionsJson) {
                console.log("watch: userConditionsJson=", userConditionsJson);

                let arr = JSON.parse(JSON.stringify(this.userConditions));
                /*  let newObj = arr[this.index];
                 newObj.comparator = comparator;
                 arr[this.index] = newObj; */
                this.$store.commit(this.namespace + '/search/setUserConditions', arr);

                //this.getTrades(this.query);
            },
            indicatorConditionsJson(indicatorConditionsJson) {
                console.log("watch: indicatorConditionsJson=", indicatorConditionsJson);

                let arr = JSON.parse(JSON.stringify(this.indicatorConditions));
                /*  let newObj = arr[this.index];
                 newObj.comparator = comparator;
                 arr[this.index] = newObj; */
                this.$store.commit(this.namespace + '/search/setIndicatorConditions', arr);

                //this.getTrades(this.query);
            },
            query: function (query) {
                console.log("watch: query=", query);
                this.initialized = true;
                this.getTrades(query);
            },
            activeModuleName: function (activeModuleName) {
                // console.log("activeModuleName=", activeModuleName, " namespace=", this.namespace, " this.initialized=", this.initialized);
                // console.log("this.query=", this.query);
                if (activeModuleName === this.namespace && !this.initialized && typeof this.query !== 'undefined' && !this.initialized) {
                    this.initialized = true;
                    this.getTrades(this.query);
                }
            }
        },
        methods: {
            tickerConverter(ticker){
               // console.log("tickerConverter() starting. ticker=", ticker + " this.symbols=", this.symbols);
                return tickerConverter(ticker, "eod", this.symbols);
            },
            sort(event) {
                console.log("sort() starting.");
                this.sortParameter = event.target.id;
                if (this.sortParameter === this.currentSortParameter) {
                    this.direction = this.direction === 'asc' ? 'desc' : 'asc';
                }

                this.currentSortParameter = this.sortParameter;
            },
            displayMoneyFormat(number){
                return displayMoneyFormat(number);           
            },
            getChart(index) {
                console.log("getChart() starting. index=", index);
               
                let program = this.newProgram;
                this.newProgram = null;
                // console.log("program=", program, " this.newProgram=", this.newProgram);

                let trade = this.trades[index];
                console.log("trade=", trade);
                let open = moment(trade.open, "MMM DD, YYYY").format("YYYY-MM-DD");
                let close = moment(trade.close, "MMM DD, YYYY").format("YYYY-MM-DD");
                console.log("open=", open, " close=", close);

                let generalForm = tickerToGeneralForm(trade.ticker);
                console.log("generalForm=", generalForm);

                generalForm.open = open;
                generalForm.close = close;
                generalForm.showTradingPeriod = true;
                generalForm.zoomToSavedCoordinates = false;

                /* if (trade.position === "SHORT") {
                 generalForm.p = [-1, 1, 1, 1];
                 } */

                generalForm.aligned = false;
                generalForm.buySell = trade.position === "LONG" ? "buy" : "sell";
                generalForm.addRSIPanel = true;
                generalForm.rsiPeriod = 7;
         
                generalForm.chartParameters = {};
                generalForm.chartParameters.parameterToMap = this.sortParameter === "appd" ? "avgAppd" : this.sortParameter;
                
                let role = this.$store.state.user.role;
                let initialState = createInitialState(program, role, generalForm);
                this.$store.dispatch('newTabWithInitialState', initialState);
            },
            getTrades: _.debounce(function (query) {
                console.log("getTrades() starting. query=", query);
                this.$store.commit('resetNumberOfAjaxCalls');
                this.$store.commit('incrementNumberOfAjaxCalls');

                if (query !== false) {
                    this.trades = [];
                    // let url = "http://localhost:8080/SearchTradesServlet?query=" + encodeURIComponent(query);
                    //  let url = "http://46.101.206.208/SearchTradesServlet?query=" + encodeURIComponent(query);
                    let url = this.$store.state.siteData.baseUrl + this.$store.state.siteData.contextName + "/SearchTradesNewServlet?query=" + encodeURIComponent(query);
                    let that = this;

                    if (ajaxRequest) {
                        console.log("ajaxRequest=", ajaxRequest);
                        ajaxRequest.cancel();
                    }

                    ajaxRequest = axios.CancelToken.source();

                    const startTime = Date.now();
                    axios.get(url, {
                        cancelToken: ajaxRequest.token
                    })
                            .then(apiResponse => {
                                this.$store.commit('decrementNumberOfAjaxCalls');
                                // console.log("apiResponse=", apiResponse);
                                let data = apiResponse.data;
                                let temp = data.trades; //JSON.parse(data).trades;
                                console.log("temp=", temp);

                                let result = temp.map(function (el, index) {
                                    let o = Object.assign({}, el);
                                    let ticker = o.ticker;
                                    // console.log("o=", o);
                                    if (ticker !== null) {
                                        // let contract = ticker.replace(/ /g, '').split("/");
                                        // console.log("contract=", contract);

                                        o.id = index;

                                        let tickerLegs = o.ticker.replace(/\s/g, '').split(/(?=[-+\s])/);
                                        // console.log("tickerLegs=", tickerLegs);
                                        o.legs = tickerLegs.length;

                                        let decomposedLeg = tickerLegDecomposer(tickerLegs[0]);
                                        // console.log("decomposedLeg=", decomposedLeg);
                                        let contract = decomposedLeg.contract;
                                        let commodity = contractNameDecomposer(contract).commoditySymbol;
                                        // console.log("commodity=", commodity);
                                        o.group = getGroup(commodity);
                                        let open = moment(el.open, "YYYYMMDD");
                                        let close = moment(el.close, "YYYYMMDD");
                                        o.open = open.format("MMM D, YYYY");
                                        o.close = close.format("MMM D, YYYY");
                                        o.days = close.diff(open, 'days');
                                        o.avgMae = el.avgMin;
                                        o.worstMae = el.worstMin;
                                        o.avgMpe = el.avgMax;
                                        o.worstMpe = el.bestMax;
                                        o.rrr = el.rrr;
                                        // o.rsi = (el.position === "LONG" ? el.rsi : (100 - el.rsi)).toFixed(1);
                                        o.rsi = typeof el.rsi === 'undefined' ? null : el.rsi.toFixed(1);

                                        o.ticker = el.ticker;

                                        delete o.avgMin;
                                        delete o.worstMin;
                                        delete o.avgMax;
                                        delete o.bestMax;
                                        // console.log("o=", o);
                                    } else {
                                        console.log("no open positions. o.ticker=", o.ticker);
                                        o = "null";
                                    }
                                    return o;
                                });
                                // console.log("result=", result);
                                let filteredResult = result.filter(x => x !== "null");
                                // console.log("filteredResult=", filteredResult);
                                that.trades = filteredResult;
                                that.numberOfTrades = data.numberOfTrades;
                                that.totalPages = Math.ceil(that.numberOfTrades / that.rowsPerPage);
                                // console.log("numberOfTrades=", that.numberOfTrades, "  that.totalPages=", that.totalPages);

                                const endTime = Date.now();
                                that.searchTime = (endTime - startTime)/1000;
                                console.log(`Execution time: ${that.searchTime}s`);

                                let generalForm = JSON.parse(JSON.stringify(that.$store.state[that.namespace]));
                                storeTab(generalForm, that.$store.state.user.email);

                            })
                            .catch((err) => {
                               // this.$store.commit('decrementNumberOfAjaxCalls');
                                console.log("error: err=", err);
                            });
                }
            }, 1000),
        }
    };

</script>
