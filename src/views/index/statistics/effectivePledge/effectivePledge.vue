<template>
  <div class="wrap">
    <div class="main-box">
      <div class="title-wrap">
        <div class="title">{{$t('home.distributionOfEffectiveStake')}}</div>
      </div>
      <div class="chart-box" v-loading="loading">
        <Chart :option="option"></Chart>
      </div>
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
      loading: true,
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
            name: this.$t("home.effectIvestake"),
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
  watch: {
    "$i18n.locale": {
      handler: function() {
        this.option.series[0].name = this.$t("home.effectIvestake");
      }
    }
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
          this.loading = false;
          this.option.series[0].data = arr;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.wrap {
  height: calc(100vh - 5rem);
  background-color: #f8f8f8;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem 0;
  .title-wrap {
    color: #333333;
    font-weight: bold;
    padding-bottom: 1.5rem;
    .title {
      font-size: 2rem;
    }
  }
  .chart-box {
    padding: 1rem;
    width: 100%;
    height: 31rem;
    background-color: #fff;
    border-radius: 0.8rem;
    box-shadow: 0 0 1.5rem 0 rgba(#000000, 0.1);
  }
}
</style>