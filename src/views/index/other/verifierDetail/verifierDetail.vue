<template>
  <div class="detail-wrap">
    <div class="detail-main main-box">
      <div class="block-detail-box" v-loading="loading1">
        <div class="detail-head">
          <div class="text">
            {{ $route.query.current == 2 ? $t('home.waitingValidators') : $t('home.validators') }} #
            {{ accountDisplay.display || accountDisplay.address }}
          </div>
          <div class="copy click" @click="$utils.copy($route.query.accountAddress)">
            <img :src="require('@/assets/imgs/fuzhi.png')" />
            <span>{{$t('home.copy')}}</span>
          </div>
        </div>
        <div class="detail-list" v-if="ifEmpty">
          <div class="empty">{{$t('home.empty')}}</div>
        </div>
        <div class="detail-list" v-else>
          <div class="row" v-for="(item, key, index) in detail" :key="index">
            <div class="title">{{ item.label }}</div>
            <div class="content">
              <div class="icon-wrap" v-if="key == 'accountAddress'">
                <img v-if="!item.verify" :src="require('@/assets/imgs/weiyanzheng.png')" />
                <img v-else :src="require('@/assets/imgs/yanzhengren.png')" />
                <div class="float">
                  <span>
                    {{
                    item.verify ? $t('home.identity1') : $t('home.identity2')
                    }}
                  </span>
                </div>
                <div class="arrow"></div>
              </div>
              <div class="value break-word">
                <span
                  v-if="$route.query.current == 2 && key == 'memberRank'"
                >{{$t('home.waitingValidators')}}</span>
                <span v-else>{{ item.value == null ? "-" : item.value }}</span>
                <span class="unit" v-if="item.value != null && item.unit">{{ item.unit }}</span>
              </div>
            </div>
            <div
              class="copy-wrap"
              :style="{
                'margin-left': $store.state.bodyDirection == 1 ? '0' : '2rem',
              }"
            >
              <div class="copy" @click="$utils.copy(item.value)" v-if="item.copy">
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
            <div
              class="tab-item click"
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
          <Table
            v-if="current == 1 || current == 2"
            :tableColumn="
              current == 1 ? tableColumn1 : current == 2 ? tableColumn2 : ''
            "
            :tableData="
              current == 1 ? tableData1 : current == 2 ? tableData2 : ''
            "
            :trColor="'#F1F0EE'"
          ></Table>
          <TableStatus
            v-if="current == 3"
            :tableColumn="tableColumn3"
            :tableData="tableData3"
            :trColor="'#F1F0EE'"
          ></TableStatus>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Table from "@/components/table.vue";
import TableStatus from "@/components/tableStatus.vue";
import { getVerifierDetailApi } from "@/api/verifier.js";
import { getNominatorsListApi } from "@/api/nominators.js";
import { getRewardListApi } from "@/api/reward.js";
import { getExtrinsicListApi } from "@/api/extrinsic.js";

export default {
  components: { Table, TableStatus },
  data() {
    return {
      current: 1,
      loading1: true,
      loading: true,
      ifEmpty: false,
      accountDisplay: {},
      tabs: [
        {
          label: this.$t("home.nominators"),
          total: "0"
        },
        {
          label: this.$t("home.gainsPenalties"),
          total: "0"
        },
        {
          label: this.$t("home.extrinsics"),
          total: "0"
        }
      ],
      detail: {
        accountAddress: {
          label: this.$t("home.account"),
          value: "",
          verify: false,
          copy: true
        },
        controllerAccountAddress: {
          label: this.$t("home.controlAccount"),
          value: "",
          copy: true
        },
        memberRank: {
          label: this.$t("home.rank"),
          value: ""
        },
        bondedOwner: {
          label: this.$t("home.verifierFreeze"),
          value: "",
          unit: "CRU"
        },
        allFrozen: {
          label: this.$t("home.totalBonded"),
          value: "",
          unit: "CRU"
        },
        countNominators: {
          label: this.$t("home.nominators"),
          value: ""
        },
        guaranteeFee: {
          label: this.$t("home.guaranteeFee"),
          value: "",
          unit: "%"
        }
      },
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
    "$i18n.locale": {
      handler: function() {
        this.tabs[0].label = this.$t("home.nominators");
        this.tabs[1].label = this.$t("home.gainsPenalties");
        this.tabs[2].label = this.$t("home.extrinsics");

        this.detail.accountAddress.label = this.$t("home.account");
        this.detail.controllerAccountAddress.label = this.$t(
          "home.controlAccount"
        );
        this.detail.memberRank.label = this.$t("home.rank");
        this.detail.bondedOwner.label = this.$t("home.verifierFreeze");
        this.detail.allFrozen.label = this.$t("home.totalBonded");
        this.detail.countNominators.label = this.$t("home.nominators");
        this.detail.guaranteeFee.label = this.$t("home.guaranteeFee");

        this.tableColumn1[0].title = this.$t("home.nominators");
        this.tableColumn1[1].title = this.$t("home.nominationAmount");
        this.tableColumn1[2].title = this.$t("home.proportion");

        this.tableColumn2[0].title = this.$t("home.eventIndex");
        this.tableColumn2[1].title = this.$t("home.block");
        this.tableColumn2[2].title = this.$t("home.extrinsicHash");
        this.tableColumn2[3].title = this.$t("home.time");
        this.tableColumn2[4].title = this.$t("home.action");
        this.tableColumn2[5].title = this.$t("home.rewardAmount");

        this.tableColumn3[0].title = this.$t("home.extrinsicIndex");
        this.tableColumn3[1].title = this.$t("home.block");
        this.tableColumn3[2].title = this.$t("home.extrinsicHash");
        this.tableColumn3[3].title = this.$t("home.time");
        this.tableColumn3[4].title = this.$t("home.results");
        this.tableColumn3[5].title = this.$t("home.action");
      }
    }
  },
  methods: {
    changeTab(index) {
      this.current = index + 1;
      this.getList();
    },
    getDetail() {
      this.loading1 = true;
      getVerifierDetailApi(this.$route.query.accountAddress).then(res => {
        if (res.code == 200) {
          if (res.data) {
            this.ifEmpty = false;
            this.accountDisplay = JSON.parse(res.data.accountDisplay);
            if (this.accountDisplay.judgements.length > 0)
              this.detail.accountAddress.verify = true; // 账户是否验证
            this.detail.accountAddress.value = res.data.accountAddress;
            this.detail.controllerAccountAddress.value =
              res.data.controllerAccountAddress;
            this.detail.memberRank.value = res.data.memberRank;
            this.detail.bondedOwner.value = res.data.bondedOwner;
            this.detail.allFrozen.value =
              res.data.bondedOwner + res.data.bondedNominators;
            this.detail.countNominators.value = res.data.countNominators;
            this.detail.guaranteeFee.value = (
              Number(res.data.guaranteeFee) * 100
            ).toFixed(2);
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
      this.getColumn();
      this.loading = true;
      if (init) {
        // 提名人
        this.getNominatorsList();
        // 收益-罚金
        this.getRewardList();
        // 交易
        this.getExtrinsicList();
      } else {
        switch (this.current) {
          case 1: // 提名人
            this.getNominatorsList();
            break;
          case 2: // 收益-罚金
            this.getRewardList();
            break;
          case 3: // 交易
            this.getExtrinsicList();
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
          this.tableData3 = res.data.records;
          this.tabs[2].total = res.data.total;
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
          this.tableData2 = res.data.records;
          this.tabs[1].total = res.data.total;
        }
      });
    },
    // 提名人
    getNominatorsList() {
      getNominatorsListApi({
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
    getColumn() {
      // 提名人
      this.tableColumn1 = [
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
      ];
      // 收益-罚金
      this.tableColumn2 = [
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
      // 交易
      this.tableColumn3 = [
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
    },
    goAllList() {
      switch (this.current) {
        case 1:
          this.$router.push(
            `/nominatorsList?accountAddress=${
              this.$route.query.accountAddress
            }&accountDisplay=${JSON.stringify(this.accountDisplay)}`
          );
          break;
        case 2:
          this.$router.push(
            `/rewardList?accountAddress=${
              this.$route.query.accountAddress
            }&accountDisplay=${JSON.stringify(this.accountDisplay)}`
          );
          break;
        case 3:
          this.$router.push(
            `/transaction?accountAddress=${
              this.$route.query.accountAddress
            }&accountDisplay=${JSON.stringify(this.accountDisplay)}`
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
    .block-detail-box {
      width: 100%;
      border-radius: 0.8rem;
      background-color: #fff;
      box-shadow: 0 0 1.5rem 0.2rem rgba(0, 0, 0, 0.1);
      margin-bottom: 0.8rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 1.5rem;
      .detail-head {
        padding: 0 0.8rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: auto;
        height: 3rem;
        background-color: #f7f7f9;
        border-radius: 0.5rem;
        .copy {
          border: 0.1rem solid #e8a134;
          color: #e8a134;
          border-radius: 10rem;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.3rem 1rem;
          margin-left: 1.4rem;
          font-size: 0.8rem;
          img {
            width: 0.8rem;
            margin-right: 0.5rem;
          }
        }
        .text {
          font-size: 1.3rem;
          color: #333333;
          font-weight: bold;
        }
      }
      .detail-list {
        .empty {
          padding: 1.5rem 0 2.5rem;
        }
      }
      .detail-list {
        width: 100%;
        padding-top: 1.5rem;
        .row {
          width: 100%;
          padding: 0.8rem 1rem;
          border-bottom: 0.1rem solid #eee;
          display: flex;
          align-items: center;
          justify-content: space-around;
          font-size: 1.2rem;
          color: #333;
          .title {
            flex: 1;
            max-width: 8rem;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .content {
            flex: 2;
            display: flex;
            align-items: center;
            justify-content: center;
            .unit {
              margin-left: 0.5rem;
            }
            .icon-wrap:hover {
              overflow: inherit;
              .float,
              .arrow {
                opacity: 1;
              }
            }
            .icon-wrap {
              padding-left: 1rem;
              display: flex;
              align-items: center;
              justify-content: center;
              position: relative;
              overflow: hidden;
              .arrow,
              .float {
                opacity: 0;
                position: absolute;
                z-index: 99;
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
                font-size: 0.8rem;
                box-shadow: 0 0 0.8rem 0.2rem rgba(0, 0, 0, 0.1);
              }
              img {
                width: 1.1rem;
                margin-right: 0.8rem;
              }
            }
          }
          .copy-wrap {
            display: flex;
            align-items: center;
            justify-content: center;
            .copy {
              padding-right: 2rem;
              border: 0.1rem solid #e8a134;
              color: #e8a134;
              border-radius: 10rem;
              padding: 0.3rem 1rem;
              font-size: 0.8rem;
              display: flex;
              align-items: center;
              justify-content: center;
              img {
                width: 0.8rem;
                margin-right: 0.2rem;
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
    border-radius: 0.8rem;
    box-shadow: 0 0 1.8rem 0.1rem rgba(0, 0, 0, 0.1);
    .table-head {
      background-color: #f8f8f8;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.8rem 1rem 0;
      .left {
        display: flex;
        align-items: center;
        .tab-item {
          padding: 0 1rem;
          width: auto;
          height: 4rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.8rem 0.8rem 0 0;
          font-size: 1.3rem;
          font-weight: bold;
        }
        .active {
          background-color: #fff;
          color: #df922c;
        }
      }
      .right {
        display: flex;
        align-items: center;
        span {
          color: #bcbcbc;
          font-size: 1.2rem;
        }
        img {
          width: 1rem;
          margin-left: 0.8rem;
        }
      }
    }
    .table-box {
      width: 100%;
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
  border-radius: 0.8rem !important;
  background-color: #fff !important;
  box-shadow: 0 0 0.8rem 0 rgba(0, 0, 0, 0.1) !important;
}
</style>