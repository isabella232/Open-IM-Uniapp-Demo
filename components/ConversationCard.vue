<template>
  <view
    :class="[
      'ConversationCard',
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
      <slot v-if="contentType === 101" name="msg" />
      <view v-else class="msg">{{ msg }}</view>
    </view>
    <view v-show="isSelf" :class="['isRead', card.isRead ? 'isRead-hasRead' : '']">{{card.isRead?'已读':'未读'}}</view>
  </view>
</template>

<script>
import { parseTime } from "@/utils/index";
import Avatar from "@/components/Avatar.vue";
import { mapGetters } from "vuex";
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
      userID: "18381415165",
    };
  },
  methods: {
    test() {
      console.log(this.card);
    },
    getImageUrl() {
      const { conversationType, faceURL } = this.card;
      if (conversationType === 2) {
        return "@/static/images/message/group-icon.png";
      }
      return faceURL;
    },
    getNickname(nickname = "", conversationType = 1) {
      if (conversationType === 1) {
        return "";
      }
      return nickname ? nickname + " :" : "";
    },
    getContent(c) {
      let content = c;
      let jsonDetail = null;
      switch (this.contentType) {
        case 101: //文字
          return content;
        case 102:
          return "[图片]";
        case 103:
          return "[语音]";
        case 104:
          return "[视频]";
        case 105:
          return "[文件]";
        case 110:
          return "[自定义消息]";
        case 1204:
          return `你们已经是好友啦，开始聊天吧~`;
        case 1501:
          content = JSON.parse(content);
          jsonDetail = JSON.parse(content.jsonDetail);
          return `${jsonDetail.opUser.nickname}创建了群聊`;
        case 1511:
          content = JSON.parse(content);
          jsonDetail = JSON.parse(content.jsonDetail);
          return `${jsonDetail.opUser.nickname}解散了群组`;
        default:
          return content;
      }
    },
    toConversation() {},
  },
  computed: {
    // ...mapGetters(["userID"]),
    msg() {
      const content = this.getContent(this.card.content);
      return `${content}`;
    },
    contentType() {
      return this.card.contentType;
    },
    isSelf() {
      return this.card.sendID === this.userID;
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
  margin-bottom: 40rpx;
  display: flex;
  flex-wrap: nowrap;
  display: flex;
  align-items: flex-start;
  flex-wrap: nowrap;
  &-other {
    margin-right: 128rpx;
    .faceURL {
      margin-right: 24rpx;
    }
    .content {
      &::after {
        display: none;
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
      &::before {
        display: none;
      }
    }
  }

  .content {
    display: flex;
    flex-direction: column;
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
      top: 30rpx;
      content: "";
      width: 0;
      height: 0;
      border: 12rpx solid transparent;
      border-right-color: #f0f0f0;
    }
    &::after {
      position: absolute;
      left: 100%;
      top: 30rpx;
      content: "";
      width: 0;
      height: 0;
      border: 12rpx solid transparent;
      border-left-color: #f0f0f0;
    }
  }
  .isRead {
    font-size: 24rpx;
    margin: 18rpx 12rpx 0;
    color: #006aff;
    &-hasRead {
      color: #999999;
    }
  }
}
</style>