<template>
    <div id="my-app" style="background-color: white;">

        <v-tour name="stackedChartsTour" ref="page-tour" :steps="steps" :options="{ debug: true }" :callbacks="tourCallbacks">
        
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

                        </v-step>
                    </transition>
                </template> 
            
            </v-tour>

        <table v-if="namespace !== 'undefined'" border=0 style="text-align: left; margin: 0px 0 0px 0px; vertical-align: bottom;"> 
            <tr style="text-align: left; margin-bottom: 0px; vertical-align: bottom;">
                <td style="vertical-align: bottom; padding: 0px 0px 0px 0px; background-color: white; width: auto">

            <commodity-box v-bind:namespace="namespace">
                <template v-slot:contract-aligner>

                    <div v-if="seasonalSelectionMode === 'standard'" style="text-align: center; color: white; 
                            background-color: black; font-weight: normal; padding: 0px 1px 1px 1px; width: auto; border-radius: 3px;">
                        <table>
                            <tr>
                                <td v-if="$store.state[namespace].legs > 1" style="padding: 1px; text-align: center;">                                                         
                                    <b> Aligner</b>
                            <contract-aligner v-bind:namespace="namespace" ></contract-aligner>     
                            </td>
                            <td style="vertical-align: top; padding: 2px 0 0 0">
                                <div v-if="$store.state[namespace].program !== 'Calculator'" style="font-weight: bold;">
                                    Selector
                                </div>
                            <contract-selector v-bind:namespace="namespace" ref="contract-selector" ></contract-selector>  
                            </td>
                            </tr>
                        </table>
                    </div>
                </template>
            </commodity-box>
            </td>
            <td>
            <b-container fluid style="width: auto; margin-top: 0px; background-color: white;">
                <b-row align-h="start" align-v="end" style="background-color: white; padding: 2px 0 0px 1px" class="row no-gutters">

                    <b-col md="auto" style="margin: 0 0px -1.5px -9px; padding: 0px;">  
                        <trade-specs v-bind:namespace="namespace" style=" margin: -1px 2px -1px -3px"></trade-specs> 
                    </b-col>
                    <b-col>
                        <b-button-group style="border: 1px solid gray; background-color: #e7edf5; margin: 4px 2px -.5px 0px; border-radius: 3px;
                                        padding: 0px; padding: 1px">

                            <balloon-toggle v-bind:namespace="namespace" style="margin: 1px"></balloon-toggle>
                            <three-d-toggle v-bind:namespace="namespace" v-bind:property="'show3D'" style="margin: 1px;"></three-d-toggle>

                            <truncate-selector v-bind:namespace="namespace" style="margin: 1px 0 0 10px"></truncate-selector> 

                            <normalization v-bind:namespace="namespace" :ref="'normalization-dropdown-button-'+namespace" style="margin: 1px"></normalization>

                            </b-button-group>
                    </b-col>
                </b-row>
            </b-container>
            </td>
            </tr>
        </table> 

    </div>
</template>

<script>
    import commodityBox from '@/components/commodity-box';
    import contractAligner from '@/components/contract-aligner';
    import contractSelector from '@/components/contract-selector';
    import truncateSelector from '@/components/truncate';
    import balloonToggle from '@/components/balloon-toggle';
    import threeDToggle from '@/components/three-d-toggle';
    import normalization from '@/components/normalization';
    import tradeSpecs from '@/components/trade-specs';
    import { createInitialState } from '@/js/createInitialState.js';

    export default {
        components: {
            commodityBox, contractAligner, contractSelector, truncateSelector, balloonToggle, threeDToggle, normalization, tradeSpecs
        },
        mounted() {
            // console.log("long-term-chart-input.vue mounted() starting. this.namespace=", this.namespace);

            let observer = new ResizeObserver(entries => {
               // console.log("ResizeObserver() starting. this.namespace=", this.namespace, " activeModuleName=", this.$store.getters['activeModuleName']);
                if (this.$store.getters['activeModuleName'] === this.namespace) {
                   // console.log("checking input height.");
                    for (let entry of entries) {
                       // console.log("entry=", entry);
                        // Now do something with the resized element
                       // console.log("inputDivHeight=", entry.contentRect.height);
                        this.$store.commit(this.namespace + '/browserSideOnly/setInputDivHeight', entry.contentRect.height);
                    }
                }
            });
            let element = document.querySelector('#' + this.namespace + 'InputDiv');
            // console.log("element=", element);
            observer.observe(element);
        },
        props: ['namespace'],
        data: function () {
            return{
                tourCallbacks: {
                    onFinish: this.onTourFinish,
                    onStop: this.onTourFinish,
                    onSkip: this.onTourFinish
                },
                initialSeasonalSelectionMode: null
            }
        },
        computed: {
            user() {
                return this.$store.state.user;
            },
            tickerInputType() {
                return this.$store.state.user.tickerInputType;
            },
            showTradingPeriod() {
                return this.$store.state[this.namespace].showTradingPeriod;
            },
            seasonalSelectionMode() {
                return this.$store.state[this.namespace].seasonalSelectionMode;
            },
            legs() {
                return this.$store.state[this.namespace].legs;
            },
            steps(){
               // console.log("steps() starting.");
                let that = this;
            return [
                    {
                        target: '#tour-start', // We're using document.querySelector() under the hood
                        header: {
                            title: 'Stacked Charts Tour',
                        },
                        content: `<p style="text-align: left">You may use the ←, → and ESC keys to navigate through the tour.</p>`,
                        params: {
                            enableScrolling: false
                        },
                        before: function () {
                            that.initialSeasonalSelectionMode = that.seasonalSelectionMode;
                        }
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
                        target: '#seasonal-selection-mode-'+this.namespace,
                        content: `<p style="text-align: left">Choose how you wish to select the contracts to add to the chart. 
                                When "standard" is selected, you can choose the number of years to include.</p>`,
                        params: {
                            placement: 'right',
                            enableScrolling: false
                        },
                        before: function () {
                            return new Promise((resolve) => {
                                that.$store.commit(that.namespace + '/setSeasonalSelectionMode', "standard");

                            setTimeout(function () {
                                    resolve('foo');
                                }, 10);
                            });
                        }
                    },
                    {
                        target: '#seasonal-selection-mode-'+this.namespace,
                        content: `<p style="text-align: left">When "custom" is selected, you can choose the individual contracts (or spreads) to include.</p>`,
                        params: {
                            placement: 'right',
                            enableScrolling: false
                        },
                        before: function () {
                            return new Promise((resolve) => {

                                that.$store.commit(that.namespace + '/setSeasonalSelectionMode', "custom");

                            setTimeout(function () {
                                    resolve('foo');
                                }, 10);
                            });
                        }
                    },
                    {
                        target: '#show-trading-period-'+this.namespace,
                        content: 'Click here if you want to show the trading period.',
                        params: {
                            placement: 'bottom',
                            enableScrolling: false
                        },
                        before: function () {
                            return new Promise((resolve) => {
                                that.$store.commit(that.namespace + '/setSeasonalSelectionMode', that.initialSeasonalSelectionMode);

                                setTimeout(function () {
                                    resolve('foo');
                                }, 10);
                            });
                        }
                    },
                    {
                        target: '#three-d-toggle-' + this.namespace,
                        content: `<p style="text-align: left">Click here to see a 3-dimensional chart.</p>`,
                        params: {
                            placement: 'bottom',
                            enableScrolling: false
                        }
                    }, 
                    {
                        target: '#'+this.namespace+'-plotlyRibbonChart',
                        content: `<p style="text-align: left">3-D chart</p>`,
                        params: {
                            placement: 'bottom',
                            enableScrolling: false
                        },
                        before: function () {
                            return new Promise((resolve) => {
                                // Time-consuming UI/async operation here.
                               // console.log("that.$parent.$parent.$parent.$refs.tabsBox.$refs.sidebar=", that.$parent.$parent.$parent.$refs.tabsBox.$refs.sidebar);

                               that.$store.commit(that.namespace + '/setShow3D', true);

                                setTimeout(function () {
                                    resolve('foo');
                                }, 10);
                            });
                        }
                    }, 
                    {
                        target: '#truncate-'+this.namespace, 
                        content: `<p style="text-align: left">Sometimes, shortening the length of the series can make the chart easier to read.</p>`,
                        params: {
                            placement: 'bottom',
                            enableScrolling: false
                        },
                        before: function () {
                            return new Promise((resolve) => {
                                that.$store.commit(that.namespace + '/setShow3D', false);

                                setTimeout(function () {
                                    resolve('foo');
                                }, 10);
                            });
                        }
                    },
                    {
                        target: '#normalization-' + this.namespace,
                        content: `<p style="text-align: left">Click here if you would like to normalize the curves.</p>

                        <p style="text-align: left;">Normalization shifts each curve vertically so that it begins at zero in order to make it
                            easier to compare them.</p>`,
                        params: {
                            placement: 'right',
                            enableScrolling: false
                        }
                    },
                 /*   {
                        target: '#normalization-popup-'+this.namespace,
                        content: `<p style="text-align: left;">text</p>`,
                        params: {
                            placement: 'right',
                            enableScrolling: false
                        },
                        before: function () {
                            return new Promise((resolve) => {
                                //that.$store.commit(that.namespace + '/setShow3D', false);
                                console.log("that.$refs=", that.$refs);
                                console.log("that.$refs['normalization-dropdown-button-'+that.namespace]=", that.$refs['normalization-dropdown-button-'+that.namespace]);
                                that.$refs['normalization-dropdown-button-'+that.namespace].show=true;

                                setTimeout(function () {
                                    resolve('foo');
                                }, 10);
                            });
                        }
                    }, */
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

            }
        },
        methods: {
            tourClickHandler(activeModuleName){
                console.log("tourClickHandler() starting. this.namespace=", this.namespace, " activeModuleName=", activeModuleName);
                if(this.namespace === activeModuleName){
                    this.$tours['stackedChartsTour'].start();
                }
            },
            nextStep() {
                console.log("nextStep() starting.");
                console.log('this.$refs=', this.$refs);
                // console.log('this.$refs["vue-tour"]=', this.$refs["vue-tour"]);
                // console.log('this.$refs["vue-tour"].nextStep=', this.$refs["vue-tour"].nextStep);
                this.$tours['stackedChartsTour'].nextStep();
            },
            onTourFinish(){
                console.log("onTourFinish() starting. this.namespace=", this.namespace);
                this.$parent.$parent.$parent.$refs.tabsBox.$refs.sidebar.sidebarClosed = true;
                this.$parent.$parent.$parent.$refs.tabsBox.$refs.sidebar.updateSelectedSidebarComponentToFirebase(null);
            },
            switchToTextTickerTour() {
                console.log("Switching to text ticker tour.");
                this.$tours["stackedChartsTour"].stop();

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
            }  
        }
    };

</script>
