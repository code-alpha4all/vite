import { createInitialState } from '@/js/createInitialState.js';

const savingTabsTourMixin = {
    mounted() {
        console.log("tickerInputTextMixin.js mounted() starting. this.namespace=", this.namespace);
    },
    data: function(){
        let that = this;
        return {
            savingTabsSteps: [
                {
                    target: '#tour-start', // We're using document.querySelector() under the hood
                    header: {
                        title: 'Saving Tabs',
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
                    target: '#__BVID__112',
                    content: `<p style="text-align: left">Enter a name for the tab.</p>`,
                    params: {
                        enableScrolling: false,
                        placement: 'right',
                    },
                    before: function () {
                        return new Promise((resolve) => {
                            // Time-consuming UI/async operation here.
                            console.log("that.$refs.content.$refs.tabsBox.$refs.sidebar.$refs=", that.$refs.content.$refs.tabsBox.$refs.sidebar.$refs);
                            console.log("that.$refs.content.$refs.tabsBox.$refs.sidebar.$refs['saved-charts']=", that.$refs.content.$refs.tabsBox.$refs.sidebar.$refs['saved-charts']);

                            // that.$refs.content.$refs.tabsBox.$refs.sidebar.sidebarClosed = false;
                            //  that.$refs.content.$refs.tabsBox.$refs.sidebar.updateSelectedSidebarComponentToFirebase("chartSaving");

                            that.$refs.content.$refs.tabsBox.$refs.sidebar.$refs['saved-charts'].$refs.saveName.focus();
                            that.$refs.content.$refs.tabsBox.$refs.sidebar.$refs['saved-charts'].saveName = "test";
                            resolve('foo');
                        });
                    }
                },
                {
                    target: '#saving-tabs-button',
                    content: `<p style="text-align: left">Click here to save the chart.</p>`,
                    params: {
                        enableScrolling: false,
                        placement: 'right',
                    },
                    before: function () {
                        return new Promise((resolve) => {
                            // Time-consuming UI/async operation here.
                            console.log("that.$refs.content.$refs.tabsBox.$refs.sidebar.$refs['saved-charts']=", that.$refs.content.$refs.tabsBox.$refs.sidebar.$refs['saved-charts']);

                            that.$refs.content.$refs.tabsBox.$refs.sidebar.$refs['saved-charts'].$refs.saveButton.focus();
                            resolve('foo');
                        });
                    }
                },
                {
                    target: '#saving-tabs-list',
                    content: `<p style="text-align: left">You should see your saved tab in the list to the left.</p>
                  <p style="text-align: left">If you put the cursor over it you will see the following icons.</p>
                  <table style="background-color: white; color: black; text-align: left; vertical-align: top">
                    <tr>
                      <td><i class="far fa-edit" style="color: black; margin: 1px 2px 1px 2px"></i></td>
                      <td>Click to edit the name of the saved tab.</td>
                    </tr>
                    <tr>
                      <td style="vertical-align: top"><i class="fa fa-refresh" style="color: black; margin: 1px 2px 1px 2px"></i></td>
                      <td>Click to update the saved version to the state of the current tab.</td>
                    </tr>
                    <tr>
                      <td><i class="far fa-trash-alt" style="color: black; margin: 1px 2px 1px 2px"></i></td>
                      <td>Click to delete the saved tab.</td>
                    </tr>
                  </table>`,
                    params: {
                        enableScrolling: false,
                        placement: 'right',
                    },
                    before: (type) => {
                        // 'type' can be 'start', 'nextStep', or 'previousStep'
                        console.log("type=", type);
                        return new Promise((resolve) => {

                            if(type === 'next' && that.$refs.content.$refs.tabsBox.$refs.sidebar.$refs['saved-charts'].saveName !== ""){
                                console.log("that.$refs.content.$refs.tabsBox.$refs.sidebar.$refs['saved-charts']=", that.$refs.content.$refs.tabsBox.$refs.sidebar.$refs['saved-charts']);
                                that.$refs.content.$refs.tabsBox.$refs.sidebar.$refs['saved-charts'].onSaveChart();
                            }
                            resolve('foo');
                        });
                    }
                },
                {
                    target: '#saving-add-folder',
                    content: `<p style="text-align: left">Click this button to add a folder.</p>
                  <p style="text-align: left">If you put the cursor over it you will see the edit and delete icons and also
                    a folder icon, <i class="far fa-folder" style="color: white; margin: 2px 2px -3px 2px"></i>, 
                    to add a new folder inside the folder.</p>`,
                    params: {
                        enableScrolling: false,
                        placement: 'top',
                    }
                },
                {
                    target: '#saving-tabs-list',
                    content: `<p style="text-align: left">Folders and saved tabs can be moved by clicking and dragging them to other folders.</p>
                  </p>`,
                    params: {
                        enableScrolling: false,
                        placement: 'right',
                    }
                },
            ],
        }
    }
};

export default savingTabsTourMixin;