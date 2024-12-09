<template>
    <!-- begin:: Header Topbar -->
    <div class="topbar" style="margin-bottom: -5px;">

        <table style="width: 100%">
            <tr v-if="showMemoryChart && ['admin', 'superadmin'].includes($store.state.user.role)">
                <td>
            <memory-monitor></memory-monitor>
            </td>
            </tr>
            <tr>
                <td>
            <b-navbar type="dark" class="my-class"
                      style="border: 1px solid darkgray; width: 100%; background-color: #05386b"
                      >
                <table border=0>
                    <tr>
                        <td>
                            <div style="font-size: 2.0rem; font-weight: bold; color: white; margin: -5px 0px -5px 0px;">
                                Scarr Charts 
                            </div>
                        </td>
                    </tr>
                </table>

                <!--  <b-navbar-brand href="#">NavBar</b-navbar-brand>  -->

                <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

                <b-collapse id="nav-collapse" is-nav>
                    <!--   <span style="font-size: 1.3rem; font-weight: bold; margin: 0px 7px 0px 0px; color: white; vertical-align: middle;">
                           &nbsp;&nbsp;></span>
                       <span style="font-size: 1.6rem; font-weight: bold; margin: 3px 0px 0 0px; color: white;">{{ $route.meta.breadcrumb }}</span> -->

                    <span v-if="$route.meta.breadcrumb === 'Tabs'">
                        <span style="font-size: 1.3rem; font-weight: bold; margin: 0px 7px 0px 0px; color: white; vertical-align: middle;">
                            &nbsp;&nbsp;></span>
                        <b-form-select
                            style="
                            border: 1px solid gray;
                            width: auto;
                            margin: 0 0 0 0;
                            font-size: 16px;
                            font-weight: bold;
                            background-color: #05386b;
                            color: white;
                            "
                            v-model="oldProgram"
                            :options="programOptions"
                            size="sm"
                            @change="changeProgram"
                            id="program-select"
                            class="program-select"
                            ></b-form-select>
                        <loading-indicator></loading-indicator> 
                    </span>   

                    <div v-if="['admin', 'superadmin'].includes($store.state.user.role)"
                         style="color: rgb(47, 255, 210); margin: -4px 0px -4px 13px; font-size: 11px;">dan_development</div>

                    <!-- Right aligned nav items -->
                    <b-navbar-nav
                        class="ml-auto"
                        style="font-size: 1.3rem; margin-bottom: -8px">

                        <b-dropdown style="width: auto; height: 35px; margin: 0px 15px 0 0px;" variant="primary" class="my-class">
                            <template #button-content>
                                <span>Commodities</span>
                            </template>
                            <table border=0 style="width: 1140px; margin: 0 5px 5px 5px;">
                                <tr>
                                    <td style="padding: 0 0 0 20px; vertical-align: top">
                                <commodity-specs-table></commodity-specs-table>
                                </td>
                                <td style="vertical-align: top; padding: 0 0 0 -50px">
                                <months-table></months-table>
                                </td>
                                </tr>
                            </table>
                        </b-dropdown>

                        <b-navbar-nav style="margin-top: 5px">
                            <router-link
                                to="/admin" id="users"
                                v-if="['superadmin'].includes($store.state.user.role)"
                                style="margin: 0 12px 0 0px"
                                >Users</router-link
                            >
                            <router-link
                                to="/exercises"
                                v-if="['admin', 'superadmin'].includes($store.state.user.role)"
                                style="margin: 0 12px 0 0px"
                                >Exercises</router-link
                            >
                            <router-link
                                to="/playback"
                                v-if="['admin', 'superadmin'].includes($store.state.user.role)"
                                style="margin: 0 12px 0 0px"
                                >Playback</router-link
                            >
                            <!--  <router-link to="/support" style="margin: 0 0px 0 0px" id="support"
                                           >Support</router-link> -->
                        </b-navbar-nav>

                        <!--   <b-button @click="toggleStateEditor" size="sm"
                                                style="height: auto; border: 1px solid darkgray; margin: 2px 0 0 16px"
                                                v-bind:style="{color: 'white', backgroundColor: showStateEditor ? '#6495ED' : 'darkblue'}">
                                         {{(showStateEditor ? "hide" : "show") + " State Editor" }}
                                     </b-button>  -->          

                        <!--begin: Language bar -->
                        <div
                            v-if="['admin', 'superadmin'].includes($store.state.user.role)"
                            class="topbar-item"
                            style="margin: -8px 0 0 10px"
                            >
                            <b-dropdown
                                size="sm"
                                variant="link"
                                toggle-class="btn btn-icon btn-clean btn-dropdown btn-lg mr-1 text-decoration-none"
                                no-caret
                                right
                                no-flip
                                >
                                <template v-slot:button-content>
                                    <img
                                        class="h-20px w-20px rounded-sm"
                                        :src="languageFlag || getLanguageFlag"
                                        alt=""
                                        />
                                </template>
                                <b-dropdown-text tag="div" class="min-w-md-175px">
                                    <KTDropdownLanguage
                                        v-on:language-changed="onLanguageChanged"
                                        ></KTDropdownLanguage>
                                </b-dropdown-text>
                            </b-dropdown>
                        </div>
                        <!--end: Language bar -->          


                        <v-dropdown :open="showDropdown" ref="help-dropdown" style="">
                            <!-- named slot -->
                            <template #caller>
                                <!-- dropdown container trigger -->
                                <b-button size="sm" style="background-color: #9A0A54;  color: white; border: 1px solid gray; margin: 0 10px 8px 5px; font-size: 12px;">
                                    <table>
                                        <tr>
                                            <td style="color: white; white-space: nowrap;">Help</td>
                                        </tr>
                                    </table>
                                </b-button>
                            </template>

                            <vue-tree-list
                                @click="onTourClick"
                                :model="treeDataTree"
                                v-bind:default-expanded="false"
                                style="font-size: 13px; font-weight: bold; margin: 5px">
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

                        </v-dropdown> 

                        <Icon style="color: #404040; margin: 2px 0px 0px 0px; cursor: pointer; color: red" icon="mdi:bell-alert-outline" width="27" height="27"
                              v-b-tooltip.noninteractive.hover.topleft="'portfolio alarm triggered'"
                              v-if="$store.state.siteData.portfolioAlarmTriggered" />

                        <b-nav-item
                            v-if="!['admin', 'superadmin'].includes($store.state.user.role)"
                            disabled
                            id="popover-target-1"
                            right
                            style="margin: -1px 10px 0 10px; font-size: 1.3rem; color: white"
                            >Lang
                        </b-nav-item>

                        <div
                            class="text-center my-3"
                            v-if="!['admin', 'superadmin'].includes($store.state.user.role)"
                            >
                            <b-popover
                                target="popover-target-1"
                                triggers="hover"
                                placement="top"
                                >
                                <span style="font-size: 1.2rem"
                                      >We will soon start working on translations for German, Italian
                                    and Spanish.</span
                                >
                            </b-popover>
                        </div>

                        <!--begin: Checkout Button -->
                        <div
                            v-if="$store.state.user.role == 'guest'"
                            style="margin: 1px 11px 0 2px"
                            >
                            <button
                                size="sm"
                                class="btn"
                                style="font-size: 1.3rem; padding: 2px 5px; margin-bottom: 5px; color:white;background-color: #0173E9;border-color: #0173E9"
                                @click="upgradePackage()"
                                >
                                <i class="icon-1x flaticon-upload" style="color:white"></i>
                                Upgrade
                            </button>
                        </div>
                        <!--end: Checkout Button -->

                        <!--begin: User Bar -->
                        <KTQuickUser id="user-profile"></KTQuickUser>
                        <!--end: User Bar -->

                        <!--b-nav-item-dropdown right style="margin: 0 10px 0 10px">
                          <template #button-content>
                            <em style="color: white">Hello, {{ $store.state.user.name }}</em>
                          </template>
                          <b-dropdown-item href="#">
                            <button class="btn btn-light-primary btn-bold" @click="onLogout">
                              Sign out
                            </button>
                          </b-dropdown-item>
                        </b-nav-item-dropdown-->
                    </b-navbar-nav>
                </b-collapse>
            </b-navbar>

            <b-modal ref="support-modal" title="Support">
                <div class="d-block text-center">
                    <support></support>
                </div>
            </b-modal>

            <!-- Upgrade package popup -->
            <div>
                <b-modal ref="upgradePopup" hide-footer hide-header>
                    <div class="loadingBlock" v-if="isHidden">
                        <div class="text-center">
                            <b-spinner variant="primary" label="Spinning"></b-spinner>
                        </div>
                    </div>

                    <div class="d-block">
                        <div style="margin-top: 20px">
                            <template>
                                <div>
                                    <div class="card card-custom">
                                        <div class="card-header">
                                            <div class="card-title">
                                                <span class="card-icon">
                                                    <i class="flaticon2-box-1 text-success"></i>
                                                </span>
                                                <span class="card-label h1">Subscription Packages</span>
                                            </div>
                                        </div>
                                        <div class="card-body" style="padding: 0 !important">
                                            <div class="row my-10">
                                                <!--begin: Pricing-->
                                                <div class="col-md-6">
                                                    <div class="px-5 text-center">
                                                        <span
                                                            style="font-size: 40px !important"
                                                            class="
                                                            font-size-h1
                                                            d-block
                                                            font-weight-boldest
                                                            text-dark-75
                                                            py-2
                                                            "
                                                            >
                                                            25
                                                            <sup class="font-size-h3 font-weight-normal pl-1"
                                                                 >$</sup
                                                            >
                                                        </span>
                                                        <h3
                                                            class="d-block font-weight-bold mb-7 text-dark-50"
                                                            >
                                                            Monthly Subscription
                                                        </h3>
                                                        <div class="mb-15 d-flex flex-column">
                                                            <h4>Payment is required each month</h4>
                                                            <h4>Get 1 Month access starting from today</h4>
                                                            <h4>Discount 0%</h4>
                                                        </div>
                                                        <div class="d-flex justify-content-center">
                                                            <stripe-checkout
                                                                ref="monthlyRecurringCheckoutRef"
                                                                mode="subscription"
                                                                :pk="publishableKey"
                                                                :line-items="monthlyRecurringLineItem"
                                                                :success-url="successURL"
                                                                :cancel-url="cancelURL"
                                                                :customerEmail="email"
                                                                />
                                                            <button
                                                                type="button"
                                                                class="
                                                                btn btn-success
                                                                text-uppercase
                                                                font-weight-bolder
                                                                px-15
                                                                py-3
                                                                "
                                                                @click="monthlyRecurring()"
                                                                >
                                                                Order Recurring Billing
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <!--end: Pricing-->
                                                <!--begin: Pricing-->
                                                <div class="col-md-6">
                                                    <div class="px-5 text-center">
                                                        <span
                                                            style="font-size: 40px !important"
                                                            class="
                                                            d-block
                                                            font-weight-boldest
                                                            text-dark-75
                                                            py-2
                                                            "
                                                            >
                                                            250
                                                            <sup class="font-size-h3 font-weight-normal pl-1"
                                                                 >$</sup
                                                            >
                                                        </span>
                                                        <h3
                                                            class="d-block font-weight-bold mb-7 text-dark-50"
                                                            >
                                                            Yearly Subscription
                                                        </h3>
                                                        <div class="mb-15 d-flex flex-column">
                                                            <h4>Payment is required for 12 months</h4>
                                                            <h4>Get 12 months access starting form today</h4>
                                                            <h4>Discount 17.67%</h4>
                                                        </div>
                                                        <div class="d-flex justify-content-center">
                                                            <stripe-checkout
                                                                ref="yearlyRecurringCheckoutRef"
                                                                mode="subscription"
                                                                :pk="publishableKey"
                                                                :line-items="yearlyRecurringLineItem"
                                                                :success-url="successURL"
                                                                :cancel-url="cancelURL"
                                                                :customerEmail="email"
                                                                />
                                                            <button
                                                                type="button"
                                                                class="
                                                                btn btn-warning
                                                                text-uppercase
                                                                font-weight-bolder
                                                                px-15
                                                                py-3
                                                                "
                                                                @click="yearlyRecurring()"
                                                                >
                                                                Order Recurring Billing
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <!--end: Pricing-->
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                </b-modal>
            </div>

            <!-- Payment Status popup -->
            <div>
                <b-modal ref="paymentStatusPopup" hide-footer hide-header>
                    <div class="d-block">
                        <div style="margin-top: 20px">
                            <template>
                                <div>
                                    <div class="card card-custom">
                                        <div class="card-header">
                                            <div class="card-title">
                                                <span class="card-icon">
                                                    <i class="flaticon-notepad text-info"></i>
                                                </span>
                                                <h3 class="card-label">Status</h3>
                                            </div>
                                        </div>
                                        <div class="card-body" style="padding: 0 !important">
                                            <div class="row my-10 text-center">
                                                <h4 class="card-body">
                                                    <span class="card-icon">
                                                        <i :class="paymentIconClasses"></i>
                                                    </span>
                                                    {{ paymentStatusText }}
                                                </h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                    <b-button href="/" class="mt-3" variant="outline-danger" block
                              >Close
                    </b-button>
                </b-modal>
            </div>        </td>
            </tr>
        </table>

    </div>
    <!-- end:: Header Topbar -->
</template>

<style scoped>
    .program-select {
        background: #05386b
            url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='4' height='5' viewBox='0 0 4 5'%3e%3cpath fill='white' d='M2 0L0 2h4zm0 5L0 3h4z'/%3e%3c/svg%3e")
            no-repeat right 0.75rem center/8px 10px !important;
    }

    ::v-deep .my-class .dropdown-menu {
        margin: 10px 20px 0 -550px;
        max-height: 600px;
        overflow-y: auto;
    }

</style>

<script>
    import { programCompositionArray } from "@/js/main";
    import KTQuickUser from "@/view/layout/extras/offcanvas/QuickUser.vue";
    import KTDropdownLanguage from "@/view/layout/extras/dropdown/DropdownLanguage.vue";
    import * as fb from "@/firebase";
    import { StripeCheckout } from "@vue-stripe/vue-stripe";
    //import i18nService from "@/core/services/i18n.service.js";
    import loadingIndicator from "@/components/loading-indicator";
    import { Icon } from '@iconify/vue2';
    import commoditySpecsTable from '@/components/commodity-specs-table';
    import monthsTable from '@/components/months-table';
    import memoryMonitor from '@/components/memory-monitor';
    import Dropdown from 'v-dropdown';
    import { VueTreeList, Tree } from 'vue-tree-list';
    import support from '@/components/support';
    import { createInitialState } from '@/js/createInitialState.js';

    const STRIPE_PK_KEY = "";
    const ENV = window.location.protocol + "//" + window.location.host;

    export default {
        components: {
            KTQuickUser,
            StripeCheckout,
            KTDropdownLanguage,
            loadingIndicator,
            Icon,
            commoditySpecsTable,
            monthsTable,
            memoryMonitor,
            'v-dropdown': Dropdown,
            VueTreeList,
            support
        },
        mounted() {
            this.oldProgram = this.program;
            let paymentStatus = this.$route.query.paymentStatus;
            if (paymentStatus != null) {
                if (paymentStatus == "success") {
                    this.$refs["paymentStatusPopup"].show();
                    this.paymentStatusText = "Payment Successful.";
                    this.paymentIconClasses = "flaticon2-check-mark text-success";
                } else if (paymentStatus == "cancel") {
                    this.$refs["paymentStatusPopup"].show();
                    this.paymentStatusText = "Payment Failed.";
                    this.paymentIconClasses = "flaticon2-cross text-danger";
                }
            }
        },
        data() {
            return {
                showDropdown: false,
                oldProgram: null,
                publishableKey: STRIPE_PK_KEY,
                languageFlag: "",
                paymentIconClasses: "",
                loading: false,
                isHidden: false,
                monthlyRecurringLineItem: [
                    {
                        price: "price_1KyN0yHENkNdfsciaF0UtK0X",
                        quantity: 1,
                    },
                ],
                paymentStatusText: "",
                yearlyRecurringLineItem: [
                    {
                        price: "price_1KyN1JHENkNdfsciHFWVSFpd",
                        quantity: 1,
                    },
                ],
                allowPromotionCodes: true,
                billingAddressCollection: "required",
                successURL: window.location.href + "?paymentStatus=success",
                cancelURL: window.location.href + "?paymentStatus=cancel",
                language: "en",
                languages: i18nService.languages,
                languageOptions: [
                    {value: "de", text: "DE"},
                    {value: "en", text: "EN"},
                ],

                treeData: [
                    {
                        name: 'Page Info',
                        id: "page_info",
                        disabled: true,
                        isLeaf: true,
                    },
                    {
                        name: 'Support',
                        id: "support",
                        disabled: true,
                        isLeaf: true,
                    },
                    {
                        name: 'How To Find Trades',
                        id: "find_trades",
                        disabled: true,
                        isLeaf: true,
                    },
                    {
                        name: 'Tours',
                        id: "tours",
                        isLeaf: false,
                        children: [
                            {
                                name: 'Page Tour',
                                id: "page_tour",
                                isLeaf: true,
                            },
                            {
                                name: 'Site Tour',
                                id: "site_tour",
                                isLeaf: true,
                            },
                            {
                                name: 'Feature Tours',
                                id: "feature_tours",
                                isLeaf: false,
                                children: [

                                    {
                                        name: 'Portfolio',
                                        id: "add_to_portfolio",
                                        isLeaf: true,
                                    },
                                    {
                                        name: 'Saving Tabs',
                                        id: "saving_tabs",
                                        isLeaf: true,
                                    },
                                    {
                                        name: 'Ticker Input (text)',
                                        id: "ticker_input_text",
                                        isLeaf: true,
                                    },
                                            /*   {
                                             name: 'Ticker Input (form)',
                                             id: "form",
                                             isLeaf: true,
                                             },
                                             {
                                             name: 'P/L Indicator',
                                             id: "p_l_indicator",
                                             isLeaf: true,
                                             },
                                             {
                                             name: 'Seasonals',
                                             id: "seasonals",
                                             isLeaf: true,
                                             },
                                             */

                                ]
                            }
                        ]
                    },
                ]
            };
        },
        computed: {
            treeDataTree() {
                return new Tree(this.treeData);
            },
            email() {
                return this.$store.state.user.email;
            },
            activeModuleName() {
                let activeModuleName = this.$store.getters["activeModuleName"];
                // console.log("activeModuleName=", activeModuleName);
                return activeModuleName;
            },
            programOptions() {
                let options = programCompositionArray(this.$store.state.user.role);
                // console.log("options=", options);
                if (this.oldProgram === null) {
                    options.unshift({value: null, text: "Select Program"});
                }
                return options;
            },
            program: {
                get() {
                    // console.log("program() starting.");
                    let activeModuleIndex = this.$store.state.activeModuleIndex;
                    // console.log("activeModuleIndex=", activeModuleIndex);
                    let program = null;
                    let moduleArray = this.$store.getters["moduleArray"];
                    // console.log("moduleArray=", moduleArray);
                    if (typeof moduleArray[activeModuleIndex] !== "undefined") {
                        program = moduleArray[activeModuleIndex].program;
                    }
                    // console.log("program=", program);
                    return program;
                },
                set() {},
            },
            showStateEditor() {
                return this.$store.state.showStateEditor;
            },
            showTour() {
                return this.$store.state.user.showTour;
            },
            activeLanguage() {
                let activeLanguage = i18nService.getActiveLanguage();
                console.log("activeLanguage=", activeLanguage);
                return activeLanguage;
            },
            getLanguageFlag() {
                return this.onLanguageChanged();
            },
            showMemoryChart: {
                get() {
                    return this.$store.state.user.showMemoryChart;
                },
                set(showMemoryChart) {
                    this.$store.commit("user/setShowMemoryChart", showMemoryChart);
                }
            },
            user() {
                return this.$store.state.user;
            }
        },
        watch: {
            program: function (program) {
                // console.log("watch showPlaybackControl=", showPlaybackControl);
                this.oldProgram = program;
            },
        },
        methods: {
            onTourClick(params) {
                console.log("onTourClick() starting.");
                console.log("params=", params);
                console.log("params.id=", params.id);

                params.toggle();

                // this.showDropdown = false;
                console.log("this.$refs=", this.$refs);

                let that = this;

                if (params.id == "site_tour") {
                    /* if(check for tabs){
                     
                     }*/

                    this.$parent.$refs.content.$refs.tabsBox.$refs.sidebar.sidebarClosed = true;
                    this.$parent.$refs.content.$refs.tabsBox.$refs.sidebar.updateSelectedSidebarComponentToFirebase(null);
                    this.$refs["help-dropdown"].visible();
                    this.startSiteTour();
                }

                if (params.id == "page_tour") {
                    this.$parent.$refs.content.$refs.tabsBox.$refs.sidebar.sidebarClosed = true;
                    this.$parent.$refs.content.$refs.tabsBox.$refs.sidebar.updateSelectedSidebarComponentToFirebase(null);
                    this.$refs["help-dropdown"].visible();
                    this.startPageTour();
                }

                if (params.id == "page_info") {
                    console.log("this=", this);
                    console.log("this.$parent.$refs.content.$refs.tabsBox.$refs=", this.$parent.$refs.content.$refs.tabsBox.$refs);

                    this.$parent.$refs.content.$refs.tabsBox.$refs.sidebar.sidebarClosed = false;
                    this.$parent.$refs.content.$refs.tabsBox.$refs.sidebar.showSidebarComponentClicked("pageInfo");
                }

                if (params.id == "support") {
                    that.$refs["help-dropdown"].visible();
                    this.$refs['support-modal'].show();
                }

                if (params.id == "saving_tabs") {
                    that.$refs["help-dropdown"].visible();
                    console.log("this.$parent.$refs.content.$refs.tabsBox.$refs.sidebar.$refs=", this.$parent.$refs.content.$refs.tabsBox.$refs.sidebar.$refs);
                    this.$parent.$refs.content.$refs.tabsBox.$refs.sidebar.sidebarClosed = false;
                    this.$parent.$refs.content.$refs.tabsBox.$refs.sidebar.updateSelectedSidebarComponentToFirebase("chartSaving");

                    setTimeout(function () {
                        that.$tours["savingTabsTour"].start();
                    }, 400);
                }

                if (params.id == "ticker_input_text") {
                    that.$refs["help-dropdown"].visible();

                    let initializingState = null;
                    let role = that.user.role;
                    // console.log("role=", role);

                    let initialState = createInitialState("BasicChartsNew", role, initializingState);
                    initialState.selected = ["S2025F"];
                    initialState.sampleContract = ["S2025F", "CL2025F", "S2025H", "S2025K"];
                    initialState.unitMove = [50, 1000, 50, 50],
                    initialState.seasonals = [5, 15];
                    initialState.addVolumeProfile = false;
                    console.log("initialState =", JSON.parse(JSON.stringify(initialState)));
                    that.$store.dispatch('newTabWithInitialState', initialState);

                    // setTimeout(function () {
                    that.$tours["tickerInputTextTour"].start();
                    // }, 400); 
                }

                if (params.id == "add_to_portfolio") {
                    that.$refs["help-dropdown"].visible();     
                    this.$tours["portfolioTour"].start();
                }

            },
            startPageTour() {
                console.log("startPageTour() starting.");
                console.log("this.$parent.$refs.content.$refs.tabsBox.$refs['input-component']=", this.$parent.$refs.content.$refs.tabsBox.$refs['input-component']);
                // console.log("this.$parent.$refs.content.$refs.tabsBox.$refs['input-component'].$refs=", this.$parent.$refs.content.$refs.tabsBox.$refs['input-component'].$refs);

                // bus.$emit('pageTour', this.activeModuleName);
                this.$store.commit(this.activeModuleName + '/setHideInput', false);

                console.log("this.program=", this.program);

                if(this.program === "Portfolio"){
                    this.$tours["portfolioTour"].start();
                }else{
                let that = this;
                setTimeout(function () {
                    that.$parent.$refs.content.$refs.tabsBox.$refs['input-component'].tourClickHandler(that.activeModuleName);
                }, 100);
              }
            },
            startSiteTour() {
                console.log("startSiteTour() starting. this.showTour=", this.showTour);
                this.$tours["siteTour"].start();

                fb.usersCollection
                        .doc(this.email)
                        .update({showTour: false})
                        .then(() => {
                            console.log("showTour updated.");
                        });
            },
            onLanguageChanged() {
                // console.log("this.languages=", this.languages);
                // console.log("i18nService.getActiveLanguage()=", i18nService.getActiveLanguage());

                this.languageFlag = this.languages.find((val) => {
                    return val.lang === i18nService.getActiveLanguage();
                }).flag;
            },
            selectedLanguage(lang) {
                console.log("selectedLanguage() starting. lang=", lang);

                i18nService.setActiveLanguage(lang);

                this.$emit(
                        "language-changed",
                        this.languages.find((val) => {
                            return val.lang === lang;
                        })
                        );

                // window.location.reload();
            },
            hideModal() {
                this.$refs["paymentStatusPopup"].hide();
                this.$router.push(this.$route.path);
            },
            upgradePackage() {
                this.$refs["upgradePopup"].show();
            },
            monthlyRecurring() {
                this.isHidden = true;
                window.location.href =
                        "https://app.charts.alpha4all.it/sessionStripe.php?priceId=price_1KyN0yHENkNdfsciaF0UtK0X&env=" +
                        ENV +
                        "&email=" +
                        this.email;
            },
            yearlyRecurring() {
                this.isHidden = true;
                window.location.href =
                        "https://app.charts.alpha4all.it/sessionStripe.php?priceId=price_1KyN1JHENkNdfsciHFWVSFpd&env=" +
                        ENV +
                        "&email=" +
                        this.email;
                //this.$refs.yearlyRecurringCheckoutRef.redirectToCheckout();
            },
            onLogout() {
                this.$store.dispatch("user/logout");
            },
            toggleStateEditor() {
                this.$store.commit("setShowStateEditor", !this.showStateEditor);
            },
            changeProgram(program) {
                console.log("changeProgram() starting. program=", program);
                this.oldProgram = this.program;

                console.log("this.$parent.$refs.content.$refs.tabsBox=", this.$parent.$refs.content.$refs.tabsBox);

                this.$parent.$refs.content.$refs.tabsBox.changeTab(program);
            }
        },
    };
</script>
