<template>
    <table style="font-size: 1.1rem">
        <tr>
            <td>
        <b-form-select style="border: 1px solid gray; width: auto; border-radius: 4px; color: black;
                                margin: -12px 0 0px 2px; font-size: 1.1rem"
                       size="sm"
                       id="ticker-input-type"
                       v-model="tickerInputType"
                       :options="options"></b-form-select>
        </td>
        </tr>
    </table>
</template>

<script>
    export default {
        props: ['namespace'],
        computed: {
            options() {
                return [
                    {text: 'text', value: 'text'},
                    {text: 'form', value: 'form'},
                  //  {text: 'both', value: 'both'}
                ]
            },
            tickerInputType: {
                get() {
                    return this.$store.state.user.tickerInputType;
                },
                set(tickerInputType) {
                    console.log("tickerInputType.set() starting.");
                    this.$store.commit('user/setTickerInputType', tickerInputType);
                }
            }
        }
    }
</script>