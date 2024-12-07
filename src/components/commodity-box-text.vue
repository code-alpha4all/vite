<template>
    <div>
    <table style="margin: 0.5px 2px 2px 0px">
        <tr>
            <td>
                <futures-auto-complete :id="'tour-select-ticker-'+namespace" :ref="'futures-auto-complete-'+namespace" 
                        style="margin: 0.5px 2px 0px 0px" v-bind:namespace="namespace"></futures-auto-complete>
            </td>
            <td v-if="program === 'StackedCharts' && seasonalSelectionMode === 'standard'" 
                   style="border: 0px solid gray; padding: 1.5px 2px 1.5px 2px; white-space: nowrap;
                   background-color: black; border-radius: 4px;">
                <b-button-group> 
                    <b-form-group label="" v-slot="{ ariaDescribedby }" style="margin: 2px; font-weight: bold; border-radius: 3px;
                     padding: 0px; text-align: left; background-color: white; vertical-align: bottom;">
                        <b-form-radio-group
                            v-model="seasonalSelectionMode"
                            :options="options"
                            :id="'seasonal-selection-mode-'+namespace" 
                            :aria-describedby="ariaDescribedby"
                            size="sm"
                            style="margin: 4px 0 0px 2px;"></b-form-radio-group>
                    </b-form-group>
                    <span style="margin: 5px 0 0 11px; font-size: 1rem; color: white"> years:</span>
                    <y1 style="margin: 0px;" v-bind:namespace="namespace" ></y1>
                </b-button-group>
            </td>
            <td v-if="['SpreadCoverage', 'Calculator', 'LongTermCharts'].includes(program)"
                   style="padding: 2px 0 0px 9px; font-size: 0.97rem; font-weight: bold;"> years:
            </td>
            <td v-if="['SpreadCoverage', 'Calculator', 'LongTermCharts'].includes(program)" style="margin: 0px 0 3px 0">
                <y1 v-bind:namespace="namespace" style="margin: 0px 0 0px 0;"></y1>
                
            </td>
        </tr>
    </table>
</div>
</template>

<script>

    import y1 from '@/components/y1.vue';
    import futuresAutoComplete from '@/components/futures-auto-complete.vue';

    export default {
        components: {
            futuresAutoComplete, y1
        },
        mounted() {
            // console.log("commodity-box.vue mounted() starting.");
            // console.log("this.namespace=", this.namespace);
        },
        props: {
            namespace: {
                type: String,
                default: ""
            }
        },
        data: function () {
            return {
                options: [
                    {text: 'custom', value: 'custom'},
                    {text: 'standard', value: 'standard'}
                ]
            };
        },
        computed: {
            user() {
                return this.$store.state.user;
            },
            program() {
                return this.$store.state[this.namespace].program;
            },
            aligned() {
                return this.$store.state[this.namespace].aligned;
            },
            tickerInputType: {
                get() {
                    return this.user.tickerInputType;
                },
                set() {}
            },
            seasonalSelectionMode: {
                get() {
                    return this.$store.state[this.namespace].seasonalSelectionMode;
                },
                set(seasonalSelectionMode) {
                    console.log("selected seasonalSelectionMode() starting. seasonalSelectionMode=", seasonalSelectionMode + " this.namespace=", this.namespace);
                    this.$store.commit(this.namespace + '/setSeasonalSelectionMode', seasonalSelectionMode);
                }
            }
        }
    }
</script>

