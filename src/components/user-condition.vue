<template>

    <b-form inline style="padding: 1px;">
        <b-button-group style="border: 1px solid gray; padding: 2px; margin: 0px; color: white; background-color: teal; border-radius: 3px;">

            <span style="padding: 11px 2px 0 5px; font-weight: bold">and&nbsp;</span> 
            <b-form-select style="border:1px solid gray; margin-top: 1px; border-top-right-radius: 0px; border-bottom-right-radius: 0px;"
                           v-model="parameter" :options="parameterOptions"></b-form-select> 

            <b-form-select style="border:1px solid gray; margin-top: 1px; border-radius: 0px"
                           v-model="comparator" :options="comparatorOptions"></b-form-select> 

            <b-input style="width: 70px; border:1px solid gray; margin: 1px 10px 0 0; border-top-left-radius: 0px; border-bottom-left-radius: 0px;"
                     v-model.number="value" @keydown.enter.prevent="onClick">
            </b-input>

            <b-button variant="warning" 
                      v-on:click="removeCondition" style="margin: 1px; margin-left: 8px; border: 1px solid darkgray; border-radius: 3px">remove</b-button>

        </b-button-group>
    </b-form>

</template>

<script>
    module.exports = {
        mounted: function () {},
        props: ['index', 'namespace'],
        data() {
            return {
                parameterOptions: [
                    {value: 'appd', text: 'appd'},
                    {value: 'percentProfitable', text: 'percentProfitable'},
                    {value: "rrr", text: "avg mpe / avg mae"},
                    {value: 'avgMin', text: 'avg mae'},
                    {value: 'worstMin', text: 'worst mae'},
                    {value: 'avgMax', text: 'avg mpe'},
                    {value: 'bestMax', text: 'best mpe'},
                    {value: 'bestMax', text: 'best mpe'},
                    {value: 'rsi', text: 'current rsi'}/*,
                    {value: 'close', text: 'close'}*/
                ],
                comparatorOptions: [
                    {value: '<', text: '<'},
                    {value: '>', text: '>'},
                    {value: '=', text: '='}
                ]
            }
        },
        computed: {
            numberOfConditions() {
                return this.$store.state[this.namespace].search.userConditions.length;
            },
            parameter: {
                get() {
                    return this.$store.state[this.namespace].search.userConditions[this.index].parameter;
                },
                set(parameter) {
                    let arr = JSON.parse(JSON.stringify(this.$store.state[this.namespace].search.userConditions));
                    let newObj = arr[this.index];
                    newObj.parameter = parameter;
                    arr[this.index] = newObj;
                    console.log("arr=", arr);
                    this.$store.commit(this.namespace + '/search/setUserConditions', arr);
                }
            },
            comparator: {
                get() {
                    return this.$store.state[this.namespace].search.userConditions[this.index].comparator;
                },
                set(comparator) {
                    let arr = JSON.parse(JSON.stringify(this.$store.state[this.namespace].search.userConditions));
                    let newObj = arr[this.index];
                    newObj.comparator = comparator;
                    arr[this.index] = newObj;
                    this.$store.commit(this.namespace + '/search/setUserConditions', arr);

                }
            },
            value: {
                get() {
                    return this.$store.state[this.namespace].search.userConditions[this.index].value;
                },
                set(value) {
                    if (value !== "") {
                        let arr = JSON.parse(JSON.stringify(this.$store.state[this.namespace].search.userConditions));
                        let newObj = arr[this.index];
                        newObj.value = value;
                        arr[this.index] = newObj;
                        this.$store.commit(this.namespace + '/search/setUserConditions', arr);

                    }
                }
            }
        },
        methods: {
            onClick() {
                this.$emit('update-item');
            },
            removeCondition() {
                console.log("removeCondition() starting.");
                let arr = JSON.parse(JSON.stringify(this.$store.state[this.namespace].search.userConditions));
                arr.splice(this.index, 1);
                this.$store.commit(this.namespace + '/search/setUserConditions', arr);

            },
        }
    }
</script>
