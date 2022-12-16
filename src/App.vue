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

<style lang="scss">
@import url("https://cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.min.css");
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@500&display=swap");
@font-face {
  font-family: "SFProDisplay";
  src: local("SFProDisplay"),
    url("@/fonts/SFProDisplay-Regular.woff2") format("woff2");
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

.app {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #1e1e1e;
}

.app-wrapper {
  max-width: 880px;
  width: 100%;
  margin: 0 auto;
  padding: 0 15px;
  background-color: #1d1d1d;
}
</style>
