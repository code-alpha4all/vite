<template>
    <div style="width: fit-content; font-size: 12px; background-color: white; padding: 5px">

        <h2 style="margin-top: 8px">Get Started</h2>
        Press the "<b>+ add tab</b>" below or click 

          <h2 style="margin-top: 15px">Features</h2>

    <ul style="font-size:12px; font-weight: normal; margin-left: 5px">
      <li>All your tabs will be saved but only to the browser you were using.</li>
      <li>Chart saved using the "Saved Charts" button are available on any browser on any device.</li>
    </ul>

    </div>
</template>

<script>

    export default {
        mounted() {
            console.log("start-page-input.vue mounted() starting.");
        },
        props: ['namespace'],
        data: function () {
            return {}
        }
    };

</script>
