<template>
    <div>
        <H2 style="text-align: center;">Commodity Specifications</H2>
        
        <b-table :items="commoditySpecs" :fields="fields" striped sort-icon-left class="commodity-specs-table"
                 style="border: 1px solid silver; width: auto; font-size: 12px; margin: 0 -80px 0 13px; border-radius: 3px">

            <template #head(name)="data">
               
                            <b-form-input v-model="searchText" placeholder="commodity name" 
                                style="width: 150px; height: 10px; margin: 0px;"></b-form-input>
                     
            </template>

            <template #head()="data">
                <span style="color: black; background-color: white;"><b>{{ data.label }}</b></span>
            </template>


            <template v-slot:cell(symbol)="{value}">
                <b-row>
                    <b-col class="text-sm-center">{{ value }}</b-col>
                </b-row>
            </template>
            
            <template v-slot:cell(new)="{value}">
                <b-row>
                    <b-col class="text-sm-center">{{ value }}</b-col>
                </b-row>
            </template>

            <template v-slot:cell(ib)="{value}">
                <b-row>
                    <b-col class="text-sm-center">{{ value }}</b-col>
                </b-row>
            </template>

            <template v-slot:cell(unitMove)="{value}">
                <b-row>
                    <b-col class="text-sm-right" style="margin: 0 5px 0 -24px;">{{ value }}</b-col>
                </b-row>
            </template>

            <template v-slot:cell(units)="{value}">
                <b-row>
                    <b-col class="text-sm-center">{{ value }}</b-col>
                </b-row>
            </template>

            <template v-slot:cell(tickValue)="{value}">
                <b-row>
                    <b-col class="text-sm-right" style="margin: 0 5px 0 -24px;">{{ value }}</b-col>
                </b-row>
            </template>

            <template v-slot:cell(cot)="{value}">
                <b-row>
                    <b-col class="text-sm-center">{{ value }}</b-col>
                </b-row>
            </template>

        </b-table>

    </div>
</template>

<style scoped>
   
   ::deep(.commodity-specs-table td){
        color: black;
        padding: 1px 2px 0px 2px;
    }

</style>

<script>

    import {getCommoditiesArray, symbolArray, symbolConverter} from '@/js/main';
    const exactMath = require('exact-math');

    export default {
        mounted() {
           // console.log("commodity-specs-table mounted.");
        },
        data: function () {
            return{
                fields: [
                {key: 'name', label: "Name", sortable: true},
                {key: 'symbol', label: "Traditional", sortable: true},
                {key: 'new', label: "Barchart", sortable: true},
                {key: 'ib', label: "Interactive Brokers", sortable: true},
                {key: 'unitMove', label: "Unit Move", sortable: true},
                {key: 'units', label: "Units", sortable: true},
                {key: 'tickValue', label: "Tick Value ($)", sortable: false},
                {key: 'COT', label: "COT", sortable: true},
                {key: 'months', label: "Months", sortable: true},
                ],
                searchText: ""
            };
        },
        computed: {
            commoditySpecs() {
                let commoditiesArray = JSON.parse(JSON.stringify(getCommoditiesArray()));
               // console.log("commoditiesArray=", commoditiesArray);
               // console.log("this.searchText=", this.searchText);
               
               commoditiesArray.forEach(x => {
                    x.new = symbolConverter(x.symbol, "eod", "barchart");
                    x.ib = symbolConverter(x.symbol, "eod", "ib");
                    x.COT = x.COT ? "yes" : "no";
                    x.months = x.months.map(x => x.symbol).join("");
                    let num = exactMath.mul(x.unitMove, symbolArray.find(y => y.eod === x.symbol).tickSize);  //.toFixed(2);
                    let tickValue = num.toFixed(Math.max(2, (num.toString().split('.')[1] || []).length)); // https://stackoverflow.com/questions/20473940/always-display-at-least-two-decimal-places
                    x.tickValue = tickValue;
                });

                if(this.searchText.length > 1){
                    return commoditiesArray.filter(x => {
                        let nameArray = x.name.split(' ').map(x => x.toLowerCase());
                       // console.log("nameArray=", nameArray);
                        return nameArray.some(x => x.startsWith(this.searchText.toLowerCase()));
                    });
                } else {
                    return commoditiesArray.filter(x => {
                        return x.name.toLowerCase().startsWith(this.searchText.toLowerCase());
                    });
                }
            }
        }    
    }
</script>