<template>
    <span>
        <b-button :id="'normalization-'+namespace" size="sm"
                  v-bind:style="{backgroundColor: normalization === 'on' ? 'darkgray' : 'black' }"
                  style="color: white; border: 1px solid gray;">
            normalization
        </b-button>

        <b-popover :target="'normalization-'+namespace" :id="'normalization-popup-'+namespace" triggers="click blur" placement="bottom"
            :show.sync="show" style=" background-color: gray;">
            <b-container class="container-fluid" style="font-size: .9rem; font-family: verdana; border:1px solid gray; padding: 0px;
                                                     background-color: whitesmoke; width: fit-content; padding-right: 7px; text-align: right">
                <b-form-row align-h="start" style="border:0px solid gray;  padding: 2px">
                        <b-col style="font-weight: bold; font-size: .9rem;">  
                            <label style="font-weight: bold;">normalization:</label>

                <b-form-select size="sm" style="border:1px solid gray; width: auto; margin-left: 5px"
                               v-model="normalization" v-bind:options="normalizationOptions"></b-form-select>
                  </b-col>
                </b-form-row>

                <b-form-row v-if="$store.state[this.namespace].normalization"
                     align-h="start" style="border: 0px solid gray; padding: 2px">
                        <b-col style="font-weight: bold; font-size: .9rem">  
                            date:
          
                <b-form-select size="sm" style="border:1px solid gray; width: auto; margin-left: 4px"
                               v-model="normalizationMonth" 
                               v-bind:options="normalizationMonthOptions"></b-form-select>

                <b-form-select size="sm" style="border:1px solid gray; width: auto; margin-left: 4px"
                               v-model="normalizationDate" 
                               v-bind:options="normalizationDateOptions"></b-form-select>

               </b-col>
                </b-form-row>
            </b-container>

        </b-popover>

    </span>
</template>

<script>

    function getMonthFromString(mon) {

        let d = Date.parse(mon + "1, 2012");
        if (!isNaN(d)) {
            return new Date(d).getMonth() + 1;
        }
        return -1;
    }

    import moment from 'moment';

    export default {
        mounted: function () {
           // console.log("normalization.vue mounted() starting. this.$data=", this.$data);
        },
        props: ['namespace'],
        data: function () {
            return{
                normalizationOptions: [
                    {value: "off", text: "off"},
                    {value: "on", text: "on"}
                ],
                monthNames: moment.months(),
                shortMonthNames: moment.monthsShort('-MMM-'),
                show: false
            };
        },
        computed: {
            normalizationMonthOptions() {
                return this.monthNames.map((x, i) => ({value: this.monthNames[i], text: this.shortMonthNames[i]}));
            },
            normalizationDateOptions() {
                return  Array(this.daysInMonth).fill(null).map((x, i) => ({value: i + 1, text: i + 1}))
            },
            normalization: {
                get() {
                    return this.$store.state[this.namespace].normalization;
                },
                set(normalization) {
                    console.log("normalization=", normalization);
                    this.$store.commit(this.namespace + '/setNormalization', normalization);
                }
            },
            normalizationMonth: {
                get() {
                    return this.$store.state[this.namespace].normalizationMonth;
                },
                set(normalizationMonth) {
                    console.log("normalizationMonth =", normalizationMonth);
                    this.$store.commit(this.namespace + '/setNormalizationMonth', normalizationMonth);

                    if (this.normalizationDate > this.daysInMonth) {
                        this.$store.commit(this.namespace + '/setNormalizationDate', this.daysInMonth);
                    }
                }
            },
            normalizationDate: {
                get() {
                    return this.$store.state[this.namespace].normalizationDate;
                },
                set(normalizationDate) {
                    console.log("normalizationDate =", normalizationDate);
                    this.$store.commit(this.namespace + '/setNormalizationDate', normalizationDate);
                }
            },
            daysInMonth: function () {
                // console.log("daysInMonth() starting.");
                let monthNumber = getMonthFromString(this.normalizationMonth);
                return new Date(1999, monthNumber, 0).getDate();
            },
            tooltip: function () {
                return 'normalization_tooltip';
            }
        }
    }
</script>
