<template>
  <div class="row">
    <div class="col">
      {{ winrates }}
    </div>
  </div>
</template>

<script>
export default {
  name: "WinrateHeader",
  props: {
    winrates: {
      default: () => {
        return {}
      },
      type: Object
    },
  }
}
</script>

<style scoped>

</style>
