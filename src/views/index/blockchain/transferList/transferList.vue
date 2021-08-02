<template>
  <div class="block-wrap">
    <div class="main-box">
      <div class="title">{{$t('home.transferHistory')}}</div>
      <div class="from" v-if="$route.query">
        <span
          v-if="$route.query.blockNum"
        >{{$t('home.block')}} # {{ $route.query.blockNum }}（{{ pageData.total }}）</span>
        <div class="item-wrap" v-if="$route.query.accountDisplay">
          <div class="img-wrap">
            <img
              v-if="getAccountDisplay().judgements.length > 0"
              :src="require('@/assets/imgs/yanzhengren.png')"
            />
            <img v-else :src="require('@/assets/imgs/weiyanzheng.png')" />
            <div class="float">
              <span>
                {{
                getAccountDisplay().judgements.length > 0
                ? $t('home.identity1')
                : $t('home.identity2')
                }}
              </span>
            </div>
            <div class="arrow"></div>
          </div>
          <span>
            {{
            getAccountDisplay().display ||
            getAccountDisplay().address ||
            $route.query.accountAddress
            }}
            （{{ pageData.total }}）
          </span>
        </div>
      </div>
      <div class="chart-wrap-box" v-if="Object.keys($route.query).length == 0">
        <div class="chart-tab">
          <div
            class="tab-item click"
            :class="chartCurrent == 0 ? 'tab-active' : ''"
            @click="chartCurrent = 0"
          >1h</div>
          <div
            class="tab-item click"
            :class="chartCurrent == 1 ? 'tab-active' : ''"
            @click="chartCurrent = 1"
          >6h</div>
          <div
            class="tab-item click"
            :class="chartCurrent == 2 ? 'tab-active' : ''"
            @click="chartCurrent = 2"
          >1d</div>
        </div>
        <div class="chart" ref="chart">
          <Chart :option="option" v-loading="loading1"></Chart>
        </div>
      </div>
      <div class="table-wrap">
        <div class="table-head">
          <div class="left">{{$t('home.all')}}（{{ pageData.total }}）</div>
        </div>
        <Table :tableColumn="tableColumn" :tableData="tableData" :trColor="'#F1F0EE'"></Table>
      </div>
      <div class="page-wrap">
        <el-pagination
          :disabled="loading"
          background
          :page-size="pageData.pageSize"
          :layout="
            $store.state.bodyDirection == 1
              ? 'prev, pager, next'
              : 'total, sizes, prev, pager, next, jumper'
          "
          :pager-count="$store.state.bodyDirection == 1 ? 5 : 7"
          :total="pageData.total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
var barWidth = 20;
import * as echarts from "echarts";
import Chart from "@/components/chart.vue";
import Table from "@/components/tableStatus.vue";
import { getTransferListApi, getTransferLineApi } from "@/api/transfer.js";
export default {
  components: { Chart, Table },
  data() {
    return {
      loading: true,
      loading1: true,
      chartCurrent: 0,
      pageData: {
        pageSize: 10,
        page: 1,
        total: 0
      },
      tableColumn: [
        {
          title: this.$t("home.extrinsicIndex"),
          key: "extrinsicIndex",
          headColor: "#333333",
          color: "#4765C0",
          path: "/transactionDetail",
          query: ["blockNum", "extrinsicIndex", "extrinsicHash"],
          minWidth: 8
        },
        {
          title: this.$t("home.block"),
          key: "blockNum",
          color: "#4765C0",
          headColor: "#333333",
          path: "/blockDetail",
          query: ["blockNum"],
          minWidth: 8
        },
        {
          title: this.$t("home.time"),
          key: "blockTimestamp",
          color: "#333333",
          headColor: "#333333",
          minWidth: 10
        },
        {
          title: this.$t("home.from"),
          key: "from",
          color: "#4765C0",
          headColor: "#333333",
          path: "/accountDetail",
          query: [{ key: "accountAddress", value: "from" }],
          minWidth: 12
        },
        {
          title: this.$t("home.to"),
          key: "to",
          color: "#4765C0",
          headColor: "#333333",
          path: "/accountDetail",
          query: [{ key: "accountAddress", value: "to" }],
          minWidth: 12
        },
        {
          title: this.$t("home.results"),
          key: "success",
          color: "#333",
          headColor: "#333333",
          type: "status",
          minWidth: 6
        },
        {
          title: this.$t("home.transferTimes"),
          key: "amountTxt",
          color: "#333333",
          headColor: "#333333",
          unit: "CRU",
          minWidth: 10
        },
        {
          title: this.$t("home.extrinsicHash"),
          key: "hash",
          color: "#4765C0",
          headColor: "#333333",
          path: "/transactionDetail",
          query: ["blockNum", "extrinsicIndex", "extrinsicHash"],
          minWidth: 12
        }
      ],
      tableData: [],
      // option: {
      //   tooltip: {
      //     trigger: "axis"
      //   },
      //   grid: {
      //     top: "15%",
      //     left: "2%",
      //     right: "2%",
      //     bottom: "0%",
      //     containLabel: true
      //   },
      //   xAxis: {
      //     show: false,
      //     data: []
      //   },
      //   yAxis: {
      //     show: false
      //   },
      //   series: [
      //     {
      //       name: "金额",
      //       type: "bar",
      //       barWidth: barWidth,
      //       itemStyle: {
      //         color: "#C1BBD2",
      //         borderRadius: [100, 100, 0, 0]
      //       },
      //       emphasis: {
      //         itemStyle: {
      //           color: "#7D6DA9",
      //           shadowColor: "rgba(0,0,0,0.3)"
      //         }
      //       },
      //       data: []
      //     },
      //     {
      //       name: "次数",
      //       type: "bar",
      //       barWidth: barWidth,
      //       itemStyle: {
      //         color: "#E3E3E4",
      //         borderRadius: [0, 0, 100, 100]
      //       },
      //       emphasis: {
      //         itemStyle: {
      //           color: "#C1BBD2",
      //           shadowColor: "rgba(0,0,0,0.3)"
      //         }
      //       },
      //       data: []
      //     }
      //   ]
      // },
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
        xAxis: { type: "category", boundaryGap: false, data: [] },
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: this.$t("home.transferAmount"),
            type: "line",
            smooth: true,
            lineStyle: {
              color: "rgb(210,87,254)"
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
                  color: "rgba(210,87,254,.1)"
                }
              ])
            },
            emphasis: {
              focus: "series"
            },
            data: []
          },
          {
            name: this.$t("home.transferTimes"),
            type: "line",
            smooth: true,
            lineStyle: {
              color: "rgb(255, 87, 87)"
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(255, 0, 0, 0.4)"
                },
                {
                  offset: 1,
                  color: "rgba(255, 0, 0, 0.1)"
                }
              ])
            },
            emphasis: {
              focus: "series"
            },
            data: []
          }
        ]
      }
    };
  },
  watch: {
    chartCurrent() {
      this.option.xAxis.data = [];
      this.option.series[0].data = [];
      this.loading1 = true;
      if (Object.keys(this.$route.query).length == 0) this.getLine();
    },
    $route(to, from) {
      this.loading = true;
      this.loading1 = true;
      this.getList();
      if (Object.keys(this.$route.query).length == 0) this.getLine();
    },
    "$i18n.locale": {
      handler: function() {
        this.option.series[0].name = this.$t("home.transferAmount");
        this.option.series[1].name = this.$t("home.transferTimes");

        this.tableColumn[0].title = this.$t("home.extrinsicIndex");
        this.tableColumn[1].title = this.$t("home.block");
        this.tableColumn[2].title = this.$t("home.time");
        this.tableColumn[3].title = this.$t("home.from");
        this.tableColumn[4].title = this.$t("home.to");
        this.tableColumn[5].title = this.$t("home.results");
        this.tableColumn[6].title = this.$t("home.transferTimes");
        this.tableColumn[7].title = this.$t("home.extrinsicHash");
      }
    }
  },
  created() {
    this.getList();
    if (Object.keys(this.$route.query).length == 0) this.getLine();
  },
  methods: {
    getAccountDisplay() {
      return JSON.parse(this.$route.query.accountDisplay);
    },
    getList() {
      this.loading = true;
      getTransferListApi({
        address: this.$route.query.accountAddress || "",
        ...this.pageData
      }).then(res => {
        if (res.code == 200) {
          this.pageData.total = res.data.total;
          this.tableData = res.data.records;
        }
        this.loading = false;
      });
    },
    getLine() {
      var key = "transfer_count_1h";
      switch (this.chartCurrent) {
        case 0:
          var key = "transfer_count_1h";
          break;
        case 1:
          var key = "transfer_count_6h";
          break;
        case 2:
          var key = "transfer_count_1d";
          break;
        default:
          break;
      }
      getTransferLineApi(key).then(res => {
        if (res.code == 200) {
          res.data.map(item => {
            this.option.xAxis.data.push(item.timeStr);
            this.option.series[0].data.push(Number(item.amount));
            this.option.series[1].data.push(Number(item.totalTimes));
          });
        }
        this.loading1 = false;
      });
    },
    handleCurrentChange(val) {
      this.pageData.page = val;
      this.getList();
    },
    handleSizeChange(val) {
      this.pageData.pageSize = val;
      this.getList();
    }
  }
};
</script>

<style lang="scss" scoped>
.block-wrap {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 0 4rem;
  .title {
    font-size: 2rem;
    color: #333333;
    font-weight: bold;
  }
  .from {
    font-size: 1.4rem;
    columns: #333;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 1.2rem 0 2rem;
    > div {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    img {
      margin-right: 0.8rem;
      width: 1.4rem;
    }
    .img-wrap:hover {
      overflow: inherit;
      .float,
      .arrow {
        opacity: 1;
      }
    }
    .img-wrap {
      display: flex;
      align-items: center;
      position: relative;
      overflow: hidden;
      .arrow,
      .float {
        opacity: 0;
        position: absolute;
        z-index: 999;
        top: 0;
        bottom: 0;
        margin: auto;
      }
      .arrow {
        left: calc(100%);
        width: 0;
        height: 0;
        border-top: 0.5rem solid transparent;
        border-right: 0.6rem solid #fff;
        border-bottom: 0.5rem solid transparent;
      }
      .float {
        left: calc(100% + 0.6rem);
        height: 2.5rem;
        padding: 1.5rem;
        white-space: nowrap;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0.8rem;
        background-color: #fff;
        color: #333;
        font-size: 1rem;
        box-shadow: 0 0 0.8rem 0.2rem rgba(0, 0, 0, 0.1);
      }
    }
  }
  .chart-wrap-box {
    width: 100%;
    height: 22rem;
    border-radius: 0.8rem;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 1.5rem 0.2rem rgba(0, 0, 0, 0.1);
    position: relative;
    margin: 1rem 0;
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
        font-size: 1.3rem;
        color: #333333;
        border-radius: 1.5rem;
        padding: 0.4rem 0.8rem;
      }
      .tab-active {
        background-color: #fbd100;
      }
    }
  }
  .table-wrap {
    width: 100%;
    height: auto;
    border-radius: 0.8rem;
    box-shadow: 0 0 1.5rem 0.2rem rgba(0, 0, 0, 0.1);
    .table-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1.8rem;
      height: 5rem;
      .left {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        font-size: 1.3rem;
        color: #333333;
      }
      .el-input__inner {
        justify-content: space-between !important;
        border-radius: 0.8rem !important;
      }
    }
  }
  .page-wrap {
    margin-top: 1.8rem;
  }
}
::v-deep .el-pagination.is-background li:not(.disabled).active {
  background-color: #fbd100 !important; //修改后的背景图颜色
  color: #333 !important;
}
::v-deep .is-background li,
::v-deep .is-background .btn-prev,
::v-deep .is-background .btn-next {
  border-radius: 0.8rem !important;
  background-color: #fff !important;
  box-shadow: 0 0 0.8rem 0 rgba(0, 0, 0, 0.1) !important;
}
</style>