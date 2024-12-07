<template>
    <span>
        <table inline style="width: auto; border-left: 0px solid gray; border: 0px solid gray;
        padding: 0 0px 0 0px; margin: -2px; background-color: #ffdf00; white-space: nowrap; border-radius: 3px;">
          <tr>
            <td style="margin: 0 1px 0 3px; font-weight: bold" v-bind:style="{color: openColor}">open:</td>
            <td>
                <b-form-datepicker v-model="open" size="sm" class="datetimepicker"
                     :date-format-options="{ year: 'numeric', month: 'short', day: 'numeric' }"
                     :max="maximumOpen" 
                      locale="en"
                      style="border: 1px solid gray; width: fit-content;"
                      v-bind:style="{color: openColor}"></b-form-datepicker>
            </td>
            <td style="padding: 0 0px 0 3px; font-weight: bold" v-bind:style="{color: closeColor}">close:</td>
            <td>
                <b-form-datepicker v-model="close" size="sm" 
                      :date-format-options="{ year: 'numeric', month: 'short', day: 'numeric' }"
                      :min="minimumClose"
                      locale="en"
                      style="border: 1px solid gray; width: auto"
                      v-bind:style="{color: closeColor}"></b-form-datepicker>
            </td>
          </tr>
        </table>

    </span>
</template>

<style scoped>
table { 
   /* border-spacing: 2px;*/
   
    border-collapse: separate;
}
</style>

<script>

    import moment from 'moment';

    export default {
        created() {
       
        },
        mounted() {
           // console.log("open-close-selector.vue starting. this.namespace=", this.namespace);
        },
        props: ['namespace'],
        computed: {
            maximumOpen() {
                let maximumOpen = moment(this.close).subtract(1, 'days').format('YYYY-MM-DD');
               // console.log("maximumOpen=", maximumOpen);
                return maximumOpen;
            },
            minimumClose() {
                let minimumClose = moment(this.open).add(1, 'days').format('YYYY-MM-DD');
               // console.log("minimumClose=", minimumClose);
                return minimumClose;
            },
            open: {
                get() {
                    let open = this.$store.state[this.namespace].open;
                    if(!open.includes('-')){
                        open = moment(open, "YYYYMMDD").format("YYYY-MM-DD");
                    }
                   // console.log("open=", open);
                    return open;
                },
                set(open) {
                    this.$store.commit(this.namespace + '/setOpen', open);
                }
            },
            close: {
                get() {
                    let close = this.$store.state[this.namespace].close;
                    if(!close.includes('-')){
                        close = moment(close, "YYYYMMDD").format("YYYY-MM-DD");
                    }
                   // console.log("close=", close);
                    return close;
                },
                set(close) {
                    console.log("close=", close);
                    this.$store.commit(this.namespace + '/setClose', close);
                }
            },
            openColor(){
                    return this.$store.state[this.namespace].buySell === "buy" ? "green" : "red";
            },
            closeColor(){
                    return this.$store.state[this.namespace].buySell === "buy" ? "red" : "green";
            }
        }
    }
</script>
