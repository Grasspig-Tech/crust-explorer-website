<template>
  <div class="rank-wrap">
    <div class="main">
      <div class="header">
        <div class="click" @click="$router.push(`/pledgeRankList?current=${current}`)">
          <span>质押排行榜</span>
          <img :src="require('@/assets/imgs/more.png')" alt="更多" />
        </div>
      </div>
      <div class="tab-wrap">
        <div class="tab-item click" :class="current == 1 ? 'active' : ''" @click="changeTab(1)">质押额度</div>
        <div class="tab-item click" :class="current == 2 ? 'active' : ''" @click="changeTab(2)">有效质押</div>
      </div>
      <div class="table-wrap">
        <Table
          :tableColumn="
            current == 1 ? tableColumn1 : current == 2 ? tableColumn2 : ''
          "
          :tableData="tableData"
          :trColor="'#2f3346'"
        ></Table>
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
      tableColumn1: [
        {
          title: "排名",
          key: "order",
          headColor: "#fff",
          color: "#fff",
          showImg: true
        },
        {
          title: "验证人",
          key: "accountDisplay",
          color: "#F9D007",
          headColor: "#fff",
          path: "/verifierDetail",
          query: ["accountAddress"]
        },
        {
          title: "自身有效质押",
          key: "ownerActivePledge",
          color: "#fff",
          headColor: "#fff",
          unit: "CRU"
        },
        {
          title: "质押上限",
          key: "pledgeMax",
          color: "#fff",
          headColor: "#fff",
          unit: "CRU"
        },
        {
          title: "质押总量",
          key: "pledgeTotal",
          color: "#fff",
          headColor: "#fff",
          unit: "CRU"
        },
        {
          title: "担保费率",
          key: "guaranteeFee",
          color: "#fff",
          headColor: "#fff",
          unit: "%"
        }
      ],
      tableColumn2: [
        {
          title: "排名",
          key: "order",
          color: "#fff",
          headColor: "#fff",
          showImg: true
        },
        {
          title: "验证人",
          key: "accountDisplay",
          color: "#F9D007",
          headColor: "#fff",
          path: "/verifierDetail",
          query: ["accountAddress"]
        },
        {
          title: "自身有效质押",
          key: "ownerActivePledge",
          color: "#fff",
          headColor: "#fff",
          unit: "CRU"
        },
        {
          title: "担保费率",
          key: "guaranteeFee",
          color: "#fff",
          headColor: "#fff",
          unit: "%"
        },
      ],
      tableData: []
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      this.loading = true;
      var res = null;
      if (this.current == 1) {
        res = await getPledgesQuotaListApi({ page: 1, pageSize: 10 });
      } else if (this.current == 2) {
        res = await getPledgesActiveListApi({ page: 1, pageSize: 10 });
      }
      if (res.code == 200) {
        this.tableData = res.data.records;
      }
      this.loading = false;
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
  padding: 40px 0;
  height: auto;
  background-color: rgba(#252738, 0.7);
  display: flex;
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
      display: flex;
      align-items: center;
      justify-content: center;
      span {
        font-size: 35px;
        color: #fff;
        margin-right: 20px;
      }
      img {
        width: 20px;
      }
    }
    .tab-wrap {
      margin: 30px 0;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #f9d007;
      width: 200px;
      height: 30px;
      border-radius: 90px;
      overflow: hidden;
      .tab-item {
        flex: 1;
        font-size: 14px;
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