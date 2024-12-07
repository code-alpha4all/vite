<template>
    <span :id="'truncate-'+namespace"
        style="padding: 0px; background-color: #e7edf5; width: auto; color: black; font-weight: bold">
        <table>
            <tr>
                <td> truncate: </td>
                <td>
        <b-form-select size="sm" style="border: 1px solid gray; width: auto; margin-left: 1px"
                       v-model="truncate" :options="options"></b-form-select>
                </td>

            </tr>
        </table>
    </span>
</template>

<script>

    export default {

        props: ['namespace'],
        data: function () {
            return {
                options: [
                    {value: 1, text: "1 year"},
                    {value: 1.5, text: "1.5 years"},
                    {value: 2, text: "2 years"},
                    {value: 3, text: "3 years"},
                    {value: 10, text: "10 years"},
                ]
            };
        },
        computed: {
            truncate: {
                get() {
                    return this.$store.state[this.namespace].truncate;
                },
                set(truncate) {
                    this.$store.commit(this.namespace + '/setTruncate', truncate);
                }
            }
        }
    }
</script>
