<template>
  <view class="container">
    <view class="statusBar" />
    <view class="content">
      <view class="search">
        <u-search
          shape="square"
          v-model="searchContent"
          placeholder="通过手机号/ID号搜索添加"
          actionText="取消"
          @change="searchContentChange"
          @search="searchConfirm"
          @custom="back"
        ></u-search>
        <view
          class="search-content"
          @click="searchConfirm"
          v-show="searchContent && !isEmpty"
        >
          <image class="image" src="@/static/images/friend/search-icon.png" />
          <text class="text">搜索:</text>
          <text class="userName">{{ searchContent }}</text>
        </view>
        <view class="search-empty" v-show="isEmpty"> 无法找到该用户 </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return { searchContent: "", isEmpty: false };
  },
  onLoad() {},
  methods: {
    searchContentChange() {
      this.isEmpty = false;
    },
    searchConfirm() {
      this.$im.getUsersInfo(this.operationID, [this.searchContent], (res) => {
        if (res.errCode !== 0) {
          this.isEmpty = true;
        } else {
          uni.navigateTo({
            url: "./info?id=" + this.searchContent,
          });
        }
      });
    },
    back() {
      uni.navigateBack();
    },
  },
  computed: {
    ...mapGetters(["operationID"]),
  },
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: #f8f8f8;
  .content {
    padding: 24rpx 44rpx;
    background-color: #fff;
  }
  .search {
    &-content {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      font-size: 28r4px;
      color: #333333;
      margin-top: 32rpx;
      .image {
        width: 44rpx;
        height: 44rpx;
        margin-right: 16rpx;
      }
      .text {
        margin-right: 16rpx;
      }
    }
    &-empty {
      margin-top: 32rpx;
      text-align: center;
      font-size: 28rpx;
      color: #666666;
    }
  }
}
</style>