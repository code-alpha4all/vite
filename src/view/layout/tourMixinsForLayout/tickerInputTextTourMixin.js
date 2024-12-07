const tickerInputTextMixin = {
    mounted() {
        console.log("tickerInputTextMixin.js mounted() starting. this.namespace=", this.namespace);
    },
    computed: {
        tickerInputTextSteps() {
            let that = this;
            return  [
                {
                    target: '#tour-start', 
                    header: {
                        title: 'Ticker Input (text)',
                    },
                    content: `<p style="text-align: left">We start by opening a Futures chart.</p>
                        <p style="text-align: left">You may use the ←, → and ESC keys to navigate through the tour.</p>`,
                    params: {
                        enableScrolling: false
                    },
                    before: function () {
                        console.log("First step.");
                        that.didTourStartTab =true;
                        return new Promise((resolve) => {
                            // Time-consuming UI/async operation here.                              
                            setTimeout(function () {
                                console.log("that.activeModuleName=", that.activeModuleName);
                                console.log("that.$refs.content.$refs.tabsBox.$refs.sidebar=", that.$refs.content.$refs.tabsBox.$refs.sidebar);
                                that.$refs.content.$refs.tabsBox.$refs.sidebar.sidebarClosed = false;
                                that.$refs.content.$refs.tabsBox.$refs.sidebar.updateSelectedSidebarComponentToFirebase("settings");
                                resolve('foo');
                            }, 10);
                        });
                    }
                },
                {
                    target: '#ticker-input-type', 
                    header: {
                        title: 'Ticker Input (text)',
                    },
                    content: `<p style="text-align: left">"text" is selected from the input type selector.</p>`,
                    params: {
                        enableScrolling: false,
                        placement: 'bottom',
                    },
                    before: function () {
                        that.$store.commit('user/setTickerInputType', "text");

                        console.log("that.$refs=", that.$refs);
                        let newTicker = "S2025F";
                        that.$store.commit(that.activeModuleName + '/setTickerInput', newTicker);
                        that.$refs.content.$refs.tabsBox.$refs[that.activeModuleName+'-basic-chart-output'][0].$refs['commodity-box-'+that.activeModuleName].$refs['commodities-box-text-'+that.activeModuleName].$refs['futures-auto-complete-'+that.activeModuleName].updateState(newTicker);
                   

                    }
                },
                {
                    target: '#futures-auto-complete-' + this.activeModuleName,
                    content: `<p style="text-align: left">Notice that if we add another contract with a  commodity that has different 
                                units or different unit-moves (tick values) the unit-moves are added automatically. This is done to convert each 
                                leg into its value in USD so they can be added or subtracted.</p>`,
                    params: {
                        placement: 'bottom', // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
                        enableScrolling: false
                    },
                    before: function () {
                        let newTicker = "S2025F-CL2025F";
                        that.$store.commit(that.activeModuleName + '/setTickerInput', newTicker);
                        that.$refs.content.$refs.tabsBox.$refs[that.activeModuleName+'-basic-chart-output'][0].$refs['commodity-box-'+that.activeModuleName].$refs['commodities-box-text-'+that.activeModuleName].$refs['futures-auto-complete-'+that.activeModuleName].updateState(newTicker);
                    }
                },
                {
                    target: '#futures-auto-complete-' + this.activeModuleName,
                    content: `<p style="text-align: left">If you don't want the automatic unit-moves you can counteract them by multiplying each leg by 
                                the reciprocal of its unit-move.</p>
                                <p style="text-align: center">1/50 = 0.02</p>
                                <p style="text-align: center">1/1000 = 0.001</p>`,
                    params: {
                        placement: 'bottom', // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
                        enableScrolling: false
                    },
                    before: function () {
                        let newTicker = "0.02*S2025F-0.001*CL2025F";
                        that.$store.commit(that.activeModuleName + '/setTickerInput', newTicker);
                                                  
                         console.log("that.$refs.content.$refs.tabsBox.$refs["+that.activeModuleName+"-basic-chart-output][0].$refs=",
                         that.$refs.content.$refs.tabsBox.$refs[that.activeModuleName+'-basic-chart-output'][0].$refs['commodity-box-'+that.activeModuleName].$refs['commodities-box-text-'+that.activeModuleName]);

                         console.log("that.$refs.content.$refs.tabsBox.$refs["+that.activeModuleName+"-basic-chart-output][0].$refs=",
                         that.$refs.content.$refs.tabsBox.$refs[that.activeModuleName+'-basic-chart-output'][0].$refs['commodity-box-'+that.activeModuleName].$refs['commodities-box-text-'+that.activeModuleName].$refs['futures-auto-complete-'+that.activeModuleName]);

                         that.$refs.content.$refs.tabsBox.$refs[that.activeModuleName+'-basic-chart-output'][0].$refs['commodity-box-'+that.activeModuleName].$refs['commodities-box-text-'+that.activeModuleName].$refs['futures-auto-complete-'+that.activeModuleName].updateState(newTicker);
                    }
                },
                {
                    target: '#tour-start', 
                    content: `<p style="text-align: left">End of tour.</p>`,
                    params: {
                        placement: 'top',
                        enableScrolling: false
                    }/*,
                    before: function () {
                        return new Promise((resolve) => {
                            // Time-consuming UI/async operation here.
                            setTimeout(function () {
                                console.log("that.$refs.content.$refs.tabsBox.$refs.sidebar=", that.$refs.content.$refs.tabsBox.$refs.sidebar);
                                that.$refs.content.$refs.tabsBox.$refs.sidebar.sidebarClosed = true;
                                that.$refs.content.$refs.tabsBox.$refs.sidebar.updateSelectedSidebarComponentToFirebase(null);
                                resolve('foo');
                            }, 10);
                        });
                    } */
                }
            ];
        },
    },
    methods: {}
};

export default tickerInputTextMixin;