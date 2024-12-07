<template>
    <div class="card" style=" width: auto; margin: -10px 6px 6px 6px; border: 1px solid darkgray; font-size: 1.1rem; text-align: left;  color: rgb(7, 85, 163);">
                         <div style="font-size: 17px; font-weight: bold; text-align: left; margin: 2px 0 -2px 9px">{{ programTitle }}</div>
                            <div style="margin: 8px">                    
                                <span v-if="program === 'Tabs' || typeof program === 'undefined' || program === null">
                                    <div style="font-weight: bold; text-decoration: underline; text-align: left; margin-top: 0px;">Get Started</div>
                                    <ul id="features" style="font-weight: normal; margin-left: 10px">
                                        <li>Press the "+ add tab" button.</li>
                                        <li> Use the "Select Program" dropdown
                                            to change a tab or add a tab if there are none.</li>                                    
                                    </ul>

                                    <div style="font-weight: bold; text-decoration: underline; text-align: left; margin-top: 10px;">Features</div>
                                    <ul id="features" style="font-weight: normal; margin-left: 10px">
                                        <li>Tabs are automatically saved.</li>
                                        <li>Tabs can also be saved and organized by clicking the "Save" button below.</li>                                  
                                    </ul>

                                    <p style="margin-left: 0px;"><u><b>Troubleshooting</b></u> - If anything goes wrong just reload the page. If that doesn't help, please contact 
                                        <b-button v-b-modal.support-modal variant="warning" size="sm" style="border: 0px solid darkgray; border-radius: 3px; margin: 1px;">Support</b-button>

                                    </p>
                                </span>
                                <span v-if="program === 'TradeMaps'"><p><b>Seasonals</b> are great for showing the average changes of trades. But, if you want to see other measures,
                                        such as the probability of profit or the maximum adverse excursion, you need maps.</p><p> <b>These maps</b> were made by running the calculator on 
                                        every combination of open and close dates from now until the First Notice Date for the nearest open intracommodity trades with 1 or 2 legs. Notice that the longest trade is located at the upper-left corner
                                        of the map. You can see this by changing the <b>parameter to map</b> selector to "avg days".
                                        As each day passes, the first column on the left is removed. After expiration, a new map is generated.</p>
                                    <p><b>The bar chart and statistics</b> above the map help you to see the calculator statistics simultaneously so 
                                        you can find trades meeting your criteria faster.</p>
                                </span>
                                <span v-if="program === 'BasicChartsNew'" style="background-color: yellow; border: margin: 0px;"><p><b>These charts</b> show end-of-day data for the most commonly traded commodities with many useful indicators available.</p></span>
                                <span v-if="program === 'Calculator'" style="background-color: yellow;"><p>
                                    <b>The table</b> shows the results of putting on the same trade every year with the same open and close.  In any given year, if the open date is not traded the program moves forward in time up to four days looking for a trade. If the close date is not traded, the program moves backward in time up to four days looking for a trade.</p>  
                                    <p><b>The chart</b> shows the seasonal coverage of the current and past trades. It is constructed by shifting lines in time (horizontally to the right) so that they all expire in the same year. The <span style="color: #d1b200">gold-shaded region</span> shows the selected trade period. Note that the series' labels show the shifted first and last dates, not the actual dates.</p>
                                    <p class="pb-3"><b>When to Use This Program?</b><br>In this section you can explore how a trade performed statistically to help you determine its risk and reward.This program creates a table showing the results of putting on the same trade every year at the same time.</p>
                                    <p class="pt-5"><b>Table columns</b></p>
                                    <p><b>Open, Close: </b> In any given year, if the selected open date is not traded, the program moves forward in time up to four days looking for an open. If the close date is not traded, the program moves backward in time up to four days looking for a close.</p>
                                    <p><b>Change: </b>difference between the open value and the close value.</p>
                                    <p><b>Equity Change: </b>difference in dollar value between the open date and the close date (equity change = change x unit move)</p>
                                    <p><b>Days: </b>difference in days between the open date and the close date.</p>
                                    <p><b>Average profit per day: </b>equity change / days</p>
                                    <p><b>Maximum adverse excursion: </b>date and value of the greatest loss that occurred between the during the trade.</p>
                                    <p><b>Maximum profitable excursion: </b>date and value of the greatest profit that occurred between the during the trade.</p>
                                    <hr>
                                    <p><b>In the last row of the table we find:</b></p>
                                    <ul>
                                        <li><p> - Number of years examined,</p></li>
                                        <li><p> - Percent profitable: ratio of the number of profitable trades to the total number of trades,</p></li>
                                        <li><p> - Averages of the columns</p></li>
                                    </ul>
                                </span>    
                                <span v-if="program === 'ForwardCurves'"><p><b>These charts</b> show the forward curves of the selected commodity for current
                                        and past years. If the market wasn't open with the current month and day in a previous year, the program moves back a day at a time
                                        until it finds an open.</p>
                                    <p><b>Normalization</b> shifts each curve vertically so that it begins at zero in order to make comparison easier.</p>
                                    <p>The <b>chart type</b> "aligned (stacked)" shifts the curves horizontally so that they begin at the same time.</p></span>
                                <span v-if="program === 'OpenSpreads'"><b>These charts</b> show the next years' worth of open contracts (spreads) and are useful in determining which contracts are in backwardation and which are in contango and if any of these relationships have changed. This is helpful for finding spread opportunities as well for choosing the best month for an outright position (that is, a long or short position).</span>
                                <span v-if="program === 'Search'"><p><b>This database</b> was filled by running the calculator on every combination of open and close dates from now 
                                        until the First Notice Date for the nearest open intracommodity trades with 1 or 2 legs. Trades that had an 80% or greater historical 
                                        probability of profit for the last 15 years were added to the database.</p>
                                    <p>The search returns no more than one trade per ticker. This is the key to understanding how the search works. For each ticker, all the trades meeting your selection criteria are ranked according to the 
                                        <b style="color: red">sort by</b> selector and then chosen by the <b> direction</b> selector.</p>

                                    <div style="border: 0px solid gray; margin-left: 0px; margin-top: 8px; padding: 0px; border-radius: 3px; font-size: 1.0rem">
                                        <div style="white-space: nowrap"><b>mpe</b> = maximum profitable excursion</div>
                                        <div style="white-space: nowrap"><b>mae</b> = maximum adverse excursion</div>
                                        <div style="white-space: nowrap"><b>appd</b> = average profit per day</div>
                                    </div> 
                                </span>
                                <span v-if="program === 'SpreadCoverage'"><b>These charts</b> show when spreads traded.</span>
                                <span v-if="program === 'LongTermCharts'"><p>Add description.</p>

                                    
                                </span>
                                <span v-if="program === 'StockCharts'"><b>Full-featured</b> stock and stock spread charts.</span>
                                <span v-if="program === 'History'">
                                    <b>Compare</b> a current position to previous years.
                                </span>

                                <span v-if="program === 'StackedCharts'">
                                    <p>These charts shift the contracts (or spreads) in time so that they all expire in the same year. 
                                        The month and day of each data point remain unchanged - only the year has been changed.  This is actually 
                                        the first step in creating seasonals.
                                        The <span style="color: black; font-weight: bold">black line</span> is the seasonal, which is the average of the 
                                        closed spreads. The seasonal and any open spreads are displayed with thick lines to help you identify them when the 
                                        spreads are aligned.</p>

                                    <p><b>Normalization</b> shifts each curve vertically so that it's value is zero at the specified date in order to make 
                                        comparison easier. Note that spreads not trading on the normalization date won't be plotted when
                                        normalization is on.</p>
                                </span>        

                                
                            </div></div> 
               
</template>

<style scoped>

    ::v-deep  ul#features li {
        margin-left: 10px;
        /*  margin: -5px;*/
        list-style:disc;
    }

</style>

<script>

    import { getProgramComposition } from "@/js/main";


    export default {
        mounted() {
             console.log("program-descriptions.vue mounted() starting. this.namespace=", this.namespace);
        },
        props: {
            namespace: {
                type: String
            }
        },
        computed: {
            program() {
               console.log("this.namespace=", this.namespace);
               return typeof this.namespace === 'undefined' || this.namespace === null ||
                typeof this.$store.state[this.namespace].program === 'undefined' ? null : this.$store.state[this.namespace].program;
            },
            activeModuleName() {
                let activeModuleName = this.$store.getters["activeModuleName"];
                console.log("activeModuleName=", activeModuleName);
                return activeModuleName;
            },
            programTitle(){
                let option = getProgramComposition(this.program, this.$store.state.user.role);
                // console.log("option=", option);
                return option.text;
            }
        },
        watch: {
            namespace(namespace) {
                console.log("watching namespace=", namespace);
            },
            activeModuleName(activeModuleName) {
                console.log("watching activeModuleName=", activeModuleName);
            }
        }
    }
</script>
