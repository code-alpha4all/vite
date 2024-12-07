<template>
    <div style="background-color: white;">
        <v-tour name="futuresChartsTour" ref="page-tour" :steps="steps" :options="{ debug: true }" :callbacks="tourCallbacks">
        
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
                            <template v-if="tour.currentStep === 1 && tickerInputType === 'text'">
                                <div slot="actions">
                                    <button @click="tour.previousStep" style="border: 1px solid white; margin: 2px; padding: 3px; font-size: .85rem;">Previous step</button>
                                    <button @click="tour.nextStep" style="border: 1px solid white; margin: 2px;  padding: 3px; font-size: .85rem;">Next step</button>
                                    <button @click="switchToTextTickerTour" style="border: 1px solid white; margin: 2px;  padding: 3px; font-size: .85rem;">
                                        Switch to "Text Ticker" tour</button>
                                </div>
                            </template>

                            <template v-if="tour.currentStep === 8">
                                <div slot="actions">
                                    <button @click="tour.previousStep" style="border: 1px solid white; margin: 2px; padding: 3px; font-size: .85rem;">Previous step</button>
                                    <button @click="tour.nextStep" style="border: 1px solid white; margin: 2px;  padding: 3px; font-size: .85rem;">Next step</button>
                                    <button @click="switchToPortfolioTour" style="border: 1px solid white; margin: 2px;  padding: 3px; font-size: .85rem;">
                                        Switch to "Portfolio" tour</button>
                                </div>
                            </template>

                           <!-- <template v-if="tour.currentStep === 7">
                                <div slot="actions">
                                    <button @click="tour.previousStep" style="border: 1px solid white; margin: 2px; padding: 3px; font-size: .85rem;">Previous step</button>
                                    <button @click="tour.stop" style="border: 1px solid white; margin: 2px;  padding: 3px; font-size: .85rem;">Finish</button>                                    
                                </div>
                            </template> -->
                        </v-step>
                    </transition>
                </template>

        </v-tour>
    </div>
</template>

<script>
    
    import { createInitialState } from '@/js/createInitialState.js';

    export default {
        mounted() {
            // console.log("basic-chart-input.vue mounted() starting. this.namespace=", this.namespace);
        },
        props: ['namespace'],
        data: function () {
            return {
                tourCallbacks: {
                    onFinish: this.onTourFinish,
                    onStop: this.onTourFinish,
                    onSkip: this.onTourFinish
                }
            }
        },
        computed: {
            tickerInputType() {
                return this.$store.state.user.tickerInputType;
            },
            user() {
                return this.$store.state.user;
            },
            steps(){
               // console.log("steps() starting.");
                let that = this;
                return [
                    {
                        target: '#tour-start', // We're using document.querySelector() under the hood
                        header: {
                            title: 'Futures Charts Tour',
                        },
                        content: `<p style="text-align: left">You may use the ←, → and ESC keys to navigate through the tour.</p>`,
                        params: {
                            enableScrolling: false
                        }
                    },
                    {
                        target: '#tour-select-ticker-'+this.namespace,
                        content: `<p style="text-align: left">Select the ticker. ` + (this.tickerInputType === 'text' ? `For more information about the text ticker, click the last button below.</p>` : ``),
                        params: {
                            placement: 'bottom',
                            enableScrolling: false
                        }
                    },
                    {
                        target: '#show-trading-period-'+this.namespace,
                        content: 'Click here if you want to show the trading period.',
                        params: {
                            placement: 'bottom',
                            enableScrolling: false
                        }
                    },
                    {
                        target: '#seasonal-selector-'+this.namespace,
                        content: 'Click here to select seasonals.',
                        params: {
                            placement: 'left',
                            enableScrolling: false
                        }
                    },


                    {
                        target: '#chart-features-'+this.namespace, 
                        content: `<p style="text-align: left">Click to toggle chart features.</p>`,
                        params: {
                            placement: 'right',
                            enableScrolling: false
                        },
                    },
                    {
                        target: '#truncate-'+this.namespace, 
                        content: `<p style="text-align: left">This limits the amount of data for faster results.</p>`,
                        params: {
                            placement: 'bottom',
                            enableScrolling: false
                        },
                    },
                    {
                        target: '#profit-loss-toggle-'+this.namespace, 
                        content: `<p style="text-align: left">add text</p>`,
                        params: {
                            enableScrolling: false
                        },
                    },
                    {
                        target: '#cot-'+this.namespace, 
                        content: `<p style="text-align: left">Click here to add a Commitment of Traders panel.</p>`,
                        params: {
                            enableScrolling: false
                        },
                    },
                    {
                        target: '#add-to-portfolio-button-' + this.namespace,
                        content: `<p style="text-align: left">Push this button if you would like to add this trade to the portfolio. 
                            For more information about the portfolio, click the last button below.</p>`,

                        params: {
                            placement: 'bottom',
                            enableScrolling: false
                        }
                    },
                    {
                        target: '#page-info-list-item',
                        content: `<p style="text-align: left">For more information, click here.</p>`,
                        params: {
                            placement: 'right',
                            enableScrolling: false
                        },
                        before: function () {
                            return new Promise((resolve) => {
                                // Time-consuming UI/async operation here.
                                console.log("that.$parent.$parent.$parent.$refs.tabsBox.$refs.sidebar=", that.$parent.$parent.$parent.$refs.tabsBox.$refs.sidebar);

                                that.$parent.$parent.$parent.$refs.tabsBox.$refs.sidebar.sidebarClosed = true;
                                that.$parent.$parent.$parent.$refs.tabsBox.$refs.sidebar.updateSelectedSidebarComponentToFirebase(null);

                                setTimeout(function () {
                                    resolve('foo');
                                }, 10);
                            });
                        }
                    },
                    {
                        target: '#selected-sidebar-component',
                        content: `<p style="text-align: left">End of tour.</p>`,
                        params: {
                            placement: 'top',
                            enableScrolling: false
                        },
                        before: function () {
                            return new Promise((resolve) => {
                                // Time-consuming UI/async operation here.
                               // console.log("that.$parent.$parent.$parent.$refs.tabsBox.$refs.sidebar=", that.$parent.$parent.$parent.$refs.tabsBox.$refs.sidebar);

                                that.$parent.$parent.$parent.$refs.tabsBox.$refs.sidebar.sidebarClosed = false;
                                that.$parent.$parent.$parent.$refs.tabsBox.$refs.sidebar.updateSelectedSidebarComponentToFirebase("pageInfo");
                                resolve('foo');
                            });
                        }
                    }
                ]
            }
        },

        methods: {
            tourClickHandler(activeModuleName){
                console.log("tourClickHandler() starting. this.namespace=", this.namespace, " activeModuleName=", activeModuleName);
                if(this.namespace === activeModuleName){
                    this.$tours['futuresChartsTour'].start();
                }
            },
            onTourFinish(){
                console.log("onTourFinish() starting. this.namespace=", this.namespace);
                this.$parent.$parent.$parent.$refs.tabsBox.$refs.sidebar.sidebarClosed = true;
                this.$parent.$parent.$parent.$refs.tabsBox.$refs.sidebar.updateSelectedSidebarComponentToFirebase(null);
            },
            switchToTextTickerTour() {
                console.log("Switching to text ticker tour.");
                this.$tours["futuresChartsTour"].stop();

                let initializingState = null;
                let role = this.user.role;
                // console.log("role=", role);

                let initialState = createInitialState("BasicChartsNew", role, initializingState);
                initialState.selected = ["S2025F"];
                initialState.sampleContract = ["S2025F", "CL2025F", "S2025H", "S2025K"];
                initialState.unitMove = [50, 1000, 50, 50],
                initialState.seasonals = [5, 15];
                initialState.addVolumeProfile = false;
                console.log("initialState =", JSON.parse(JSON.stringify(initialState)));
                this.$store.dispatch('newTabWithInitialState', initialState);

                console.log("this.$tours=", this.$tours);
                this.$tours["tickerInputTextTour"].start();
            },
            switchToPortfolioTour(){
                console.log("switchToPortfolioTour() starting.");
                this.$tours["futuresChartsTour"].stop();
                this.$tours["portfolioTour"].start();
            }
        }
    };

</script>
