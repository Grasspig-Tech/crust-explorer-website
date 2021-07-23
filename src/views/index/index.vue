<template>
  <div class="index-wrap">
    <Header></Header>
    <router-view></router-view>
  </div>
</template>

<script>
import Header from "@/components/header.vue";
export default {
  components: { Header },
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.index-wrap {
  min-height: auto;
}
</style>