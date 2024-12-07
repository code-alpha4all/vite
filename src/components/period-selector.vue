<template>

    <v-dropdown ref='period-drop' 
                :toggle="true"
                v-bind:namespace="namespace" 
                style="">
        <!-- named slot -->
        <template #caller>
            <!-- dropdown container trigger -->
            <b-button size="sm" style="font-weight: bold; margin: 1px 1px 0 1px; border: 1px solid gray; color: white;
                      background-color: rgb(47, 120, 204)">
                <table>
                    <tr>
                        <td style="color: white;">zoom</td>
                    </tr>
                </table>
            </b-button>
        </template>

        <b-button-group style="border: 1px solid gray; padding: 1px; background-color: #e7edf5; color: black; font-weight: bold; border-radius: 3px;"> 
            <b-button v-on:click="$root.$emit('change-period', '3-MM')" size="sm" style="margin-left: 0px; background-color: rgb(47, 120, 204); color: white;">3 mo</b-button>
            <b-button v-on:click="$root.$emit('change-period', '6-MM')" size="sm" style="margin-left: 1px; background-color: rgb(47, 120, 204); color: white;">6 mo</b-button>
            <b-button v-on:click="$root.$emit('change-period', '1-YYYY')" size="sm" style="margin-left: 1px; background-color: rgb(47, 120, 204); color: white;">1 yr</b-button>
            <b-button v-on:click="$root.$emit('change-period', '2-YYYY')" size="sm" style="margin-left: 1px; background-color: rgb(47, 120, 204); color: white;">2 yr</b-button>
            <b-button v-on:click="$root.$emit('change-period', '3-YYYY')" size="sm" style="margin-left: 1px; background-color: rgb(47, 120, 204); color: white;">3 yr</b-button>
            <b-button v-on:click="$root.$emit('change-period', '1-MAX')" size="sm" style="margin-left: 1px; background-color: rgb(47, 120, 204); color: white;">MAX</b-button>
        </b-button-group>  

        <!--   <contract-selector v-bind:namespace="namespace" ref="contract-selector" ></contract-selector> --> 
    </v-dropdown>  

</template>

<script>
    import Dropdown from 'v-dropdown';
    // import contractSelector from '@/components/contract-selector';

    export default {
        components: {
            'v-dropdown': Dropdown//, contractSelector
        },
        props: ['namespace'],
        computed: {
            seasonalOptions: {
                get() {
                    return this.$store.getters[this.namespace + '/seasonalOptions'];
                }
            }
        }
    }
</script>
