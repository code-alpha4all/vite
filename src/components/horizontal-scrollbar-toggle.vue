<template>
    <span>
        <b-button v-on:click="toggle" size="sm" style="margin: 0px; border: 1px solid gray;"
                  v-bind:style="{color: 'white', backgroundColor: hiddenFeatures.horizontalScrollbar ? 'black' : 'darkgray' }">
            scrollbar</b-button>
    </span>
</template>

<script>
    module.exports = {
        props: ['namespace'],
        methods: {
            toggle: function () {
                let hiddenFeatures = JSON.parse(JSON.stringify(this.hiddenFeatures));
                console.log("hiddenFeatures=", hiddenFeatures);
                let hideHorizontalScrollbar = !hiddenFeatures.horizontalScrollbar;
                console.log("hideHorizontalScrollbar=", hideHorizontalScrollbar);
                let newHiddenFeatures = hiddenFeatures;
                newHiddenFeatures.horizontalScrollbar = hideHorizontalScrollbar;
                console.log("newHiddenFeatures=", newHiddenFeatures);
                this.$store.commit(this.namespace + '/chartParameters/setHiddenFeatures', newHiddenFeatures);
            }
        },
        computed: {
            hiddenFeatures(){
                return this.$store.state[this.namespace].chartParameters.hiddenFeatures;
            }
        }
    }
</script>
