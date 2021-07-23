<template>
  <div class="header-wrap">
    <div class="logo" @click="goHome()">
      <img
        :src="require('@/assets/imgs/logo.png')"
        alt="logo"
        mode="widthFix"
      />
    </div>
    <div class="menu">
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
          :style="{ '--height': item.subMenu.length * 50 + 'px' }"
        >
          <div
            class="dropdown-item"
            v-for="(sub, i) in item.subMenu"
            :key="i"
            :class="item.subActive == i ? 'sub-active' : ''"
            @click.stop="changeSubMenu(index, sub, i)"
          >
            {{ sub.text }}
          </div>
        </div>
      </div>
    </div>
    <div class="right-wrap">
      <div class="search-wrap">
        <input
          class="input"
          type="text"
          v-model="keyword"
          placeholder="搜索区块 / 交易 / 账户"
          @keyup.enter="search"
        />
        <img
          :src="require('@/assets/imgs/sousuo.png')"
          alt="搜索"
          @click="search"
        />
      </div>
      <!-- <div class="lang-wrap">中文/EN</div> -->
    </div>
  </div>
</template>

<script>
import { searchApi } from "@/api/home.js";
export default {
  data() {
    return {
      menuList: [
        {
          text: "首页",
          path: "/home",
        },
        {
          text: "区块链",
          subActive: -1,
          subMenu: [
            {
              text: "区块",
              path: "/blockList",
            },
            {
              text: "交易",
              path: "/transaction",
            },
            {
              text: "转账",
              path: "/transferList",
            },
          ],
        },
        {
          text: "统计",
          subActive: -1,
          subMenu: [
            {
              text: "有效质押",
              path: "/effectivePledge",
            },
            {
              text: "有效算力",
              path: "/effectivePledgePower",
            },
            // {
            //   text: "手续费",
            //   path: "/serviceCharge",
            // },
          ],
        },
        {
          text: "资源",
          subActive: -1,
          subMenu: [
            {
              text: "白皮书",
              otherPath:
                "https://crust-data.oss-cn-shanghai.aliyuncs.com/crust-home/whitepapers/whitepaper.pdf",
            },
            {
              text: "FAQ",
              otherPath: "https://crust.network/faq",
            },
          ],
        },
      ],
      menuActive: 0,
      subActive: 0,
      keyword: "",
    };
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
  watch: {
    menuActive(val) {
      this.$session.set("menuActive", val);
    },
    subActive(val) {
      this.$session.set("subActive", val);
    },
  },
  methods: {
    goHome() {
      if (this.$router.currentRoute.path != "/home") this.$router.push("/home");
      this.menuActive = 0;
      this.subActive = 0;
      this.menuList.map((one) => {
        one.subActive = -1;
      });
    },
    search() {
      searchApi(this.keyword).then((res) => {
        if (res.code == 200) {
          switch (Number(res.data.type)) {
            case 1:
              //  区块
              console.log("搜索区块", this.keyword);
              this.$router.push(
                `/blockDetail?blockNum=${res.data.blockVO.blockNum}`
              );
              break;
            case 2:
              //  交易
              console.log("搜索交易", this.keyword);
              this.$router.push(
                `/transactionDetail?blockNum=${res.data.extrinsicVO.blockNum}&extrinsicHash=${res.data.extrinsicVO.extrinsicHash}&extrinsicIndex=${res.data.extrinsicVO.extrinsicIndex}`
              );
              break;
            case 3:
              //  账户
              console.log("搜索账户", this.keyword);
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
      // this.menuList.map((one) => {
      //   one.subActive = -1;
      // });
      // if (subMenu) {
      //   var obj = { ...item };
      //   obj.subActive = 0;
      //   this.$set(this.menuList, index, obj);
      //   var path = this.menuList[index].subMenu[0].path;
      //   var otherPath = this.menuList[index].subMenu[0].otherPath;
      //   if (path && this.$router.currentRoute.fullPath != path)
      //     this.$router.push(path);
      //   if (otherPath) window.open(otherPath);
      // } else {
      //   if (item.path && this.$router.currentRoute.fullPath != item.path)
      //     this.$router.push(item.path);
      //   if (item.otherPath) window.open(item.otherPath);
      // }
      if (item.path) {
        // 取消所有二级激活菜单
        this.menuList.map((one) => {
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
      }
    },
    changeSubMenu(index, sub, i) {
      if (this.$router.currentRoute.fullPath != sub.path) {
        // 取消所有二级激活菜单取消
        this.menuList.map((one) => {
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
      }
    },
  },
  beforeDestroy() {
    this.$root.eventHub.$off("changeActive");
  },
};
</script>

<style lang="scss" scoped>
.header-wrap {
  color: #fff;
  background: url("../assets/imgs/bg.png") no-repeat;
  background-position: top center;
  background-size: cover;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 72px;
  .logo {
    flex: 1;
    display: flex;
    justify-content: flex-start;
    img {
      width: 205px;
    }
  }
  .menu {
    flex: 3;
    height: 100%;
    display: flex;
    align-items: center;
    .menu-item.menu-active {
      color: #fbd100;
      &::after {
        position: absolute;
        bottom: 14px;
        right: 0;
        left: 0;
        margin: auto;
        content: "";
        background-color: #fbd100;
        width: 41px;
        height: 6px;
        border-radius: 90px;
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
      padding: 0 40px;
      position: relative;
      display: flex;
      align-items: center;
      font-size: 18px;
      color: #fff;
      .dropdown-wrap {
        box-shadow: 0 0 30px 4px rgba(0, 0, 0, 0.1);
        border: none !important;
        height: 0;
        position: absolute;
        background-color: #fff;
        width: auto;
        z-index: 999;
        top: 80px;
        left: 15px;
        right: 15px;
        margin: 0 auto;
        border-radius: 10px;
        transition: all 0.4s ease 0s;
        overflow: hidden;
        color: #111;
        &::before {
          width: 0;
          height: 0;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-bottom: 20px solid #fff;
        }
        .dropdown-item.sub-active {
          color: #fbd100;
        }
        .dropdown-item {
          width: 100%;
          font-size: 16px;
          height: 50px;
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
    .search-wrap {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: #fff;
      border-radius: 6px;
      padding: 0 14px;
      width: 240px;
      height: 40px;
      margin-right: 20px;
      .input {
        width: 100%;
        padding-right: 10px;
        border: none;
        height: 100%;
        outline: none;
      }
      img {
        width: 20px;
      }
    }
    .lang-wrap {
      font-size: 14px;
    }
  }
}
</style>