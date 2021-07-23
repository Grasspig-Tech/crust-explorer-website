<template>
  <div class="block-wrap">
    <div class="title">历史转账记录</div>
    <div class="chart-wrap-box">
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
      <div class="chart-box" ref="chart" style="background-color: #c27f7f;">
        <Chart :id="'echartone'" :option="option1" v-loading="loading1"></Chart>
      </div>
      <div class="chart-box" ref="chart" style="background-color: #7f9ac2;">
        <Chart :id="'echarttwo'" :option="option2" v-loading="loading1"></Chart>
      </div>
    </div>
    <div class="table-wrap">
      <div class="table-head">
        <div class="left">全部（{{ pageData.total }}）</div>
      </div>
      <Table :tableColumn="tableColumn" :tableData="tableData" :trColor="'#F1F0EE'"></Table>
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
var barWidth = 20;
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
          title: "交易id",
          key: "extrinsicIndex",
          headColor: "#333333",
          color: "#4765C0",
          path: "/transactionDetail",
          query: ["blockNum", "extrinsicIndex", "extrinsicHash"]
        },
        {
          title: "区块",
          key: "blockNum",
          color: "#4765C0",
          headColor: "#333333",
          path: "/blockDetail",
          query: ["blockNum"]
        },
        {
          title: "时间",
          key: "blockTimestamp",
          color: "#333333",
          headColor: "#333333"
        },
        {
          title: "转出自",
          key: "from",
          color: "#4765C0",
          headColor: "#333333"
        },
        {
          title: "转入至",
          key: "to",
          color: "#4765C0",
          headColor: "#333333"
        },
        {
          title: "结果",
          key: "success",
          color: "#4765C0",
          headColor: "#333333",
          type: "status"
        },
        {
          title: "数量",
          key: "amountTxt",
          color: "#333333",
          headColor: "#333333"
        },
        {
          title: "哈希",
          key: "hash",
          color: "#4765C0",
          headColor: "#333333",
          path: "/transactionDetail",
          query: ["blockNum", "extrinsicIndex", "extrinsicHash"]
        }
      ],
      tableData: [],
      option1: {
        tooltip: {
          trigger: "axis"
        },
        grid: {
          // top: "15%",
          left: "0%",
          right: "2%",
          // bottom: "0%",
          containLabel: true
        },
        xAxis: {
          show: false,
          data: []
        },
        yAxis: {
          show: false
        },
        series: [
          {
            name: "金额",
            type: "bar",
            barWidth: barWidth,
            itemStyle: {
              color: "#C1BBD2",
              borderRadius: [100, 100, 0, 0]
            },
            emphasis: {
              itemStyle: {
                color: "#7D6DA9",
                shadowColor: "rgba(0,0,0,0.3)"
              }
            },
            data: []
          }
        ]
      },
      option2: {
        tooltip: {
          trigger: "axis"
        },
        grid: {
          top: "50%",
          left: "0%",
          right: "2%",
          bottom: "0%",
          containLabel: true
        },
        xAxis: {
          show: false,
          data: []
        },
        yAxis: {
          show: false
        },
        series: [
          {
            name: "次数",
            type: "bar",
            barWidth: barWidth,
            itemStyle: {
              color: "#E3E3E4",
              borderRadius: [0, 0, 100, 100]
            },
            emphasis: {
              itemStyle: {
                color: "#C1BBD2",
                shadowColor: "rgba(0,0,0,0.3)"
              }
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
      this.getLine();
    }
  },
  created() {
    this.getList();
    this.getLine();
  },
  methods: {
    getList() {
      getTransferListApi(this.pageData).then(res => {
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
        console.log(111, res.data);
        if (res.code == 200) {
          res.data.map(item => {
            this.option1.xAxis.data.push(item.timeStr);
            this.option2.xAxis.data.push(item.timeStr);
            this.option1.series[0].data.push(Number(item.amount));
            this.option2.series[0].data.push(Number(item.totalTimes));
          });
        }
        barWidth = parseInt(
          this.$refs.chart.clientWidth / this.option1.series[0].data.length - 5
        );
        console.log(99, barWidth);
        this.loading1 = false;
      });
    },
    handleCurrentChange(val) {
      this.loading = true;
      this.pageData.page = val;
      this.getList();
    },
    handleSizeChange(val) {
      this.loading = true;
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
  padding: 40px 0 100px;
  .title {
    font-size: 35px;
    color: #333333;
    font-weight: bold;
    margin-bottom: 20px;
  }
  .chart-wrap-box {
    width: 1230px;
    height: 400px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.1);
    position: relative;
    margin-bottom: 10px;
    background-color: red;
    .chart-box {
      margin-bottom: 20px;
      width: 100%;
      height: 48%;
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