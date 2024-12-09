<template>
  <div class="d-flex flex-column flex-root">
    <div class="login login-2 login-signin-on d-flex flex-column flex-lg-row flex-column-fluid bg-white" id="kt_login">
        <!--begin::Aside-->
        <div class="login-aside order-1 order-lg-2 d-flex flex-column-fluid flex-lg-row-auto bgi-size-cover bgi-no-repeat p-7">
          <!--begin: Aside Container-->
          <div class="d-flex flex-row-fluid flex-column justify-content-between">
            <!--begin::Aside body-->
            <div class="d-flex flex-column-fluid flex-column flex-center mt-5 mt-lg-0">
              <a href="#" class="mb-15 text-center">
                <img src="media/logos/ScarrCharts-logo.png" class="max-h-75px" alt="">
              </a>
              <!--begin::Signin-->
              <div class="login-form login-signin">
                <div class="text-center mb-10 mb-lg-20">
                  <h2 class="font-weight-bold">Sign In</h2>
                  <p class="text-muted font-weight-bold">Enter your username and password</p>
                </div>
                <!--begin::Form-->
                  <div id="firebaseui-auth-container"></div>
                  <div id="loader" style="width: 100%; text-align: center; font-size: 18px; font-weight: bold; margin-top: 6px">Loading...</div>
              </div>
              <!--end::Signin-->
            </div>
            <!--end::Aside body-->
            <!--begin: Aside footer for desktop-->
            <div class="d-flex flex-column-auto justify-content-between mt-15">
              <div class="text-dark-50 font-weight-bold order-2 order-sm-1 my-2">© 2022 ScarrCharts</div>
              <div class="d-flex order-1 order-sm-2 my-2">
                <a href="#" class="text-muted text-hover-primary">Privacy</a>
                <a href="#" class="text-muted text-hover-primary ml-4">About Us</a>
              </div>
            </div>
            <!--end: Aside footer for desktop-->
          </div>
          <!--end: Aside Container-->
        </div>
        <!--begin::Aside-->
        <!--begin::Content-->
        <div class="order-2 order-lg-1 flex-column-auto flex-lg-row-fluid d-flex flex-column p-7" style="background-image: url('https://alpha4all.it/wp-content/uploads/2022/01/bg-chartslab.jpg');background-position:center">
          <!--begin::Content body-->
          <div class="d-flex flex-column-fluid flex-lg-center">
            <div class="d-flex flex-column justify-content-center">
              <h3 class="display-3 font-weight-bold my-7 text-white">Welcome to ScarrCharts</h3>
              <p class="font-weight-bold text-white opacity-80" style="font-size: 26px;">The ultimate platform for trading analysis</p>
            </div>
          </div>
          <!--end::Content body-->
        </div>
        <!--end::Content-->
      </div>
  </div>
</template>

<script>

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import * as firebaseui from 'firebaseui' // See https://github.com/isamu/firebase-vue-startup-kit/issues/1
import 'firebaseui/dist/firebaseui.css'
import * as fb from '@/firebase.js'
//import router from '@/router.js'

export default {
  name: 'LoginForm',
  mounted() {
    console.log('mounted() starting. firebaseui=', firebaseui);
    let moduleArray = this.$store.getters['moduleArray'];
    console.log('moduleArray=', moduleArray.slice());
    let moduleNameArray = moduleArray.map(x => x.moduleName);
    console.log('moduleNameArray=', moduleNameArray);

    moduleNameArray.forEach(x => {
      this.$store.unregisterModule(x);  
      console.log("unregistered: ", x);
    });  
    console.log('moduleArray=',  this.$store.getters['moduleArray']);

    let ui = firebaseui.auth.AuthUI.getInstance();
    if (!ui) {
      firebase.auth().languageCode = 'it';

      ui = new firebaseui.auth.AuthUI(firebase.auth());
    }
    let that = this;
    var uiConfig = {
      signInSuccessUrl: '/#/dashboard',
      callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
          console.log('authResult=', authResult)
          console.log('redirectUrl=', redirectUrl)
          document.getElementById('loader').style.display = 'block';

          let email = authResult.user.email
          let name = authResult.user.displayName
          console.log('email=', email)

          fb.usersCollection.doc(email).onSnapshot(doc=> {
            console.log('doc.data()=', doc.data())

            if (typeof doc.data() !== 'undefined') {
              that.$store.commit('user/setEmail', email);
              that.$store.commit('user/setName', name);
              that.$store.commit('user/setRole', doc.data().role);
              that.$store.commit('user/setShowTour', doc.data().showTour);
              that.$store.commit('user/setSymbols', doc.data().symbols);

              fb.usersCollection.doc(email)
                .update({
                  name: name,
                })
                .then(() => {
                  console.log("that.$store=", that.$store);

                /*  if (router.currentRoute.path === '/auth') {
                    router.push('/tabs').catch(() => {});
                  }*/
                });              
            }
          });

          // User successfully signed in.
          // Return type determines whether we continue the redirect automatically
          // or whether we leave that to developer to handle.
          return false
        },
        uiShown: function () {
          // The widget is rendered.
          // Hide the loader.
          document.getElementById('loader').style.display = 'none'
        },
      },
      // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
      signInFlow: 'popup',
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
      ]
    }
    ui.start('#firebaseui-auth-container', uiConfig)
  },
  data() {
    return {
      loginForm: {
        email: '',
        password: '',
      },
    }
  },
  methods: {
    login() {
      console.log(
        'login() starting. this.loginForm.password=',
        this.loginForm.password
      )
      this.$emit('do-login', {
        email: this.loginForm.email,
        password: this.loginForm.password,
      })
    },
    socialLogin() {
      firebase
        .auth()
        .getRedirectResult()
        .then(function (result) {
          this.showLoading = true
          if (result.credential) {
            var token = result.credential.accessToken
            console.log(token)
          }
          var user = result.user
          console.log(user)
        })
      this.showLoading = true
      const provider = new firebase.auth.GoogleAuthProvider()
      provider.addScope('profile')
      provider.addScope('email')
      firebase.auth().signInWithRedirect(provider)
    },
  },
}
</script>

<style lang="scss" module>
/* @import "@/components/cleanui/system/Auth/style.module.scss"; */
</style>
