<template>
    <span>
        <b-button v-bind:id="'popover-target-levels:'+namespace" style="color: white" size="sm"
                  v-bind:style="{backgroundColor: showLevels === true ? 'darkgray' : 'black' }">
            levels
        </b-button>
        <b-popover v-bind:target="'popover-target-levels:'+namespace"  triggers="click blur" placement="bottom">
            <table style="padding: 2px; text-align: right;">
                <tr>
                    <td>
                <b-container class="container-fluid" style="font-family: verdana; border:1px solid gray; padding: 2px; background-color: whitesmoke; width: 300px; padding-right: 3px ">
                    <b-form-row align-h="start" style="border:0px solid gray">
                        <b-col style="font-weight: bold; font-size: 1rem;">  
                            <b-form inline style="white-space: nowrap; margin: 0 0 5px 5px">  
                                    show levels:
                            <b-form-select style="border:1px solid gray; width: auto; margin-left: 2px; margin-right: 20px"
                                           v-model="showLevels" :options="options"></b-form-select>

                                    entry type:
                                <b-form-select style="border:1px solid gray; width: auto; margin-left: 2px"
                                           v-model="entryType" :options="entryTypeOptions"></b-form-select>
                                   <span style="font-weight: normal; margin-left: 2px"> order  </span>
                            </b-form>

                            <b-form inline v-for="level in levels" v-bind:key="level.name" style="white-space: nowrap">  
                                <span style=" width: 55px; text-align: right; margin-right: 10px">
                                    {{level.name.replace("horizontal-","").replace("-series", "")}}: 
                                </span> 

                                in:    <span style="margin: 3px 10px 0 2px">
                                    <b-input  style="width: 85px; border:1px solid gray;"
                                              v-model.number="level.from">
                                    </b-input>
                                </span> 

                                out:     <span style="margin: 3px 0px 3px 2px">
                                    <b-input  style="width: 85px; border:1px solid gray;"
                                              v-model.number="level.to">
                                    </b-input>
                                </span> 
                            </b-form>

                        </b-col>
                    </b-form-row>
                </b-container>
                </td>
                </tr>

            </table>                         
        </b-popover>
    </span>
</template>

<script>
    export default {
        props: ['namespace'],
        mounted() {
            // console.log("levels-button.vue mounted() starting. this.namespace=", this.namespace);
        },
        data: function () {
            return {
                options: [
                    {value: true, text: "yes"},
                    {value: false, text: "no"}
                ],
                entryTypeOptions: [
                    {value: "stop", text: "stop"},
                    {value: "limit", text: "limit"}
                ]
            };
        },
        computed: {
            showLevels: {
                get() {
                    return this.$store.state[this.namespace].addHorizontalLine;
                },
                set(showLevels) {
                    this.$store.commit(this.namespace + '/setAddHorizontalLine', showLevels);
                }
            },
            levels: {
                get() {
                    console.log("this.$store.state[this.namespace].chartParameters=", this.$store.state[this.namespace].chartParameters);
                    return this.$store.state[this.namespace].chartParameters.levels;
                },
                set(level) {
                    console.log("levels set(). level=", level);

                }
            },
            entryType: {
                get() {
                   // console.log("this.$store.state[this.namespace].chartParameters=", this.$store.state[this.namespace].chartParameters);
                    return this.$store.state[this.namespace].chartParameters.entryType;
                },
                set(entryType) {
                    console.log("entryType set(). entryType=", entryType);
                    this.$store.commit(this.namespace + '/chartParameters/setEntryType', entryType);
                }
            }
        }
    }
</script>



