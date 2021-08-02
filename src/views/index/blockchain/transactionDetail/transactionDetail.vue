<template>
  <div class="block-wrap">
    <div class="main-box">
      <div class="block-detail-box" v-loading="loading1">
        <div class="detail-head">
          <div
            class="text"
          >{{$t('home.extrinsics')}} # {{ $route.query.extrinsicIndex || $route.query.blockNum }}</div>
        </div>
        <div class="detail-main" v-if="ifEmpty">
          <div class="empty">{{$t('home.empty')}}</div>
        </div>
        <div class="detail-main" v-else>
          <div class="row" v-for="(item, key, index) in detail" :key="index">
            <div class="title">{{ item.label }}</div>
            <div class="content" :class="item.path ? 'click' : ''" @click="goPath(item, key)">
              <div class="icon-wrap">
                <img
                  v-if="item.valueType == 0 && key == 'result'"
                  :src="require('@/assets/imgs/shibai.png')"
                />
                <img
                  v-if="item.valueType == 1 && key == 'result'"
                  :src="require('@/assets/imgs/chenggong_ju.png')"
                />
                <img
                  v-if="item.valueType == 0 && key == 'finalized'"
                  :src="require('@/assets/imgs/dengdai.png')"
                />
                <img
                  v-if="item.valueType == 1 && key == 'finalized'"
                  :src="require('@/assets/imgs/chenggong.png')"
                />
                <!-- <img
                v-if="!item.verify && key == 'accountId'"
                :src="require('@/assets/imgs/weiyanzheng.png')"
              />
              <img
                v-if="item.verify && key == 'accountId'"
                :src="require('@/assets/imgs/yanzhengren.png')"
              />
              <div class="float" v-if="key == 'accountId'">
                <span>
                  {{ item.verify ? $t('home.identity1') : this.$t('home.identity2') }}
                </span>
              </div>
                <div class="arrow" v-if="key == 'accountId'"></div>-->
              </div>
              <span class="value break-word" v-if="key == 'date'">
                {{
                $utils.toUTCtime(item.value)
                }}
              </span>
              <span class="value break-word" v-else>
                <span v-if="item.value1">{{ item.value1 }}</span>
                <span>{{ item.value == null ? "-" : item.value }}</span>
              </span>
            </div>
            <div class="copy-wrap">
              <div class="copy click" @click="$utils.copy(item.value)" v-if="item.copy">
                <img :src="require('@/assets/imgs/fuzhi.png')" />
                <span class="text" v-if="$store.state.bodyDirection == 0">{{$t('home.copy')}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="table-wrap-box">
        <div class="table-head">
          <div class="left">
            <!-- <div class="tab-item">事件({{ pageData.total }})</div> -->
            <div class="tab-item">{{$t('home.event')}}({{ tableData.length }})</div>
          </div>
          <!-- <div class="right" v-if="!ifEmpty">
          <span>全部</span>
          <img :src="require('@/assets/imgs/more_hui.png')" alt />
          </div>-->
        </div>
        <div class="table-box">
          <Table :tableColumn="tableColumn" :tableData="tableData" :trColor="'#F1F0EE'"></Table>
        </div>
      </div>
      <!-- <div class="page-wrap">
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
      </div>-->
    </div>
  </div>
</template>

<script>
import { getExtrinsicDetailApi } from "@/api/extrinsic.js";
import { getBlockEventApi } from "@/api/event.js";
import Table from "@/components/tableStatus.vue";

export default {
  components: { Table },
  data() {
    return {
      loading1: true,
      loading: true,
      ifEmpty: false,
      accountDisplay: {},
      detail: {
        date: {
          label: this.$t("home.time"),
          value: ""
        },
        finalized: {
          label: this.$t("home.status"),
          value: "",
          valueType: "",
          icons: []
        },
        extrinsicHash: {
          label: this.$t("home.extrinsicHash"),
          value: "",
          copy: true
        },
        accountId: {
          label: this.$t("home.sendingAccount"),
          value: "",
          value1: "",
          copy: true,
          verify: true,
          path: "/accountDetail",
          query: ["accountAddress"]
        },
        result: {
          label: this.$t("home.results"),
          value: "",
          valueType: "",
          icons: []
        },
        signature: {
          label: this.$t("home.sign"),
          value: ""
        }
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
          copy: true,
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
      tableData: [],
      pageData: {
        pageSize: 10,
        page: 1,
        total: 0
      }
    };
  },
  created() {
    this.getDetail();
  },
  watch: {
    $route(to, from) {
      this.loading = true;
      this.loading1 = true;
      this.getDetail();
    },
    "$i18n.locale": {
      handler: function() {
        this.detail.date.label = this.$t("home.extrinsicRecord");
        this.detail.finalized.label = this.$t("home.status");
        this.detail.extrinsicHash.label = this.$t("home.extrinsicHash");
        this.detail.accountId.label = this.$t("home.sendingAccount");
        this.detail.result.label = this.$t("home.results");
        this.detail.signature.label = this.$t("home.sign");

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
          this.tableData = res.data.records;
          this.pageData.total = res.data.total;
        }
        this.loading = false;
      });
    },
    getDetail() {
      var params = {};
      if (this.$route.query.eventIndex != "undefined")
        params.eventIndex = this.$route.query.eventIndex;
      if (this.$route.query.extrinsicIndex != "undefined")
        params.extrinsicIndex = this.$route.query.extrinsicIndex;
      if (this.$route.query.extrinsicHash != "undefined")
        params.extrinsicHash = this.$route.query.extrinsicHash;
      getExtrinsicDetailApi(params).then(res => {
        if (res.code == 200) {
          if (res.data) {
            this.ifEmpty = false;
            this.accountDisplay = JSON.parse(res.data.accountDisplay);
            // if (this.accountDisplay.judgements.length == 0)
            //   this.detail.accountId.verify = false;
            // if (this.accountDisplay.judgements.length > 0)
            //   this.detail.accountId.verify = true;
            this.detail.date.value = res.data.blockTimestamp || "-";
            if (res.data.finalized == 0) this.detail.finalized.value = "等待中";
            if (res.data.finalized == 1) this.detail.finalized.value = "已确认";
            this.detail.finalized.valueType = res.data.finalized;
            this.detail.extrinsicHash.value = res.data.extrinsicHash || "-";
            this.detail.accountId.value = res.data.accountId || "-";
            // this.detail.accountId.value1 = this.accountDisplay.display || "-";
            this.detail.signature.value = res.data.signature || "-";
            this.detail.result.value = res.data.success;
            this.detail.result.valueType = res.data.success;
            if (res.data.success == 0) this.detail.result.value = "失败";
            if (res.data.success == 1) this.detail.result.value = "成功";
            this.tableData = res.data.events || [];
            // this.getList();
          } else {
            this.ifEmpty = true;
          }
        }
        this.loading = false;
        this.loading1 = false;
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
    goPath(item, key) {
      if (!item.path) return;
      var lastFullPath = this.$router.currentRoute.fullPath,
        fullPath = item.path + "?";
      if (this.$router.currentRoute.path != item.path) {
        if (item.query.length > 0) {
          item.query.map(r => {
            fullPath += `${r}=${item.value}`;
          });
          if (lastFullPath != fullPath) this.$router.push(fullPath);
        } else {
          this.$router.push(item.path);
        }
      }
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
  padding: 1.5rem 0 3rem;
  .block-detail-box {
    width: 100%;
    border-radius: 0.8rem;
    background-color: #fff;
    box-shadow: 0 0 1.5rem 0.2rem rgba(0, 0, 0, 0.1);
    margin-bottom: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 1.5rem;
    .detail-head {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 16rem;
      height: 2.5rem;
      background-color: #f7f7f9;
      border-radius: 0.8rem;
      .text {
        flex: 1;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.3rem;
        color: #333333;
        font-weight: bold;
      }
    }
    .detail-main {
      width: 100%;
      padding-top: 1.5rem;
      .empty {
        margin: 2.5rem 0 3.5rem;
      }
      .row {
        padding: 0.8rem 1rem;
        line-height: 1.6;
        border-bottom: 0.1rem solid #eee;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 1.1rem;
        color: #333;
        .title {
          flex: 1;
        }
        .content {
          flex: 3;
          display: flex;
          align-items: center;
          justify-content: center;
          .value {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
          }
          .icon-wrap:hover {
            overflow: inherit;
            .float,
            .arrow {
              opacity: 1;
            }
          }
          .icon-wrap {
            margin-right: 0.8rem;
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
              padding: 1.5rem;
              white-space: nowrap;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 0.8rem;
              background-color: #fff;
              color: #333;
              font-size: 0.9rem;
              box-shadow: 0 0 0.8rem 0.2rem rgba(0, 0, 0, 0.1);
            }
            img {
              width: 1.1rem;
              margin-right: 0.5rem;
            }
          }
        }
        .copy-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          .copy {
            border: 0.1rem solid #e8a134;
            color: #e8a134;
            border-radius: 10rem;
            padding: 0.4rem 0.5rem;
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            justify-content: center;
            img {
              width: 0.8rem;
              margin-right: 0.3rem;
            }
          }
        }
      }
    }
  }
  .table-wrap-box {
    overflow: hidden;
    width: 100%;
    height: auto;
    border-radius: 0.8rem;
    box-shadow: 0 0 1.5rem 0.2rem rgba(0, 0, 0, 0.1);
    .table-head {
      background-color: #f8f8f8;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1.8rem;
      padding-top: 0.8rem;
      .left {
        display: flex;
        align-items: center;
        .tab-item {
          padding: 0 2.5rem;
          width: auto;
          height: 3.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.8rem 0.8rem 0 0;
          font-size: 1.2rem;
          font-weight: bold;
        }
        .active {
          background-color: #fff;
          color: #df922c;
        }
      }
      .right {
        span {
          color: #bcbcbc;
          font-size: 1rem;
        }
        img {
          width: 0.8rem;
          margin-left: 0.8rem;
        }
      }
    }
    .table-box {
      width: 100%;
    }
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