<template>
    <div>

    <div style="font-weight: bold; font-size: 1.15rem; color: darkblue; text-align: center; margin-top: 5px">Search</div>
    <b-form inline style="padding: 1px;">
        <b-button-group style="border: 1px solid gray; padding: 2px; margin: 0px; background-color: #E8E8E8">

            <b-form-select style="border:1px solid gray; margin-top: 1px"
                           v-model="parameter" :options="parameterOptions"></b-form-select> 

            <b-form-select style="border:1px solid gray; margin-top: 1px"
                           v-model="comparator" :options="comparatorOptions"></b-form-select> 

            <b-input style="width: 70px; border:1px solid gray; margin-top: 1px"
                     v-model="parameterValue" @keydown.enter.prevent="onClick">
            </b-input>

            <b-button v-if="index > 0 || numberOfConditions > 1" variant="warning" 
                      v-on:click="removeCondition" style="margin: 1px; border: 1px solid darkgray">remove</b-button>

            <b-button v-if="index === numberOfConditions-1" variant="primary"
                      v-on:click="addCondition" style="margin: 1px; border: 1px solid darkgray">add condition</b-button>

            <b-button variant="primary" v-on:click="search" style="margin: 1px; border: 1px solid darkgray">search</b-button>

        </b-button-group>
    </b-form>

    </div>
</template>

<script>
    import * as fb from '../firebase';

    export default {
        mounted: function () {},
        props: ['index', 'namespace'],
        data() {
            return {
                parameterOptions: [
                    {value: 'instrument', text: 'instrument'},
                    {value: 'percentProfitable', text: 'percentProfitable'},
                    {value: 'rrr', text: 'rrr'},
                    {value: 'avgMin', text: 'avg mae'},
                    {value: 'worstMin', text: 'worst mae'},
                    {value: 'avgMax', text: 'avg mpe'},
                    {value: 'bestMax', text: 'best mpe'},
                    {value: 'rsi', text: 'rsi'},
                    {value: 'open', text: 'open'},
                    {value: 'close', text: 'close'}
                ],
               comparatorOptions: [
                    {value: '<', text: '<'},
                    {value: '=', text: '='},
                    {value: '>', text: '>'}
                ],
                parameterValue: ""
            }
        },
        computed: {
            email() {
               // console.log("this.$store.state.user.email=", this.$store.state.user.email);
                return this.$store.state.user.email;
            },
            numberOfConditions() {
                return 1;
            },
            parameter() {
                return this.parameterOptions[0].value;
            },
            comparator(){
                return this.comparatorOptions[1].value;
            }
        },
        methods: {
            search(){
                console.log("search() starting. this.parameterValue=", this.parameterValue);
                fb.db.collection('saved-charts')
                        .doc(this.email).collection('charts')
                        .where("generalForm.instrument", "==", this.parameterValue)
                        .get()
                        .then((querySnapshot) => {
                            querySnapshot.forEach((doc) => {
                            // doc.data() is never undefined for query doc snapshots
                            console.log(doc.id, " => ", doc.data());
                        });
                });
            }
        }
    }
</script>
