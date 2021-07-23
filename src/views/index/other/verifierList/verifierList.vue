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
          title: "排名",
          key: "order",
          headColor: "#333",
          color: "#333",
          width: 80
        },
        {
          title: "验证人",
          key: "accountDisplay",
          color: "#4765C0",
          headColor: "#333",
          path: "/verifierDetail",
          query: ["accountAddress", { current: 1 }]
        },
        {
          title: "验证人有效质押量",
          key: "ownerActivePledge",
          color: "#333",
          headColor: "#333",
          unit: "CRU"
        },
        {
          title: "质押总量",
          key: "pledgeTotal",
          color: "#333",
          headColor: "#333",
          unit: "CRU"
        },
        {
          title: "全网冻结",
          key: "allFrozen",
          color: "#333",
          headColor: "#333",
          unit: "CRU"
        },
        {
          title: "提名人",
          key: "countNominators",
          color: "#4765C0",
          headColor: "#333",
          path: "/nominatorsList",
          query: ["accountAddress", "accountDisplay"]
        },
        {
          title: "担保费率",
          key: "guaranteeFee",
          color: "#333",
          headColor: "#333",
          unit: "%"
        }
      ],
      tableColumn2: [
        {
          title: "排名",
          key: "order",
          headColor: "#333",
          color: "#333",
          width: 80
        },
        {
          title: "验证人",
          key: "accountDisplay",
          color: "#4765C0",
          headColor: "#333",
          path: "/verifierDetail",
          query: ["accountAddress", { current: 2 }]
        },
        {
          title: "验证人冻结",
          key: "bondedOwner",
          color: "#333",
          headColor: "#333",
          unit: "CUR"
        },
        {
          title: "全网冻结",
          key: "allFrozen",
          color: "#333",
          headColor: "#333",
          unit: "CUR"
        },
        {
          title: "提名人",
          key: "countNominators",
          color: "#4765C0",
          headColor: "#333",
          path: "/nominatorsList",
          query: ["accountAddress", "accountDisplay"]
        },
        {
          title: "担保费率",
          key: "guaranteeFee",
          color: "#333",
          headColor: "#333",
          unit: "%"
        }
      ],
      tableData: []
    };
  },
  created() {
    this.current = this.$route.query.current || 1;
    this.getList();
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