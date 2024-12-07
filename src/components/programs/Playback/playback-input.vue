<template>
    <div style="width: fit-content; background-color: white;">
        <div>
            <b-sidebar id="sidebar-help" title="Help" shadow right width="100%" style="background-color: rgba(255, 0, 0, 0.5);">
                <p style="padding: 4px">
                    Metti qui le istruzioni.
                </p>
            </b-sidebar>
        </div>
        <table v-if="namespace !== 'undefined'" border=0 style="text-align: left; margin-bottom: 0px; vertical-align: bottom;"> 
            <tr style="text-align: left; margin-bottom: 0px; vertical-align: bottom;">
                <td style="vertical-align: top; padding: 0px 0px 0px 5px; background-color: white;">

            <b-container fluid style="width: auto; margin-top: 0px; background-color: white; margin-left: -20px;">
                <b-row align-h="start" align-v="start" style="background-color: white; padding: 1px" class="row no-gutters">
                    <b-col md="auto" style="margin-right: 1px; padding: 1px">  
                        <trade-specs v-bind:namespace="namespace"></trade-specs>
                    </b-col>

                    <b-col md="auto" style="margin-right: 1px; padding: 1px">  
                        <commodity-box v-bind:namespace="namespace">
                            <template v-slot:contract-aligner>
                                <contract-aligner-selector v-bind:namespace="namespace" v-bind:title="'Aligner/Selector'"></contract-aligner-selector>     
                            </template>
                        </commodity-box>
                    </b-col>
                    <!--<b-col style="background-color: white; width: 100%;  border: 0px solid gray; margin-top: 1px">  
                       <p style="margin: 0px 5px 5px 5px;font-size: 1.1rem">
                           Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                           Pulvinar etiam non quam lacus suspendisse faucibus interdum posuere lorem...
                      </p>
                    </b-col> -->
                </b-row>
            </b-container>
            </td>
            </tr>
            <tr>
                <td colspan="1">
            <b-container fluid style="width: auto; margin-top: 0px; background-color: white; margin-left: -16px;">
                <b-row align-h="start" align-v="end" style=" background-color: white; padding: 0px" class="row no-gutters">
                    <b-col md="auto" style="margin-right: 1px; padding: 1px">  
                        <b-button-group style="border: 1px solid gray;  background-color: #E8E8E8; margin-right: 2px; padding-top: 0px">
                            <stock-graph-type-toggle v-bind:namespace="namespace" v-bind:click-handler="'am4charts.changeStockGraphType'" style="margin: 1px"></stock-graph-type-toggle>
                            <truncate-selector v-bind:namespace="namespace" style="margin: 1px"></truncate-selector> 
                        </b-button-group>

                        <b-button-group style="border: 1px solid darkgray; padding: 2px; white-space: nowrap; background-color: lightgray; margin-right: 2px"> 
                            <b-button v-on:click="$root.$emit('change-period', '3-MM')" id="3-MM" size="sm" style="margin-left:0px; background-color: darkgray; color: white;">3 mo</b-button>
                            <b-button v-on:click="$root.$emit('change-period', '6-MM')" id="6-MM" size="sm" style="margin-left:2px; background-color: darkgray; color: white;">6 mo</b-button>
                            <b-button v-on:click="$root.$emit('change-period', '1-YYYY')" id="YYYY" size="sm" style="margin-left:2px; background-color: darkgray; color: white;">1 yr</b-button>
                            <b-button v-on:click="$root.$emit('change-period', '1-MAX')" id="MAX" size="sm" style="margin-left: 2px; background-color: darkgray; color: white;">MAX</b-button>
                        </b-button-group>
                        <b-button-group style="margin-left: 1px; margin-right: 2px">
                            <seasonal-selector v-bind:namespace="namespace"></seasonal-selector>
                        </b-button-group>
                        <b-button-group style="border: 1px solid gray; margin: 1px; padding: 1px; white-space: nowrap; background-color: white"> 
                            <balloon-toggle v-bind:namespace="namespace" style="margin: 1px"></balloon-toggle>
                        </b-button-group>
                    </b-col>
                    <b-col style=" padding: 1px">
                        <b-button-group style="border: 1px solid gray; padding: 1px; margin-bottom: 1px; white-space: nowrap; background-color: #E8E8E8"> 
                            <rsi-button v-bind:namespace="namespace" style="margin: 1px;"></rsi-button>                            
                            <cci-button v-bind:namespace="namespace" style="margin: 1px;"></cci-button>     
                            <toggle-single-throw v-bind:namespace="namespace" v-bind:property="'addMACDPanel'" v-bind:label="'MACD'" style="margin: 1px;"></toggle-single-throw>
                            <toggle-single-throw v-bind:namespace="namespace" v-bind:property="'addATRPanel'" v-bind:label="'ATR'" style="margin: 1px;"></toggle-single-throw>
                            <toggle-single-throw v-bind:namespace="namespace" v-bind:property="'addBollinger'" v-bind:label="'BB'" style="margin: 1px;"></toggle-single-throw>
                            <sma-button v-bind:namespace="namespace" style="margin: 1px;"></sma-button>                            
                            <toggle-single-throw  v-bind:namespace="namespace" v-bind:property="'addCOTPanel'" v-bind:label="'COT'" style="margin: 1px;"></toggle-single-throw>
                            <toggle-single-throw  v-bind:namespace="namespace" v-bind:property="'addProfitLoss'" v-bind:label="'P/L'" style="margin: 1px;"></toggle-single-throw>
                            <toggle-single-throw v-bind:namespace="namespace"
                                                 v-if="$store.state[namespace].legs == '1' ||($store.state[namespace].dataSource == 'barchart' && $store.state[namespace].instrument === 'future')" v-bind:property="'addVolumePanel'" v-bind:label="'Vol.'" style="margin: 1px;"></toggle-single-throw>
                            <volume-profile-button v-bind:namespace="namespace" style="margin: 1px"  v-if="$store.state[namespace].legs == '1' ||($store.state[namespace].dataSource == 'barchart' && $store.state[namespace].instrument === 'future')"></volume-profile-button>
                            <toggle-single-throw v-bind:namespace="namespace" v-if="$store.state[namespace].stockGraphType === 'line'"
                                                 v-bind:property="'showBullets'" v-bind:label="'bullets'" style="margin: 1px;"></toggle-single-throw>
                            <toggle-single-throw v-bind:namespace="namespace" v-bind:property="'showTradingPeriod'" v-bind:label="'Trading Period'" style="margin: 1px"></toggle-single-throw>

                            <toggle-single-throw v-bind:namespace="namespace" v-bind:property="'showPlaybackControl'" v-bind:label="'playback'" style="margin: 1px"></toggle-single-throw>
                            <b-button v-b-toggle.sidebar-help variant="warning" size="sm" style="border: 0px solid darkgray; margin: 2px;">Help</b-button>
                        </b-button-group>
                    </b-col>
                </b-row>
            </b-container>
            </td>
            </tr>
        </table>                   
    </div>
</template>

<script>
    import commodityBox from '@/components/commodity-box';
    import contractAlignerSelector from '@/components/contract-aligner-selector';
    import seasonalSelector from '@/components/seasonal-selector';
    import rsiButton from '@/components/rsi-button';
    import cciButton from '@/components/cci-button';
    import smaButton from '@/components/sma-button';
    import toggleSingleThrow from '@/components/toggle-single-throw';
    import balloonToggle from '@/components/balloon-toggle';
    import stockGraphTypeToggle from '@/components/stock-graph-type-toggle';
    import volumeProfileButton from '@/components/volume-profile-button';
    import truncateSelector from '@/components/truncate';
    import tradeSpecs from '@/components/trade-specs';

    export default {
        components: {
            commodityBox,
            contractAlignerSelector,
            seasonalSelector,
            rsiButton,
            cciButton,
            smaButton,
            toggleSingleThrow,
            balloonToggle,
            stockGraphTypeToggle,
            volumeProfileButton,
            truncateSelector,
            tradeSpecs
        },
        created() {

        },
        mounted() {
            console.log("basic-chart-input.vue mounted() starting. this.namespace=", this.namespace);
        
            let observer = new ResizeObserver(entries => {
                console.log("ResizeObserver() starting. this.namespace=", this.namespace, " activeModuleName=", this.$store.getters['activeModuleName']);
                if (this.$store.getters['activeModuleName'] === this.namespace) {
                    console.log("checking input height.");
                    for (let entry of entries) {
                        // console.log("entry=", entry);
                        // Now do something with the resized element
                        console.log("entry.contentRect.height=", entry.contentRect.height);
                        this.$store.commit(this.namespace + '/browserSideOnly/setInputDivHeight', entry.contentRect.height);
                    }
                }
            });
            observer.observe(document.querySelector('#' + this.namespace + 'InputDiv')); 
        },
        props: ['namespace']
    };

</script>
