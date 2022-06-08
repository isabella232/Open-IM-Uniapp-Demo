<template>
  <view :class="['HistoryFriendCard']" @click="toInfo">
    <Avatar
      class="faceURL"
      :src="card.publicInfo.faceURL || 'error'"
      :name="card.publicInfo.nickname"
      size="24px"
    />
    <text class="name">{{ card.publicInfo.nickname }}</text>
  </view>
</template>

<script>
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
    return {};
  },
  methods: {
    toInfo() {
      const sourceID = this.card.publicInfo.userID;
      uni.navigateTo({
        url: `/pages/friend/info?id=${sourceID}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
$pdLeft: 44rpx;
.HistoryFriendCard {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  padding: 12rpx 0;
  .faceURL {
    margin-right: 24rpx;
    flex-shrink: 0;
  }
  .name {
    flex: 1;
    font-size: 28rpx;
    font-weight: 500;
    color: #333;
    margin-right: 10rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>