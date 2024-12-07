<template>
        
         <table inline style="width: auto; margin: 1px 0px -1px 0px;  border:0px solid gray; padding: 0 0px 0 3px; 
                 white-space: nowrap; border-radius: 3px;">
          <tr>
            <td style="padding: 3px 0px 0 0px; font-weight: bold; text-align: right" v-bind:style="{color: openColor}">open:</td>
            <td>
                <b-form-select style="border-left:1px solid gray; border-top:1px solid gray; border-bottom:1px solid gray; 
                            width: auto; border-top-right-radius: 0px; border-bottom-right-radius: 0px;"
                       v-model="openMonth" :options="monthOptions" v-bind:style="{color: openColor}"
                       size="sm"></b-form-select>
           
                <b-form-select style="border-right:1px solid gray; border-top:1px solid gray; border-bottom:1px solid gray;
                            width: auto; border-top-left-radius: 0px; border-bottom-left-radius: 0px; text-align: right"
                       v-model="openDate" :options="openDateOptions" v-bind:style="{color: openColor}"
                       size="sm"></b-form-select>
            </td>
        
            <td style="padding: 3px 0px 0 6px; font-weight: bold; text-align: right" v-bind:style="{color: closeColor}">close:</td>
            <td>
                 <b-form-select style="border-left:1px solid gray; border-top:1px solid gray; border-bottom:1px solid gray; 
                            width: auto; border-top-right-radius: 0px; border-bottom-right-radius: 0px" 
                       v-model="closeMonth" :options="monthOptions" v-bind:style="{color: closeColor}"
                       size="sm"></b-form-select>
           
                <b-form-select style="border-right:1px solid gray; border-top:1px solid gray; border-bottom:1px solid gray;
                            width: auto; border-top-left-radius: 0px; border-bottom-left-radius: 0px; text-align: right"
                       v-model="closeDate" :options="closeDateOptions" v-bind:style="{color: closeColor}"
                       size="sm"></b-form-select>
            </td>
          </tr>
        </table>

</template>

<script>

    import moment from "moment";

    export default {
       /* created() {
            if (this.open === "") {
                let today = moment().format("YYYY-MM-DD");
                console.log("today=", today);
                this.open = today;
            }
            console.log("this.close=", this.close);
            if (this.close === "") {
                this.close = moment().add(1, 'months').format("YYYY-MM-DD");
            }
        },*/
        mounted() {
           console.log("open-close-selector-no-year.vue starting. this.namespace=", this.namespace);
        },
        props: ['namespace'],
        data() {
            return {
                monthOptions: moment.monthsShort().map(x => ({value: moment(x, 'MMM').format('MMMM'), text: x}))
            };
        },
        computed: {
            open: {
                get() {
                    // let open = moment(this.$store.state[this.namespace].open);
                    return this.$store.state[this.namespace].open;
                },
                set(open) {
                    this.$store.commit(this.namespace + '/setOpen', open);
                }
            },
            close: {
                get() {
                    return this.$store.state[this.namespace].close;
                },
                set(close) {
                    console.log("close=", close);
                    this.$store.commit(this.namespace + '/setClose', close);
                }
            },
            openMonth: {
                get() {
                    return this.$store.getters[this.namespace + '/openMonth'];
                },
                set(openMonth) {
                  console.log("set() openMonth=", openMonth, " this.close=", this.close);
                  let monthNumber = moment().month(openMonth).format("MM");
                  console.log("monthNumber=", monthNumber);

                  let year = moment(this.open).format("YYYY");
                  let date = moment(this.open).format("D");
                  let newDate = moment().set('year', year).set('month', monthNumber - 1).set('date', date);
                  console.log("newDate=", newDate.format("YYYY-MM-DD"));

                  if(newDate.isAfter(moment(this.close))){
                    newDate.subtract(1, 'years');
                    console.log("newDate=", newDate.format("YYYY-MM-DD"));
                  }

                  this.$store.commit(this.namespace + '/setOpen', newDate.format("YYYY-MM-DD"));
                }
            },
            openDate: {
                get() {
                    return this.$store.getters[this.namespace + '/openDate'];
                },
                set(openDate) {
                  console.log("set() openDate=", openDate);
                  let year = moment(this.open).format("YYYY");
                  let month = moment(this.open).format("MM");
                  let newDate = moment().set('year', year).set('month', month - 1).set('date', openDate);
                  console.log("newDate=", newDate.format("YYYY-MM-DD"));

                  this.$store.commit(this.namespace + '/setOpen', newDate.format("YYYY-MM-DD"));                }
            },
            openDateOptions(){
                let daysInMonth;
                console.log("this.openMonth=", this.openMonth);
                if(this.openMonth !== "February"){
                    daysInMonth = moment(this.openMonth, 'MMMM YYYY').daysInMonth(); 
                } else {
                    daysInMonth = 28;                        
                }
                return this.openMonth === "Invalid date" ? null : Array(daysInMonth).fill(null).map((x, i) => ({value: i + 1, text: i + 1}));  
            },
            closeMonth: {
                get() {
                    return this.$store.getters[this.namespace + '/closeMonth'];
                },
                set(closeMonth) {
                  console.log("set() closeMonth=", closeMonth, " this.open=", this.open);
                  let monthNumber = moment().month(closeMonth).format("MM");
                  console.log("monthNumber=", monthNumber);

                  let year = moment(this.close).format("YYYY");
                  let date = moment(this.close).format("D");
                  let newDate = moment().set('year', year).set('month', monthNumber - 1).set('date', date);
                  console.log("newDate=", newDate.format("YYYY-MM-DD"));

                  this.$store.commit(this.namespace + '/setClose', newDate.format("YYYY-MM-DD"));
                }
            },
            closeDate: {
                get() {
                    return this.$store.getters[this.namespace + '/closeDate'];
                },
                set(closeDate) {
                  let year = moment(this.close).format("YYYY");
                  let month = moment(this.close).format("MM");
                  let newDate = moment().set('year', year).set('month', month - 1).set('date', closeDate);
                  console.log("newDate=", newDate.format("YYYY-MM-DD"));

                  this.$store.commit(this.namespace + '/setClose', newDate.format("YYYY-MM-DD"));
                }
            },
            closeDateOptions(){
                let daysInMonth;
               // console.log("this.closeMonth=", this.closeMonth);
                if(this.closeMonth !== "February"){
                    daysInMonth = moment(this.closeMonth, 'MMMM YYYY').daysInMonth(); 
                } else {
                    daysInMonth = 28;                        
                }
                return this.closeMonth === "Invalid date" ? null : Array(daysInMonth).fill(null).map((x, i) => ({value: i + 1, text: i + 1}));  
            },
            openColor(){
                    return this.$store.state[this.namespace].buySell === "buy" ? "green" : "red";
            },
            closeColor(){
                    return this.$store.state[this.namespace].buySell === "buy" ? "red" : "green";
            }
        },
         watch: {
            openMonth: function (openMonth) {
                console.log("watch: openMonth=", openMonth);
                if(!this.openDateOptions.map(x => x.value).includes(this.openDate)){
                  //  this.$store.commit(this.namespace + '/setOpenDate', 1);
                }            
            },
            closeMonth: function (closeMonth) {
                console.log("watch: closeMonth=", closeMonth);
                if(!this.closeDateOptions.map(x => x.value).includes(this.closeDate)){
                   // this.$store.commit(this.namespace + '/setCloseDate', 1);
                }            
            }
         }
    }
</script>
