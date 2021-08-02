<template>
  <div class="data-wrap">
    <div class="main-box">
      <div class="title" @click="open = !open">
        <div
          class="click"
          :style="{
            display: $store.state.bodyDirection == 1 ? 'flex' : 'inline',
          }"
        >
          <span class="text">{{$t('home.informationOverview')}}</span>
          <img :src="require('@/assets/imgs/more.png')" alt />
        </div>
      </div>
      <div class="data-box">
        <div
          class="box-wrap"
          :style="{ width: $store.state.bodyDirection == 0 ? '20%' : '50%' }"
          v-for="(item, key, index) in allDataDetail"
          :key="index"
          :class="!open && index > 9 ? 'hide' : ''"
        >
          <div class="box">
            <div class="value-wrap" v-show="dataDetail[key]">
              <div
                class="value one-line"
                v-if="key == 'blockLastTime'"
              >{{ $utils.getLastTime(dataDetail[key], true) }}</div>
              <div class="value one-line" v-else>
                <span
                  v-if="
                    (key == 'countdownEra' || key == 'countdownSession') &&
                    dataDetail[key] < 0
                  "
                >0 s</span>
                <span
                  v-if="key == 'countdownEra' || key == 'countdownSession'"
                >{{ $utils.secondToTime(dataDetail[key]) }}</span>
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
          text: this.$t("home.blocks")
        },
        blockHeightConfirmed: {
          text: this.$t("home.iinalizedBlocks")
        },
        blockLastTime: {
          text: this.$t("home.lastBlockTime")
        },
        totalStorage: {
          text: this.$t("home.totalStorage"),
          unit: "TB"
        },
        totalCirculation: {
          text: this.$t("home.totalIssuance"),
          unit: "CRU"
        },
        pledgeAbleNum: {
          text: this.$t("home.totalStakes"),
          unit: "CRU"
        },
        pledgeMinimum: {
          text: this.$t("home.loweStstaked"),
          unit: "CRU"
        },
        pledgeAvg: {
          text: this.$t("home.averageStaked"),
          unit: "CRU"
        },
        pledgePer: {
          text: this.$t("home.currentStakeVolumePerT"),
          unit: "CRU"
        },
        pledgeTotalActive: {
          text: this.$t("home.totalEffectiveStakes"),
          unit: "CRU"
        },
        totalOutputLast24: {
          text: this.$t("home.totalOutputLast24")
        },
        countdownEra: {
          text: this.$t("home.eraCountdown")
        },
        countdownSession: {
          text: this.$t("home.sessionCountdown")
        },
        numberValidator: {
          text: this.$t("home.numberOfVerifiedPersons")
        },
        numberGuarantee: {
          text: this.$t("home.numberOfGuarantors")
        },
        numberTrade: {
          text: this.$t("home.transactionsTimes")
        },
        numberTransfer: {
          text: this.$t("home.transferTimes")
        }
      }
    };
  },
  watch: {
    "$i18n.locale": {
      handler: function() {
        this.allDataDetail.blockHeight.text = this.$t("home.blocks");
        this.allDataDetail.blockHeightConfirmed.text = this.$t(
          "home.iinalizedBlocks"
        );
        this.allDataDetail.blockLastTime.text = this.$t("home.lastBlockTime");
        this.allDataDetail.totalStorage.text = this.$t("home.totalStorage");
        this.allDataDetail.totalCirculation.text = this.$t(
          "home.totalIssuance"
        );
        this.allDataDetail.pledgeAbleNum.text = this.$t("home.totalStakes");
        this.allDataDetail.pledgeMinimum.text = this.$t("home.loweStstaked");
        this.allDataDetail.pledgeAvg.text = this.$t("home.averageStaked");
        this.allDataDetail.pledgePer.text = this.$t(
          "home.currentStakeVolumePerT"
        );
        this.allDataDetail.pledgeTotalActive.text = this.$t(
          "home.totalEffectiveStakes"
        );
        this.allDataDetail.totalOutputLast24.text = this.$t(
          "home.totalOutputLast24"
        );
        this.allDataDetail.countdownEra.text = this.$t("home.eraCountdown");
        this.allDataDetail.countdownSession.text = this.$t(
          "home.sessionCountdown"
        );
        this.allDataDetail.numberValidator.text = this.$t(
          "home.numberOfVerifiedPersons"
        );
        this.allDataDetail.numberGuarantee.text = this.$t(
          "home.numberOfGuarantors"
        );
        this.allDataDetail.numberTrade.text = this.$t("home.transactionsTimes");
        this.allDataDetail.numberTransfer.text = this.$t("home.transferTimes");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.data-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 2rem 0;
  .title {
    padding-bottom: 2rem;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .click {
      width: 100%;
      color: #fff;
      align-items: center;
      justify-content: space-between;
      .text {
        font-size: 2rem;
        margin-right: 1rem;
      }
      img {
        width: 1.5rem;
      }
    }
  }
  .data-box {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    .box-wrap.hide {
      display: none;
    }
    .box-wrap {
      padding: 0 0.5rem;
      display: flex;
      justify-content: center;
      .box:hover {
        transform: scale(1.05);
      }
      .box {
        transition: 0.3s;
        width: 100%;
        height: 100%;
        padding: 2.5rem 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: #fff;
        margin-bottom: 1rem;
        border-radius: 1rem;
        .value-wrap {
          width: 100%;
          font-size: 1.6rem;
          color: #333333;
          font-weight: bold;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          .unit {
            margin-left: 0.5rem;
          }
        }
        .text {
          color: #9a9a9a;
          font-size: 1.2rem;
          margin-top: 0.8rem;
        }
      }
    }
  }
}
</style>