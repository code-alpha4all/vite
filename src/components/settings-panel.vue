<template>

    <div style="display: inline-flex; margin: 0px 0 7px 20px; padding-top: 3px; width: auto; font-size: 1.0rem;
                 text-align: right; color: white;">

        <table border="0" style="" cellpadding="2">
            <tr style="text-align: right; font-weight: normal;">
                <td>
                    symbols:
                </td>
                <td style="text-align: left;">
                    <b-form-select style="border: 1px solid gray; background-color: white; color: black;
                               font-size: 1.1rem; width: auto; margin: 0 0 0 2px;"
                               v-model="symbols"
                               :options="symbolOptions"
                               size="sm"
                               :id="'symbol-select'"
                               ></b-form-select>
                </td>
            </tr>
            <tr style="text-align: right; font-weight: normal;">
                <td>
                    input type:
                </td>
                <td>
                    <ticker-input-type id="input-type-select" v-bind:namespace="namespace" style="margin: 15px 0px 0 0px"></ticker-input-type>
                </td>
            </tr>
            <tr v-if='["admin", "superadmin"].includes($store.state.user.role)' style="text-align: right; font-weight: normal;">
                <td>
                    memory chart:
                </td>
                <td style="text-align: left;">
                    <b-form-select style="border: 1px solid gray; background-color: white; color: black;
                               font-size: 1.1rem; width: auto; margin: 3px 0 0 2px;"
                               v-model="showMemoryChart"
                               :options="showHideOptions"
                               size="sm"
                               ></b-form-select>
                </td>
            </tr>
            <tr v-if='["admin", "superadmin"].includes($store.state.user.role)' style="text-align: right; font-weight: normal;">
                <td>
                    height breakdown:
                </td>
                <td style="text-align: left;">
                    <b-form-select style="border: 1px solid gray; background-color: white; color: black;
                               font-size: 1.1rem; width: auto; margin: 3px 0 0 2px;"
                               v-model="showHeightBreakdown"
                               :options="showHideOptions"
                               size="sm"
                               ></b-form-select>
                </td>
            </tr>
            <tr v-if='["admin", "superadmin"].includes($store.state.user.role)' style="text-align: right; font-weight: normal;">
                <td style="white-space: nowrap;">
                    activeModuleIndex:
                </td>
                <td style="text-align: left;">
                    <b-form-select style="border: 1px solid gray; background-color: white; color: black;
                               font-size: 1rem; width: auto; margin: 3px 0 0 2px;"
                            v-model="activeModuleIndex" :options="activeModuleIndexOptions" size="sm">
                        </b-form-select>
                </td>
            </tr>
        </table>
                                        
    </div>
</template>

<script>

    import * as fb from '@/firebase';
    import tickerInputType from '@/components/ticker-input-type';

    export default {
        components: {tickerInputType},
        props: ['namespace', 'index'],
        data: function () {
            return {
                symbolOptions: [
                    {value: "new", text: "Barchart"},
                    {value: "old", text: "traditional"},
                    {value: "ib", text: "Interactive Brokers"}
                ],
                showHideOptions: [
                    {value: true, text: "show"},
                    {value: false, text: "hide"}
                ]
            };
        },
        computed: {
            email() {
                // console.log("this.$store.state.user.email=", this.$store.state.user.email);
                return this.$store.state.user.email;
            },
            symbols: {
                get() {
                    return this.$store.state.user.symbols;
                },
                set(symbols) {
                    //this.$store.commit("user/setSymbols", symbols);
                    console.log("this.email=", this.email);
                    fb.usersCollection.doc(this.email)
                            .update({"symbols": symbols})
                            .then(() => {
                                console.log('symbols updated.')
                            });

                }
            },
            showMemoryChart: {
                get(){
                    return this.$store.state.user.showMemoryChart;
                },
                set(showMemoryChart){
                    console.log("this.email=", this.email);
                    fb.usersCollection.doc(this.email)
                            .update({"showMemoryChart": showMemoryChart})
                            .then(() => {
                                console.log('showMemoryChart updated.')
                            });
                }
            },
            showHeightBreakdown: {
                get(){
                    return this.$store.state.user.showHeightBreakdown;
                },
                set(showHeightBreakdown){
                    this.$store.commit('user/setShowHeightBreakdown', showHeightBreakdown);
                    localStorage.setItem("showHeightBreakdown", showHeightBreakdown);

                }
            },      
            activeModuleIndex: {
                get() {
                    // console.log("activeModuleIndex() get starting. this.$store.state.activeModuleIndex=", this.$store.state.activeModuleIndex);
                    return this.$store.state.activeModuleIndex;
                },
                set(activeModuleIndex) {
                    console.log("set activeModuleIndex()  starting. activeModuleIndex=", activeModuleIndex);
                    // console.trace();
                    //  console.log("arguments.callee.caller.name=", arguments.callee.caller.name); Can't use in srict mode.
                    this.$store.commit("setActiveModuleIndex", activeModuleIndex);
                    /*  let currentTime = (new Date).getTime();   This block causes ugly problems!!!!!
                     // console.log("currentTime=", currentTime, " this.lastCheckTime=", this.lastCheckTime);
                     let timeIncrement = currentTime - this.lastCheckTime;
                     // console.log("timeIncrement=", timeIncrement);
                     
                     if (timeIncrement > 200) {
                     this.$store.commit('setActiveModuleIndex', activeModuleIndex);
                     }
                     this.lastCheckTime = (new Date).getTime();*/
                },
            }, 
            activeModuleIndexOptions(){
                let moduleInfoArray = this.$store.getters["moduleInfoArray"];

                let options = moduleInfoArray.map((x) => ({value: x.index, text: "tabIndex:" + x.index + ", moduleName: " + x.moduleName + ", tabTitle: "+x.tabTitle }))
                console.log("options=", options);
                return options;
            },
        }
    }
</script>
