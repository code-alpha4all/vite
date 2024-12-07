<template>

    <div>
        <input type="text" v-model="numericInput" @input="filterNonNumeric" class="form-control" :style="{color:color}"
         style="height: 30px; border-radius: 0px"/>
    </div>

</template>

<script>
    module.exports = {
        mounted() {
            console.log("only-numbers.vue starting.");
            this.numericInput = this.value;
        },
        props: ['namespace', 'index', 'value'],
        data() {
            return {
                numericInput: ""
            }
        },
        computed: {
            color(){
                return this.$store.state.siteData.legColors[this.index];
            }
        },
        watch: {
            numericInput(numericInput){
                console.log("watching numericInput=", numericInput);
                this.$emit('numericInputChange', numericInput);
            },
            value(value){
                console.log("watching value=", value);
                this.numericInput = value;

            }
        },
        methods: {
            filterNonNumeric() {
                // Replace non-numeric characters with an empty string
                this.numericInput = this.numericInput.replace(/[^0-9]/g, "");
            }
        }
    }
</script>
