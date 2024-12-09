<template>
  <span v-if="numberOfAjaxCalls > 0" style="margin: 0 0 0px 10px">

    <span v-if="$store.state.user.role === 'superadmin'" style="color: white">
      {{numberOfAjaxCalls}}
    </span>

      <b-spinner
        style="width: 1.5rem; height: 1.5rem; margin: 0px 6px 0px 0px"
        variant="primary"
        label="Spinner"
      ></b-spinner>
    </span>
</template>

<script>
    export default {
      computed: {
    numberOfAjaxCalls() {
      return this.$store.state.numberOfAjaxCalls;
    }
  }
};
</script>
