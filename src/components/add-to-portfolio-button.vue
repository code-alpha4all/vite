<template>
    <div>
        <span v-if="isOpen">
            <b-button size="sm" :id="'add-to-portfolio-button-'+namespace" @click="showModal" style="font-weight: bold;
                 border: 1px solid gray; color: white; background-color: #40B5AD; white-space: nowrap;">
                add to portfolio
            </b-button>
        </span>

        <b-modal :id="'add-to-portfolio-modal-'+namespace" :ref="'add-to-portfolio-modal-'+namespace" ok-only variant="primary" header-bg-variant="primary"
                 header-text-variant="'light'" size="lg" title="Add To Portfolio" @hide="onModalHide">

            <p style="font-size: 14px">Which folder would you like to add this trade to?</p>

            <portfolio-folders :ref="'portfolio-folders-'+namespace" v-bind:namespace="namespace"></portfolio-folders>          

            <table>
                <tr>
                    <td :id="'add-to-portfolio-add-button-'+namespace">
                <b-button variant="success" v-on:click="createTrade" style="margin: 20px 0 0 0">add to portfolio</b-button>
                </td>
                <td style="padding: 22px 0 0 15px; font-weight: bold">
                    {{result}}
                </td>
                <td style="padding: 24px 0 0 14px;">
                <b-button v-if="result !== ''"
                          v-on:click="goToPortfolio"
                          :id="'go-to-portfolio-button-'+namespace"
                          style="font-weight: bold; margin: 0px; border: 1px solid gray;
                          color: white; background-color: blue">
                    Go to the Portfolio.
                </b-button>
                </td>
                </tr>
            </table>
        </b-modal>
    </div>
</template>

<script>

    import * as fb from "@/firebase";
    import {spreadTitle} from "@/js/main";
    import $ from "jquery";
    import portfolioFolders from '@/components/portfolio-folders';
    import {isSpreadOpen} from "@/js/main";


    export default {
        components: {
            portfolioFolders
        },
        mounted() {
           // console.log("add-to-portfolio-button mounted() starting.");
        },
        props: ['namespace'],
        data: function () {
            return {
                result: ""
            };
        },
        computed: {
            email() {
                return this.$store.state.user.email;
            },
            open() {
                return this.$store.state[this.namespace].open;
            },
            program() {
                return this.$store.state[this.namespace].program;
            },
            portfolioDirectory: {
                get() {
                    return this.$store.state.user.portfolioDirectory;
                },
                set(portfolioDirectory) {
                    this.$store.commit('setPortfolioDirectory', portfolioDirectory);
                }
            },
            isOpen(){
               // let spread = this.$store.state[this.namespace].selected[0];
               // console.log("spread=", spread);
               // console.log("isSpreadOpen=", isSpreadOpen);
              // console.log("this.instrument=", this.instrument);
               return this.instrument === "stock" ? true : isSpreadOpen(this.$store.state[this.namespace].selected[0]);
            },
            instrument(){
                return this.$store.state[this.namespace].instrument;
            }
        },
        methods: {
            onModalHide(bvModalEvt) {
                console.log("onModalHide() starting. this.namespace=", this.namespace);
                console.log('Modal hidden. bvModalEvt=', bvModalEvt);
                this.result = "";
            },
            showModal(){
                console.log("showModal() starting. this.namespace=", this.namespace);
                this.$refs["add-to-portfolio-modal-" + this.namespace].show();
            },
            hideModal(){
                console.log("hideModal() starting. this.namespace=", this.namespace);
                this.$refs["add-to-portfolio-modal-" + this.namespace].hide();
            },
            goToPortfolio() {
                console.log("goToPortfolio() starting.");
               // console.log("this.$refs=", this.$refs);
               // console.log("this.$refs['add-to-portfolio']=", this.$refs["add-to-portfolio"]);
                this.$refs["add-to-portfolio-modal-" + this.namespace].hide();

                this.$store.commit('user/setShowAllPortfolioFolders', false);

                this.$store.dispatch('newTab', "Portfolio");

              /*  let moduleArray = this.$store.getters['moduleArray'];
                console.log("moduleArray=", JSON.parse(JSON.stringify(moduleArray)));

                let portfolioModule = moduleArray.find(x => x.program === "Portfolio");
                console.log("portfolioModule=", portfolioModule);
                if (typeof portfolioModule !== 'undefined') {
                    let portfolioModuleName = portfolioModule.moduleName;
                    console.log("portfolioModuleName=", portfolioModuleName);

                    let refs = ["Calculator"].includes(this.program) ? this.$parent.$parent.$parent.$refs : this.$parent.$parent.$parent.$parent.$refs;
                    console.log("refs=", refs);

                    let child = refs[portfolioModuleName + "Output"][0];
                    console.log("child=", child);
                    child.activate();
                } else {
                    this.$store.dispatch('newTab', "Portfolio")
                }*/
            },
            getTicker(form) {
                let invertDatesMultiplier = 1;
                let noLegSwapping = true;
                let includeUnitMoves = true;
                let ticker = spreadTitle(JSON.parse(JSON.stringify(form)), invertDatesMultiplier, noLegSwapping, this.symbols, includeUnitMoves);
                console.log("ticker=", ticker);
                return ticker;
            },
            addToPortfolio(values) {
                console.log("addToPortfolio() starting. values=", values);
                let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                delete generalForm.browserSideOnly;
                delete generalForm.playback;
                delete generalForm.indicators;

                console.log("this.open=", this.open);
                let openBar = values[this.open.replace(/-/g, "")];
                console.log("openBar=", openBar);

                let openPrice = typeof openBar !== 'undefined' ? openBar.close : null;
                console.log("openPrice=", openPrice);
                generalForm.open = this.open;
                generalForm.portfolio.openPrice = openPrice;
                generalForm.portfolio.numberOfPositions = 1;
                generalForm.portfolio.folder = this.portfolioDirectory;
                generalForm.ticker = this.getTicker(generalForm, "old");
               
                console.log("generalForm=", generalForm);
                console.log("this.email=", this.email);

                fb.db.collection("portfolio-alpha")
                        .doc(this.email)
                        .collection("strategies")
                        .add(generalForm)
                        .then((docRef) => {
                            console.log("Document written with ID: ", docRef.id);
                            console.log('chart saved.');
                            this.result = "Success.";
                        });
            },
            createTrade: function () {
                console.log("createTrade() starting.");

                console.log("this.program=", this.program);
                if (this.program === "BasicChartsNew") {
                   /* console.log("this.$parent=", this.$parent);
                    console.log("this.$parent.parsedData=", this.$parent.parsedData);
                    console.log("this.$parent.$parent.$parent.$refs=", this.$parent.$refs); */

                    let values = JSON.parse(JSON.stringify(this.$parent.$options.parsedData.values));
                    this.addToPortfolio(values);
                } else if (this.program === "Calculator") {
                    this.getData().then(values => {
                        console.log("values=", values);
                        this.addToPortfolio(values);
                    });
                }


            },
            getData() {
                console.log("getData() starting.");
                return new Promise((resolve) => {

                    let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                    delete generalForm.browserSideOnly;
                    delete generalForm.chartParameters;
                    delete generalForm.playback;
                    generalForm.generator = "BasicBarsGenerator";
                    generalForm.study = "basic";
                    console.log("generalForm=", generalForm);

                    let json = JSON.stringify(generalForm, null, 2);
                    if (generalForm.selected.length > 0) {
                        let that = this;
                        var currentRequest = $.ajax({
                            url: this.$store.state.siteData.baseUrl + this.$store.state.siteData.contextName + "/BasicEodBarsControllerServlet/",
                            type: "POST",
                            data: {"json": json},
                            beforeSend: function () {
                                //  console.log("beforeSend starting.");
                                if (currentRequest != null) {
                                    //  console.log("aborting previous request.");
                                    currentRequest.abort();
                                }
                            },
                            success: function (data) {
                                // console.log("data=", data);
                                that.$store.commit('decrementNumberOfAjaxCalls');
                                let values = JSON.parse(data)[0].values;
                                // console.log("values=", values);
                                resolve(values);
                            },
                            fail: function (err) {
                                that.$store.commit('decrementNumberOfAjaxCalls');
                                console.log("ajax call failed. err=", err);
                            }
                        });
                    }
                });
            }
        }
    }
</script>
