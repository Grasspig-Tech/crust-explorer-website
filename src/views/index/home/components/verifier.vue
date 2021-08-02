<template>
  <div class="rank-wrap">
    <div class="main main-box">
      <div class="header">
        <div class="click" @click="$router.push(`/verifierList?current=${current}`)">
          <span>{{$t('home.validators')}}</span>
          <img :src="require('@/assets/imgs/more.png')" alt="更多" />
        </div>
      </div>
      <div class="tab-wrap">
        <div
          class="tab-item click"
          :class="current == 1 ? 'active' : ''"
          @click="changeTab(1)"
        >{{$t('home.currentValidators')}}</div>
        <div
          class="tab-item click"
          :class="current == 2 ? 'active' : ''"
          @click="changeTab(2)"
        >{{$t('home.waitingValidators')}}</div>
      </div>
      <div class="table-wrap">
        <Table
          :tableColumn="
            current == 1 ? tableColumn1 : current == 2 ? tableColumn2 : ''
          "
          :tableData="tableData"
          :trColor="'#2f3346'"
          :trColor1="'#100B1C'"
        ></Table>
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
      tableColumn1: [
        {
          title: this.$t("home.rank"),
          key: "order",
          headColor: "#fff",
          color: "#fff",
          minWidth: 6
        },
        {
          title: this.$t("home.validators"),
          key: "accountDisplay",
          color: "#F9D007",
          headColor: "#fff",
          path: "/verifierDetail",
          query: ["accountAddress", { current: 1 }],
          minWidth: 12
        },
        {
          title: this.$t("home.validatorStake"),
          key: "ownerActivePledge",
          color: "#fff",
          headColor: "#fff",
          unit: "CRU",
          minWidth: 12
        },
        {
          title: this.$t("home.totalPledge"),
          key: "pledgeTotal",
          color: "#fff",
          headColor: "#fff",
          unit: "CRU",
          minWidth: 10
        },
        {
          title: this.$t("home.totalBonded"),
          key: "allFrozen",
          color: "#fff",
          headColor: "#fff",
          unit: "CRU",
          minWidth: 10
        },
        {
          title: this.$t("home.nominators"),
          key: "countNominators",
          color: "#F9D007",
          headColor: "#fff",
          path: "/nominatorsList",
          query: ["accountAddress", "accountDisplay"],
          minWidth: 6
        },
        {
          title: this.$t("home.guaranteeFee"),
          key: "guaranteeFee",
          color: "#fff",
          headColor: "#fff",
          unit: "%",
          minWidth: 6
        }
      ],
      tableColumn2: [
        {
          title: this.$t("home.rank"),
          key: "order",
          headColor: "#fff",
          color: "#fff",
          minWidth: 6
        },
        {
          title: this.$t("home.validators"),
          key: "accountDisplay",
          color: "#F9D007",
          headColor: "#fff",
          path: "/verifierDetail",
          query: ["accountAddress", { current: 2 }],
          minWidth: 12
        },
        {
          title: this.$t("home.verifierFreeze"),
          key: "bondedOwner",
          color: "#fff",
          headColor: "#fff",
          unit: "CRU",
          minWidth: 10
        },
        {
          title: this.$t("home.totalBonded"),
          key: "allFrozen",
          color: "#fff",
          headColor: "#fff",
          unit: "CRU",
          minWidth: 12
        },
        {
          title: this.$t("home.nominators"),
          key: "countNominators",
          color: "#F9D007",
          headColor: "#fff",
          path: "/nominatorsList",
          query: ["accountAddress", "accountDisplay"],
          minWidth: 6
        },
        {
          title: this.$t("home.guaranteeFee"),
          key: "guaranteeFee",
          color: "#fff",
          headColor: "#fff",
          unit: "%",
          minWidth: 6
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
      getVerifierListApi({ role: this.current, page: 1, pageSize: 10 }).then(
        res => {
          if (res.code == 200) {
            this.tableData = res.data.records;
          }
          this.loading = false;
        }
      );
    },
    changeTab(current) {
      this.current = current;
      this.getList();
    }
  }
};
</script>

<style lang="scss" scoped>
.rank-wrap {
  width: 100%;
  height: auto;
  padding: 2rem 0;
  // background-color: rgba(#252738, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  .main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .header {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      span {
        font-size: 2rem;
        color: #fff;
        margin-right: 1.5rem;
      }
      img {
        width: 1.5rem;
      }
    }
    .tab-wrap {
      margin: 1.5rem 0;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 0.1rem solid #f9d007;
      height: 2.5rem;
      border-radius: 10rem;
      overflow: hidden;
      .tab-item {
        padding: 0 1rem;
        font-size: 1.2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #f9d007;
        height: 100%;
      }
      .active {
        background-color: #f9d007;
        color: #141524;
      }
    }
    .table-wrap {
      width: 100%;
    }
  }
}
::v-deep .el-loading-mask {
  background-color: rgba(0, 0, 0, 0.3);
}
</style>