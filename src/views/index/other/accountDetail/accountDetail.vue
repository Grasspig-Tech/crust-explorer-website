<template>
  <div class="detail-wrap">
    <div class="detail-main">
      <div class="detail-head">
        <div class="title">账户</div>
        <div class="name" v-if="detail">
          {{ detail.display || detail.address }}
        </div>
      </div>
      <div class="block-detail-box" v-if="ifEmpty">
        <div class="empty">暂无数据</div>
      </div>
      <div class="block-detail-box" v-else v-loading="loading1">
        <div class="verifier-wrap">
          <div class="img-wrap" v-if="detail.judgements">
            <img
              v-if="detail.judgements.length > 0"
              :src="require('@/assets/imgs/yanzhengren.png')"
              alt="验证人"
            />
            <img
              v-else
              :src="require('@/assets/imgs/weiyanzheng.png')"
              alt="未验证"
            />
            <div class="float">
              <span>
                {{
                  detail.judgements.length > 0
                    ? "身份等级：一般"
                    : "身份等级：未验证"
                }}
              </span>
            </div>
            <div class="arrow"></div>
          </div>
          <div class="value">{{ detail.address }}</div>
          <div class="copy click" @click="$utils.copy(detail.address)">
            <img :src="require('@/assets/imgs/fuzhi.png')" alt="复制" />
            <span>复制</span>
          </div>
        </div>
        <div class="detail-box">
          <div class="left box">
            <div class="title">余额</div>
            <div class="row-wrap">
              <div class="row">
                <div class="lable">余额</div>
                <div class="value">{{ detail.balanceTxt || 0 }} CRU</div>
                <div class="detail click">
                  <span>详情</span>
                  <div class="float">
                    <p class="p">
                      <span class="left">可转账</span>
                      <span class="right">
                        <span class="val one-line">{{
                          detail.balance - detail.reserved - detail.balanceLock
                        }}</span>
                        <span class="unit">CRU</span>
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="lable">保留</div>
                <div class="value">{{ detail.reservedTxt || 0 }} CRU</div>
              </div>
              <div class="row">
                <div class="lable">已锁定</div>
                <div class="value">{{ detail.balanceLockTxt || 0 }} CRU</div>
                <div class="detail click">
                  <span>详情</span>
                  <div class="float">
                    <p class="p">
                      <span class="left">质押</span>
                      <span class="right">
                        <span class="val one-line">0</span>
                        <span class="unit">CRU</span>
                      </span>
                    </p>
                    <p class="p">
                      <span class="left">解冻中</span>
                      <span class="right">
                        <span class="val one-line">{{
                          detail.unbondingTxt || 0
                        }}</span>
                        <span class="unit">CRU</span>
                      </span>
                    </p>
                    <p class="p">
                      <span class="left">民主锁定</span>
                      <span class="right">
                        <span class="val one-line">{{
                          detail.democracyLockTxt || 0
                        }}</span>
                        <span class="unit">CRU</span>
                      </span>
                    </p>
                    <p class="p">
                      <span class="left">选举锁定</span>
                      <span class="right">
                        <span class="val one-line">{{
                          detail.electionLockTxt || 0
                        }}</span>
                        <span class="unit">CRU</span>
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="right box">
            <div class="title">基本信息</div>
            <div class="row-wrap">
              <div class="row">
                <span class="lable">账户ID</span>
                <span class="value">{{ detail.id || "-" }}</span>
              </div>
              <div class="row">
                <span class="lable">Nonce</span>
                <span class="value">{{ detail.nonce || "-" }}</span>
              </div>
              <div class="row">
                <span class="lable">身份</span>
                <span class="value click" @click="goRole()">
                  <span class="tag" v-if="detail.role == 1">验证人</span>
                  <span class="tag" v-if="detail.role == 2">候选验证人</span>
                  <span class="tag" v-if="detail.role == 3">提名人</span>
                  <span class="tag" v-if="detail.role == 4">其他</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="table-wrap-box">
        <div class="table-head">
          <div class="left">
            <div
              class="tab-item click"
              v-for="(item, index) in tabs"
              :key="index"
              :class="current == index + 1 ? 'active' : ''"
              @click="changeTab(index)"
            >
              {{ item.label }}({{ item.total }})
            </div>
          </div>
          <div class="right click" v-if="!ifEmpty" @click="goAllList()">
            <span>全部</span>
            <img :src="require('@/assets/imgs/more_hui.png')" alt />
          </div>
        </div>
        <div class="table-box">
          <TableStatus
            v-if="current == 1 || current == 2"
            :tableColumn="
              current == 1 ? tableColumn1 : current == 2 ? tableColumn2 : ''
            "
            :tableData="
              current == 1 ? tableData1 : current == 2 ? tableData2 : ''
            "
            :trColor="'#F1F0EE'"
          ></TableStatus>
          <Table
            v-if="current == 3"
            :tableColumn="tableColumn3"
            :tableData="tableData3"
            :trColor="'#F1F0EE'"
          ></Table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Table from "@/components/table.vue";
import TableStatus from "@/components/tableStatus.vue";
import { getAccountDetailApi } from "@/api/verifier.js";
import { getExtrinsicListApi } from "@/api/extrinsic.js";
import { getTransferListApi } from "@/api/transfer.js";
import { getRewardListApi } from "@/api/reward.js";

export default {
  components: { Table, TableStatus },
  data() {
    return {
      current: 1,
      loading1: true,
      loading: true,
      ifEmpty: false,
      tabs: [
        {
          label: "交易",
          total: "0",
        },
        {
          label: "转账",
          total: "0",
        },
        {
          label: "收益&罚金",
          total: "0",
        },
      ],
      detail: {},
      tableColumn1: [], // tab
      tableData1: [],
      tableColumn2: [], // tab
      tableData2: [],
      tableColumn3: [], // tab
      tableData3: [],
    };
  },
  created() {
    this.getDetail();
  },
  watch: {
    $route(to, from) {
      this.blockNum = to.query.blockNum;
      this.loading = true;
      this.loading1 = true;
      this.getDetail();
    },
  },
  methods: {
    goRole() {
      this.$router.push(
        `/verifierDetail?accountAddress=${this.detail.address}`
      );
    },
    changeTab(index) {
      this.current = index + 1;
      this.getList();
    },
    getDetail() {
      this.loading1 = true;
      getAccountDetailApi(this.$route.query.accountAddress).then((res) => {
        if (res.code == 200) {
          if (res.data) {
            this.ifEmpty = false;
            this.detail = res.data;
            this.detail.judgements = JSON.parse(res.data.judgements);
            this.getList(true);
          } else {
            this.ifEmpty = true;
            this.loading = false;
          }
        }
        this.loading1 = false;
      });
    },
    getList(init) {
      if (!this.detail) return;
      this.getColumn();
      this.loading = true;
      if (init) {
        // 交易
        this.getExtrinsicList();
        // 转账
        this.getTransferList();
        // 收益-罚金
        this.getRewardList();
      } else {
        switch (this.current) {
          case 1: // 交易
            this.getExtrinsicList();
            break;
          case 2: // 转账
            this.getTransferList();
            break;
          case 3: // 收益-罚金
            this.getRewardList();
            break;
          default:
            break;
        }
      }
      this.loading = false;
    },
    // 交易
    getExtrinsicList() {
      getExtrinsicListApi({
        address: this.$route.query.accountAddress,
        page: 1,
        pageSize: 10,
      }).then((res) => {
        if (res.code == 200) {
          this.tableData1 = res.data.records;
          this.tabs[0].total = res.data.total;
        }
      });
    },
    // 转账
    getTransferList() {
      getTransferListApi({
        address: this.$route.query.accountAddress,
        page: 1,
        pageSize: 10,
      }).then((res) => {
        if (res.code == 200) {
          this.tableData2 = res.data.records;
          this.tabs[1].total = res.data.total;
        }
      });
    },
    // 收益-罚金
    getRewardList() {
      getRewardListApi({
        address: this.$route.query.accountAddress,
        page: 1,
        pageSize: 10,
      }).then((res) => {
        if (res.code == 200) {
          this.tableData3 = res.data.records;
          this.tabs[2].total = res.data.total;
        }
      });
    },
    getColumn() {
      // 交易
      this.tableColumn1 = [
        {
          title: "交易id",
          key: "extrinsicIndex",
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
          title: "结果",
          key: "success",
          color: "#333",
          headColor: "#333333",
          type: "status",
        },
        {
          title: "操作",
          key: "operation",
          color: "#333",
          headColor: "#333333",
        },
      ];
      // 转账
      this.tableColumn2 = [
        {
          title: "交易id",
          key: "extrinsicIndex",
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
          title: "时间",
          key: "blockTimestamp",
          color: "#333333",
          headColor: "#333333",
        },
        {
          title: "转出自",
          key: "from",
          color: "#4765C0",
          headColor: "#333333",
          path: "/blockDetail",
          query: ["blockNum"],
        },
        {
          title: "转入至",
          key: "to",
          color: "#4765C0",
          headColor: "#333333",
          path: "/blockDetail",
          query: ["blockNum"],
        },
        {
          title: "结果",
          key: "success",
          color: "#333",
          headColor: "#333333",
          type: "status",
        },
        {
          title: "数量",
          key: "amountTxt",
          color: "#333333",
          headColor: "#333333",
          unit: "CRU",
        },
        {
          title: "哈希",
          key: "hash",
          color: "#4765C0",
          headColor: "#333333",
          path: "/transactionDetail",
          query: ["blockNum", "extrinsicIndex", "extrinsicHash"],
        },
      ];
      // 收益-罚金
      this.tableColumn3 = [
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
      ];
    },
    goAllList() {
      switch (this.current) {
        case 1:
          this.$router.push(
            `/transaction?accountAddress=${this.$route.query.accountAddress}&accountDisplay=${this.detail.accountDisplay}`
          );
          break;
        case 2:
          this.$router.push(
            `/transferList?accountAddress=${this.$route.query.accountAddress}&accountDisplay=${this.detail.accountDisplay}`
          );
          break;
        case 3:
          this.$router.push(
            `/rewardList?accountAddress=${this.$route.query.accountAddress}&accountDisplay=${this.detail.accountDisplay}`
          );
          break;
        default:
          break;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.detail-wrap {
  padding: 0 0 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .detail-main {
    margin-top: 20px;
    width: 1230px;
    .detail-head {
      .title {
        font-size: 35px;
        color: #333;
        font-weight: bold;
      }
      .name {
        font-size: 22px;
        color: #9a9a9a;
        margin: 10px 0 20px;
      }
    }
    .block-detail-box {
      width: 1230px;
      margin: 20px 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      .empty {
        margin: 40px 0;
      }
      .verifier-wrap {
        width: 100%;
        height: 60px;
        border-radius: 10px;
        background-color: #fff;
        display: flex;
        align-items: center;
        box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.1);
        padding: 0 20px;
        color: #333333;
        font-size: 16px;
        img {
          width: 18px;
        }
        .value {
          margin: 0 16px;
        }
        .copy {
          width: 80px;
          height: 30px;
          border: 1px solid #e8a134;
          color: #e8a134;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 90px;
          font-size: 12px;
          img {
            margin-right: 6px;
            width: 14px;
          }
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
      .detail-box {
        width: 100%;
        margin: 20px 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .box {
          width: 48%;
          box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.1);
          border-radius: 10px;
          .title {
            height: 60px;
            display: flex;
            align-items: center;
            padding: 0 20px;
            font-size: 18px;
            font-weight: bold;
            border-bottom: 1px solid #eee;
          }
          .row-wrap {
            .row {
              padding: 0 20px;
              height: 50px;
              font-size: 14px;
              display: flex;
              align-items: center;
              border-bottom: 1px solid #eee;
              .lable {
                width: 70px;
                text-align: left;
                color: #9a9a9a;
              }
              .value {
                flex: 1;
                text-align: left;
                .tag {
                  display: inline-block;
                  background-color: #f6eacb;
                  width: 80px;
                  height: 25px;
                  border-radius: 4px;
                  color: #744e19;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 13px;
                }
              }
              .detail:hover {
                overflow: inherit;
                .float {
                  opacity: 1;
                }
              }
              .detail {
                color: #e8a134;
                border: 1px solid #e8a134;
                border-radius: 90px;
                width: 80px;
                height: 30px;
                font-size: 13px;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                overflow: hidden;
                .float {
                  opacity: 0;
                  position: absolute;
                  z-index: 99;
                  left: 0;
                  right: 0;
                  margin: auto;
                }
                .float {
                  top: calc(100% + 10px);
                  width: 240px;
                  height: auto;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  border-radius: 10px;
                  background-color: #fff;
                  color: #333;
                  box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.1);
                  padding: 0 10px;
                  .p {
                    width: 100%;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    .left {
                      flex: 1;
                    }
                    .right {
                      flex: 2;

                      .unit {
                        margin-left: 4px;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  .table-wrap-box {
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
  .bottom-table-wrap {
    width: 1230px;
    .bottom-head {
      font-size: 35px;
      color: #333;
      font-weight: bold;
      padding: 40px 0 10px;
    }
    .bottom-table {
      width: 100%;
      border-radius: 10px;
      box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.1);
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