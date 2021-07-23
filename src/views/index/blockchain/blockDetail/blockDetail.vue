<template>
  <div class="block-wrap">
    <div class="block-detail-box" v-loading="loading1">
      <div class="detail-head">
        <div class="left arrow click" @click="changeNum(-1)">
          <img :src="require('@/assets/imgs/left.png')" />
        </div>
        <div class="text">区块 # {{ blockNum }}</div>
        <div class="right arrow click" @click="changeNum(1)">
          <img :src="require('@/assets/imgs/right.png')" />
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
                v-if="!item.verify && key == 'validator'"
                :src="require('@/assets/imgs/weiyanzheng.png')"
              />
              <img
                v-if="item.verify && key == 'validator'"
                :src="require('@/assets/imgs/yanzhengren.png')"
              />
              <img
                v-if="!item.finalized && key == 'status'"
                :src="require('@/assets/imgs/dengdai.png')"
              />
              <img
                v-if="item.finalized && key == 'status'"
                :src="require('@/assets/imgs/chenggong.png')"
              />
              <div class="float" v-if="key == 'validator'">
                <span>
                  {{ item.verify ? "身份等级：一般" : "身份等级：未验证" }}
                </span>
              </div>
              <div class="arrow" v-if="key == 'validator'"></div>
            </div>
            <div class="value break-word" v-if="key == 'blockTimestamp'">
              {{ $utils.getLastTime(item.value) }}
            </div>
            <div class="value break-word" v-if="key == 'date'">
              {{ $utils.toUTCtime(item.value) }}
            </div>
            <div
              class="value break-word"
              v-if="key != 'blockTimestamp' && key != 'date'"
            >
              <span v-if="item.value1">{{ item.value1 }}</span>
              <span>{{ item.value }}</span>
            </div>
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
          <div
            class="tab-item click"
            :class="current == 1 ? 'active' : ''"
            @click="changeTab(1)"
          >
            交易({{ extrinsicsCount }})
          </div>
          <div
            class="tab-item click"
            :class="current == 2 ? 'active' : ''"
            @click="changeTab(2)"
          >
            事件({{ eventCount }})
          </div>
        </div>
        <div class="right click" v-if="!ifEmpty" @click="goAllPath()">
          <span>全部</span>
          <img :src="require('@/assets/imgs/more_hui.png')" alt />
        </div>
      </div>
      <div class="table-box">
        <Table
          :tableColumn="
            current == 1 ? tableColumn1 : current == 2 ? tableColumn2 : ''
          "
          :tableData="
            current == 1 ? tableData1 : current == 2 ? tableData2 : ''
          "
          :trColor="'#F1F0EE'"
        ></Table>
      </div>
    </div>
  </div>
</template>

<script>
import Table from "@/components/tableStatus.vue";
import { getBlockDetailByNumApi } from "@/api/block.js";
import { getBlockEventApi } from "@/api/event.js";
import { getBlockExtrinsicApi } from "@/api/extrinsic.js";
export default {
  components: { Table },
  data() {
    return {
      loading: true,
      loading1: true,
      current: 1,
      ifEmpty: false,
      extrinsicsCount: 0,
      eventCount: 0,
      accountDisplay: {},
      detail: {
        date: {
          label: "时间戳",
          value: "",
        },
        status: {
          label: "块状态",
          value: "",
          finalized: true,
        },
        hash: {
          label: "哈希",
          value: "",
          copy: true,
        },
        parentHash: {
          label: "父哈希",
          value: "",
          path: "/blockDetail",
        },
        stateRoot: {
          label: "状态根",
          value: "",
        },
        extrinsicsRoot: {
          label: "交易根",
          value: "",
        },
        validator: {
          label: "验证人",
          value: "",
          value1: "",
          verify: true,
          copy: true,
          path: "/verifierDetail",
          query: ["accountAddress"],
        },
        blockTimestamp: {
          label: "出块时间",
          value: "",
        },
        specVersion: {
          label: "运行时版本",
          value: "",
        },
      },
      tableColumn1: [
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
          color: "#333",
          headColor: "#333333",
        },
        {
          title: "哈希",
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
      ],
      tableColumn2: [
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
      tableData1: [],
      tableData2: [],
      blockNum: "", // 区块号
    };
  },
  created() {
    this.blockNum = this.$route.query.blockNum;
    if (this.$route.query.current) this.current = this.$route.query.current;
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
    goAllPath() {
      if (this.current == 1)
        this.$router.push(`/transaction?blockNum=${this.blockNum}`);
      if (this.current == 2)
        this.$router.push(`/eventList?blockNum=${this.blockNum}`);
    },
    changeTab(num) {
      this.current = num;
      this.getList();
    },
    // 切换区块
    changeNum(num) {
      this.blockNum = Number(this.blockNum) + num;
      this.$router.push(`/blockDetail?blockNum=${this.blockNum}`);
    },
    getDetail() {
      getBlockDetailByNumApi(this.blockNum).then((res) => {
        if (res.code == 200) {
          if (res.data) {
            this.ifEmpty = false;
            this.accountDisplay = JSON.parse(res.data.accountDisplay);
            if (this.accountDisplay.judgements.length == 0)
              this.detail.validator.verify = false;
            if (this.accountDisplay.judgements.length > 0)
              this.detail.validator.verify = true;
            this.detail.date.value = res.data.blockTimestamp;
            this.detail.blockTimestamp.value = res.data.blockTimestamp;
            this.detail.status.value =
              res.data.finalized == 1 ? "已确认" : "未确认";
            if (res.data.finalized == 0) this.detail.status.finalized = false;
            if (res.data.finalized == 1) this.detail.status.finalized = true;
            this.detail.hash.value = res.data.hash;
            this.detail.parentHash.value = res.data.parentHash;
            this.detail.stateRoot.value = res.data.stateRoot;
            this.detail.extrinsicsRoot.value = res.data.extrinsicsRoot;
            this.detail.validator.value = this.accountDisplay.address;
            this.detail.validator.value1 = this.accountDisplay.display;
            this.detail.specVersion.value = res.data.specVersion;
            this.extrinsicsCount = res.data.extrinsicsCount;
            this.eventCount = res.data.eventCount;
            this.getList();
          } else {
            this.ifEmpty = true;
            this.loading = false;
          }
        }
        this.loading1 = false;
      });
    },
    getList() {
      if (this.current == 1) {
        getBlockExtrinsicApi({
          blockNum: this.blockNum,
          page: 1,
          pageSize: 10,
        }).then((res) => {
          if (res.code == 200) {
            this.tableData1 = res.data.records;
            if (res.data.records.length == 0) {
              if (this.extrinsicsCount > 0) this.getList();
            } else {
              this.loading = false;
            }
          } else {
            this.loading = false;
          }
        });
      } else if (this.current == 2) {
        getBlockEventApi({
          blockNum: this.blockNum,
          page: 1,
          pageSize: 10,
        }).then((res) => {
          if (res.code == 200) {
            this.tableData2 = res.data.records;
            if (res.data.records.length == 0) {
              if (this.eventCount > 0) this.getList();
            } else {
              this.loading = false;
            }
          } else {
            this.loading = false;
          }
        });
      }
    },
    goPath(item, key) {
      if (!item.path) return;
      if (key == "parentHash") {
        this.changeNum(-1);
        return;
      }
      if (this.$router.currentRoute.path != item.path) {
        var query = "";
        if (item.query.length > 0) {
          item.query.map((t) => {
            query += `${t}=${item.value}`;
          });
          this.$router.push(item.path + `?${query}`);
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
      width: 330px;
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
      .arrow {
        background-color: #fff;
        width: 40px;
        height: 40px;
        border-radius: 10px;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          width: 11px;
        }
      }
    }
    .detail-main {
      width: 100%;
      padding-top: 20px;
      .empty {
        font-size: 16px;
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
        .content.click {
          color: #4765c0;
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
          color: #333;
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
}
</style>