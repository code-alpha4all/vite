<template>
    <div style="width: fit-content; background-color: white;">
      
        <v-tour name="historyTour" ref="page-tour" :steps="steps" :options="{ debug: true }" :callbacks="tourCallbacks">
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

        <table v-if="namespace !== 'undefined'" border=0 style="text-align: left; margin: 2px 0 -2px 3px; vertical-align: bottom;"> 
            <tr style="text-align: left;vertical-align: bottom;">
                               <td>
                         <commodity-box v-bind:namespace="namespace">
                                    <template v-slot:contract-aligner>
                                        <contract-aligner-selector v-bind:namespace="namespace" v-bind:title="'Aligner'"></contract-aligner-selector>     
                                    </template>              
                                </commodity-box>
                  </td>
                  <td style="vertical-align: bottom; padding: 0px 0px 0px 5px; background-color: white; width: auto">
                    <trade-specs v-bind:namespace="namespace" style=" margin: 0px 2px -2px -6px"></trade-specs>   
                </td>
                  <td>
                        <b-button-group style="border: 1px solid gray; padding: 1px; white-space: nowrap; 
                                               background-color: #e7edf5; border-radius: 3px"> 

                            <span style="padding: 7px 0 0 17px; font-weight: bold">charts per row:&nbsp;</span>    
                            <b-form-select v-model="chartsPerRow"  :id="'charts-per-row-'+namespace" :options="chartsPerRowOptions" size="sm" 
                                style="border: 1px solid gray; margin: 1px 2px 0 0px"></b-form-select>
                                </b-button-group>
                    
            </td>
            </tr>
        </table>                 
    </div>
</template>

<script>

    import commodityBox from '@/components/commodity-box';
    import contractAlignerSelector from '@/components/contract-aligner-selector';
    import tradeSpecs from '@/components/trade-specs';
    import { createInitialState } from '@/js/createInitialState.js';

    export default {
        components: {
            commodityBox,
            contractAlignerSelector,
            tradeSpecs
        },
        mounted() {
          //  console.log("history-input.vue mounted() starting. this.namespace=", this.namespace);

            let observer = new ResizeObserver(entries => {
               // console.log("ResizeObserver() starting. this.namespace=", this.namespace, " activeModuleName=", this.$store.getters['activeModuleName']);
                if (this.$store.getters['activeModuleName'] === this.namespace) {
                   // console.log("checking input height.");
                    for (let entry of entries) {
                        // console.log("entry=", entry);
                        // Now do something with the resized element
                       // console.log("entry.contentRect.height=", entry.contentRect.height);
                       this.$store.commit(this.namespace + '/browserSideOnly/setInputDivHeight', entry.contentRect.height);
                       this.$store.commit(this.namespace + '/browserSideOnly/setInputDivWidth', entry.contentRect.width);
                    }
                }
            });
            let element = document.querySelector('#' + this.namespace + 'InputDiv');
           // console.log("element=", element);
            observer.observe(element);
        },
        props: ['namespace'],
        data() {
            return {
                chartsPerRowOptions: Array(4).fill().map((x, i) => ({value: (i + 1), text: (i + 1)})),
                tourCallbacks: {
                    onFinish: this.onTourFinish,
                    onStop: this.onTourFinish,
                    onSkip: this.onTourFinish
                }
            }
        },
        computed: {
            chartsPerRow: {
                get() {
                    console.log("chartsPerRow get:");
                    // console.log("this.$store.state[this.namespace]=", this.$store.state[this.namespace]);
                    return this.$store.state[this.namespace].chartParameters.chartsPerRow;
                },
                set(chartsPerRow) {
                    this.$store.commit(this.namespace + "/chartParameters/setChartsPerRow", parseInt(chartsPerRow));
                    this.$store.commit(this.namespace + "/chartParameters/setPage", 1);
                    // updateChart();
                }
            },
            user() {
                return this.$store.state.user;
            },
            tickerInputType() {
                return this.$store.state.user.tickerInputType;
            },
            steps(){
                console.log("steps() starting.");
                let that = this;
                return  [
                    {
                        target: '#tour-start', // We're using document.querySelector() under the hood
                        header: {
                            title: 'History Charts Tour',
                        },
                        content: `<p style="text-align: left">You may use the ←, → and ESC keys to navigate through the tour.</p>`,
                        params: {
                            enableScrolling: false
                        },
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
                        target: '#charts-per-row-' + this.namespace,
                        content: `<p style="text-align: left">Select the number of charts per row.</p>`,

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

            }
        },
        methods: {
            tourClickHandler(activeModuleName){
                console.log("tourClickHandler() starting. this.namespace=", this.namespace, " activeModuleName=", activeModuleName);
                if(this.namespace === activeModuleName){
                    this.$tours['historyTour'].start();
                }
            },
            onTourFinish(){
                console.log("onTourFinish() starting. this.namespace=", this.namespace);
                this.$parent.$parent.$parent.$refs.tabsBox.$refs.sidebar.sidebarClosed = true;
                this.$parent.$parent.$parent.$refs.tabsBox.$refs.sidebar.updateSelectedSidebarComponentToFirebase(null);
            },
            switchToTextTickerTour() {
                console.log("Switching to text ticker tour.");
                this.$tours["historyTour"].stop();

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
