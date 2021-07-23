<template>
  <div class="rank-wrap">
    <div class="main">
      <div class="header">{{ current == 1 ? "质押额度排行榜" : "有效质押排行榜" }}</div>
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
          title: "排名",
          key: "order",
          headColor: "#000",
          color: "#333",
          showImg: true
        },
        {
          title: "验证人",
          key: "accountDisplay",
          color: "#4765C0",
          headColor: "#000",
          path: "/verifierDetail",
          query: ["accountAddress"]
        },
        {
          title: "自身有效质押",
          key: "ownerActivePledge",
          color: "#333",
          headColor: "#000",
          unit: "CRU"
        },
        {
          title: "质押上限",
          key: "pledgeMax",
          color: "#333",
          headColor: "#000",
          unit: "CRU"
        },
        {
          title: "质押总量",
          key: "pledgeTotal",
          color: "#333",
          headColor: "#000",
          unit: "CRU"
        },
        {
          title: "担保费率",
          key: "guaranteeFee",
          color: "#333",
          headColor: "#000",
          unit: "%"
        }
      ],
      tableColumn2: [
        {
          title: "排名",
          key: "order",
          color: "#333",
          headColor: "#000",
          showImg: true
        },
        {
          title: "验证人",
          key: "accountDisplay",
          color: "##4765C0",
          headColor: "#000",
          path: "/verifierDetail",
          query: ["accountAddress"]
        },
        {
          title: "自身有效质押",
          key: "ownerActivePledge",
          color: "#333",
          headColor: "#000",
          unit: "CRU"
        },
        {
          title: "担保费率",
          key: "guaranteeFee",
          color: "#333",
          headColor: "#000",
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
      font-size: 35px;
      font-weight: bold;
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