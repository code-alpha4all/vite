<template>
    <span  v-bind:style="{color: $store.state.siteData.legColors[index]}">
        <b-input style="width: 75px; border-left: 1px solid gray; text-align: right; background-color: whitesmoke; border-radius: 0px"
                 readonly
                 size="sm"
                 v-model.number="unitMove" 
                 v-bind:style="{color: $store.state.siteData.legColors[index]}">
        </b-input>
    </span>
</template>

<script>
    module.exports = {
        props: ['namespace', 'index'],
        computed: {
            unitMove: {
                get() {
                    return /*" unit move: $" + */Math.abs(this.$store.state[this.namespace].unitMove[this.index]);  //.toFixed(0)).toLocaleString("en-US");                    
                },
                set(unitMove) {
                    console.log("unitMive.set() starting. unitMove=", unitMove);
                   /* if (unitMove !== "") {
                        let newArray = this.$store.state[this.namespace].unitMove.slice(0);
                        newArray[this.index] = unitMove;
                        this.$store.commit(this.namespace + '/setUnitMove', newArray);
                        this.$store.commit(this.namespace + '/chartParameters/setPage', 1);
                    }*/
                }
            }
        }
    }
</script>
