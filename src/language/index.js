import Vue from 'vue';
import VueI18n from 'vue-i18n';

// element-ui多语言
import locale from 'element-ui/lib/locale';
import zhCNEl from 'element-ui/lib/locale/lang/zh-CN';
import enEl from 'element-ui/lib/locale/lang/en';

// 本地多语言
import zhCN from "./lang/zh-CN";
import en from "./lang/en";

Vue.use(VueI18n);

const i18n =  new VueI18n({
    locale: localStorage.lang || 'zhCN',
    messages: {
        zhCN: {...zhCN, ...zhCNEl},
        en: {...en, ...enEl}
    }
})
locale.i18n((key, value) => i18n.t(key, value))

export default i18n