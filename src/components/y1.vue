<template>
    <span style="white-space: nowrap">
        <b-form-select size="sm" style="border:1px solid gray; width: auto; margin: 0 0 0px 2px; height: 2.3rem;"
                       v-model="y1" :options="options" :id="'y1-'+namespace"></b-form-select>
    </span>
</template>

<script>
    export default {
        mounted: function () {
           // console.log("y1.vue mounted() starting.");
        },
        props: {
            max: {
                type: Number,
                default: 40
            },
            min: {
                type: Number,
                default: 1
            },
            namespace: {
                type: String,
                default: ""
            }
        },
        data() {
            return {
                options: Array(this.max).fill(null).map((x, i) => ({value: i + 1, text: i + 1}))
            };
        },
        computed: {
            y1: {
                get() {
                    return this.$store.state[this.namespace].y1;
                },
                set(y1) {
                    this.$store.commit(this.namespace + '/setY1', y1);
                }
            }
        }
    }
</script>
