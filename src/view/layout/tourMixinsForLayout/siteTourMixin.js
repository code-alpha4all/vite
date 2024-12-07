import { createInitialState } from '@/js/createInitialState.js';

const siteTourMixin = {
    mounted() {
        console.log("siteTourMixin.js mounted() starting. this.namespace=", this.namespace);
    },
    data: function(){
        let that = this;
        return {
                siteTourSteps: [
                    {
                        target: '#tour-start', // We're using document.querySelector() under the hood
                        header: {
                            title: 'Get Started',
                        },
                        content: `<p style="text-align: left">You may use the ←, → and ESC keys to navigate through the tour.</p>`,
                        params: {
                            enableScrolling: false
                        },
                        before: function () {
                            return new Promise((resolve) => {
                                 // Time-consuming UI/async operation here.

                                let activeModuleIndex = that.$store.state.activeModuleIndex
                                console.log("activeModuleIndex=", activeModuleIndex);

                                if (activeModuleIndex === -1) {
                                    let initializingState = that.user.initializingState;
                                    console.log("initializingState=", initializingState);

                                    let role = that.user.role;
                                    // console.log("role=", role);

                                    let initialState = createInitialState("BasicChartsNew", role, initializingState);
                                    initialState.seasonals = [];
                                    initialState.addVolumeProfile = true;
                                    console.log("initialState =", JSON.parse(JSON.stringify(initialState)));
                                    that.$store.dispatch('newTabWithInitialState', initialState);

                                    // console.log("that.$refs.content.$refs.tabsBox.$refs.sidebar=", that.$refs.content.$refs.tabsBox.$refs.sidebar);
                                    // that.$refs.content.$refs.tabsBox.$refs.sidebar.sidebarClosed = true;
                                    //  that.$refs.content.$refs.tabsBox.$refs.sidebar.updateSelectedSidebarComponentToFirebase(null);
                                    //  that.$refs.content.$refs.tabsBox.$refs.sidebar.selectedSidebarComponent = null;
                                }

                                setTimeout(function () {
                                    resolve('foo');
                                }, 10);

                            });
                        }
                    },
                    {
                        target: '#page-info-list-item',
                        content: `<p style="text-align: left">Click this to see information about the current tab.</p>`,
                        params: {
                            placement: 'right',
                            enableScrolling: false
                        },
                        before: function () {
                            return new Promise((resolve) => {
                                // Time-consuming UI/async operation here.
                                console.log("that.$refs.content.$refs.tabsBox.$refs.sidebar=", that.$refs.content.$refs.tabsBox.$refs.sidebar);

                                that.$refs.content.$refs.tabsBox.$refs.sidebar.sidebarClosed = true;
                                that.$refs.content.$refs.tabsBox.$refs.sidebar.updateSelectedSidebarComponentToFirebase(null);
                                //  that.$refs.content.$refs.tabsBox.$refs.sidebar.selectedSidebarComponent = null;

                                setTimeout(function () {
                                    resolve('foo');
                                }, 10);
                            });
                        }
                    },
                    {
                        target: '#selected-sidebar-component',
                        content: `<p style="text-align: left">The information here will change according to the type of chart displayed in the active tab.</p>`,
                        params: {
                            placement: 'right',
                            enableScrolling: false
                        },
                        before: function () {
                            return new Promise((resolve) => {
                                // Time-consuming UI/async operation here.
                                console.log("that.$refs.content.$refs.tabsBox.$refs.sidebar=", that.$refs.content.$refs.tabsBox.$refs.sidebar);

                                that.$refs.content.$refs.tabsBox.$refs.sidebar.sidebarClosed = false;
                                that.$refs.content.$refs.tabsBox.$refs.sidebar.updateSelectedSidebarComponentToFirebase("pageInfo");
                                resolve('foo');
                            });
                        }
                    },
                    {
                        target: '#chart-saving-list-item',
                        content: `<p style="text-align: left">Click here to save the current tab.</p>`,
                        params: {
                            placement: 'right',
                            enableScrolling: false
                        },
                        before: function () {
                            return new Promise((resolve) => {
                                // Time-consuming UI/async operation here.
                                console.log("that.$refs.content.$refs.tabsBox.$refs.sidebar=", that.$refs.content.$refs.tabsBox.$refs.sidebar);

                                that.$refs.content.$refs.tabsBox.$refs.sidebar.sidebarClosed = true;
                                that.$refs.content.$refs.tabsBox.$refs.sidebar.updateSelectedSidebarComponentToFirebase(null);

                                setTimeout(function () {
                                    resolve('foo');
                                }, 10);
                            });
                        }
                    },
                    {
                        target: '#selected-sidebar-component',
                        content: `<p style="text-align: left">For more information about saving tabs, click the last button below.</p>`,
                        params: {
                            placement: 'right',
                            enableScrolling: false
                        },
                        before: function () {
                            return new Promise((resolve) => {
                                // Time-consuming UI/async operation here.
                                console.log("that.$refs.content.$refs.tabsBox.$refs.sidebar=", that.$refs.content.$refs.tabsBox.$refs.sidebar);

                                that.$refs.content.$refs.tabsBox.$refs.sidebar.sidebarClosed = false;
                                that.$refs.content.$refs.tabsBox.$refs.sidebar.updateSelectedSidebarComponentToFirebase("chartSaving");
                                resolve('foo');
                            });
                        }
                    },
                    {
                        target: '#settings-list-item',
                        content: 'Click here to see settings...',
                        params: {
                            placement: 'right',
                            enableScrolling: false
                        },
                        before: function () {
                            return new Promise((resolve) => {
                                // Time-consuming UI/async operation here.
                                console.log("that.$refs.content.$refs.tabsBox.$refs.sidebar=", that.$refs.content.$refs.tabsBox.$refs.sidebar);

                                that.$refs.content.$refs.tabsBox.$refs.sidebar.sidebarClosed = true;
                                that.$refs.content.$refs.tabsBox.$refs.sidebar.updateSelectedSidebarComponentToFirebase(null);

                                setTimeout(function () {
                                    resolve('foo');
                                }, 10);
                            });
                        }
                    },
                    {
                        target: '#symbol-select',
                        content: `<p style="text-align: left">The table below shows some contracts using the various symbol choices.</p>
                        <table cols=1 style="vertical-align: top; background-color: white; color: black; margin: 0 0 0 20px">
                        <tr>
                            <th style="border: 1px solid black; padding: 2px">Barchart</th>
                            <th style="border: 1px solid black; padding: 2px">Interactive Brokers</th>
                            <th style="border: 1px solid black; padding: 2px">traditional</th>
                        </tr>
                        <tr>
                          <td style="border: 1px solid black; padding: 2px">B6H25</td>
                          <td style="border: 1px solid black; padding: 2px">GBPH25</td>
                          <td style="border: 1px solid black; padding: 2px">BP2025H</td>
                        </tr>
                        <tr>
                          <td style="border: 1px solid black; padding: 2px">ZCH25</td>
                          <td style="border: 1px solid black; padding: 2px">ZCH25</td>
                          <td style="border: 1px solid black; padding: 2px">C2025H</td>
                        </tr>
                        </table>`,
                        params: {
                            placement: 'right',
                            enableScrolling: false
                        },
                        before: function () {
                            return new Promise((resolve) => {
                                // Time-consuming UI/async operation here.
                                console.log("that.$refs.content.$refs.tabsBox.$refs.sidebar=", that.$refs.content.$refs.tabsBox.$refs.sidebar);

                                that.$refs.content.$refs.tabsBox.$refs.sidebar.sidebarClosed = false;
                                that.$refs.content.$refs.tabsBox.$refs.sidebar.updateSelectedSidebarComponentToFirebase("settings");

                                setTimeout(function () {
                                    resolve('foo');
                                }, 10);
                            });
                        }
                    },
                    {
                        target: '#input-type-select',
                        content: `<p style="text-align: left">For more information about the choices for input type...</p>`,
                        params: {
                            placement: 'right',
                            enableScrolling: false
                        }
                    },

                    {
                        target: '#add-tab-button',
                        content: 'Click here to add a tab.',
                        params: {
                            placement: 'top', // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
                            enableScrolling: false
                        },
                        before: function () {
                            return new Promise((resolve) => {
                                // Time-consuming UI/async operation here.
                                console.log("that.$refs.content.$refs.tabsBox.$refs.sidebar=", that.$refs.content.$refs.tabsBox.$refs.sidebar);

                                that.$refs.content.$refs.tabsBox.$refs.sidebar.sidebarClosed = true;
                                that.$refs.content.$refs.tabsBox.$refs.sidebar.updateSelectedSidebarComponentToFirebase(null);

                                setTimeout(function () {
                                    resolve('foo');
                                }, 10);
                            });
                        }
                    },
                    {
                        target: '#program-select',
                        content: 'Click here to <b>change</b> the active tab.',
                        params: {
                            placement: 'right',
                            enableScrolling: false
                        }
                    },
                    {
                        target: '#user-profile',
                        content: 'Click here to manage your subscription.',
                        params: {
                            placement: 'right',
                            enableScrolling: false
                        }
                    },
                ]
        }
    }
};

export default siteTourMixin;