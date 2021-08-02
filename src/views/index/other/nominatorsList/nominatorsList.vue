<template>
  <div class="block-wrap">
    <div class="main-box">
      <div class="header">
        <span>{{$t('home.nominatorsList')}}</span>
      </div>
      <div class="from" v-if="$route.query">
        <span
          v-if="$route.query.blockNum"
        >{{$t('home.block')}} # {{ $route.query.blockNum }}（{{ pageData.total }}）</span>
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
                ? $t('home.identity1')
                : $t('home.identity2')
                }}
              </span>
            </div>
            <div class="arrow"></div>
          </div>
          <span>
            {{
            getAccountDisplay().display ||
            getAccountDisplay().address ||
            $route.query.accountAddress
            }}
            （{{ pageData.total }}）
          </span>
        </div>
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
        total: 0
      },
      tableColumn: [
        {
          title: this.$t("home.nominators"),
          key: "accountDisplay",
          headColor: "#333333",
          color: "#4765C0",
          path: "/accountDetail",
          query: [{ key: "accountAddress", value: "nominatorAddress" }],
          minWidth: 12
        },
        {
          title: this.$t("home.nominationAmount"),
          key: "bondedTxt",
          color: "#333",
          headColor: "#333333",
          unit: "CRU",
          minWidth: 13
        },
        {
          title: this.$t("home.proportion"),
          key: "quotient",
          color: "#333",
          headColor: "#333333",
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
        this.tableColumn[0].title = this.$t("home.nominators");
        this.tableColumn[1].title = this.$t("home.nominationAmount");
        this.tableColumn[2].title = this.$t("home.proportion");
      }
    }
  },
  methods: {
    getAccountDisplay() {
      return JSON.parse(this.$route.query.accountDisplay);
    },
    getList() {
      this.loading = true;
      getNominatorsListApi({
        address: this.$route.query.accountAddress,
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
  padding: 2rem 0;
  .header {
    width: 100%;
    span {
      font-size: 2rem;
      color: #333;
      font-weight: bold;
    }
  }
  .from {
    font-size: 1.5rem;
    columns: #333;
    margin: 1.2rem 0 2rem;

    display: flex;
    align-items: center;
    justify-content: center;
    > div {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    img {
      margin-right: 0.8rem;
      width: 1.5rem;
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
        border-top: 0.5rem solid transparent;
        border-right: 0.6rem solid #fff;
        border-bottom: 0.5rem solid transparent;
      }
      .float {
        left: calc(100% + 0.6rem);
        height: 2.5rem;
        padding: 1.8rem;
        white-space: nowrap;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0.8rem;
        background-color: #fff;
        color: #333;
        font-size: 1rem;
        box-shadow: 0 0 0.8rem 0.2rem rgba(0, 0, 0, 0.1);
      }
    }
  }
  .table-wrap-box {
    width: 100%;
    height: auto;
    border-radius: 0.8rem;
    box-shadow: 0 0 1.8rem 0.2rem rgba(0, 0, 0, 0.1);
  }
  .page-wrap {
    margin-top: 1.5rem;
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