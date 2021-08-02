<template>
  <div class="block-wrap">
    <div class="main-box">
      <div class="head-wrap">
        <div class="title">{{$t('home.eventRecord')}}</div>
      </div>
      <div class="from" v-if="$route.query">
        <span
          v-if="$route.query.blockNum"
        >{{$t('home.block')}} # {{$route.query.blockNum}}（{{pageData.total}}）</span>
      </div>
      <div class="table-wrap-box">
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
          title: this.$t("home.eventIndex"),
          key: "eventIndex",
          headColor: "#333333",
          color: "#333",
          minWidth: 8
        },
        {
          title: this.$t("home.block"),
          key: "blockNum",
          color: "#333",
          headColor: "#333333",
          minWidth: 8
        },
        {
          title: this.$t("home.extrinsicHash"),
          key: "extrinsicHash",
          color: "#4765C0",
          headColor: "#333333",
          path: "/transactionDetail",
          query: ["blockNum", "extrinsicIndex", "extrinsicHash"],
          minWidth: 12
        },
        {
          title: this.$t("home.time"),
          key: "blockTimestamp",
          color: "#333",
          headColor: "#333333",
          minWidth: 10
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
        this.tableColumn[0].title = this.$t("home.eventIndex");
        this.tableColumn[1].title = this.$t("home.block");
        this.tableColumn[2].title = this.$t("home.extrinsicHash");
        this.tableColumn[3].title = this.$t("home.time");
      }
    }
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
  padding: 1.8rem 0;
  .head-wrap {
    .title {
      font-size: 2rem;
      color: #333333;
      font-weight: bold;
    }
  }
  .from {
    margin: 1.2rem 0 2rem;
    font-size: 1.5rem;
    color: #333;
  }
  .table-wrap-box {
    width: 100%;
    height: auto;
    border-radius: 0.8rem;
    box-shadow: 0 0 1.8rem 0.2rem rgba(0, 0, 0, 0.1);
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