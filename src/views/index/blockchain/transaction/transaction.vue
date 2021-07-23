<template>
  <div class="block-wrap">
    <div class="title">历史交易记录</div>
    <div class="from" v-if="$route.query">
      <span v-if="$route.query.blockNum"
        >区块 # {{ $route.query.blockNum }}（{{ pageData.total }}）</span
      >
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
                  ? "身份等级：一般"
                  : "身份等级：未验证"
              }}
            </span>
          </div>
          <div class="arrow"></div>
        </div>
        <span
          >{{
            getAccountDisplay().display ||
            getAccountDisplay().address ||
            $route.query.accountAddress
          }}
          （{{ pageData.total }}）</span
        >
      </div>
    </div>
    <div class="chart-wrap-box" v-if="Object.keys($route.query).length == 0">
      <div class="chart-tab">
        <div
          class="tab-item click"
          :class="chartCurrent == 0 ? 'tab-active' : ''"
          @click="chartCurrent = 0"
        >
          1h
        </div>
        <div
          class="tab-item click"
          :class="chartCurrent == 1 ? 'tab-active' : ''"
          @click="chartCurrent = 1"
        >
          6h
        </div>
        <div
          class="tab-item click"
          :class="chartCurrent == 2 ? 'tab-active' : ''"
          @click="chartCurrent = 2"
        >
          1d
        </div>
      </div>
      <div class="chart">
        <Chart :option="option" v-loading="loading1"></Chart>
      </div>
    </div>
    <div class="table-wrap">
      <div class="table-head">
        <div class="left">全部（{{ pageData.total }}）</div>
        <!-- <div class="right">
          <div class="item">
            <label class="label">日期：</label>
            <el-date-picker
              v-model="screen.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </div>
          <div class="item">
            <label class="label">账户：</label>
            <div class="input-wrap">
              <input type="text" v-model="screen.account" placeholder="请输入您要输入的账户" />
              <img :src="require('@/assets/imgs/sousuo.png')" alt="搜索" />
            </div>
          </div>
          <div class="item">
            <el-button>筛选</el-button>
          </div>
        </div>-->
      </div>
      <Table
        :tableColumn="tableColumn"
        :tableData="tableData"
        :trColor="'#F1F0EE'"
      ></Table>
    </div>
    <div class="page-wrap">
      <el-pagination
        :disabled="loading"
        background
        :page-size="pageData.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageData.total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import Chart from "@/components/chart.vue";
import Table from "@/components/tableStatus.vue";
import {
  getExtrinsicListApi,
  getBlockExtrinsicApi,
  getExtrinsicLineApi,
} from "@/api/extrinsic.js";
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
        total: 0,
      },
      screen: {
        dateRange: "", //日期区间
        account: "", //账户
      },
      tableColumn: [
        {
          title: "交易id",
          key: "extrinsicIndex",
          headColor: "#333333",
          color: "#4765C0",
          path: "/transactionDetail",
          query: ["blockNum", "extrinsicIndex", "extrinsicHash"],
        },
        {
          title: "区块",
          key: "blockNum",
          color: "#4765C0",
          headColor: "#333333",
          path: "/blockDetail",
          query: ["blockNum"],
        },
        {
          title: "交易哈希",
          key: "extrinsicHash",
          color: "#4765C0",
          headColor: "#333333",
          path: "/transactionDetail",
          query: ["blockNum", "extrinsicIndex", "extrinsicHash"],
        },
        {
          title: "时间",
          key: "blockTimestamp",
          color: "#333",
          headColor: "#333333",
        },
        {
          title: "操作",
          key: "operation",
          color: "#333",
          headColor: "#333333",
        },
        {
          title: "结果",
          key: "success",
          color: "#333",
          headColor: "#333333",
          type: "status",
        },
      ],
      tableData: [],
      // option: {
      //   tooltip: {
      //     trigger: "axis"
      //   },
      //   grid: {
      //     top: "15%",
      //     left: "0%",
      //     right: "2%",
      //     bottom: "0%",
      //     containLabel: true
      //   },
      //   xAxis: {
      //     show: false,
      //     type: "category",
      //     data: []
      //   },
      //   yAxis: {
      //     show: false,
      //     type: "value"
      //   },
      //   series: [
      //     {
      //       name: "交易记录",
      //       type: "bar",
      //       barWidth: 20,
      //       itemStyle: {
      //         color: "#C1BBD2",
      //         borderRadius: [100, 100, 0, 0]
      //       },
      //       emphasis: {
      //         itemStyle: {
      //           color: "#7D6DA9"
      //         }
      //       },
      //       data: []
      //     }
      //   ]
      // },
      option: {
        tooltip: {
          trigger: "axis",
        },
        grid: {
          top: "20%",
          left: "3%",
          right: "3%",
          bottom: "5%",
          containLabel: true,
        },
        xAxis: { type: "category", boundaryGap: false, data: [] },
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "交易记录",
            type: "line",
            stack: "次数",
            smooth: true,
            lineStyle: {
              color: "#D357FF",
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(210,87,254,.4)",
                },
                {
                  offset: 1,
                  color: "rgba(56,49,193,.1)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: [],
          },
        ],
      },
    };
  },
  watch: {
    chartCurrent(val) {
      this.option.xAxis.data = [];
      this.option.series[0].data = [];
      if (Object.keys(this.$route.query).length == 0) this.getLine();
    },
    $route(to, from) {
      this.loading = true;
      this.loading1 = true;
      this.getList();
      if (Object.keys(this.$route.query).length == 0) this.getLine();
    },
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
      if (this.$route.query.blockNum) {
        getBlockExtrinsicApi({
          blockNum: this.$route.query.blockNum,
          ...this.pageData,
        }).then((res) => {
          if (res.code == 200) {
            this.pageData.total = res.data.total;
            this.tableData = res.data.records;
          }
          this.loading = false;
        });
      } else {
        getExtrinsicListApi({
          address: this.$route.query.accountAddress || "",
          ...this.pageData,
        }).then((res) => {
          if (res.code == 200) {
            this.pageData.total = res.data.total;
            this.tableData = res.data.records;
          }
          this.loading = false;
        });
      }
    },
    getLine() {
      var key = "extrinsic_count_1h";
      switch (this.chartCurrent) {
        case 0:
          var key = "extrinsic_count_1h";
          break;
        case 1:
          var key = "extrinsic_count_6h";
          break;
        case 2:
          var key = "extrinsic_count_1d";
          break;
        default:
          break;
      }
      getExtrinsicLineApi(key).then((res) => {
        if (res.code == 200) {
          res.data.map((item) => {
            this.option.xAxis.data.push(item.timeStr || "");
            this.option.series[0].data.push(item.totalTimes || 0);
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
    },
  },
};
</script>

<style lang="scss" scoped>
.block-wrap {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0 100px;
  .title {
    font-size: 35px;
    color: #333333;
    font-weight: bold;
    margin-bottom: 20px;
  }
  .from {
    font-size: 20px;
    columns: #333;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    > div {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    img {
      margin-right: 10px;
      width: 18px;
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
        border-top: 6px solid transparent;
        border-right: 10px solid #fff;
        border-bottom: 6px solid transparent;
      }
      .float {
        left: calc(100% + 10px);
        height: 40px;
        padding: 20px;
        white-space: nowrap;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 10px;
        background-color: #fff;
        color: #333;
        font-size: 14px;
        box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.1);
      }
      img {
        width: 18px;
        margin-right: 6px;
      }
    }
  }
  .chart-wrap-box {
    width: 1230px;
    height: 350px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.1);
    position: relative;
    margin-bottom: 10px;
    .chart {
      position: absolute;
      z-index: 1;
      width: 100%;
      height: 100%;
    }
    .chart-tab {
      position: relative;
      z-index: 2;
      height: 60px;
      display: flex;
      align-items: center;
      .tab-item {
        margin-left: 20px;
        font-size: 16px;
        color: #333333;
        border-radius: 20px;
        padding: 4px 10px;
      }
      .tab-active {
        background-color: #fbd100;
      }
    }
  }
  .table-wrap {
    width: 1230px;
    height: auto;
    border-radius: 10px;
    box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.1);
    .table-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 30px;
      height: 80px;
      .right {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 16px;
        color: #333333;
        .item {
          margin-left: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          .input-wrap {
            border: 1px solid #dcdfe6;
            border-radius: 10px;
            height: 40px;
            display: flex;
            align-items: center;
            padding: 0 10px;
            input {
              height: 100%;
              border: none;
              outline: 0;
              width: 150px;
            }
            img {
              width: 20px;
            }
          }
        }
      }
      .left {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        font-size: 16px;
        color: #333333;
      }
      .el-input__inner {
        justify-content: space-between !important;
        border-radius: 10px !important;
      }
    }
  }
  .page-wrap {
    margin-top: 30px;
  }
}
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
</style>