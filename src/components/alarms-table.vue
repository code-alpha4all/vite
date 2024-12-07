<template>
    <div>
        <H2 style="text-align: left;">Alarms <span style="color: red; padding: 0 0 0 5px; font-size: 2rem;">(in beta)</span></H2>
        

        <b-table :items="alarms" :fields="fields" sort-icon-right v-bind:foot-clone="footCloneParameter" no-footer-sorting	
                 class="alarms-table" style="border: 1px solid silver; width: auto;" :tbody-tr-class="rowClass">

            <template #head(portfolioId)="data">
                <b-row>
                    <b-col class="text-sm-left"><b>{{ data.label }}</b></b-col>
                </b-row>
            </template>

            <template #head(id)="data">
                <b-row>
                    <b-col class="text-sm-left"><b>{{ data.label }}</b></b-col>
                </b-row>
            </template>

            <template #head(ruleTarget)="data">
                <b-row>
                    <b-col class="text-sm-left"><b>{{ data.label }}</b></b-col>
                </b-row>
            </template>

            <template #head(ruleComparator)="data">
                <b-row>
                    <b-col class="text-sm-left"><b>{{ data.label }}</b></b-col>
                </b-row>
            </template>

            <template #head(value)="data">
                <b-row>
                    <b-col class="text-sm-left"><b>{{ data.label }}</b></b-col>
                </b-row>
            </template>

            <template #head(creationDate)="data">
                <b-row>
                    <b-col class="text-sm-left"><b>{{ data.label }}</b></b-col>
                </b-row>
            </template>

            <template #head(notificationDate)="data">
                <b-row>
                    <b-col class="text-sm-left"><b>{{ data.label }}</b></b-col>
                </b-row>
            </template>

            <template #head(status)="data">
                <b-row>
                    <b-col class="text-sm-left"><b>{{ data.label }}</b></b-col>
                </b-row>
            </template>

            <template #head(actions)="data">
                <b-row>
                    <b-col class="text-sm-right"><b>{{ data.label }}</b></b-col>
                </b-row>
            </template>



            <template v-slot:cell(ruleTarget)="{value, item, field}">
                <b-row class="mb-2">
                    <b-col class="text-sm-left">
                        <b-form-select v-if="alarmRow && alarmRow.id === item.id" size="sm"
                            style="border: 1px solid gray; width: auto; border-radius: 3px; margin: -7px 0 -5px -3px"
                            v-model="item.ruleTarget" :options="ruleTargetOptions">
                        </b-form-select>
                        <template v-else>
                            <b-col class="text-sm-left" style="margin: 0 0 0 -12px">{{ value }}</b-col>
                        </template>
                    </b-col>
                </b-row>
            </template>

            <template v-slot:cell(ruleComparator)="{value, item, field}">
                <b-row class="mb-2">
                    <b-col class="text-sm-left">
                        <b-form-select v-if="alarmRow && alarmRow.id === item.id" size="sm"
                            style="border: 1px solid gray; width: auto; border-radius: 3px; margin: -7px 0 -5px -10px"
                            v-model="item.ruleComparator" :options="ruleComparatorOptions">
                        </b-form-select>
                        <template v-else>
                            <b-col class="text-sm-left" style="margin: 0 0 0 -12px; white-space: nowrap;">{{ value }}</b-col>
                        </template>
                    </b-col>
                </b-row>
            </template>

            <template v-slot:cell(value)="{value, item, field}">
                <b-row class="mb-2">
                    <b-col class="text-sm-left">
                        <b-input v-if="alarmRow && alarmRow.id === item.id" 
                                 style="width: 70px; border: 1px solid gray; text-align: right; border-radius: 3px; margin: -6px 0 -5px -10px"
                                 size="sm"
                                 v-model.number="item.value">
                        </b-input>
                        <template v-else>
                            <b-col class="text-sm-left" style="margin: 0 0 0 -12px">{{ value }}</b-col>
                        </template>
                    </b-col>
                </b-row>
            </template>

            <template v-slot:cell(creationDate)="{value}">
                <b-row class="mb-2">
                    <b-col class="text-sm-left">{{ value }}</b-col>
                </b-row>
            </template>

            <template v-slot:cell(notificationDate)="{value}">
                <b-row class="mb-2">
                    <b-col class="text-sm-left">{{ value }}</b-col>
                </b-row>
            </template>

            <template v-slot:cell(status)="{item, value}">
                <b-row class="mb-2">
                    <b-col class="text-sm-left">
                        <span :id="'portfolio-alarms-status-'+item.id">
                            {{ value }}
                        </span>
                    </b-col>
                </b-row>
            </template>

            <template v-slot:cell(actions)="{ item }">
                <b-button-group v-if="alarmRow && alarmRow.id === item.id" style="margin: -7px 0 0 0">
                    <b-button size="sm" variant="success" @click="saveEdit(item)">
                        Save
                    </b-button>
                    <b-button size="sm" variant="danger" @click="resetEdit">
                        Cancel
                    </b-button>
                </b-button-group>

                <span v-else > 

                    <span @click="editAlarm(item)" :id="'portfolio-alarms-edit-'+item.id"> 
                        <Icon style="color: #404040; margin: -4px 4px 0px 0px; cursor: pointer;" icon="material-symbols:edit-document-outline-rounded" 
                              width="27" height="27" v-b-tooltip.noninteractive.hover.topleft="'edit'"/>
                    </span> 

                    <!-- <span @click="duplicateAlarm(item)"> 
                           <Icon style="color: black; margin: -4px 4px 0px 0px; cursor: pointer;" icon="ion:duplicate-outline" width="25" height="25"
                                 v-b-tooltip.noninteractive.hover.topleft="'duplicate row'"  />
                       </span> -->

                    <span @click="removeAlarm(item)" :id="'portfolio-alarms-delete-'+item.id">
                        <Icon style="margin: -4px 4px 0px 0px; cursor: pointer;" icon="ion:trash-outline" width="25" height="25"
                              v-b-tooltip.noninteractive.hover.topleft="'delete'"  />
                    </span>

                </span> 
            </template>


            <template #foot()="data">
                <span style="color: black; background-color: white;" ></span>
            </template>

            <template v-slot:foot(ruleTarget)="data">
                <b-row class="mb-2">
                    <b-col class="text-sm-left" style="font-weight: normal;">
                        <span id="portfolio-alarms-ruleTarget-selector">
                            <b-form-select size="sm" style="border: 1px solid gray; width: auto; border-radius: 3px; margin: 0px 0 -6px -6px"
                                       v-model="newAlarm.ruleTarget" :options="ruleTargetOptions">
                            </b-form-select> 
                        </span>
                    </b-col>
                </b-row>
            </template>

            <template v-slot:foot(ruleComparator)="data">
                <b-row>
                    <b-col class="text-sm-left" style="font-weight: normal;">
                        <span id="portfolio-alarms-ruleComparator-selector">
                            <b-form-select size="sm" style="border: 1px solid gray; width: auto; border-radius: 3px; margin: 0px 0 0 -13px"
                                       v-model="newAlarm.ruleComparator" :options="ruleComparatorOptions">
                            </b-form-select> 
                        </span>
                    </b-col>
                </b-row>
            </template>

            <template v-slot:foot(value)="data">
                <b-row>
                    <b-col class="text-sm-left" style="font-weight: normal;">
                        <span id="portfolio-alarms-ruleValue">
                        <b-input style="width: 70px; border: 1px solid gray; text-align: right; border-radius: 3px; margin: 0px 0px 0 -13px"
                                 size="sm"
                                 autocomplete="off"
                                 v-model.number="newAlarm.value">
                        </b-input>
                        </span>
                    </b-col>
                </b-row>
            </template>

            <template v-slot:foot(creationDate)="data">
                <b-row>
                    <b-col class="text-sm-left" style="font-weight: normal; margin: 6px 0 0 -4px">{{newAlarm.creationDate}}</b-col>
                </b-row>
            </template>

            <template v-slot:foot(status)="data">
                <div style="font-weight: normal; margin: 6px 0px 0 -4px">{{newAlarm.status}}</div>
            </template>

            <template #foot(actions)="data">
                <b-button-group style="margin: 0px 0 0 0">
                    <span id="portfolio-alarms-add-alarm">
                        <b-button size="sm" variant="success" @click="addAlarm()">
                        Add Alarm
                    </b-button>
                    </span>
                </b-button-group>
            </template>   

        </b-table>

    </div>
</template>

<script>

    import * as fb from "@/firebase";
    import { Icon } from '@iconify/vue2';
    import moment from 'moment';

    export default {
        components: {
            Icon
        },
        mounted() {
           // console.log("alarms-table mounted. this.alarms=", this.alarms);
        },
        props: ['alarms', 'portfolioId', 'ticker', 'item'],
        data: function () {
            return{
                newAlarm: {portfolioId: this.portfolioId, ruleTarget: 'When market price is', ruleComparator: 'above', value: null,
                    creationDate: moment().format("MMM D, YYYY"), status: "not triggered"},
                footCloneParameter: 'foot-clone',
                alarmRow: null,
                fields: [
                  //  {key: 'portfolioId', label: "portfolioId"},
                  //  {key: 'id', label: "id"},
                    {key: 'ruleTarget', label: "rule target", sortable: false},
                    {key: 'ruleComparator', label: "comparison", sortable: false},
                    {key: 'value', label: "value", sortable: false},
                    {key: 'creationDate', label: "creation date", sortable: true},
                    {key: 'notificationDate', label: "triggered date", sortable: true},
                    {key: 'status', label: "status", sortable: false},
                    {key: 'actions', label: 'actions'},
                ],
                ruleComparatorOptions: [
                    {text: 'above', value: 'above'},
                    {text: 'at or above', value: 'at or above'},
                    {text: 'below', value: 'below'},
                    {text: 'at or below', value: 'at or below'}
                ],
                ruleTargetOptions: [
                    {text: 'When market price is', value: 'When market price is'},
                    {text: 'When rsi is', value: 'When rsi is'}
                ]
            };
        },
        computed: {
            email() {
                return this.$store.state.user.email;
            },
            uid() {
                return this.$store.state.user.uid;
            }
        },
        watch: {
            /* alarms(alarms){
             console.log("watching alarms=", JSON.parse(JSON.stringify(alarms)));
             }*/
        },
        methods: {
            rowClass(item, type) {
               // console.log("item=", item);
                // console.log("type=", type);
                if (!item || type !== 'row')
                    return;
                if (item.status === 'triggered')
                    return 'table-danger';
                if (item.status === 'notified')
                    return 'table-warning';
            },
            removeAlarm(alarm) {
                // console.log("removeAlarm() starting. alarm=", JSON.parse(JSON.stringify(alarm)));
                fb.database.ref('alarms/' + this.uid + '/' + this.portfolioId + '/' + alarm.id).remove();
            },
            addAlarm(alarm) {
                // console.log("addAlarm() starting. this.newAlarm=", JSON.parse(JSON.stringify(this.newAlarm)));
                // console.log("alarm=", alarm);
                if (typeof alarm !== 'undefined') {
                    console.log("AAAAAAAAAAAAAAAAAAAAAAA");
                    this.newAlarm = alarm;
                }
                let alarms = this.alarms;
                console.log("alarms=", alarms);

                let idArray = alarms === null || alarms == undefined ? [] : alarms.map(x => x.id);
                console.log("idArray=", idArray);
                let maxId = idArray.length === 0 ? -1 : Math.max(...this.alarms.map(x => x.id));
                // console.log("maxId=", maxId);
                maxId = isNaN(maxId) ? 1 : maxId + 1;
                // console.log("maxId=", maxId);
                this.newAlarm.id = maxId;
                this.newAlarm.portfolioId = this.portfolioId;
                this.newAlarm.ticker = this.ticker;
               // this.newAlarm.uid = this.uid;
                console.log("this.newAlarm=", this.newAlarm);

                //let nameObj = {name: $store.state.user.name};
                fb.database.ref('alarms/' + this.uid + '/name').set(this.$store.state.user.name);
                fb.database.ref('alarms/' + this.uid + '/email').set(this.$store.state.user.email);
                fb.database.ref('alarms/' + this.uid + '/' + this.portfolioId + '/' + this.newAlarm.id).set(this.newAlarm);
            },
            duplicateAlarm(alarm) {
                console.log("duplicateAlarm() starting. alarm=", JSON.parse(JSON.stringify(alarm)));
                this.addAlarm(alarm);
            },
            editAlarm(alarm) {
                console.log("editAlarm() starting. alarm=", JSON.parse(JSON.stringify(alarm)));
                let doEdit = true;
                // console.log("this.alarmRow=", this.alarmRow);
                if (this.alarmRow && !confirm("You have unsaved changes, are you sure you want to continue?")) {
                    doEdit = false;
                }

                if (doEdit) {
                    this.$parent.$parent.$parent.$parent.$parent.getStrategies();
                    this.alarmRow = {...alarm};
                }

                //  this.footCloneParameter = null;
            },
            resetEdit() {
                console.log("resetEdit() starting.");
                this.alarmRow = null;
                this.footCloneParameter = "foot-clone";
                this.$parent.$parent.$parent.$parent.$parent.getAlarms();
            },
            saveEdit(row) {
                console.log("saveEdit() starting. row=", row);
                console.log("this.alarmRow=", this.alarmRow);
                row.status = "not triggered";
                row.creationDate = moment().format("MMM D, YYYY");
                // let newStrategy = JSON.parse(JSON.stringify(this.alarms));
                // this.$parent.$parent.$parent.$parent.$parent.updateStrategies(newStrategy);
                fb.database.ref('alarms/' + this.uid + '/' + this.portfolioId + '/' + row.id).set(row);

                this.resetEdit();
            }
        }
    }
</script>