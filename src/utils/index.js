import Vue from 'vue'

export default {
    local: {
        set: (key, value) => {
            localStorage.setItem(key, value)
        },
        get: (key) => {
            if (!key) {
                return '';
            }
            return localStorage.getItem(key)
        },
        all: () => {
            return localStorage.get()
        },
        remove: (key) => {
            if (!key) {
                return;
            }
            localStorage.removeItem(key)
        },
        clear: () => {
            localStorage.clear()
        },
        has: (key) => {
            if (!key) {
                return
            }
            let value = localStorage.getItem(key)
            if (value) {
                return true
            }
            return false
        },
    },
    session: {
        set: (key, value) => {
            sessionStorage.setItem(key, value)
        },
        get: (key) => {
            if (!key) {
                return '';
            }
            return sessionStorage.getItem(key)
        },
        all: () => {
            return sessionStorage.get()
        },
        remove: (key) => {
            if (!key) {
                return;
            }
            sessionStorage.removeItem(key)
        },
        clear: () => {
            sessionStorage.clear()
        },
        has: (key) => {
            if (!key) {
                return
            }
            let value = sessionStorage.getItem(key)
            if (value) {
                return true
            }
            return false
        },
    },
    utils: {
        // 复制
        copy: (value) => {
            var input = document.createElement("input");   // js创建一个input输入框
            input.value = value;  // 将需要复制的文本赋值到创建的input输入框中，this.ruleForm.url这个是我要复制的内容
            document.body.appendChild(input);    // 将输入框暂时创建到实例里面
            input.select();   // 选中输入框中的内容
            document.execCommand("Copy");   // 执行复制操作
            document.body.removeChild(input); // 最后删除实例中临时创建的input输入框，完成复制操作
            Vue.prototype.$message({
                message: '复制成功',
                type: 'success'
            });
        },
        // 格式化时间戳 获取倒计时
        getLastTime: (time) => {
            var now = Date.parse(new Date()) / 1000;
            var t = parseInt(now - time)
            if (t < 0) t = 1
            let d = Math.floor(t / 3600 / 24)
            let h = Math.floor(t / 3600 % 24)
            let m = Math.floor((t / 60 % 60))
            let s = Math.floor((t % 60))
            if (d > 0) {
                return d + ' day ' + h + ' hr ago'
            } else {
                if (h > 0) {
                    return h + ' hr ' + m + ' mins ago'
                } else {
                    if (m > 0) {
                        return m + ' mins ago'
                    } else {
                        return s + ' secs ago'

                    }
                }
            }
        },
        // 时间戳转化成UTC日期格式
        toUTCtime: (time) => {
            var date = new Date(time * 1000),
                seperator1 = "-",
                seperator2 = ":",
                year = date.getFullYear(),
                month = date.getMonth() + 1,
                strDate = date.getDate(),
                hour = date.getHours(),
                minute = date.getMinutes(),
                second = date.getSeconds()
            if (month < 10) month = "0" + month;
            if (strDate < 10) strDate = "0" + strDate;
            if (hour < 10) hour = "0" + hour;
            if (minute < 10) minute = "0" + minute;
            if (second < 10) second = "0" + second;
            var currentdate = year + seperator1 + month + seperator1 + strDate
                + " " + hour + seperator2 + minute
                + seperator2 + second
            return currentdate + '（+UTC）';
        },
        // 转化成日期格式
        toNormaltime: (time) => {
            var date = new Date(time * 1000),
                seperator1 = "-",
                seperator2 = ":",
                year = date.getFullYear(),
                month = date.getMonth() + 1,
                strDate = date.getDate(),
                hour = date.getHours(),
                minute = date.getMinutes(),
                second = date.getSeconds()
            if (month < 10) month = "0" + month;
            if (strDate < 10) strDate = "0" + strDate;
            if (hour < 10) hour = "0" + hour;
            if (minute < 10) minute = "0" + minute;
            if (second < 10) second = "0" + second;
            var currentdate = year + seperator1 + month + seperator1 + strDate
                + " " + hour + seperator2 + minute
                + seperator2 + second
            return currentdate;
        },
        // 超长字符截取
        ellipsisText(str, length = 16) {
            if (str.length > length) {
                var newStr = str.slice(0, length / 2) + ' ... ' + str.slice(str.length - length / 2, str.length)
                return newStr
            }
        },
        // 转化成数值
        transferToNumber(num, rnum = 12) {
            if (isNaN(num)) {
                return num;
            }
            num = "" + num;
            num = parseFloat(num);
            let eformat = num.toExponential(); // 转换为标准的科学计数法形式（字符串）
            let tmpArray = eformat.match(/\d(?:\.(\d*))?e([+-]\d+)/); // 分离出小数值和指数值
            let number = num.toFixed(
                Math.max(0, (tmpArray[1] || "").length - tmpArray[2])
            );
            return Number(number).toFixed(rnum);
        },
        // 秒转化成时分秒
        secondToTime(second) {
            var h = parseInt(second / 3600),
                m = second % 3600,
                s = 0,
                str = ''
            s = m % 60
            m = parseInt(m / 60)
            // console.log(second, h, m, s)
            if (h > 0) str += h + 'h '
            if (m >= 0) str += m + 'm '
            if (s >= 0) str += s + 's '
            return str
        },
    }
}