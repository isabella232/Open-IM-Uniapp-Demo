<template>
  <view class="send">
    <u-navbar title="好友验证" autoBack>
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
      <view class="label">发送添加好友申请</view>
      <view class="input">
        <u--textarea v-model="sendForm.reqMsg" placeholder=" " border="none" />
      </view>
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
      friendInfo: {
        publicInfo: {
          userID: "",
          nickname: "",
          faceURL: "",
          gender: 1,
        },
        blackInfo: null,
      },
      sendForm: {
        reqMsg: "",
        remark: "",
      },
    };
  },
  methods: {
    init() {
      this.$im.getSelfUserInfo(this.$store.getters.operationID, (res) => {
        let data = res.data;
        if (data) {
          data = JSON.parse(data);
          this.userInfo = data;
          let str = "";
          if (this.userInfo.attachedInfo) {
            str = `来自${this.userInfo.attachedInfo}的`;
          }
          this.sendForm.reqMsg = `我是${str}${this.userInfo.nickname}`;
        }
      });
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
    setRemark() {
      this.$im.setFriendRemark(this.$store.getters.operationID, {
        toUserID: this.userID, // 用户ID
        remark: this.sendForm.remark, // 备注
      });
    },
    confirm() {
      this.setRemark();
      this.$im.addFriend(
        this.$store.getters.operationID,
        {
          toUserID: this.userID, // 用户ID
          reqMsg: "hello", // 验证消息
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