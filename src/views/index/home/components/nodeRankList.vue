<template>
  <div class="rank-wrap">
    <div class="main-box">
      <div class="main">
        <div class="header click" @click="$router.push('/nodeRankList')">
          <span>推荐节点排行榜</span>
          <img :src="require('@/assets/imgs/more.png')" alt="更多" />
        </div>
        <div class="table-wrap">
          <Table :tableColumn="tableColumn" :tableData="tableData" :trColor="'#2f3346'"></Table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Table from "@/components/table.vue";
export default {
  components: { Table },
  data() {
    return {
      tableColumn: [
        {
          title: "节点",
          key: "node",
          headColor: "#fff",
          color: "#fff",
          minWidth: 8
        },
        {
          title: "连接数量",
          key: "connectNum",
          color: "#fff",
          headColor: "#fff",
          minWidth: 6
        },
        {
          title: "交易数量",
          key: "tradeNum",
          color: "#fff",
          headColor: "#fff",
          minWidth: 6
        },
        {
          title: "区块高度",
          key: "height",
          color: "#fff",
          headColor: "#fff",
          minWidth: 8
        },
        {
          title: "区块时间",
          key: "time",
          color: "#fff",
          headColor: "#fff",
          minWidth: 10
        }
      ],
      tableData: [
        {
          node: "pli2",
          time: "23823s",
          height: 283728,
          tradeNum: 2,
          connectNum: 1
        },
        {
          node: "pli2",
          time: "23823s",
          height: 283728,
          tradeNum: 2,
          connectNum: 1
        },
        {
          node: "pli2",
          time: "23823s",
          height: 283728,
          tradeNum: 2,
          connectNum: 1
        },
        {
          node: "pli2",
          time: "23823s",
          height: 283728,
          tradeNum: 2,
          connectNum: 1
        },
        {
          node: "pli2",
          time: "23823s",
          height: 283728,
          tradeNum: 2,
          connectNum: 1
        },
        {
          node: "pli2",
          time: "23823s",
          height: 283728,
          tradeNum: 2,
          connectNum: 1
        },
        {
          node: "pli2",
          time: "23823s",
          height: 283728,
          tradeNum: 2,
          connectNum: 1
        },
        {
          node: "pli2",
          time: "23823s",
          height: 283728,
          tradeNum: 2,
          connectNum: 1
        },
        {
          node: "pli2",
          time: "23823s",
          height: 283728,
          tradeNum: 2,
          connectNum: 1
        },
        {
          node: "pli2",
          time: "23823s",
          height: 283728,
          tradeNum: 2,
          connectNum: 1
        },
        {
          node: "pli2",
          time: "23823s",
          height: 283728,
          tradeNum: 2,
          connectNum: 1
        }
      ]
    };
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.rank-wrap {
  width: 100%;
  height: auto;
  padding: 2rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  .main {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .header {
      width: 100%;
      margin-bottom: 2rem;
      span {
        font-size: 2rem;
        color: #fff;
        margin-right: 1.8rem;
      }
      img {
        width: 1.5rem;
      }
    }
    .table-wrap {
      width: 100%;
      background-color: rgba(#252738, 0.7);
      border-radius: 0.8rem;
    }
  }
}
::v-deep .el-loading-mask {
  background-color: rgba(0, 0, 0, 0.3);
}
</style>