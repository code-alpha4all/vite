<template>
    <b-container fluid="xl" style=" border:1px solid gray; padding: 2px; margin-top: 2px; background-color: whitesmoke; font-size: 15px;">
        <b-form inline style="margin: 2px 0 3px 2px">
            <b-form-select size="sm" style="border:1px solid gray; font-size: 15px;"
                           v-model="spreadP" :options="positionOptions"></b-form-select>

        </b-form>
        <b-form inline >
            <commodity v-bind:namespace="namespace" v-bind:index="0"></commodity>

        </b-form>
        <b-form inline >
            <b-form-select size="sm" style="border:1px solid gray; margin: 2px 2px 2px 2px; font-size: 15px;"
                           v-model="barchartTicker" :options="barchartOptions"
                           @change="changeTicker"></b-form-select> 

        </b-form>
    </b-container>
</template>

<script>
    import {contractNameDecomposer, tickerToGeneralForm, csi_to_barchart_conv,
            isSpreadInDatabase, csiContractToBarchartContract, spreadTitle, getBarchartMultsAndPositionsArray} from "../js/main";
    import $ from "jquery";
    import commodity from '@/components/commodity.vue';

    export default {
        components: {
            commodity
        },
        mounted: function () {
            console.log("barchart-spreads-selector.vue starting. ");
            if (this.barchartOptions.length === 0) {
                this.getSpreads();
            }
        },
        props: ['namespace'],
        watch: {
            barchartOptions: function (barchartOptions) {
                if (barchartOptions.length === 0) {
                    console.log("No barchart options.");
                    this.getSpreads();
                }
            },
            commodity: function (commodity) {
                console.log("watch commodity=", commodity);
                this.getSpreads(commodity);
            }
        },
        computed: {
            positionOptions() {
                return  [
                    {value: '1', text: this.$t('commodityBox.long')},
                    {value: '-1', text: this.$t('commodityBox.short')}
                ]
            },
            commodity: {
                get() {
                    return this.$store.getters[this.namespace + "/c"][0];
                },
                set() {
                    // The following statement gets called during initialization and causes problems.
                    // this.$store.dispatch(this.namespace + '/changeCommodityLeg', {commodity: commodity, index: this.index});
                }
            },
            barchartTicker: {
                get() {
                    console.log("barchart-spreads-selector barchartTicker get() starting. namespace=", this.namespace);
                    let barchartTicker = this.$store.state[this.namespace].barchartTicker;

                    /*  if (barchartTicker === null) {
                     if (typeof this.barchartOptions[0] !== 'undefined') {
                     barchartTicker = this.barchartOptions[0].value;
                     } else {
                     barchartTicker = null;
                     }
                     }*/
                    console.log("barchartTicker=", barchartTicker);

                    return barchartTicker;
                },
                set() {}
            },
            spreadP: {
                get() {
                    return this.$store.state[this.namespace].spreadP;
                },
                set(spreadP) {
                    this.$store.commit(this.namespace + '/setSpreadP', spreadP);
                    console.log("spreadP=", spreadP);

                    let generalForm = this.$store.state[this.namespace];
                    let newPandMult = getBarchartMultsAndPositionsArray(generalForm.legs, spreadP);
                    console.log("newPandMult.p=", newPandMult.p);

                    this.$store.commit(this.namespace + '/setP', newPandMult.p);
                    console.log("generalForm=", generalForm);

                    let levels = this.$store.state[this.namespace].chartParameters.levels;
                    levels.forEach(x => {
                        x.from = -x.from;
                        x.to = -x.to;
                        return x;
                    });
                    console.log("levels=", JSON.parse(JSON.stringify(levels)));
                }
            },
            barchartOptions: {
                get() {
                    return this.$store.state[this.namespace].browserSideOnly.barchartOptions;
                },
                set() {}
            }
        },
        methods: {
            changeTicker(barchartTicker) {
                console.log("changeTicker() starting. namespace=", this.namespace);
                console.log("barchartTicker=", barchartTicker);
                // console.log("this.barchartOptions.slice(0)=", this.barchartOptions.slice(0));
                // this.getSpread(this.selected);
                let csiTicker;

                if (this.barchartOptions.length > 0) {
                    if (null !== barchartTicker) {
                        csiTicker = this.barchartOptions.slice(0).find(x => x.value === barchartTicker).text;
                    } else {
                        csiTicker = this.barchartOptions.slice(0)[0].text;
                    }
                    console.log("csiTicker=", csiTicker);


                    let generalForm = tickerToGeneralForm(csiTicker);
                    //console.log("generalForm=", generalForm);
                    this.$store.commit(this.namespace + '/setSelected', [generalForm.selected[0], barchartTicker]);

                    // let oldSampleContractArray = this.$store.state[this.namespace].sampleContract.slice(0);
                    // let newSampleContractArray = oldSampleContractArray.splice(0, generalForm.sampleContract.length, generalForm.sampleContract);
                    // console.log("oldSampleContractArray=", oldSampleContractArray);
                    // console.log("generalForm.sampleContract=", generalForm.sampleContract);
                    // console.log("newSampleContractArray=", newSampleContractArray);

                    this.$store.commit(this.namespace + '/setSampleContract', generalForm.sampleContract);
                    this.$store.commit(this.namespace + '/setLegs', generalForm.legs);
                    this.$store.commit(this.namespace + '/setMult', generalForm.mult);
                    this.$store.commit(this.namespace + '/setUnitMove', generalForm.unitMove);
                    //  console.log("this.$store.state.generalForm.spreadP=", this.$store.state.generalForm.spreadP);

                    let newPandMult = getBarchartMultsAndPositionsArray(generalForm.legs, this.spreadP)
                    this.$store.commit(this.namespace + '/setP', newPandMult.p);

                    this.$store.commit(this.namespace + '/setBarchartTicker', barchartTicker);

                    generalForm = {...this.$store.state[this.namespace]};
                    console.log("generalForm=", generalForm);

                    // this.$store.dispatch(this.namespace + '/getContractListsFromServer');
                }
            },
            getSpreads() {
                console.log("getSpreads() starting.");
                //console.trace();
                let commodity = this.$store.getters[this.namespace + "/c"][0]
                console.log("commodity=", commodity);
                let barchartCommodity = eod_to_barchart_conv(commodity);
                //  console.log("barchartCommodity=", barchartCommodity);
                let url = 'https://ondemand.websol.barchart.com/getFuturesSpreads.json?apikey=b1c49578e1c86ad86ed719375aff6f49&root=' +
                        barchartCommodity + '&type=daily&fields=symbol';

                let that = this;
                $.ajax({
                    url: url,
                    type: "GET",
                    crossDomain: true,
                    success: function (data) {
                        // console.log("data=", data);
                        let parsedData = data.results.filter(spread => !spread.symbol.includes("_S_SA"));
                        // console.log("parsedData=", parsedData);

                        let spreadOptions = parsedData.map(x => {
                            return {value: x.symbol, text: barchartSpreadToCsiSpread(x.symbol)};
                        }).filter(y => isSpreadInDatabase(y.text));
                        // console.log("spreadOptions=", spreadOptions);

                        let contracts = spreadOptions.map(x => x.text.replace(/\s/g, '').split('/'));
                        // console.log("contracts=", contracts);

                        let uniqueContracts = [...new Set(contracts.reduce((a, b) => a.concat(b), []))]
                                .filter(x => contractNameDecomposer(x).commoditySymbol === commodity);
                        // console.log("uniqueContracts=", uniqueContracts);

                        let contractOptions = uniqueContracts.map(x => {
                            return {value: csiContractToBarchartContract(x), text: x};
                        });
                        let barchartOptions = [...contractOptions, ...spreadOptions].sort((a, b) => (a.text > b.text) ? 1 : -1)
                                .map(x => {
                                    // console.log("x=", x);
                                    //  console.log("generalForm=", generalForm);
                                    let generalForm = JSON.parse(JSON.stringify(that.$store.state[that.namespace]));
                                    // console.log("generalForm=", generalForm);
                                    generalForm.selected = [x.text];
                                    generalForm.mult = [1, 1, 1, 1];
                                    generalForm.p = [1, -1, 1, 1];
                                    let legs = x.text.split('/').length;
                                    //  console.log("x=", x, " legs=", legs);
                                    switch (legs) {
                                        case 3:
                                            generalForm.mult = [1, 2, 1, 1];
                                            break;
                                        case 4:
                                            generalForm.p = [1, -1, -1, 1];
                                            break;
                                    }

                                    let name = spreadTitle(generalForm);
                                    return {value: x.value, text: name};
                                });
                        console.log("barchartOptions=", JSON.parse(JSON.stringify(barchartOptions)));
                        console.log("that.barchartTicker=", that.barchartTicker);
                        that.$store.commit(that.namespace + '/browserSideOnly/setBarchartOptions', barchartOptions);

                        let test = barchartOptions.some(x => x.value.includes(that.barchartTicker));
                        console.log("test=", test);
                        if (!test || that.barchartTicker == null)
                            that.changeTicker(that.barchartOptions[0].value);
                    },
                    fail: function (data) {
                        console.log("ajax call failed.");
                        $("#progress").hide();
                        $("#button").show();
                        console.log(data);
                    }
                });
            }
        }
    };
</script>
