<template>
    <div style="border-radius: 3px; border: 1px solid gray; background-color: #e7edf5; margin: 1px 3px 0px -13px;
                 padding: 1px 0 0 2px; width: fit-content; border-spacing: 0;">
    <table>
        <tr>
        <td v-if="tickerInputType === 'text'" style="padding: 0 0 0 0">
        <commodity-box-text v-bind:namespace="namespace" :ref="'commodities-box-text-'+namespace"></commodity-box-text>
        </td>
        <td v-if="tickerInputType === 'form'">
        <commodity-box-form v-bind:namespace="namespace">
            <template v-slot:contract-aligner>
                <slot name="contract-aligner"></slot>
            </template>
        </commodity-box-form>
        </td>
        </tr>
    </table>
    </div>
</template>

<script>

    import * as fb from '@/firebase';
    import { getUnitMove } from '@/js/main';
    import commodityBoxText from '@/components/commodity-box-text.vue';
    import commodityBoxForm from '@/components/commodity-box-form.vue';

    export default {
        components: {
            commodityBoxText, commodityBoxForm
        },
        mounted() {
            // console.log("commodity-box.vue mounted() starting.");
        },
        props: {
            namespace: {
                type: String,
                default: ""
            }
        },
        computed: {
            user() {
                return this.$store.state.user;
            },
            program() {
                return this.$store.state[this.namespace].program;
            },
            email() {
                return this.user.email;
            },
            tickerInputType: {
                get() {
                    return this.user.tickerInputType;
                },
                set() {}
            },
            seasonalSelectionMode: {
                get() {
                    return this.$store.state[this.namespace].seasonalSelectionMode;
                },
                set(seasonalSelectionMode) {
                    console.log("selected seasonalSelectionMode() starting. seasonalSelectionMode=", seasonalSelectionMode + " this.namespace=", this.namespace);
                    this.$store.commit(this.namespace + '/setSeasonalSelectionMode', seasonalSelectionMode);
                }
            }
        },
        watch: {
            tickerInputType(tickerInputType) {
                console.log("watching tickerInputType=", tickerInputType);
                this.updateTickerInputTypeToFirebase(tickerInputType);
            }
        },
        methods: {
            restoreStandardUnitMoves() {
                console.log("restoreStandardUnitMoves() starting.");
                let unitMove = this.c.map(commodity => getUnitMove(commodity));
                console.log("unitMove=", unitMove);
                this.$store.commit(this.namespace + '/setUnitMove', unitMove);

            },
            updateTickerInputTypeToFirebase(tickerInputType) {
                console.log("updateTickerInputTypeToFirebase() starting. tickerInputType=", tickerInputType);
                this.tickerInputType = tickerInputType;
                fb.usersCollection
                        .doc(this.email)
                        .update({"tickerInputType": tickerInputType})
                        .then(() => {
                            console.log('tickerInputType updated.');
                        }).catch((error) => {
                    // The document probably doesn't exist.
                    console.error("Error updating document: ", error);
                });
            }
        }
    }
</script>

