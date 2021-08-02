<template>
  <div
    class="home-wrap"
    :style="{
      'background-position':
        $store.state.bodyDirection == 1 ? 'center -10rem' : 'center -5rem',
    }"
  >
    <Title v-if="$store.state.bodyDirection == 0"></Title>
    <Data :dataDetail="dataDetail"></Data>
    <Box :blockList="blockList"></Box>
    <PledgeRankList></PledgeRankList>
    <!-- <NodeRankList></NodeRankList> -->
    <Verifier></Verifier>
    <div class="footer">© 2020 Crust Explorer. All Rights Reserved.</div>
  </div>
</template>

<script>
import Title from "./components/title";
import Data from "./components/data";
import Box from "./components/box";
import PledgeRankList from "./components/pledgeRankList";
import NodeRankList from "./components/nodeRankList";
import Verifier from "./components/verifier";
import jsMd5 from "js-md5";
import { getHomeSidApi, homeDataApi } from "@/api/home.js";

export default {
  components: { Title, Data, Box, PledgeRankList, NodeRankList, Verifier },
  data() {
    return {
      websock: null,
      blockList: [], // 最新区块列表
      dataDetail: {}, // 数据概览
      timer: null // 数据概览计时器
    };
  },
  created() {
    // 初始化
    this.getWsUrl();
    this.getData();
  },
  methods: {
    getData() {
      homeDataApi().then(res => {
        if (res.code == 200) {
          if (res.data) {
            this.fillData(res.data);
          }
        }
      });
    },
    fillData(data) {
      this.dataDetail = data;
      this.timer = setInterval(() => {
        this.dataDetail.countdownEra--;
        this.dataDetail.countdownSession--;
      }, 1000);
    },
    getWsUrl() {
      var t = new Date().getTime();
      var s = "timestamp=" + t;
      var md5 = jsMd5(s);
      getHomeSidApi(t, md5).then(res => {
        if (res && res.code == 200) {
          this.initWebSocket(res.data);
        }
      });
    },
    initWebSocket(sid) {
      //初始化weosocket
      //ws地址
      const wsuri = process.env.VUE_APP_WS_API + `/ws/index?tag=ok&sid=${sid}`;
      this.websock = new WebSocket(wsuri);
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onclose = this.websocketclose;
      this.websock.onerror = this.websocketerror;
      // console.log("websock-------", this.websock);
    },
    websocketonmessage(e) {
      //数据接收
      const redata = JSON.parse(e.data);
      // console.log("接收数据", redata);
      if (redata.channel == "last_blocks") {
        this.blockList = redata.body;
      } else if (redata.channel == "network") {
        clearInterval(this.timer);
        this.fillData(redata.body);
      }
    },
    websocketsend(agentData) {
      //数据发送
      this.websock.send(agentData);
    },
    websocketclose(e) {
      //关闭
      console.log("websocket连接关闭(" + e.code + ")");
    },
    websocketerror(e) {
      // 监听并处理error事件
      console.log("websocket连接失败");
      // console.log("err---", e);
    },
    //关闭WebSocket连接
    closeWebSocket() {
      if (this.websock != null) {
        this.websock.close();
        console.log("websocket关闭");
      }
    }
  },
  destroyed() {
    this.closeWebSocket();
  }
};
</script>

<style lang="scss" scoped>
.home-wrap {
  width: 100%;
  height: auto;
  background: url("../../../assets/imgs/bg.png") no-repeat;
  background-size: 100% auto;
  color: #fff;
  background-color: #100b1c;
  .footer {
    height: 3rem;
    background-color: #06040a;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem;
    color: #ffffff;
  }
}
</style>