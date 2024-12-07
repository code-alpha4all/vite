<template>
  <div style="margin-left: 5px">

     <div style="font-size: 1.5rem; margin-bottom: 25px">
     <button @click="logout()" style="border: 1px solid gray; background-color: white"
         class="bg-yellow-400 text-xs hover:bg-yellow-300 text-black font-bold m-2 py-2 px-4 rounded">
				LogOut
			</button>

     <button style="border: 1px solid gray; background-color: white" sz-
        class="bg-yellow-400 text-xs hover:bg-yellow-300 text-black font-bold m-2 py-2 px-4 rounded">
        <router-link to="/landing">Guest Page</router-link>
     </button>
     </div>

     <div style="margin-bottom: 20px">      <span style="margin-right: 20px; font-size: 16px">Hello, {{name}}</span>
           <span style="margin-right: 20px; font-size: 16px">{{email}}</span>
     </div>
    <div>
      <users></users>
    </div>
  </div>
</template>

<script>

 import users from '@/components/users.vue';

    export default {
        components: {
          users
        },
      mounted(){
        console.log("user-input.vue mounted() starting. users=", users);
      },
      computed: {
      name() {
          return this.$store.state.user.name;
      },
      email() {
          return this.$store.state.user.email;
      }
     },
     methods: {
        logout() {
          this.$store.dispatch('logout');
        }
      }
    }    

  </script>
