<template>
  <view class="index">
    <view class="statusBar"></view>
    <u-sticky customNavHeight="0" bgColor="#fff">
      <view class="userInfo">
        <view class="userInfo-left">
          <Avatar :src="userInfo.faceURL" :name="userInfo.nickname" />
        </view>
        <view class="userInfo-center">
          <view class="company" v-show="userInfo.attachedInfo">
            {{ userInfo.attachedInfo }}
          </view>
          <view class="name">
            <view class="nickname">{{ userInfo.nickname }}</view>
            <view class="userStatus">手机在线</view>
          </view>
        </view>
        <view class="userInfo-right">
          <image class="image" src="@/static/images/index/tel.png" />
          <image
            class="image"
            id="addPic"
            src="@/static/images/index/add.png"
            @click="showAdd"
          />
        </view>
      </view>
      <view class="search">
        <u-search
          shape="square"
          v-model="searchContent"
          :showAction="false"
          placeholder="搜索"
          disabled
          @click="routerGo('./search')"
        />
      </view>
    </u-sticky>
    <view class="container">
      <uni-swipe-action>
        <uni-swipe-action-item
          v-for="item in messageList"
          :key="item.conversationID"
          :right-options="filterActionOptions(item)"
          @click="(v) => swipeActionClick(v, item)"
        >
          <MessageCard :card="item" />
        </uni-swipe-action-item>
      </uni-swipe-action>
    </view>
    <view v-show="addPop.show" class="addContent" @click="addPop.show = false">
      <view class="addContent-pop" :style="addPop.style">
        <view class="addContent-pop-item" @click="scanCode">
          <image class="image" src="@/static/images/message/scan.png"></image>
          <text class="text">扫一扫</text>
        </view>
        <view
          class="addContent-pop-item"
          @click="routerGo('/pages/friend/add')"
        >
          <image
            class="image"
            src="@/static/images/message/addFriend.png"
          ></image>
          <text class="text">添加好友</text>
        </view>
        <view class="addContent-pop-item" @click="routerGo('/pages/group/add')">
          <image
            class="image"
            src="@/static/images/message/addGroup.png"
          ></image>
          <text class="text">添加群聊</text>
        </view>
        <view
          class="addContent-pop-item"
          @click="routerGo('/pages/group/create')"
        >
          <image
            class="image"
            src="@/static/images/message/createGroup.png"
          ></image>
          <text class="text">发起群聊</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters } from "vuex";
import { toast } from "@/common/toast";
import { scan } from "@/utils/scan";
import MessageCard from "@/components/MessageCard";
import Avatar from "@/components/Avatar.vue";
export default {
  components: { MessageCard, Avatar },
  data() {
    return {
      searchContent: "",
      actionOptions: [
        {
          text: "置顶",
          style: {
            backgroundColor: "#1B72EC",
          },
        },
        {
          text: "取消置顶",
          style: {
            backgroundColor: "#ccc",
          },
        },
        {
          text: "移除",
          style: {
            backgroundColor: "#FFAB41",
          },
        },
      ],
      addPop: { show: false, style: {} },
      timer: null,
    };
  },
  onLoad() {
    // #ifdef APP-PLUS
    this.init();
    // #endif
  },
  methods: {
    init() {
      this.getAllConversationList();
    },
    getAllConversationList() {
      this.$im.getAllConversationList(this.operationID, (res) => {
        if (res.errCode !== 0) {
          toast(res.errMsg);
        } else {
          const data = JSON.parse(res.data);
          // console.log(data);
          // console.log(JSON.parse(res.data));
          this.$store.commit("message/set_messageList", data);
          this.setTabBarBadge();
        }
      });
    },
    showAdd() {
      const query = uni.createSelectorQuery().in(this);
      query
        .select("#addPic")
        .boundingClientRect((data) => {
          const { height, left, top } = data;
          this.addPop.style = {
            "margin-top": top + height + "px",
            "margin-left": left - 130 + "px",
          };
          this.addPop.show = true;
        })
        .exec();
    },
    scanCode() {
      scan();
    },
    routerGo(url) {
      if (url) {
        uni.navigateTo({
          url,
        });
      }
    },
    filterActionOptions(item) {
      const { isPinned } = item;
      const list = [...this.actionOptions];
      if (isPinned) {
        list.splice(0, 1);
      } else {
        list.splice(1, 1);
      }
      return list;
    },
    swipeActionClick({ index }, item) {
      const { conversationID, isPinned } = item;
      if (index === 0) {
        this.$im.pinConversation(
          this.operationID,
          conversationID,
          !isPinned,
          (res) => {
            if (res.errCode === 0) {
              this.init();
            }
          }
        );
      } else if (index === 1) {
        this.$im.deleteConversation(this.operationID, conversationID, (res) => {
          if (res.errCode === 0) {
            this.init();
          }
        });
      }
    },
    setTabBarBadge() {
      if (this.total) {
        uni.setTabBarBadge({
          index: 0,
          text: this.total + "",
        });
      } else {
        uni.removeTabBarBadge({ index: 0 });
      }
    },
  },
  computed: {
    ...mapGetters([
      "userInfo",
      "messageList",
      "operationID",
      "newMessageTimes",
      "indexMessageTimes",
    ]),
    total() {
      let t = this.messageList
        .filter((i) => {
          return i.recvMsgOpt === 0;
        })
        .map((i) => Number(i.unreadCount) || 0)
        .reduce((total, num) => total + num);
      t = t > 99 ? 99 : t;
      return t;
    },
  },
  watch: {
    newMessageTimes() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.init();
      }, 500);
    },
    indexMessageTimes() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.init();
      }, 500);
    },
  },
};
</script>
<style lang="scss" scoped>
$pdLeft: 44rpx;
.index {
  .userInfo {
    padding: $pdLeft;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &-left {
      flex-shrink: 0;
      width: 96rpx;
      height: 96rpx;
    }
    &-center {
      flex: 1;
      padding: 0 22rpx;
      color: #333;
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 100%;
      overflow: hidden;
      .company {
        font-size: 24rpx;
        margin-bottom: 4rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: block;
      }
      .name {
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
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
          margin-top: 8rpx;
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
    &-right {
      display: flex;
      align-items: center;
      .image {
        width: 46rpx;
        height: 46rpx;
        &:nth-of-type(1) {
          margin-right: 32rpx;
        }
      }
    }
  }
  .search {
    padding: 16rpx $pdLeft 8rpx;
  }
  .container {
    margin-top: 32rpx;
    .indexEditor {
      height: 24px;
      line-height: 24px;
      min-height: 24px;
      font-size: 26rpx;
      color: #666666;
      /deep/ .ql-editor {
        p {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        img {
          width: 20px;
          height: 20px;
        }
      }
    }
  }
  .addContent {
    background-color: rgba(0, 0, 0, 0.5);
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 999;
    &-pop {
      background-color: #fff;
      width: 130px;
      border-radius: 12rpx;
      &-item {
        display: flex;
        align-items: center;
        padding: 18rpx 0;
        border-bottom: 2rpx solid #f0f0f0;
        .image {
          margin-left: 12px;
          margin-right: 16px;
          width: 24px;
          height: 24px;
        }
        .text {
          font-size: 14px;
          color: #333333;
        }
        &:last-of-type {
          border-bottom: none;
        }
      }
    }
  }
}
</style>