<template>
  <view class="MessageCard" @click="toConversation">
    <Avatar
      v-if="card.faceURL"
      class="faceURL"
      :src="card.faceURL"
      :name="card.showName"
    />
    <u-image
      v-else-if="card.conversationType === 2"
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
      <slot v-if="contentType === 101" name="msg" />
      <view v-else class="msg" @click.stop="test">{{ msg }}</view>
    </view>
  </view>
</template>

<script>
import { parseTime } from "@/utils/index";
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
    test() {
      console.log(this.card);
      // const latestMsg = JSON.parse(this.card.latestMsg);
      // console.log(latestMsg);
      // const content = JSON.parse(latestMsg.content);
      // console.log(content);
      // const jsonDetail = JSON.parse(content.jsonDetail);
      // console.log(jsonDetail);
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
      let latestMsg = this.card.latestMsg;
      if (!latestMsg) return "";
      latestMsg = JSON.parse(this.card.latestMsg);
      const content = this.getContent(latestMsg.content);
      return `${this.getNickname(latestMsg.senderNickname)}${content}`;
    },
    contentType() {
      let latestMsg = this.card.latestMsg;
      if (!latestMsg) return 110;
      latestMsg = JSON.parse(this.card.latestMsg);
      return latestMsg.contentType;
    },
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
      } else if (now - time <= today0) {
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
  padding: 0 $pdLeft;
  margin-bottom: 36rpx;
  display: flex;
  flex-wrap: nowrap;
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
    .msg {
      font-size: 26rpx;
      color: #666666;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>