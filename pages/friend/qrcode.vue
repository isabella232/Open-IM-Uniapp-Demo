<template>
  <view class="qrcode">
    <view class="statusBar"></view>
    <view class="qrcode-card">
      <view class="info">
        <Avatar
          class="Avatar"
          :src="userInfo.faceURL"
          :name="userInfo.nickname"
        />
        <text class="nickname">{{ userInfo.nickname }}</text>
      </view>
      <view class="notice">扫一扫下面的二维码，添加我为好友</view>
      <view class="code">
        <image
          class="bg"
          src="@/static/images/friend/qrcode-border.png"
        ></image>
        <Qrcode
          class="Qrcode"
          ref="qrcode"
          :modal="modal_qr"
          :url="userInfo.userID"
          :height="140"
          :width="140"
        />
      </view>
    </view>
  </view>
</template>

<script>
import Qrcode from "@/components/Qrcode/ay-qrcode.vue";
import Avatar from "@/components/Avatar.vue";
export default {
  components: { Qrcode, Avatar },
  data() {
    return {
      modal_qr: false,
      userInfo: {
        userID: "",
        nickname: "",
        faceURL: "",
        gender: 0,
        phoneNumber: "",
        birth: 0,
        email: "",
        createTime: 0,
        ex: "",
        attachedInfo: "",
      },
    };
  },
  methods: {
    init() {
      this.$im.getSelfUserInfo(this.$store.getters.operationID, (res) => {
        let data = res.data;
        if (data) {
          data = JSON.parse(data);
          this.showQrcode();
        }
      });
    },
    showQrcode() {
      this.modal_qr = true;
      setTimeout(() => {
        this.$refs.qrcode.crtQrCode();
      }, 50);
    },
  },
  onLoad() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
.qrcode {
  background: #f8f8f8;
  border-top: 2rpx solid #f8f8f8;
  min-height: 100vh;
  &-card {
    margin: 116rpx 44rpx 0;
    background: #ffffff;
    box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    .info {
      display: flex;
      align-items: center;
      padding: 72rpx 72rpx 100rpx;
      .Avatar {
        flex-shrink: 0;
      }
      .nickname {
        flex: 1;
        margin-left: 36rpx;
        font-size: 20px;
        font-weight: 400;
        color: #000000;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .notice {
      text-align: center;
      font-size: 28rpx;
      color: #999999;
      margin-bottom: 60rpx;
    }
    .code {
      margin: 0 auto;
      width: 180px;
      height: 180px;
      padding-bottom: 160rpx;
      position: relative;
      .bg {
        width: 100%;
        height: 100%;
      }
      .Qrcode {
        position: absolute;
        z-index: 1;
        top: 21px;
        // #ifdef H5
        left: -27px;
        // #endif
        // #ifdef APP-PLUS
        left: 20px;
        // #endif
      }
    }
  }
}
</style>