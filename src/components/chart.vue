<style scoped lang="scss">
.chart-wrap {
  width: 100%;
  height: 100%;
  > div {
    width: 100%;
    height: 100%;
  }
}
</style>
<template>
  <div class="chart-wrap">
    <div :id="id"></div>
  </div>
</template>
 
<script>
export default {
  props: {
    option: {
      type: Object,
    },
    id: {
      type: String,
      default: "echart",
    },
  },
  data() {
    return {};
  },
  watch: {
    option: {
      handler() {
        this.drawChart();
      },
      deep: true,
    },
  },
  mounted() {
    this.drawChart();
  },
  methods: {
    drawChart() {
      let myChart = this.$echarts.init(document.getElementById(this.id));
      myChart.setOption(this.option);
      //建议加上以下这一行代码，不加的效果图如下（当浏览器窗口缩小的时候）。超过了div的界限（红色边框）
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
  },
};
</script>
 