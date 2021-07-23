<template>
  <div class="wrap">
    <div class="main">
      <div class="header">
        <span>收益&罚金列表</span>
      </div>
      <div class="from" v-if="$route.query">
        <span v-if="$route.query.blockNum"
          >区块 # {{ $route.query.blockNum }}（{{ pageData.total }}）</span
        >
        <div class="item-wrap" v-if="$route.query.accountDisplay">
          <div class="img-wrap">
            <img
              v-if="getAccountDisplay().judgements.length > 0"
              :src="require('@/assets/imgs/yanzhengren.png')"
            />
            <img v-else :src="require('@/assets/imgs/weiyanzheng.png')" />
            <div class="float">
              <span>
                {{
                  getAccountDisplay().judgements.length > 0
                    ? "身份等级：一般"
                    : "身份等级：未验证"
                }}
              </span>
            </div>
            <div class="arrow"></div>
          </div>
          <span
            >{{
              getAccountDisplay().display ||
              getAccountDisplay().accountAddress ||
              $route.query.accountAddress
            }}
            （{{ pageData.total }}）</span
          >
        </div>
      </div>
      <div class="table-wrap">
        <Table
          :tableColumn="tableColumn"
          :tableData="tableData"
          :trColor="'#F1F0EE'"
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
import Table from "@/components/table.vue";
import { getRewardListApi } from "@/api/reward.js";

export default {
  components: { Table },
  data() {
    return {
      loading: true,
      current: 1,
      pageData: {
        pageSize: 10,
        page: 1,
        total: 0,
      },
      tableColumn: [
        {
          title: "事件id",
          key: "eventIndex",
          headColor: "#333333",
          color: "#4765C0",
          path: "/transactionDetail",
          query: ["blockNum", "extrinsicIndex", "extrinsicHash"],
        },
        {
          title: "区块",
          key: "blockNum",
          color: "#4765C0",
          headColor: "#333333",
          path: "/blockDetail",
          query: ["blockNum"],
        },
        {
          title: "交易哈希",
          key: "extrinsicHash",
          color: "#4765C0",
          headColor: "#333333",
          path: "/transactionDetail",
          query: ["blockNum", "extrinsicIndex", "extrinsicHash"],
        },
        {
          title: "时间",
          key: "blockTimestamp",
          color: "#333",
          headColor: "#333333",
        },
        {
          title: "操作",
          key: "operation",
          color: "#333",
          headColor: "#333333",
        },
        {
          title: "数量",
          key: "amountTxt",
          color: "#333",
          headColor: "#333333",
          unit: "CRU",
        },
      ],
      tableData: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getAccountDisplay() {
      return JSON.parse(this.$route.query.accountDisplay);
    },
    getList() {
      this.loading = true;
      getRewardListApi({
        address: this.$route.query.accountAddress,
        ...this.pageData,
      }).then((res) => {
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
    },
  },
};
</script>

<style lang="scss" scoped>
.wrap {
  width: 100%;
  height: auto;
  padding: 60px 0;
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
      margin-bottom: 20px;
      span {
        font-size: 35px;
        color: #333;
        font-weight: bold;
      }
    }
    .from {
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      > div {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      img {
        margin-right: 10px;
        width: 20px;
      }
      .img-wrap:hover {
        overflow: inherit;
        .float,
        .arrow {
          opacity: 1;
        }
      }
      .img-wrap {
        display: flex;
        align-items: center;
        position: relative;
        overflow: hidden;
        .arrow,
        .float {
          opacity: 0;
          position: absolute;
          z-index: 999;
          top: 0;
          bottom: 0;
          margin: auto;
        }
        .arrow {
          left: calc(100%);
          width: 0;
          height: 0;
          border-top: 6px solid transparent;
          border-right: 10px solid #fff;
          border-bottom: 6px solid transparent;
        }
        .float {
          left: calc(100% + 10px);
          height: 40px;
          padding: 20px;
          white-space: nowrap;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background-color: #fff;
          color: #333;
          font-size: 14px;
          box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.1);
        }
        img {
          width: 18px;
          margin-right: 6px;
        }
      }
    }
    .table-wrap {
      width: 100%;
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
      border-radius: 10px;
    }
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