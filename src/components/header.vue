<template>
  <div class="header-wrap" :style="{ height: $store.state.bodyDirection == 1 ? '10rem' : '5rem' }">
    <div class="header-main main-box">
      <div class="logo" @click="goHome()">
        <img :src="require('@/assets/imgs/logo.png')" alt="logo" mode="widthFix" />
      </div>
      <div class="menu" v-if="$store.state.bodyDirection == 0">
        <div
          class="menu-item click"
          v-for="(item, index) in menuList"
          :key="index"
          :class="menuActive == index ? 'menu-active' : ''"
          @click="changeMenu(item, index, item.subMenu)"
        >
          <span>{{ item.text }}</span>
          <div
            class="dropdown-wrap"
            v-if="item.subMenu"
            :style="{ '--height': item.subMenu.length * 4 + 'rem' }"
          >
            <div
              class="dropdown-item"
              v-for="(sub, i) in item.subMenu"
              :key="i"
              :class="item.subActive == i ? 'sub-active' : ''"
              @click.stop="changeSubMenu(index, sub, i)"
            >{{ sub.text }}</div>
          </div>
        </div>
      </div>
      <div class="right-wrap" v-if="$store.state.bodyDirection == 1">
        <div class="img-wrap">
          <img :src="require('@/assets/imgs/icon_home.png')" @click="drawer = true" />
        </div>
      </div>
      <div class="right-wrap" v-if="$store.state.bodyDirection == 0">
        <div class="search-wrap">
          <input
            class="input"
            type="text"
            v-model="keyword"
            :placeholder="$t('home.searchText')"
            @keyup.enter="search"
          />
          <img :src="require('@/assets/imgs/sousuo.png')" @click="search" />
        </div>
        <!-- 语言 -->
        <language></language>
      </div>
    </div>

    <div class="search-box main-box" v-if="$store.state.bodyDirection == 1">
      <div class="search-wrap">
        <div class="input-wrap">
          <input
            class="input"
            type="text"
            v-model="keyword"
            :placeholder="$t('home.searchText')"
            @keyup.enter="search"
          />
        </div>
        <img :src="require('@/assets/imgs/icon_sousuo.png')" @click="search" />
      </div>
    </div>

    <el-drawer class="drawer" :visible.sync="drawer" size="80%" :withHeader="false">
      <div class="drawer-inner">
        <div class="header">
          <language></language>
          <img :src="require('@/assets/imgs/close.png')" @click="drawer = false" />
        </div>
        <div class="menu-list">
          <div class="row-wrap" v-for="(row, index) in menuList" :key="index">
            <div
              class="row"
              @click="changeMenu(row, index, row.subMenu)"
              :class="menuActive == index ? 'open' : ''"
            >
              <span class="title">{{ row.text }}</span>
              <img class="arrow" v-if="row.subMenu" src="@/assets/imgs/icon_more.png" />
            </div>
            <div
              class="sub-menu"
              :style="{
                height:
                  menuActive == index && row.subMenu
                    ? 'auto'
                    : 0,
              }"
            >
              <div
                class="sub-row"
                v-for="(sub, i) in row.subMenu"
                :key="i"
                @click.stop="changeSubMenu(index, sub, i)"
              >
                <span class="sub-title">{{ sub.text }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { searchApi } from "@/api/home.js";
import language from "@/components/language.vue";
export default {
  components: { language },
  data() {
    return {
      drawer: false,
      menuList: [
        {
          text: this.$t("home.home"),
          path: "/home"
        },
        {
          text: this.$t("home.blockchain"),
          subActive: -1,
          subMenu: [
            {
              text: this.$t("home.block"),
              path: "/blockList"
            },
            {
              text: this.$t("home.extrinsics"),
              path: "/transaction"
            },
            {
              text: this.$t("home.transfers"),
              path: "/transferList"
            }
          ]
        },
        {
          text: this.$t("home.statistics"),
          subActive: -1,
          subMenu: [
            {
              text: this.$t("home.effectIvestake"),
              path: "/effectivePledge"
            },
            {
              text: this.$t("home.effectiveComputingPower"),
              path: "/effectivePledgePower"
            }
            // {
            //   text: "手续费",
            //   path: "/serviceCharge",
            // },
          ]
        },
        {
          text: this.$t("home.resources"),
          subActive: -1,
          subMenu: [
            {
              text: this.$t("home.whitePaper"),
              otherPath:
                "https://crust-data.oss-cn-shanghai.aliyuncs.com/crust-home/whitepapers/whitepaper.pdf"
            },
            {
              text: this.$t("home.faq"),
              otherPath: "https://crust.network/faq"
            }
          ]
        }
      ],
      menuActive: 0,
      subActive: 0,
      keyword: ""
    };
  },
  watch: {
    menuActive(val) {
      this.$session.set("menuActive", val);
    },
    subActive(val) {
      this.$session.set("subActive", val);
    },
    drawer(val) {
      this.$emit("openMenu", !val);
    },
    "$i18n.locale": {
      handler: function() {
        this.menuList[0].text = this.$t("home.home");
        this.menuList[1].text = this.$t("home.blockchain");
        this.menuList[1].subMenu[0].text = this.$t("home.block");
        this.menuList[1].subMenu[1].text = this.$t("home.extrinsics");
        this.menuList[1].subMenu[2].text = this.$t("home.transfers");
        this.menuList[2].text = this.$t("home.statistics");
        this.menuList[2].subMenu[0].text = this.$t("home.effectIvestake");
        this.menuList[2].subMenu[1].text = this.$t(
          "home.effectiveComputingPower"
        );
        this.menuList[3].text = this.$t("home.resources");
        this.menuList[3].subMenu[0].text = this.$t("home.whitePaper");
        this.menuList[3].subMenu[1].text = this.$t("home.faq");
      },
      deep: true
    }
  },
  mounted() {
    var menuActive = this.$session.get("menuActive"),
      subActive = this.$session.get("subActive");
    if (menuActive) this.menuActive = menuActive;
    if (subActive) this.subActive = subActive;
    this.menuList[this.menuActive].subActive = this.subActive;
  },
  created() {
    // 全局挂载修改菜单 index：一级菜单 i：二级菜单
    this.$root.eventHub.$on("changeActive", (index, i) => {
      this.menuActive = index;
      this.menuList[index].subActive = i;
    });
  },
  methods: {
    goHome() {
      if (this.$router.currentRoute.path != "/home") this.$router.push("/home");
      this.menuActive = 0;
      this.subActive = 0;
      this.menuList.map(one => {
        one.subActive = -1;
      });
    },
    search() {
      searchApi(this.keyword).then(res => {
        if (res.code == 200) {
          switch (Number(res.data.type)) {
            case 1:
              //  区块
              // console.log("搜索区块", this.keyword);
              this.$router.push(
                `/blockDetail?blockNum=${res.data.blockVO.blockNum}`
              );
              break;
            case 2:
              //  交易
              // console.log("搜索交易", this.keyword);
              this.$router.push(
                `/transactionDetail?blockNum=${res.data.extrinsicVO.blockNum}&extrinsicHash=${res.data.extrinsicVO.extrinsicHash}&extrinsicIndex=${res.data.extrinsicVO.extrinsicIndex}`
              );
              break;
            case 3:
              //  账户
              // console.log("搜索账户", this.keyword);
              this.$router.push(
                `/accountDetail?accountAddress=${res.data.accountVO.address}`
              );
              break;
            default:
              break;
          }
        }
      });
    },
    changeMenu(item, index, subMenu) {
      if (item.path) {
        // 取消所有二级激活菜单
        this.menuList.map(one => {
          one.subActive = -1;
        });
        // 设置二级激活菜单
        var obj = { ...item };
        obj.subActive = 0;
        this.$set(this.menuList, index, obj);
        // 跳转path
        if (this.$router.currentRoute.fullPath != item.path)
          this.$router.push(item.path);
        this.menuActive = index;
        this.subActive = 0;
        this.drawer = false;
      } else {
        if (this.$store.state.bodyDirection == 1) this.menuActive = index;
      }
    },
    changeSubMenu(index, sub, i) {
      if (this.$router.currentRoute.fullPath != sub.path) {
        // 取消所有二级激活菜单取消
        this.menuList.map(one => {
          one.subActive = -1;
        });
        // path存在
        if (sub.path) {
          // 设置二级激活菜单
          var obj = { ...this.menuList[index] };
          obj.subActive = i;
          this.$set(this.menuList, index, obj);
          this.$router.push(sub.path); // 跳转path
          this.menuActive = index;
          this.subActive = i;
        }
        // 跳转其他地址
        if (sub.otherPath) window.open(sub.otherPath);
        this.drawer = false;
      }
    }
  },
  beforeDestroy() {
    this.$root.eventHub.$off("changeActive");
  }
};
</script>

<style lang="scss" scoped>
.search-box {
  margin-top: 0.5rem;
  width: 100%;
  height: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  .search-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 0.5rem;
    width: 100%;
    height: 100%;
    background-color: rgba(111, 111, 111, 0.5);
    .input-wrap {
      background-color: #fff;
      border-radius: 0.5rem 0 0 0.5rem;
      overflow: hidden;
      height: 100%;
      flex: 1;
      padding: 0 1rem;
      .input {
        width: 100%;
        padding-right: 0.6rem;
        border: none;
        height: 100%;
        outline: none;
      }
    }
    img {
      width: 1.8rem;
      margin: 0 1.3rem;
    }
  }
}
.drawer {
  z-index: 999999;
  height: 100vh;
  .drawer-inner {
    background-color: #302b3c;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    color: #fff;
    .header {
      background-color: #3a3545;
      display: flex;
      height: 5rem;
      padding: 0 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 1.8rem;
      img {
        width: 1.8rem;
      }
    }
    .menu-list {
      flex: 1;
      .row-wrap {
        width: 100%;
        height: auto;
        display: flex;
        flex-direction: column;
        padding: 0 2rem;
        .row.open {
          .arrow {
            transform: rotateZ(180deg);
          }
        }
        .row {
          height: auto;
          padding: 1rem 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .title {
            font-size: 1.8rem;
          }
          .arrow {
            transition: 0.2s;
            width: 1.6rem;
          }
        }
        .sub-menu {
          width: 100%;
          height: 0;
          padding-left: 1.5rem;
          overflow: hidden;
          transition: height 0.3s;
          .sub-row {
            padding: 1rem 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 0.1rem solid #fff;
            .sub-title {
              font-size: 1.5rem;
              text-align: left;
            }
          }
        }
      }
    }
  }
}
.header-wrap {
  color: #fff;
  background: url("../assets/imgs/bg.png") no-repeat;
  background-position: top center;
  background-size: cover;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .header-main {
    height: 4rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .logo {
      height: 100%;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      img {
        width: 14rem;
      }
    }
    .menu {
      flex: 3;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-around;
      .menu-item.menu-active {
        color: #fbd100;
        &::after {
          position: absolute;
          bottom: 0;
          right: 0;
          left: 0;
          margin: auto;
          content: "";
          background-color: #fbd100;
          width: 3rem;
          height: 0.3rem;
          border-radius: 10rem;
        }
      }
      .menu-item:hover {
        background-color: rgba(0, 0, 0, 0) !important;
        .dropdown-wrap {
          height: var(--height);
          transition: all 0.4s ease 0s;
        }
      }
      .menu-item {
        height: 100%;
        padding: 0 1.8rem;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        font-size: 1.4rem;
        .dropdown-wrap {
          box-shadow: 0 0 2.5rem 0.5rem rgba(0, 0, 0, 0.1);
          border: none !important;
          height: 0;
          position: absolute;
          background-color: #fff;
          width: auto;
          z-index: 999999;
          top: 110%;
          left: 0;
          right: 0;
          margin: 0 auto;
          border-radius: 0.4rem;
          transition: all 0.4s ease 0s;
          overflow: hidden;
          color: #111;
          &::before {
            width: 0;
            height: 0;
            border-left: 0.8rem solid transparent;
            border-right: 0.8rem solid transparent;
            border-bottom: 1.6rem solid #fff;
          }
          .dropdown-item.sub-active {
            color: #fbd100;
          }
          .dropdown-item {
            width: 100%;
            font-size: 1.2rem;
            height: 4rem;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }
    }
    .right-wrap {
      flex: 2;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .img-wrap {
        width: 100%;
        display: flex;
        justify-content: flex-end;
        img {
          width: 2.2rem;
          height: 1.8rem;
          margin-left: 1rem;
        }
      }
      .search-wrap {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: #fff;
        border-radius: 0.5rem;
        padding: 0 1rem;
        width: 15rem;
        height: 2.5rem;
        margin-right: 1.5rem;
        .input {
          width: 100%;
          padding-right: 0.6rem;
          border: none;
          height: 100%;
          outline: none;
        }
        img {
          width: 1.2rem;
        }
      }
      .lang-wrap {
        font-size: 0.5rem;
      }
    }
  }
}
</style>