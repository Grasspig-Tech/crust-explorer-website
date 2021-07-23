<template>
  <div class="data-wrap">
    <div class="bottom-wrap">
      <div class="pledge-wrap">
        <div class="title click" @click="goPath('/effectivePledge',2,0)">
          <span>有效质押分布</span>
          <img :src="require('@/assets/imgs/more.png')" alt="更多" />
        </div>
        <div class="content">
          <Chart :option="option"></Chart>
        </div>
      </div>
      <div class="block-wrap">
        <div class="title click" @click="goPath('/blockList',1,0)">
          <span>最新区块</span>
          <img :src="require('@/assets/imgs/more.png')" alt="更多" />
        </div>
        <div class="content">
          <Table :tableColumn="tableColumn" :tableData="tableData" :trColor="'#2f3346'"></Table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from "@/components/chart.vue";
import Table from "@/components/tableStatus.vue";
import { getBlockListApi } from "@/api/block.js";
import { getEffectivePledgeApi } from "@/api/statistics.js";

export default {
  components: { Chart, Table },
  props: ["blockList"],
  data() {
    return {
      newDataList: [],
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
      },
      tableColumn: [
        {
          title: "区块高度",
          key: "blockNum",
          headColor: "#fff",
          color: "#F9D007",
          width: 80,
          path: "/blockDetail",
          query: ["blockNum"]
        },
        {
          title: "状态",
          key: "finalized",
          color: "#fff",
          headColor: "#fff",
          type: "status",
          width: 60
        },
        {
          title: "时间",
          key: "blockTimestamp",
          color: "#fff",
          headColor: "#fff",
          width: 90
        },
        {
          title: "交易",
          key: "extrinsicsCount",
          color: "#F9D007",
          headColor: "#fff",
          width: 50,
          path: "/blockDetail",
          query: ["blockNum"]
        },
        {
          title: "事件",
          key: "eventCount",
          color: "#F9D007",
          headColor: "#fff",
          width: 50,
          path: "/blockDetail",
          query: ["blockNum", { current: 2 }]
        },
        {
          title: "验证人",
          key: "accountDisplay",
          color: "#F9D007",
          headColor: "#fff",
          type: "img",
          path: "/verifierDetail",
          query: [{ key: "accountAddress", value: "validator" }]
        },
        {
          title: "区块哈希",
          key: "hash",
          color: "#F9D007",
          headColor: "#fff",
          path: "/blockDetail",
          query: ["blockNum"]
        }
      ],
      tableData: []
    };
  },
  watch: {
    blockList(val) {
      this.tableData = [...val];
    }
  },
  created() {
    this.getBlockList();
    this.getData();
  },
  methods: {
    goPath(path, index, i) {
      this.$router.push(path);
      this.$store.commit("changeHeadTab", { index, i });
    },
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
    },
    getBlockList() {
      getBlockListApi({ pageSize: 10, page: 1 }).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.records;
        }
        this.loading = false;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.data-wrap {
  padding: 0 0 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .bottom-wrap {
    width: 1230px;
    display: flex;
    justify-content: space-between;
    > div {
      border-radius: 10px;
      background-color: rgba(#2f3346, 0.7);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .title {
        padding: 18px 20px 10px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        span {
          font-size: 22px;
          color: #fff;
        }
        img {
          width: 20px;
        }
      }
      .content {
        width: 100%;
        height: 450px;
      }
    }
    .pledge-wrap {
      width: 520px;
      .content {
        padding-bottom: 40px;
      }
    }
    .block-wrap {
      width: 690px;
    }
  }
}
::v-deep .el-loading-mask {
  background-color: rgba(0, 0, 0, 0.3);
}
</style>