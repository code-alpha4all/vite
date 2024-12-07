<template>
  <div
    v-bind:style="{ width: width }"
    style="border-left: 1px solid lightslategray; border-right: 1px solid lightslategray;
             border-bottom: 1px solid lightslategray; margin-bottom: 0px;"
  >
    <tabs-box ref="tabsBox"></tabs-box>
  </div>
</template>

<script>
import tabsBox from "@/components/tabs-box";
import * as fb from "@/firebase";
import store from '@/store';

export default {
  name: "dashboard",
  components: {
    tabsBox,
  },
  beforeRouteEnter(to, from, next) {
  //  console.log("beforeRouteEnter() started.");
  //  console.log("to=", to);
  //  console.log("from=", from);
    
     console.log("Getting active tab from Firestore.");
   
      let user = store.state.user;
     // console.log("user=", user);

    fb.db.collection("tabs").doc(user.email).collection("activeModuleName").doc("activeModuleName-document")
                         .get().then((doc) => {
                          if (doc.exists) {
                              let activeModuleName = doc.data().activeModuleName;
                            //  console.log("activeModuleName=", activeModuleName);
                              let moduleArray = store.getters['moduleArray'];
                            //  console.log("moduleArray=", JSON.parse(JSON.stringify(moduleArray)));
                              let index = moduleArray.map(x => x.moduleName).indexOf(activeModuleName);
                            //  console.log("index=", index);
                              store.commit("setActiveModuleIndex", index);
                                  //  this.activeModuleIndex = 2;
          
                            } else {
                              // doc.data() will be undefined in this case
                              console.log("No such document!");
                            }
                            next();
                        }).catch((error) => {
                          console.log("Error getting document:", error);
                        });
  },
  mounted() {
     // console.log("mounted() starting.");
  },
  computed: {
    program() {
      // console.log("program() starting.");
      let activeModuleIndex = this.$store.state.activeModuleIndex;
      // console.log("activeModuleIndex=", activeModuleIndex);
      let program = null;
      let moduleArray = this.$store.getters["moduleArray"];
      // console.log("moduleArray=", moduleArray);
      if (typeof moduleArray[activeModuleIndex] !== "undefined") {
        program = moduleArray[activeModuleIndex].program;
      }
      // console.log("program=", program);
      return program;
    },
    width() {
      let width = "auto";
      if (
        ["Calculator", "Search", "StartPage", "TradeMaps"].includes(
          this.program
        )
      ) {
        /*width = "fit-content";*/ width = "100%";
      }
      //  console.log("width=", width);
      return width;
    },
  },
  methods: {
    /**
     * Set current active on click
     * @param event
     */
    setActiveTab(event) {
      // get all tab links
      const tab = event.target.closest('[role="tablist"]');
      const links = tab.querySelectorAll(".nav-link");
      // remove active tab links
      for (let i = 0; i < links.length; i++) {
        links[i].classList.remove("active");
      }

      // set current active tab
      event.target.classList.add("active");

      // set clicked tab index to bootstrap tab
      return parseInt(event.target.getAttribute("data-tab"));
    },
  },
};
</script>
