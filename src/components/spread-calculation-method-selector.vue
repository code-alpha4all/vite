<template>
    <span>
    <b-form-select style="border: 1px solid gray; width: auto;"
                       size="sm"
                       v-model="spreadCalculationMethod" :options="options"></b-form-select>

  
    </span>
</template>

<script>
    module.exports = {
        props: ['namespace'],
        computed: {
            spreadCalculationMethod: {
                get() {
                    return this.$store.state[this.namespace].spreadCalculationMethod;
                },
                set(spreadCalculationMethod) {
                    this.$store.commit(this.namespace + '/setSpreadCalculationMethod', spreadCalculationMethod);
                }
            },
            options() {
                return  [
                    {value: "a4a", text: 'a4a'},
                    {value: "csi", text:'csi'}
                ]
            },
        }
    }
</script>
