<template>
  <div style="margin: 10px">

     <div><h1 class="text-2xl">Admin Page     

     <button @click="logout()" style="border: 1px solid gray; background-color: white"
         class="bg-yellow-400 text-xs hover:bg-yellow-300 text-black font-bold m-2 py-2 px-4 rounded">
				LogOut
			</button>

     <button style="border: 1px solid gray; background-color: white" 
        class="bg-yellow-400 text-xs hover:bg-yellow-300 text-black font-bold m-2 py-2 px-4 rounded">
        <router-link to="/landing">Guest Page</router-link>
     </button>
      </h1></div>

           <span style="margin-right: 20px; font-size: 16px">Hello, {{name}}</span>
           <span style="margin-right: 20px; font-size: 16px">{{email}}</span>

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
        console.log("Admin.vue mounted() starting. users=", users);
      },
      computed: {
      name() {
          return this.$store.state.user.name;
      },
      email() {
          return this.$store.state.user.email;
      }
     },methods: {
        logout() {
          this.$store.dispatch('logout');
        }
      }
    }    

  </script>
