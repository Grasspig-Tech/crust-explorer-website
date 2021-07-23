<template>
  <div class="block-wrap">
    <div class="head-wrap">
      <div class="title">事件交易记录</div>
    </div>
    <div class="from" v-if="$route.query">
      <span v-if="$route.query.blockNum">区块 # {{$route.query.blockNum}}（{{pageData.total}}）</span>
    </div>
    <div class="table-wrap-box">
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
import Table from "@/components/tableStatus.vue";
import { getBlockEventApi } from "@/api/event.js";

export default {
  components: { Table },
  data() {
    return {
      loading: true,
      pageData: {
        pageSize: 10,
        page: 1,
        total: 0
      },
      tableColumn: [
        {
          title: "事件id",
          key: "eventIndex",
          headColor: "#333333",
          color: "#333"
        },
        {
          title: "区块",
          key: "blockNum",
          color: "#333",
          headColor: "#333333"
        },
        {
          title: "哈希",
          key: "extrinsicHash",
          color: "#4765C0",
          headColor: "#333333",
          path: "/transactionDetail",
          query: ["blockNum", "extrinsicIndex", "extrinsicHash"]
        },
        {
          title: "时间",
          key: "blockTimestamp",
          color: "#333",
          headColor: "#333333"
        }
      ],
      tableData: []
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      getBlockEventApi({
        blockNum: this.$route.query.blockNum,
        ...this.pageData
      }).then(res => {
        if (res.code == 200) {
          this.pageData.total = res.data.total;
          this.tableData = res.data.records;
        }
        this.loading = false;
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
  padding: 30px 0;
  .head-wrap {
    .title {
      font-size: 35px;
      color: #333333;
      font-weight: bold;
    }
  }
  .from {
    margin: 20px 0;
    font-size: 20px;
    color: #333;
  }
  .table-wrap-box {
    width: 1230px;
    height: auto;
    border-radius: 10px;
    box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.1);
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