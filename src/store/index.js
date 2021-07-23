import Vue from 'vue'
import Vuex from 'vuex'
import { Loading } from 'element-ui';

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		vuethis: null, // this
		loadingInstance: null, // 加载loading
		keepFourLength: ['allFrozen', 'bondedOwner', 'ownerActivePledge', 'pledgeTotal', 'pledgeMax', 'amount'], // 保留四位小数
		keepTwoLength: ['guaranteeFee','quotient'], // 保留两位小数
	},
	mutations: {
		//获取this
		getVuethis(state, loop) {
			state.vuethis = loop
		},
		// 打开loading
		openLoading(state) {
			state.loadingInstance = Loading.service({ fullscreen: true });
		},
		// 关闭loading
		closeLoading(state) {
			state.vuethis.$nextTick(() => {
				// 以服务的方式调用的 Loading 需要异步关闭
				state.loadingInstance.close();
			});
		},
		// 切换头部tab-subTab
		changeHeadTab(state, { index, i }) {
			state.vuethis.$root.eventHub.$emit("changeActive", index, i);
			state.vuethis.$session.set("menuActive", index);
			state.vuethis.$session.set("subActive", i);
		},
	},
	actions: {
		// 
	}
})
