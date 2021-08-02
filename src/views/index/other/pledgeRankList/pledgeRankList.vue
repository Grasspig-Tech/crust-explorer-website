<template>
  <div class="rank-wrap">
    <div class="main-box">
      <div class="main">
        <div
          class="header"
        >{{ current == 1 ? $t('home.stakeAmountRank') : $t('home.effectIvestakeRank') }}</div>
        <div class="table-box">
          <Table
            :tableColumn="
            current == 1 ? tableColumn1 : current == 2 ? tableColumn2 : ''
          "
            :tableData="tableData"
            :trColor="'#F1F0EE'"
            :pageData="pageData"
          ></Table>
        </div>
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
import Table from "@/components/tableOrder.vue";
import {
  getPledgesActiveListApi,
  getPledgesQuotaListApi
} from "@/api/pledges.js";
export default {
  components: { Table },
  data() {
    return {
      loading: true,
      current: 1,
      pageData: {
        pageSize: 10,
        page: 1,
        total: 1000
      },
      tableColumn1: [
        {
          title: this.$t("home.rank"),
          key: "order",
          headColor: "#000",
          color: "#333",
          showImg: true,
          minWidth: 6
        },
        {
          title: this.$t("home.validators"),
          key: "accountDisplay",
          color: "#4765C0",
          headColor: "#000",
          path: "/verifierDetail",
          query: ["accountAddress"],
          minWidth: 12
        },
        {
          title: this.$t("home.ownEffectiveStake"),
          key: "ownerActivePledge",
          color: "#333",
          headColor: "#000",
          unit: "CRU",
          minWidth: 10
        },
        {
          title: this.$t("home.stakeLimit"),
          key: "pledgeMax",
          color: "#333",
          headColor: "#000",
          unit: "CRU",
          minWidth: 10
        },
        {
          title: this.$t("home.totalPledge"),
          key: "pledgeTotal",
          color: "#333",
          headColor: "#000",
          unit: "CRU",
          minWidth: 10
        },
        {
          title: this.$t("home.guaranteeFee"),
          key: "guaranteeFee",
          color: "#333",
          headColor: "#000",
          unit: "%",
          minWidth: 6
        }
      ],
      tableColumn2: [
        {
          title: this.$t("home.rank"),
          key: "order",
          color: "#333",
          headColor: "#000",
          showImg: true,
          minWidth: 6
        },
        {
          title: this.$t("home.validators"),
          key: "accountDisplay",
          color: "#4765C0",
          headColor: "#000",
          path: "/verifierDetail",
          query: ["accountAddress"],
          minWidth: 12
        },
        {
          title: this.$t("home.ownEffectiveStake"),
          key: "ownerActivePledge",
          color: "#333",
          headColor: "#000",
          unit: "CRU",
          minWidth: 10
        },
        {
          title: this.$t("home.guaranteeFee"),
          key: "guaranteeFee",
          color: "#333",
          headColor: "#000",
          unit: "%",
          minWidth: 6
        }
      ],
      tableData: []
    };
  },
  created() {
    this.current = this.$route.query.current || 1;
    this.getList();
  },
  watch: {
    "$i18n.locale": {
      handler: function() {
        this.tableColumn1[0].title = this.$t("home.rank");
        this.tableColumn1[1].title = this.$t("home.validators");
        this.tableColumn1[2].title = this.$t("home.ownEffectiveStake");
        this.tableColumn1[3].title = this.$t("home.stakeLimit");
        this.tableColumn1[4].title = this.$t("home.totalPledge");
        this.tableColumn1[5].title = this.$t("home.guaranteeFee");

        this.tableColumn2[0].title = this.$t("home.rank");
        this.tableColumn2[1].title = this.$t("home.validators");
        this.tableColumn2[2].title = this.$t("home.ownEffectiveStake");
        this.tableColumn2[3].title = this.$t("home.guaranteeFee");
      }
    }
  },
  methods: {
    async getList() {
      this.loading = true;
      var res = null;
      if (this.current == 1) {
        res = await getPledgesQuotaListApi(this.pageData);
      } else if (this.current == 2) {
        res = await getPledgesActiveListApi(this.pageData);
      }
      if (res.code == 200) {
        this.tableData = res.data.records;
        this.pageData.total = res.data.total;
      }
      this.loading = false;
    },
    changeTab(current) {
      this.current = current;
      this.getList();
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
.rank-wrap {
  width: 100%;
  padding: 2.5rem 0;
  height: auto;
  display: flex;
  flex-direction: column;
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
      font-size: 2rem;
      font-weight: bold;
    }
    .table-box {
      width: 100%;
      margin: 1.8rem 0 3rem;
      border-radius: 0.8rem;
      box-shadow: 0 0 0.8rem 0 rgba(0, 0, 0, 0.1);
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
  border-radius: 0.8rem !important;
  background-color: #fff !important;
  box-shadow: 0 0 0.8rem 0 rgba(0, 0, 0, 0.1) !important;
}
</style>