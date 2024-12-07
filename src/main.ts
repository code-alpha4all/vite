import { createApp } from "vue";
import { createPinia } from "pinia";
import { Tooltip } from "bootstrap";
import App from "./App.vue";

/*
TIP: To get started with clean router change path to @/router/clean.ts.
 */
import router from "./router";
import ElementPlus from "element-plus";
import i18n from "@/core/plugins/i18n";

//imports for app initialization
import ApiService from "@/core/services/ApiService";
import { initApexCharts } from "@/core/plugins/apexcharts";
import { initInlineSvg } from "@/core/plugins/inline-svg";
import { initVeeValidate } from "@/core/plugins/vee-validate";
import { initKtIcon } from "@/core/plugins/keenthemes";

import "@/core/plugins/prismjs";

import axios from "axios";
import store from "@/store";
import { setCommoditiesArray } from "@/js/main";

export const bus = new Vue();

let url = "https://storage.googleapis.com/authentication-f0d7e.appspot.com/siteData/commoditiesArray.json";
axios.get(url).then((apiResponse) => {
 // console.log("apiResponse=", apiResponse);
  let commoditiesArray = apiResponse.data;
  console.log("commoditiesArray=", JSON.parse(JSON.stringify(commoditiesArray)));

  store.commit('siteData/setFullCommoditiesArray', commoditiesArray);
  setCommoditiesArray(store.getters["siteData/commoditiesArray"]);


const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(ElementPlus);

ApiService.init(app);
initApexCharts(app);
initInlineSvg(app);
initKtIcon(app);
initVeeValidate();

app.use(i18n);

app.directive("tooltip", (el) => {
  new Tooltip(el);
});

app.mount("#app");

});
