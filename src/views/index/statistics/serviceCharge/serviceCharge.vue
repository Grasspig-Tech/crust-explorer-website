<template>
  <div class="block-wrap">
    <div class="main-box">
      <div class="title">基础费率走势</div>
      <div class="chart-wrap-box">
        <div class="chart-tab">
          <div
            class="tab-item click"
            :class="chartCurrent==0?'tab-active':''"
            @click="chartCurrent=0"
          >24小时</div>
          <div
            class="tab-item click"
            :class="chartCurrent==1?'tab-active':''"
            @click="chartCurrent=1"
          >7天</div>
          <div
            class="tab-item click"
            :class="chartCurrent==2?'tab-active':''"
            @click="chartCurrent=2"
          >30天</div>
          <div
            class="tab-item click"
            :class="chartCurrent==3?'tab-active':''"
            @click="chartCurrent=3"
          >1年</div>
        </div>
        <div class="chart">
          <Chart :option="option"></Chart>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import Chart from "@/components/chart.vue";
import Table from "@/components/tableStatus.vue";
export default {
  components: { Chart, Table },
  data() {
    return {
      chartCurrent: 0,
      option: {
        tooltip: {
          trigger: "axis"
        },
        grid: {
          top: "20%",
          left: "3%",
          right: "3%",
          bottom: "5%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "基础费率走势",
            type: "line",
            stack: "总量",
            smooth: true,
            lineStyle: {
              color: "#D357FF"
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(210,87,254,.4)"
                },
                {
                  offset: 1,
                  color: "rgba(56,49,193,.1)"
                }
              ])
            },
            emphasis: {
              focus: "series"
            },
            data: [140, 232, 101, 264, 90, 340, 250]
          }
        ]
      }
    };
  },
  watch: {
    chartCurrent(val) {}
  },
  created() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
.block-wrap {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 0 4rem;
  .title {
    font-size: 2rem;
    color: #333333;
    font-weight: bold;
    margin-bottom: 1.5rem;
  }
  .chart-wrap-box {
    width: 100%;
    height: 31rem;
    border-radius: .8rem;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 1.5rem .2rem rgba(0, 0, 0, 0.1);
    position: relative;
    margin-bottom: .8rem;
    .chart {
      position: absolute;
      z-index: 1;
      width: 100%;
      height: 100%;
    }
    .chart-tab {
      position: relative;
      z-index: 2;
      height: 3.5rem;
      display: flex;
      align-items: center;
      .tab-item {
        margin-left: 1.5rem;
        font-size: 1rem;
        color: #333333;
        border-radius: 1.5rem;
        padding: .3rem .8rem;
      }
      .tab-active {
        background-color: #fbd100;
      }
    }
  }
}
</style>