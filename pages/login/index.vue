<template>
  <view class="login">
    <view class="title">欢迎使用OpenIM</view>
    <view class="loginType">
      <text
        :class="[
          'loginType-item',
          loginType.current === index ? 'loginType-active' : '',
        ]"
        v-for="(item, index) in loginType.list"
        :key="index"
        @click="loginTypeChange(index)"
        >{{ item.name }}</text
      >
    </view>
    <u-form
      class="loginForm"
      labelPosition="top"
      :model="userInfo"
      :rules="rules"
      :labelStyle="{
        fontWeight: 400,
        marginTop: '20rpx',
        marginBottom: '10rpx',
      }"
      ref="loginForm"
    >
      <u-form-item prop="phoneNumber" borderBottom>
        <u-input
          v-model="userInfo.phoneNumber"
          border="none"
          fontSize="36rpx"
          placeholder="请输入手机号码"
          clearable
        >
          <view class="phoneNumber-code" slot="prefix">
            <text class="code">+86</text>
            <u-icon class="icon" name="arrow-down"></u-icon>
          </view>
        </u-input>
      </u-form-item>
      <u-form-item label="密码" prop="password" borderBottom>
        <u-input
          v-show="isPassword"
          v-model="userInfo.password"
          border="none"
          fontSize="36rpx"
          placeholder="请输入密码"
          type="password"
        >
          <view class="eye" slot="suffix">
            <image
              @click="changeType"
              class="image"
              src="@/static/images/login/eye-off.png"
            />
          </view>
        </u-input>
        <u-input
          v-show="!isPassword"
          v-model="userInfo.password"
          border="none"
          fontSize="36rpx"
          placeholder="请输入密码"
          type="text"
        >
          <view class="eye" slot="suffix">
            <image
              @click="changeType"
              class="image"
              src="@/static/images/login/eye-open.png"
            />
          </view>
        </u-input>
      </u-form-item>
    </u-form>
    <view class="other">
      <text class="forget">忘记密码</text>
      <text class="register">新用户注册</text>
    </view>
    <view class="login-btn">
      <u-button type="primary" @click="startLogin" :disabled="!checked[0]"
        >登录</u-button
      >
    </view>
    <view class="agreement">
      <u-checkbox-group v-model="checked">
        <u-checkbox
          iconSize="12"
          labelSize="12"
          shape="circle"
          label="我已阅读并同意："
          :name="true"
        ></u-checkbox>
      </u-checkbox-group>
      <text class="detail">《服务协议》，《隐私权政策》</text>
    </view>
  </view>
</template>

<script>
// #ifdef APP-PLUS
import { login as im_login } from "@/config/app";
// #endif
// #ifdef H5
import { login as im_login } from "@/config/web";
// #endif
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      loginType: { list: [{ name: "手机号码" }, { name: "邮箱" }], current: 0 },
      userInfo: {
        phoneNumber: "",
        password: "",
      },
      rules: {
        phoneNumber: {
          type: "string",
          required: true,
          message: "请输入手机号码",
          trigger: ["blur", "change"],
        },
        password: {
          type: "string",
          required: true,
          message: "请输入密码",
          trigger: ["blur", "change"],
        },
      },
      passwordType: "password",
      isPassword: true,
      checked: [false],
    };
  },
  onLoad() {
    this.init();
  },
  onReady() {
    this.startLogin();
  },
  methods: {
    init() {},
    loginTypeChange(index) {
      this.loginType.current = index;
    },
    startLogin() {
      this.$refs.loginForm.validate().then((valid) => {
        if (valid) {
          this.$store
            .dispatch("user/login", {
              userID: this.userInfo.phoneNumber,
              operationID: this.operationID,
            })
            .then(() => {
              im_login();
            })
            .catch((error) => {
              this.$toast(error.message);
            });
        }
      });
    },
    changeType() {
      this.isPassword = !this.isPassword;
      this.passwordType = this.isPassword ? "password" : "text";
    },
  },
  computed: {
    ...mapGetters(["operationID"]),
  },
};
</script>
<style lang="scss" scoped>
.login {
  color: #333333;
  padding: 126rpx * 2 80rpx 0;
  .title {
    font-size: 64rpx;
    font-weight: 600;
    margin-bottom: 116rpx;
  }
  .loginType {
    margin-bottom: 64rpx;
    &-item {
      margin-right: 68rpx;
      font-size: 28rpx;
      font-weight: 400;
      border-radius: 4rpx;
      padding: 2rpx 0;
    }
    &-active {
      color: $u-primary;
      border-bottom: 4rpx solid $u-primary;
    }
  }
  .loginForm {
    .phoneNumber-code {
      display: flex;
      align-items: center;
      font-size: 36rpx;
      border-right: 2rpx solid #d8d8d8;
      margin-right: 58rpx;
      .code {
        font-weight: 400;
        margin-right: 20rpx;
      }
      .icon {
        margin-right: 40rpx;
      }
    }
    .eye {
      .image {
        width: 44rpx;
        height: 32rpx;
      }
    }
  }
  .other {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 29rpx;
    font-size: 24rpx;
    font-weight: 400;
    .register {
      color: $u-primary;
    }
  }
  .login-btn {
    margin-top: 168rpx;
  }
  .agreement {
    display: flex;
    align-items: flex-start;
    margin-top: 36rpx;
    .detail {
      font-size: 24rpx;
      font-weight: 400;
      color: $u-primary;
    }
  }
}
</style>