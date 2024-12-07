<template>
    <span>
     <!--   <span style="margin-right: 2px; margin-left: 5px; padding-top: 9px; font-weight: bold; color: black"> group:</span>
      -->  <b-form-select size="md" style="border: 1px solid gray; width: auto;"
                       v-model="group" :options="groupOptions"></b-form-select>
    </span>
</template>

<script>

    import {groupsObject} from "../js/main";

    export default {
        mounted: function () {
            // console.log("legs.vue mounted() starting.");
            // console.log("this.namespace=", this.namespace);
        },
        props: ['namespace'],
        computed: {  
            group: {
                get(){
                    let group = this.$store.getters[this.namespace + "/group"];
                    console.log("group=", group);
                    return group;
                },
                set(group){
                    let commodity = groupsObject[group].commodities[0];
                    this.$store.dispatch(this.namespace + '/changeCommodityLeg', {commodity: commodity, index: 0});
                }   
            },    
            groupOptions(){
                return Object.keys(groupsObject);
            }            
        }
    }
</script>
