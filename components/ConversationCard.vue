<template>
  <view class="ConversationCard">
    <view v-if="isNotice" class="ConversationCard-notice">
      {{ msg }}
    </view>
    <view
      v-else
      :class="[
        'ConversationCard-message',
        isSelf ? 'ConversationCard-self' : 'ConversationCard-other',
      ]"
    >
      <Avatar
        class="faceURL"
        :src="card.senderFaceUrl"
        :name="card.senderNickname"
        size="42px"
      />
      <view class="content">
        <view class="content-nickname" v-show="!isSelf && isGroupChat">{{
          card.senderNickname
        }}</view>
        <view class="content-message">
          <slot v-if="contentType === 101" name="msg" />
          <view v-else class="msg">{{ msg }}</view>
          <view
            v-show="isSelf"
            :class="['isRead', card.isRead ? 'isRead-hasRead' : '']"
          >
            {{ card.isRead ? "已读" : "未读" }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { parseTime } from "@/utils/index";
import Avatar from "@/components/Avatar.vue";
import { mapGetters } from "vuex";
import {
  formatConversationCardMessage,
  getConversationCardContentType,
  isNoticeMessage,
} from "@/utils/formatMessage";
export default {
  components: { Avatar },
  props: {
    card: {
      type: Object,
      default: () => {},
    },
    isSingleChat: {
      type: Boolean,
      default: false,
    },
    isGroupChat: {
      type: Boolean,
      default: false,
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
  onLoad() {},
  methods: {
    getImageUrl() {
      const { conversationType, faceURL } = this.card;
      if (conversationType === 2) {
        return "@/static/images/message/group-icon.png";
      }
      return faceURL;
    },
    toConversation() {},
  },
  computed: {
    ...mapGetters(["userID"]),
    msg() {
      return formatConversationCardMessage(this.card);
    },
    contentType() {
      return getConversationCardContentType(this.card);
    },
    isSelf() {
      return this.card.sendID === this.userID;
    },
    isNotice() {
      return isNoticeMessage(this.contentType);
    },
  },
  filters: {
    formatTime(time) {
      const oneDayTime = 24 * 60 * 60 * 1000;
      const now = new Date().getTime();
      if (now - time < oneDayTime) {
        return "昨天";
      }
      return parseTime(time, "{y}/{m}/{d}");
    },
  },
};
</script>

<style lang="scss" scoped>
$pdLeft: 44rpx;
.ConversationCard {
  padding: 0 $pdLeft;
  &-notice {
    text-align: center;
    font-size: 24rpx;
    color: #999;
    margin-bottom: 30rpx;
  }
  &-message {
    display: flex;
    flex-wrap: nowrap;
    align-items: flex-start;
    margin-bottom: 40rpx;
    .faceURL,
    .isRead {
      flex-shrink: 0;
    }
    .content {
      display: flex;
      flex-direction: column;
      &-nickname {
        font-size: 24rpx;
        color: #666666;
        margin-bottom: 4rpx;
      }
      &-message {
        display: flex;
        flex-wrap: nowrap;
        justify-content: center;
        background: #f0f0f0;
        padding: 14rpx;
        border-radius: 8rpx;
        position: relative;
        .msg {
          font-size: 26rpx;
          color: #666666;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        &::before {
          position: absolute;
          right: 100%;
          top: 16rpx;
          content: "";
          width: 0;
          height: 0;
          border: 12rpx solid transparent;
          border-right-color: #f0f0f0;
        }
        &::after {
          position: absolute;
          left: 100%;
          top: 16rpx;
          content: "";
          width: 0;
          height: 0;
          border: 12rpx solid transparent;
          border-left-color: #f0f0f0;
        }
        .isRead {
          content: "";
          position: absolute;
          bottom: 4rpx;
          right: 100%;
          font-size: 24rpx;
          margin-right: 12rpx;
          color: #006aff;
          white-space: nowrap;
          &-hasRead {
            color: #999999;
          }
        }
      }
    }
  }
  &-other {
    margin-right: 128rpx;
    .faceURL {
      margin-right: 24rpx;
    }
    .content {
      &-message {
        &::after {
          display: none;
        }
      }
    }
  }
  &-self {
    margin-left: 128rpx;
    flex-direction: row-reverse;
    .faceURL {
      margin-left: 24rpx;
    }
    .content {
      &-message {
        &::before {
          display: none;
        }
      }
    }
  }
}
</style>