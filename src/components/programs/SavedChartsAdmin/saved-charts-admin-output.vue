<template>
  <div style="border: 0px solid darkgray; height: 100%; width: fit-content; margin-top: 0px;">
    <table>
      <tr>
        <td colspan=2 style="text-align: center;">
           <b-button variant="primary" style="border: 1px solid darkgray;  margin: 10px 30px 0 0;"
    v-on:click="transferSelectedCharts()">Transfer Selected Charts</b-button>
 
           <b-button variant="primary" style="border: 1px solid darkgray; margin-top: 10px;"
    v-on:click="transferAllCharts()">Transfer All Charts</b-button>
    </td>
    </tr>
      <tr>
        <td style="vertical-align: top; text-align: center; padding: 20px; width: 50%">
          <h3 style='color: darkblue'>Source</h3>
          <saved-charts-admin-firebase v-bind:ref="'source'"></saved-charts-admin-firebase>
          
  <!--  <b-button variant="success" style="border: 1px solid darkgray; margin: 5px;"
    v-on:click="download()">Download</b-button> -->
        </td>
        <td style="vertical-align: top; text-align: center; padding: 20px; width: 50%">
          <h3 style='color: darkblue'>Target</h3>
          <saved-charts-admin-firebase v-bind:ref="'target'"></saved-charts-admin-firebase>
      
     <!--  <b-button variant="success" style="border: 1px solid darkgray; margin: 5px;"
    v-on:click="upload()">Upload</b-button> -->
     </td>
  </tr>
  </table>
  </div>
</template>

<script>

   // import savedChartsAdmin from '@/components/saved-charts-admin';
    import savedChartsAdminFirebase from '@/components/saved-charts-admin-firebase';
   // import $ from "jquery";

    export default {
      components: {
           /* savedChartsAdmin,*/ savedChartsAdminFirebase
        },
        mounted() {
            console.log("saved-charts-admin-output.vue mounted() starting.");
        },
        props: ['namespace'],
        methods: {
          download(){
            console.log("download() starting.");
            this.$refs.source.download();
          },
          upload(){
            console.log("upload() starting.");

          },
          transferSelectedCharts(){
            console.log("transferSelectedCharts() starting. this.$refs=", this.$refs);
            let that = this;
            let sourceCharts = this.$refs.source.selectedCharts.map(name => that.$refs.source.savedCharts.find(x => x.saveName === name));
            console.log("sourceCharts=", sourceCharts);
            
            sourceCharts.forEach(form => {
              this.$refs.target.saveChart(form);
            });
          },
          transferAllCharts(){
            console.log("transferAllCharts() starting. this.$refs=", this.$refs);
           // let sourceCharts = this.$refs.source.savedCharts.slice();
            this.$refs.source.getAllChartsAndIds().then(charts => {
              console.log("charts=", charts);

              charts.forEach(form => {
              this.$refs.target.saveChartWithId(form);
            });

            });
           /* console.log("sourceCharts=", sourceCharts);

            let sourceLayout = JSON.parse(JSON.stringify(this.$refs.source.layout.layout));
            console.log("sourceLayout=", sourceLayout);

            this.$refs.target.saveLayout(sourceLayout); */

          }
        }       
    };

</script>

