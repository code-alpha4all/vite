<template>
    <table :id="'parameter-to-map-'+namespace" style="color: black">
        <tr>
            <td>
        <div style="padding: 2px 1px 0 0">
            statistic to map:
        </div>
        </td>
        <td>
        <b-form-select size="sm" style="border:1px solid gray; width: auto; color: red; margin-left: 0px"
                       v-model="parameterToMap" :options="parameterOptions"></b-form-select>
            </td>
            </tr>

    </table>
</template>

<script>
    export default {
        props: ['namespace'],
        computed: {
            parameterToMap: {
                get() {
                    return this.$store.state[this.namespace].chartParameters.parameterToMap;
                },
                set(parameterToMap) {
                    console.log("set() parameterToMap=", parameterToMap);
                    this.$store.commit(this.namespace + '/chartParameters/setParameterToMap', parameterToMap);
                }
            },
            parameterOptions() {
                return this.$store.state.siteData.parameterOptions;
            }
        }
    }
</script>
