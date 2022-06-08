<template>
  <view class="conversation">
    <u-navbar class="navbar" :safeAreaInsetTop="true" autoBack>
      <view class="navbar-center" slot="center">
        <view class="name">
          <view class="nickname">{{ conversationData.showName }}</view>
          <view class="userStatus" v-show="isSingleChat">手机在线</view>
        </view>
      </view>
      <view class="navbar-right" slot="right">
        <view class="right-item" v-show="isSingleChat">
          <image class="image" src="@/static/images/conversation/phone.png" />
        </view>
        <view class="right-item">
          <view class="dot">
            <text class="dot-text"></text>
            <text class="dot-text"></text>
            <text class="dot-text"></text>
          </view>
        </view>
      </view>
    </u-navbar>
    <view class="statusBar"></view>
    <view class="messageContent" @click="hideAll">
      <ConversationCard
        v-for="(item, index) in messageList"
        :key="index"
        :card="item"
        :isSingleChat="isSingleChat"
        :isGroupChat="isGroupChat"
        class="messageContent-item"
      >
        <editor
          v-if="item.contentType === 101"
          slot="msg"
          read-only
          :class="['cEditor-' + index, 'cEditor']"
          @ready="cEditorReady('cEditor-' + index, item)"
        />
      </ConversationCard>
    </view>
    <view class="sendContent">
      <view
        class="sendContent-content"
        :style="{ bottom: keyboardData.height }"
      >
        <view class="sendContent-content-top">
          <image
            class="image image1"
            src="@/static/images/conversation/voice.png"
          />
          <editor
            id="editor"
            class="sendContent-editor"
            @ready="editorReady"
            @focus="editorFocus"
            @blur="editorBlur"
            @input="editorInput"
          />
          <image
            v-show="!hasContent"
            class="image"
            src="@/static/images/conversation/other.png"
            @click="showOther = !showOther"
          />
          <!-- <image
            v-show="showOther || showEmoji"
            class="image"
            src="@/static/images/conversation/keyboard.png"
          /> -->
          <image
            v-show="!showEmoji"
            class="image"
            src="@/static/images/conversation/emoji.png"
            @click="showEmoji = !showEmoji"
          />
          <text class="send-btn" v-show="hasContent" @click="sendMessage"
            >发送</text
          >
        </view>
        <view class="sendContent-content-emoji" v-show="showEmoji">
          <u-row>
            <u-col
              span="2"
              v-for="(src, index) in emoji_list.slice(0, 6)"
              :key="index"
              justify="center"
              align="center"
              @click="insertImage(src)"
            >
              <image class="image" :src="src" />
            </u-col>
          </u-row>
          <u-row>
            <u-col
              span="2"
              v-for="(src, index) in emoji_list.slice(6, 12)"
              :key="index"
              justify="center"
              align="center"
              @click="insertImage(src)"
            >
              <image class="image" :src="src" />
            </u-col>
          </u-row>
          <u-row>
            <u-col
              span="2"
              v-for="(src, index) in emoji_list.slice(12, 16)"
              :key="index"
              justify="center"
              align="center"
              @click="insertImage(src)"
            >
              <image class="image" :src="src" />
            </u-col>
            <!-- <u-col
              span="2"
              offset="2"
              justify="center"
              align="center"
              @click="insertImage(src)"
            >
              <image class="image-del" src="@/static/images/emoji/del.png" />
            </u-col> -->
          </u-row>
        </view>
        <view class="sendContent-content-empty"></view>
      </view>
      <view
        class="sendContent-empty"
        :style="{
          height: sendContentEmptyHeight,
        }"
      ></view>
    </view>
  </view>
</template>

<script>
import ConversationCard from "@/components/ConversationCard";
import { mapGetters } from "vuex";
import emojiList from "./emojiList";
export default {
  components: { ConversationCard },
  data() {
    return {
      sessionType: "",
      sourceID: "",
      clientMsgID: "",
      getMessageOptions: {
        userID: "", //拉取单个用户之间的聊天消息
        groupID: "", //拉取群的聊天消息
        startClientMsgID: "", // 起始的消息clientMsgID，第一次拉取为""
        count: 20, //拉取消息的数量
      },
      conversationData: {
        showName: "",
      },
      messageList: [],
      sendContent: "",
      sendData: {
        html: "",
        text: "",
      },
      editorCtx: null,
      isFocus: false,
      showEmoji: false,
      showOther: false,
      keyboardData: {
        height: 0,
        minHeight: 0,
        maxHeight: 0,
        inputHeight: "54px",
      },
      defaultHtml: "",
      defaultText: "",
    };
  },
  methods: {
    init() {
      this.showEmoji = false;
      this.showOther = false;
      this.isFocus = false;
      this.$im.getOneConversation(
        this.operationID,
        this.sessionType,
        this.sourceID,
        (res) => {
          if (res.errCode !== 0) {
            this.$toast(res.errMsg);
          } else {
            const data = JSON.parse(res.data);
            this.conversationData = data;
          }
        }
      );
      this.getHistoryMessageList();
    },
    getHistoryMessageList() {
      this.$im.getHistoryMessageList(
        this.operationID,
        this.getMessageOptions,
        (res) => {
          if (res.errCode !== 0) {
            this.$toast(res.errMsg);
          } else {
            const data = JSON.parse(res.data);
            if (this.messageList.length) {
              data.map((i) => {
                const index = this.messageList.findIndex(
                  (j) => i.clientMsgID === j.clientMsgID
                );
                if (index === -1) {
                  this.messageList.push(i);
                }
              });
            } else {
              this.messageList = data;
            }
            this.resetScrollTo();
          }
        }
      );
    },
    initData() {},
    editorReady() {
      uni
        .createSelectorQuery()
        .select("#editor")
        .context((res) => {
          this.editorCtx = res.context;
          this.editorCtx.clear();
          this.editorCtx.getContents({
            success: (r) => {
              this.defaultHtml = r.html;
              this.defaultText = r.text;
              this.sendData.html = this.defaultHtml;
              this.sendData.text = this.defaultText;
            },
          });
        })
        .exec();
    },
    hideAll() {
      this.showEmoji = false;
      this.showOther = false;
      this.isFocus = false;
    },
    editorFocus() {
      this.showEmoji = false;
      this.showOther = false;
      this.isFocus = true;
    },
    editorBlur() {
      this.keyboardData.height = 0;
      this.isFocus = false;
    },
    editorInput(e) {
      this.sendData.html = e.detail.html;
      this.sendData.text = e.detail.text;
      const query = uni.createSelectorQuery().in(this);
      query
        .select(".sendContent-content-top")
        .boundingClientRect((res) => {
          this.keyboardData.inputHeight = res.height + "px";
        })
        .exec();
    },
    insertImage(src) {
      const interval = setInterval(() => {
        uni.hideKeyboard(); //隐藏软键盘
      }, 1);
      this.editorCtx.insertImage({
        src,
        width: "20px",
        height: "20px",
        complete: () => {
          clearInterval(interval);
          this.editorCtx.blur();
          this.showEmoji = true;
        },
      });
    },
    keyboardHeightChange(res) {
      if (res.height) {
        setTimeout(() => {
          const query = uni.createSelectorQuery().in(this);
          query
            .select(".sendContent-content")
            .boundingClientRect((contentData) => {
              const contentHeight = parseInt(contentData.height);
              if (
                (contentHeight > 200 && this.keyboardData.maxHeight === 0) ||
                (contentHeight >= this.keyboardData.maxHeight &&
                  this.keyboardData.maxHeight !== 0)
              ) {
                this.keyboardData.maxHeight = contentHeight;
                this.keyboardData.height = res.height - 100 + "px";
              } else if (
                (contentHeight < 200 && this.keyboardData.minHeight === 0) ||
                (contentHeight >= this.keyboardData.minHeight &&
                  contentHeight < this.keyboardData.maxHeight)
              ) {
                this.keyboardData.minHeight = contentHeight;
                this.keyboardData.height = "8px";
              }
            })
            .exec();
        }, 0);
      } else {
        this.keyboardData.height = 0;
      }
    },
    sendMessage() {
      const message = this.$im.createTextMessage(
        this.operationID,
        this.sendData.html
      );
      this.$im.sendMessage(
        this.operationID,
        message,
        this.getMessageOptions.userID,
        this.getMessageOptions.groupID,
        {
          title: "你有一条新消息",
          desc: "",
          ex: "",
          iOSPushSound: "+1",
          iOSBadgeCount: true,
        }
      );
      this.editorCtx.clear();
      this.resetScrollTo();
    },
    cEditorReady(className, item) {
      uni
        .createSelectorQuery()
        .select("." + className)
        .context((res) => {
          const editorContext = res.context;
          editorContext.clear();
          editorContext.blur();
          editorContext.setContents({ html: item.content });
        })
        .exec();
    },
    resetScrollTo() {
      this.$nextTick(() => {
        setTimeout(() => {
          uni
            .createSelectorQuery()
            .select(".conversation")
            .boundingClientRect((res) => {
              uni.pageScrollTo({
                scrollTop: res.height,
                duration: 0,
              });
            })
            .exec();
        }, 1000);
      });
    },
  },
  onLoad(param) {
    this.sessionType = param.sessionType;
    this.sourceID = param.sourceID;
    this.clientMsgID = param.clientMsgID;
    this.getMessageOptions.userID =
      this.sessionType === "1" ? param.sourceID : ""; //单聊
    this.getMessageOptions.groupID =
      this.sessionType === "2" ? param.sourceID : ""; //群聊
    // #ifdef APP-PLUS
    uni.onKeyboardHeightChange(this.keyboardHeightChange);
    this.init();
    // #endif
    // #ifdef H5
    this.initData();
    // #endif
  },
  onUnload() {
    // #ifdef APP-PLUS
    uni.offKeyboardHeightChange(this.keyboardHeightChange);
    // #endif
  },
  computed: {
    ...mapGetters(["operationID", "successTimes", "newMessageTimes"]),
    hasContent() {
      return (
        this.sendData.text !== this.defaultText ||
        this.sendData.html !== this.defaultHtml
      );
    },
    emoji_list() {
      return emojiList;
    },
    sendContentEmptyHeight() {
      const inputHeight = parseInt(this.keyboardData.inputHeight);
      const emojiHeight = this.showEmoji ? 222 : 0;
      return inputHeight + emojiHeight + "px";
    },
    isSingleChat() {
      return this.sessionType === "1";
    },
    isGroupChat() {
      return this.sessionType === "2";
    },
  },
  watch: {
    successTimes(n) {
      console.log(n);
      this.init();
    },
    newMessageTimes() {
      this.init();
    },
    showEmoji(n) {
      if (n) {
        this.resetScrollTo();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.conversation {
  .navbar {
    &-center {
      text-align: center;
      .name {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .nickname {
          font-size: 36rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .userStatus {
          font-size: 20rpx;
          color: #999999;
          padding-left: 20rpx;
          position: relative;
          white-space: nowrap;
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
      .right-item {
        .image {
          width: 46rpx;
          height: 46rpx;
          margin-right: 46rpx;
        }
        .dot {
          height: 100%;
          width: 52rpx;
          display: flex;
          align-items: center;
          justify-content: space-between;
          &-text {
            border-radius: 50%;
            width: 10rpx;
            height: 10rpx;
            background: #000000;
          }
        }
      }
    }
  }
  .messageContent {
    padding-top: 54px;
    &-item {
      .cEditor {
        height: auto;
        min-height: 46rpx;
        line-height: 46rpx;
        word-break: break-all;
        /deep/ img {
          width: 20px;
          height: 20px;
        }
      }
    }
  }
  .sendContent {
    width: 100%;
    &-content {
      width: 100%;
      position: fixed;
      left: 0;
      z-index: 99;
      &-top {
        background-color: #e8f2ff;
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
        padding: 18rpx 0;
        min-height: 49px;
        box-sizing: border-box;
        .image {
          width: 52rpx;
          height: 52rpx;
          margin-right: 20rpx;
        }
        .image1 {
          margin-left: 20rpx;
        }
        .sendContent-editor {
          flex: 1;
          background-color: #fff;
          min-height: 31px;
          height: auto;
          margin-right: 20rpx;
          padding-top: 5px;
          padding-left: 4px;
          padding-right: 4px;
        }
        .send-btn {
          padding: 0 12rpx;
          height: 52rpx;
          line-height: 52rpx;
          background: #1b72ec;
          border-radius: 8rpx;
          font-size: 28rpx;
          font-weight: 500;
          color: #ffffff;
          margin-right: 20rpx;
        }
      }
      &-emoji {
        margin-bottom: 44rpx;
        background-color: #fff;
        height: 202px;
        .image {
          width: 64rpx;
          height: 64rpx;
          margin-top: 44rpx;
          margin-bottom: 12rpx;
          &-del {
            margin-top: 22rpx;
            width: 36rpx;
            height: 32rpx;
          }
        }
      }
      &-empty {
      }
    }
  }
}
</style>