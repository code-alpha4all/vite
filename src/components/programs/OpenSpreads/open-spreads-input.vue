<template>
    <div style="width: fit-content; background-color: white;">
        
        <v-tour name="openSpreadsTour" ref="page-tour" :steps="steps" :options="{ debug: true }"  :callbacks="tourCallbacks"></v-tour>

          <b-form inline style="width: fit-content; border: 1px solid gray; padding: 2px; white-space: nowrap; background-color: #e7edf5; color: black;
                                 margin: 2px 1px 1px -11px; border-radius: 3px;">
                        <b-form-select v-model="commodity" :options="commodityOptions" :id="'commodity-select-' + namespace"
                             style="border:1px solid gray; margin: 2px" ></b-form-select>
             
            <number-of-contracts-apart :id="'number-of-contracts-apart-' + namespace" v-bind:namespace="namespace" style="margin: 0 30px 0 30px; font-weight: bold;"></number-of-contracts-apart> 

           <b-button-group style="border: 1px solid #555555; padding: 2px; white-space: nowrap; background-color: white;
                         margin-right: 2px; border-radius: 3px;"> 
                <balloon-toggle v-bind:namespace="namespace" style="margin: 0px"></balloon-toggle>
                <three-d-toggle v-bind:namespace="namespace" v-bind:property="'show3D'" style="margin-left: 2px;"></three-d-toggle>
            </b-button-group>

          </b-form>       
                      
    </div>
</template>

<script>

    import numberOfContractsApart from '@/components/number-of-contracts-apart';
    import balloonToggle from '@/components/balloon-toggle';
    import threeDToggle from '@/components/three-d-toggle';

    export default {
        components: {
            numberOfContractsApart, balloonToggle, threeDToggle
        },
        mounted() {
            console.log("open-spreads-input.vue mounted() starting. this.namespace=", this.namespace);
       
             let observer = new ResizeObserver(entries => {
                console.log("ResizeObserver() starting. this.namespace=", this.namespace, " activeModuleName=", this.$store.getters['activeModuleName']);
                if (this.$store.getters['activeModuleName'] === this.namespace) {
                    console.log("checking input height.");
                    for (let entry of entries) {
                        // console.log("entry=", entry);
                        // Now do something with the resized element
                        console.log("entry.contentRect.height=", entry.contentRect.height);
                        this.$store.commit(this.namespace + '/browserSideOnly/setInputDivHeight', entry.contentRect.height);
                    }
                }
            });
            observer.observe(document.querySelector('#' + this.namespace + 'InputDiv')); 
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
            commodityOptions() {
                return this.$store.getters["siteData/commoditiesArray"].map(x => {
                    return {value: x.symbol, text: x.name};
                });
            },
            commodity: {
                get() {
                    let commodity = this.$store.getters[this.namespace + '/c'][0];
                    return  commodity;
                },
                set(commodity) {
                    this.$store.dispatch(this.namespace + '/changeCommodityLeg', {commodity: commodity, index: 0});
                }
            },
            show3D() {
                return this.$store.state[this.namespace].show3D;
            },
            steps(){
                console.log("steps() starting.");
                let that = this;
                return  [
                    {
                        target: '#tour-start', // We're using document.querySelector() under the hood
                        header: {
                            title: 'Open Spreads Tour',
                        },
                        content: `<p style="text-align: left">You may use the ←, → and ESC keys to navigate through the tour.</p>`,
                        params: {
                            enableScrolling: false
                        },
                    },
                    {
                        target: '#commodity-select-' + this.namespace,
                        content: `<p style="text-align: left">Select the commodity.</p>`,
                        params: {
                            placement: 'bottom',
                            enableScrolling: false
                        }
                    },
                    {
                        target: '#number-of-contracts-apart-' + this.namespace,
                        content: `<p style="text-align: left">Select the number of contracts of separation.
                        
                        For example, </p>
                                  <div style="margin: 0 0 0 0px;">
                                     <table class="position-width" border=1 cellpadding=2 style="margin: 0 auto;">
                                        <tr>
                                            <th style="padding: 3px; text-align: left;">ticker</th>
                                            <th style="padding: 3px; text-align: left;">width</th>
                                        </tr>
                                        <tr>
                                            <td style="padding: 2px; text-align: left">C2024H</td>
                                            <td style="padding: 2px; text-align: center">0</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 2px; text-align: left">C2024H - C2024K</td>
                                            <td style="padding: 2px; text-align: center">1</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 2px; text-align: left">C2024H - C2024N</td>
                                            <td style="padding: 2px; text-align: center">2</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 2px; text-align: left">C2024H - C2024U</td>
                                            <td style="padding: 2px; text-align: center">3</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 2px; text-align: left">C2024H - C2024Z</td>
                                            <td style="padding: 2px; text-align: center">4</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 2px; text-align: left">C2024H - C2025H</td>
                                            <td style="padding: 2px; text-align: center">5</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 2px; text-align: left">C2024K + C2024U</td>
                                            <td style="padding: 2px; text-align: center">2</td>
                                        </tr>
                                     </table>
                                  </div>`,
                        params: {
                            placement: 'bottom',
                            enableScrolling: false
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
                        target: '#page-info-list-item',
                        content: `<p style="text-align: left">For more information, click here.</p>`,
                        params: {
                            placement: 'right',
                            enableScrolling: false
                        },
                        before: function () {
                            return new Promise((resolve) => {
                                // Time-consuming UI/async operation here.

                                that.$store.commit(that.namespace + '/setShow3D', false);

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
        watch: {
            show3D: function (show3D) {
                console.log("watch show3D=", show3D);
                this.$tours['openSpreadsTour'].nextStep();
            }
        },
        methods: {
            tourClickHandler(activeModuleName){
                console.log("tourClickHandler() starting. this.namespace=", this.namespace, " activeModuleName=", activeModuleName);
                if(this.namespace === activeModuleName){
                    this.$tours['openSpreadsTour'].start();
                }
            },
            onTourFinish(){
                console.log("onTourFinish() starting. this.namespace=", this.namespace);
                this.$parent.$parent.$parent.$refs.tabsBox.$refs.sidebar.sidebarClosed = true;
                this.$parent.$parent.$parent.$refs.tabsBox.$refs.sidebar.updateSelectedSidebarComponentToFirebase(null);
            }
        }
    };

</script>
