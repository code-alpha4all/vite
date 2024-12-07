<template>
    <span>
        <b-form-select style="border:1px solid gray; width: auto;"
                       v-model="month" :options="monthOptions"
                       size="sm"></b-form-select>

                       <b-form-select style="border:1px solid gray; width: auto;"
                       v-model="date" :options="dateOptions"
                       size="sm"></b-form-select>
    </span>
</template>

<script>

    import moment from "moment";

    export default {
        mounted: function () {
            console.log("month-data-selector.vue mounted() starting.");
        },
        props: {
            month: {
                type: String,
                default: "Jan"
            },
            date: {
                type: Number,
                default: 1
            }
        },
        data() {
            return {
                monthOptions: moment.monthsShort()
            };
        },
        computed: {
                dateOptions(){
                    let daysInMonth;
                    if(this.month !== "Feb"){
                        daysInMonth = moment(this.month, 'MMMM YYYY').daysInMonth(); 
                    } else {
                        daysInMonth = 28;                        
                    }
                    return Array(daysInMonth).fill(null).map((x, i) => ({value: i + 1, text: i + 1}));  
                }
        }
    }
</script>
