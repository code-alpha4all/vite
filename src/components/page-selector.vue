<template>
    <b-container fluid style="width: auto;">
        <b-row align-h="start" style=" background-color: white; padding-bottom: 2px; width: auto">
            <b-col style="margin: 3px -15px 0 -9px; width: 315px">
                <b-button-group style="border: 1px solid gray; padding: 2px; white-space: nowrap; background-color: #e7edf5; border-radius: 3px"> 

                    <span style="padding-top: 7px; font-weight: bold">charts per row:&nbsp;</span>    
                    <b-form-select v-model="chartsPerRow" :options="chartsPerRowOptions" size="sm" style="border: 1px solid gray; margin-right: 10px"></b-form-select>

                    <span style="padding-top: 7px; font-weight: bold">rows per page:&nbsp;</span>    
                    <b-form-select v-model="rowsPerPage" :options="rowsPerPageOptions" size="sm" style="border: 1px solid gray"></b-form-select>

                </b-button-group>

            </b-col>
            <b-col md="auto" style="background-color: #e7edf5; padding: 2px; border: 1px solid gray; margin: 3px 0px 0px 4px; border-radius: 3px;">  
                <b-button-group>
                    <span style="padding-top: 7px; font-weight: bold">page:&nbsp;</span>    
                    <b-pagination style="margin-bottom: 0px; margin-right: 2px; border: 1px solid gray"
                                  v-model="page"
                                  :total-rows="numberOfCharts"
                                  :per-page="rowsPerPage*chartsPerRow">
                    </b-pagination>
                </b-button-group>
            </b-col>
            
        </b-row>
    </b-container>
</template>

<script>
  
    import $ from 'jquery';

    export default {
        beforeMount: function () {
            // console.log("page-selector.vue beforeMount() starting.");
        },
        props: ['namespace'],
        data() {
            return {
                chartsPerRowOptions: Array(4).fill().map((x, i) => ({value: (i + 1), text: (i + 1)})),
                rowsPerPageOptions: Array(2).fill().map((x, i) => ({value: (i + 1), text: (i + 1)}))
            }
        },
        computed: {
            page: {
                get() {
                    return this.$store.state[this.namespace].chartParameters.page;
                },
                set(page) {
                    console.log("set(page) starting.");
                    this.$store.commit(this.namespace + "/chartParameters/setPage", page);
                    console.log("page=", page);

                    if (this.$store.state[this.namespace].study === "history") {
                        let chartrowsOnPage = [];
                        $("#chartDiv").find('tr').each(function (i, obj) {
                            let elementName = obj.id;
                            console.log("obj.id=", obj.id);
                            if (obj.className !== "page" + page) {
                                console.log("not on page. elementName=", elementName);
                                $("#" + elementName).hide();
                            } else {
                                console.log("On this page. elementName=", elementName);
                                chartrowsOnPage.push(obj);
                                $("#" + elementName).show();
                            }
                        });

                        if (chartrowsOnPage.length == 0) {
                            var loopStart = (page - 1) * this.chartsPerRow * this.rowsPerPage;
                            console.log("loopStart=", loopStart);

                           // loop(loopStart).then(() => console.log("all done!"));
                        }
                    }
                }
            },
            chartsPerRow: {
                get() {
                    // console.log("chartsPerRow get:");
                    // console.log("this.$store.state[this.namespace]=", this.$store.state[this.namespace]);
                    return this.$store.state[this.namespace].chartParameters.chartsPerRow;
                },
                set(chartsPerRow) {
                    this.$store.commit(this.namespace + "/chartParameters/setChartsPerRow", parseInt(chartsPerRow));
                    this.$store.commit(this.namespace + "/chartParameters/setPage", 1);
                    // updateChart();
                }
            },
            rowsPerPage: {
                get() {
                    return this.$store.state[this.namespace].chartParameters.rowsPerPage;
                },
                set(rowsPerPage) {
                    this.$store.commit(this.namespace + "/chartParameters/setRowsPerPage", parseInt(rowsPerPage));
                    this.$store.commit(this.namespace + "/chartParameters/setPage", 1);
                    // updateChart();
                }
            },
            numberOfCharts(){
                return this.$store.state[this.namespace].chartParameters.numberOfCharts;
            },
            sampleContract(){
                if(typeof this.$store.state[this.namespace] !== 'undefined'){
                    return this.$store.state[this.namespace].sampleContract;
                } else {
                    return null;
                }
            }
        },
        watch: {
            sampleContract: function () {
                this.$store.commit(this.namespace + "/chartParameters/setPage", 1);
            }
        }
    };
</script>
