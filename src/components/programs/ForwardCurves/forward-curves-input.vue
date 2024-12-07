<template>
    <div style="text-align: left; width: fit-content; background-color: white;">
       
        <v-tour name="forwardCurvesTour" ref="page-tour" :steps="steps" :options="{ debug: true }" :callbacks="tourCallbacks"></v-tour>

        <b-form inline style="width: fit-content; border: 1px solid gray; padding: 2px; white-space: nowrap;
                                 background-color: #e7edf5; margin: 2px 1px 1px -11px; border-radius: 3px;">

            <b-form-select :id="'commodity-select-'+namespace" v-model="commodity" :options="commodityOptions" 
                    style="border:1px solid gray; margin: 2px" ></b-form-select>

            <span style="margin-left: 15px; font-weight: bold"> chart type: 
                <b-form-select :id="'forward-curves-study-select-'+namespace" size="sm" v-model="forwardCurveStudy" :options="studyOptions" style="border:1px solid gray;" ></b-form-select>
            </span>

            <span style="margin-left: 15px; font-weight: bold"> show curves from the past 
                <b-form-select :id="'years-select-'+namespace" size="sm" v-model="y1" :options="yearOptions"  
                               style="border:1px solid gray; " ></b-form-select>
                years</span> 


            <b-button-group style="border: 1px solid gray; padding: 2px; white-space: nowrap; background-color: white;
                                     margin-right: 2px; margin-left: 25px; border-radius: 3px;"> 
                <toggle-single-throw :id="'normalization-'+namespace" v-bind:namespace="namespace" v-bind:property="'normalization'" v-bind:label="'normalization'"
                     style="margin: 0px;"></toggle-single-throw>
            </b-button-group>

            <b-button-group v-if="this.forwardCurveStudy !== 'unaligned'" style="border: 1px solid #555555; padding: 2px; white-space: nowrap;
                                                                                 background-color: white; margin-right: 2px; border-radius: 3px;"> 
                <b-button v-on:click="$root.$emit('change-period', '1')" id="3-MM" size="sm" style="margin-left:0px; background-color: darkgray; color: white;">1 yr</b-button>
                <b-button v-on:click="$root.$emit('change-period', '2')" id="6-MM" size="sm" style="margin-left:2px; background-color: darkgray; color: white;">2 yr</b-button>
                <b-button v-on:click="$root.$emit('change-period', '15')" id="YYYY" size="sm" style="margin-left:2px; background-color: darkgray; color: white;">MAX</b-button>
           </b-button-group>
                        
            <b-button-group style="border: 1px solid #555555; padding: 2px; white-space: nowrap; background-color: white; margin-right: 2px; border-radius: 3px;"> 
                <balloon-toggle v-bind:namespace="namespace" style="margin: 0px"></balloon-toggle>
            </b-button-group>
        </b-form>
        
    </div>
</template>

<script>
    import balloonToggle from '@/components/balloon-toggle';
    import toggleSingleThrow from '@/components/toggle-single-throw';

    export default {
        components: {
            toggleSingleThrow, balloonToggle
        },
        mounted: function () {
           // console.log("forward-curves-input.vue starting.");

             let observer = new ResizeObserver(entries => {
               // console.log("ResizeObserver() starting. this.namespace=", this.namespace, " activeModuleName=", this.$store.getters['activeModuleName']);
                if (this.$store.getters['activeModuleName'] === this.namespace) {
                   // console.log("checking input height.");
                    for (let entry of entries) {
                        // console.log("entry=", entry);
                        // Now do something with the resized element
                       // console.log("entry.contentRect.height=", entry.contentRect.height);
                        this.$store.commit(this.namespace + '/browserSideOnly/setInputDivHeight', entry.contentRect.height);
                    }
                }
            });
            observer.observe(document.querySelector('#' + this.namespace + 'InputDiv'));  
        },
        props: ['namespace'],
        data: function () {
            return {
                contracts: [],
                monthsWithAverageOrCurrent: "",
                series: [],
                data: [],
                dates: [],
                lastDate: "",
                studyOptions: [
                    {value: 'aligned', text: 'aligned (stacked)'},
                    {value: 'averages', text: 'aligned averages'},
                    {value: 'unaligned', text: 'unaligned'}
                ],
                tourCallbacks: {
                    onFinish: this.onTourFinish,
                    onStop: this.onTourFinish,
                    onSkip: this.onTourFinish
                }
            }
        },
        computed: {
            commodity: {
                get() {
                    let commodity = this.$store.getters[this.namespace + '/c'][0];
                    console.log("commodity=", commodity);
                    return  commodity;
                },
                set(commodity) {
                    this.$store.dispatch(this.namespace + '/changeCommodityLeg', {commodity: commodity, index: 0});
                }
            },
            commodityOptions() {
                return this.$store.getters["siteData/commoditiesArray"].map(x => {
                    return {value: x.symbol, text: x.name};
                });
            },
            y1: {
                get() {
                    return this.$store.state[this.namespace].y1;
                },
                set(y1) {
                    this.$store.commit(this.namespace + '/setY1', y1);
                }
            },
            yearOptionsLength(){
                console.log("this.$store.state[this.namespace].yearOptionsLength=", this.$store.state[this.namespace].yearOptionsLength);
                return this.$store.state[this.namespace].yearOptionsLength;
            },
            yearOptions(){
                console.log("this.yearOptionsLength=", this.yearOptionsLength);
                return Array(this.yearOptionsLength).fill(null).map((x, i) => ({value: i + 1, text: i + 1}))
            },
            forwardCurveStudy: {
                get() {
                   // console.log("this.$store.state[this.namespace].forwardCurveStudy=", this.$store.state[this.namespace].forwardCurveStudy);
                    return this.$store.state[this.namespace].forwardCurveStudy;
                },
                set(forwardCurveStudy) {
                    this.$store.commit(this.namespace + '/setForwardCurveStudy', forwardCurveStudy);
                }
            },
            steps(){
                console.log("steps() starting.");
                let that = this;
                return  [
                    {
                        target: '#tour-start', // We're using document.querySelector() under the hood
                        header: {
                            title: 'Forward Curves Tour',
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
                        target: '#forward-curves-study-select-' + this.namespace,
                        content: `<p style="text-align: left">Select the chart type.</p>

                        <div style="background-color: white; color: black; padding: 4px; font-size: 12px">
                        <p style="text-align: left;"><b>aligned (stacked)</b>: all the curves are shifted horizontally so they can be displayed in the same year
                           and more easily compared. </p>

                        <p style="text-align: left;"><b>aligned averages</b>: the 5- and 15-year averages are shown along with the current year's curve. </p>

                        <p style="text-align: left;"><b>unaligned</b>: no shifting of curves. </p>
                        
                        </div>`,
                        params: {
                            placement: 'bottom',
                            enableScrolling: false
                        }
                    },
                    {
                        target: '#years-select-' + this.namespace,
                        content: `<p style="text-align: left">Select the number of past years to include.</p>`,
                        params: {
                            placement: 'bottom',
                            enableScrolling: false
                        }
                    },
                    {
                        target: '#normalization-' + this.namespace,
                        content: `<p style="text-align: left">Click here if you would like to normalize the curves.</p>

                        <p style="text-align: left;">Normalization shifts each curve vertically so that it begins at zero in order to make it
                            easier to compare the shapes of the curves.</p>`,
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
                    this.$tours['forwardCurvesTour'].start();
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
