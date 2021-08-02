<template>
  <div class="table-wrap" :class="$store.state.bodyDirection == 1 ? 'scrollx' : ''">
    <div class="table" v-loading="$parent.loading">
      <div class="tr">
        <div
          class="th"
          v-for="(th, index) in thisTableColumn"
          :key="index"
          :class="th.width ? '' : 'flex'"
          :style="{ color: th.headColor, 'min-width':
              $store.state.bodyDirection == 1 ? th.minWidth + 'rem' : 0, }"
        >{{ th.title }}</div>
        <div class="th"></div>
      </div>
      <div v-if="!$parent.loading && thisTableData.length > 0">
        <div class="tr" :class="td.open ? 'open' : ''" v-for="(td, i) in thisTableData" :key="i">
          <div
            class="td"
            v-for="(th, index) in thisTableColumn"
            :key="index"
            :class="th.width ? '' : 'flex'"
            :style="{
              'background-color': i % 2 == 0 ? trColor : trColor1,
              color: th.color,
              height: tdHeight + 'rem',
              'min-width':
              $store.state.bodyDirection == 1 ? th.minWidth + 'rem' : 0,
            }"
          >
            <div class="one-line">
              <span v-if="th.key == 'blockTimestamp'">{{$utils.getLastTime(td[th.key])}}</span>
              <span v-else>
                <span
                  v-if="td[th.key]&&td[th.key].length>40"
                >{{ $utils.ellipsisText(td[th.key],14) }}</span>
                <span v-else>{{ td[th.key] }}</span>
                <span v-if="th.unit" class="unit">{{th.unit}}</span>
              </span>
            </div>
          </div>
          <div class="td" :style="{ 'background-color': i % 2 == 0 ? trColor : trColor1 }">
            <div class="img-wrap" @click="openRow(i)">
              <img v-if="!td.open" :src="require('@/assets/imgs/zhankai.png')" alt="未展开" />
              <img v-else :src="require('@/assets/imgs/zhankaixia.png')" alt="展开" />
            </div>
          </div>
          <div
            class="open-tr"
            v-if="td.open"
            :style="{ 'background-color': openBg, color: openColor }"
          >
            <div class="item" v-for="(item, index) in openRowData" :key="index">{{ item }}</div>
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
    openRowData: { type: Array },
    trColor: { type: String },
    trColor1: { type: String },
    openBg: { type: String },
    openColor: { type: String },
    tdHeight: { type: Number, default: 3 }
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
    this.thisTableData.map(item => {
      item.open = false;
    });
  },
  methods: {
    openRow(i) {
      if (this.openCurrent == i) {
        let item = this.thisTableData[i];
        item.open = !item.open;
        this.$set(this.thisTableData, i, item);
      } else {
        if (this.openCurrent >= 0) {
          let item = this.thisTableData[this.openCurrent];
          item.open = false;
          this.$set(this.thisTableData, this.openCurrent, item);
        }
        let item = this.thisTableData[i];
        item.open = true;
        this.$set(this.thisTableData, i, item);
      }
      this.openCurrent = i;
      this.$emit("getRowData");
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
  background-color: red;
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
    .tr.open {
      height: 5rem;
    }
    .tr {
      width: auto;
      display: flex;
      justify-content: space-between;
      position: relative;
      .open-tr {
        position: absolute;
        width: 100%;
        top: 2.5rem;
        > div {
          height: 2.5rem;
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
      > div {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .flex {
        flex: 1;
      }
      .th {
        flex: 1;
        height: 4rem;
        font-size: 1.2rem;
      }
      .td {
        font-size: 1.1rem;
        overflow: hidden;
        min-width: 3.5rem;
        .img-wrap {
          height: 100%;
          width: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          img {
            width: 0.8rem;
          }
        }
        .unit {
          margin-left: 0.3rem;
        }
      }
    }
  }
}
</style>