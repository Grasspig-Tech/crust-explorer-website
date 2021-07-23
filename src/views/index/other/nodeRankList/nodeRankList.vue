<template>
  <div class="wrap">
    <div class="main">
      <div class="header">
        <span>推荐节点排行榜</span>
      </div>
      <div class="table-wrap">
        <Table :tableColumn="tableColumn" :tableData="tableData" :trColor="'#F1F0EE'"></Table>
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
import Table from "@/components/table.vue";
export default {
  components: { Table },
  data() {
    return {
      loading: true,
      pageData: {
        pageSize: 10,
        pageCount: 1,
        total: 1000
      },
      tableColumn: [
        {
          title: "节点",
          key: "node",
          headColor: "#333",
          color: "#333"
        },
        {
          title: "连接数量",
          key: "connectNum",
          color: "#333",
          headColor: "#333"
        },
        {
          title: "交易数量",
          key: "tradeNum",
          color: "#333",
          headColor: "#333"
        },
        {
          title: "区块高度",
          key: "height",
          color: "#333",
          headColor: "#333"
        },
        {
          title: "区块时间",
          key: "time",
          color: "#333",
          headColor: "#333"
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
  methods: {
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
.wrap {
  width: 100%;
  height: auto;
  padding: 60px 0;
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
      margin-bottom: 30px;
      span {
        font-size: 35px;
        color: #333;
        font-weight: bold;
      }
    }
    .table-wrap {
      width: 100%;
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
      border-radius: 10px;
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