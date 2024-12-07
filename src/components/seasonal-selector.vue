<template>

    <v-dropdown ref='seasonal-drop' 
                :toggle="true"
                style="">
        <!-- named slot -->
        <template #caller>
            <!-- dropdown container trigger -->
            <b-button size="sm" class="am5stock am5stock-control am5stock-control-button"
            :id="'seasonal-selector-'+namespace"
                style="background-color: #5D3FD3; height: 30.5px; border: 1px solid gray; padding: 0 3px 0 3px; margin: 1px 0 0 0; border-radius: 5px;">
                <table>
                    <tr>
                        <td style="color: white;font-weight: bold; padding: 0 0 .5px 0">seasonals</td>
                    </tr>
                </table>
            </b-button>
        </template>

<div style="background-color: #e7edf5; margin: 0 0 -21px 0;">
        <b-button-group style="border: 1px solid gray; padding: 1px; background-color: #e7edf5; color: black; 
                                    font-weight: bold; border-radius: 3px;"> 
            <b-button-group  v-for="n in seasonalOptions" :key="n.value">
                <seasonal-toggle v-bind:year="n.value" v-bind:namespace="namespace" style="margin: 1px 1px 1px 1px"></seasonal-toggle>
            </b-button-group>
        </b-button-group>

        <div style="font-weight: bold; margin: 4px;">
        <b-form-group label="seasonal types" v-slot="{ ariaDescribedby }">
            <b-form-checkbox-group
                id="checkbox-group-2"
                v-model="seasonalTypes"
                :aria-describedby="ariaDescribedby"
                name="flavour-2"
                >
                <b-form-checkbox v-b-tooltip.hover.topleft="'These are calculated by taking an average of the previous N years for each date.'" value="unadjusted">unadjusted</b-form-checkbox>
                <b-form-checkbox v-b-tooltip.hover.topleft="'These are calculated by adusting the volatility of the unadjusted seasonal to match the volatility of the price data and then shifting the result vertically for the best fit with the overlapping price data using the Least Squares Method.'" value="adjusted">adjusted</b-form-checkbox>
            </b-form-checkbox-group>
        </b-form-group>
        </div>
    </div>

    </v-dropdown>  

</template>

<style scoped>
    .tooltip{
        z-index: 99999;
    }
</style>

<script>
    import seasonalToggle from '@/components/seasonal-toggle.vue';
    import Dropdown from 'v-dropdown';

    export default {
        components: {
            'v-dropdown': Dropdown, seasonalToggle
        },
        props: ['namespace'],
        computed: {
            seasonalOptions: {
                get() {
                    return this.$store.getters[this.namespace + '/seasonalOptions'];
                }
            },
            seasonalTypes: {
                get() {
                    return this.$store.state[this.namespace].seasonalTypes;
                },
                set(seasonalTypes) {
                    console.log("seasonalTypes=", seasonalTypes);
                    this.$store.commit(this.namespace + '/setSeasonalTypes', seasonalTypes);
                }
            }
        }
    }
</script>
