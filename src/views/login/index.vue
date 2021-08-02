<style>
html,
body,
#app {
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>
<style scoped lang='scss'>
.login_page {
  height: 100%;
  background: linear-gradient(45deg, #304156, #610455);
  .language_row {
    text-align: right;
    margin-right: 2rem;
  }
}
.login_cont {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  .title {
    margin: 6rem 0 3rem;
    color: #fff;
  }
  .board {
    box-sizing: border-box;
    width: 25rem;
    height: 23rem;
    padding: 1.5rem;
    background-color: #fff;
    border-radius: 0.6rem;
  }
  .board_title {
    margin-bottom: 1.5rem;
  }
  .loginForm {
    margin-top: 1.5rem;
  }
  .login_btn {
    margin-top: 1.5rem;
  }
  .code_wrap {
    display: flex;
    .code_btn {
      margin-left: 1rem;
    }
  }
}
</style>

<template>
  <div class="login_page" id="login_page">
    <div class="language_row">
      <language></language>
    </div>
    <div class="login_cont">
      <h1 class="title" v-t="'login.platformName'"></h1>

      <div class="board">
        <h2 class="board_title" v-t="'login.logIn'"></h2>
        <el-tabs v-model="activeName">
          <!-- 普通登陆 -->
          <el-tab-pane :label="$t('login.normalLogin')" name="account_login" class="login_title">
            <el-form
              :model="accountLogin"
              ref="loginForm"
              :rules="rules"
              class="loginForm"
              label-position="left"
              :label-width="$i18n.locale === 'en' ? '6rem' : '5rem'"
            >
              <el-form-item
                prop="userName"
                class="user_name_label"
                :label="$t('login.userName') + ':'"
              >
                <el-input
                  v-model="accountLogin.userName"
                  ref="loginInput"
                  class="input-text"
                  :placeholder="$t('login.enterUserName')"
                ></el-input>
              </el-form-item>
              <el-form-item prop="password" :label="$t('login.password') + ':'">
                <el-input
                  v-model="accountLogin.password"
                  type="password"
                  :placeholder="$t('login.enterPassword')"
                ></el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <!-- 手机快捷登陆 -->
          <el-tab-pane :label="$t('login.phoneLogin')" name="mobile_login" class="login_title">
            <el-form
              :model="mobileLogin"
              ref="mobileForm"
              :rules="rules"
              class="loginForm"
              label-position="left"
              :label-width="$i18n.locale === 'en' ? '8.5rem' : '5rem'"
            >
              <el-form-item prop="phone" :label="$t('login.phone') + ':'">
                <el-input v-model="mobileLogin.phone" :placeholder="$t('login.enterPhone')"></el-input>
              </el-form-item>
              <el-form-item prop="code" :label="$t('login.verificationCode') + ':'">
                <div class="code_wrap">
                  <el-input v-model="mobileLogin.code" :placeholder="$t('login.enterCode')"></el-input>
                  <el-button
                    type="primary"
                    class="code_btn"
                    v-if="!isDisable"
                  >{{$t('login.getCode')}}</el-button>
                  <el-button type="primary" class="code_btn" disabled v-if="isDisable">{{codeTxt}}</el-button>
                </div>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
        <el-button
          type="primary"
          class="login_btn whole_width"
          :loading="loading"
        >{{$t('login.logIn')}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import language from "@/components/language";

export default {
  components: { language },
  data() {
    return {
      activeName: "account_login",
      accountLogin: {
        userName: "",
        password: ""
      },
      mobileLogin: {
        phone: "",
        code: ""
      },
      codeTxt: this.$t("login.getCode"),
      rules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [
          {
            required: true,
            message: "请输入登录密码",
            trigger: "blur"
          }
        ],
        phone: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur"
          },
          {
            pattern: /^1[3,4,5,6,7,8,9]\d{9}$/,
            message: "请输入正确的手机号",
            trigger: "blur"
          }
        ],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }]
      },
      isDisable: false,
      loading: false
    };
  },
  watch: {
    "$i18n.locale": {
      handler: function() {
        this.rules.userName[0].message = this.$t("login.enterUserName");
        this.rules.password[0].message = this.$t("login.enterLoginPassword");
        this.rules.phone[0].message = this.$t("login.enterPhone");
        this.rules.phone[1].message = this.$t("login.enterRightPhone");
        this.rules.code[0].message = this.$t("login.enterCode");
        this.$refs.loginForm.clearValidate();
        this.$refs.mobileForm.clearValidate();
      }
    }
  },
  created() {
    //变量声明区
    this.timeId = "";
    this.sec = 60;
    this.waitTime = 60;
  },
  methods: {}
};
</script>


