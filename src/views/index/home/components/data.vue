<template>
  <div class="data-wrap">
    <div class="title" @click="open = !open">
      <div class="click">
        <span class="text">信息概览</span>
        <img :src="require('@/assets/imgs/more.png')" alt />
      </div>
    </div>
    <div class="data-box">
      <div
        class="box"
        v-for="(item, key, index) in allDataDetail"
        :key="index"
        :class="!open && index > 9 ? 'hide' : ''"
      >
        <div class="value-wrap" v-show="dataDetail[key]">
          <div class="value one-line" v-if="key == 'blockLastTime'">
            {{ $utils.getLastTime(dataDetail[key], true) }}
          </div>
          <div class="value one-line" v-else>
            <span
              v-if="
                (key == 'countdownEra' || key == 'countdownSession') &&
                dataDetail[key] < 0
              "
              >0 s</span
            >
            <span v-if="key == 'countdownEra' || key == 'countdownSession'">{{
              $utils.secondToTime(dataDetail[key])
            }}</span>
            <span v-else>{{ dataDetail[key] }}</span>
          </div>
          <div class="unit">{{ item.unit }}</div>
        </div>
        <div class="text">
          <span>{{ item.text }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["dataDetail"],
  data() {
    return {
      open: false,
      allDataDetail: {
        blockHeight: {
          text: "区块高度",
        },
        blockHeightConfirmed: {
          text: "已确认块高",
        },
        blockLastTime: {
          text: "最后出块时间",
        },
        totalStorage: {
          text: "总存储量",
          unit: "TB",
        },
        totalCirculation: {
          text: "发行总数",
          unit: "CRU",
        },
        pledgeAbleNum: {
          text: "可质押总量",
          unit: "CRU",
        },
        pledgeMinimum: {
          text: "最低质押量",
          unit: "CRU",
          msg: "验证人和候选人质押量的最小值",
        },
        pledgeAvg: {
          text: "平均质押量",
          unit: "CRU",
          msg: "验证人和候选人质押量的平均值",
        },
        pledgePer: {
          text: "当前每T质押量",
          unit: "CRU",
        },
        pledgeTotalActive: {
          text: "有效质押总量",
          unit: "CRU",
          msg: "当前矿工进行挖矿所质押的CRU总和",
        },
        totalOutputLast24: {
          text: "近24小时产出",
        },
        countdownEra: {
          text: "Era倒计时",
        },
        countdownSession: {
          text: "Session倒计时",
        },
        numberValidator: {
          text: "验证个人数",
        },
        numberGuarantee: {
          text: "担保个人数",
        },
        numberTrade: {
          text: "交易次数",
        },
        numberTransfer: {
          text: "转账次数",
        },
      },
    };
  },
};
</script>

<style lang="scss" scoped>
.data-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .title {
    display: flex;
    align-items: center;
    justify-content: center;
    .click {
      color: #fff;
    }
    .text {
      font-size: 35px;
      margin-right: 10px;
    }
    img {
      width: 20px;
    }
  }
  .data-box {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    width: 1250px;
    padding: 60px 0;
    .box:hover {
      transform: scale(1.05);
    }
    .box.hide {
      display: none;
    }
    .box {
      margin: 0 10px;
      transition: 0.3s;
      width: 230px;
      height: 105px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-color: #fff;
      margin-bottom: 20px;
      border-radius: 10px;
      .value-wrap {
        width: 100%;
        font-size: 22px;
        color: #333333;
        font-weight: bold;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        .unit {
          margin-left: 6px;
        }
      }
      .text {
        color: #9a9a9a;
        font-size: 14px;
        margin-top: 10px;
      }
    }
  }
}
</style>