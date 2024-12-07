//import Vue from "vue";
import Vuex from "vuex";
import store from "@/store";
import * as fb from "@/firebase.js";
//import router from "@/router.js";
import { firestoreAction } from 'vuexfire';
import { nearestOpenSpread } from "@/js/main";

//Vue.use(Vuex);

export default {
    namespaced: true,
    state: {
        uid: "",
        name: "",
        username: "",
        email: "",
        role: "",
        subscriptions: [],
       // authorized: process.env.VUE_APP_AUTHENTICATED || false, // false is default value
        // loading: false,

        selectedSidebarComponent: null,
        showTour: true,
        showHeightBreakdown: false,
        symbols: "new",
        tickerInputType: "text",
        mapEndpoint: "firebaseStorage", // This should be moved!
        initializingState: null,

        strategies: [],
        portfolioDirectory: "",
        showAllPortfolioFolders: false,
        showMemoryChart: true,
        folders: []
    },
    getters: {
        user: (state) => state,

        portfolioFolders(state) {
            let folders = state.folders.slice();
            console.log("folders=", folders);
            folders.push({ id: null, folder: "Tradebook" });
            folders.push({ id: null, folder: "Watchlist" });
            folders.push({ id: null, folder: "Archive" });

            if (!folders.map(x => x.folder).includes(state.portfolioDirectory)) {
                folders.push({ id: null, folder: state.portfolioDirectory });
            }
          //  console.log("folders=", JSON.parse(JSON.stringify(folders)));
            // console.log("state.portfolioDirectory=", state.portfolioDirectory);
            return folders;
        }
    },
    mutations: {
        setUser: function (state, newState) {
            // console.log("setUser() starting.");
            Object.assign(state, newState);
        },
        setUid: function (state, uid) {
            state.uid = uid;
        },
        setName: function (state, name) {
            state.name = name;
        },
        setEmail: function (state, email) {
            // console.log("setEmail() starting.");
            state.email = email;
        },
        setRole: function (state, role) {
            state.role = role;
        },
        setSubscriptions: function (state, subscriptions) {
            state.subscriptions = subscriptions;
        },
        setShowTour: function (state, payload) {
            state.showTour = payload;
        },
        setInitializingState(state, payload) {
            // console.log("setInitializingState() starting. payload.selected=", payload.selected);
            // console.trace();
            state.initializingState = payload;
        },
        setSymbols(state, payload) {
            state.symbols = payload;
        },
        setTickerInputType(state, payload) {
            state.tickerInputType = payload;
        },
        setMapEndpoint: function (state, payload) {
            state.mapEndpoint = payload;
        },
        setPortfolioDirectory: function (state, payload) {
            console.log("setPortfolioDirectory() starting. payload=", payload);
            // console.trace();
            state.portfolioDirectory = payload;
        },
        setPortfolioFolders: function (state, payload) {
            state.portfolioFolders = payload;
        },
        setShowAllPortfolioFolders: function (state, payload) {
            state.showAllPortfolioFolders = payload;
        },
        setShowMemoryChart: function (state, payload) {
            state.showMemoryChart = payload;
        },
        setShowHeightBreakdown: function (state, payload) {
            state.showHeightBreakdown = payload;
        }
    },
    actions: {
        updateInitializingState({ commit, state }, generalForm) {
            console.log("updateInitializingState() starting.");
           // console.log("generalForm=", generalForm);
            // console.log("generalForm=", JSON.parse(JSON.stringify(generalForm)));
            if (!["Search", "StockCharts", "OpenSpreads"].includes(generalForm.program)/* && this.$store.state[this.activeModuleName] !== 'undefined'*/) {
                //  console.log("generalForm=", JSON.parse(JSON.stringify(generalForm)));

              /*  if (["OpenSpreads"].includes(generalForm.program)) {
                    // generalForm.selected = [generalForm.sampleContract[0]];
                   // console.log("generalForm.selected[0]=", generalForm.selected[0]);
                    generalForm.selected = [generalForm.selected[0]];
                    let contract = generalForm.selected[0].split('/');
                    generalForm.legs = contract.length;
                    contract.forEach((x, i) => {
                        generalForm.sampleContract[i] = x;
                    })
                } else */ if (["Calculator"].includes(generalForm.program)) {
                    let temp = nearestOpenSpread(generalForm);
                    // console.log("temp=", temp);
                    generalForm.selected = [temp.value];
                }
                //  console.log("generalForm=", generalForm);
                commit("setInitializingState", generalForm);
            } else  if(state.initializingState !== null){
                let newInitializingstate = state.initializingState;
                newInitializingstate.moduleName = generalForm.moduleName;
                commit("setInitializingState", newInitializingstate);
            }
        },
        bindStrategies: firestoreAction(({ bindFirestoreRef, state }) => {
            console.log("bindStrategies() starting. state=", state);
            // return the promise returned by `bindFirestoreRef`
            return bindFirestoreRef('strategies', fb.db.collection('portfolio-alpha').doc(state.email).collection('strategies'));
        }),
        bindFolders: firestoreAction(({ bindFirestoreRef, state }) => {
           // console.log("bindFolders() starting. state=", state);
            // return the promise returned by `bindFirestoreRef`
            return bindFirestoreRef('folders', fb.db.collection('portfolio-alpha').doc(state.email).collection('folders'));
        }),
        async logout({ commit }) {
            console.log("logout() starting.");
            commit("setTabsInitialized", false, { root: true });
            commit("setRole", "");

            await fb.auth.signOut();
          //  router.currentRoute.path !== "/auth" && router.push("/auth");
        },
        async fetchUserProfile({ commit }, user) {
            // console.log("async fetchUserProfile() starting. user=", user);
            // commit('setLoading', true);
            // console.log("store.state.user=", {...store.state.user});

            return new Promise((resolve) => {
                if (store.state.user.role !== "") {
                    // console.log("Getting userInfo from the store.");
                    let userInfo = {
                        role: store.state.user.role,
                        email: store.state.user.email,
                        name: store.state.user.name,
                        uid: store.state.user.uid,
                        subscriptions: store.state.user.subscriptions,
                        tickerInputType: store.state.user.tickerInputType
                    };
                    // console.log("userInfo=", userInfo);
                    resolve(userInfo);
                } else {
                    // console.log("Checking firebase.");
                    fb.usersCollection.doc(user.email).onSnapshot((firebaseData) => {
                       // console.log("onSnapshot() starting. user.email=", user.email, " store.state.user.email=", store.state.user.email);
                        const userInfo = firebaseData.data();
                        // console.log("userInfo=", userInfo);

                        if (userInfo && [user.email, ""].includes(store.state.user.email)) {
                            commit("setUser", userInfo);
                        }
                        // console.log("userInfo=", userInfo);
                        resolve(userInfo);
                    });
                }
            });
        },
    }
};
