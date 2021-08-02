<template>
  <div class="table-wrap" :class="$store.state.bodyDirection == 1 ? 'scrollx' : ''">
    <div class="table" v-loading="$parent.loading">
      <div class="tr">
        <div
          class="th"
          v-for="(th, index) in thisTableColumn"
          :key="index"
          :style="{
            color: th.headColor,
            'min-width':
              $store.state.bodyDirection == 1 ? th.minWidth + 'rem' : 0,
          }"
        >{{ th.title }}</div>
      </div>
      <div v-if="!$parent.loading && thisTableData.length > 0">
        <div class="tr" v-for="(td, i) in thisTableData" :key="i">
          <div
            class="td"
            v-for="(th, index) in thisTableColumn"
            :key="index"
            :class="{ click: th.path }"
            :style="{
              'background-color': i % 2 == 0 ? trColor : trColor1,
              color: th.color,
              height: tdHeight + 'rem',
              'min-width':
                $store.state.bodyDirection == 1 ? th.minWidth + 'rem' : 0,
            }"
            @click="goPath(th, td)"
          >
            <div v-if="th.key == 'order'">
              <div class="img-wrap" v-if="th.showImg && pageData.page == 1">
                <img v-if="i == 0" :src="require('@/assets/imgs/diyi.png')" />
                <img v-if="i == 1" :src="require('@/assets/imgs/dier.png')" />
                <img v-if="i == 2" :src="require('@/assets/imgs/disan.png')" />
                <span v-if="i > 2" style="font-size: 1rem">
                  {{
                  (pageData.page - 1) * pageData.pageSize + i + 1
                  }}
                </span>
              </div>
              <div v-if="th.showImg && pageData.page > 1">
                <span style="font-size: 1rem">
                  {{
                  (pageData.page - 1) * pageData.pageSize + i + 1
                  }}
                </span>
              </div>
              <span v-if="!th.showImg" style="font-size: 1rem">
                {{
                (pageData.page - 1) * pageData.pageSize + i + 1
                }}
              </span>
            </div>
            <div v-else>
              <!-- 验证人名字 -->
              <div class="accountDisplay" v-if="th.key == 'accountDisplay'">
                <span>{{ display(td[th.key]) }}</span>
                <div class="float">{{ display(td[th.key], "address") }}</div>
                <div class="arrow"></div>
              </div>
              <!-- 时间倒计时 -->
              <div v-if="th.key == 'blockTimestamp'">{{ $utils.getLastTime(td[th.key]) }}</div>
              <div v-if="th.key != 'blockTimestamp' && th.key != 'accountDisplay'">
                <!-- 超长字符 -->
                <div class="overText" v-if="td[th.key] && td[th.key].length > 20">
                  <span>{{ ellipsisText(td[th.key], 14) }}</span>
                </div>
                <div v-else>
                  <!-- 全网冻结 -->
                  <span v-if="th.key == 'allFrozen'">
                    {{
                    (td["bondedOwner"] + td["bondedNominators"]).toFixed(4)
                    }}
                  </span>
                  <!-- 操作 -->
                  <span v-if="th.key == 'operation'">
                    {{ td["callModule"] || td["moduleId"] }}（{{
                    td["callModuleFunction"] || td["eventId"]
                    }}）
                  </span>
                  <span
                    v-if="th.key != 'allFrozen' && th.key != 'operation'"
                  >{{ keepNum(td[th.key], th.key) }}</span>
                  <span v-if="th.unit" class="unit">{{ th.unit }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="loading"
        :style="{ height: tdHeight * (thisTableData.length || 10) + 3 + 'rem' }"
        v-if="$parent.loading"
      ></div>
      <div
        class="empty"
        :style="{ height: tdHeight * (thisTableData.length || 10) + 3 + 'rem' }"
        v-if="!$parent.loading && thisTableData.length == 0"
      >
        <span>{{$t('home.empty')}}</span>
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
    tdHeight: { type: Number, default: 3 },
    pageData: {
      type: Object,
      default: () => {
        return { page: 1, pageSize: 10 };
      }
    }
  },
  data() {
    return {
      thisTableColumn: [],
      thisTableData: []
    };
  },
  watch: {
    tableColumn: {
      handler(val) {
        this.thisTableColumn = [...val];
      },
      deep: true
    },
    tableData: {
      handler(val) {
        this.thisTableData = [...val];
      },
      deep: true
    }
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
        th.query.map(item => {
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
    display(item, key) {
      var data =
        JSON.parse(item)[key] ||
        JSON.parse(item).display ||
        JSON.parse(item).address;
      if (data.length > 20) data = this.$utils.ellipsisText(data, 14);
      return data;
    },
    ellipsisText(item, num) {
      var data = this.$utils.ellipsisText(item, num);
      return data;
    },
    keepNum(str, key) {
      var data = "";
      this.$store.state.keepFourLength.map(item => {
        if (key == item) data = Number(str).toFixed(4);
      });
      this.$store.state.keepTwoLength.map(item => {
        if (key == item) {
          if (item == "guaranteeFee" || item == "quotient")
            data = Number(str) * 100;
          data = Number(data).toFixed(2) || Number(str).toFixed(2);
        }
      });
      if (!data) data = str;
      return data;
    }
  }
};
</script>

<style lang="scss" scoped>
.scrollx {
  overflow-y: hidden;
  overflow-x: scroll;
}
.table-wrap {
  width: 100%;
  .table {
    width: auto;
    .loading {
      width: auto;
    }
    .empty {
      width: auto;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .tr {
      width: auto;
      display: flex;
      justify-content: space-between;
      position: relative;
      div {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .th {
        flex: 1;
        height: 4rem;
        font-size: 1.2rem;
      }
      .td {
        flex: 1;
        font-size: 1.1rem;
        img {
          width: 1.5rem;
        }
        .unit {
          margin-left: 0.3rem;
        }
        .accountDisplay:hover {
          overflow: inherit;
          .float,
          .arrow {
            opacity: 1;
          }
        }
        .accountDisplay {
          width: 100%;
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
            height: 3rem;
            padding: 1rem;
            white-space: nowrap;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 0.4rem;
            background-color: #fff;
            color: #333;
            box-shadow: 0 0 0.4rem 0.2rem rgba(0, 0, 0, 0.1);
          }
        }
      }
    }
  }
}
</style>