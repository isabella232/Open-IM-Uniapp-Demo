<template>
  <view class="send">
    <u-navbar title="设置备注" autoBack>
      <view slot="right">
        <u-button
          type="primary"
          text="发送"
          size="mini"
          @click="confirm"
        ></u-button>
      </view>
    </u-navbar>
    <view class="statusBar"></view>
    <view class="content">
      <view class="label">备注名</view>
      <view class="input">
        <u--input
          placeholder=" "
          border="none"
          v-model="sendForm.remark"
          :customStyle="{ padding: '18rpx' }"
        />
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userID: "",
      friendInfo: {
        publicInfo: {
          userID: "",
          nickname: "",
          faceURL: "",
          gender: 1,
        },
      },
      sendForm: {
        remark: "",
      },
    };
  },
  methods: {
    init() {
      this.$im.getUsersInfo(
        this.$store.getters.operationID,
        [this.userID],
        (res) => {
          if (res.errCode !== 0) {
            this.$toast(res.errMsg);
          } else {
            let list = JSON.parse(res.data);
            let item = list[0];
            this.friendInfo = item;
            this.sendForm.remark = this.friendInfo.friendInfo.remark;
          }
        }
      );
    },
    confirm() {
      this.$im.setFriendRemark(
        this.$store.getters.operationID,
        {
          toUserID: this.userID, // 用户ID
          remark: this.sendForm.remark, // 备注
        },
        (res) => {
          this.$toast(res.errMsg);
          if (res.errCode === 0) {
            setTimeout(() => {
              uni.navigateBack();
            }, 1000);
          }
        }
      );
    },
  },
  onLoad(param) {
    this.userID = param.userID;
    this.init();
  },
};
</script>

<style lang="scss" scoped>
.send {
  min-height: 100vh;
  background-color: #f6f6f6;
  .statusBar {
    height: 44px;
  }
  .label {
    margin: 20rpx 44rpx;
    font-size: 28rpx;
    color: #666666;
  }
  .input {
    background-color: #fff;
  }
}
</style>