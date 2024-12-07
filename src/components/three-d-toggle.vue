<template>
    <span>
        <b-button v-on:click="toggle" :id="'three-d-toggle-' + namespace" size="sm" style="font-weight: bold; border: 1px solid gray;" 
            v-bind:style="{color: 'white', backgroundColor: show3D ? 'darkgray' : 'black' }">
            3D</b-button>
    </span>
</template>

<script>
    module.exports = {
        props: ['namespace'],
        methods: {
            toggle: function () {
               // console.log("this.namespace=", this.namespace);
                console.log("this.show3D=", !this.show3D);
                this.$store.commit(this.namespace + '/setShow3D', !this.show3D);
            }
        },
        computed: {
              show3D(){
                return this.$store.state[this.namespace].show3D;
            }
        }
    }
</script>
