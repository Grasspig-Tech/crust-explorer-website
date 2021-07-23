<template>
  <div class="wrap">
    <div class="title-wrap">
      <div class="title">有效质押分布图</div>
    </div>
    <div class="chart-box">
      <Chart :option="option"></Chart>
    </div>
  </div>
</template>

<script>
import Chart from "@/components/chart.vue";
import { getEffectivePledgeApi } from "@/api/statistics.js";
export default {
  components: { Chart },
  data() {
    return {
      option: {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        grid: {
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          containLabel: true
        },
        series: [
          {
            name: "有效质押",
            type: "pie",
            radius: "50%",
            data: [],
            label: {
              color: "inherit"
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      }
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      getEffectivePledgeApi(1).then(res => {
        if (res.code == 200) {
          var arr = [];
          res.data.map(item => {
            arr.push({
              value: item.total * item.mapRatio,
              name: item.display || item.address
            });
          });
          this.option.series[0].data = arr;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.wrap {
  height: calc(100vh - 80px);
  background-color: #f8f8f8;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  .title-wrap {
    color: #333333;
    font-weight: bold;
    padding-bottom: 20px;
    .title {
      font-size: 30px;
    }
  }
  .chart-box {
    padding: 40px;
    width: 1190px;
    height: 500px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 0 20px 0 rgba(#000000, 0.1);
  }
}
</style>