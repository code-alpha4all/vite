<template>
    <div style="background-color: #c7d5e7; border: 0px solid black; width: auto;">

        <!--  <div style="width: 100%;"> activeModuleIndex:
              <input style="width: 35px; border:1px solid gray; text-align: right" v-model.number="activeModuleIndex">
              </div>
             program:<span style=" margin-left: 3px; margin-right: 16px">{{program}}</span>
             activeModuleName:<span style=" margin-left: 3px; margin-right: 16px">{{activeModuleName}}</span> 

             <b-button size="sm" @click="updateInitializingState">updateInitializingState</b-button>  -->       

        <table style="height: calc(100vh);">
            <tr>
                <td style="vertical-align: top; border-right: 1px solid gray; padding: 0px; overflow:hidden;" class="sidebar">

            <b-button v-if="showHeightBreakdown"  size="sm"  @click="clearTable"
                      style="margin: 10px 0 -5px 5px; background-color: white; font-size: 12px; color: black; border: 1px solid gray;">
                clear table
            </b-button>  

            <b-button v-if="showHeightBreakdown"  size="sm"  @click="setChartHeight"
                      style="margin: 10px 0 -5px 5px; background-color: white; font-size: 12px; color: black; border: 1px solid gray;">
                run setChartHeight()
            </b-button>  

            <table v-if="showHeightBreakdown"  id="height_breakdown" border=1 style="color: black; font-size: 11px; margin: 10px 2px 5px 3px;">
                <tr>
                    <th style="padding: 0 1px 0 1px;">
                        inputDivHeight
                    </th>
                    <th style="padding: 0 1px 0 1px;">
                        outputDivHeight
                    </th>
                    <th style="padding: 0 1px 0 1px;">
                        windowHeight
                    </th>
                    <th style="padding: 0 1px 0 1px;">
                        newHeight
                    </th>
                </tr>
                <tr v-for="n in heightBreakdownObjectArray" v-bind:key="n.index"
                    style=" text-align: right;">
                    <td style="padding-right: 3px;">
                        {{ n.inputDivHeight }}
                    </td>
                    <td style="padding-right: 3px;">
                        {{ n.outputDivHeight }}
                    </td>
                    <td style="padding-right: 3px;">
                        {{ n.windowHeight }}

                    </td>
                    <td style="padding-right: 3px;">
                        {{ n.newHeight }}
                    </td>
                </tr>
            </table>  

            <sidebar
                v-bind:namespace="activeModuleName"
                ref="sidebar"
                style="padding: 0px 0 0 0; border: 0px solid gray"
                ></sidebar>
            </td>

            <td v-bind:style="{ width: width }" style="vertical-align: top;border: 0px solid gray; background-color: whitesmoke;">

            <b-tabs
                tabs
                id="tabs"
                v-model="activeModuleIndex"
                active-nav-item-class="font-weight-bold"
                active-tab-class="font-weight-bold"
                style="
                margin-top: 8px;
                border-bottom: 0px solid darkgray;
                font-size: 0.95rem;
                overflow-y: scroll;
                height: calc(100% - 72px);
                overflow-x: hidden;">

                <template v-slot:tabs-start>
                    <b-nav-item v-if="moduleArray.length > 0">
                        <b v-on:click="closeAllTabs" style="border: 0px solid darkgray; margin-top: 0px">close all tabs</b>
                    </b-nav-item>
                </template>  

                <div id="tour-start"></div>

                <component
                    v-if="!hideInput"
                    v-bind:is="inputComponent"
                    v-bind:namespace="activeModuleName"
                    v-bind:id="activeModuleName + 'InputDiv'"
                    ref="input-component"
                    style="margin-top: 0px; padding: 2px 15px 3px 15px; border-bottom: 0px solid darkgray; width: 100%;">
                </component>

                <b-tab
                    v-for="module in moduleArray"
                    v-bind:key="module.moduleName"
                    v-bind:ref="module.moduleName + 'Output'"
                    active
                    style="border-top: 0px solid black;"
                    >
                    <template #title>

                        <b-container fluid style="width: auto; margin-top: 0px; margin: -7px -28px -1px -9px; color: black">
                            <b-row align-h="center" style="margin: 0 0 0 0">

                                <b-col cols="16"  style="margin: 8px 5px 0 -12px; padding: 0px;
                                       height: 15px; font-weight: bold; border: 0px solid gray; margin-right: 5px;">
                                    <!--  module.tabTitleMode:{{module.tabTitleMode}} -->
                                    <span v-if="module.tabTitleMode === 'auto'">{{ module.tabTitle}} </span>
                                    <span v-else>{{module.manualTabTitle}} </span>
                                </b-col>

                                <b-col cols="1" md="auto"
                                       v-if="typeof $store.state[module.moduleName] !== 'undefined' && activeModuleName === module.moduleName &&
                                       module.program !== 'Portfolio'"
                                       style="width: auto; margin: 0 0 0 -4px"
                                       v-b-modal.tab-title-modal>

                                    <tab-title-modal v-bind:namespace="module.moduleName"></tab-title-modal>

                                    <i class="far fa-edit" v-if="autoTabTitle" @click="toggleTabTitleInput" 
                                       v-b-tooltip.hover.topleft="'Edit tab title.'" style="color: black; margin: 7px -8px 1px -6px"></i>
                                    <!--  <span @click="toggleTabTitleInput">
                                       <Icon icon="mdi:automatic" v-if="!autoTabTitle" width="18" height="18" 
                                       v-b-tooltip.hover.topleft="'Currently in automatic tab title mode. Click for custom tab title mode to set your own title.'" style="color: black; margin: 6px -8px 1px -7px"/>
                                   </span> -->
                                </b-col>
                                <b-col cols="1" md="auto"
                                       v-if="typeof $store.state[module.moduleName] !== 'undefined' && 
                                       activeModuleName === module.moduleName /*&& module.program !== 'Portfolio'*/" style="width: auto">
                                    <b-button id="popover-3" variant="light" @click="toggleHideInput" style="background-color: white;
                                              height: auto; margin: 0px 3px 2px 1px; border: 0px solid darkgray; padding: 0 4px 0px 4px;">
                                        <i v-if="!hideInput" class="far fa-eye-slash" style="margin: 8px 0px 0 -18px; color: black"></i>
                                        <i v-if="hideInput"  class="far fa-thin fa-eye" style="margin: 8px 0px 0 -18px; color: black"></i>
                                    </b-button>

                                    <b-popover target="popover-3" triggers="hover" placement="top">
                                        <span style="font-size: 12px">{{ (hideInput ? "show" : "hide") + " input" }}</span>
                                    </b-popover>
                                </b-col>

                                <b-col cols="1" md="auto"
                                       v-if="typeof $store.state[module.moduleName] !== 'undefined' && 
                                       activeModuleName === module.moduleName/* && module.program !== 'Portfolio'*/"
                                       style="width: auto; margin-right: -25px">
                                    <b-button
                                        size="sm"
                                        @click="closeTab(module.moduleName)"
                                        variant="dark"
                                        style="height: 10px; width: 10px; margin: 0 -18px -11px -30px; padding-right: 2px;">
                                        <span class="h5 mb-2" style="margin: 0;">
                                            <b-icon icon="x-square-fill" style="margin: -8px 0 10px -14px"></b-icon>
                                        </span>
                                    </b-button>

                                </b-col>
                            </b-row>
                        </b-container>
                    </template>

                    <div style="background-color: white">
                        <basic-chart-output-new 
                            v-if="module.program === 'BasicChartsNew'"
                            v-bind:namespace="module.moduleName"
                            v-bind:ref="module.moduleName + '-basic-chart-output'"
                            ></basic-chart-output-new>
                        <basic-chart-output-test 
                            v-if="module.program === 'BasicChartsTest'"
                            v-bind:namespace="module.moduleName"
                            v-bind:ref="module.moduleName + '-basic-chart-output'"
                            ></basic-chart-output-test>
                        <calculator-output 
                            v-if="module.program === 'Calculator'" 
                            v-bind:namespace="module.moduleName"
                            ></calculator-output>
                        <stock-chart-output
                            v-if="module.program === 'StockCharts'"
                            v-bind:namespace="module.moduleName"
                            ></stock-chart-output>
                        <test-output
                            v-if="module.program === 'TestCharts'"
                            v-bind:namespace="module.moduleName"
                            ></test-output>
                        <forward-curves-output
                            v-if="module.program === 'ForwardCurves'"
                            v-bind:namespace="module.moduleName"
                            ></forward-curves-output>
                        <saved-charts-admin-output
                            v-if="module.program === 'SavedChartsAdmin'"
                            v-bind:namespace="module.moduleName"
                            ></saved-charts-admin-output>
                        <search-output
                            v-if="module.program === 'Search'"
                            v-bind:namespace="module.moduleName"
                            ></search-output>
                        <search-new-output
                            v-if="module.program === 'SearchNew'"
                            v-bind:namespace="module.moduleName"
                            ></search-new-output>
                        <trade-maps-output
                            v-if="module.program === 'TradeMaps'"
                            v-bind:namespace="module.moduleName"
                            ></trade-maps-output>
                        <spread-coverage-output
                            v-if="module.program === 'SpreadCoverage'"
                            v-bind:namespace="module.moduleName"
                            ></spread-coverage-output>
                        <history-output
                            v-if="module.program === 'History'"
                            v-bind:namespace="module.moduleName"
                            v-bind:ref="module.moduleName + '-history-output'"
                            ></history-output>
                        <multiple-series-charts-output
                            v-if="['LongTermCharts', 'OpenSpreads', 'StackedCharts'].includes(module.program)"
                            v-bind:namespace="module.moduleName"
                            ></multiple-series-charts-output>
                        <time-series-chart-output
                            v-if="module.program === 'TimeSeriesCharts'"
                            v-bind:namespace="module.moduleName"
                            ></time-series-chart-output>
                        <watch-list-output
                            v-if="module.program === 'WatchList'"
                            v-bind:namespace="module.moduleName"
                            ></watch-list-output>
                        <trade-explorer-output
                            v-if="module.program === 'TradeExplorer'"
                            v-bind:namespace="module.moduleName"
                            ></trade-explorer-output>
                        <firestore-search-output
                            v-if="module.program === 'FirestoreSearch'"
                            v-bind:namespace="module.moduleName"
                            ></firestore-search-output>
                        <portfolio-output
                            v-if="module.program === 'Portfolio'"
                            v-bind:namespace="module.moduleName"
                            v-bind:ref="module.moduleName + '-portfolio-output'"
                            ></portfolio-output>
                        <quotes-output
                            v-if="module.program === 'Quotes'"
                            v-bind:namespace="module.moduleName"
                            ></quotes-output>

                    </div>
                </b-tab>
                <template v-slot:tabs-end>
                    <b-nav-item v-b-modal.add-tab-modal>
                        <b style="border: 0px solid darkgray; padding: 0px" id="add-tab-button">+ add tab</b>
                    </b-nav-item>
                    <b-modal
                        size="lg"
                        id="add-tab-modal"
                        ref="add-tab-modal"
                        :title="$t('TABS.chart_selection')">
                        <table border="0">
                            <tr>
                                <td>
                                    <div>
                                        <b-container class="chart_selector" >
                                            <b-row> 
                                                <b-col v-model="newProgram" v-for="(value, i) in programOptions.slice(0,3)" v-bind:key="i">
                                                    <b-card v-on:click="newTab(programOptions[i].value)" v-bind:title="programOptions[i].text" v-bind:img-src="'media/img/'+programOptions[i].text+'.png'" img-alt="Image" img-top style="cursor: pointer">
                                                        <template #footer>
                                                            <small >{{$t('last_updated') }}: 13 {{$t('MONTHS.april') }} 2023</small>
                                                        </template>
                                                    </b-card>
                                                </b-col>
                                            </b-row>
                                            <b-row> 
                                                <b-col v-model="newProgram" v-for="(value, i) in programOptions.slice(3,6)" v-bind:key="i">
                                                    <b-card v-on:click="newTab(programOptions[i+3].value)" v-bind:title="programOptions[i+3].text" v-bind:img-src="'media/img/'+programOptions[i+3].text+'.png'" img-alt="Image" img-top style="cursor: pointer">
                                                        <template #footer>
                                                            <small>{{$t('last_updated') }}: 13 {{$t('MONTHS.april') }} 2023</small>
                                                        </template>
                                                    </b-card>
                                                </b-col>
                                            </b-row>
                                            <b-row> 
                                                <b-col v-model="newProgram" v-for="(value, i) in programOptions.slice(6,9)" v-bind:key="i">
                                                    <b-card v-on:click="newTab(programOptions[i+6].value)" v-bind:title="programOptions[i+6].text" v-bind:img-src="'media/img/'+programOptions[i+6].text+'.png'" img-alt="Image" img-top style="cursor: pointer">
                                                        <template #footer>
                                                            <small>{{$t('last_updated') }}: 15 {{$t('MONTHS.april') }} 2023</small>
                                                        </template>
                                                    </b-card>
                                                </b-col>
                                            </b-row>
                                            <b-row v-if="programOptions.length"> 
                                                <b-col v-model="newProgram" v-for="(value, i) in programOptions.slice(9,12)" v-bind:key="i" class="col-4">
                                                    <b-card v-on:click="newTab(programOptions[i+9].value)" v-bind:title="programOptions[i+9].text" v-bind:img-src="'media/img/'+programOptions[i+9].text+'.png'" img-alt="Image" img-top style="cursor: pointer">
                                                        <template #footer>
                                                            <small>{{$t('last_updated') }}: 16 {{$t('MONTHS.april') }} 2023</small>
                                                        </template>
                                                    </b-card>
                                                </b-col>
                                            </b-row>
                                            <b-row v-if="programOptions.length"> 
                                                <b-col v-model="newProgram" v-for="(value, i) in programOptions.slice(12,15)" v-bind:key="i" class="col-4">
                                                    <b-card v-on:click="newTab(programOptions[i+12].value)" v-bind:title="programOptions[i+12].text" v-bind:img-src="'media/img/'+programOptions[i+12].text+'.png'" img-alt="Image" img-top style="cursor: pointer">
                                                        <template #footer>
                                                            <small>{{$t('last_updated') }}: 16 {{$t('MONTHS.april') }} 2023</small>
                                                        </template>
                                                    </b-card>
                                                </b-col>
                                            </b-row>
                                            <b-row v-if="programOptions.length"> 
                                                <b-col v-model="newProgram" v-for="(value, i) in programOptions.slice(15,18)" v-bind:key="i" class="col-4">
                                                    <b-card v-on:click="newTab(programOptions[i+15].value)" v-bind:title="programOptions[i+15].text"
                                                            v-bind:img-src="'media/img/'+programOptions[i+15].text+'.png'" img-alt="Image" img-top style="cursor: pointer">
                                                        <template #footer>
                                                            <small>{{$t('last_updated') }}: 16 {{$t('MONTHS.april') }} 2023</small>
                                                        </template>
                                                    </b-card>
                                                </b-col>
                                            </b-row>
                                        </b-container>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </b-modal>
                </template>
            </b-tabs>
            </td>
            </tr>
        </table>
    </div>
</template>

<style>
    .bi-calendar {
        margin: 0 -5px 0 -15px;
        visibility: hidden;
        width: 0px;
    }

    .bi-calendar-fill {
        margin: 0 -14px 0 -12px;
        visibility: hidden;
    }

    .b-form-datepicker {
        width: max-content !important;
    }
    .b-form-datepicker button {
        padding: 0px !important;
    }
    .chart_selector .card-img-top {
        height: 108.8px;
    }
    .chart_selector div.card-body h4 {
        font-weight: 600;
        margin-bottom: 0px !important;
    }
    .chart_selector  div.card-body {
        padding: 1rem !important;
    }
    .chart_selector  .card-footer {
        padding: 0px !important;
        font-size: 16px;
        text-align: center;
        border-top: solid 0.25px;
    }
    .chart_selector .row {
        margin-bottom: 10px;
    }
    .chart_selector .card {
        border: solid 0.5px;
    }
</style>

<style scoped>
    #height_breakdown tr:nth-child(even){
        background-color: #f2f2f2;
    }
    #height_breakdown tr:hover {
        background-color: #ddd;
    }

</style>

<script>
   // import generalFormModule from "@/store/generalFormModule";

    import basicChartOutputNew from "@/components/programs/BasicChartNew/basic-chart-output-new";
    import basicChartOutputTest from "@/components/programs/BasicChartTest/basic-chart-output-test";
    import stockChartOutput from "@/components/programs/StockChart/stock-chart-output";
    import calculatorOutput from "@/components/programs/Calculator/calculator-output";
    import forwardCurvesOutput from "@/components/programs/ForwardCurves/forward-curves-output";
    import searchOutput from "@/components/programs/Search/search-output";
    import searchNewOutput from "@/components/programs/SearchNew/search-new-output";
    import startPageOutput from "@/components/programs/StartPage/start-page-output";
    import tradeMapsOutput from "@/components/programs/TradeMaps/trade-maps-output";
    import historyOutput from "@/components/programs/History/history-output";
    import spreadCoverageOutput from "@/components/programs/SpreadCoverage/spread-coverage-output";
    import multipleSeriesChartsOutput from "@/components/programs/multiple-series-charts-output";
    import timeSeriesChartOutput from "@/components/programs/TimeSeriesChart/time-series-chart-output";
    import watchListOutput from "@/components/programs/WatchList/watch-list-output";
    import tradeExplorerOutput from "@/components/programs/TradeExplorer/trade-explorer-output";
    import firestoreSearchOutput from "@/components/programs/FirestoreSearch/firestore-search-output";
    import portfolioOutput from "@/components/programs/Portfolio/portfolio-output";
    import SavedChartsAdminOutput from "@/components/programs/SavedChartsAdmin/saved-charts-admin-output";
    import quotesOutput from "@/components/programs/Quotes/quotes-output";

    import tabTitleModal from "@/components/tab-title-modal";

    const sidebar = () => import("@/components/sidebar");
    import {storeTab, programCompositionArray, setCommoditiesArray, getProgramComposition} from "@/js/main";
    import * as fb from "@/firebase";
    import { bus } from "@/main";
    import _ from "lodash";
    import VueInputAutowidth from 'vue-input-autowidth'
    import Vue from 'vue';
    import { Icon } from '@iconify/vue2';
    import { createInitialState } from '@/js/createInitialState.js';

    Vue.use(VueInputAutowidth);

    export default {
        components: {
            sidebar,
            stockChartOutput,
            calculatorOutput,
            forwardCurvesOutput,
            searchOutput,
            searchNewOutput,
            startPageOutput,
            tradeMapsOutput,
            spreadCoverageOutput,
            historyOutput,
            multipleSeriesChartsOutput,
            timeSeriesChartOutput,
            watchListOutput,
            tradeExplorerOutput,
            firestoreSearchOutput,
            tabTitleModal,
            portfolioOutput,
            Icon,
            SavedChartsAdminOutput,
            basicChartOutputNew,
            basicChartOutputTest,
            quotesOutput //, usersOutput, playbackOutput
        },
        mounted() {
          //  console.log("tabs-box.vue mounted() started.");
            window.addEventListener("resize", this.windowResizeEventHandler);

            bus.$on("setChartHeight", () => {
                console.log("from bus, setChartHeight.");
                this.setChartHeight();
            });

            this.$nextTick(() => {
                fb.db.collection("tabs").doc(this.$store.state.user.email).collection("activeModuleName").doc("activeModuleName-document")
                        .get().then((doc) => {
                    if (doc.exists) {
                        let activeModuleName = doc.data().activeModuleName;
                       // console.log("activeModuleName=", activeModuleName);
                        let moduleArray = this.$store.getters['moduleArray'];
                       // console.log("moduleArray=", JSON.parse(JSON.stringify(moduleArray)));
                        let index = moduleArray.map(x => x.moduleName).indexOf(activeModuleName);
                       // console.log("index=", index);
                        this.$store.commit("setActiveModuleIndex", index);
                    } else {
                        // doc.data() will be undefined in this case
                        console.log("No such document!");
                    }
                }).catch((error) => {
                    console.log("Error getting document:", error); 
             });
            });
        },
        destroyed() {
            console.log("tabs-box.vue destroyed() starting.");
            this.$store.commit("setActiveModuleIndex", null);
            window.removeEventListener("resize", this.windowResizeEventHandler);

            bus.$off();
        },
        data: function () {
            return {
                windowHeight: window.innerHeight,
                newHeight: null,
                lastCheckTime: 0,
                newProgram: null,
                playbackControlKey: 0,
                autoTabTitle: true,
                heightBreakdownObjectArray: []
            };
        },
        computed: {
            minAutoWidth() {
                console.log("minAutoWidth() starting. this.autoTabTitle=", this.autoTabTitle);
                let width;
                if (!this.autoTabTitle) {
                    width = 1.05 * (this.displayTickerWithUnitMoves.length) + 'ch';
                } else {
                    width = 0;
                }
                console.log("minAutoWidth=", width);
                return width;
            },
            width() {
                return "100%";
                /*["TradeMaps", "Calculator"].includes(this.program)  
                 ? "fit-content" 
                 :  "100%";*/
            },
            programOptions() {
                return programCompositionArray(this.role);
            },
            role() {
                return this.$store.state.user.role;
            },
            email() {
                return this.$store.state.user.email;
            },
            showStateEditor() {
                return this.$store.state.showStateEditor;
            },
            hideInput: {
                get() {
                    let hideInput;
                    if (typeof this.activeModule !== "undefined" && this.activeModule !== null) {
                        hideInput = this.activeModule.hideInput;
                    } else {
                        hideInput = false;
                    }
                    //  console.log("hideInput=", hideInput);
                    return hideInput;
                },
                set(hideInput) {
                    this.$store.commit(this.activeModuleName + "/setHideInput", hideInput);
                },
            },
            showPlaybackControl() {
                if (
                        typeof this.activeModule !== "undefined" &&
                        this.activeModule !== null
                        ) {
                    return this.activeModule.showPlaybackControl;
                } else {
                    return false;
                }
            },
            activeModuleIndex: {
                get() {
                    // console.log("activeModuleIndex() get starting. this.$store.state.activeModuleIndex=", this.$store.state.activeModuleIndex);
                    return this.$store.state.activeModuleIndex;
                },
                set(activeModuleIndex) {
                    console.log("set activeModuleIndex()  starting. activeModuleIndex=", activeModuleIndex);
                    // console.trace();
                    //  console.log("arguments.callee.caller.name=", arguments.callee.caller.name); Can't use in srict mode.
                    this.$store.commit("setActiveModuleIndex", activeModuleIndex);
                    /*  let currentTime = (new Date).getTime();   This block causes ugly problems!!!!!
                     // console.log("currentTime=", currentTime, " this.lastCheckTime=", this.lastCheckTime);
                     let timeIncrement = currentTime - this.lastCheckTime;
                     // console.log("timeIncrement=", timeIncrement);
                     
                     if (timeIncrement > 200) {
                     this.$store.commit('setActiveModuleIndex', activeModuleIndex);
                     }
                     this.lastCheckTime = (new Date).getTime();*/
                },
            },
            activeModuleName() {
                let activeModuleName = this.$store.getters["activeModuleName"];
                // console.log("activeModuleName=", activeModuleName);
                return activeModuleName;
            },
            activeModule: {
                get() {
                    let activeModule = this.$store.state[this.activeModuleName];
                    // console.log("activeModule=", activeModule);
                    return typeof activeModule !== "undefined" ? activeModule : null;
                },
                set() {},
            },
            activeModuleJson() {
                // console.log("activeModuleJson() starting.");
                let generalForm = JSON.parse(JSON.stringify(this.activeModule));
                // console.log("generalForm=", generalForm);
                if (typeof generalForm !== 'undefined' && generalForm !== null) {
                    delete generalForm.playback;
                   // delete generalForm.browserSideOnly;
                    return JSON.stringify(generalForm);
                } else {
                    return null;
                }
            },
            moduleArray: {
                get() {
                    let moduleArray = this.$store.getters["moduleArray"];
                    // console.log("moduleArray=", moduleArray);
                    return moduleArray;
                },
                set() {
                    // console.log("program set() starting.");
                    // console.log("moduleArray=", moduleArray);
                },
            },
            inputComponent: {
                get() {
                    // console.log("inputComponent get() starting. this.program=", this.program);
                    if (typeof this.moduleArray[this.activeModuleIndex] !== "undefined") {
                        let role = this.$store.state.user.role;
                        // console.log("getProgramComposition(this.program, role)=", getProgramComposition(this.program, role));
                        let returnComponent = getProgramComposition(this.program, role).input;
                        // console.log("returnComponent()=", returnComponent());
                        return returnComponent;
                    } else {
                        return null;
                    }
                },
            },
            program: {
                get() {
                    // console.log("program get() starting. this.moduleArray[this.activeModuleIndex]=", this.moduleArray[this.activeModuleIndex]);
                    if (typeof this.moduleArray[this.activeModuleIndex] !== "undefined") {
                        return this.moduleArray[this.activeModuleIndex].program;
                    } else {
                        return null;
                    }
                },
                set() {
                    // console.log("program set() starting.");
                    // console.log("program=", program);
                },
            },
            inputDivHeight() {
               // console.log("inputDivHeight() starting. this.activeModule=", this.activeModule);
                if (typeof this.activeModule !== "undefined" && this.activeModule !== null) {
                    let inputDivHeight = this.activeModule.browserSideOnly.inputDivHeight;
                    // console.log("inputDivHeight=", inputDivHeight);
                    return inputDivHeight;
                } else {
                    return null;
                }
            },
            outputDivHeight() {
               // console.log("outputDivHeight() starting. this.activeModule=", this.activeModule);
                if (typeof this.activeModule !== "undefined" && this.activeModule !== null) {
                    let outputDivHeight = this.activeModule.browserSideOnly.outputDivHeight;
                  //  console.log("outputDivHeight=", outputDivHeight);
                    return outputDivHeight;
                } else {
                    return null;
                }
            },
            displayTickerWithUnitMoves() {
                return this.$store.getters[this.activeModuleName + "/displayTickerWithUnitMoves"];
            },
            initializingState() {
                return this.$store.state.user.initializingState;
            },
            showMemoryChart() {
                return this.$store.state.user.showMemoryChart;
            },
            showHeightBreakdown: {
                get() {
                    return this.$store.state.user.showHeightBreakdown;
                },
                set(showHeightBreakdown) {
                    this.$store.commit('user/setShowHeightBreakdown', showHeightBreakdown);
                }
            }
        },
        watch: {
             activeModuleIndex: function (activeModuleIndex) {
              console.log("watch activeModuleIndex=", activeModuleIndex);
              console.log("this.generalForm=", this.generalForm);
              if(typeof this.generalForm !== 'undefined'){
                this.$store.dispatch('user/updateInitializingState', this.generalForm);
              }
             },
            "$store.state.siteData.commoditiesArray"(newCommoditiesArray/*, oldCommoditiesArray*/) {
                // console.log("watch newCommoditiesArray=", newCommoditiesArray, " oldCommoditiesArray=", oldCommoditiesArray);
                // console.log("this.activeModuleName=", this.activeModuleName);
                setCommoditiesArray(newCommoditiesArray);
                this.$store.dispatch(this.activeModuleName + "/getContractListsFromServer");
            },
            windowHeight: function (newWindowHeight, oldWindowHeight) {
                // console.log("watch newWindowHeight=", newWindowHeight, " oldWindowHeight=", oldWindowHeight);
                if (newWindowHeight !== oldWindowHeight) {
                    console.log("watch windowHeight=", newWindowHeight);
                    this.setChartHeight();
                }
            },
            inputDivHeight: function (inputDivHeight) {
                console.log("watch inputDivHeight=", inputDivHeight + " this.windowHeight=", this.windowHeight);
                this.setChartHeight();
            },
            outputDivHeight: function (outputDivHeight) {
                console.log("watch outputDivHeight=", outputDivHeight + " this.windowHeight=", this.windowHeight);
                this.setChartHeight();
            },
            showPlaybackControl: function (/*showPlaybackControl*/) {
                // console.log("watch showPlaybackControl=", showPlaybackControl);
                this.setChartHeight();
            },
            /*   activeModule: function (activeModule) {
             console.log("watch activeModule = ", activeModule);
             this.setChartHeight();
             },*/
            activeModuleJson: function (newActiveModuleJson, oldActiveModuleJson) {
                console.log("watch activeModuleJson");
                //  console.log("JSON.parse(newActiveModuleJson)=", JSON.parse(newActiveModuleJson));
                //  console.log("JSON.parse(oldActiveModuleJson)=", JSON.parse(oldActiveModuleJson));

                if (typeof this.$store.state[this.activeModuleName] !== 'undefined') {
                    let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.activeModuleName]));
                    // console.log("generalForm=", JSON.parse(JSON.stringify(generalForm)));
                    if (newActiveModuleJson !== oldActiveModuleJson &&
                            (generalForm.isTickerInputValid || this.$store.state.user.tickerInputType === "form" || generalForm.instrument === "stock")) {
                        /*   const jsondiffpatch = require('jsondiffpatch').create();
                         const diff = jsondiffpatch.diff(newActiveModuleJson, oldActiveModuleJson);
                         console.log("diff=", diff); */
                        // console.log("diff=", JSON.parse(diff));

                        //  console.log("watching activeModuleJson");
                        storeTab(JSON.parse(newActiveModuleJson), this.email);
                    }
                }
            },
            showMemoryChart(showMemoryChart) {
                console.log("watch showMemoryChart=", showMemoryChart);
                this.setChartHeight();
            }
        },
        methods: {
            //  onInput(/*value*/) {
            /*  console.log("onInput() starting.");
             if(!this.visitedTabs.includes(this.activeModuleName)){
             
             let arr = this.visitedTabs.slice();
             arr.push(this.activeModuleName);
             this.visitedTabs = arr.sort();
             }
             }, */


            clearTable() {
                console.log("clearTable() starting.");
                this.heightBreakdownObjectArray = [];

            },
            toggleTabTitleInput() {
                console.log("toggleTabTitleInput() starting. this.autoTabTitle=", this.autoTabTitle);
                /*  if(this.autoTabTitle){
                 console.log("this.displayTickerWithUnitMoves=", this.displayTickerWithUnitMoves);
                 this.$store.commit(this.activeModuleName + '/setTabTitle', this.displayTickerWithUnitMoves);
                 }
                 this.autoTabTitle = !this.autoTabTitle;*/
            },           
            windowResizeEventHandler(e) {
                // console.log("windowResizeEventHandler() starting. window height=", e.target.innerHeight);
                this.windowHeight = e.target.innerHeight;
                this.setChartHeight();
                
                    
                if(this.program === 'History'){
                    console.log("calling debounced function");
                    this.debounce_fun();
                }
            },
            debounce_fun: _.debounce(function () {
                    console.log("calling history-output");
                    console.log("this=", this);
                    console.log("this.$refs=", this.$refs, "this.activeModuleName=", this.activeModuleName);
                    console.log("this.$refs["+this.activeModuleName+"-history-output][0]=", this.$refs[this.activeModuleName+'-history-output'][0]);
                    this.$refs[this.activeModuleName+'-history-output'][0].createCharts();
                }, 1000),
            setChartHeight/*: _.debounce(function*/ () {
                console.log("setChartHeight() starting."/* this.activeModule.browserSideOnly.inputDivHeight=", this.activeModule.browserSideOnly.inputDivHeight, "this.outputDivHeight=", this.outputDivHeight,
                 " this.windowHeight=", this.windowHeight + " this.activeModuleName=", this.activeModuleName*/);

                // console.log("this.activeModule.showPlaybackControl");
                // console.trace();

               // console.log("this.activeModule=", JSON.parse(JSON.stringify(this.activeModule)));
                if (this.program !== "TradeMaps" && this.activeModuleName !== null && (this.activeModule.browserSideOnly.inputDivHeight !== null || this.activeModule.browserSideOnly.outputDivHeight !== null)) {
                    let elem = document.getElementById(this.activeModuleName + "-chartDiv");

                    const elem2 = document.getElementById(this.activeModuleName + "-plotlyRibbonChartDiv");
                    const elem3 = document.getElementById(this.activeModuleName + "-plotlyRibbonChartInstructions");
                    let errorElement = document.getElementById("error");
                  //  console.log("errorElement=", errorElement);

                    let errorHeight = typeof errorElement === 'undefined' || errorElement === null ? 0 : errorElement.offsetHeight;
                   // console.log("errorHeight=", errorHeight);

                    let playbackControlHeight = this.showPlaybackControl ? 33 : 0;
                    let pagePadding = 2 * 10; // See $page-padding in _variables.scss

                    this.newHeight;
                   // console.log("this.program=", this.program);
                    let memoryChartHeight = (this.showMemoryChart && ["admin", "superadmin"].includes(this.$store.state.user.role)) ? 220 : 0;
                   // console.log("memoryChartHeight=", memoryChartHeight);
                    if (["BasicChartsNew", "StockCharts"].includes(this.program)) {
                        this.newHeight = this.windowHeight - this.activeModule.browserSideOnly.outputDivHeight - playbackControlHeight - pagePadding - 85 - memoryChartHeight - errorHeight;
                    } else {
                        this.newHeight = this.windowHeight - this.activeModule.browserSideOnly.inputDivHeight - playbackControlHeight - pagePadding - 100 - memoryChartHeight - errorHeight;
                    }
                  //  console.log("this.newHeight=", this.newHeight);

                    if (elem !== null) {
                        elem.style.height = this.newHeight + "px";
                        //  console.log("elem=", elem);
                    }
                    if (elem2 !== null) {
                        let instructionsHeight = elem2 !== null ? elem3.offsetHeight : 0;
                        elem2.style.height = this.newHeight - instructionsHeight + "px";
                    }

                    let heightBreakdownObject = {
                        inputDivHeight: this.activeModule.browserSideOnly.inputDivHeight,
                        outputDivHeight: this.activeModule.browserSideOnly.outputDivHeight,
                        windowHeight: this.windowHeight,
                        newHeight: this.newHeight
                    };
                  //  console.log("heightBreakdownObject=", heightBreakdownObject);
                    this.heightBreakdownObjectArray.push(heightBreakdownObject);
                   // console.log("this.heightBreakdownObjectArray=", JSON.parse(JSON.stringify(this.heightBreakdownObjectArray)));
                }
            }/*, 2000)*/,
            toggleHideInput() {
                console.log("toggleHideInput() starting.");
                console.log("this.hideInput=", this.hideInput);
                this.$store.commit(this.activeModuleName + "/setHideInput", !this.hideInput);
            },
            checkForHistoryTab(program) {
                let programs = this.moduleArray.map((x) => x.program);
                // console.log("programs=", programs);
                return program === "History" && programs.includes("History");
            },
            checkForPortfolioTab(program) {
                let programs = this.moduleArray.map((x) => x.program);
                // console.log("programs=", programs);
                return program === "Portfolio" && programs.includes("Portfolio");
            },
            newTab(program) {
                console.log("newTab() starting. this.initializingState=", JSON.parse(JSON.stringify(this.initializingState)));
                this.$store.dispatch('newTab', program);
                this.$refs["add-tab-modal"].hide();
            },
            changeTab(program) {
                console.log("changeTab() starting. program=", program);

                if (this.checkForHistoryTab(program)) {
                    alert("Sorry. Only one History tab is allowed.");
                } else if (this.checkForPortfolioTab(program)) {
                    alert("Only one Portfolio tab is allowed.");
                } else {
                    if (this.activeModuleName === null) {
                        this.newTab(program);
                    } else {
                        let initialState = createInitialState(program, this.role, this.initializingState);
                        this.$store.commit(this.activeModuleName + "/setGeneralForm", initialState);
                        this.$store.commit(this.activeModuleName + "/setConstrainSampleContract", false);
                        this.$store.commit("resetNumberOfAjaxCalls");
                        // console.log("this.$store.state[this.activeModuleName]=", JSON.parse(JSON.stringify(this.$store.state[this.activeModuleName])));
                        this.$store.dispatch(this.activeModuleName + "/getContractListsFromServer");
                    }
                }
            },
            closeTab(moduleName) {
                console.log("closeTab() starting. moduleName=", moduleName);
                //   this.activeModuleIndex--;
                //  console.log("this.activeModuleIndex=", this.activeModuleIndex);

                this.$store.commit("resetNumberOfAjaxCalls");
                this.$store.unregisterModule(moduleName);
                /*   if (this.moduleArray.length === 0) {
                 this.$refs['add-tab-modal'].show();
                 }*/

                let numberOfTabs = this.$store.getters["moduleArray"].length;
                console.log("numberOfTabs=", numberOfTabs);
                if (numberOfTabs === 0) {
                    this.$store.commit("user/setInitializingState", {});
                }

                fb.db
                        .collection("tabs")
                        .doc(this.$store.state.user.email)
                        .collection("tabs")
                        .doc(moduleName)
                        .delete()
                        .then(() => {
                            console.log("tab deleted.");
                        })
                        .catch((error) => {
                            console.error("Error removing document: ", error);
                        });
            },
            closeAllTabs() {
                console.log("closeAllTabs() starting.");
                let arr = this.$store.getters["moduleArray"];
                console.log("arr=", arr);
                arr.forEach((x) => this.closeTab(x.moduleName));
                this.$store.commit("user/setInitializingState", {});
            },
        },
    };
</script>