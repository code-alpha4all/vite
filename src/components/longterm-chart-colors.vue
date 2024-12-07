<template>
                    <table :id="'longterm-chart-colors-'+namespace" style="margin: 0px; font-weight: bold; whitespace: nowrap;">
                        <tr>
                            <td>
                                colors: 
                            </td>
                            <td>
                                <b-form-select size="sm" style="border: 1px solid gray; background-color: white; margin: 0 0 0 2px; width: auto" 
                                v-model="longtermChartColors">
                            <option v-bind:value="'standard'">standard</option>
                            <option v-bind:value="'yearly'">yearly</option>
                        </b-form-select>
                            </td>
                        </tr>
                        
                    </table>
</template>

<script>


export default {
        props: ['namespace'],
        data: function () {
            return {
                isOpen: false
            };
        },
        computed: {
            stockGraphType() {
                return this.$store.state[this.namespace].stockGraphType;
            },
            longtermChartColors: {
                get() {
                   // console.log("longtermChartColors: get() starting.");
                    let temp = this.$store.state[this.namespace].longtermChartColors;
                   // console.log("temp =", temp);
                    return temp;
                },
                set(longtermChartColors) {
                   // console.log("longtermChartColors: set() starting. longtermChartColors=", longtermChartColors);
                    this.$store.commit([this.namespace] + '/setLongtermChartColors', longtermChartColors);
                }
            }
        }
    }
</script>
