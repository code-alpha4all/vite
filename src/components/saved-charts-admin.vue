<template>
  <div style="border: 1px solid darkgray; height: 100%; width: 100%; padding: 15px;">
    
    <a id="downloadAnchorElem" style="display:none"></a>

    <table style="width: 100%;">
      <tr>
        <td style="width: 100%;">
    database<b-form-select v-model="database" :options="databaseOptions" 
                       style="border: 1px solid gray; width: 100%;"></b-form-select>

    user<b-form-select v-model="user" :options="users" 
                       style="border: 1px solid gray; width: 100%;"></b-form-select>

    charts<b-form-select v-model="selectedCharts" :options="savedCharts.map(x => x.saveName)" multiple 
                        v-bind:select-size="savedCharts.length" 
                        style="border: 1px solid gray; width: 100%;"></b-form-select>

  <!--  <b-button variant="warning" style="border: 1px solid darkgray; margin: 1px;"
    v-on:click="download()">Download</b-button> -->

  </td>
  </tr>
  </table>
  </div>
</template>

<script>

    import $ from "jquery";

    export default {
        mounted() {
            console.log("saved-charts-admin.vue mounted() starting.");
            this.loadUsers();
        },
        props: ['namespace'],
        data: function () {
            return {
                database: "a4a-charts",
                databaseOptions: [
                    {value: 'a4a-charts', text: 'a4a-charts'},
                  //  {value: 'saved-charts', text: 'saved-charts'}
                ],
                user: null,
                users: [],
                selectedCharts: [],
                savedCharts: []
            }
        },
        watch: {
          user(){
            console.log("watching user.");
            this.savedCharts = [];
            this.getSaves();
          },
          database(){
            console.log("watching database.");
            this.users = [];
            this.savedCharts = [];
            this.loadUsers();
          }
        },
        methods:{
          download(){
            console.log("download() starting.");
            var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.savedCharts));
            var dlAnchorElem = document.getElementById('downloadAnchorElem');
            dlAnchorElem.setAttribute("href",     dataStr     );
            dlAnchorElem.setAttribute("download", "charts.json");
            dlAnchorElem.click();
          },
          getSaves(){
            if (this.user != "") {
                let url = this.$store.state.siteData.baseUrl + this.$store.state.siteData.contextName + "/GetSavedChartsAndJsonFromDynamoDBServlet";
                let that = this;
                $.ajax({
                    url: url,
                    type: "GET",
                    data: {"json": that.user, database: that.database},
                    success: function (data) {
                       // console.log("data=", data);
                        var parsedData = $.parseJSON(data).charts;
                       // console.log("parsedData=", parsedData);
                        that.savedCharts = parsedData.map(x => {
                          let y = JSON.parse(JSON.parse(x).json);
                         // console.log("y=", y);
                         if(typeof y.saveName === 'undefined'){
                           y.saveName = y.key;
                         }
                          return y;
                        });
                        console.log("that.savedCharts=", that.savedCharts);
                    },
                    fail: function (data) {
                        console.log("call failed.");
                        console.log(data);
                    }
                });
            }
           },
            loadUsers(){
                let that = this;
                 $.ajax({
                        url: this.$store.state.siteData.baseUrl + this.$store.state.siteData.contextName + "/GetUsersFromDynamoDBServlet/",
                        type: "POST",
                        data: {"database": that.database},
                        success: function (data) {
                            //console.log("data=", data);
                            let parsedData = JSON.parse(data);
                            that.users = parsedData;
                            that.user = that.users[0]

                        },
                        fail: function (data) {
                            that.$store.commit(that.namespace + '/setLoading', false);
                          //  console.log("ajax call failed.");
                            $("#progress").hide();
                            $("#button").show();
                            console.log(data);
                        }
                    });
            }
        }
    };

</script>

