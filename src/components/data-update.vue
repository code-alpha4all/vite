<template>
    <span>
        <b-button size="sm" 
        v-on:click="toggle" v-bind:style="{color: 'white', backgroundColor: show ? 'darkgray' : 'black' }">{{year}}
        </b-button>
    </span>
</template>

<script>
    module.exports = {
        props: ['year', 'namespace'],
        methods: {
            toggle: function () {
               // console.log("toggle() starting.");
                let includes = this.$store.state[this.namespace].seasonals.slice().includes(parseInt(this.year));
               // console.log("includes", includes);
                if (!includes) {
                    let seasonals = [...this.$store.state[this.namespace].seasonals];
                    seasonals.push(parseInt(this.year));
                    let sortedSeasonals = seasonals.sort((a, b) => (a > b) ? 1 : -1);
                    console.log("sortedSeasonals=", sortedSeasonals);

                    this.$store.commit(this.namespace + '/setSeasonals', sortedSeasonals);
                    //  am4charts.addSingleSeasonal(parseInt(this.year));
                } else {
                    let seasonals = this.$store.state[this.namespace].seasonals.slice();
                    let index = seasonals.indexOf(parseInt(this.year));
                    if (index > -1) {
                        seasonals.splice(index, 1);
                    }
                    console.log("seasonals", seasonals);
                    this.$store.commit(this.namespace + '/setSeasonals', seasonals);
                    //   am4charts.removeSeasonal(parseInt(this.year));
                }
            }
        },
        computed: {
            show() {
                return this.$store.state[this.namespace].seasonals.slice().includes(parseInt(this.year));
            }
        }
    }
</script>
