<template>
    <span>
        <b-button v-on:click="toggle" size="sm" 
            v-bind:style="{color: 'white', backgroundColor: balloons ? 'darkgray' : 'black' }"
            style="font-weight: bold; border: 1px solid gray; white-space: nowrap;">
            {{label}}
        </b-button>
    </span>
</template>

<script>
    module.exports = {
        props: ['namespace'],
        methods: {
            toggle: function () {
               // console.log("test=", test);
               // console.log("this.balloons=", !this.balloons);
                this.$store.commit(this.namespace + '/chartParameters/setBalloons', !this.balloons);
            }
        },
        computed: {
            label() {
                return "data labels";
            },
            balloons(){
                return this.$store.state[this.namespace].chartParameters.balloons;
            }
        }
    }
</script>
