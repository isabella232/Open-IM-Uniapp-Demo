<template>
  <view
    :class="['MessageCard', card.isPinned ? 'MessageCard-isPinned' : '']"
    @click="toConversation"
  >
    <Avatar
      v-if="card.conversationType === 1"
      class="faceURL"
      :src="card.faceURL"
      :name="card.showName"
    />
    <u-image
      v-else-if="card.conversationType === 2 && card.faceURL"
      class="faceURL"
      :src="card.faceURL"
      width="48px"
      height="48px"
      radius="6"
    />
    <u-image
      v-else
      class="faceURL"
      src="@/static/images/message/group-icon.png"
      width="48px"
      height="48px"
      radius="6"
    />
    <view class="content">
      <view class="header">
        <text class="name">{{ card.showName }}</text>
        <text class="date">{{ card.latestMsgSendTime | formatTime }}</text>
      </view>
      <view class="msgContent">
        <slot v-if="contentType === 101" name="msg" />
        <view v-else class="msg">{{ msg }}</view>
        <text v-show="unreadCount" class="unReadCount">
          {{ unreadCount }}
        </text>
      </view>
    </view>
  </view>
</template>

<script>
import { parseTime } from "@/utils/index";
import {
  formatMessageCardMessage,
  getMessageCardContentType,
} from "@/utils/formatMessage";
import Avatar from "@/components/Avatar.vue";
export default {
  components: { Avatar },
  props: {
    card: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      showAction: true,
      actionOptions: [
        {
          text: "置顶",
          style: {
            backgroundColor: "#1B72EC",
          },
        },
        {
          text: "移除",
          style: {
            backgroundColor: "#FFAB41",
          },
        },
      ],
    };
  },
  methods: {
    getImageUrl() {
      const { conversationType, faceURL } = this.card;
      if (conversationType === 2) {
        return "@/static/images/message/group-icon.png";
      }
      return faceURL;
    },
    toConversation() {
      const sourceID =
        this.card.conversationType === 1 ? this.card.userID : this.card.groupID;
      uni.navigateTo({
        url: `/pages/conversation/index?sessionType=${this.card.conversationType}&sourceID=${sourceID}`,
      });
    },
  },
  computed: {
    msg() {
      return formatMessageCardMessage(this.card);
    },
    contentType() {
      return getMessageCardContentType(this.card);
    },
    unreadCount(){
      const count=Number(this.card.unreadCount)||0
      return count>99?'99+':count
    }
  },
  filters: {
    formatTime(time) {
      const gg = 5 * 60 * 1000;
      const oneDayTime = 24 * 60 * 60 * 1000;
      const now = new Date().getTime();
      const today0 = new Date(
        parseTime(new Date(), "{y}/{m}/{d} 00:00:00")
      ).getTime();
      if (now - time < gg) {
        //5分钟内
        return "刚刚";
      } else if (time >= today0) {
        //今天
        return parseTime(time, "{h}:{i}");
      } else if (now - time > oneDayTime && now - time < oneDayTime * 2) {
        return "昨天";
      }
      return parseTime(time, "{y}/{m}/{d}");
    },
  },
};
</script>

<style lang="scss" scoped>
$pdLeft: 44rpx;
.MessageCard {
  padding: 18rpx $pdLeft;
  display: flex;
  flex-wrap: nowrap;
  border-bottom: 2rpx solid #fff;
  &-isPinned {
    background-color: #f7f7f7;
  }
  .faceURL {
    margin-right: 24rpx;
  }
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10rpx;
      .name {
        font-size: 32rpx;
        font-weight: 500;
        color: #333333;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .date {
        font-size: 24rpx;
        color: #999999;
      }
    }
    .msgContent {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      .msg {
        font-size: 26rpx;
        color: #666666;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex: 1;
      }
      .unReadCount {
        flex-shrink: 0;
        border-radius: 50%;
        background-color: #f44038;
        width: 50rpx;
        height: 50rpx;
        line-height: 50rpx;
        text-align: center;
        font-size: 24rpx;
        color: #ffffff;
        margin-left: 8rpx;
      }
    }
  }
}
</style>