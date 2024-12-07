<template>
    <span style="padding: 1px">
        <b-button v-on:click="toggle" v-bind:size="size" style="border: 1px solid gray; white-space: nowrap;"
                  v-bind:style="{color: 'white', backgroundColor: propertyValue ? 'darkgray' : 'black' }">
            {{label}}</b-button>
    </span>
</template>

<script>
    import {capitalizeFirstLetter} from "@/js/main";

    export default {
        mounted(){
           // console.log("toggle-single-throw.vue mounted() starting.");
        },
        props: {
            property: {
                type: String
            },
            label: {
                type: String
            },
            namespace: {
                type: String
            },
            size: {
                type: String,
                default: 'sm'
            }
        },
        methods: {
            toggle: function () {
                console.log("toggle() starting.");
                let command = 'set' + capitalizeFirstLetter(this.property);
                console.log("command=", command, " to ", !this.propertyValue);
                this.$store.commit(this.namespace + '/' + command, !this.propertyValue);
            }
        },
        computed: {
            propertyValue() {
                return this.$store.state[this.namespace][this.property];
            }
        }
    }
</script>
