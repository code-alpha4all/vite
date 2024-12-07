<template>
    <div>
        <playback-control v-bind:namespace="namespace"  
                          v-bind:i="i"
                          style="width: 100%;"></playback-control> 

        <div v-if="showLevels" style="width: 100%; border-bottom: 1px solid gray; border-top: 0px solid gray; border-right: 0px solid gray;
                 padding-top: 5px">
            <div class="row">
                <equity-widget v-bind:namespace="namespace" group="bronze" v-bind:dailyClose="close"/>
                <equity-widget v-bind:namespace="namespace" group="silver" v-bind:dailyClose="close"/>
                <equity-widget v-bind:namespace="namespace" group="gold" v-bind:dailyClose="close"/>
            </div>
        </div>

        <b-modal v-bind:id="'breakpoint-modal-' + moduleIndex" hide-footer :modal-class="myclass">
            <template #modal-title >
                <span style="text-align: left; font-size: 20px"> {{currentBreakpoint.title}}</span> - 
                <span style="text-align: right; font-size: 16px">{{moment(currentBreakpoint.date).format("MMM DD, YYYY")}}</span>
            </template>
            <div class="d-block text-center">
                <p style="text-align: center; font-size: 16px">  {{currentBreakpoint.message}}</p>
            </div>
            <b-button class="mt-3" variant="secondary" block @click="$bvModal.hide('breakpoint-modal-'+moduleIndex)">Close</b-button>
        </b-modal>

        <b-modal id="end-modal" hide-footer :modal-class="myclass">
            <template #modal-title>
                <p v-if="typeof newData[i - 1] !== 'undefined'" style="text-align: center; font-size: 22px"> {{ moment(newData[i - 1].date).format("MMM DD, YYYY")}}: END OF THE EXERCISE</p>
            </template>
            <b-button class="mt-3" variant="secondary" block @click="$bvModal.hide('end-modal')">Close</b-button>
        </b-modal>
    </div>
</template>

<style scoped>
.myclass > div {
  position:  fixed;
   width: 600px;
   top: 300px;
   left: calc(50% - 250px);
   bottom: 40px;
   z-index: 100;
}

.myclass > .modal-dialog > .modal-content {
  display: inline-block;
}
</style>

<script>

    import playbackControl from '@/components/playback-control';
    import equityWidget from '@/components/equity-widget';
    import moment from "moment";
    import {getDaysArray} from "@/js/main.js";
   // import {updateVolumeProfile} from "../js/am4charts-plugins/volumeProfile";

    export default {
        components: {
            playbackControl, equityWidget
        },
        mounted() {
           /* console.log("playback.vue mounted() starting.");
            console.log("this.namespace=", this.namespace);
            console.log("this.moduleIndex=", this.moduleIndex);
            console.log("this.chart=", this.chart); */
        },
        props: ['namespace', 'parsedData', 'chart'],
        data: function () {
            return {
                timer: null,
                i: null,
                newData: [],
                closes: [],
                currentBreakpoint: {},
                moduleIndex: this.namespace.replace("generalFormTab", ""),
                myclass: ['myclass']
            }
        },
        computed: {
            activeModuleName() {
                let activeModuleName = this.$store.getters['activeModuleName'];
                // console.log("activeModuleName=", activeModuleName);
                return activeModuleName;
            },
            start() {
                return this.$store.state[this.namespace].playback.start;
            },
            end() {
                return this.$store.state[this.namespace].playback.end;
            },
            breakpoints: {
                get() {
                    // console.log("this.$store.state[this.namespace].playback=", this.$store.state[this.namespace].playback);
                    // console.log("this.$store.state[this.namespace].playback.breakpoints=",  JSON.parse(JSON.stringify(this.$store.state[this.namespace].playback.breakpoints)));
                    return this.$store.state[this.namespace].playback.breakpoints;
                },
                set() {}
            },
            breakpointDates() {
                if (typeof this.breakpoints !== 'undefined') {
                    return this.breakpoints.map(x => x.date);
                } else {
                    return null;
                }
            },
            close() {
                if (typeof this.newData[this.i - 1] !== 'undefined' && this.i > 1) {
                    // console.log("this.newData[this.i-1].date=", this.newData[this.i-1].date);
                    // console.log("this.i=", this.i);
                    // console.log("this.closes=",  JSON.parse(JSON.stringify(this.closes)));
                    let close = this.closes.find(x => x.date === this.newData[this.i - 1].date).close;
                    return close;
                } else {
                    return "-";
                }
            },
            showLevels() {
                return this.$store.state[this.namespace].addHorizontalLine;
            },
            buySell() {
                return this.$store.state[this.namespace].buySell;
            },
            entryType() {
                return this.$store.state[this.namespace].chartParameters.entryType;
            }
        },
        watch: {
            activeModuleName: function () {
              //  console.log("playback.js watch activeModuleName is changing.");
                this.pause();
            },
            buySell: function (buySell) {
                console.log("watch buySell = ", buySell);
               // if(){
                    this.rewind();
               // }
            },
            start: function (/*start*/) {
               // console.log("watch start = ", start);
                if(typeof this.chart.series !== 'undefined'){
                    this.rewind();
                }
            },
            end: function (/*end*/) {
               // console.log("watch end = ", end);
                if(typeof this.chart.series !== 'undefined'){
                    this.rewind();
                }
            },
            entryType: function (entryType) {
                console.log("watch entryType = ", entryType);
                if(typeof this.chart.series !== 'undefined'){
                    this.rewind();
                }
            }
        },
        methods: {
            moment: function (date) {
                return moment(date);
            },
            pause() {
                clearInterval(this.timer);
                this.timer = null;
            },
            oneStepBackward() {
                console.log("oneStepBackward.");
                this.chart.series.values.forEach(function (series) {
                    // console.log("series.id=", series.id);
                    if (!series.id.includes("-y") && !series.id.includes("scrollbar") && !series.id.includes("profit-loss") && !series.id.includes("horizontal")) {
                        // console.log("series.id=", series.id);
                        let truncatedData = [...series.data].slice(0, -1);
                        // console.log("truncatedData=", truncatedData);
                        series.data = truncatedData;
                    }
                });
                this.i--;
                if ((this.$store.state[this.namespace].legs == 1 || (["BasicCharts", "Playback"].includes(this.$store.state[this.namespace].program)
                        && this.$store.state[this.namespace].dataSource !== "eod")) && this.$store.state[this.namespace].addVolumeProfile) {
                  //  let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                  //  updateVolumeProfile(this.chart, generalForm);
                }
            },
            oneStepForward() {
                // console.log("oneStepForward.");
                let singleStep = true;
                this.play(singleStep);
            },
            play(singleStep = false) {
                console.log("playing.");
                let that = this;
                function startInterval() {
                    console.log("startInterval() starting.");
                    if (that.timer == null) {

                        that.timer = setInterval(function () {
                            // let i = that.$store.state[that.namespace].playback.i;
                            //  console.log("i=", i, " that.timer=", that.timer);
                            //  console.log("that.breakpointDates=", that.breakpointDates);
                           // console.log("namespace=", that.namespace, " that.i=" + that.i + "  " + that.newData[that.i].date + "   " + moment(that.newData[that.i].date).format('dddd'));
                            if (that.i > 0 && typeof that.breakpoints !== 'undefined' && that.breakpointDates.includes(that.newData[that.i].date)) {
                                let breakpoint = that.breakpoints.find(x => x.date == that.newData[that.i].date);
                                //  breakpoint.date = moment(breakpoint.date).format("MMM DD, YYYY");
                                that.currentBreakpoint = breakpoint;

                                // console.log("that.currentBreakpoint=", that.currentBreakpoint);
                                that.pause();
                                that.$bvModal.show('breakpoint-modal-' + that.moduleIndex);
                                //alert(currentBreakpoint.date + " -  " + currentBreakpoint.title + " :  " + currentBreakpoint.message);
                                // that.play();
                            }

                            // console.log("that.end=", that.end);
                          //  console.log("that.newData[that.i]=", JSON.parse(JSON.stringify(that.newData[that.i])));
                          //  console.log("that.newData=", JSON.parse(JSON.stringify(that.newData)));
                            if (that.i !== null && that.i < that.newData.length && !moment(that.newData[that.i].date).isAfter(moment(that.end))) {
                             // console.log("namespace=", that.namespace, " that.i=" + that.i + "  " + that.newData[that.i].date + "   " + moment(that.newData[that.i].date).format('dddd'));
                                that.chart.series.each(function (series) {
                                    if (!series.id.includes("-y") && !series.id.includes("scrollbar") && !series.id.includes("profit-loss") && !series.id.includes("horizontal")) {
                                        series.addData(that.newData[that.i], 0);
                                    }
                                });
                                if ((that.$store.state[that.namespace].legs == 1 || (["BasicCharts", "Playback", "TimeSeriesCharts"].includes(that.$store.state[that.namespace].program)
                                        && that.$store.state[that.namespace].dataSource !== "eod")) && that.$store.state[that.namespace].addVolumeProfile) {
                                  //  let generalForm = JSON.parse(JSON.stringify(that.$store.state[that.namespace]));
                                   // updateVolumeProfile(that.chart, generalForm);
                                }
                                let dates = that.closes.map(x => x.date);
                               // console.log("dates=", dates);
                                  console.log("dates.includes(that.newData[that.i].date)=", dates.includes(that.newData[that.i].date));
                                if (!dates.includes(that.newData[that.i].date)) {
                                    if (typeof that.newData[that.i].close !== 'undefined' && that.newData[that.i].close !== null) {
                                        that.closes.push({date: that.newData[that.i].date, close: that.newData[that.i].close});
                                    } else {
                                        that.closes.push({date: that.newData[that.i].date, close: that.closes[that.i - 1].close});
                                    }
                                }
                                that.i++;
                                if (singleStep)
                                    that.pause();
                              /*  if(moment(that.newData[that.i].date).isSame(moment(that.end))){
                                   that.$bvModal.show('end-modal');
                                }*/
                            } else {
                                // console.log("Up to date.");
                                clearInterval(that.timer);
                                that.timer = null;

                                that.$bvModal.show('end-modal');
                                // alert(moment(that.newData[that.i - 1].date).format("YYYY-MM-DD") + ": END OF THE EXERCISE");
                                return;
                            }
                        }, 1000 * that.$store.state[that.namespace].playback.interval);

                    }
                }
                startInterval();
            },
            rewind() {
                console.log("rewind() starting. namespace=", this.namespace);

                clearInterval(this.timer);
                this.timer = null;
                this.newData = [];
                this.i = 0;
                this.closes = [];

                let start = this.start;
                console.log("start=", start);
               // console.log("this.chart=", this.chart);
                this.chart.series.values.forEach(function (series) {
                    // console.log("series.id=", series.id);
                    if (!["-y", "scrollbar", "profit-loss"].some(x => series.id.includes(x))) {
                        // if (!series.id.includes("-y") && !series.id.includes("scrollbar") && !series.id.includes("profit-loss")) {
                        console.log("series.id=", series.id);
                        let truncatedData = [...series.data].filter(x =>{
                           // console.log(x.date + "  moment(x.date).isBefore(start)=", moment(x.date).isBefore(start));
                            return moment(x.date).isBefore(start);
                        });
                        console.log("truncatedData=", truncatedData);
                        series.data = truncatedData;
                    }
                });

                if ((this.$store.state[this.namespace].legs == 1 || (["BasicCharts", "Playback"].includes(this.$store.state[this.namespace].program)
                        && this.$store.state[this.namespace].dataSource !== "eod")) && this.$store.state[this.namespace].addVolumeProfile) {
                  //  let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                  //  updateVolumeProfile(this.chart, generalForm);
                }

                let temp = Object.values(this.parsedData.values).filter(x => moment(x.date).isAfter(moment(this.start)));
               // console.log("this.parsedData.values=", this.parsedData.values);
               // console.log("this.start=", this.start);
               // console.log("temp=", temp);

                let seriesStart = temp[0].date;
                let seriesEnd = temp[temp.length - 1].date;
              //  console.log("seriesStart=", seriesStart, " seriesEnd=", seriesEnd);

                let seriesIncrement = Math.abs(temp[1].date - temp[0].date)/(1000*60);
                console.log("seriesIncrement=", seriesIncrement, "minutes");

                let timePeriod = seriesIncrement === 1 ? "minutes" : "days";
                console.log("timePeriod=", timePeriod);
                let incrementList = getDaysArray(moment(seriesStart).add(1, timePeriod), moment(seriesEnd), timePeriod);
               // console.log("incrementList=", incrementList);

                let paddedData = incrementList.map(date => {
                   // console.log("date=", date);
                    if (typeof temp.find(x => moment(x.date).isSame(moment(date))) !== 'undefined') {
                        return temp.find(x => moment(x.date).isSame(moment(date)));
                    } else {
                        return null;
                    } 
                }).filter(x => {
                   // console.log("x=", x);
                    return x !== null
                });
               // console.log("paddedData=", JSON.parse(JSON.stringify(paddedData)));
                this.newData = paddedData;

                this.oneStepForward();
            }
        }
    }
</script>

