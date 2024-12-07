<template>
    <div style="width: fit-content; background-color: white;">
        
        <v-tour name="stockChartTour" ref="page-tour" :steps="steps" :options="{ debug: true }" :callbacks="tourCallbacks"></v-tour>

    </div>
</template>

<script>
   
    export default {
        components: {
           
        },
        mounted() {
            // console.log("stock-chart-input.vue mounted() starting. this.namespace=", this.namespace);
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
            normalizedStockGraphType() {
                return this.$store.getters[this.namespace + "/normalizedStockGraphType"];
            },
            legs(){
                return this.$store.state[this.namespace].legs;
            },
            steps(){
                console.log("steps() starting.");
               // let that = this;
                return  [
                    {
                        target: '#tour-start', // We're using document.querySelector() under the hood
                        header: {
                            title: 'Stock Charts Tour',
                        },
                        content: `<p style="text-align: left">You may use the ←, → and ESC keys to navigate through the tour.</p>`,
                        params: {
                            enableScrolling: false
                        },
                    },
                    {
                        target: '#stock-auto-complete-'+ this.namespace, 
                        content: `<p style="text-align: left">Enter the ticker here.</p>`,
                        params: {
                            enableScrolling: false
                        },
                    },
                    {
                        target: '#stock-legs-'+ this.namespace, 
                        content: `<p style="text-align: left">Select either 1 or 2 legs.</p>`,
                        params: {
                            enableScrolling: false
                        },
                    },
                    {
                        target: '#stock-mult1-'+ this.namespace, 
                        content: `<p style="text-align: left">Select the number of shares.</p>`,
                        params: {
                            enableScrolling: false
                        },
                    },
                    {
                        target: '#chart-features-'+this.namespace, 
                        content: `<p style="text-align: left">add text</p>`,
                        params: {
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
                    
                 /*   {
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
                    } */
                ]

            }
        },
        methods: {
            tourClickHandler(activeModuleName){
                console.log("tourClickHandler() starting. this.namespace=", this.namespace, " activeModuleName=", activeModuleName);
                if(this.namespace === activeModuleName){
                    this.$tours['stockChartTour'].start();
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

<style scoped>
    .px-0 {
        padding: 0;
    }
</style>
