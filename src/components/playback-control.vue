<template>
    <div style="font-weight: normal; color: black;" v-bind:id="namespace+'-playbackControl'">
        <b-form inline style="border-bottom: 1px solid gray; border-left: 0px solid gray; border-right: 0px solid gray;
                    padding: 3px; background-color: #E8E8E8;"> 

            <b-button v-on:click="hidePlayback()" size="sm" style="margin: 0 7px 0 0px; background-color: black;  color: white">hide</b-button>

            <span style="margin-right: 0px; margin-left: 2px; font-weight: bold"> start:</span>
            <b-form-datepicker size="sm" v-model="start" :max="end" 
            :date-format-options="{ year: 'numeric', month: 'short', day: 'numeric' }" 
             style="margin-right: 0px; margin-left: 2px; border: 1px solid gray;"></b-form-datepicker>
            <b-form-timepicker v-model="startTime" style="margin-right: 7px; margin-left: 2px; border: 1px solid gray;" locale="en"></b-form-timepicker>

            <span style="margin-right: 0px; margin-left: 2px; font-weight: bold"> end:</span>
            <b-form-datepicker size="sm" v-model="end" :min="start"
             :date-format-options="{ year: 'numeric', month: 'short', day: 'numeric' }"
              style="margin-right: 11px; margin-left: 2px; border: 1px solid gray;"></b-form-datepicker>

            <span style="margin-left: 4px; margin-right: 5px; font-weight: bold"> interval:
                <b-form-select size="sm" style="border:1px solid gray; width: auto; margin: 0px 1px 0 0px"
                               v-model="interval" :options="intervalOptions"> 
                </b-form-select>
                <span style="font-weight: normal">sec/frame</span>
            </span>
            <b-button v-on:click="$parent.rewind()" size="sm"
                      v-bind:disabled="i === 1" 
                      v-bind:style="{ backgroundColor: i === 1  ? 'gray' : 'darkblue' }"
                      style="margin-left: 12px; padding-bottom: -5px; border: 1px solid black; color: white">
                <b-icon icon="skip-backward-fill"></b-icon>
            </b-button>

            <b-button v-on:click="$parent.oneStepBackward()" size="sm"
                      v-bind:disabled="i == null || i <= 1" 
                      style="margin-left: 1px; padding-bottom: -5px; border: 1px solid black; color: white"
                      v-bind:style="{ backgroundColor: (i == null || i <= 1) ? 'gray' : 'darkblue' }">
                <b-icon icon="skip-start-fill"></b-icon>
            </b-button>

            <b-button v-on:click="$parent.pause()" size="sm"
                      v-bind:disabled="i === null || i === 1" 
                      v-bind:style="{ backgroundColor: (i == null || i <= 1) ? 'gray' : 'darkblue' }"
                      style="margin-left: 1px; padding-bottom: -5px; border: 1px solid black; color: white">
                <b-icon icon="pause-fill"></b-icon>
            </b-button>

            <b-button v-on:click="$parent.oneStepForward()" size="sm"
                      v-bind:disabled="i === null" 
                      style="margin-left: 1px; padding-bottom: -5px; border: 1px solid black; color: white"
                      v-bind:style="{ backgroundColor: i == null ? 'gray' : 'darkblue' }">
                <b-icon icon="skip-end-fill"></b-icon>
            </b-button>

            <b-button v-on:click="$parent.play()" size="sm"
                      v-bind:disabled="i == null" 
                      style="margin: 0 10px 0 1px; padding-bottom: -5px; border: 1px solid black; color: white"
                      v-bind:style="{ backgroundColor: i == null ? 'gray' : 'darkblue' }">
                <b-icon icon="play-fill"></b-icon>
            </b-button>

            <levels-button v-if="['admin'].includes($store.state.user.role)" v-bind:namespace="namespace" style="margin: 1px;"></levels-button>                            

            <toggle-single-throw v-if="['admin'].includes($store.state.user.role)" size="sm"
                     v-bind:namespace="namespace" v-bind:property="'showBreakpoints'" v-bind:label="'breakpoints'"
                 style="margin: 0px;"></toggle-single-throw>

            <table v-if="i !== null" style="color: darkblue; width: auto; font-size: 1.1rem" border="0">
                <tr>
                    <td style="padding: 0px 3px 0 10px;  width: auto; font-weight: bold; color: black">
                        playback date: 
                    </td>
                    <td style="width: auto; color: blue">
                        {{moment(playbackData.date).format("dddd, MMM DD, YYYY HH:mm")}}
                    </td>
                    <td style="padding: 0px 3px 0 8px;  font-weight: bold; color: black">
                        close: 
                    </td>
                    <td style="color: blue">
                        <span v-if="playbackData.data">{{playbackData.close}}</span> 
                        <span v-if="!playbackData.data" style="color: red">no data</span>     
                    </td>
                </tr>
            </table> 


        </b-form>

        <b-form v-if="showBreakpoints" inline style="border-bottom: 1px solid gray; border-left: 0px solid gray; border-right: 0px solid gray;padding: 3px; background-color: #E8E8E8"> 
            <b-form-row align-h="start" style="border:0px solid gray">
                <b-col align-h="start">  

                    <b-form inline v-for="breakpoint in breakpoints" v-bind:key="breakpoint.date" style="white-space: nowrap">  
                        <b-form-datepicker v-model="breakpoint.date" :min="start" :max="end" style="width: 260px; ; margin: 0 12px 3px 0; border: 1px solid gray;"></b-form-datepicker>

                        <b> title:</b>    <span style="margin: 0px 10px 0 2px;">
                            <b-input style="width: 150px; border:1px solid gray;"
                                      v-model.number="breakpoint.title">
                            </b-input>
                        </span> 

                        <b> message:</b>    <span style="margin: 0px 10px 0 2px;">
                            <b-input style="width: 450px; border:1px solid gray;"
                                      v-model.number="breakpoint.message">
                            </b-input>
                        </span> 

                        <b-button variant="warning" v-on:click="removeBreakpoint(breakpoint.date)" style="margin: 1px; border: 1px solid darkgray">remove</b-button>

                    </b-form>

                    <b-button variant="warning" v-on:click="addBreakpoint()" style="margin: 1px; border: 1px solid darkgray">add breakpoint</b-button>

                </b-col>
            </b-form-row>
        </b-form>
    </div>
</template>

<script>

    import moment from "moment";
    import toggleSingleThrow from '@/components/toggle-single-throw';
    import levelsButton from '@/components/levels-button';
    import {spreadDigits} from "../js/main";

    export default {

        components: {
            toggleSingleThrow, levelsButton
        },
        mounted() {
           // console.log("playback-control.vue starting.");
            //  this.$store.commit(this.namespace + '/playback/setI', null);

            if (this.$store.state[this.namespace].playback.start === null) {
                let start = moment().subtract(8, 'weeks').format('YYYY-MM-DD');
                this.$store.commit(this.namespace + '/playback/setStart', start);
            }
           // console.log("this.$store.state[this.namespace].playback.end=", this.$store.state[this.namespace].playback.end);
            if (this.$store.state[this.namespace].playback.end === null) {
                this.$store.commit(this.namespace + '/playback/setEnd', this.$store.state[this.namespace].chartParameters.mainSeriesEnd);
            }
        },
        props: ['namespace', 'i'],
        data: function () {
            return {
                timer: null,
                intervalOptions: Array(5).fill(null).map((x, i) => ({value: i + 1, text: i + 1})),
                startTime: ''
            }
        },
        methods: {
            moment: function (date) {
                return moment(date);
            },
            hidePlayback() {
                this.$store.commit(this.namespace + '/setShowPlaybackControl', false);
            },
            removeBreakpoint(date) {
                console.log("removeBreakpoint() starting. date=", date);
                let newBreakpoints = this.breakpoints.filter(x => x.date !== date);
                console.log("newBreakpoints=", newBreakpoints);

                this.$store.commit(this.namespace + '/playback/setBreakpoints', newBreakpoints);
            },
            addBreakpoint() {
                console.log("addBreakpoint() starting.");
                console.log("this.breakpoints=", this.breakpoints);

                let emptyBreakpoint = {date: "", title: "", message: ""};
                console.log("emptyBreakpoint=", emptyBreakpoint);

                this.$store.commit(this.namespace + '/playback/addBreakpoint', emptyBreakpoint);
            }
        },
        computed: {
            playbackData() {
                let newData = this.$parent.newData[this.i - 1];
               // console.log("newData=", {...newData}, " this.end=", this.end);
               // console.log("typeof newData=", typeof newData);
                let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                let digits = generalForm.instrument === "future" ? spreadDigits(generalForm.selected[0]) : 2;

                if (typeof newData !== 'undefined') {
                    let obj = JSON.parse(JSON.stringify(newData));
                    obj.date = newData.date;
                    obj.close = typeof newData !== 'undefined' ? parseFloat(newData.close).toFixed(digits) : "";
                    obj.data = typeof newData.close !== 'undefined' ? true : false;
                    return obj;
                } else {
                    return {data: true, date: this.end};
                }
            },
            show: {
                get() {
                    return this.i === 1;
                },
                set() {}
            },
            breakpoints: {
                get() {
                    console.log("this.$store.state[this.namespace].playback=", this.$store.state[this.namespace].playback);
                    console.log("this.$store.state[this.namespace].playback.breakpoints=", this.$store.state[this.namespace].playback.breakpoints);
                    return this.$store.state[this.namespace].playback.breakpoints;
                },
                set(breakpoint) {
                    console.log("breakpoints set(). breakpoint=", breakpoint);
                }
            },
            showBreakpoints() {
                return this.$store.state[this.namespace].showBreakpoints;
            },
            interval: {
                get() {
                    return this.$store.state[this.namespace].playback.interval;
                },
                set(interval) {
                    this.$store.commit(this.namespace + '/playback/setInterval', interval);
                }
            },
            start: {
                get() {
                    return this.$store.state[this.namespace].playback.start;
                },
                set(start) {
                    this.$store.commit(this.namespace + '/playback/setStart', start);
                }
            },
            end: {
                get() {
                    return this.$store.state[this.namespace].playback.end;
                },
                set(end) {
                    this.$store.commit(this.namespace + '/playback/setEnd', end);
                }
            }
        }
    };

</script>