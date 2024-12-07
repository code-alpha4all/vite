<template>
    <span>
        <span style="margin-right: 2px; margin-left: 0px; padding-top: 9px; font-weight: bold; color: black"> legs:</span>
        <b-form-select style="border:1px solid gray; width: auto;"
                       v-model="legs" :options="options"
                       size="sm"></b-form-select>
    </span>
</template>

<script>

    export default {
        mounted: function () {
            // console.log("legs.vue mounted() starting.");
            // console.log("this.namespace=", this.namespace);
            this.$store.dispatch(this.namespace + '/checkPositions');
        },
        props: {
            max: {
                type: Number,
                default: 4
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
            legs: {
                get() {
                    // console.log("this.$store.state[this.namespace].legs=", this.$store.state[this.namespace].legs);
                    return this.$store.state[this.namespace].legs;
                },
                set(legs) {
                    console.log("legs: set() starting. legs=", legs);
                    let oldLegs = this.legs;
                   // console.log("oldLegs=", oldLegs + " legs=", legs);

                    // let newUnitMoveArray;
                    if (legs !== oldLegs) {
                        //  console.log("this.$store.state.generalForm.unitMove=", this.$store.state.generalForm.unitMove);
                        //  let newUnitMoveArray = this.$store.state.generalForm.unitMove.slice(0);

                      /*  for (let i = oldLegs; i < legs; i++) {
                            let commodity = this.$store.getters[this.namespace + "/c"][i];
                            console.log("commodity =", commodity);

                            //   let unitMove = getUnitMove(commodity);
                            //   newUnitMoveArray[i] = unitMove;
                        }*/
                        //  this.$store.commit(this.namespace + '/setUnitMove', newUnitMoveArray);
                        //  console.log("newUnitMoveArray=", newUnitMoveArray);

                        this.$store.commit(this.namespace + '/setLegs', legs);
                        this.$store.commit(this.namespace + '/setSelected', []);
                        this.$store.dispatch(this.namespace + '/getContractListsFromServer');
                      //  if (this.$store.state[this.namespace].instrument === "future") {
                      //  }

                        this.$store.dispatch(this.namespace + '/checkPositions');
                    }
                }
            }
        }
    }
</script>
