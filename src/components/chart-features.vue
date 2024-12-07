<template>

    <v-dropdown ref='period-drop' 
                :toggle="true"
                v-bind:namespace="namespace" 
                :id="'chart-features-'+namespace">
        <!-- named slot -->
        <template #caller>
            <!-- dropdown container trigger -->
            <b-button size="sm" style="font-weight: bold; margin: 1px 1px 0 1px; border: 1px solid gray; color: white;
                      background-color: DodgerBlue">
                <table>
                    <tr>
                        <td style="color: white; white-space: nowrap;">chart features</td>
                    </tr>
                </table>
            </b-button>
        </template>

        <b-button-group style="border: 1px solid gray; padding: 1px; background-color: #e7edf5; 
                                color: black; font-weight: bold; border-radius: 3px;"> 
            
            <horizontal-scrollbar-toggle v-bind:namespace="namespace" style="margin: 1px"></horizontal-scrollbar-toggle>

            <toggle-single-throw v-bind:namespace="namespace" v-if="normalizedStockGraphType === 'line'"
                v-bind:property="'showBullets'" v-bind:label="'bullets'" style="margin: 0px;">
            </toggle-single-throw>

          <!--  <balloon-toggle v-bind:namespace="namespace" style="margin: 1px 0 0 0px;"></balloon-toggle> -->

        </b-button-group>  

        <!--   <contract-selector v-bind:namespace="namespace" ref="contract-selector" ></contract-selector> --> 
    </v-dropdown>  

</template>

<script>
    import Dropdown from 'v-dropdown';
    import horizontalScrollbarToggle from '@/components/horizontal-scrollbar-toggle';
    import toggleSingleThrow from '@/components/toggle-single-throw';
  //  import balloonToggle from '@/components/balloon-toggle';

    export default {
        components: {
            'v-dropdown': Dropdown, horizontalScrollbarToggle, toggleSingleThrow
        },
        props: ['namespace'],
        computed: {            
            normalizedStockGraphType() {
                return this.$store.getters[this.namespace + "/normalizedStockGraphType"];
            },
        }
    }
</script>
