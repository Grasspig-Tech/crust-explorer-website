<template>
  <div class="rank-wrap">
    <div class="main">
      <div class="header">
        <div class="title">
          {{
          current == 1
          ? "当前验证人"
          : current == 2
          ? "候选验证人"
          : current == 3
          ? "提名人"
          : ""
          }}
        </div>
        <div class="text" v-if="current == 3">区块#2387293(20)</div>
      </div>
      <div class="table-box">
        <Table
          :tableColumn="
            current == 1
              ? tableColumn1
              : current == 2
              ? tableColumn2
              : current == 3
              ? tableColumn3
              : ''
          "
          :tableData="tableData"
          :trColor="'#F1F0EE'"
        ></Table>
      </div>
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
import Table from "@/components/tableOrder.vue";
export default {
  components: { Table },
  data() {
    return {
      loading: true,
      current: 1,
      pageData: {
        pageSize: 10,
        pageCount: 1,
        total: 1000
      },
      tableColumn1: [
        {
          title: "排名",
          key: "order",
          headColor: "#333",
          color: "#333"
        },
        {
          title: "验证人",
          key: "verifier",
          color: "#4765C0",
          headColor: "#333"
        },
        {
          title: "验证人有效质押量",
          key: "verifierNum",
          color: "#333",
          headColor: "#333"
        },
        {
          title: "质押总量",
          key: "total",
          color: "#333",
          headColor: "#333"
        },
        {
          title: "全网冻结",
          key: "frozen",
          color: "#333",
          headColor: "#333"
        },
        {
          title: "提名人",
          key: "nominator",
          color: "#333",
          headColor: "#333"
        },
        {
          title: "扣留费率",
          key: "detentionRate",
          color: "#333",
          headColor: "#333"
        },
        {
          title: "时代指数",
          key: "timeIndex",
          color: "#333",
          headColor: "#333"
        }
      ],
      tableColumn2: [
        {
          title: "排名",
          key: "order",
          headColor: "#333",
          color: "#333"
        },
        {
          title: "验证人",
          key: "verifier",
          color: "#4765C0",
          headColor: "#333"
        },
        {
          title: "验证人冻结",
          key: "verifierFrozen",
          color: "#333",
          headColor: "#333"
        },
        {
          title: "全网冻结",
          key: "frozen",
          color: "#333",
          headColor: "#333"
        },
        {
          title: "提名人",
          key: "nominator",
          color: "#333",
          headColor: "#333"
        },
        {
          title: "扣留费率",
          key: "detentionRate",
          color: "#333",
          headColor: "#333"
        }
      ],
      tableColumn3: [
        {
          title: "排名",
          key: "order",
          headColor: "#333",
          color: "#333"
        },
        {
          title: "提名人",
          key: "nominator",
          headColor: "#333",
          color: "#333"
        },
        {
          title: "投票",
          key: "vote",
          color: "#333",
          headColor: "#333"
        },
        {
          title: "份额",
          key: "share",
          color: "#333",
          headColor: "#333"
        }
      ],
      tableData: [
        {
          verifier: "248712984",
          verifierNum: "shishoiwqe",
          total: "23293829",
          frozen: "282938",
          verifierFrozen: "282938",
          nominator: 9832,
          detentionRate: "40%",
          timeIndex: 2382,
          latestBlock: 138103,
          share: "40%",
          vote: "2312 CRU",
          nominator: "28iwiw"
        },
        {
          verifier: "248712984",
          verifierNum: "shishoiwqe",
          total: "23293829",
          frozen: "282938",
          verifierFrozen: "282938",
          nominator: 9832,
          detentionRate: "40%",
          timeIndex: 2382,
          latestBlock: 138103,
          share: "40%",
          vote: "2312 CRU",
          nominator: "28iwiw"
        },
        {
          verifier: "248712984",
          verifierNum: "shishoiwqe",
          total: "23293829",
          frozen: "282938",
          verifierFrozen: "282938",
          nominator: 9832,
          detentionRate: "40%",
          timeIndex: 2382,
          latestBlock: 138103,
          share: "40%",
          vote: "2312 CRU",
          nominator: "28iwiw"
        },
        {
          verifier: "248712984",
          verifierNum: "shishoiwqe",
          total: "23293829",
          frozen: "282938",
          verifierFrozen: "282938",
          nominator: 9832,
          detentionRate: "40%",
          timeIndex: 2382,
          latestBlock: 138103,
          share: "40%",
          vote: "2312 CRU",
          nominator: "28iwiw"
        },
        {
          verifier: "248712984",
          verifierNum: "shishoiwqe",
          total: "23293829",
          frozen: "282938",
          verifierFrozen: "282938",
          nominator: 9832,
          detentionRate: "40%",
          timeIndex: 2382,
          latestBlock: 138103,
          share: "40%",
          vote: "2312 CRU",
          nominator: "28iwiw"
        },
        {
          verifier: "248712984",
          verifierNum: "shishoiwqe",
          total: "23293829",
          frozen: "282938",
          verifierFrozen: "282938",
          nominator: 9832,
          detentionRate: "40%",
          timeIndex: 2382,
          latestBlock: 138103,
          share: "40%",
          vote: "2312 CRU",
          nominator: "28iwiw"
        },
        {
          verifier: "248712984",
          verifierNum: "shishoiwqe",
          total: "23293829",
          frozen: "282938",
          verifierFrozen: "282938",
          nominator: 9832,
          detentionRate: "40%",
          timeIndex: 2382,
          latestBlock: 138103,
          share: "40%",
          vote: "2312 CRU",
          nominator: "28iwiw"
        },
        {
          verifier: "248712984",
          verifierNum: "shishoiwqe",
          total: "23293829",
          frozen: "282938",
          verifierFrozen: "282938",
          nominator: 9832,
          detentionRate: "40%",
          timeIndex: 2382,
          latestBlock: 138103,
          share: "40%",
          vote: "2312 CRU",
          nominator: "28iwiw"
        },
        {
          verifier: "248712984",
          verifierNum: "shishoiwqe",
          total: "23293829",
          frozen: "282938",
          verifierFrozen: "282938",
          nominator: 9832,
          detentionRate: "40%",
          timeIndex: 2382,
          latestBlock: 138103,
          share: "40%",
          vote: "2312 CRU",
          nominator: "28iwiw"
        },
        {
          verifier: "248712984",
          verifierNum: "shishoiwqe",
          total: "23293829",
          frozen: "282938",
          verifierFrozen: "282938",
          nominator: 9832,
          detentionRate: "40%",
          timeIndex: 2382,
          latestBlock: 138103,
          share: "40%",
          vote: "2312 CRU",
          nominator: "28iwiw"
        }
      ]
    };
  },
  created() {
    this.current = this.$route.query.current || 1;
  },
  methods: {
    changeTab(current) {
      this.current = current;
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
.rank-wrap {
  width: 100%;
  padding: 40px 0;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .main {
    width: 1230px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .header {
      width: 100%;

      .title {
        font-size: 35px;
        font-weight: bold;
      }
      .text {
        font-size: 22px;
        color: #9a9a9a;
        margin-top: 10px;
      }
    }
    .table-box {
      width: 100%;
      margin: 30px 0 50px;
      border-radius: 10px;
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    }
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