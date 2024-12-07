<template>
    <div style="width: fit-content; background-color: white;">

        <v-tour name="tradeMapsTour" ref="page-tour" :steps="steps" :options="{ debug: true }" :callbacks="tourCallbacks">
        
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

        <div>
            <b-sidebar id="sidebar-help" title="Help" shadow right>
                <div style="padding: 1rem;">
                    <h2 class="pb-5" style="font-weight: 600;">Trade Maps</h2>
                    <h3 class="pt-5">Tools:</h3>
                    <h4><b>Parameter to map: </b>This selects which metric of the the calculator statistics to map.</h4>
                    <hr>
                    <h4>Need support? Click
                            <router-link to="/support" id="support">here.</router-link></h4>
                </div>
            </b-sidebar>
        </div>
    
        <table v-if="namespace !== 'undefined'" style="text-align: left; margin: 2px 0 1px 0;"> 
            <tr>
                <td style="vertical-align: bottom;">
                    <table>
                        <tr>
                            
                            <td style="vertical-align: bottom">  
                        <commodity-box v-bind:namespace="namespace"
                                       v-bind:max-legs="4"
                                       v-bind:showMultSelector="true">
                            <template v-slot:contract-aligner>
                                <contract-aligner-nearest-open-selector v-bind:namespace="namespace"
                                    v-bind:title="'Spread Aligner'"></contract-aligner-nearest-open-selector>     
                            </template>
                        </commodity-box>
                </td>

                <td style="vertical-align: bottom;">
            <b-form-group label="" v-slot="{ ariaDescribedby }" style="padding: 4px; margin: 0px 4px 0px 0px; padding: 10px 0 0 5px; font-weight: bold; 
                        border: 1px solid gray; border-radius: 3px; background-color:  #E8E8E8; width: max-content; height: 37px;">
                <b-form-radio-group
                    :id="'buy-sell-'+namespace"
                    v-model="buySell"
                    :options="options"
                    :aria-describedby="ariaDescribedby"
                    name="radio-options"
                    size="sm"></b-form-radio-group>
            </b-form-group>
                </td>

                </tr>
        </table>
        </td>
        <td style="vertical-align: bottom; text-align: right; height: available; padding-left: 3px; background-color: white;">

            <table style="color: black; height: 100%; background-color: white;">
                <tr>
                    <td style="vertical-align: bottom; background-color: white">
                <b-row align-h="start" align-v="end" class="row no-gutters" style=" background-color: white; padding-bottom: 0px">
                    <b-col md="auto"> 
                        <b-button-group style="border: 1px solid gray; white-space: nowrap; background-color: #E8E8E8;
                         font-weight: bold; margin: 0 2px 0 -4px; padding: 3px 3px 2px 6px; border-radius: 3px"> 

                            <span style="margin: 8px 12px 0 0;">map-endpoint: <span style="color: blue">{{mapEndpoint}}</span></span>
                           
                            <span v-if="$store.state.user.role === 'superadmin' && mapEndpoint !== 'servlet'"
                                style="margin: 8px 0px 0 0; font-weight: bold; color: black">
                                firebase storage dir:
                            </span>
                                <b-form-select v-if="$store.state.user.role === 'superadmin' && mapEndpoint !== 'servlet'" 
                                    size="sm" style="border:1px solid gray; width: auto; margin: 0 12px 0 2px"
                                    v-model="firebaseStorageDirectory" :options="firebaseStorageDirectoryOptions"></b-form-select>
                        
                            <parameter-to-map v-bind:namespace="namespace"></parameter-to-map>
                         </b-button-group>
                    </b-col>
                </b-row>
        </td>
                <td style="vertical-align: top; text-align: left; height: available; background-color: white;">
                        <div style="border: 1px solid gray; margin-left: 2px; padding: 2px; border-radius: 3px">
                        <div style="white-space: nowrap"><b>mpe</b> = maximum profitable excursion</div>
                        <div style="white-space: nowrap"><b>mae</b> = maximum adverse excursion</div>
                        <div style="white-space: nowrap"><b>appd</b> = average profit per day</div>
                    </div>
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
    import contractAlignerNearestOpenSelector from '@/components/contract-aligner-nearest-open-selector';
    import parameterToMap from '@/components/parameter-to-map';
    import { createInitialState } from '@/js/createInitialState.js';

    export default {
        components: {
            commodityBox, contractAlignerNearestOpenSelector, parameterToMap
        },
        mounted() {
          //  console.log("trade-maps-input.vue mounted() starting. this.namespace=", this.namespace);
        },
        props: ['namespace'],
        data: function(){
            return {
                firebaseStorageDirectoryOptions: [
                    {value: "maps", text: "maps"},
                    {value: "maps2", text: "maps2"},
                    {value: "maps3", text: "maps3"}
                ],
                options: [
                    {text: 'buy', value: 'buy'},
                    {text: 'sell', value: 'sell'}
                ],
                tourCallbacks: {
                    onFinish: this.onTourFinish,
                    onStop: this.onTourFinish,
                    onSkip: this.onTourFinish
                }
            };
        },
        computed: {
            user() {
                return this.$store.state.user;
            },
            tickerInputType() {
                return this.$store.state.user.tickerInputType;
            },
            mapEndpoint(){
                return this.$store.state.user.mapEndpoint;
            },
            firebaseStorageDirectory: {
                get(){
                    return this.$store.state.siteData.firebaseStorageDirectory;
                },
                set(firebaseStorageDirectory){
                    this.$store.commit('siteData/setFirebaseStorageDirectory', firebaseStorageDirectory);
                }
            },
            buySell: {
                get() {
                    return this.$store.state[this.namespace].buySell;
                },
                set(buySell) {
                    this.$store.commit(this.namespace + '/setBuySell', buySell);
                }
            },
            steps(){
                console.log("steps() starting.");
                let that = this;
                return  [
                    {
                        target: '#tour-start', // We're using document.querySelector() under the hood
                        header: {
                            title: 'Trade Maps Tour',
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
                        target: '#parameter-to-map-' + this.namespace,
                        content: `<p style="text-align: left">Select which statistic you would like to map.</p>`,

                        params: {
                            placement: 'bottom',
                            enableScrolling: false
                        }
                    },
                    {
                        target: '#'+this.namespace + '-plotlyHeatMapDiv',
                        content: `<p style="text-align: left">Select the open and close dates you want to explore by clicking on the map below. The
                            chart and table to the right will update to the new dates.</p>`,
                        params: {
                            placement: 'bottom',
                            enableScrolling: false
                        }
                    },
                    {
                        target: '#trade-statistics-'+this.namespace,
                        content: `<p style="text-align: left">Notice that whenever the cursor is over the map, the some of the 
                                    statistics (specifically, the averages) for that trade are shown on this table and the chart above. </p>`,
                        params: {
                            placement: 'bottom',
                            enableScrolling: false
                        }
                    },
                    {
                        target: '#trade-statistics-column-chart-'+this.namespace,
                        content: `<p style="text-align: left">The chart above makes it easy to see how the equity change, average mpe (most profitable excursion) 
                                    and average mae (most adverse excursion) behave on the map and importantly at points near potential trade candidates.</p>
                                    <p style="text-align: left">The black dotted line shows the maximum avg mpe for the entire map while the red dotted line
                                        shows the minimum avg mae for the entire map. </p>`,
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
                    this.$tours['tradeMapsTour'].start();
                }
            },
            onTourFinish(){
                console.log("onTourFinish() starting. this.namespace=", this.namespace);
                this.$parent.$parent.$parent.$refs.tabsBox.$refs.sidebar.sidebarClosed = true;
                this.$parent.$parent.$parent.$refs.tabsBox.$refs.sidebar.updateSelectedSidebarComponentToFirebase(null);
            },
            switchToTextTickerTour() {
                console.log("Switching to text ticker tour.");
                this.$tours["tradeMapsTour"].stop();

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
