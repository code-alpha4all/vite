//import Vue from "vue";
import Vuex from "vuex";
import { vuexfireMutations } from 'vuexfire';

import htmlClass from "./htmlclass.module";
import config from "./config.module";
import breadcrumbs from "./breadcrumbs.module";
import user from "./user";
import generalFormModule from "@/store/generalFormModule";

import siteData from "./siteDataModule";
import settings from './settings';
import { createInitialState } from '@/js/createInitialState.js';
import { transformLegacyState } from "@/js/main";
//Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        htmlClass,
        config,
        breadcrumbs,
        user,
        settings,
        siteData
    },
    state: {
        activeModuleIndex: null,
        showStateEditor: false,
        tabsInitialized: false,
        loading: false,
        numberOfAjaxCalls: 0
    },
    getters: {
        moduleArray(state) {
             // console.log("state=", JSON.parse(JSON.stringify(state)));
            //  console.log("Object.values(state)=", Object.values(JSON.parse(JSON.stringify(state))));
            let arr = Object.values(state)
                .filter(module => module !== null && typeof module.moduleName !== 'undefined'
                    && module.moduleName !== null && module.moduleName.includes("generalFormTab"));

            // console.log("arr=", arr);
            return arr;
        },
        moduleNameArray(state, getters){
            let moduleArray = getters['moduleArray'];
            // console.log("moduleArray=", moduleArray);
            
            let moduleNameArray = moduleArray.map(generalForm => generalForm.tabTitle);
            return moduleNameArray;
        },
        moduleInfoArray(state, getters){
            let moduleArray = getters['moduleArray'];
            // console.log("moduleArray=", moduleArray);
            
            let moduleNameArray = moduleArray.map((generalForm, i) => ({index: i, tabTitle: generalForm.tabTitle, moduleName: generalForm.moduleName}));
           // console.log("moduleNameArray=", moduleNameArray);
            return moduleNameArray;
        },
        activeModule(state, getters) {
            //  console.log("activeModule getter starting.");
            let moduleArray = getters['moduleArray'];

            if (typeof moduleArray[state.activeModuleIndex] !== 'undefined') {
                let activeModule = moduleArray[state.activeModuleIndex];
                // console.log("activeModule=", activeModule);
                return activeModule;
            } else {
                return null;
            }
        },
        activeModuleName(state, getters) {
            //  console.log("activeModuleName getter starting.");
            let moduleArray = getters['moduleArray'];

            if (typeof moduleArray[state.activeModuleIndex] !== 'undefined') {
                let activeModuleName = moduleArray[state.activeModuleIndex].moduleName;
                // console.log("activeModuleName=", activeModuleName);
                return activeModuleName;
            } else {
                return null;
            }
        },
        nextModuleName(state, getters) {
           // console.trace();
            let nextModuleId;
            let moduleArray = getters['moduleArray'];
            if (moduleArray.length === 0) {
                nextModuleId = 0;
            } else {
                let ids = moduleArray.map(x => parseInt(x.moduleName.replace('generalFormTab', '')));
                // console.log("ids=", ids);
                nextModuleId = Math.max(...ids) + 1;
            }
            let nextModuleName = "generalFormTab" + nextModuleId;
           // console.log("nextModuleName=", nextModuleName);
            return nextModuleName;
        },
        portfolioTabIndex(state, getters){
            let moduleArray = getters["moduleArray"];
            let programs = moduleArray.map((x) => x.program);
            console.log("programs=", programs);

            let portfolioIndex = programs.indexOf("Portfolio");
           // console.log("portfolioIndex=", portfolioIndex);
           return portfolioIndex;
        }
    },
    mutations: {
        setActiveModuleIndex: function (state, activeModuleIndex) {
            // console.log("setActiveModuleIndex() starting. activeModuleIndex=", activeModuleIndex);
            // console.trace();
            state.activeModuleIndex = activeModuleIndex;
        },
        setShowStateEditor: function (state, showStateEditor) {
            state.showStateEditor = showStateEditor;
        },
        setTabsInitialized: function (state, tabsInitialized) {
            state.tabsInitialized = tabsInitialized;
        },
        /*  setLoading: function (state, loading) {
              state.loading = loading;
          },  */
        incrementNumberOfAjaxCalls(state) {
            state.numberOfAjaxCalls++;
        },
        decrementNumberOfAjaxCalls(state) {
            // console.log("state.numberOfAjaxCalls=", state.numberOfAjaxCalls);
            let num = state.numberOfAjaxCalls > 0 ? state.numberOfAjaxCalls - 1 : 0;
            // console.log("num=", num);
            state.numberOfAjaxCalls = num;
        },
        resetNumberOfAjaxCalls(state) {
            state.numberOfAjaxCalls = 0;
        },
        ...vuexfireMutations
    },
    actions: {
        newTab( { getters, commit, state, dispatch }, program) {
            console.log("newTab() starting. program=", program);

           let moduleArray = getters["moduleArray"];
           let programs = moduleArray.map((x) => x.program);
           // console.log("programs=", programs);

            if(program === "History" && programs.includes("History")) {
                alert("Sorry. Only one History tab is allowed.");
            } else if (program === "Portfolio" && programs.includes("Portfolio")) {
                //alert("Only one Portfolio tab is allowed.");
                let portfolioIndex = getters["portfolioTabIndex"];

                setTimeout(() => {
                    commit("setActiveModuleIndex", portfolioIndex);
                }, 1000);
            } else {
                let initializingState = state.user.initializingState;
                console.log("initializingState=", initializingState);

                let role = state.user.role;
               // console.log("role=", role);

                let initialState = createInitialState(program, role, initializingState);
                // console.log("initialState=", JSON.parse(JSON.stringify(initialState)));
                let nextModuleName = getters["nextModuleName"];
                console.log("nextModuleName=", nextModuleName);
                if (!this.hasModule(nextModuleName)) {
                    // console.log("generalForm=", generalForm);
                    this.registerModule(nextModuleName, generalFormModule);
                    commit(nextModuleName + "/setGeneralForm", initialState);
                    commit(nextModuleName + "/setModuleName", nextModuleName);
                    commit(nextModuleName + "/setConstrainSampleContract", false);
                    commit("resetNumberOfAjaxCalls");
                    // console.log("JSON.parse(JSON.stringify(state[nextModuleName]))=", state[nextModuleName]);
                    dispatch(nextModuleName + "/getContractListsFromServer");

                    let index = getters["moduleNameArray"].length-1;
                    console.log("index=", index);
                    
                    setTimeout(() => {
                        commit("setActiveModuleIndex", index);
                    }, 1000);
                } else {
                    console.error("moduleName already in use!")
                }
            }
        },
        newTabWithInitialState( { getters, commit,/* state,*/ dispatch }, initialState) {
            console.log("newTabWithInitialState() starting. initialState=", JSON.parse(JSON.stringify(initialState)));

          /*  if (state === "No such document!") {
                alert("Error! No such document!");
            } else if (this.checkForHistoryTab(state.program)) {
                alert("Sorry. Only one History tab is allowed.");
            } else {*/
                let transformedInitialState = transformLegacyState(initialState); //_.merge(baseInitialState, state);
                console.log("transformedInitialState=", transformedInitialState);

                let nextModuleName = getters["nextModuleName"];
                console.log("nextModuleName=", nextModuleName);
                if (!this.hasModule(nextModuleName)) {
                    // console.log("generalForm=", generalForm);
                    this.registerModule(nextModuleName, generalFormModule);
                    commit(nextModuleName + "/setGeneralForm", transformedInitialState);
                    commit(nextModuleName + "/setModuleName", nextModuleName);
                    commit(nextModuleName + "/setConstrainSampleContract", false);
                    commit("resetNumberOfAjaxCalls");
                    // console.log("JSON.parse(JSON.stringify(state[nextModuleName]))=", state[nextModuleName]);
                    dispatch(nextModuleName + "/getContractListsFromServer");

                    let index = getters["moduleNameArray"].length-1;
                    console.log("index=", index);
                    
                    setTimeout(() => {
                        commit("setActiveModuleIndex", index);
                    }, 1000);
                } else {
                    console.error("moduleName already in use!")
                }
          //  }
        },
    }
})
