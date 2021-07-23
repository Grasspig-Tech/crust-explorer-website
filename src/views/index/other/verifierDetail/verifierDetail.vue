<template>
  <div class="detail-wrap">
    <div class="detail-main">
      <div class="block-detail-box" v-loading="loading1">
        <div class="detail-head">
          <div
            class="text"
          >{{$route.query.current==2?'候选验证人':'验证人'}} # {{ accountDisplay.display || accountDisplay.address }}</div>
          <div class="copy click" @click="$utils.copy($route.query.accountAddress)">
            <img :src="require('@/assets/imgs/fuzhi.png')" alt="复制" />
            <span>复制</span>
          </div>
        </div>
        <div class="detail-list" v-if="ifEmpty">
          <div class="empty">暂无数据</div>
        </div>
        <div class="detail-list" v-else>
          <div class="row" v-for="(item, key, index) in detail" :key="index">
            <div class="title">{{ item.label }}</div>
            <div class="content">
              <div class="icon-wrap" v-if="key == 'accountAddress'">
                <img v-if="!item.verify" :src="require('@/assets/imgs/weiyanzheng.png')" />
                <img v-else :src="require('@/assets/imgs/yanzhengren.png')" />
                <div class="float">
                  <span>{{ item.verify ? "身份等级：一般" : "身份等级：未验证" }}</span>
                </div>
                <div class="arrow"></div>
              </div>
              <div class="value">
                <span v-if="$route.query.current==2&&key=='memberRank'">候选验证人</span>
                <span v-else>{{ item.value == null ? "-" : item.value }}</span>
                <span class="unit" v-if="item.value != null && item.unit">
                  {{
                  item.unit
                  }}
                </span>
              </div>
            </div>
            <div class="copy-wrap">
              <div class="copy" @click="$utils.copy(item.value)" v-if="item.copy">
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
            <div
              class="tab-item click"
              v-for="(item, index) in tabs"
              :key="index"
              :class="current == index + 1 ? 'active' : ''"
              @click="changeTab(index)"
            >{{ item.label }}({{ item.total }})</div>
          </div>
          <div class="right click" v-if="!ifEmpty" @click="goAllList()">
            <span>全部</span>
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
          label: "提名人",
          total: "0"
        },
        {
          label: "收益&罚金",
          total: "0"
        },
        {
          label: "交易",
          total: "0"
        }
      ],
      detail: {
        accountAddress: {
          label: "账户",
          value: "",
          verify: false,
          copy: true
        },
        controllerAccountAddress: {
          label: "控制账户",
          value: "",
          copy: true
        },
        memberRank: {
          label: "排名",
          value: ""
        },
        bondedOwner: {
          label: "验证人冻结",
          value: "",
          unit: "CRU"
        },
        allFrozen: {
          label: "全网冻结",
          value: "",
          unit: "CRU"
        },
        countNominators: {
          label: "提名人",
          value: ""
        },
        guaranteeFee: {
          label: "扣留费率",
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
          title: "账户",
          key: "accountDisplay",
          headColor: "#333333",
          color: "#4765C0",
          path: "/accountDetail",
          query: [{ key: "accountAddress", value: "nominatorAddress" }]
        },
        {
          title: "提名金额",
          key: "bondedTxt",
          color: "#333",
          headColor: "#333333",
          unit: "CRU"
        },
        {
          title: "占比",
          key: "quotient",
          color: "#333",
          headColor: "#333333",
          unit: "%"
        }
      ];
      // 收益-罚金
      this.tableColumn2 = [
        {
          title: "事件id",
          key: "eventIndex",
          headColor: "#333333",
          color: "#4765C0",
          path: "/transactionDetail",
          query: ["blockNum", "extrinsicIndex", "extrinsicHash"]
        },
        {
          title: "区块",
          key: "blockNum",
          color: "#4765C0",
          headColor: "#333333",
          path: "/blockDetail",
          query: ["blockNum"]
        },
        {
          title: "交易哈希",
          key: "extrinsicHash",
          color: "#4765C0",
          headColor: "#333333",
          path: "/transactionDetail",
          query: ["blockNum", "extrinsicIndex", "extrinsicHash"]
        },
        {
          title: "时间",
          key: "blockTimestamp",
          color: "#333",
          headColor: "#333333"
        },
        {
          title: "操作",
          key: "operation",
          color: "#333",
          headColor: "#333333"
        },
        {
          title: "数量",
          key: "amountTxt",
          color: "#333",
          headColor: "#333333",
          unit: "CRU"
        }
      ];
      // 交易
      this.tableColumn3 = [
        {
          title: "交易id",
          key: "extrinsicIndex",
          headColor: "#333333",
          color: "#4765C0",
          path: "/transactionDetail",
          query: ["blockNum", "extrinsicIndex", "extrinsicHash"]
        },
        {
          title: "区块",
          key: "blockNum",
          color: "#4765C0",
          headColor: "#333333",
          path: "/blockDetail",
          query: ["blockNum"]
        },
        {
          title: "交易哈希",
          key: "extrinsicHash",
          color: "#4765C0",
          headColor: "#333333",
          path: "/transactionDetail",
          query: ["blockNum", "extrinsicIndex", "extrinsicHash"]
        },
        {
          title: "时间",
          key: "blockTimestamp",
          color: "#333",
          headColor: "#333333"
        },
        {
          title: "结果",
          key: "success",
          color: "#333",
          headColor: "#333333",
          type: "status"
        },
        {
          title: "操作",
          key: "operation",
          color: "#333",
          headColor: "#333333"
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
  padding: 0 0 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .detail-main {
    margin-top: 20px;
    width: 1230px;
    .block-detail-box {
      width: 1230px;
      border-radius: 10px;
      background-color: #fff;
      box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.1);
      margin-bottom: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 20px;
      .detail-head {
        padding: 0 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: auto;
        height: 40px;
        background-color: #f7f7f9;
        border-radius: 10px;
        .copy {
          border: 1px solid #e8a134;
          color: #e8a134;
          border-radius: 90px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 30px;
          margin-left: 20px;
          img {
            width: 12px;
            margin-right: 6px;
          }
        }
        .text {
          font-size: 16px;
          color: #333333;
          font-weight: bold;
        }
      }
      .detail-list {
        .empty {
          padding: 20px 0 40px;
        }
      }
      .detail-list {
        width: 100%;
        padding-top: 20px;
        .row {
          height: 40px;
          border-bottom: 1px solid #eee;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 14px;
          color: #333;
          .title {
            flex: 2;
          }
          .content {
            flex: 3;
            display: flex;
            align-items: center;
            justify-content: center;
            .unit {
              margin-left: 6px;
            }
            .icon-wrap:hover {
              overflow: inherit;
              .float,
              .arrow {
                opacity: 1;
              }
            }
            .icon-wrap {
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
                margin-right: 10px;
              }
            }
          }
          .copy-wrap {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 200px;
            .copy {
              border: 1px solid #e8a134;
              color: #e8a134;
              border-radius: 90px;
              width: 80px;
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