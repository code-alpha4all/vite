<template>
    <div>
        <H2 style="text-align: center;">Months</H2>
        <b-table :items="monthSpecs" :fields="fields" striped sort-icon-left class="months-table" 
                style="border: 1px solid silver; width: auto; font-size: 12px; margin: 0 0px 0 22px;">

            <template #head()="data">
                <b-row>
                    <b-col class="text-sm-left"><b>{{ data.label }}</b></b-col>
                </b-row>
            </template>


            <template v-slot:cell(symbol)="{value}">
                <b-row>
                    <b-col class="text-sm-center">{{ value }}</b-col>
                </b-row>
            </template>
            
            <template v-slot:cell(name)="{value}">
                <b-row>
                    <b-col class="text-sm-center">{{ value }}</b-col>
                </b-row>
            </template>
          

        </b-table>

    </div>
</template>

<style scoped>
   
   ::v-deep .months-table td{
        color: black;
        padding: 1px 2px 0px 2px;
    }

</style>

<script>

    import {getCommoditiesArray} from '@/js/main';

    export default {
        mounted() {
           // console.log("months-table mounted.");
        },
        data: function () {
            return{
                fields: [
                {key: 'symbol', label: "Code"},
                {key: 'name', label: "Name"},
                ]
            };
        },
        computed: {
            monthSpecs() {
                let specs = getCommoditiesArray().find(x => x.symbol === "CL").months;
               // console.log("specs=", specs);
                return specs;
            }
        }        
    }
</script>