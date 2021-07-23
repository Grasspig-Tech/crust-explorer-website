<template>
  <div class="block-wrap">
    <div class="block-detail-box" v-loading="loading1">
      <div class="detail-head">
        <div class="text">
          交易 # {{ $route.query.extrinsicIndex || $route.query.blockNum }}
        </div>
      </div>
      <div class="detail-main" v-if="ifEmpty">
        <div class="empty">暂无数据</div>
      </div>
      <div class="detail-main" v-else>
        <div class="row" v-for="(item, key, index) in detail" :key="index">
          <div class="title">{{ item.label }}</div>
          <div
            class="content"
            :class="item.path ? 'click' : ''"
            @click="goPath(item, key)"
          >
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
                  {{ item.verify ? "身份等级：一般" : "身份等级：未验证" }}
                </span>
              </div>
              <div class="arrow" v-if="key == 'accountId'"></div> -->
            </div>
            <span class="value break-word" v-if="key == 'date'">{{
              $utils.toUTCtime(item.value)
            }}</span>
            <span class="value break-word" v-else>
              <span v-if="item.value1">{{ item.value1 }}</span>
              <span>{{ item.value == null ? "-" : item.value }}</span>
            </span>
          </div>
          <div class="copy-wrap">
            <div
              class="copy click"
              @click="$utils.copy(item.value)"
              v-if="item.copy"
            >
              <img :src="require('@/assets/imgs/fuzhi.png')" />
              <span class="text">复制</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="table-wrap-box">
      <div class="table-head">
        <div class="left">
          <!-- <div class="tab-item">事件({{ pageData.total }})</div> -->
          <div class="tab-item">事件({{ tableData.length }})</div>
        </div>
        <!-- <div class="right" v-if="!ifEmpty">
          <span>全部</span>
          <img :src="require('@/assets/imgs/more_hui.png')" alt />
        </div>-->
      </div>
      <div class="table-box">
        <Table
          :tableColumn="tableColumn"
          :tableData="tableData"
          :trColor="'#F1F0EE'"
        ></Table>
      </div>
    </div>
    <!-- <div class="page-wrap">
      <el-pagination
        :disabled="loading"
        background
        :page-size="pageData.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageData.total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      ></el-pagination>
    </div>-->
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
          label: "时间",
          value: "",
        },
        finalized: {
          label: "块状态",
          value: "",
          valueType: "",
          icons: [],
        },
        extrinsicHash: {
          label: "交易哈希",
          value: "",
          copy: true,
        },
        accountId: {
          label: "发送账户",
          value: "",
          value1: "",
          copy: true,
          verify: true,
          path: "/accountDetail",
          query: ["accountAddress"],
        },
        result: {
          label: "结果",
          value: "",
          valueType: "",
          icons: [],
        },
        signature: {
          label: "签名",
          value: "",
        },
      },
      tableColumn: [
        {
          title: "事件id",
          key: "eventIndex",
          headColor: "#333333",
          color: "#333",
        },
        {
          title: "区块",
          key: "blockNum",
          color: "#333",
          headColor: "#333333",
        },
        {
          title: "哈希",
          key: "extrinsicHash",
          color: "#4765C0",
          headColor: "#333333",
          copy: true,
          path: "/transactionDetail",
          query: ["blockNum", "extrinsicIndex", "extrinsicHash"],
        },
        {
          title: "时间",
          key: "blockTimestamp",
          color: "#333",
          headColor: "#333333",
        },
      ],
      tableData: [],
      pageData: {
        pageSize: 10,
        page: 1,
        total: 0,
      },
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
  },
  methods: {
    getList() {
      this.loading = true;
      getBlockEventApi({
        blockNum: this.$route.query.blockNum,
        ...this.pageData,
      }).then((res) => {
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
      getExtrinsicDetailApi(params).then((res) => {
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
          item.query.map((r) => {
            fullPath += `${r}=${item.value}`;
          });
          if (lastFullPath != fullPath) this.$router.push(fullPath);
        } else {
          this.$router.push(item.path);
        }
      }
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
  padding: 20px 0 50px;
  .block-detail-box {
    width: 1230px;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 20px;
    .detail-head {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 250px;
      height: 40px;
      background-color: #f7f7f9;
      border-radius: 10px;
      .text {
        flex: 1;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        color: #333333;
        font-weight: bold;
      }
    }
    .detail-main {
      width: 100%;
      padding-top: 20px;
      .empty {
        margin: 40px 0 60px;
      }
      .row {
        min-height: 40px;
        padding: 10px 0;
        line-height: 1.6;
        border-bottom: 1px solid #eee;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
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
            margin-right: 10px;
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
        .copy-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 160px;
          .copy {
            border: 1px solid #e8a134;
            color: #e8a134;
            border-radius: 90px;
            width: 70px;
            height: 30px;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            img {
              width: 12px;
              margin-right: 4px;
            }
          }
        }
      }
    }
  }
  .table-wrap-box {
    overflow: hidden;
    width: 1230px;
    height: auto;
    border-radius: 10px;
    box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.1);
    .table-head {
      background-color: #f8f8f8;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 30px;
      padding-top: 10px;
      .left {
        display: flex;
        align-items: center;
        .tab-item {
          padding: 0 40px;
          width: auto;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px 10px 0 0;
          font-size: 16px;
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
          font-size: 16px;
        }
        img {
          width: 12px;
          margin-left: 10px;
        }
      }
    }
    .table-box {
      width: 100%;
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