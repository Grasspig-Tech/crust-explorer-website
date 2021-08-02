<template>
  <div class="index-wrap" :style="{ height: scroll ? 'auto' : '100vh' }">
    <Header @openMenu="openMenu"></Header>
    <router-view></router-view>
  </div>
</template>

<script>
import Header from "@/components/header.vue";
export default {
  components: { Header },
  data() {
    return {
      scroll: true,
    };
  },
  created() {},
  methods: {
    openMenu(bool) {
      this.scroll = bool;
    },
  },
};
</script>

<style lang="scss" scoped>
.index-wrap {
  width: 100%;
  height: auto;
  overflow: hidden;
}
</style>