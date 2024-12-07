<template>
    <div class="d-flex flex-column flex-root">

        <topbar></topbar>

        <!--   <b-button variant="success" v-on:click="nextStep" style="margin: 20px 0 0 0">next step</b-button> -->

        <v-tour name="siteTour" :steps="siteTourSteps" :options="{ debug: true, highlight: false }" ref="site-tour" :callbacks="tourCallbacks">
            <template slot-scope="tour">
                <transition name="fade">
                    <v-step
                        v-if="tour.steps[tour.currentStep]"
                        :key="tour.currentStep"
                        :step="tour.steps[tour.currentStep]"
                        :previous-step="tour.previousStep"
                        :next-step="tour.nextStep"
                        :stop="tour.stop"
                        :skip="tour.skip"
                        :is-first="tour.isFirst"
                        :is-last="tour.isLast"
                        :labels="tour.labels"
                        >
                        <template v-if="tour.currentStep === 4">
                            <div slot="actions">
                                <button @click="tour.previousStep" style="border: 1px solid white; margin: 2px; padding: 3px; font-size: .85rem;">Previous step</button>
                                <button @click="tour.nextStep" style="border: 1px solid white; margin: 2px;  padding: 3px; font-size: .85rem;">Next step</button>
                                <button @click="switchToSavingTabsTour" style="border: 1px solid white; margin: 2px;  padding: 3px; font-size: .85rem;">
                                    Switch to "Saving Tabs" tour</button>
                            </div>
                        </template>

                        <!--   <template v-if="tour.currentStep === 10">
                                   <div slot="actions">
                                       <button @click="tour.previousStep" style="border: 1px solid white; margin: 2px; padding: 3px; font-size: .85rem;">Previous step</button>
                                       <button @click="tour.stop" style="border: 1px solid white; margin: 2px;  padding: 3px; font-size: .85rem;">Finish</button>                                    
                                   </div>
                               </template> -->
                    </v-step>
                </transition>
            </template>
        </v-tour>

        <v-tour name="savingTabsTour" :steps="savingTabsSteps" :options="{ debug: true }" ref="saving-tabs-tour" :callbacks="tourCallbacks"></v-tour>

        <v-tour name="tickerInputTextTour" :steps="tickerInputTextSteps" :options="{ debug: true }" ref="ticker-input-text-tour" :callbacks="tourCallbacks"></v-tour>

        <v-tour name="portfolioTour" :steps="portfolioSteps" :options="{ debug: true }" ref="add-to-portfolio-tour" :callbacks="tourCallbacks"></v-tour>

        <transition name="fade-in-up">
            <router-view ref="content"/>
        </transition>

        <div style="text-align: center; background-color: #05386B; color: white;position: fixed;  bottom: 0px; width: 100%;">  
            ScarrCharts &copy; {{year}}
        </div>

    </div>
</template>

<script>

    import topbar from '@/view/layout/header/Topbar';
    //import Loader from "@/view/content/Loader.vue";
    import * as fb from '@/firebase';
    import moment from "moment";

    import tickerInputTextTourMixin from '@/view/layout/tourMixinsForLayout/tickerInputTextTourMixin.js';
    import siteTourMixin from '@/view/layout/tourMixinsForLayout/siteTourMixin.js';
    import savingTabsTourMixin from '@/view/layout/tourMixinsForLayout/savingTabsTourMixin.js';
    import portfolioTourMixin from '@/view/layout/tourMixinsForLayout/portfolioTourMixin.js';

    export default {
        name: "Layout",
        components: {topbar},
        mixins: [tickerInputTextTourMixin, siteTourMixin, savingTabsTourMixin, portfolioTourMixin],
        mounted: function () {
            if (this.showTour) {
                // console.log("starting tour.");
                this.$tours['siteTour'].start();

                fb.usersCollection
                        .doc(this.$store.state.user.email)
                        .update({"showTour": false})
                        .then(() => {
                            console.log('showTour updated.')
                        });
            }            
        },
        data: function () {
            return {
                didTourStartTab: false,
                tourCallbacks: {
                    onFinish: this.onTourFinish,
                    onStop: this.onTourFinish,
                    onSkip: this.onTourFinish
                }
            }
        },
        computed: {
            showTour() {
                return this.$store.state.user.showTour;
            },
            year() {
                return moment().format("YYYY");
            },
            activeModuleName() {
                let activeModuleName = this.$store.getters["activeModuleName"];
                // console.log("activeModuleName=", activeModuleName);
                return activeModuleName;
            },
            user() {
                return this.$store.state.user;
            }
        },
        methods: {
            nextStep() {
                console.log("nextStep() starting.");
                console.log('this.$refs=', this.$refs);
                // console.log('this.$refs["vue-tour"]=', this.$refs["vue-tour"]);
                // console.log('this.$refs["vue-tour"].nextStep=', this.$refs["vue-tour"].nextStep);
                this.$refs["tour"].nextStep();
            },
            switchToSavingTabsTour() {
                console.log('Switching to saving tabs tour.');
                this.$tours["siteTour"].stop();

                this.$refs.content.$refs.tabsBox.$refs.sidebar.sidebarClosed = false;
                this.$refs.content.$refs.tabsBox.$refs.sidebar.updateSelectedSidebarComponentToFirebase("chartSaving");

                this.$tours["savingTabsTour"].start();
            },
            switchToPortfolioTour() {
                console.log('Switching to Portfolio tour.');
                this.$tours["portfolioTour"].stop();

                //this.startPageTour();

                this.$store.commit(this.activeModuleName + '/setHideInput', false);

                let that = this;
                setTimeout(function () {
                    that.$refs.content.$refs.tabsBox.$refs['input-component'].tourClickHandler(that.activeModuleName);
                }, 100);
            },
            onTourFinish() {
                console.log("onTourFinish() starting. this.activeModuleName=", this.activeModuleName, " this.didTourStartTab=", this.didTourStartTab);
                 console.trace();
                this.$refs.content.$refs.tabsBox.$refs.sidebar.sidebarClosed = true;
                this.$refs.content.$refs.tabsBox.$refs.sidebar.updateSelectedSidebarComponentToFirebase(null);

                if (this.didTourStartTab && this.activeModuleName !== null) {
                    this.didTourStartTab = false;

                    console.log("this.$refs.content.$refs.tabsBox", this.$refs.content.$refs.tabsBox);
                    this.$refs.content.$refs.tabsBox.closeTab(this.activeModuleName);
                }
            },
        }
    };
</script>