<template>
  <view class="search">
    <view class="statusBar"></view>
    <view class="search-input">
      <u-search
        shape="square"
        v-model="searchContent"
        placeholder="通过手机号/ID号搜索添加"
        actionText="取消"
        :actionStyle="{ color: '#1B72EC' }"
        @change="searchContentChange"
        @custom="back"
      ></u-search>
    </view>
    <view class="search-friend" v-show="friendList.length">
      <view class="text">联系人</view>
      <view
        class="friendListItem"
        v-for="(item, index) in friendList"
        :key="index"
      >
        <HistoryFriendCard :card="item" />
      </view>
    </view>
    <view class="search-message" v-show="historyMessageList.length">
      <view class="text">聊天记录</view>
      <view
        class="historyMessageItem"
        v-for="(item, index) in historyMessageList"
        :key="index"
      >
        <HistoryMessageCard :card="item">
          <editor
            slot="msg"
            read-only
            :class="['indexEditor-' + index, 'indexEditor']"
            @ready="editorReady('indexEditor-' + index, item)"
          />
        </HistoryMessageCard>
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters } from "vuex";
import HistoryMessageCard from "@/components/HistoryMessageCard";
import HistoryFriendCard from "@/components/HistoryFriendCard";
export default {
  components: { HistoryMessageCard, HistoryFriendCard },
  data() {
    return {
      searchContent: "",
      friendList: [],
      messageData: {
        searchResultItems: [],
      },
    };
  },
  methods: {
    searchContentChange() {
      if (this.searchContent) {
        this.searchFriend();
        this.searchMessage();
      } else {
        this.friendList = [];
        this.messageData.searchResultItems = [];
      }
    },
    searchFriend() {
      this.$im.getUsersInfo(this.operationID, [this.searchContent], (res) => {
        if (res.errCode === 0) {
          let list = JSON.parse(res.data);
          this.friendList = list;
        }
      });
    },
    searchMessage() {
      this.$im.searchLocalMessages(
        this.operationID,
        {
          sourceID: "", //源ID,单聊为用户ID，群聊为群ID
          sessionType: 0, //会话类型，单聊为1，群聊为2，如果为0，则代表搜索全部
          keywordList: [
            this.searchContent, //搜索关键词列表，目前仅支持一个关键词搜索
          ],
          keywordListMatchType: 0, //关键词匹配模式，1代表与，2代表或，暂时未用
          senderUserIDList: [], //指定消息发送的uid列表，暂时未用
          messageTypeList: [], //消息类型列表，暂时未用
          searchTimePosition: 0, //搜索的起始时间点。默认为0即代表从现在开始搜索。UTC 时间戳，单位：秒
          searchTimePeriod: 0, //从起始时间点开始的过去时间范围，单位秒。默认为0即代表不限制时间范围，传24x60x60代表过去一天。
          pageIndex: 0, //分页使用的偏移，暂时未用
          count: 0, //每页数量，暂时未用
        },
        (res) => {
          if (res.errCode === 0) {
            let data = JSON.parse(res.data);
            this.messageData.searchResultItems = data.searchResultItems || [];
          }
        }
      );
    },
    back() {
      uni.navigateBack();
    },
    editorReady(className, item) {
      uni
        .createSelectorQuery()
        .select("." + className)
        .context((res) => {
          const editorContext = res.context;
          editorContext.clear();
          editorContext.setContents({ html: item.messageItem.content });
        })
        .exec();
    },
  },
  onLoad() {},
  computed: {
    ...mapGetters(["operationID", "userID"]),
    historyMessageList() {
      const list = [];
      this.messageData.searchResultItems.map((item) => {
        item.messageList.map((i) => {
          list.push({ ...item, messageItem: i });
        });
      });
      return list;
    },
  },
};
</script>

<style lang="scss" scoped>
.search {
  min-height: 100vh;
  background: #f8f8f8;
  &-input {
    background-color: #fff;
    padding: 44rpx 44rpx 24rpx;
  }
  &-friend {
    padding: 0 44rpx 28rpx;
    background-color: #fff;
    .text {
      font-size: 24rpx;
      color: #adadad;
      margin-bottom: 12rpx;
    }
  }
  &-message {
    margin-top: 24rpx;
    background-color: #fff;
    padding: 16rpx 44rpx 32rpx;
    .text {
      font-size: 24rpx;
      color: #adadad;
      margin-bottom: 12rpx;
    }
    .historyMessageItem {
      .indexEditor {
        height: 24px;
        line-height: 24px;
        min-height: 24px;
        font-size: 26rpx;
        color: #333;
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
  }
}
</style>