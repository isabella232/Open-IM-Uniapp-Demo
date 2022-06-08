<template>
  <view class="info">
    <view class="top">
      <Avatar
        :src="friendInfo.publicInfo.faceURL"
        :name="friendInfo.publicInfo.nickname"
      />
      <view class="name">
        <view class="nickname">{{ friendInfo.publicInfo.nickname }}</view>
        <view class="userStatus">手机在线</view>
      </view>
    </view>
    <view class="bottom">
      <view class="bottom-item">
        <text class="text">备注</text>
        <u-icon class="icon" size="22" name="arrow-right" color="#999"></u-icon>
      </view>
      <view class="bottom-item">
        <text class="text">ID号</text>
        <u-icon class="icon" size="22" name="arrow-right" color="#999"></u-icon>
      </view>
    </view>
    <view class="operation">
      <view class="operation-item" @click="toConversation">
        <image class="image" src="@/static/images/friend/message.png" />
        <text class="text text1">发消息</text>
      </view>
      <view class="operation-item">
        <image class="image" src="@/static/images/friend/phone.png" />
        <text class="text text1">司聊电话</text>
      </view>
      <view class="operation-item">
        <image class="image" src="@/static/images/friend/add.png" />
        <text class="text text2">添加好友</text>
      </view>
    </view>
  </view>
</template>

<script>
import Avatar from "@/components/Avatar.vue";
import { mapGetters } from "vuex";
export default {
  components: { Avatar },
  data() {
    return {
      id: "",
      friendInfo: {
        publicInfo: {
          userID: "",
          nickname: "",
          faceURL: "",
          gender: 1,
        },
        friendInfo: null,
        blackInfo: null,
      },
    };
  },
  methods: {
    getUsersInfo() {
      this.$im.getUsersInfo(this.operationID, [this.id], (res) => {
        if (res.errCode !== 0) {
          this.$toast(res.errMsg);
        } else {
          let list = JSON.parse(res.data);
          let item = list[0];
          this.friendInfo = item;
        }
      });
    },
    toConversation() {
      uni.navigateTo({
        url: "/pages/conversation/index?sessionType=1&sourceID=" + this.id,
      });
    },
  },
  onLoad(param) {
    this.id = param.id || "18381415165";
    this.getUsersInfo();
  },
  computed: {
    ...mapGetters(["operationID"]),
  },
};
</script>
<style lang="scss" scoped>
.info {
  background: #f6f6f6;
  min-height: 100vh;
  .top {
    padding: 74rpx 42rpx;
    margin-bottom: 24rpx;
    display: flex;
    align-items: center;
    background-color: #fff;
    .name {
      margin-left: 36rpx;
      .nickname {
        font-size: 36rpx;
        margin-right: 24rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .userStatus {
        font-size: 24rpx;
        padding-left: 20rpx;
        position: relative;
        white-space: nowrap;
        &::before {
          content: "";
          background-color: #10cc64;
          width: 12rpx;
          height: 12rpx;
          border-radius: 50%;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  }
  .bottom {
    padding: 0 44rpx;
    background-color: #fff;
    &-item {
      padding: 30rpx 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
  .operation {
    margin-top: 70%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    &-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      .image {
        width: 100rpx;
        height: 100rpx;
      }
      .text {
        font-size: 28rpx;
      }
      .text1 {
        color: #b8b8b8;
      }
      .text2 {
        color: #1d6bed;
      }
    }
  }
}
</style>