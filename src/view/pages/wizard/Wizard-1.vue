<template>
  <div class="card card-custom mx-5">
    <div class="card-body p-0">
      <!--begin: Wizard-->
      <div
        class="wizard wizard-1"
        id="kt_wizard_v1"
        data-wizard-state="step-first"
        data-wizard-clickable="true"
      >
        <!--begin: Wizard Nav-->
        <div class="wizard-nav border-bottom">
          <div class="wizard-steps">
            <div
              class="wizard-step"
              data-wizard-type="step"
              data-wizard-state="current"
            >
              <div class="wizard-label">
                <i class="wizard-icon flaticon-rocket icon-3x"></i>
                <h3 class="wizard-title">1. Panoramica Strategia</h3>
              </div>
              <i class="wizard-arrow flaticon2-next"></i>
            </div>
            <div class="wizard-step" data-wizard-type="step">
              <div class="wizard-label">
                <i class="wizard-icon flaticon-list icon-3x"></i>
                <h3 class="wizard-title">2. Informazioni Tecniche</h3>
              </div>
              <i class="wizard-arrow flaticon2-next"></i>
            </div>
            <div class="wizard-step" data-wizard-type="step">
              <div class="wizard-label">
                <i class="wizard-icon flaticon-diagram icon-3x"></i>
                <h3 class="wizard-title">3. Simulazione Mercato</h3>
              </div>
              <i class="wizard-arrow flaticon2-next"></i>
            </div>
            <div class="wizard-step" data-wizard-type="step">
              <div class="wizard-label">
                <i class="wizard-icon flaticon-coins icon-3x"></i>
                <h3 class="wizard-title">4. Risultato finale</h3>
              </div>
              <i class="wizard-arrow flaticon2-next"></i>
            </div>
            <div class="wizard-step" data-wizard-type="step">
              <div class="wizard-label">
                <i class="wizard-icon flaticon-statistics icon-3x"></i>
                <h3 class="wizard-title">5. Rivedi esercizio</h3>
              </div>
              <i class="wizard-arrow last flaticon2-next"></i>
            </div>
          </div>
        </div>
        <!--end: Wizard Nav-->

        <!--begin: Wizard Body-->
        <div class="row justify-content-center my-10 my-lg-15">
          <div class="col-xl-12 col-xxl-10">
            <!--begin: Wizard Form-->
            <form class="form" id="kt_form">
              <!--begin: Wizard Step 1-->
              <div data-wizard-type="step-content" data-wizard-state="current">
                <div class="row">
                  <div class="col-xxl-12">
                    <StrategyOverview 
                      :sector='strategy.sector'
                      ref="strategyOverview">
                    </StrategyOverview>
                  </div>
                </div>
              </div>
              <!--end: Wizard Step 1-->

              <!--begin: Wizard Step 2-->
              <div class="pb-5" data-wizard-type="step-content">
                <b-container class="bv-example-row">
                  <b-row>
                    <b-col sm="2">
                      <button
                        style="width:160px;"
                        class="btn btn-success font-weight-bold text-uppercase px-9 py-4 my-4"
                      >
                        <b class="font-weight-medium">POSIZIONE</b><br />
                        LONG
                      </button>

                      <button
                        style="width:160px;"
                        class="btn btn-primary font-weight-bold text-uppercase px-9 py-4 my-4"
                        data-wizard-type="action-go-to-dashboard"
                      >
                        <b class="font-weight-medium">STAGIONALITA'</b><br />
                        RIALZISTA
                      </button>

                      <button
                        style="width:160px;"
                        class="btn btn-primary font-weight-bold text-uppercase px-9 py-4 my-4"
                        data-wizard-type="action-go-to-dashboard"
                      >
                        <b class="font-weight-medium">RSI</b><br />
                        IPERVENDUTO
                      </button>
                    </b-col>
                    <b-col sm="8">
                      <b-row>
                        <b-alert
                          show
                          variant="light"
                          class="alert alert-custom alert-white alert-shadow fade show gutter-b"
                        >
                          <div class="alert-icon">
                            <span class="svg-icon svg-icon-lg">
                              <inline-svg
                                src="media/svg/icons/Tools/Compass.svg"
                              />
                            </span>
                          </div>
                          <div class="alert-text">
                            Seleziona <b>NON ENTRO</b> e preferisci non
                            effettuare un ingresso su questa operazione, oppure
                            un prezzo tra i tre proposti (bronze, silver e gold)
                            e clicca su conferma!
                            <b
                              >N.B. Una volta confermato, il prezzo non è
                              modificabile.</b
                            >
                          </div>
                        </b-alert>
                      </b-row>
                      <b-row>CHART</b-row>
                    </b-col>
                    <b-col sm="2">
                      <button
                        style="width:160px;"
                        class="btn btn-danger font-weight-bold text-uppercase px-9 py-4 my-4"
                      >
                        <b class="font-weight-medium">NON ENTRO</b><br />
                        <i class="icon-xl la la-times-circle"></i>
                      </button>

                      <button
                        v-bind:class="{ 'i-am-active': button_active_state_1 }"
                        v-on:click="
                          greet;
                          button_active_state_1 = !button_active_state_1;
                          button_active_state_2 = !button_active_state_1;
                          button_active_state_3 = !button_active_state_1;
                          disableNextButton = 0;
                        "
                        style="width:160px;background:#FFA726"
                        class="btn font-weight-bold text-uppercase px-9 py-4 my-4"
                      >
                        <b class="font-weight-medium">BRONZE</b><br />
                        3.00 $
                      </button>

                      <button
                        v-bind:class="{ 'i-am-active': button_active_state_2 }"
                        v-on:click="
                          greet;
                          button_active_state_2 = !button_active_state_2;
                          button_active_state_1 = !button_active_state_2;
                          button_active_state_3 = !button_active_state_2;
                          disableNextButton = 0;
                        "
                        style="width:160px;background:#CFD8DC"
                        class="btn font-weight-bold text-uppercase px-9 py-4 my-4"
                      >
                        <b class="font-weight-medium">SILVER</b><br />
                        2.50 $
                      </button>

                      <button
                        v-bind:class="{ 'i-am-active': button_active_state_3 }"
                        v-on:click="
                          greet;
                          button_active_state_3 = !button_active_state_3;
                          button_active_state_2 = !button_active_state_3;
                          button_active_state_1 = !button_active_state_3;
                          disableNextButton = 0;
                        "
                        style="width:160px;background:#FFEA00"
                        class="btn font-weight-bold text-uppercase px-9 py-4 my-4"
                      >
                        <b class="font-weight-medium">GOLD</b><br />
                        1.50 $
                      </button>
                    </b-col>
                  </b-row>
                </b-container>
              </div>
              <!--end: Wizard Step 2-->

              <!--begin: Wizard Step 3-->
              <div class="pb-5" data-wizard-type="step-content">
                <b-container class="bv-example-row">
                  <b-row>
                    <b-col sm="2">
                      <button
                        style="width:160px;"
                        class="btn btn-success font-weight-bold text-uppercase px-9 py-4 my-4"
                      >
                        <b class="font-weight-medium">POSIZIONE</b><br />
                        LONG
                      </button>
                      <button
                        style="width:160px;background:#FFA726"
                        class="btn font-weight-bold text-uppercase px-9 py-4 my-4"
                        data-wizard-type="action-go-to-dashboard"
                      >
                        <b class="font-weight-medium">BRONZE</b><br />
                        3.00 $
                      </button>

                      <button
                        style="width:160px;background:#CFD8DC"
                        class="d-none btn font-weight-bold text-uppercase px-9 py-4 my-4"
                        data-wizard-type="action-go-to-dashboard"
                      >
                        <b class="font-weight-medium">SILVER</b><br />
                        2.50 $
                      </button>

                      <button
                        style="width:160px;background:#FFEA00"
                        class="d-none btn font-weight-bold text-uppercase px-9 py-4 my-4"
                        data-wizard-type="action-go-to-dashboard"
                      >
                        <b class="font-weight-medium">GOLD</b><br />
                        1.50 $
                      </button>
                      <button
                        style="width:160px;"
                        class="btn btn-primary font-weight-bold text-uppercase px-9 py-4 my-4"
                        data-wizard-type="action-go-to-dashboard"
                      >
                        <b class="font-weight-medium">P & L</b><br />
                        25,00 $
                      </button>

                      <button
                        style="width:160px;"
                        class="btn btn-primary font-weight-bold text-uppercase px-9 py-4 my-4"
                        data-wizard-type="action-go-to-dashboard"
                      >
                        <b class="font-weight-medium">PLAY</b><br />
                        <i class="icon-xl la la-play-circle"></i>
                      </button>
                      <button
                        style="width:160px;"
                        class="btn btn-primary font-weight-bold text-uppercase px-9 py-4 my-4"
                        data-wizard-type="action-go-to-dashboard"
                      >
                        <b class="font-weight-medium">PAUSA</b><br />
                        <i class="icon-xl la la-pause-circle"></i>
                      </button>
                    </b-col>
                    <b-col sm="10">
                      <b-row>CHART</b-row>
                    </b-col>
                  </b-row>
                </b-container>
              </div>
              <!--end: Wizard Step 3-->

              <!--begin: Wizard Step 4-->
              <div class="pb-5" data-wizard-type="step-content">
                <h4 class="mb-10 font-weight-bold text-dark">
                  Setup Your Delivery Location
                </h4>
              </div>
              <!--end: Wizard Step 4-->

              <!--begin: Wizard Step 5-->
              <div class="pb-5" data-wizard-type="step-content">
                <h4 class="mb-10 font-weight-bold text-dark">
                  Review your Details and Submit
                </h4>
              </div>
              <!--end: Wizard Step 5-->

              <!--begin: Wizard Actions -->
              <div class="d-flex justify-content-between border-top pt-10">
                <div class="mr-2">
                  <button
                    class="btn btn-success font-weight-bold text-uppercase px-9 py-4 mx-4" v-on:click="closeWizard"
                  >
                    Esci
                  </button>
                  <button
                    v-on:click="checkPriceLevel"
                    class="btn btn-light-primary font-weight-bold text-uppercase px-9 py-4"
                    data-wizard-type="action-prev"
                  >
                    Previous
                  </button>
                </div>
                <div>
                  <button
                    v-on:click="submit"
                    class="btn btn-success font-weight-bold text-uppercase px-9 py-4"
                    data-wizard-type="action-submit"
                  >
                    Submit
                  </button>
                  <button
                    v-on:click="checkPriceLevel"
                    :disabled="disableNextButton == 1"
                    :class="disableNextButton == 1 ? 'disabled' : ''"
                    class="btn btn-primary font-weight-bold text-uppercase px-9 py-4"
                    data-wizard-type="action-next"
                  >
                    Next Step
                  </button>
                </div>
              </div>
              <!--end: Wizard Actions -->
            </form>
            <!--end: Wizard Form-->
          </div>
        </div>
        <!--end: Wizard Body-->
      </div>
    </div>
    <!--end: Wizard-->
  </div>
</template>

<style lang="scss">
@import "@/assets/sass/pages/wizard/wizard-1.scss";
</style>

<script>
import { SET_BREADCRUMB } from "@/store/breadcrumbs.module";
import KTUtil from "@/assets/js/components/util";
import KTWizard from "@/assets/js/components/wizard";
import StrategyOverview from "@/view/content/widgets/mixed/StrategyOverview.vue";
import Swal from "sweetalert2";

var wizard = "";

export default {
  name: "Wizard-1",
  props: ['sector'],
  data() {
    return {
      strategy: {
        sector : 'ttttt'
      },
      button_active_state_1: false,
      button_active_state_2: false,
      button_active_state_3: false,
      disableNextButton: 0,
      wizard: null,
    }
  },
  components: {
    StrategyOverview
  },
  created() {
    console.log("ddd");
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [
      { title: "Wizard" },
      { title: "Wizard-1" }
    ]);

    // Initialize form wizard
    wizard = new KTWizard("kt_wizard_v1", {
      startStep: 1, // initial active step number
      clickableSteps: true // allow step clicking
    });

    // Validation before going to next page
    wizard.on("beforeNext", function(/*wizardObj*/) {
      // validate the form and use below function to stop the wizard's step
      // wizardObj.stop();
    });

    // Change event
    wizard.on("change", function(/*wizardObj*/) {
      setTimeout(() => {
        KTUtil.scrollTop();
      }, 500);
    });
    this.$data.strategy.sector=this.$parent.settore;
  },
  methods: {
    closeWizard: function() {
      this.$parent.showOnlyBoxes();
    },
    submit: function(e) {
      e.preventDefault();
      Swal.fire({
        title: "",
        text: "The application has been successfully submitted!",
        icon: "success",
        confirmButtonClass: "btn btn-secondary"
      });
    },
    checkPriceLevel: function() {
      // `this` inside methods points to the Vue instance
      if (
        wizard.getStep() == 1 &&
        !this.button_active_state_1 &&
        !this.button_active_state_2 &&
        !this.button_active_state_3
      ) {
        this.disableNextButton = 1;
      } else {
        this.disableNextButton = 0;
      }
    }
  }
};
</script>
<style scoped>
.i-am-active {
  border: solid 2px blue;
}
</style>
