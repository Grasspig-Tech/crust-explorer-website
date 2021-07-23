<template>
  <div class="block-wrap">
    <div class="table-wrap">
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
import { getBlockListApi } from "@/api/block.js";
export default {
  components: { Table },
  data() {
    return {
      loading: true,
      pageData: {
        pageSize: 20,
        page: 1,
        total: 0
      },
      tableColumn: [
        {
          title: "区块高度",
          key: "blockNum",
          headColor: "#333333",
          color: "#4765C0",
          path: "/blockDetail",
          query: ["blockNum"]
        },
        {
          title: "状态",
          key: "finalized",
          color: "#333333",
          headColor: "#333333",
          type: "status"
        },
        {
          title: "时间",
          key: "blockTimestamp",
          color: "#333333",
          headColor: "#333333"
        },
        {
          title: "交易数量",
          key: "extrinsicsCount",
          color: "#4765C0",
          headColor: "#333333",
          path: "/blockDetail",
          query: ["blockNum"]
        },
        {
          title: "事件数量",
          key: "eventCount",
          color: "#4765C0",
          headColor: "#333333",
          path: "/blockDetail",
          query: ["blockNum", { current: 2 }]
        },
        {
          title: "验证人",
          key: "accountDisplay",
          color: "#4765C0",
          headColor: "#333333",
          type: "img",
          path: "/verifierDetail",
          query: [{ key: "accountAddress", value: "validator" }]
        },
        {
          title: "区块哈希",
          key: "hash",
          color: "#4765C0",
          headColor: "#333333",
          path: "/blockDetail",
          query: ["blockNum"]
        },
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
      getBlockListApi(this.pageData).then(res => {
        if (res.code == 200) {
          this.pageData.total = res.data.total;
          this.tableData = res.data.records;
        }
        this.$nextTick(() => {
          this.loading = false;
        });
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
  padding: 50px 0;
  .table-wrap {
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