<template>
  <div class="topbar-item">
    <div
      class="
        btn btn-icon
        w-auto
        d-flex
        align-items-center
        btn-lg
        px-2
        dropdown-toggle
      "
      style="margin: -3px 10px 0 0; font-size: 1.2rem; color: white"
      id="kt_quick_user_toggle"
    >
      <span
        style="
          font-size: 1.2em;
          color: white;
          margin-right: 2px;
          padding-bottom: 5px;
        "
      >
                {{ $t('hello', { msg: 'hello' }) }},
      </span>
      <span
        style="
          font-size: 1.2em;
          color: white;
          margin: 0 2px 0 3px;
          padding-bottom: 5px;
        "
      >
        {{ name }}
      </span>
    </div>

    <div
      id="kt_quick_user"
      ref="kt_quick_user"
      class="offcanvas offcanvas-right p-10"
      style="width: 270px !important"
    >
      <!--begin::Header-->
      <div
        class="
          offcanvas-header
          d-flex
          align-items-center
          justify-content-between
        "
      >
        <h2 class="font-weight-bold m-0">User Profile</h2>
        <a
          href="#"
          class="btn btn-xs btn-icon btn-light btn-hover-primary"
          id="kt_quick_user_close"
        >
          <i class="ki ki-close icon-xs text-muted"></i>
        </a>
      </div>
       <div class="font-weight-bold h5">
        <h6  class="font-weight-bold m-0" style="margin-bottom: 8px">Version:&nbsp;v. 2.0.0 (20230503)</h6>
      </div>
      <!--end::Header-->

      <!--begin::Content-->
      <perfect-scrollbar
        class="offcanvas-content pr-5 mr-n5 scroll"
        style="max-height: 90vh; position: relative"
      >
        <!--begin::Header-->
        <div class="d-flex align-items-center mt-5">
          <div class="d-flex flex-column">
            <h2 class="font-weight-bold m-0 h2">
              {{ name }}
            </h2>
            <div class="navi mt-2">
              <a href="#" class="navi-item">
                <span class="navi-link p-0 pb-2">
                  <span class="navi-icon mr-1">
                    <span class="svg-icon svg-icon-lg svg-icon-primary">
                      <!--begin::Svg Icon-->
                      <inline-svg
                        src="media/svg/icons/Communication/Mail-notification.svg"
                      />
                      <!--end::Svg Icon-->
                    </span>
                  </span>
                  <span class="navi-text text-muted text-hover-primary h4">
                    {{ email }}
                  </span>
                </span>
              </a>
            </div>
            <button class="btn btn-light-primary btn-bold h4" @click="onLogout">
              Sign out
            </button>
          </div>
        </div>
        <!--end::Header-->
        <div class="separator separator-dashed mt-8 mb-5"></div>
        <!--begin::Nav-->
        <div class="navi navi-spacer-x-0 p-0">
          <!--begin::Item-->
          <div class="navi-link">
            
            <div class="navi-text" style="display: inline-flex">
              <div class="font-weight-bold h5">Your role is:&nbsp;</div>
              <div class="text-muted h5">{{ $store.state.user.role }}</div>
            </div>
          </div>
          <!--end:Item-->
        </div>

        <div v-if="['subscriber', 'superadmin'].includes($store.state.user.role)" class="separator separator-dashed mt-8 mb-5"></div>
        <div v-if="['subscriber', 'superadmin',''].includes($store.state.user.role)" class="navi navi-spacer-x-0 p-0">
          <!--begin::Item-->
          <div class="navi-link">
            <div class="navi-text" style="display: inline-flex">
              <div class="font-weight-bold h5">
                <button class="btn btn-light-success btn-bold h4" onClick="window.open('https://billing.stripe.com/p/login/cN2eWudEZ5cs1kk4gg', '_blank')">MANAGE YOUR SUBSCRIPTION</button>
              </div>
            </div>
          </div>
          <!--end:Item-->
        </div>
        
        <!--end::Nav-->

      </perfect-scrollbar>
      <!--end::Content-->
    </div>
  </div>
</template>

<style lang="scss" scoped>
#kt_quick_user {
  overflow: hidden;
}
</style>

<script>
import KTLayoutQuickUser from "@/assets/js/layout/extended/quick-user.js";
import KTOffcanvas from "@/assets/js/components/offcanvas.js";
import * as fb from '@/firebase';

export default {
  name: "KTQuickUser",
  mounted() {
    // Init Quick User Panel
    KTLayoutQuickUser.init(this.$refs["kt_quick_user"]);
  },
  data: function () {
            return {
                symbolOptions: [
                    {value: "new", text: "new"},
                    {value: "old", text: "old"}
                ]
            }
        },
  methods: {
    onLogout() {
      this.$store.dispatch("user/logout");
    },
    closeOffcanvas() {
      new KTOffcanvas(KTLayoutQuickUser.getElement()).hide();
    },
  },
  computed: {
    email() {
      return this.$store.state.user.email;
    },
    name() {
      return this.$store.state.user.name;
    },
    symbols: {
      get() {
        return this.$store.state.user.symbols;
      },
      set(symbols){
        //this.$store.commit("user/setSymbols", symbols);
        fb.usersCollection.doc(this.email)
                         .update({"symbols": symbols})
                         .then(() => {
                            console.log('symbols updated.')
                        });

      }
    }
  },
};
</script>
