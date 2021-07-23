<style lang="scss" scoped>
.lang{
    display: inline-block;
    height: 20px;
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 10px 6px;
    color: #fff;
}
</style>

<template>
    <div class="language">
        <el-dropdown trigger="click" @command="changeLanguage">
            <span class="lang">
                <span v-text="currentLanguage"></span>
                <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown" >
                <el-dropdown-item v-for="(item, index) in list" :key="index" :command='item' >{{item.label}}</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>

<script>
import list from '@/language/languageList'

export default {
    name: 'language',           /* 多语言切换 */
    data() {
        return {
            currentLanguage: '',
            list: [],
        }
    },
    created() {
        this.currentLanguage = localStorage.langName || '简体中文';
        this.list = list;
    },
    methods: {
        changeLanguage(item) {
            this.currentLanguage = item.label;
            // this.bodyAddClassName(item.value);
            this.$i18n.locale = item.value;
            localStorage.setItem('langName', item.label);
            localStorage.setItem('lang', item.value);
        },

        // 修改body的class
        bodyAddClassName(className) {
            let dom = document.getElementById('app')
            dom.className = `language_${className}`;
        },
    },
}
</script>