<template>
  <div class="app">
    <div class="app-wrapper">
      <Inventory />
    </div>
  </div>
</template>

<script>
import Inventory from "@/components/Inventory.vue";

export default {
  name: "App",
  components: {
    Inventory,
  },
};
</script>
