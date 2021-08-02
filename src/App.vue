<template>
  <div id="app" :style="{ width: width - 1 + 'px' }">
    <router-view v-if="isRouterAlive" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      width: document.body.offsetWidth,
      height: document.body.offsetHeight,
      isRouterAlive: true
    };
  },
  watch: {
    "$store.state.bodyDirection": {
      handler(val) {
        this.isRouterAlive = false;
        this.$nextTick(() => {
          this.isRouterAlive = true;
        });
      },
      deep: true
    }
  },
  created() {
    this.$store.commit("getVuethis", this);
  },
  mounted() {
    this.changeData();
    window.onresize = () => {
      this.width = document.body.offsetWidth;
      this.changeData();
    };
  },
  methods: {
    changeData() {
      if (
        window.orientation == undefined ||
        window.orientation == 90 ||
        window.orientation == -90
      ) {
        this.$store.commit("changeBodyData", {
          bodyDirection: 0,
          bodyWidth: document.body.offsetWidth
        });
        if (
          document.documentElement.clientWidth <
          document.documentElement.clientHeight
        ) {
          this.$store.commit("changeBodyData", {
            bodyDirection: 1
          });
        } else {
          this.$store.commit("changeBodyData", {
            bodyDirection: 0
          });
        }
      }
      if (window.orientation == 180 || window.orientation == 0)
        this.$store.commit("changeBodyData", {
          bodyDirection: 1,
          bodyWidth: document.body.offsetWidth
        });
      console.log(this.$store.state.bodyDirection, this.$store.state.bodyWidth);
    }
  },
  destroyed() {
    window.onresize = null;
  }
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
  font-size: inherit;
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

// 横屏 =======================
// 横屏 // 大于1920 -> 正常PC
@media only screen and (min-width: 1920px) and (orientation: landscape) {
  html {
    font-size: 15px;
  }
  .main-box {
    width: 70% !important;
  }
}
// 横屏 // 大于1522小于1920 -> 正常PC
@media only screen and (min-width: 1522px) and (max-width: 1920px) and (orientation: landscape) {
  html {
    font-size: 14px;
  }
  .main-box {
    width: 75% !important;
  }
}
// 横屏 // 大于1024小于1550 -> PC
@media only screen and (min-width: 1024px) and (max-width: 1550px) and (orientation: landscape) {
  html {
    font-size: 13px;
  }
  .main-box {
    width: 90% !important;
  }
}
// 横屏 // 小于1024 -> PC
@media only screen and (max-width: 1024px) and (orientation: landscape) {
  html {
    font-size: 12px;
  }
  .main-box {
    width: 100% !important;
    padding: 0 2rem !important;
  }
}

// 竖屏 =======================
// 竖屏 // 大于780 小于1024
@media only screen and (min-width: 780px) and (max-width: 1024px) and (orientation: portrait) {
  html {
    font-size: 18px;
  }
  .main-box {
    width: 100% !important;
    padding: 0 2rem !important;
  }
}
// 竖屏 // 大于540 小于780
@media only screen and (min-width: 540px) and (max-width: 780px) and (orientation: portrait) {
  html {
    font-size: 16px;
  }
  .main-box {
    width: 100% !important;
    padding: 0 2rem !important;
  }
}
// 竖屏 // 大于420 小于540
@media only screen and (min-width: 420px) and (max-width: 540px) and (orientation: portrait) {
  html {
    font-size: 12px;
  }
  .main-box {
    width: 100% !important;
    padding: 0 1rem !important;
  }
}

// 竖屏 // 大于360 小于420
@media only screen and (min-width: 360px) and (max-width: 420px) and (orientation: portrait) {
  html {
    font-size: 12px;
  }
  .main-box {
    width: 100% !important;
    padding: 0 1rem !important;
  }
}

// 竖屏 // 小于360 大于320
@media only screen and (min-width: 320px) and (max-width: 360px) and (orientation: portrait) {
  html {
    font-size: 10px;
  }
  .main-box {
    width: 100% !important;
    padding: 0 1rem !important;
  }
}

// 竖屏 // 小于320
@media only screen and (max-width: 320px) and (orientation: portrait) {
  html {
    font-size: 10px;
  }
  .main-box {
    width: 100% !important;
    padding: 0 1rem !important;
  }
}
</style>
