<template>
  <view :class="['HistoryMessageCard']" @click="toConversation">
    <Avatar
      class="faceURL"
      :src="card.faceURL || 'error'"
      :name="card.showName"
      size="24px"
    />
    <text class="name">{{ card.showName }}:</text>
    <view class="msgContent">
      <slot v-if="contentType === 101" name="msg" />
      <view v-else class="msg">{{ msg }}</view>
    </view>
  </view>
</template>

<script>
import {
  formatHistoryCardMessage,
  getHistoryCardContentType,
} from "@/utils/formatMessage";
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
    return {};
  },
  methods: {
    toConversation() {
      const sourceID =
        this.card.conversationType === 1
          ? this.sourceID
          : this.card.messageItem.groupID;
      const clientMsgID = this.card.messageItem.clientMsgID;
      uni.navigateTo({
        url: `/pages/conversation/index?sessionType=${this.card.conversationType}&sourceID=${sourceID}&clientMsgID=${clientMsgID}`,
      });
    },
  },
  computed: {
    ...mapGetters(["userID"]),
    msg() {
      return formatHistoryCardMessage(this.card);
    },
    contentType() {
      return getHistoryCardContentType(this.card);
    },
    sourceID() {
      return this.card.messageItem.sendID === this.userID
        ? this.card.messageItem.recvID
        : this.card.messageItem.sendID;
    },
  },
};
</script>

<style lang="scss" scoped>
$pdLeft: 44rpx;
.HistoryMessageCard {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  padding: 12rpx 0;
  .faceURL {
    margin-right: 24rpx;
    flex-shrink: 0;
  }
  .name {
    flex-shrink: 0;
    font-size: 28rpx;
    font-weight: 500;
    color: #333;
    margin-right: 10rpx;
  }
  .msgContent {
    flex: 1;
    font-size: 28rpx;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>