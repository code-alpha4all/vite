<template>
    <div style="width: fit-content; font-size: 12px; background-color: white; padding: 5px; margin-bottom: 40px">

        <div>users:{{users.length}}</div>
        <div style="margin: 0 0 20px 0">roles:{{roleNumbers}}</div>

      <!--  <div style="margin: 0 0 0px 0">number of active Scarrcharts subscribers:{{activeScarrchartsSubscribers.length}}</div> 

        <div v-for="scarrSubscriberIndex in activeScarrchartsSubscribers.length" 
                    v-bind:key="scarrSubscriberIndex" style="margin: 0 0 0px 0">Scarrcharts subscribers:{{activeScarrchartsSubscribers[scarrSubscriberIndex]}}</div> 

        <div style="margin: 0 0 20px 0">number of active Chartslab subscribers:{{activeChartslabSubscribers.length}}</div>  -->

        <div style="border: 1px solid gray; margin: 0 0 20px 0; height: 400px" id="chartdiv"></div>

        <b-form-select style="border: 1px solid gray; width: auto; margin: 0 0 5px 0"
                       v-model="oldProgram" :options="programOptions" size="sm">
        </b-form-select>

        <table style="min-width: 800px" id="quotes">
            <tr style="border: 1px solid gray;">
                <th style="text-align: center; border: 1px solid gray;">user</th>
                <th style="text-align: center; border: 1px solid gray;">saveName</th>

                <th v-for="parameterIndex in Math.max(parameters.length, 1)" 
                    v-bind:key="parameterIndex"
                    style="text-align: center; border: 1px solid gray;">
            <b-form inline v-on:submit.prevent="" style=" margin: 2px 0 2px 5px;">
                <label class="mr-1">parameter:</label>
                <b-input v-model="parameters[parameterIndex-1]" style="border: 1px solid gray; width: 116px"/>

                <b-button variant="warning" v-on:click="remove(parameterIndex-1)" v-if="parameterIndex < parameters.length+1"
                          style="margin: 1px; margin-left: 8px; border: 1px solid darkgray; border-radius: 3px">remove</b-button>

                <b-button variant="primary" v-on:click="add(parameterIndex-1)" v-if="parameterIndex == parameters.length"
                          style="margin: 1px; margin: 0 3px 0 1px; border: 1px solid darkgray; border-radius: 3px">add</b-button>

                <!--  <span style="margin: 0 3px 0 6px">parameterIndex:{{parameterIndex}}</span>
                  <span style="margin: 0 3px 0 6px">parameters.length:{{parameters.length}}</span>  -->
            </b-form>   
            </th>
            </tr>
            <tr v-for="(value, index) in savedChartsByProgram" 
                v-bind:key="index" @click="click(index)"
                style="white-space: nowrap;"  v-bind:style="{ backgroundColor: index === savedChartIndex ? 'silver' : 'white' }">  
                <td style="border: 1px solid gray; vertical-align: top; padding: 0 5px 0 5px">{{savedChartsByProgram[index].user}}</td>
                <td v-bind:style="{color: tickerColor[index]}" style="border: 1px solid gray; padding: 0 2px 0 5px" class="linkable" @click="getChart(index)" @mouseover="mouseOver(index)">
                    <a>{{savedChartsByProgram[index].generalForm.saveName}}</a>
                </td>
                <td v-for="parameterIndex in Math.max(parameters.length, 1)" 
                    v-bind:key="parameterIndex"
                    style="border: 1px solid gray; vertical-align: top; padding: 0 2px 0 5px">
                    {{savedChartsByProgram[index].generalForm[parameters[parameterIndex-1]]}}
                </td>     
            </tr>
        </table>   

    </div>
</template>

<style scoped>
    #quotes {
        font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
        border-collapse: collapse;
        width: 100%;
    }

    #quotes td, #quotes th {
        border: 1px solid #ddd;
        padding-right: 5px;
        padding-left: 5px;
    }

    #quotes tr:nth-child(even){
        background-color: #f2f2f2;
    }

    #quotes tr:hover {
        background-color: #ddd;
    }

    #quotes th {
        padding-top: 4px;
        padding-bottom: 4px;
        text-align: left;
        background-color: rgb(153, 5, 5);
        color: white;
    }
</style>

<script>

    import * as fb from '@/firebase';
    // import { JSONView } from 'vue-json-component';
    import {programCompositionArray} from "@/js/main";
    import * as am4core from "@amcharts/amcharts4/core";
    import * as am4charts from "@amcharts/amcharts4/charts";

    export default {
        // components: {'json-view': JSONView},
        mounted() {
            // console.log("firestore-search-output.vue mounted() starting.");
            this.getUsers();
            this.getSavedTabs();

        },
        props: ['namespace'],
        data: function () {
            return {
                users: [],
                roleNumbers: [],
                savedCharts: [],
                savedChartsByProgramArray: [],
                oldProgram: "all",
                tickerColor: [],
                parameters: ['program'],
                savedChartIndex: 0
            }
        },
        computed: {
            programOptions() {
                let options = programCompositionArray("subscriber");
                options.unshift({value: "all", text: "all programs"});
                options.unshift({value: "BasicCharts", text: "Old Futures Charts"});
                // console.log("options=", options);
                if (this.oldProgram === null) {
                    options.unshift({value: null, text: "Select Program"});
                }console.log("options=", options);
                return options;
            },
            savedChartsByProgram() {
                let temp;
                if (this.oldProgram !== "all") {
                    temp = this.savedChartsByProgramArray.find(x => x.program === this.oldProgram);
                    //console.log("temp=", temp);
                    return typeof temp === 'undefined' ? null : temp.charts;
                } else {
                    temp = this.savedChartsByProgramArray.map(x => x.charts).flat();
                    console.log("temp=", temp);
                    return typeof temp === 'undefined' ? null : temp;
                }
            },
            /*  programNumbers(){
             return this.savedChartsByProgramArray.map()
             }*/
            subscribers() {
                return this.users.filter(x => x.role === 'subscriber');
            },
            subscribersWithSubscriptions() {
                console.log("subscribersWithSubscriptions() starting. this.subscribers=", this.subscribers);
                let subscribersWithSubscriptions = this.subscribers.filter(x => {
                   // console.log("x=", JSON.parse(JSON.stringify(x)));
                    let subscriptions = null;
                    if (typeof x.subscriptions !== 'undefined') {
                        subscriptions = x.subscriptions;
                    }
                   // console.log("subscriptions=", JSON.parse(JSON.stringify(subscriptions)));
                    return subscriptions !== null && subscriptions.length > 0;
                })
                console.log("subscribersWithSubscriptions=", JSON.parse(JSON.stringify(subscribersWithSubscriptions)));
                console.log("subscribersWithSubscriptions.length=", subscribersWithSubscriptions.length);
                return subscribersWithSubscriptions;
            },
            activeScarrchartsSubscribers() {
                let subscribers = this.subscribersWithSubscriptions.filter(x => {
                    let subscriptionNames = x.subscriptions.map(y => y.name);
                    let containsScarrcharts = subscriptionNames.includes('scarrcharts');
                    let hasActiveSub = this.checkScarrchartsSubscriptions(x);
                    return containsScarrcharts && hasActiveSub;
                });
                let users = subscribers.map(x => x.email);
                return users;
            },
            activeChartslabSubscribers() {
                let subscribers = this.subscribersWithSubscriptions.filter(x => {
                    let subscriptionNames = x.subscriptions.map(y => y.name);
                    let containsChartslab = subscriptionNames.includes('chartslab');
                    let hasActiveSub = this.checkChartslabSubscriptions(x);
                    return containsChartslab && hasActiveSub;
                });
                let users = subscribers.map(x => x.email);
                return users;
            }
        },
        methods: {
            checkScarrchartsSubscriptions(user) {
                if ("subscriber" == user.role) {
                    // Check Subscription
                    var hasActiveSub = false;
                    var subs = user.subscriptions;
                    if (subs != undefined) {
                        subs.forEach((el) => {
                            let subData = el.data;
                            if (el.name == "scarrcharts") {
                                subData.forEach((el2) => {
                                    let expirationDate = new Date(el2.expDate.seconds * 1000);
                                    expirationDate.setDate(expirationDate.getDate() + 1);
                                    let today = new Date();
                                    if (!hasActiveSub && expirationDate >= today) {
                                        hasActiveSub = true;
                                    }
                                });
                            }
                        });
                    }
                }
                return hasActiveSub;
            },
            checkChartslabSubscriptions(user) {
                if ("subscriber" == user.role) {
                    // Check Subscription
                    var hasActiveSub = false;
                    var subs = user.subscriptions;
                    if (subs != undefined) {
                        subs.forEach((el) => {
                            let subData = el.data;
                            if (el.name == "chartslab") {
                                subData.forEach((el2) => {
                                    let expirationDate = new Date(el2.expDate.seconds * 1000);
                                    expirationDate.setDate(expirationDate.getDate() + 1);
                                    let today = new Date();
                                    if (!hasActiveSub && expirationDate >= today) {
                                        hasActiveSub = true;
                                    }
                                });
                            }
                        });
                    }
                }
                return hasActiveSub;
            },
            add(index) {
                console.log("add() starting. index=", index);
                this.parameters.push("");
            },
            remove(index) {
                console.log("remove() starting. index=", index);
                this.parameters.splice(index, 1);
                console.log("this.parameters=", JSON.parse(JSON.stringify(this.parameters)));
            },
            mouseOver(index) {
                // console.log("mouseOver() starting. index=", index);
                let arr = Array(this.numberOfTrades).fill(null).map(() => "darkblue");
                arr[index] = "red";
                this.tickerColor = arr;
            },
            getChart(index) {
                console.log("getChart() starting. index=", index);
                this.savedChartIndex = index;
                //  this.mouseClicked(index);
                /*  let ticker = element.target.textContent;
                 console.log("element=", element);
                 console.log("ticker=", ticker);*/

                let generalForm = this.savedChartsByProgram[index].generalForm;

                console.log("generalForm=", JSON.parse(JSON.stringify(generalForm)));

               // this.$store.commit("user/setInitializingState", generalForm);
                this.$store.dispatch('newTabWithInitialState', generalForm);

            },
            getSavedTabs() {
                console.log("getSavedTabs() starting.");
                this.$store.commit("incrementNumberOfAjaxCalls");

                let programOptionsValues = this.programOptions.map(x => x.value);
                console.log("programOptionsValues=", programOptionsValues);

                let filteredProgramOptions = programOptionsValues.filter(x => !["ForwardCurves", "all", "Quotes"].includes(x)).sort(); // Firebase has a max limit of 10 (https://www.google.com/search?q=%22FirebaseError%3A+%5Bcode%3Dinvalid-argument%5D%3A+Invalid+Query.+%27in%27+filters+support+a+maximum+of+10+elements+in+the+value+array.&oq=%22FirebaseError%3A+%5Bcode%3Dinvalid-argument%5D%3A+Invalid+Query.+%27in%27+filters+support+a+maximum+of+10+elements+in+the+value+array.&gs_lcrp=EgZjaHJvbWUyBggAEEUYOdIBCDEyMjBqMGo3qAIAsAIA&sourceid=chrome&ie=UTF-8).
                console.log("filteredProgramOptions=", filteredProgramOptions);
                fb.db.collectionGroup('charts')/*.where('program', 'in', filteredProgramOptions)*/.get()
                        .then(querySnapshot => {
                            let charts = [];
                            querySnapshot.forEach((doc) => {
                                // doc.data() is never undefined for query doc snapshots
                                //  console.log(doc.ref.parent.parent.id, " : " + doc.id, " => ", doc.data());
                                charts.push({user: doc.ref.parent.parent.id, generalForm: doc.data()});
                            })
                            // console.log("charts=", charts);                           
                            this.savedCharts = charts.sort((a, b) => (a.user > b.user) ? 1 : -1);
                            // console.log("this.savedCharts=", this.savedCharts.map(x => x.user));         

                            this.savedChartsByProgramArray = filteredProgramOptions.map(program => {
                                // console.log("program=", program);
                                let filtered = this.savedCharts.filter(x => x.generalForm.program === program);
                                // console.log("filtered=", JSON.parse(JSON.stringify(filtered)));
                                // console.log("filtered.map(x => x.generalForm.program)=", JSON.parse(JSON.stringify(filtered)).map(x => x.generalForm.program));
                                return {program: program, charts: filtered};
                            });

                            this.tickerColor = Array(this.savedChartsByProgramArray.length).fill(null).map(() => "darkblue");


                            this.programNumbers = filteredProgramOptions.map(program => {
                                // console.log("program=", program);
                                let filtered = this.savedCharts.filter(x => x.generalForm.program === program);
                                // console.log("filtered=", JSON.parse(JSON.stringify(filtered)));
                                // console.log("filtered.map(x => x.generalForm.program)=", JSON.parse(JSON.stringify(filtered)).map(x => x.generalForm.program));
                                let number = filtered.length;
                                return {[program]: number};
                            });
                            // console.log("this.programNumbers=", JSON.parse(JSON.stringify(this.programNumbers)));

                            this.makeProgramChart();
                            this.$store.commit("decrementNumberOfAjaxCalls");
                        }).catch((error) => {
                    // The document probably doesn't exist.
                    console.error("Error getting document: ", error);
                    this.$store.commit("decrementNumberOfAjaxCalls");
                });
            },
            makeProgramChart() {
                let chartData = [];
                this.programNumbers.forEach(function (obj) {
                    // console.log(JSON.parse(JSON.stringify(obj)));

                    chartData.push({"program": Object.keys(obj)[0],
                        "count": Object.values(obj)[0]});
                });
                let sortedChartData = chartData/*.sort(function (a, b) {
                 let a = a.program;
                 let b = b.program;
                 return ((a < b) ? 1 : ((a > b) ? -1 : 0));
                 });
                 console.log("sortedChartData=", sortedChartData); */

                //  am4core.useTheme(am4themes_animated);

                am4core.addLicense("CH208485191");

                am4core.createFromConfig({
                    data: sortedChartData,
                    yAxes: [{
                            type: "CategoryAxis",
                            renderer: {
                                minGridDistance: 20,
                                minWidth: 120,
                                labels: {
                                    wrap: true,
                                    truncate: true
                                },
                                grid: {
                                    strokeWidth: 4,
                                    disabled: true
                                }
                            },
                            dataFields: {
                                category: "program",
                                title: {
                                    text: "Program Usage"
                                }
                            }
                        }],
                    xAxes: [{
                            type: "ValueAxis",
                            title: {
                                text: "number of saved tabs"
                            }
                        }],
                    series: [{
                            type: "ColumnSeries",
                            dataFields: {
                                valueX: "count",
                                categoryY: "program"
                            },
                            columns: {
                                tooltipText: "\nProgram: {categoryY}\nViews: {valueX}",
                                stroke: "#ff0000",
                                fill: "#00ff00"
                            }
                        }]
                }, "chartdiv", am4charts.XYChart);
            },
            getUsers() {
                console.log("getUsers() starting.");
                this.$store.commit("incrementNumberOfAjaxCalls");
                fb.usersCollection.get()
                        .then(querySnapshot => {
                            this.users = querySnapshot.docs.map(doc => doc.data());
                            console.log("this.users=", JSON.parse(JSON.stringify(this.users)));
                            this.loadRoleNumbers();
                            this.$store.commit("decrementNumberOfAjaxCalls");

                        }).catch((error) => {
                    // The document probably doesn't exist.
                    console.error("Error getting document: ", error);
                    this.$store.commit("decrementNumberOfAjaxCalls");
                });
            },
            loadRoleNumbers() {
                let uniqueRoles = [...new Set(this.users.map(x => x.role))];
                // console.log("uniqueRoles=", uniqueRoles);
                this.roleNumbers = uniqueRoles.map(role => {
                    return {[role]: this.users.filter(x => x.role === role).length};
                });
                // console.log("this.roleNumbers=", this.roleNumbers);
            },
            click(index) {
                console.log("click() starting. index=", index);
                let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));

                let newState = JSON.parse(JSON.stringify(this.savedChartsByProgram[index].generalForm));
                //  newState.oldProgram = newState.program;
                newState.program = "FirestoreSearch";
                newState.moduleName = generalForm.moduleName;
                newState.tabTitle = "firestore search";
                console.log("newState=", JSON.parse(JSON.stringify(newState)));
                this.$store.commit(this.namespace + '/setGeneralForm', newState);

                this.savedChartIndex = index;
            }
        }
    };

</script>
