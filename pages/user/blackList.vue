<template>
  <view class="blackList">
    <view class="blackList-empty" v-show="!blackList.length">
      <image class="image" src="@/static/images/user/black-empty.png" />
      <text class="text">你将不再接收黑名单用户的任何消息。</text>
    </view>
    <u-modal
      :show="blackModal.show"
      showCancelButton
      @confirm="confirm"
      @cancel="blackModal.show = false"
    >
      <view class="modal">
        <view class="modal-title2">确定将好友移除黑名单吗?</view>
      </view>
    </u-modal>
  </view>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      blackList: [],
      blackModal: {
        show: false,
        userInfo: {},
      },
    };
  },
  methods: {
    init() {
      this.$im.getBlackList(this.operationID, (res) => {
        console.log(res);
      });
    },
    confirm() {
      this.blackModal.show = false;
    },
  },
  computed: {
    ...mapGetters(["operationID"]),
  },
  onLoad() {
    this.init();
  },
};
</script>
<style lang="scss" scoped>
.blackList {
  min-height: 100vh;
  background-color: #f8f8f8;
  &-empty {
    padding-top: 400rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    .image {
      width: 256rpx;
      height: 200rpx;
    }
    .text {
      font-size: 16px;
      color: #999999;
      margin-top: 40rpx;
    }
  }
  .modal {
    width: 100%;
    &-title2 {
      text-align: center;
      font-size: 32rpx;
      color: #333333;
      //   margin-bottom: 36rpx;
    }
  }
}
</style>