<template>
  <div class="rank-wrap">
    <div class="main-box">
      <div class="main">
        <div class="header">
          <div class="title">
            {{
            current == 1
            ? $t('home.currentValidators')
            : current == 2
            ? $t('home.waitingValidators')
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
              : ''
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
import { getVerifierListApi } from "@/api/verifier.js";
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
          headColor: "#333",
          color: "#333",
          minWidth: 6
        },
        {
          title: this.$t("home.validators"),
          key: "accountDisplay",
          color: "#4765C0",
          headColor: "#333",
          path: "/verifierDetail",
          query: ["accountAddress", { current: 1 }],
          minWidth: 12
        },
        {
          title: this.$t("home.validatorStake"),
          key: "ownerActivePledge",
          color: "#333",
          headColor: "#333",
          unit: "CRU",
          minWidth: 12
        },
        {
          title: this.$t("home.totalPledge"),
          key: "pledgeTotal",
          color: "#333",
          headColor: "#333",
          unit: "CRU",
          minWidth: 10
        },
        {
          title: this.$t("home.totalBonded"),
          key: "allFrozen",
          color: "#333",
          headColor: "#333",
          unit: "CRU",
          minWidth: 10
        },
        {
          title: this.$t("home.nominators"),
          key: "countNominators",
          color: "#4765C0",
          headColor: "#333",
          path: "/nominatorsList",
          query: ["accountAddress", "accountDisplay"],
          minWidth: 6
        },
        {
          title: this.$t("home.guaranteeFee"),
          key: "guaranteeFee",
          color: "#333",
          headColor: "#333",
          unit: "%",
          minWidth: 6
        }
      ],
      tableColumn2: [
        {
          title: this.$t("home.rank"),
          key: "order",
          headColor: "#333",
          color: "#333",
          minWidth: 6
        },
        {
          title: this.$t("home.validators"),
          key: "accountDisplay",
          color: "#4765C0",
          headColor: "#333",
          path: "/verifierDetail",
          query: ["accountAddress", { current: 2 }],
          minWidth: 12
        },
        {
          title: this.$t("home.verifierFreeze"),
          key: "bondedOwner",
          color: "#333",
          headColor: "#333",
          unit: "CRU",
          minWidth: 10
        },
        {
          title: this.$t("home.totalBonded"),
          key: "allFrozen",
          color: "#333",
          headColor: "#333",
          unit: "CRU",
          minWidth: 12
        },
        {
          title: this.$t("home.nominators"),
          key: "countNominators",
          color: "#4765C0",
          headColor: "#333",
          path: "/nominatorsList",
          query: ["accountAddress", "accountDisplay"],
          minWidth: 6
        },
        {
          title: this.$t("home.guaranteeFee"),
          key: "guaranteeFee",
          color: "#333",
          headColor: "#333",
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
        this.tableColumn1[2].title = this.$t("home.validatorStake");
        this.tableColumn1[3].title = this.$t("home.totalPledge");
        this.tableColumn1[4].title = this.$t("home.totalBonded");
        this.tableColumn1[5].title = this.$t("home.nominators");
        this.tableColumn1[6].title = this.$t("home.guaranteeFee");

        this.tableColumn2[0].title = this.$t("home.rank");
        this.tableColumn2[1].title = this.$t("home.validators");
        this.tableColumn2[2].title = this.$t("home.verifierFreeze");
        this.tableColumn2[3].title = this.$t("home.totalBonded");
        this.tableColumn1[4].title = this.$t("home.nominators");
        this.tableColumn2[5].title = this.$t("home.guaranteeFee");
      }
    }
  },
  methods: {
    getList() {
      this.loading = true;
      getVerifierListApi({ role: this.current, ...this.pageData }).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.records;
          this.pageData.total = res.data.total;
        }
        this.loading = false;
      });
    },
    changeTab(current) {
      this.current = current;
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

      .title {
        font-size: 2rem;
        font-weight: bold;
      }
      .text {
        font-size: 1.5rem;
        color: #9a9a9a;
        margin-top: 0.8rem;
      }
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