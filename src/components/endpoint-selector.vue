<template>
    <div style="text-align: center;">
      <!--  <span style="padding-top: 9px; font-weight: bold; color: black">endpoint:</span> -->
            <b-form-select style="border:1px solid gray; width: auto; margin: -5px 0 5px 6px;"
                       v-model="endpoint" :options="endpointOptions"></b-form-select>
    </div>
</template>

<script>

    export default {
        mounted: function () {
           // console.log("endpoint-selector.vue mounted() starting.");
        },
       data: function(){
            return {
                endpointOptions: [
                    {value: "https://dscarr.com", text: "dscarr.com"},
                    {value: "https://dscarr.com/a4a", text: "dscarr.com/a4a"},
                    {value: "https://danscarr.com/a4a", text: "danscarr.com/a4a"},
                    {value: "http://localhost:8080", text: "localhost:8080"},
                    {value: "http://161.35.64.247/a4a", text: "danscarr4-2/a4a"},
                    {value: "http://104.248.38.35/a4a", text: "danscarr4-3/a4a"},
                    {value: "https://djscarr.com/a4a", text: "djscarr.com/a4a"}
                ]
            };
        },
        computed: {  
            endpoint: {
                get(){
                    let endpoint = this.$store.state.siteData.baseUrl + this.$store.state.siteData.contextName;
                    console.log("endpoint=", endpoint);
                    return endpoint;
                },
                set(endpoint){
                    console.log("set() endpoint=", endpoint);
                    let temp1 = endpoint.split('//');
                    let temp2 = temp1[1].split('/');
                    console.log("temp1=", temp1);
                    console.log("temp2=", temp2);

                    let baseUrl = temp1[0] + "//" + temp2[0];
                    console.log("baseUrl=", baseUrl);

                    let contextName = temp2.length > 1 ? "/" + temp2[1] : "";
                    console.log("contextName=", contextName);

                    this.$store.commit('siteData/setBaseUrl', baseUrl);
                    this.$store.commit('siteData/setContextName', contextName);

                    localStorage.setItem("endpoint", endpoint);

                }   
            },    
                       
        }
    }
</script>
