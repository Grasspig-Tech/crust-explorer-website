<template>
  <div class="block-wrap">
    <div class="header">
      <span>提名人列表</span>
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
            getAccountDisplay().address ||
            $route.query.accountAddress
          }}
          （{{ pageData.total }}）</span
        >
      </div>
    </div>
    <div class="table-wrap-box">
      <Table
        :tableColumn="tableColumn"
        :tableData="tableData"
        :trColor="'#F1F0EE'"
      ></Table>
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
import { getNominatorsListApi } from "@/api/nominators.js";

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
          title: "账户",
          key: "nominatorAddress",
          headColor: "#333333",
          color: "#4765C0",
          path: "/accountDetail",
          query: ["accountAddress"],
        },
        {
          title: "提名金额",
          key: "bondedTxt",
          color: "#333",
          headColor: "#333333",
          unit: "CRU",
        },
        {
          title: "占比",
          key: "quotient",
          color: "#333",
          headColor: "#333333",
          unit: "%",
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
      getNominatorsListApi({
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
.block-wrap {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
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
    font-size: 20px;
    columns: #333;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    > div {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    img {
      margin-right: 10px;
      width: 18px;
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
  .table-wrap-box {
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