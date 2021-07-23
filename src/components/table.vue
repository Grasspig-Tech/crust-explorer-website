<template>
  <div class="table-wrap">
    <div class="table" v-loading="$parent.loading">
      <div class="tr">
        <div
          class="th"
          v-for="(th, index) in thisTableColumn"
          :key="index"
          :class="th.width ? '' : 'flex'"
          :style="{ color: th.headColor, width: th.width + 'px' }"
        >
          {{ th.title }}
        </div>
      </div>
      <div v-if="!$parent.loading && thisTableData.length > 0">
        <div class="tr" v-for="(td, i) in thisTableData" :key="i">
          <div
            class="td"
            v-for="(th, index) in thisTableColumn"
            :key="index"
            :class="{ flex: !th.width, click: th.path }"
            :style="{
              'background-color': i % 2 == 0 ? trColor : trColor1,
              color: th.color,
              height: tdHeight + 'px',
              width: th.width + 'px',
            }"
            @click="goPath(th, td)"
          >
            <div>
              <!-- 验证人名字 -->
              <div class="accountDisplay" v-if="th.key == 'accountDisplay'">
                <span>{{ display(td[th.key]) }}</span>
                <div class="float">{{ display(td[th.key], "address") }}</div>
                <div class="arrow"></div>
              </div>
              <!-- 倒计时 -->
              <div class="blockTimestamp" v-if="th.key == 'blockTimestamp'">
                <span>{{ $utils.getLastTime(td[th.key]) }}</span>
                <div class="float">{{ $utils.toUTCtime(td[th.key]) }}</div>
                <div class="arrow"></div>
              </div>
              <div
                v-if="th.key != 'blockTimestamp' && th.key != 'accountDisplay'"
              >
                <!-- 超长字符 -->
                <span
                  class="overText"
                  v-if="td[th.key] && td[th.key].length > 20"
                  >{{ $utils.ellipsisText(td[th.key], 14) }}</span
                >
                <span v-else>
                  <!-- 操作 -->
                  <span v-if="th.key == 'operation'"
                    >{{ td["callModule"] || td["moduleId"] }}（{{
                      td["callModuleFunction"] || td["eventId"]
                    }}）</span
                  >
                  <span v-else>{{ keepNum(td[th.key], th.key) }}</span>
                </span>
                <span class="unit" v-if="th.unit">{{ th.unit }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="loading"
        :style="{ height: tdHeight * (thisTableData.length || 10) + 50 + 'px' }"
        v-if="$parent.loading"
      ></div>
      <div
        class="empty"
        :style="{ height: tdHeight * (thisTableData.length || 10) + 50 + 'px' }"
        v-if="!$parent.loading && thisTableData.length == 0"
      >
        <span>暂无数据</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tableColumn: { type: Array },
    tableData: { type: Array },
    trColor: { type: String },
    trColor1: { type: String },
    tdHeight: { type: Number, default: 40 },
  },
  data() {
    return {
      thisTableColumn: [],
      thisTableData: [],
    };
  },
  watch: {
    tableColumn: {
      handler(val) {
        this.thisTableColumn = [...val];
      },
      deep: true,
    },
    tableData: {
      handler(val) {
        this.thisTableData = [...val];
      },
      deep: true,
    },
  },
  created() {
    this.thisTableColumn = [...this.tableColumn];
    this.thisTableData = [...this.tableData];
  },
  methods: {
    goPath(th, td) {
      if (!th.path) return;
      // console.log(th, td);
      var lastFullPath = this.$router.currentRoute.fullPath,
        fullPath = `${th.path}?`;
      if (th.query.length > 0) {
        th.query.map((item) => {
          // 区块列表跳转区块详情列表tab
          if (item.current) {
            fullPath += `current=${item.current}&`;
          } else {
            if (typeof item == "object") {
              fullPath += `${item.key}=${td[item.value]}&`;
            } else {
              if (td[item]) {
                fullPath += `${item}=${td[item]}&`;
              } else {
                // 区块列表跳转验证人详情
                if (th.path == "/verifierDetail") {
                  fullPath += `${item}=${td[th.key]}&`;
                }
              }
            }
          }
        });
        fullPath = fullPath.substring(0, fullPath.length - 1);
        if (lastFullPath != fullPath) {
          this.$router.push(fullPath);
        } else {
          if (th.copy) this.$utils.copy(td[th.key]);
        }
      } else {
        if (lastFullPath != th.path) {
          this.$router.push(th.path);
        } else {
          if (th.copy) this.$utils.copy(td[th.key]);
        }
      }
    },
    display(item) {
      var data = JSON.parse(item).display || JSON.parse(item).address;
      if (data.length > 20) data = this.$utils.ellipsisText(data, 14);
      return data;
    },
    keepNum(str, key) {
      var data = "";
      this.$store.state.keepFourLength.map((item) => {
        if (key == item) data = Number(str).toFixed(4);
      });
      this.$store.state.keepTwoLength.map((item) => {
        if (key == item) {
          if (item == "guaranteeFee" || item == "quotient")
            data = Number(str) * 100;
          data = Number(data).toFixed(2) || Number(str).toFixed(2);
        }
      });
      if (!data) data = str;
      return data;
    },
  },
};
</script>

<style lang="scss" scoped>
.table-wrap {
  width: 100%;
  height: 100%;
  .table {
    width: 100%;
    height: 100%;
    .loading {
      height: 400px;
      width: 100%;
    }
    .empty {
      height: 400px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .tr {
      width: 100%;
      display: flex;
      justify-content: space-between;
      position: relative;
      > div {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .flex {
        flex: 1;
      }
      .th {
        height: 50px;
      }
      .td {
        height: 40px;
        font-size: 12px;
        img {
          width: 20px;
        }
        .unit {
          margin-left: 4px;
        }
        .blockTimestamp:hover,
        .accountDisplay:hover {
          overflow: inherit;
          .float,
          .arrow {
            opacity: 1;
          }
        }
        .blockTimestamp,
        .accountDisplay {
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
            box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.1);
          }
        }
      }
    }
  }
}
</style>