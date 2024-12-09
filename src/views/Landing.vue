<template>
  <div style="margin: 10px">

     <div><h1 class="text-2xl">Guest Page   

     <button @click="logout()" class="bg-yellow-400 text-xs hover:bg-yellow-300 text-black font-bold m-2 py-2 px-4 rounded">
				LogOut
			</button>
      </h1></div>

           <span style="margin-right: 20px">Hello, {{name}}</span>
           <span style="margin-right: 20px">{{email}}</span>

  </div>
</template>

<script>

    export default {
      mounted(){
        console.log("Landing.vue mounted() starting.");
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
      this.$store.dispatch('logout')
    }
  }
    }    

  </script>
