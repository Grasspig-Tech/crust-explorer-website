<template>
  <div class="data-wrap">
    <div
      class="bottom-wrap main-box"
      :style="{
        'flex-direction': $store.state.bodyDirection == 0 ? 'row' : 'column',
      }"
    >
      <div
        class="pledge-wrap"
        :style="{
          width: $store.state.bodyDirection == 0 ? '45%' : '100%',
          'margin-bottom': $store.state.bodyDirection == 1 ? '2rem' : '0',
        }"
      >
        <div class="title click" @click="goPath('/effectivePledge', 2, 0)">
          <span>{{$t('home.effectiveStakeDistribution')}}</span>
          <img :src="require('@/assets/imgs/more.png')" />
        </div>
        <div
          class="content"
          :style="{
            height: $store.state.bodyDirection == 1 ? '30rem' : '100%',
          }"
          v-loading="loading1"
        >
          <Chart :option="option"></Chart>
        </div>
      </div>
      <div class="block-wrap" :style="{ width: $store.state.bodyDirection == 0 ? '54%' : '100%' }">
        <div class="title click" @click="goPath('/blockList', 1, 0)">
          <span>{{$t('home.latestBlocks')}}</span>
          <img :src="require('@/assets/imgs/more.png')" />
        </div>
        <div class="content">
          <Table
            :tableColumn="tableColumn"
            :tableData="tableData"
            :trColor="'#2f3346'"
            :isHome="true"
          ></Table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from "@/components/chart.vue";
import Table from "@/components/tableStatus.vue";
import { getBlockListApi } from "@/api/block.js";
import { getEffectivePledgeApi } from "@/api/statistics.js";

export default {
  components: { Chart, Table },
  props: ["blockList"],
  data() {
    return {
      newDataList: [],
      loading: true,
      loading1: true,
      option: {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        grid: {
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          containLabel: true
        },
        series: [
          {
            name: this.$t("home.effectIvestake"),
            type: "pie",
            radius: "50%",
            data: [],
            label: {
              color: "inherit"
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      },
      tableColumn: [
        {
          title: this.$t("home.blocks"),
          key: "blockNum",
          headColor: "#fff",
          color: "#F9D007",
          path: "/blockDetail",
          query: ["blockNum"],
          minWidth: 6
        },
        {
          title: this.$t("home.status"),
          key: "finalized",
          color: "#fff",
          headColor: "#fff",
          type: "status",
          minWidth: 5
        },
        {
          title: this.$t("home.time"),
          key: "blockTimestamp",
          color: "#fff",
          headColor: "#fff",
          minWidth: 8
        },
        {
          title: this.$t("home.extrinsics"),
          key: "extrinsicsCount",
          color: "#F9D007",
          headColor: "#fff",
          path: "/blockDetail",
          query: ["blockNum"],
          minWidth: 5
        },
        {
          title: this.$t("home.event"),
          key: "eventCount",
          color: "#F9D007",
          headColor: "#fff",
          path: "/blockDetail",
          query: ["blockNum", { current: 2 }],
          minWidth: 5
        },
        {
          title: this.$t("home.validators"),
          key: "accountDisplay",
          color: "#F9D007",
          headColor: "#fff",
          path: "/verifierDetail",
          query: [{ key: "accountAddress", value: "validator" }],
          minWidth: 12
        },
        {
          title: this.$t("home.blockHash"),
          key: "hash",
          color: "#F9D007",
          headColor: "#fff",
          path: "/blockDetail",
          query: ["blockNum"],
          minWidth: 12
        }
      ],
      tableData: []
    };
  },
  watch: {
    blockList(val) {
      this.tableData = [...val];
    },
    "$i18n.locale": {
      handler: function() {
        this.option.series[0].name = this.$t("home.effectIvestake");
        this.tableColumn[0].title = this.$t("home.blocks");
        this.tableColumn[1].title = this.$t("home.status");
        this.tableColumn[2].title = this.$t("home.time");
        this.tableColumn[3].title = this.$t("home.extrinsics");
        this.tableColumn[4].title = this.$t("home.event");
        this.tableColumn[5].title = this.$t("home.validators");
        this.tableColumn[6].title = this.$t("home.blockHash");
      }
    }
  },
  created() {
    this.getBlockList();
    this.getData();
  },
  methods: {
    goPath(path, index, i) {
      this.$router.push(path);
      this.$store.commit("changeHeadTab", { index, i });
    },
    getData() {
      getEffectivePledgeApi(1).then(res => {
        if (res.code == 200) {
          var arr = [];
          res.data.map(item => {
            arr.push({
              value: item.total * item.mapRatio,
              name: item.display || item.address
            });
          });
          this.option.series[0].data = arr;
          this.loading1 = false;
        }
      });
    },
    getBlockList() {
      getBlockListApi({ pageSize: 10, page: 1 }).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.records;
        }
        this.loading = false;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.data-wrap {
  margin-bottom: 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: auto;
  .bottom-wrap {
    height: auto;
    display: flex;
    justify-content: space-between;
    > div {
      border-radius: 1rem;
      background-color: rgba(#2f3346, 0.7);
      display: flex;
      flex-direction: column;
      align-items: center;
      .title {
        padding: 0 1rem;
        height: 4rem;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        span {
          font-size: 1.7rem;
          color: #fff;
        }
        img {
          width: 1.5rem;
        }
      }
      .content {
        width: 100%;
      }
    }
    .pledge-wrap {
      width: 45%;
      .content {
        height: 100%;
        padding-bottom: 2.5rem;
      }
    }
    .block-wrap {
      width: 50%;
      .content {
        height: auto;
      }
    }
  }
}
::v-deep .el-loading-mask {
  background-color: rgba(0, 0, 0, 0.3);
}
</style>