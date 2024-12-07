<template>
    <div style="width: fit-content; background-color: white;">
        <div>
            <b-sidebar id="sidebar-help" title="Help" shadow right style="background-color: rgba(255, 0, 0, 0.5);">
                <div style="padding: 1rem;">
                    <h2 class="pb-5" style="font-weight: 600;">Futures Chart</h2>
                    <h3 class="pb-3">Indicators:<br>
                        <span style="font-size: 12px;">(the following indicators are available) </span>
                    </h3>
                    <h4><b>ATR: </b>Average True Range</h4>
                    <h4><b>BB: </b>Bollinger Bands</h4>
                    <h4><b>COT: </b>Commitment of Traders</h4>
                    <h4><b>MACD: </b>Moving Average Convergence / Divergence</h4>
                    <h4><b>CCI: </b>Commodity Channel Index</h4>
                    <h4><b>RSI: </b>Relative Strength Index</h4>
                    <h4><b>SMA: </b>Simple Moving Average</h4>
                    <h4><b>VOL: </b>Volume and Open Interest</h4>
                    <h4><b>VP: </b>Volume Profile</h4><h4>Seasonals are made using the "average percentage method".</h4>
                    <h3 class="pt-5">Tools:</h3>
                    <h4><b>Show/Hide Label: </b>show or hide information labels on the chart.</h4>
                    <h4><b>P/L (Profit &amp; Loss calculator): </b>to measure the price difference in USD between two points selected with the mouse.</h4>
                    <h4><b>Download and Annotations: </b>accessible via the icon with a symbol at the top left of the graph</h4>
                    <hr>
                    <h4>Need support? Click
                            <router-link to="/support" id="support">here.</router-link></h4>
                </div>
            </b-sidebar>
        </div>        

        <table v-if="namespace !== 'undefined'" id="table" border=0 style="text-align: left; margin-bottom: 0px; vertical-align: bottom; background-color: white"> 
            <tr style="text-align: left; margin-bottom: 0px; vertical-align: bottom;">
                <td style="vertical-align: bottom; padding: 0px 0px 0px 5px; background-color: white; width: 100%">

            <b-container fluid style="width: auto; margin-top: 0px; background-color: white; margin-left: -20px;">
                <b-row align-h="start" align-v="end" style="background-color: white; padding: 1px" class="row no-gutters">
                   

                    <b-col md="auto" style="margin: 0 2px 0 2px; padding: 1px">  
                        <commodity-box v-bind:namespace="namespace">
                            <template v-slot:contract-aligner>
                                <contract-aligner-selector v-bind:namespace="namespace" v-bind:title="'Aligner/Selector'"></contract-aligner-selector>     
                            </template>
                        </commodity-box>
                    </b-col>
               
                <b-col md="auto" style="margin: 0 -7px 0 10px; padding: 1px">  
                        <trade-specs v-bind:namespace="namespace"></trade-specs>
                    </b-col>

                <b-col style="margin-right: 1px">  
                    <b-button-group style="border: 1px solid gray;  background-color: #E8E8E8; margin: 2px 1px 1px 1px; border-radius: 3px;">
                        <stock-graph-type-toggle v-bind:namespace="namespace" v-bind:click-handler="'am4charts.changeStockGraphType'" style="margin-right: 3px"></stock-graph-type-toggle>
                        <truncate-selector v-bind:namespace="namespace" style="margin: 0px"></truncate-selector> 
                    </b-button-group>

                    <b-button-group style="border: 1px solid gray; padding: 1px; white-space: nowrap; background-color: lightgray; 
                                    margin: 2px 1px 1px 1px; border-radius: 3px;"> 
                            <b-button v-on:click="$root.$emit('change-period', '3-MM')" id="3-MM" size="sm" style="margin-left: 0px; background-color: darkgray; color: white;">3 mo</b-button>
                            <b-button v-on:click="$root.$emit('change-period', '6-MM')" id="6-MM" size="sm" style="margin-left: 1px; background-color: darkgray; color: white;">6 mo</b-button>
                            <b-button v-on:click="$root.$emit('change-period', '1-YYYY')" id="YYYY" size="sm" style="margin-left: 1px; background-color: darkgray; color: white;">1 yr</b-button>
                            <b-button v-on:click="$root.$emit('change-period', '1-MAX')" id="MAX" size="sm" style="margin-left: 1px; background-color: darkgray; color: white;">MAX</b-button>
                        </b-button-group> 
                     <b-button-group style="margin: 2px 1px 1px 1px; border-radius: 3px;">
                            <seasonal-selector v-bind:namespace="namespace"></seasonal-selector>
                     </b-button-group>
    
                    <b-button-group style="border: 1px solid gray; padding: 1px; margin: 2px 1px 1px 1px; white-space: nowrap; 
                                background-color: #E8E8E8; border-radius: 3px;"> 
                        <rsi-button v-bind:namespace="namespace" style="margin: 0px;"></rsi-button>                            
                        <cci-button v-bind:namespace="namespace" style="margin: 0px;"></cci-button>     
                        <toggle-single-throw v-bind:namespace="namespace" v-bind:property="'addMACDPanel'" v-bind:label="'MACD'" style="margin: 0px;"></toggle-single-throw>
                        <toggle-single-throw v-bind:namespace="namespace" v-bind:property="'addATRPanel'" v-bind:label="'ATR'" style="margin: 0px;"></toggle-single-throw>
                        <bollinger-button v-bind:namespace="namespace" style="margin: 0px;"></bollinger-button>
                        <sma-button v-bind:namespace="namespace" style="margin: 0px;"></sma-button>                            
                        <ema-button v-bind:namespace="namespace" style="margin: 0px;"></ema-button>                            
                        <toggle-single-throw  v-bind:namespace="namespace" v-bind:property="'addProfitLoss'" v-bind:label="'P/L'" style="margin: 0px;"></toggle-single-throw>
                        <toggle-single-throw v-bind:namespace="namespace"
        v-if="$store.state[namespace].legs == '1' ||($store.state[namespace].dataSource == 'barchart' && $store.state[namespace].instrument === 'future')"
         v-bind:property="'addVolumePanel'" v-bind:label="'Vol.'" style="margin: 0px;"></toggle-single-throw>
                        </b-button-group>
    
                    <b-button-group style="border: 1px solid gray; padding: 1px; margin: 2px 1px 1px 1px; white-space: nowrap;
                                 background-color: #E8E8E8; border-radius: 3px;"> 
                        <volume-profile-button v-bind:namespace="namespace" style="margin: 0px"  v-if="$store.state[namespace].legs == '1' || ($store.state[namespace].dataSource == 'barchart' && $store.state[namespace].instrument === 'future')"></volume-profile-button>
                        <toggle-single-throw v-bind:namespace="namespace" v-if="$store.state[namespace].stockGraphType === 'line'"
                                             v-bind:property="'showBullets'" v-bind:label="'bullets'" style="margin: 0px;"></toggle-single-throw>
                        <toggle-single-throw v-bind:namespace="namespace" v-bind:property="'showTradingPeriod'" v-bind:label="'period'" style="margin: 0px"></toggle-single-throw>
                        <horizontal-scrollbar-toggle v-bind:namespace="namespace" style="margin: 0px"></horizontal-scrollbar-toggle>
                        <toggle-single-throw v-if="['admin', 'superadmin'].includes($store.state.user.role)" v-bind:namespace="namespace"
                                     v-bind:property="'showPlaybackControl'" v-bind:label="'playback'" style="margin: 0px"></toggle-single-throw>
                        <balloon-toggle v-bind:namespace="namespace" style="margin: 0px"></balloon-toggle>
                        <b-button v-b-toggle.sidebar-help variant="warning" size="sm" style="border: 0px solid darkgray; margin: 1px;">Help</b-button>
                    </b-button-group>
                </b-col>
            </b-row>
            </b-container>
            </td>
            </tr>
        </table>                   
    </div>
</template>

<style scoped>
    #id { 
    border-spacing: 10px;
    border-collapse: separate;
}
</style>

<script>
    import commodityBox from '@/components/commodity-box';
    import contractAlignerSelector from '@/components/contract-aligner-selector';
    import seasonalSelector from '@/components/seasonal-selector';
    import rsiButton from '@/components/rsi-button';
    import cciButton from '@/components/cci-button';
    import smaButton from '@/components/sma-button';
    import emaButton from '@/components/ema-button';
    import bollingerButton from '@/components/bollinger-button';
    import toggleSingleThrow from '@/components/toggle-single-throw';
    import balloonToggle from '@/components/balloon-toggle';
    import stockGraphTypeToggle from '@/components/stock-graph-type-toggle';
    import horizontalScrollbarToggle from '@/components/horizontal-scrollbar-toggle';
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
            emaButton,
            bollingerButton,
            toggleSingleThrow,
            balloonToggle,
            stockGraphTypeToggle,
            horizontalScrollbarToggle,
            volumeProfileButton,
            truncateSelector,
            tradeSpecs
        },
        created() {

        },
        mounted() {
            console.log("basic-chart-input.vue mounted() starting. this.namespace=", this.namespace);
        
            let observer = new ResizeObserver(entries => {
               // console.log("ResizeObserver() starting. this.namespace=", this.namespace, " activeModuleName=", this.$store.getters['activeModuleName']);
                if (this.$store.getters['activeModuleName'] === this.namespace) {
                   // console.log("checking input height.");
                    for (let entry of entries) {
                        // console.log("entry=", entry);
                        // Now do something with the resized element
                       // console.log("entry.contentRect.height=", entry.contentRect.height);
                        this.$store.commit(this.namespace + '/browserSideOnly/setInputDivHeight', entry.contentRect.height);
                    }
                }
            });
            observer.observe(document.querySelector('#' + this.namespace + 'InputDiv')); 
        },
        props: ['namespace']
    };

</script>
