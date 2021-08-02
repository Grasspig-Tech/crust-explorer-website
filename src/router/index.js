import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export const constantRouterMap = [
  { path: '/login', name: 'login', component: () => import('@/views/login/index.vue')},
  {
    path: '/', name: 'index', redirect: "/home", component: () => import('@/views/index/index.vue'),
    children: [
      // 首页
      {
        path: 'home',// 首页
        name: 'home',
        component: () => import('@/views/index/home/index.vue'),
      },
      // 其他页面
      {
        path: 'pledgeRankList', // 有效质押排行榜
        name: 'pledgeRankList',
        component: () => import('@/views/index/other/pledgeRankList/pledgeRankList.vue'),
      }, {
        path: 'nodeRankList', // 推荐节点排行榜
        name: 'nodeRankList',
        component: () => import('@/views/index/other/nodeRankList/nodeRankList.vue'),
      }, {
        path: 'verifierList', // 验证人列表
        name: 'verifierList',
        component: () => import('@/views/index/other/verifierList/verifierList.vue'),
      }, {
        path: 'verifierDetail', // 验证人详情
        name: 'verifierDetail',
        component: () => import('@/views/index/other/verifierDetail/verifierDetail.vue'),
      }, {
        path: 'rewardList', // 收益&罚金列表
        name: 'rewardList',
        component: () => import('@/views/index/other/rewardList/rewardList.vue'),
      }, {
        path: 'nominatorsList', // 提名人列表
        name: 'nominatorsList',
        component: () => import('@/views/index/other/nominatorsList/nominatorsList.vue'),
      }, {
        path: 'eventList', // 事件列表
        name: 'eventList',
        component: () => import('@/views/index/other/eventList/eventList.vue'),
      }, {
        path: 'accountDetail', // 账户详情
        name: 'accountDetail',
        component: () => import('@/views/index/other/accountDetail/accountDetail.vue'),
      },
      // 区块链
      {
        path: 'blockList', // 区块链-》区块
        name: 'blockList',
        component: () => import('@/views/index/blockchain/blockList/blockList.vue'),
      }, {
        path: 'blockDetail', // 区块链-》区块详情
        name: 'blockDetail',
        component: () => import('@/views/index/blockchain/blockDetail/blockDetail.vue'),
      }, {
        path: 'transaction', // 区块链-》交易
        name: 'transaction',
        component: () => import('@/views/index/blockchain/transaction/transaction.vue'),
      }, {
        path: 'transactionDetail', // 区块链-》交易详情
        name: 'transactionDetail',
        component: () => import('@/views/index/blockchain/transactionDetail/transactionDetail.vue'),
      }, {
        path: 'transferList', // 区块链-》转账
        name: 'transferList',
        component: () => import('@/views/index/blockchain/transferList/transferList.vue'),
      },
      // 统计
      {
        path: 'effectivePledge', // 统计-》有效质押
        name: 'effectivePledge',
        component: () => import('@/views/index/statistics/effectivePledge/effectivePledge.vue'),
      }, {
        path: 'effectivePledgePower', // 统计-》有效算力
        name: 'effectivePledgePower',
        component: () => import('@/views/index/statistics/effectivePledgePower/effectivePledgePower.vue'),
      }, {
        path: 'serviceCharge', // 统计-》手续费
        name: 'serviceCharge',
        component: () => import('@/views/index/statistics/serviceCharge/serviceCharge.vue'),
      },
      // 资源
      {
        path: 'whitePaper', // 资源-》白皮书
        name: 'whitePaper',
        component: () => import('@/views/index/resource/whitePaper/whitePaper.vue'),
      }, {
        path: 'faq', // 资源-FAQ
        name: 'faq',
        component: () => import('@/views/index/resource/faq/faq.vue'),
      },]
  },
]
export default new VueRouter({
  routes: constantRouterMap
});

