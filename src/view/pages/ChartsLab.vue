<template>
  <div>
    <div class="row mx-5" v-if="boxes.show">  
        <div class="col-xxl-6"> 
          <AdvancedTableWidget2></AdvancedTableWidget2> 
        </div> 
        <div class="col-xxl-6" ref='eeee'> 
          <ListWidget1></ListWidget1> 
        </div>
    </div> 
    <Wizard 
        v-if="wizard.show"
        ref='strategy_wizard'
    ></Wizard>
    <!-- begin::Dashboard-->
    <!--    </div> -->
    <!--  <div class="row">  -->
    <!--    <div class="col-xxl-8"> -->
    <!--      <StrategyOverview></StrategyOverview> -->
    <!--    </div> -->
    <!--    <div class="col-xxl-4"> -->
    <!--      <ListWidget9></ListWidget9> -->
    <!--    </div> -->
    <!--    <div class="col-xxl-4"> -->
    <!--      <StatsWidget7></StatsWidget7> -->
    <!--      <StatsWidget12></StatsWidget12> -->
    <!--    </div> -->
    <!--    <div class="col-xxl-4 order-1 order-xxl-1"> -->
    <!--      <ListWidget1></ListWidget1> -->
    <!--    </div> -->
    <!--    <div class="col-xxl-8 order-2 order-xxl-1"> -->
    <!--      <AdvancedTableWidget2></AdvancedTableWidget2> -->
    <!--    </div> -->
    <!--    <div class="col-xxl-4 order-1 order-xxl-2"> -->
    <!--      <ListWidget3></ListWidget3> -->
    <!--    </div> -->
    <!--    <div class="col-xxl-4 order-1 order-xxl-2"> -->
    <!--      <ListWidget4></ListWidget4> -->
    <!--    </div> -->
    <!--    <div class="col-lg-12 col-xxl-4 order-1 order-xxl-2"> -->
    <!--      <ListWidget8></ListWidget8> -->
    <!--    </div> -->
    <!--    <div class="col-xxl-4 order-1 order-xxl-2"> -->
    <!--      <StatsWidget13></StatsWidget13> -->
    <!--    </div> -->
    <!--    <div class="col-xxl-8 order-1 order-xxl-2"> -->
    <!--      <AdvancedTableWidget3></AdvancedTableWidget3> -->
    <!--    </div> -->
    <!--  </div> -->
    <!--end ::Dashboard -->
  </div>
</template>

<script>
import { SET_BREADCRUMB } from "@/store/breadcrumbs.module";
import AdvancedTableWidget2 from "@/view/content/widgets/advance-table/Widget2.vue";
/*import AdvancedTableWidget3 from "@/view/content/widgets/advance-table/Widget3.vue";
import MixedWidget1 from "@/view/content/widgets/mixed/Widget1.vue";
import ListWidget3 from "@/view/content/widgets/list/Widget3.vue";
import ListWidget4 from "@/view/content/widgets/list/Widget4.vue";
import ListWidget8 from "@/view/content/widgets/list/Widget8.vue";
import StatsWidget13 from "@/view/content/widgets/stats/Widget13.vue";
import StatsWidget12 from "@/view/content/widgets/stats/Widget12.vue";
import StatsWidget7 from "@/view/content/widgets/stats/Widget7.vue";*/
import ListWidget1 from "@/view/content/widgets/list/Widget1.vue";
import Wizard from "@/view/pages/wizard/Wizard-1.vue";

export default {
  name: "dashboard",
  data() {
    return {
      boxes: {
        show :true
      },
      wizard: {
        show :false
      },
      settore : ''
    };
  },
  components: {
    AdvancedTableWidget2,
    /*AdvancedTableWidget3,
    MixedWidget1,
    ListWidget3,
    ListWidget4,
    ListWidget8,
    StatsWidget13,
    GridLayout,
    GridItem,*/
    Wizard,
    ListWidget1,
    //StatsWidget7,
    //StatsWidget12,
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Dashboard" }]);
  },
  methods: {
    showOnlyWizard(settore) {
      this.boxes.show = false;
      this.wizard.show = true;
      console.log(settore);
      this.settore = settore;
      //this.$parent.strategy.sector=this.day[i].settore;
      //this.$children[0].settore = settore;
      //this.$refs.wizard.initSettore(settore);
    },
    showOnlyBoxes() {
      this.boxes.show = true;
      this.wizard.show = false;
    }
  },
};
</script>