<template>
    <span>

        <b-button v-b-modal.indicators_popup size="sm" class="btn" variant="success" style="border: 1px solid gray; margin: 0px 0px 0px 0px;">Indicators</b-button>

        <b-modal ref="indicators_popup" id="indicators_popup" header-bg-variant="success"
                 header-text-variant="'light'" ok-only size="lg" title="Indicators">

            <b-container class="bv-example-row" style="color: darkblue">
                <b-row style="margin: -7px 0px 12px -4px; font-size: 14px; font-weight: bold">Selected Indicators:
                    <span v-for="(indicator, index) in selectedIndicators" v-bind:key="index">
                        <span style="margin-left: 4px">   {{indicator}} </span>
                        <span v-if="index < selectedIndicators.length-1" style="margin: 0 1px 0 -4px">, </span>
                    </span>
                </b-row>
                <b-row style="border-top: 1px solid gray; padding-top: 14px">
                    <b-col>
                        <ul v-for="(indicator) in indicators" v-bind:key="indicator.id" style="list-style-type: none;">
                            <li @mouseover="upHere = indicator.shortName" @mouseleave="upHere = ''">  
                            <b-form-row align-h="start" style="font-family: verdana; border: 0px solid gray;  margin: -3px"
                                        v-bind:style="['atr', 'vol', 'vp'].includes(indicator.id) && legs > 1 ? {color: 'gray'} : {color: 'darkblue'}">
                                <b-form-checkbox
                                    :id="indicator.id"
                                    v-model="indicator.visible"
                                    style="margin:-1px -3px 0px 0">
                                </b-form-checkbox>
                                <span style="font-weight: bold">{{indicator.shortName}}</span>, {{indicator.name}}
                                <span v-if="['atr', 'vol', 'vp'].includes(indicator.id) && legs > 1">&nbsp; {{indicator.condition}}</span>

                                <span :id="indicator.shortName+'_icon'" style="margin-bottom: 0px">
                                    <span v-if="!['cot', 'vol', 'p/l', 'atr', 'macd'].includes(indicator.id)" @click="settings(indicator.shortName)">
                                        <Icon style="margin: -2px 0px 0px 4px; cursor: pointer;" icon="mdi:cog-outline" 
                                              width="18" height="18" v-b-tooltip.hover.topleft="'settings'"/>
                                    </span>
                                    <span @click="info(indicator.shortName)">
                                        <Icon style="margin: -4px 4px 0px 0px; cursor: pointer;" icon="mdi:help"
                                              onmouseover="" width="13" height="13" v-b-tooltip.hover.topleft="'info'"/>
                                    </span>
                                </span>  
                            </b-form-row>
                            </li>
                        </ul>
                    </b-col>
                    <b-col v-if="selectedPanel === 'settings'">
                        <h5 style="font-weight: bold; margin-bottom: 16px">{{selectedIndicator}} Settings</h5>
                        <bollinger-button v-if="selectedIndicator === 'BB'" v-bind:namespace="namespace" style="margin: 0px;"></bollinger-button>  
                        <cci-button v-if="selectedIndicator === 'CCI'" v-bind:namespace="namespace" style="margin: 0px;"></cci-button>  
                        <rsi-button v-if="selectedIndicator === 'RSI'" v-bind:namespace="namespace" style="margin: 0px;"></rsi-button>  
                        <sma-button v-if="selectedIndicator === 'SMA'" v-bind:namespace="namespace" style="margin: 0px;"></sma-button>                            
                        <ema-button v-if="selectedIndicator === 'EMA'" v-bind:namespace="namespace" style="margin: 0px;"></ema-button>                            
                        <volume-profile-button v-if="selectedIndicator === 'VP'" v-bind:namespace="namespace" style="margin: 0px;"></volume-profile-button>                                               
                    </b-col>
                    <b-col v-if="selectedPanel === 'info'">
                        <h5  style="font-weight: bold">{{selectedIndicator}} Information</h5>

                        <div v-if="selectedIndicator === 'MACD'" style="border: 0px solid gray; padding: 0px; width: fit-content; font-size: 1.1rem">
                            <div style="margin: 10px 0 0 0">slow period = 26</div>
                            <div style="margin: 4px 0 0 0"> fast period = 12</div>
                            <div style="margin: 4px 0 0 0"> signal period = 9</div>
                        </div>
                        <div v-if="selectedIndicator === 'ATR'" style="border: 0px solid gray; padding: 0px; width: fit-content; font-size: 1.1rem">
                            <div style="margin: 10px 0 0 0">period: 14 days</div>
                        </div>
                        <div v-if="!['P/L'].includes(selectedIndicator)" style="border: 1px solid gray; padding: 10px; font-size: 14px;
                             margin-top: 20px; background-color: white; width: fit-content; border-radius: 4px;">
                            <b-link target="_blank" :href="help.url">{{help.text}}</b-link>
                        </div>
                        <div v-else style="border: 1px solid gray; padding: 10px; font-size: 1.1rem;
                             margin-top: 20px; background-color: white; width: fit-content; border-radius: 4px;">
                            {{help.text}}
                        </div>

                    </b-col>
                </b-row>
            </b-container>
        </b-modal>


    </span>
</template>

<style scoped>
    .tooltip:hover {
        font-size: 15px;
    }


    .modal .modal-header .modal-title{
        color: white;
        font-size: 1.5rem
    }

</style>


<script>
    import { Icon } from '@iconify/vue2';
    import bollingerButton from '@/components/bollinger-button';
    import cciButton from '@/components/cci-button';
    import rsiButton from '@/components/rsi-button';
    import smaButton from '@/components/sma-button';
    import emaButton from '@/components/ema-button';
    import volumeProfileButton from '@/components/volume-profile-button';

    export default {
        components: {
            Icon,
            bollingerButton,
            cciButton,
            rsiButton,
            smaButton,
            emaButton,
            volumeProfileButton
        },
        mounted() {
            let that = this;
            this.$root.$on('bv::modal::hide', (bvEvent, modalId) => {
                console.log(that.namespace + ': inicators-modal is about to be hidden', bvEvent, modalId);
                this.selectedIndicator = "";
                this.selectedPanel = "";
            });
        },
        beforeDestroy(){
            console.log("beforeDestroy() starting.");
            let that = this;
            this.$root.$off('bv::modal::hide', (bvEvent, modalId) => {
                console.log(that.namespace + ': inicators-modal is about to be hidden', bvEvent, modalId);
                this.selectedIndicator = "";
                this.selectedPanel = "";
            });
        },
        props: ['namespace'],
        data: function () {
            return {
                upHere: false,
                //  selected: [], // Must be an array reference!
                selectedIndicator: "",
                selectedPanel: ""
            };
        },
        computed: {
            indicators() {
                return  this.$store.getters[this.namespace + "/indicators/sortedIndicators"];
            },
            selectedIndicators() {
                return this.$store.getters[this.namespace + "/indicators/selectedIndicators"].map(x => x.shortName);
            },
            legs() {
                return this.$store.state[this.namespace].legs;
            },
            help() {
                let urlObj = {
                    ATR: {url: "https://www.investopedia.com/terms/a/atr.asp", text: "ATR on investopedia.com"},
                    BB: {url: "https://www.investopedia.com/terms/b/bollingerbands.asp", text: "Bollinger Bands on investopedia.com"},
                    CCI: {url: "https://www.investopedia.com/terms/c/commoditychannelindex.asp", text: "CCI on investopedia.com"},
                    COT: {url: "https://www.investopedia.com/terms/c/cot.asp", text: "Commitment of Traders on investopedia.com"},
                    EMA: {url: "https://www.investopedia.com/terms/e/ema.asp", text: "Exponential Moving Average on investopedia.com"},
                    MACD: {url: "https://www.investopedia.com/terms/m/macd.asp", text: "MACD on investopedia.com"},
                    'P/L': {url: "", text: "The Profit & Loss Calculator is used to measure the price difference in USD between two points selected with the mouse."},
                    RSI: {url: "https://www.investopedia.com/terms/r/rsi.asp", text: "RSI on investopedia.com"},
                    SMA: {url: "https://www.investopedia.com/terms/s/sma.asp", text: "Simple Moving Average on investopedia.com"},
                    VOL: {url: "https://www.investopedia.com/ask/answers/050615/what-difference-between-open-interest-and-volume.asp#:~:text=Volume%20and%20open%20interest%20are,are%20active%2C%20or%20not%20settled.", text: "Volume and Open Interest on investopedia.com"},
                    VP: {url: "https://tickertape.tdameritrade.com/tools/volume-profile-tool-thinkorswim-support-resistance-16023", text: "Volume Profile on TDAmeritrade.com"}
                }
                //  console.log("this.selectedIndicator=", this.selectedIndicator);
                return urlObj[this.selectedIndicator];
            }
        },
        methods: {
            info(shortName) {
                console.log('info() starting. shortName=', shortName);
                this.selectedIndicator = shortName;
                this.selectedPanel = "info";
            },
            settings(shortName) {
                console.log('settings() starting. shortName=', shortName);
                this.selectedIndicator = shortName;
                this.selectedPanel = "settings";
            }
        }
    }
</script>
