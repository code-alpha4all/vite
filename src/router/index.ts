import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useConfigStore } from "@/stores/config";
import * as fb from "@/firebase";
import { auth } from "@/firebase";
import store from "@/store";
import generalForm from "@/store/generalFormModule";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/landing",
    component: () => import("@/layouts/default-layout/DefaultLayout.vue"),
    meta: {
      // middleware: "auth",
      requiresAuth: true
    },
    children: [
      {
        path: "/landing",
        name: "landing",
        component: () => import("@/views/Landing.vue"),
        meta: {
          pageTitle: "landing",
          breadcrumbs: ["Landing"],
        },
      },
      {
        path: "/dashboard",
        name: "dashboard",
        component: () => import("@/views/Dashboard.vue"),
        meta: {
          pageTitle: "Dashboard",
          breadcrumbs: ["Dashboards"],
        },
      },



    ],


  },

  { path: "/auth", component: () => import("@/views/Auth.vue") },
  { path: "/success", component: () => import("@/views/Success.vue") },
  { path: "/cancel", component: () => import("@/views/Cancel.vue") },

  /*,
  {
    path: "/",
    component: () => import("@/layouts/AuthLayout.vue"),
    children: [
      {
        path: "/sign-in",
        name: "sign-in",
        component: () =>
          import("@/views/crafted/authentication/basic-flow/SignIn.vue"),
        meta: {
          pageTitle: "Sign In",
        },
      },
      {
        path: "/sign-up",
        name: "sign-up",
        component: () =>
          import("@/views/crafted/authentication/basic-flow/SignUp.vue"),
        meta: {
          pageTitle: "Sign Up",
        },
      },
      {
        path: "/password-reset",
        name: "password-reset",
        component: () =>
          import("@/views/crafted/authentication/basic-flow/PasswordReset.vue"),
        meta: {
          pageTitle: "Password reset",
        },
      },
    ],
  },
  {
    path: "/",
    component: () => import("@/layouts/SystemLayout.vue"),
    children: [
      {
        // the 404 route, when none of the above matches
        path: "/404",
        name: "404",
        component: () => import("@/views/crafted/authentication/Error404.vue"),
        meta: {
          pageTitle: "Error 404",
        },
      },
      {
        path: "/500",
        name: "500",
        component: () => import("@/views/crafted/authentication/Error500.vue"),
        meta: {
          pageTitle: "Error 500",
        },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
  },*/
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to) {
    // If the route has a hash, scroll to the section with the specified ID; otherwise, scroll toc the top of the page.
    if (to.hash) {
      return {
        el: to.hash,
        top: 80,
        behavior: "smooth",
      };
    } else {
      return {
        top: 0,
        left: 0,
        behavior: "smooth",
      };
    }
  },
});

router.beforeEach((to, from, next) => {
  let unsubscribe = fb.auth.onAuthStateChanged((firebaseUser) => {
    console.log("firebaseUser=", firebaseUser);
    console.log("to=", to);
    console.log("from=", from);
    unsubscribe();

    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
    console.log("requiresAuth=", requiresAuth);
    const isAuthenticated = fb.auth.currentUser;
    console.log("isAuthenticated=", isAuthenticated);

    if (firebaseUser !== null) {
      console.log("getting claims");
      firebaseUser.getIdTokenResult()
        .then(({ claims }) => {
          // console.log("claims=", claims);
          store.commit("user/setUid", claims.user_id);
        });

      store.dispatch("user/fetchUserProfile", firebaseUser).then(user => {
        console.log("then of fetchUserProfile, user=", user, " store.state.tabsInitialized=", store.state.tabsInitialized);

        if (!store.state.tabsInitialized) {
          store.commit("setTabsInitialized", true);   
   
          fb.db.collection("tabs").doc(user.email).collection("tabs")
            .get().then((querySnapshot) => {
              const stateArray = querySnapshot.docs.map((doc) => doc.data()).sort((a, b) => parseInt(a.moduleName.replace("generalFormTab", "")) > parseInt(b.moduleName.replace("generalFormTab", ""))? 1 : -1);
              console.log("stateArray=", JSON.parse(JSON.stringify(stateArray)));

              stateArray.forEach((module) => {
               // console.log("module.moduleName=", module.moduleName);
                //  console.log("module.tabTitle=", module.tabTitle);

                if (typeof store.state !== "undefined" && module.sampleContract.length > 0) {
                  store.registerModule(module.moduleName, generalForm);
                  store.commit(module.moduleName + "/setGeneralForm", module);
                  store.commit(module.moduleName + "/setModuleName", module.moduleName);  // This seems unnecessary.
                  store.commit(module.moduleName + "/setConstrainSampleContract", false);
                  store.dispatch(module.moduleName + "/getContractListsFromServer");

              /*    let index = store.getters["moduleNameArray"].length-1;
                  console.log("index=", index);
                  
                  setTimeout(() => {
                      store.commit("setActiveModuleIndex", index);
                  }, 1000);*/
                }
              });          
            });              
        }

        if (!["subscriber", "admin", "superadmin"].includes(user.role) && ["/exercises", "/playback"].includes(to.path)) {
          console.log("Going to landing page.");
          return next({ path: "/landing" });
        }

        if (!["superadmin"].includes(user.role) && ["/admin"].includes(to.path)) {
          console.log("Going to landing page.");
          return next({ path: "/landing" });
        }

        if ("subscriber" == user.role) {
          // Check Subscription
          var hasActiveSub = false;
          var subs = user.subscriptions;
          if (subs != undefined) {
            subs.forEach((el) => {
              let subData = el.data;
              if (el.name == "scarrcharts") {
                subData.forEach((el2) => {
                  let expirationDate = new Date(el2.expDate.seconds * 1000);
                  expirationDate.setDate(expirationDate.getDate() + 1);
                  let today = new Date();
                  if (!hasActiveSub && expirationDate >= today) {
                    hasActiveSub = true;
                  }
                });
              }
            });
          }
          if (!hasActiveSub) {
            store.commit("user/setRole", "guest");
          } else {
            // IT'S NECESSARY - DON'T REMOVE
            store.commit("user/setRole", "subscriber");
          }
        }



      });
    }else {
      console.log("else starting.");
      if (requiresAuth && !isAuthenticated) {
        console.log("redirecting to auth.");
       // next("/auth");
      } else {
        next();
      }
    }
  });
});

/*router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const configStore = useConfigStore();

  // current page view title
  document.title = `${to.meta.pageTitle} - ${import.meta.env.VITE_APP_NAME}`;

  // reset config to initial state
  configStore.resetLayoutConfig();

  // verify auth token before each page change
  authStore.verifyAuth();

  // before page access check if page requires authentication
  if (to.meta.middleware == "auth") {
    if (authStore.isAuthenticated) {
      next();
    } else {
      next({ name: "sign-in" });
    }
  } else {
    next();
  }
});*/

export default router;
