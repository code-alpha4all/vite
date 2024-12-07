<template>
    <span style="font-size: 16px">
        <b-button size="sm" id="popover-target-normalization" 
                  v-bind:style="{backgroundColor: normalization ? 'darkgray' : 'black' }"
                  style="color: white">
            normalization
        </b-button>
        <b-popover target="popover-target-normalization" triggers="click blur" placement="bottom" ref="popover">
            <p style="font-size: 1.1rem;">        

            <b-form-select v-model="normalization" size="sm" :options="normalizationOptions"
              style="border:1px solid gray; width: auto; " ></b-form-select>

            </p>   

        </b-popover>
    </span>
</template>

<script>
    module.exports = {
        mounted: function () {
            console.log("forward-curve-normalization.vue starting.");
        },
        props: ['namespace'],
        data: function () {
            return {
                isOpen: false,
                normalizationOptions: [
                    {value: true, text: 'on'},
                    {value: false, text: 'off'}
                ]
            };
        },
        computed: {
            normalization: {
                get() {
                    return this.$store.state[this.namespace].normalization;
                },
                set(normalization) {
                    this.$store.commit(this.namespace + '/setNormalization', normalization);
                }
            }
        }
    }
</script>
