<template>
  <div class="detail-wrap">
    <div class="detail-main main-box">
      <div
        class="detail-head"
        :style="{
          'align-items':
            $store.state.bodyDirection == 1 ? 'flex-start' : 'center',
        }"
      >
        <div class="title">{{$t('home.account')}}</div>
        <div class="name" v-if="detail">{{ detail.display || detail.address }}</div>
      </div>
      <div class="block-detail-box" v-if="ifEmpty">
        <div class="empty">{{$t('home.empty')}}</div>
      </div>
      <div class="block-detail-box" v-else v-loading="loading1">
        <div class="verifier-wrap">
          <div class="img-wrap" v-if="detail.judgements">
            <img
              v-if="detail.judgements.length > 0"
              :src="require('@/assets/imgs/yanzhengren.png')"
            />
            <img v-else :src="require('@/assets/imgs/weiyanzheng.png')" />
            <div class="float">
              <span>
                {{
                detail.judgements.length > 0
                ? $t('home.identity1')
                : $t('home.identity2')
                }}
              </span>
            </div>
            <div class="arrow"></div>
          </div>
          <div class="value one-line">{{ detail.address }}</div>
          <div class="copy click" @click="$utils.copy(detail.address)">
            <img :src="require('@/assets/imgs/fuzhi.png')" />
            <span>{{$t('home.copy')}}</span>
          </div>
        </div>
        <div
          class="detail-box"
          :style="{
            'flex-direction':
              $store.state.bodyDirection == 1 ? 'column' : 'row',
          }"
        >
          <div
            class="left box"
            :style="{
              width: $store.state.bodyDirection == 1 ? '100%' : '48%',
              'margin-bottom': '1rem',
            }"
          >
            <div class="title">{{$t('home.balance')}}</div>
            <div class="row-wrap">
              <div class="row">
                <div class="lable">{{$t('home.balance')}}</div>
                <div class="value">{{ detail.balanceTxt || 0 }} CRU</div>
                <div class="detail click">
                  <span>{{$t('home.detail')}}</span>
                  <div class="float">
                    <p class="p">
                      <span class="left">{{$t('home.transferable')}}</span>
                      <span class="right">
                        <span class="val one-line">
                          {{
                          detail.balance - detail.reserved - detail.balanceLock
                          }}
                        </span>
                        <span class="unit">CRU</span>
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="lable">{{$t('home.retain')}}</div>
                <div class="value">{{ detail.reservedTxt || 0 }} CRU</div>
              </div>
              <div class="row">
                <div class="lable">{{$t('home.locked')}}</div>
                <div class="value">{{ detail.balanceLockTxt || 0 }} CRU</div>
                <div class="detail click">
                  <span>{{$t('home.detail')}}</span>
                  <div class="float">
                    <p class="p">
                      <span class="left">{{$t('home.thawing')}}</span>
                      <span class="right">
                        <span class="val one-line">
                          {{
                          detail.unbondingTxt || 0
                          }}
                        </span>
                        <span class="unit">CRU</span>
                      </span>
                    </p>
                    <p class="p">
                      <span class="left">{{$t('home.democraticLocking')}}</span>
                      <span class="right">
                        <span class="val one-line">
                          {{
                          detail.democracyLockTxt || 0
                          }}
                        </span>
                        <span class="unit">CRU</span>
                      </span>
                    </p>
                    <p class="p">
                      <span class="left">{{$t('home.electionLock')}}</span>
                      <span class="right">
                        <span class="val one-line">
                          {{
                          detail.electionLockTxt || 0
                          }}
                        </span>
                        <span class="unit">CRU</span>
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="right box"
            :style="{
              width: $store.state.bodyDirection == 1 ? '100%' : '48%',
            }"
          >
            <div class="title">{{$t('home.information')}}</div>
            <div class="row-wrap">
              <div class="row">
                <span class="lable">{{$t('home.account')}}</span>
                <span class="value">{{ detail.id || "-" }}</span>
              </div>
              <div class="row">
                <span class="lable">Nonce</span>
                <span class="value">{{ detail.nonce || "-" }}</span>
              </div>
              <div class="row">
                <span class="lable">{{$t('home.identity')}}</span>
                <span class="value click" @click="goRole()">
                  <span class="tag" v-if="detail.role == 1">{{$t('home.validators')}}</span>
                  <span class="tag" v-if="detail.role == 2">{{$t('home.waitingValidators')}}</span>
                  <span class="tag" v-if="detail.role == 3">{{$t('home.nominators')}}</span>
                  <span class="tag" v-if="detail.role == 4">{{$t('home.other')}}</span>
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
              class="tab-item click break-word"
              v-for="(item, index) in tabs"
              :key="index"
              :class="current == index + 1 ? 'active' : ''"
              @click="changeTab(index)"
            >{{ item.label }}({{ item.total }})</div>
          </div>
          <div class="right click" v-if="!ifEmpty" @click="goAllList()">
            <span>{{$t('home.all')}}</span>
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
          label: this.$t("home.extrinsics"),
          total: "0"
        },
        {
          label: this.$t("home.transfers"),
          total: "0"
        },
        {
          label: this.$t("home.gainsPenalties"),
          total: "0"
        }
      ],
      detail: {},
      tableColumn1: [], // tab
      tableData1: [],
      tableColumn2: [], // tab
      tableData2: [],
      tableColumn3: [], // tab
      tableData3: []
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
    "$i18n.locale": {
      handler: function() {
        this.tabs[0].label = this.$t("home.extrinsics");
        this.tabs[1].label = this.$t("home.transfers");
        this.tabs[2].label = this.$t("home.gainsPenalties");

        this.tableColumn1[0].title = this.$t("home.extrinsicIndex");
        this.tableColumn1[1].title = this.$t("home.block");
        this.tableColumn1[2].title = this.$t("home.extrinsicHash");
        this.tableColumn1[3].title = this.$t("home.time");
        this.tableColumn1[4].title = this.$t("home.results");
        this.tableColumn1[5].title = this.$t("home.action");

        this.tableColumn2[0].title = this.$t("home.extrinsicIndex");
        this.tableColumn2[1].title = this.$t("home.block");
        this.tableColumn2[2].title = this.$t("home.time");
        this.tableColumn2[3].title = this.$t("home.from");
        this.tableColumn2[4].title = this.$t("home.to");
        this.tableColumn2[5].title = this.$t("home.results");
        this.tableColumn2[6].title = this.$t("home.transferAmount");
        this.tableColumn2[7].title = this.$t("home.extrinsicHash");

        this.tableColumn3[0].title = this.$t("home.eventIndex");
        this.tableColumn3[1].title = this.$t("home.block");
        this.tableColumn3[2].title = this.$t("home.extrinsicHash");
        this.tableColumn3[3].title = this.$t("home.time");
        this.tableColumn3[4].title = this.$t("home.action");
        this.tableColumn3[5].title = this.$t("home.rewardAmount");
      }
    }
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
      getAccountDetailApi(this.$route.query.accountAddress).then(res => {
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
        pageSize: 10
      }).then(res => {
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
        pageSize: 10
      }).then(res => {
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
        pageSize: 10
      }).then(res => {
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
          title: this.$t("home.extrinsicIndex"),
          key: "extrinsicIndex",
          headColor: "#333333",
          color: "#4765C0",
          path: "/transactionDetail",
          query: ["blockNum", "extrinsicIndex", "extrinsicHash"],
          minWidth: 8
        },
        {
          title: this.$t("home.block"),
          key: "blockNum",
          color: "#4765C0",
          headColor: "#333333",
          path: "/blockDetail",
          query: ["blockNum"],
          minWidth: 8
        },
        {
          title: this.$t("home.extrinsicHash"),
          key: "extrinsicHash",
          color: "#4765C0",
          headColor: "#333333",
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
        },
        {
          title: this.$t("home.results"),
          key: "success",
          color: "#333",
          headColor: "#333333",
          type: "status",
          minWidth: 8
        },
        {
          title: this.$t("home.action"),
          key: "operation",
          color: "#333",
          headColor: "#333333",
          minWidth: 14
        }
      ];
      // 转账
      this.tableColumn2 = [
        {
          title: this.$t("home.extrinsicIndex"),
          key: "extrinsicIndex",
          headColor: "#333333",
          color: "#4765C0",
          path: "/transactionDetail",
          query: ["blockNum", "extrinsicIndex", "extrinsicHash"],
          minWidth: 8
        },
        {
          title: this.$t("home.block"),
          key: "blockNum",
          color: "#4765C0",
          headColor: "#333333",
          path: "/blockDetail",
          query: ["blockNum"],
          minWidth: 8
        },
        {
          title: this.$t("home.time"),
          key: "blockTimestamp",
          color: "#333333",
          headColor: "#333333",
          minWidth: 10
        },
        {
          title: this.$t("home.from"),
          key: "from",
          color: "#4765C0",
          headColor: "#333333",
          path: "/accountDetail",
          query: [{ key: "accountAddress", value: "from" }],
          minWidth: 12
        },
        {
          title: this.$t("home.to"),
          key: "to",
          color: "#4765C0",
          headColor: "#333333",
          path: "/accountDetail",
          query: [{ key: "accountAddress", value: "to" }],
          minWidth: 12
        },
        {
          title: this.$t("home.results"),
          key: "success",
          color: "#333",
          headColor: "#333333",
          type: "status",
          minWidth: 6
        },
        {
          title: this.$t("home.transferAmount"),
          key: "amountTxt",
          color: "#333333",
          headColor: "#333333",
          unit: "CRU",
          minWidth: 10
        },
        {
          title: this.$t("home.extrinsicHash"),
          key: "hash",
          color: "#4765C0",
          headColor: "#333333",
          path: "/transactionDetail",
          query: ["blockNum", "extrinsicIndex", "extrinsicHash"],
          minWidth: 12
        }
      ];
      // 收益-罚金
      this.tableColumn3 = [
        {
          title: this.$t("home.eventIndex"),
          key: "eventIndex",
          headColor: "#333333",
          color: "#4765C0",
          path: "/transactionDetail",
          query: ["blockNum", "extrinsicIndex", "extrinsicHash"],
          minWidth: 8
        },
        {
          title: this.$t("home.block"),
          key: "blockNum",
          color: "#4765C0",
          headColor: "#333333",
          path: "/blockDetail",
          query: ["blockNum"],
          minWidth: 8
        },
        {
          title: this.$t("home.extrinsicHash"),
          key: "extrinsicHash",
          color: "#4765C0",
          headColor: "#333333",
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
        },
        {
          title: this.$t("home.action"),
          key: "operation",
          color: "#333",
          headColor: "#333333",
          minWidth: 10
        },
        {
          title: this.$t("home.rewardAmount"),
          key: "amountTxt",
          color: "#333",
          headColor: "#333333",
          unit: "CRU",
          minWidth: 12
        }
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
    }
  }
};
</script>
<style lang="scss" scoped>
.detail-wrap {
  padding: 0 0 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .detail-main {
    margin-top: 1.5rem;
    .detail-head {
      width: 100%;
      display: flex;
      flex-direction: column;
      .title {
        font-size: 2.2rem;
        color: #333;
        font-weight: bold;
      }
      .name {
        font-size: 1.4rem;
        color: #9a9a9a;
        margin: 0.8rem 0 0;
      }
    }
    .block-detail-box {
      width: 100%;
      margin: 1.5rem 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      .empty {
        margin: 3rem 0;
      }
      .verifier-wrap {
        width: 100%;
        height: 3.5rem;
        border-radius: 0.8rem;
        background-color: #fff;
        display: flex;
        align-items: center;
        box-shadow: 0 0 1.5rem 0.2rem rgba(0, 0, 0, 0.1);
        padding: 0 1.5rem;
        color: #333333;
        font-size: 1.2rem;
        img {
          width: 1.3rem;
          margin-right: 0.3rem;
        }
        .value {
          margin: 0 1rem;
        }
        .copy {
          min-width: 5.5rem;
          padding: 0.3rem 1rem;
          border: 0.1rem solid #e8a134;
          color: #e8a134;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10rem;
          font-size: 0.8rem;
          img {
            margin-right: 0.2rem;
            width: 0.8rem;
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
            border-radius: 0.7rem;
            background-color: #fff;
            color: #333;
            font-size: 0.9rem;
            box-shadow: 0 0 0.7rem 0.2rem rgba(0, 0, 0, 0.1);
          }
        }
      }
      .detail-box {
        width: 100%;
        margin: 1.5rem 0 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .box {
          background-color: #fff;
          width: 48%;
          box-shadow: 0 0 1.5rem 0.2rem rgba(0, 0, 0, 0.1);
          border-radius: 0.7rem;
          .title {
            height: 3.5rem;
            display: flex;
            align-items: center;
            padding: 0 1.5rem;
            font-size: 1.3rem;
            font-weight: bold;
            border-bottom: 0.1rem solid #eee;
          }
          .row-wrap {
            .row:last-child {
              border: none;
            }
            .row {
              padding: 0 1.5rem;
              height: 3.5rem;
              font-size: 1.2rem;
              display: flex;
              align-items: center;
              border-bottom: 0.1rem solid #eee;
              .lable {
                width: 5rem;
                text-align: left;
                color: #9a9a9a;
              }
              .value {
                flex: 1;
                text-align: left;
                display: flex;
                align-items: center;
                .tag {
                  display: inline-block;
                  background-color: #f6eacb;
                  padding: 0.4rem 1rem;
                  border-radius: 0.4rem;
                  color: #744e19;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 1rem;
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
                border: 0.1rem solid #e8a134;
                border-radius: 10rem;
                padding: 0.2rem 1rem;
                font-size: 0.8rem;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                overflow: hidden;
                .float {
                  opacity: 0;
                  position: absolute;
                  z-index: 99;
                  right: 0;
                  margin: auto;
                }
                .float {
                  top: calc(100% + 0.7rem);
                  width: 25rem;
                  font-size: 1.1rem;
                  height: auto;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  border-radius: 0.7rem;
                  background-color: #fff;
                  color: #333;
                  box-shadow: 0 0 0.7rem 0.2rem rgba(0, 0, 0, 0.1);
                  padding: 0.5rem 0.7rem;
                  .p:last-child {
                    border: none;
                  }
                  .p {
                    width: 100%;
                    height: auto;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0.5rem 0;
                    border-bottom: 0.1rem solid #eee;
                    .left {
                      flex: 1;
                      text-align: left;
                    }
                    .right {
                      flex: 2;
                      .unit {
                        margin-left: 0.4rem;
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
    width: 100%;
    height: auto;
    border-radius: 0.7rem;
    box-shadow: 0 0 1.5rem 0.2rem rgba(0, 0, 0, 0.1);
    .table-head {
      background-color: #f8f8f8;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.7rem 1rem 0;
      .left {
        flex: 1;
        display: flex;
        align-items: center;
        .tab-item {
          max-width: 33.33%;
          padding: 1rem 1rem;
          width: auto;
          height: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.7rem 0.7rem 0 0;
          font-size: 1.3rem;
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
          margin-left: 0.7rem;
        }
      }
    }
    .table-box {
      width: 100%;
    }
  }
  .bottom-table-wrap {
    width: 121.5rem;
    .bottom-head {
      font-size: 2rem;
      color: #333;
      font-weight: bold;
      padding: 2.5rem 0 0.7rem;
    }
    .bottom-table {
      width: 100%;
      border-radius: 0.7rem;
      box-shadow: 0 0 1.5rem 0.2rem rgba(0, 0, 0, 0.1);
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
  border-radius: 0.7rem !important;
  background-color: #fff !important;
  box-shadow: 0 0 0.7rem 0 rgba(0, 0, 0, 0.1) !important;
}
</style>