<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  created() {
    this.$store.commit("getVuethis", this);
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
// 点击鼠标形状
.click {
  cursor: pointer;
  color: #4765c0;
}
// 超过一行省略号
.one-line {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
}
// 超过两行省略号
.two-line {
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

// 文字不换行
.no-break-word {
  white-space: nowrap;
}

// 文字超出换行
.break-word {
  white-space: normal;
  overflow: hidden;
  word-break: break-all;
}

// 分页背景颜色
::v-deep .el-pagination.is-background li:not(.disabled).active {
  background-color: #fbd100 !important; //修改后的背景图颜色
  color: #333 !important;
}
::v-deep .is-background li,
::v-deep .is-background .btn-prev,
::v-deep .is-background .btn-next {
  border-radius: 10px !important;
  background-color: #fff !important;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1) !important;
}

// 最小宽度600px
@media only screen and (min-width: 600px) and (orientation: landscape) {
  body {
    // background-color: red;
  }
}
// 横屏
@media only screen and (orientation: landscape) {
  body {
    // background-color: lightblue;
  }
}
// 竖屏
@media only screen and (orientation: portrait) {
  body {
    // background-color: lightblue;
  }
}
</style>
