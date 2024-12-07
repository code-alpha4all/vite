<template>
    <div style=" width: auto; margin: 5px 0 0 0;">
        <v-navigation-drawer permanent
            v-model="drawer"
            :mini-variant.sync="sidebarClosed"      
            :width="selectedSidebarComponent === 'chartSharing' ? 400 : 314" height="92vh"
            mini-variant-width=37
            ref="navDrawer"
            style="background-color: #c7d5e7; border-bottom: 1px solid gray;  background-color: steelblue;"
            >      
            <div style=" width: auto; text-align: left; border-bottom: 1px solid gray;">

                <v-list-item @click.stop="toggleSidebar" class="px-2" style="background-color: steelblue; height: 5px; margin: 0 0 0 -5px">       

                    <v-btn icon>         
                        <v-icon>mdi-chevron-left</v-icon>
                    </v-btn>

                    <span v-if="sidebarClosed === false" style="font-weight: bold; font-size: 1.5rem; text-align: center; color: white; margin: 0 0 0 4px">
                        <span>{{selectedSidebarTitle}}</span>
                    </span>

                </v-list-item>

                <div id="selected-sidebar-component">
                    <component :is="selectedComponent" v-if="selectedSidebarComponent !== null" 
                        v-bind:namespace="activeModuleName" :ref="selectedComponentRef"></component>
                </div>
                
                <div class="px-2" style="" v-bind:style="{ borderBottom: sidebarClosed === true  ? '0px solid gray' : '1px solid gray',
                     backgroundColor: sidebarClosed === true  ? '#c7d5e7' : '#EBEBEB'}">
                </div>

                <v-list-item v-if="selectedSidebarComponent !== 'pageInfo'" 
                    id="page-info-list-item" class="px-2" style="background-color: #c7d5e7; border-bottom: 1px solid gray;">
                    <table>
                        <tr>
                            <td style="vertical-align: top;">
                                <v-icon v-b-tooltip.noninteractive.hover.topleft="'Program Info'" style="color: #404040; margin: 3px 0 0px 0px;" @click="showSidebarComponentClicked('pageInfo')">
                                    mdi-information-outline
                                </v-icon>
                            </td>
                            <td>
                                <div v-if="!sidebarClosed" style="margin: 5px 0 0 5px;">
                                    <span @click="showSidebarComponentClicked('pageInfo')"
                                     style="cursor: pointer; font-weight: bold; font-size: 1.3rem; color: #404040;">Program Description</span>
                                </div>
                            </td>
                        </tr>
                    </table>
                </v-list-item>

                <v-list-item v-if="selectedSidebarComponent !== 'chartSaving'" 
                    id="chart-saving-list-item" class="px-2" style="background-color: #c7d5e7; border-bottom: 1px solid gray;">
                    <table>
                        <tr>
                            <td style="vertical-align: top;">
                                <v-icon v-b-tooltip.noninteractive.hover.topleft="'Saved Tabs'" style="color: #404040; margin: 3px 0 0px 0px;" @click="showSidebarComponentClicked('chartSaving')">
                                    mdi-content-save-outline
                                </v-icon>
                            </td>
                            <td>
                                <div v-if="!sidebarClosed" style="margin: 5px 0 0 5px;">
                                     <span @click="showSidebarComponentClicked('chartSaving')" 
                                    style="cursor: pointer; font-weight: bold; font-size: 1.3rem; color: #404040;">Saved Tabs</span>
                                </div>
                            </td>
                        </tr>
                    </table>
                </v-list-item>

                <v-list-item v-if="selectedSidebarComponent !== 'chartSharing' && $store.state.user.role === 'superadmin'" 
                    id="chart-sharing-list-item" class="px-2" style="background-color: #c7d5e7; border-bottom: 1px solid gray;">
                    <table>
                        <tr>
                            <td style="vertical-align: top;">
                                <v-icon v-b-tooltip.noninteractive.hover.topleft="'Chart Sharing'" style="color: #404040; margin: 3px 0 0px 0px;" @click="showSidebarComponentClicked('chartSharing')">
                                    mdi-share-circle
                                </v-icon>
                            </td>
                            <td>
                                <div v-if="!sidebarClosed" style="margin: 5px 0 0 5px;">
                                     <span @click="showSidebarComponentClicked('chartSharing')" 
                                    style="cursor: pointer; font-weight: bold; font-size: 1.3rem; color: #404040; margin: 0px 0 0 -1px">Chart Sharing</span>
                                </div>
                            </td>
                        </tr>
                    </table>
                </v-list-item>

                <v-list-item v-if="selectedSidebarComponent !== 'endpoint' && $store.state.user.role === 'superadmin'" 
                   id="endpoint-list-item" class="px-2" style="background-color: #c7d5e7; border-bottom: 1px solid gray;">
                    <table>
                        <tr>
                            <td style="vertical-align: top;">
                                <v-icon v-b-tooltip.noninteractive.hover.topleft="'Endpoint'" style="color: #404040; margin: 3px 0 0px 0px;" @click="showSidebarComponentClicked('endpoint')">
                                    mdi-access-point
                                </v-icon>
                            </td>
                            <td>
                                <div v-if="!sidebarClosed" style="margin: 5px 0 0 5px;">
                                     <span @click="showSidebarComponentClicked('endpoint')" 
                                    style="cursor: pointer; font-weight: bold; font-size: 1.3rem; color: #404040; margin: 0px 0 0 -1px">Endpoint</span>
                                </div>
                            </td>
                        </tr>
                    </table>
                </v-list-item>

                <v-list-item v-if="selectedSidebarComponent !== 'settings'" 
                    id="settings-list-item" class="px-2" style="background-color: #c7d5e7; border-bottom: 1px solid gray;">
                    <table>
                        <tr>
                            <td style="vertical-align: top;">
                                <v-icon v-b-tooltip.noninteractive.hover.topleft="'Settings'" style="color: #404040; margin: 3px 0 0px 0px;" @click="showSidebarComponentClicked('settings')">
                                    mdi-cog-outline
                                </v-icon>
                            </td>
                            <td>
                                <div v-if="!sidebarClosed" style="margin: 5px 0 0 5px;">
                                     <span @click="showSidebarComponentClicked('settings')" 
                                    style="cursor: pointer; font-weight: bold; font-size: 1.3rem; color: #404040; margin: 0px 0 0 -1px">Settings</span>
                                </div>                               
                            </td>
                        </tr>
                    </table>
                </v-list-item>

            </div>

            <!--<v-list dense style="background-color: #c7d5e7;">
                     <v-list-item
                       v-for="item in items"
                       :key="item.title"
                       link
                     >
                       <v-list-item-icon>
                         <v-icon>{{ item.icon }}</v-icon>
                       </v-list-item-icon>
             
                       <v-list-item-content>
                         <v-list-item-title>{{ item.title }}</v-list-item-title>
                       </v-list-item-content>
                     </v-list-item>
                   </v-list> -->
        </v-navigation-drawer>


        <!-- <saved-charts-search v-bind:namespace="namespace" 
                                       v-bind:index="'0'"></saved-charts-search> -->
    </div>
</template>

<style scoped>
    .toggle {
        cursor: pointer;
    }
</style>

<script>

    import * as fb from '@/firebase';
    // import savedChartsSearch from "@/components/saved-charts-search.vue";
    import StateEditor from '@/components/state-editor';
    import endpointSelector from '@/components/endpoint-selector';
    import settingsPanel from '@/components/settings-panel';
    import savedCharts from '@/components/saved-charts.vue';
    import programDescriptions from '@/components/program-descriptions.vue';

    export default {
        components: {
            StateEditor, endpointSelector, settingsPanel, savedCharts, programDescriptions
        },
        mounted() {
            // console.log("mounted() starting. this.namespace=", this.namespace);
            this.userEmail = this.$store.state.user.email;
            // this.updateSelectedSidebarComponentToFirebase();

            // console.log("this.selectedSidebarComponent=", this.selectedSidebarComponent);
            if (this.selectedSidebarComponent !== null) {
                this.sidebarClosed = false;
            }
        },
        props: {
            namespace: {
                type: String
            },
            defaultAddTreeNodeTitle: {
                type: String,
                default: 'Add Folder'
            }
        },
        data: function () {
            return{
                users: [],
                userEmail: "",
                drawer: true,
                sidebarClosed: true,
                sidebarOptions: [
                    {value: "pageInfo", text: "Program Description", currentComponent: programDescriptions},
                    {value: "chartSaving", text: "Saved Tabs", currentComponent: savedCharts, ref: "saved-charts"},
                    {value: "chartSharing", text: "Chart Sharing", currentComponent: StateEditor},
                    {value: "endpoint", text: "Endpoint", currentComponent: endpointSelector},
                    {value: "settings", text: "Settings", currentComponent: settingsPanel}
                ]
            }
        },

        firestore: {
            users: fb.usersCollection,
        },
        computed: {
            selectedComponent(){
                let that = this;
                console.log("that.selectedSidebarComponent=", that.selectedSidebarComponent);               

                let selectedComponent = this.sidebarOptions.find(x => x.value === that.selectedSidebarComponent).currentComponent;
               // console.log("selectedComponent=", selectedComponent);               
                return selectedComponent;
            },
            selectedComponentRef(){
                let option = this.sidebarOptions.find(x => x.value === this.selectedSidebarComponent);
                // console.log("option=", option);
                return typeof option !== 'undefined' ? option.ref : "";
            },
            selectedSidebarTitle() {
                // console.log("selectedSidebarTitle() starting. this.selectedSidebarComponent=", this.selectedSidebarComponent);
                let option = this.sidebarOptions.find(x => x.value === this.selectedSidebarComponent);
                // console.log("option=", option);
                return typeof option !== 'undefined' ? option.text : "";
            },
            usersOptions() {
                return this.users.map(x => x.email);
            },
            email() {
                // console.log("this.$store.state.user.email=", this.$store.state.user.email);
                return this.$store.state.user.role === 'superadmin' ? this.userEmail : this.$store.state.user.email;
            },
            selectedSidebarComponent: {
                get() {
                    return this.$store.state.user.selectedSidebarComponent;
                },
                set(selectedSidebarComponent) {
                    console.log("selectedSidebarComponent set() has no code. selectedSidebarComponent=", selectedSidebarComponent);
                    console.trace();
                }
            },
            program() {
                // console.log("program=", this.$store.state[this.namespace].program);
                return typeof this.$store.state[this.namespace] === 'undefined' || 
                    typeof this.$store.state[this.namespace].program === 'undefined' ? "Tabs" : this.$store.state[this.namespace].program;
            },
            activeModuleName() {
                let activeModuleName = this.$store.getters['activeModuleName'];
                // console.log("activeModuleName=", activeModuleName);
                return activeModuleName;
            }
        },
        watch: {
            selectedSidebarComponent: function (selectedSidebarComponent) {
                console.log("watch selectedSidebarComponent=", selectedSidebarComponent);
                if (selectedSidebarComponent !== null) {
                    this.sidebarClosed = false;
                } else {
                    this.sidebarClosed = true;
                }
            }
        },
        methods: {
            toggleSidebar() {
                console.log("toggleSidebar() starting.");
                if (this.sidebarClosed === false) {
                    this.updateSelectedSidebarComponentToFirebase(null);
                    this.sidebarClosed = true;
                } else {
                    this.sidebarClosed = false;
                }
                //console.log('this.$parent.$parent.$parent.$refs=', this.$parent.$parent.$parent.$refs);
                this.$parent.$parent.$parent.$refs["site-tour"].nextStep();
            },
            showSidebarComponentClicked(component) {
                console.log("showSidebarComponentClicked() starting. component=", component);
                let newSelectedSidebarComponent;
                if (this.selectedSidebarComponent === component) {
                    newSelectedSidebarComponent = null;
                    this.sidebarClosed = true;
                } else {
                    newSelectedSidebarComponent = component;
                  //  this.sidebarClosed = false;
                }
                this.updateSelectedSidebarComponentToFirebase(newSelectedSidebarComponent);
               // console.log('this.$parent.$parent.$parent.$refs=', this.$parent.$parent.$parent.$refs);
               this.$parent.$parent.$parent.$refs["site-tour"].nextStep();
               this.$parent.$parent.$parent.$refs["saving-tabs-tour"].nextStep();

              // console.log('this.$parent.$parent.$parent.$refs.content.$refs.tabsBox=', this.$parent.$parent.$parent.$refs.content.$refs.tabsBox);
               console.log('this.$parent.$parent.$parent.$refs.content.$refs.tabsBox.$refs["input-component"].$refs=', this.$parent.$parent.$parent.$refs.content.$refs.tabsBox.$refs["input-component"].$refs);
              if(typeof this.$parent.$parent.$parent.$refs.content.$refs.tabsBox.$refs["input-component"] !== 'undefined'){ 
                 this.$parent.$parent.$parent.$refs.content.$refs.tabsBox.$refs["input-component"].$refs["page-tour"].nextStep();
              }
            },
            updateSelectedSidebarComponentToFirebase(component) {
                console.log("updateSelectedSidebarComponentToFirebase() starting. component=", component);
                fb.usersCollection
                        .doc(this.email)
                        .update({"selectedSidebarComponent": component})
                        .then(() => {
                            console.log('selectedSidebarComponent updated.');
                        }).catch((error) => {
                    // The document probably doesn't exist.
                    console.error("Error updating document: ", error);
                });
            }

        }
    }
</script>
