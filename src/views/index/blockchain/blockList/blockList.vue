<template>
  <div class="block-wrap">
    <div class="main-box">
      <div class="table-wrap">
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
          title: this.$t("home.blocks"),
          key: "blockNum",
          headColor: "#333333",
          color: "#4765C0",
          path: "/blockDetail",
          query: ["blockNum"],
          minWidth: 8
        },
        {
          title: this.$t("home.status"),
          key: "finalized",
          color: "#333333",
          headColor: "#333333",
          type: "status",
          minWidth: 6
        },
        {
          title: this.$t("home.time"),
          key: "blockTimestamp",
          color: "#333333",
          headColor: "#333333",
          minWidth: 10
        },
        {
          title: this.$t("home.numberOfExtrinsics"),
          key: "extrinsicsCount",
          color: "#4765C0",
          headColor: "#333333",
          path: "/blockDetail",
          query: ["blockNum"],
          minWidth: 6
        },
        {
          title: this.$t("home.numberOfEvents"),
          key: "eventCount",
          color: "#4765C0",
          headColor: "#333333",
          path: "/blockDetail",
          query: ["blockNum", { current: 2 }],
          minWidth: 6
        },
        {
          title: this.$t("home.validators"),
          key: "accountDisplay",
          color: "#4765C0",
          headColor: "#333333",
          type: "img",
          path: "/verifierDetail",
          query: [{ key: "accountAddress", value: "validator" }],
          minWidth: 12
        },
        {
          title: this.$t("home.blockHash"),
          key: "hash",
          color: "#4765C0",
          headColor: "#333333",
          path: "/blockDetail",
          query: ["blockNum"],
          minWidth: 12
        }
      ],
      tableData: []
    };
  },
  created() {
    this.getList();
  },
  watch: {
    "$i18n.locale": {
      handler: function() {
        this.tableColumn[0].title = this.$t("home.blocks");
        this.tableColumn[1].title = this.$t("home.status");
        this.tableColumn[2].title = this.$t("home.time");
        this.tableColumn[3].title = this.$t("home.numberOfExtrinsics");
        this.tableColumn[4].title = this.$t("home.numberOfEvents");
        this.tableColumn[5].title = this.$t("home.validators");
        this.tableColumn[6].title = this.$t("home.blockHash");
      }
    }
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
  padding: 2rem 0;
  .table-wrap {
    width: 100%;
    height: auto;
    border-radius: 0.8rem;
    box-shadow: 0 0 1.5rem 0.2rem rgba(0, 0, 0, 0.1);
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