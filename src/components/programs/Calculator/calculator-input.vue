<template>
    <div style="width: fit-content; background-color: white;">

        <div style="background-color: white;">
            <v-tour name="calculatorTour" ref="page-tour" :steps="steps" :options="{ debug: true }" :callbacks="tourCallbacks">

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

                            <template v-if="tour.currentStep === 5">
                                <div slot="actions">
                                    <button @click="tour.previousStep" style="border: 1px solid white; margin: 2px; padding: 3px; font-size: .85rem;">Previous step</button>
                                    <button @click="tour.nextStep" style="border: 1px solid white; margin: 2px;  padding: 3px; font-size: .85rem;">Next step</button>
                                    <button @click="switchToPortfolioTour" style="border: 1px solid white; margin: 2px;  padding: 3px; font-size: .85rem;">
                                        Switch to "Portfolio" tour</button>
                                </div>
                            </template>

                          <!--  <template v-if="tour.currentStep === 7">
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

        <table v-if="namespace !== 'undefined'" style="text-align: left; margin: 2px 3px 1px 0px;"> 
            <tr>
                <td>
                    <table>
                        <tr>                          
                            <td style="vertical-align: bottom; padding: 1px 0 0 0"> 
                        <commodity-box v-bind:namespace="namespace">
                            <template v-slot:contract-aligner>
                                <contract-aligner-selector v-bind:namespace="namespace" v-bind:title="'Aligner'"></contract-aligner-selector>     
                            </template>       
                        </commodity-box>
                </td>
            </tr>
        </table>
        </td>
        <td style="vertical-align: bottom; text-align: right; height: available; background-color: white; padding: 0px 0 2px 0">

            <table style="background-color: white; height: 100%; background-color: white;">
                <tr>
                    <td style="vertical-align: bottom;">
                <trade-specs v-bind:namespace="namespace" style="margin: 0 3px -3px -1px"/>
        </td> 
        <td style="vertical-align: top; background-color: white">
        <b-row align-h="start" align-v="start" class="row no-gutters" style=" background-color: white;">
            <b-col md="auto">  
                <b-button-group style="border: 1px solid gray; padding: 1px; margin: 2px 0 -1px 0px; white-space: nowrap;
                                background-color: #E8E8E8; border-radius: 3px;"> 
                    <add-to-portfolio-button v-bind:namespace="namespace" style="margin: 1px 0 0 0"></add-to-portfolio-button>                            
                    <b-button size="sm" @click="toggleChart"
                              v-bind:style="{ backgroundColor: showCalculatorChart ? 'gray' : 'darkblue' }"
                              style="border: 1px solid darkgray; margin: 1px; color: white;  border-radius: 3px;">coverage chart</b-button>
                </b-button-group>
            </b-col>
        </b-row>
        </td>


        </tr>
        </table>

        </td>
        </tr>
        </table>                   
    </div>
</template>

<script>

    import commodityBox from '@/components/commodity-box';
    import contractAlignerSelector from '@/components/contract-aligner-selector';
    import addToPortfolioButton from '@/components/add-to-portfolio-button';
    import tradeSpecs from '@/components/trade-specs';
    import { createInitialState } from '@/js/createInitialState.js';

    export default {
        components: {
            commodityBox,
            contractAlignerSelector,
            addToPortfolioButton,
            tradeSpecs
        },
        mounted() {
            console.log("calculator-input.vue mounted() starting. this.namespace=", this.namespace);

        },
        destroyed() {
            console.log("calculator-input.vue destroyed() starting.");
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
            user() {
                return this.$store.state.user;
            },
            tickerInputType() {
                return this.$store.state.user.tickerInputType;
            },
            steps() {
                console.log("steps() starting.");
                let that = this;
                return  [
                    {
                        target: '#tour-start', // We're using document.querySelector() under the hood
                        header: {
                            title: 'Calculator Tour',
                        },
                        content: `<p style="text-align: left">You may use the ←, → and ESC keys to navigate through the tour.</p>`,
                        params: {
                            enableScrolling: false
                        },
                    },
                    {
                        target: '#tour-select-ticker-' + this.namespace,
                        content: `<p style="text-align: left">Select the ticker. ` + (this.tickerInputType === 'text' ? `For more information about the text ticker, click the last button below.</p>` : ``),
                        params: {
                            placement: 'bottom',
                            enableScrolling: false
                        }
                    },
                    {
                        target: '#y1-' + this.namespace,
                        content: 'Choose the number of past years to include.',
                        params: {
                            placement: 'bottom',
                            enableScrolling: false
                        }
                    },
                    {
                        target: '#buy-sell-' + this.namespace,
                        content: `<p style="text-align: left">Select the position (buy or sell).</p>`,

                        params: {
                            placement: 'bottom',
                            enableScrolling: false
                        }
                    },
                    {
                        target: '#open-close-selector-' + this.namespace,
                        content: `<p style="text-align: left">Select the open and close dates.</p>`,

                        params: {
                            placement: 'bottom',
                            enableScrolling: false
                        }
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
                                console.log("that.$parent.$parent.$parent.$refs.tabsBox.$refs.sidebar=", that.$parent.$parent.$parent.$refs.tabsBox.$refs.sidebar);

                                that.$parent.$parent.$parent.$refs.tabsBox.$refs.sidebar.sidebarClosed = false;
                                that.$parent.$parent.$parent.$refs.tabsBox.$refs.sidebar.updateSelectedSidebarComponentToFirebase("pageInfo");
                                resolve('foo');
                            });
                        }
                    }
                ]
            },
            showCalculatorChart: {
                get() {
                    return this.$store.state[this.namespace].showCalculatorChart;
                },
                set(showCalculatorChart) {
                    this.$store.commit(this.namespace + '/setShowCalculatorChart', showCalculatorChart);
                }
            }

        },
        methods: {
            tourClickHandler(activeModuleName) {
                console.log("tourClickHandler() starting. this.namespace=", this.namespace, " activeModuleName=", activeModuleName);
                if (this.namespace === activeModuleName) {
                    this.$tours['calculatorTour'].start();
                }
            },
            onTourFinish() {
                console.log("onTourFinish() starting. this.namespace=", this.namespace);
                this.$parent.$parent.$parent.$refs.tabsBox.$refs.sidebar.sidebarClosed = true;
                this.$parent.$parent.$parent.$refs.tabsBox.$refs.sidebar.updateSelectedSidebarComponentToFirebase(null);
            },
            toggleChart() {
                console.log("toggleChart() starting. this.showCalculatorChart=", this.showCalculatorChart);
                this.showCalculatorChart = !this.showCalculatorChart;
            },
            switchToTextTickerTour() {
                console.log("Switching to text ticker tour.");
                this.$tours["calculatorTour"].stop();

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
