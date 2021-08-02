<template>
  <div class="block-wrap">
    <div class="main-box">
      <div class="block-detail-box" v-loading="loading1">
        <div class="detail-head">
          <div class="left arrow click" @click="changeNum(-1)">
            <img :src="require('@/assets/imgs/left.png')" />
          </div>
          <div class="text">{{$t('home.block')}} # {{ blockNum }}</div>
          <div class="right arrow click" @click="changeNum(1)">
            <img :src="require('@/assets/imgs/right.png')" />
          </div>
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
                  <span>{{ item.verify ? $t('home.identity1') : $t('home.identity2') }}</span>
                </div>
                <div class="arrow" v-if="key == 'validator'"></div>
              </div>
              <div
                class="value break-word"
                v-if="key == 'blockTimestamp'"
              >{{ $utils.getLastTime(item.value) }}</div>
              <div class="value break-word" v-if="key == 'date'">{{ $utils.toUTCtime(item.value) }}</div>
              <div class="value break-word" v-if="key != 'blockTimestamp' && key != 'date'">
                <span v-if="item.value1">{{ item.value1 }}</span>
                <span>{{ item.value }}</span>
              </div>
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
            <div
              class="tab-item click"
              :class="current == 1 ? 'active' : ''"
              @click="changeTab(1)"
            >{{$t('home.extrinsics')}}({{ extrinsicsCount }})</div>
            <div
              class="tab-item click"
              :class="current == 2 ? 'active' : ''"
              @click="changeTab(2)"
            >{{$t('home.event')}}({{ eventCount }})</div>
          </div>
          <div class="right click" v-if="!ifEmpty" @click="goAllPath()">
            <span>{{$t('home.all')}}</span>
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
          label: this.$t("home.time"),
          value: ""
        },
        status: {
          label: this.$t("home.status"),
          value: "",
          finalized: true
        },
        hash: {
          label: this.$t("home.blockHash"),
          value: "",
          copy: true
        },
        parentHash: {
          label: this.$t("home.blockParentHash"),
          value: "",
          path: "/blockDetail"
        },
        stateRoot: {
          label: this.$t("home.stateRoot"),
          value: ""
        },
        extrinsicsRoot: {
          label: this.$t("home.transactionRoot"),
          value: ""
        },
        validator: {
          label: this.$t("home.validators"),
          value: "",
          value1: "",
          verify: true,
          copy: true,
          path: "/verifierDetail",
          query: ["accountAddress"]
        },
        blockTimestamp: {
          label: this.$t("home.blockTime"),
          value: ""
        },
        specVersion: {
          label: this.$t("home.runtimeVersion"),
          value: ""
        }
      },
      tableColumn1: [
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
          color: "#333",
          headColor: "#333333",
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
        }
      ],
      tableColumn2: [
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
      tableData1: [],
      tableData2: [],
      blockNum: "" // 区块号
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
    "$i18n.locale": {
      handler: function() {
        this.detail.date.label = this.$t("home.extrinsicRecord");
        this.detail.status.label = this.$t("home.status");
        this.detail.hash.label = this.$t("home.blockHash");
        this.detail.parentHash.label = this.$t("home.blockParentHash");
        this.detail.stateRoot.label = this.$t("home.stateRoot");
        this.detail.extrinsicsRoot.label = this.$t("home.transactionRoot");
        this.detail.validator.label = this.$t("home.validators");
        this.detail.blockTimestamp.label = this.$t("home.blockTime");
        this.detail.specVersion.label = this.$t("home.runtimeVersion");

        this.tableColumn1[0].title = this.$t("home.extrinsicIndex");
        this.tableColumn1[1].title = this.$t("home.block");
        this.tableColumn1[2].title = this.$t("home.extrinsicHash");
        this.tableColumn1[3].title = this.$t("home.time");
        this.tableColumn1[4].title = this.$t("home.results");

        this.tableColumn2[0].title = this.$t("home.eventIndex");
        this.tableColumn2[1].title = this.$t("home.block");
        this.tableColumn2[2].title = this.$t("home.extrinsicHash");
        this.tableColumn2[3].title = this.$t("home.time");
      }
    }
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
      getBlockDetailByNumApi(this.blockNum).then(res => {
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
          pageSize: 10
        }).then(res => {
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
          pageSize: 10
        }).then(res => {
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
          item.query.map(t => {
            query += `${t}=${item.value}`;
          });
          this.$router.push(item.path + `?${query}`);
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
      width: 20rem;
      height: 2.5rem;
      background-color: #f7f7f9;
      border-radius: 0.8rem;
      .text {
        flex: 1;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        color: #333333;
        font-weight: bold;
      }
      .arrow {
        background-color: #fff;
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 0.8rem;
        box-shadow: 0 0 0.8rem 0 rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          width: 0.6rem;
        }
      }
    }
    .detail-main {
      width: 100%;
      padding-top: 1.5rem;
      .empty {
        font-size: 1rem;
        margin: 2.5rem 0 3.5rem;
      }
      .row {
        min-height: 2.5rem;
        padding: 0.8rem 1rem;
        line-height: 1.6;
        border-bottom: 0.1rem solid #eee;
        display: flex;
        align-items: center;
        justify-content: space-around;
        font-size: 1.1rem;
        color: #333;
        .title {
          flex: 1;
          max-width: 8rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .content.click {
          color: #4765c0;
        }
        .content {
          flex: 3;
          display: flex;
          align-items: center;
          justify-content: center;

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
            position: relative;
            overflow: hidden;
            min-width: 2rem;
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
              font-size: 1rem;
              box-shadow: 0 0 0.8rem 0.2rem rgba(0, 0, 0, 0.1);
            }
            img {
              width: 1.4rem;
              margin-right: 0.5rem;
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
            padding: 0.3rem 0.5rem;
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
          color: #333;
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
</style>