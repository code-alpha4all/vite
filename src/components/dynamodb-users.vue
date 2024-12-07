<template>
    <div>

        <b-form-select size="sm" style="border:1px solid gray; width: auto; font-size: 15px"
                       @change="changeUser"
                       v-model="user" :options="users"></b-form-select>
    </div>
</template>

<script>
    import $ from "jquery";

    export default {
        mounted: function () {
            console.log("dynamodb-users.vue mounted() starting.");
            this.getUsers();
        },
        // props: ['namespace'],
        data: function () {
            return {
                user: null,
                users: []
            }
        },
        methods: {
            changeUser(user) {
                this.$store.dispatch('profile/getSaves', user);
            },
            getUsers() {
                let url = this.$store.state.siteData.baseUrl + this.$store.state.siteData.contextName + "/GetUsersFromDynamoDBServlet";
                let that = this;
                $.ajax({
                    url: url,
                    type: "POST",
                    data: {database: "a4a-charts"},
                    success: function (data) {
                        console.log("data=", data);
                        let parsedData = $.parseJSON(data);
                        console.log("parsedData=", parsedData);

                        let options = parsedData.map(x => {
                            return {value: x, text: x};
                        });
                        that.users = options;
                        that.user = options[0].value;

                    },
                    fail: function (data) {
                        console.log("call failed.");
                        console.log(data);
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .selectDiv {
        display:inline-block;
        vertical-align:top; overflow:hidden;
        border:solid grey 0px; 
        background-color: white;
        margin:0px 0px 4px 0px;
        font-size: 13px;
    }

    .list {
        padding: 9px;
        margin:-4px -26px -6px -5px;
        border:solid grey 0px; 
        background-color: white;
    }

    .selectTitle{
        margin:3px 2px -4px 2px;
        font-weight: bold;
        font-size: 12px;
        height: 100%;
        background-color: white
    }

    .contractAligner{
        margin: 0px 0px 3px 0px;
    }
</style>
