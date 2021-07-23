module.exports = {
    outputDir: 'dist',      //build输出目录
    assetsDir: 'assets',    //静态资源目录（js, css, img）
    lintOnSave: false,      //是否开启eslint
    css: {                   /* 全局scss变量 */
        loaderOptions: {
            sass: {
                prependData: `@import "@/assets/theme/_variable.scss";`
            }
        }
    },
    devServer: {
        open: true, //是否自动弹出浏览器页面
        port: '8080',
        overlay: {
            warnings: false,
            errors: true
        },
        // host: "localhost", 
        // https: false,   //是否使用https协议
        // hotOnly: false, //是否开启热更新
        proxy: {
            '/': {
                target: process.env.VUE_APP_BASE_API,
                changeOrigin: true,
                pathRewrite: {
                    '^/': '/'
                }
            },
        },
    }
}