<template>
  <view class="conversation" @click="pageClick">
    <u-navbar class="navbar" autoBack fixed placeholder>
      <view class="navbar-center" slot="center">
        <view class="name">
          <view class="nickname">{{ conversationData_showName }}</view>
          <!-- <view class="userStatus" v-show="isSingleChat">手机在线</view> -->
        </view>
      </view>
      <view class="navbar-right" slot="right">
        <view class="right-item" v-show="isSingleChat">
          <image class="image" src="@/static/images/conversation/phone.png" />
        </view>
        <view class="right-item" v-show="!conversationData.isNotInGroup">
          <view class="dot" @click.stop="toInfo">
            <text class="dot-text"></text>
            <text class="dot-text"></text>
            <text class="dot-text"></text>
          </view>
        </view>
      </view>
    </u-navbar>
    <scroll-view
      class="scrollView"
      :style="scrollStyle"
      scroll-y
      refresher-enabled
      scroll-anchoring
      refresher-default-style="none"
      :scroll-into-view="scrollViewData.scrollIntoView"
      :refresher-triggered="scrollViewData.triggered"
      :refresher-threshold="60"
      :lower-threshold="0"
      @scroll="onScroll"
      @refresherrefresh="refresherrefresh"
      @scrolltolower="scrolltolower"
    >
      <view class="messageContent" @click.stop="hideAll">
        <view class="loadMore">
          <u-loadmore
            :status="scrollViewData.loadmore.status"
            :loading-text="scrollViewData.loadmore.loadingText"
            :loadmore-text="scrollViewData.loadmore.loadmoreText"
            :nomore-text="scrollViewData.loadmore.nomoreText"
          />
        </view>
        <view class="messageContent-empty"></view>
        <u-checkbox-group
          v-model="multipleData.selectedList"
          placement="column"
        >
          <ConversationCard
            :id="'viewId-' + item.clientMsgID"
            class="messageContent-item"
            v-for="item in localMessageList"
            :key="item.clientMsgID"
            :card="item"
            :isSingleChat="isSingleChat"
            :isGroupChat="isGroupChat"
            :hideAllToolTimes="hideAllToolTimes"
            :checkboxShow="multipleData.show"
            :sourceID="sourceID"
            :friendInfo="friendInfo"
            @addHideAllToolTimes="addHideAllToolTimes"
            @delMessageItem="delMessageItem"
            @setQuoteMessage="setQuoteMessage"
            @revoke="revoke"
            @doCheck="doCheck"
            @conversationCardItemClick="conversationCardItemClick"
            @createAtMessage="createAtMessage"
            @showBigPhoto="showBigPhoto"
            @showVideoPop="showVideoPop"
          >
            <u-checkbox
              slot="checkbox"
              v-show="multipleData.show"
              :name="item.clientMsgID"
              shape="circle"
            />
          </ConversationCard>
        </u-checkbox-group>
        <view id="messageContent-bottom"></view>
      </view>
    </scroll-view>
    <view class="sendContent">
      <view class="sendContent-content">
        <view :class="['sendContent-content-top']" v-show="!multipleData.show">
          <view class="sendContent-content-top-disabled" v-show="isMute">
            <text class="text">禁言中</text>
          </view>
          <view class="sendContent-content-top-disabled" v-show="isBlackUser">
            <text class="text">对方已被拉入黑名单</text>
          </view>
          <image
            v-show="!isSound"
            @click.stop="showSoundBtn"
            class="image image1"
            src="@/static/images/conversation/voice.png"
          />
          <image
            v-show="isSound"
            @click.stop="showEditerInput"
            class="image image1"
            src="@/static/images/conversation/keyboard.png"
          />
          <view class="sendContent-editor" v-show="!isSound">
            <DisbaledKeyboard
              class="DisbaledKeyboard"
              ref="DisbaledKeyboard"
              @ready="editorReady"
              @focus="editorFocus"
              @blur="editorBlur"
              @input="editorInput"
            />
            <view class="reply" v-show="isReply">
              <MessageItem
                class="reply-editor"
                :list="replyMessageList"
                fontSize="24rpx"
              />
              <u-icon
                class="reply-icon"
                name="close"
                size="12"
                color="#fff"
                @click="sendData.quoteMessage = null"
              />
            </view>
          </view>
          <view
            class="sendContent-soundBtn"
            v-show="isSound"
            @touchstart="soundBtnTouchStart"
            @touchmove="soundBtnTouchMove"
            @touchend="soundBtnTouchEnd"
            >按住说话</view
          >
          <image
            v-show="!hasContent"
            class="image"
            src="@/static/images/conversation/other.png"
            @click.stop="changeShowOther"
          />
          <image
            v-show="!showEmoji || this.scrollViewData.keyboardHeight"
            class="image"
            src="@/static/images/conversation/emoji.png"
            @click.stop="changeShowEmoji"
          />
          <text
            class="send-btn"
            v-show="hasContent"
            @click.stop="createSendMessage"
          >
            发送
          </text>
        </view>
        <view class="sendContent-content-emoji" v-show="showEmoji">
          <u-row>
            <u-col
              span="2"
              v-for="(item, index) in emoji_list.slice(0, 6)"
              :key="index"
              justify="center"
              align="center"
              @click="insertImage(item.src, item.context)"
            >
              <image class="image" :src="item.src" />
            </u-col>
          </u-row>
          <u-row>
            <u-col
              span="2"
              v-for="(item, index) in emoji_list.slice(6, 12)"
              :key="index"
              justify="center"
              align="center"
              @click="insertImage(item.src, item.context)"
            >
              <image class="image" :src="item.src" />
            </u-col>
          </u-row>
          <u-row>
            <u-col
              span="2"
              v-for="(item, index) in emoji_list.slice(12, 16)"
              :key="index"
              justify="center"
              align="center"
              @click="insertImage(item.src, item.context)"
            >
              <image class="image" :src="item.src" />
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
        <view class="sendContent-content-file" v-show="showOther">
          <view
            class="sendContent-content-file-item"
            v-for="item in fileType_list"
            :key="item.type"
            @click.stop="otherFileClick(item.type)"
          >
            <image class="fileImage" :src="item.src" />
            <text class="fileText">{{ item.text }}</text>
          </view>
        </view>
        <view class="sendContent-content-multiple" v-show="multipleData.show">
          <u-button
            class="button"
            type="primary"
            plain
            text="取消"
            @click="multipleData.show = false"
          />
          <u-button
            class="button"
            type="primary"
            text="确认"
            :disabled="multipleData.selectedList.length <= 0"
            @click="multipleData.actionShow = true"
          />
        </view>
      </view>
    </view>
    <u-action-sheet
      :actions="multipleData.actionList"
      :show="multipleData.actionShow"
      round="16"
      cancelText="取消"
      @select="multipleSelect"
      @close="multipleClose"
    />
    <u-action-sheet
      :actions="fileImageData.actionList"
      :show="fileImageData.actionShow"
      round="16"
      cancelText="取消"
      @select="confirmChooseAlbum"
      @close="fileImageData.actionShow = false"
    />
    <u-action-sheet
      :actions="fileVideoData.actionList"
      :show="fileVideoData.actionShow"
      round="16"
      cancelText="取消"
      @select="confirmChooseCamera"
      @close="fileVideoData.actionShow = false"
    />
    <view class="canvas-container">
      <text class="canvas-container-name">
        {{ atCanvasData.senderNickname }}
      </text>
      <canvas
        v-if="atCanvasData.show"
        :style="atCanvasData.style"
        canvas-id="atCanvas"
        id="atCanvas"
      ></canvas>
    </view>
    <BigPhoto ref="BigPhoto" />
    <VideoPop ref="VideoPop" />
    <SoundPop ref="SoundPop" @createSoundMessage="createSoundMessage" />
    <ReaeeVideoCoverExtractor
      :path="fileVideoData.path"
      @success="videoCoverSuccess"
      @error="videoCoverFail"
    />
  </view>
</template>
<script>
import ConversationCard from "@/components/ConversationCard";
import DisbaledKeyboard from "@/components/DisbaledKeyboard";
import BigPhoto from "@/components/BigPhoto";
import VideoPop from "@/components/VideoPop";
import SoundPop from "@/components/SoundPop";
//视频封面图
import ReaeeVideoCoverExtractor from "@/components/reaee-video-cover-extractor/reaee-video-cover-extractor";
import { mapGetters } from "vuex";
import { faceArr, fileArr } from "./emojiList";
import {
  formatConversationCardMessage,
  formatSendContent,
  getEmojiContent,
} from "@/utils/formatMessage";
import { transformContent } from "@/utils";
import MessageItem from "@/components/MessageItem.vue";
//#ifdef APP-PLUS
const AfDocument = uni.requireNativePlugin("Aq-ChooseFile");
//#endif
export default {
  components: {
    ConversationCard,
    BigPhoto,
    VideoPop,
    SoundPop,
    ReaeeVideoCoverExtractor,
    DisbaledKeyboard,
    MessageItem,
  },
  data() {
    return {
      sessionType: "",
      sourceID: "",
      clientMsgID: "",
      scrollViewData: {
        loadTime: 0,
        style: {},
        timer: null,
        triggered: false,
        isFreshing: false,
        scrollIntoView: "",
        sendContentTopHeight: 0,
        loadmore: {
          status: "loadmore", //loading,nomore
          loadingText: "加载中...",
          loadmoreText: "加载更多",
          nomoreText: "没有更多了",
        },
        keyboardHeight: 0,
        canChangeKeyboardHeight: true,
        keyboardTimer: null,
        is2Tower: true, //是否在底部
        scrollTop: 0,
        scrollHeight: 0,
      },
      conversationData: {
        conversationID: "group_8f1f2680ccd152762d5fa9c86c063d4c",
        conversationType: 2,
        userID: "17396220460",
        groupID: "8f1f2680ccd152762d5fa9c86c063d4c",
        showName: " ",
        faceURL: "",
        recvMsgOpt: 0,
        unreadCount: 2,
        groupAtType: 0,
        latestMsg:
          '{"clientMsgID":"64e94fb7791f5a55b92483f8c276c548","serverMsgID":"cf8d30e288844b0e86f95f2b8dbe835b","createTime":1654573113449,"sendTime":1654573113449,"sessionType":2,"sendID":"12300000000","recvID":"17396220460","msgFrom":0,"contentType":1502,"platformID":0,"groupID":"8f1f2680ccd152762d5fa9c86c063d4c","content":"{\\"detail\\":\\"CqYBCiA4ZjFmMjY4MGNjZDE1Mjc2MmQ1ZmE5Yzg2YzA2M2Q0YxILMTIzMDAwMDAwMDAYAiCrkPuUBioGaGloaWhpMlZodHRwczovL3N0b3JhZ2UucmVudHNvZnQuY24vb3BlbmltLzE2NTI0MzQzNTkzOTEwNzUzMDYtMTk3NTI2ODAyNDQ1NTk2NDQ2NWN2ZV9ub3RpLnBuZzgBSgsxMjMwMDAwMDAwMBpSCiA4ZjFmMjY4MGNjZDE1Mjc2MmQ1ZmE5Yzg2YzA2M2Q0YxoM5rWL6K+V5YWs5ZGKMgsxMjMwMDAwMDAwMDirkPuUBkACWgsxMjMwMDAwMDAwMA==\\",\\"defaultTips\\":\\"hihihi modified the group profile\\",\\"jsonDetail\\":\\"{\\\\\\"opUser\\\\\\":{\\\\\\"groupID\\\\\\":\\\\\\"8f1f2680ccd152762d5fa9c86c063d4c\\\\\\",\\\\\\"userID\\\\\\":\\\\\\"12300000000\\\\\\",\\\\\\"roleLevel\\\\\\":2,\\\\\\"joinTime\\\\\\":1654573099,\\\\\\"nickname\\\\\\":\\\\\\"hihihi\\\\\\",\\\\\\"faceURL\\\\\\":\\\\\\"https://storage.rentsoft.cn/openim/1652434359391075306-1975268024455964465cve_noti.png\\\\\\",\\\\\\"appMangerLevel\\\\\\":1,\\\\\\"operatorUserID\\\\\\":\\\\\\"12300000000\\\\\\"},\\\\\\"group\\\\\\":{\\\\\\"groupID\\\\\\":\\\\\\"8f1f2680ccd152762d5fa9c86c063d4c\\\\\\",\\\\\\"notification\\\\\\":\\\\\\"测试公告\\\\\\",\\\\\\"ownerUserID\\\\\\":\\\\\\"12300000000\\\\\\",\\\\\\"createTime\\\\\\":1654573099,\\\\\\"memberCount\\\\\\":2,\\\\\\"creatorUserID\\\\\\":\\\\\\"12300000000\\\\\\"}}\\"}","seq":191,"isRead":false,"status":2,"offlinePush":{},"pictureElem":{"sourcePicture":{"size":0,"width":0,"height":0},"bigPicture":{"size":0,"width":0,"height":0},"snapshotPicture":{"size":0,"width":0,"height":0}},"soundElem":{"dataSize":0,"duration":0},"videoElem":{"videoSize":0,"duration":0,"snapshotSize":0,"snapshotWidth":0,"snapshotHeight":0},"fileElem":{"fileSize":0},"mergeElem":{},"atElem":{"isAtSelf":false},"faceElem":{"index":0},"locationElem":{"longitude":0,"latitude":0},"customElem":{},"quoteElem":{},"notificationElem":{"detail":"{\\"opUser\\":{\\"groupID\\":\\"8f1f2680ccd152762d5fa9c86c063d4c\\",\\"userID\\":\\"12300000000\\",\\"roleLevel\\":2,\\"joinTime\\":1654573099,\\"nickname\\":\\"hihihi\\",\\"faceURL\\":\\"https://storage.rentsoft.cn/openim/1652434359391075306-1975268024455964465cve_noti.png\\",\\"appMangerLevel\\":1,\\"operatorUserID\\":\\"12300000000\\"},\\"group\\":{\\"groupID\\":\\"8f1f2680ccd152762d5fa9c86c063d4c\\",\\"notification\\":\\"测试公告\\",\\"ownerUserID\\":\\"12300000000\\",\\"createTime\\":1654573099,\\"memberCount\\":2,\\"creatorUserID\\":\\"12300000000\\"}}","defaultTips":"hihihi modified the group profile"},"attachedInfoElem":{"groupHasReadInfo":{"hasReadCount":0,"groupMemberCount":0},"isPrivateChat":false,"hasReadTime":0}}',
        latestMsgSendTime: 1654573113449,
        draftText: "",
        draftTextTime: 0,
        isPinned: false,
        isPrivateChat: false,
        isNotInGroup: false,
        attachedInfo: "",
        ex: "",
      },
      friendInfo: null,
      sendContent: "",
      sendData: {
        html: "",
        text: "",
        quoteContent: "",
        quoteMessage: null,
        messageType: "text",
        messageContent: null,
      },
      editorCtx: null,
      showEmoji: false,
      showOther: false,
      isInsertImage: false, //是否正在执行插入图片
      isSound: false,
      defaultHtml: "",
      defaultText: "",
      hideAllToolTimes: 0,
      timer: null,
      multipleData: {
        show: false,
        selectedList: [],
        actionShow: false,
        actionList: [
          {
            name: "删除",
            color: "#000",
            fontSize: "16",
            index: "0",
          },
          {
            name: "合并转发",
            color: "#000",
            fontSize: "16",
            index: "1",
          },
        ],
      },
      atCanvasData: {
        sendID: "",
        senderNickname: "senderNickname",
        show: false,
        style: { height: "20px", width: "0" },
      },
      groupCurrentUserInfo: {
        groupID: "59ee812e81a02c7446851c6a95626c3b",
        userID: "123",
        nickname: "1223",
        faceURL: "ic_avatar_02",
        roleLevel: 1,
        joinTime: 1655135855,
        joinSource: 0,
        muteEndTime: 0,
        operatorUserID: "17726420827",
        ex: "",
        attachedInfo: "",
      },
      muteData: {
        timer: null,
      },
      show: false,
      fileImageData: {
        actionShow: false,
        actionList: [
          {
            name: "图片",
            color: "#000",
            fontSize: "16",
            type: "image",
          },
          {
            name: "视频",
            color: "#000",
            fontSize: "16",
            type: "video",
          },
        ],
      },
      fileVideoData: {
        actionShow: false,
        actionList: [
          {
            name: "图片",
            color: "#000",
            fontSize: "16",
            type: "image",
          },
          {
            name: "视频",
            color: "#000",
            fontSize: "16",
            type: "video",
          },
        ],
        file: null,
        path: "",
      },
      soundData: {
        content: null,
      },
      revokeMessageData: {
        timer: null,
      },
      pageMessageData: {
        pageNo: 1,
        pageSize: 20,
      },
      getMessageOptions: {
        userID: "", //拉取单个用户之间的聊天消息
        groupID: "", //拉取群的聊天消息
        startClientMsgID: "", // 起始的消息clientMsgID，第一次拉取为""
        count: 20, //拉取消息的数量
      },
    };
  },
  methods: {
    init() {
      this.getMessageOptions.startClientMsgID = "";
      this.showEmoji = false;
      this.showOther = false;
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
            this.$store.commit("message/clear_newMessageList");
            this.$store.commit("message/clear_revokeMessageList");
            this.$store.commit(
              "message/set_conversationData",
              this.conversationData
            );
            console.log(this.conversationData);
          }
        }
      );
      this.getNormalHistoryMessageList();
      if (this.isGroupChat) {
        this.getGroupCurrentUserInfo();
      } else {
        this.getUsersInfo();
      }
    },
    getUsersInfo() {
      this.$im.getUsersInfo(
        this.operationID,
        [this.getMessageOptions.userID],
        (res) => {
          if (res.errCode === 0) {
            let list = JSON.parse(res.data);
            let item = list[0] || null;
            this.friendInfo = item;
          }
        }
      );
    },
    getNormalHistoryMessageList() {
      const fn = () => {
        const { pageNo, viewId } = this.scrollToMessage();
        this.pageMessageData.pageNo = pageNo;
        // console.log(pageNo, viewId);
        this.markMessageAsRead();
        if (viewId) {
          this.$nextTick(() => {
            this.resetScrollTo(viewId);
          });
        } else {
          this.resetScrollTo();
        }
      };
      if (!this.localMessageList.length) {
        this.$im.getHistoryMessageList(
          this.operationID,
          this.getMessageOptions,
          (res) => {
            if (res.errCode !== 0) {
              this.$toast(res.errMsg);
            } else {
              const data = JSON.parse(res.data) || [];
              if (data.length < this.getMessageOptions.count) {
                this.scrollViewData.loadmore.status = "nomore";
              }
              data.map((messageItem) => {
                this.$store.dispatch("message/push_localConversationMessage", {
                  userID: this.getMessageOptions.userID,
                  groupID: this.getMessageOptions.groupID,
                  messageItem,
                  currentUserID: this.userID,
                  im: this.$im,
                });
              });
              fn();
            }
          }
        );
      } else {
        fn();
      }
    },
    refreshNewMessageList() {
      if (this.isNearBottom) {
        this.resetScrollTo();
      }
      this.markMessageAsRead();
    },
    getMoreHistoryMessageList() {
      //下拉加载更多
      if (this.localAllMessageListLength > this.localAllMessageListShowLength) {
        setTimeout(() => {
          this.scrollViewData.triggered = false;
          this.scrollViewData.isFreshing = false;
          this.pageMessageData.pageNo++;
          this.getMessageOptions.startClientMsgID = "";
          this.scrollViewData.loadmore.status = "loadmore";
          this.markMessageAsRead();
        }, 50);
        // setTimeout(() => {
        //   this.scrollViewData.triggered = false;
        //   this.scrollViewData.isFreshing = false;
        // }, 0);
      } else {
        this.$im.getHistoryMessageList(
          this.operationID,
          this.getMessageOptions,
          (res) => {
            this.scrollViewData.loadmore.status = "loadmore";
            setTimeout(() => {
              this.scrollViewData.triggered = false;
              this.scrollViewData.isFreshing = false;
            }, 0);
            if (res.errCode !== 0) {
              this.$toast(res.errMsg);
            } else {
              this.getMessageOptions.startClientMsgID = "";
              const data = JSON.parse(res.data);
              if (data.length < this.getMessageOptions.count) {
                this.scrollViewData.loadmore.status = "nomore";
              }
              (data || []).reverse().map((messageItem) => {
                this.$store.dispatch(
                  "message/unshift_localConversationMessage",
                  {
                    userID: this.getMessageOptions.userID,
                    groupID: this.getMessageOptions.groupID,
                    messageItem,
                    currentUserID: this.userID,
                    im: this.$im,
                  }
                );
              });
              this.markMessageAsRead();
            }
          }
        );
      }
    },
    getHistoryMessageListReverse() {
      //获取最后一条消息之后的新消息
      this.$im.getHistoryMessageListReverse(
        this.operationID,
        this.getMessageOptions,
        ({ data, errCode }) => {}
      );
    },
    scrollToMessage() {
      let pageNo = 1;
      let viewId = "";
      const clientMsgID = this.clientMsgID;
      if (clientMsgID) {
        const index = this.localAllMessageList.findIndex(
          (i) => i.clientMsgID === clientMsgID
        );
        if (index >= 0) {
          let total = this.localAllMessageListLength - index;
          pageNo = Math.ceil(total / this.pageMessageData.pageSize);
          viewId = "viewId-" + clientMsgID;
        }
      }
      return { pageNo, viewId };
    },
    getGroupCurrentUserInfo() {
      this.$im.getGroupMembersInfo(
        this.operationID,
        this.sourceID,
        [this.userID],
        (response) => {
          this.groupCurrentUserInfo = JSON.parse(response.data)[0];
        }
      );
    },
    editorReady(e) {
      this.editorCtx = e.context;
      this.editorCtx.clear();
      this.editorCtx.getContents({
        success: (r) => {
          this.defaultHtml = r.html;
          this.defaultText = r.text;
          this.sendData.html = this.defaultHtml;
          this.sendData.text = this.defaultText;
        },
      });
      if (this.conversationData && this.conversationData.draftText) {
        const arr = getEmojiContent([
          {
            type: "text",
            content: this.conversationData.draftText,
            startIndex: 0,
            endIndex: this.conversationData.draftText.length - 1,
          },
        ])
          .map((i) => {
            const { content, type } = i;
            let src = "";
            if (type === "emoji") {
              const emoji =
                faceArr.filter((i) => i.context === content)[0] || null;
              if (emoji) {
                src = emoji.src;
              }
            }
            return {
              content,
              type,
              src,
            };
          })
          .filter((i) => i.type === "text" || (i.type === "emoji" && i.src));
        const DisbaledKeyboard = this.$refs.DisbaledKeyboard;
        DisbaledKeyboard.setDraftText(arr);
      }
    },
    hideAll() {
      this.showEmoji = false;
      this.showOther = false;
      this.addHideAllToolTimes();
    },
    editorFocus() {},
    editorBlur() {
      if (this.isInsertImage) {
        this.isInsertImage = false;
        return;
      }
      this.hideAll();
    },
    editorInput(e) {
      this.sendData.html = e.detail.html;
      this.sendData.text = e.detail.text;
      this.getSendContentTopHeight();
    },
    changeShowEmoji() {
      this.showOther = false;
      this.isSound = false;
      this.showEmoji = true;
    },
    changeShowOther() {
      this.showEmoji = false;
      this.isSound = false;
      this.showOther = true;
    },
    showSoundBtn() {
      this.showEmoji = false;
      this.showOther = false;
      this.isSound = true;
      this.getSendContentTopHeight();
    },
    showEditerInput() {
      this.showEmoji = false;
      this.showOther = false;
      this.isSound = false;
      this.getSendContentTopHeight();
    },
    insertImage(src, context) {
      this.isInsertImage = true;
      const DisbaledKeyboard = this.$refs.DisbaledKeyboard;
      DisbaledKeyboard.insertImage(src, "20px", "20px", { emojiText: context });
    },
    setQuoteMessage(m) {
      this.sendData.quoteMessage = m;
      let content = formatConversationCardMessage(this.sendData.quoteMessage);
      this.sendData.quoteContent = `回复${this.sendData.quoteMessage.senderNickname}：${content}`;
    },
    createSendMessage() {
      let { content, atUserList } = formatSendContent(this.sendData.html);
      if (atUserList.length) {
        this.sendData.messageContent = this.$im.createTextAtMessage(
          this.operationID,
          content,
          atUserList
        );
      } else if (this.sendData.quoteMessage) {
        this.sendData.messageContent = this.$im.createQuoteMessage(
          this.operationID,
          content,
          this.sendData.quoteMessage
        );
      } else {
        this.sendData.messageContent = this.$im.createTextMessage(
          this.operationID,
          content
        );
      }
      // #ifdef APP-PLUS
      this.sendMessage();
      // #endif
      this.editorCtx.clear();
    },
    clearSendMessage() {
      this.sendData.quoteMessage = null;
      this.sendData.messageContent = null;
      this.sendData.messageType = "text";
    },
    makeEditorContent(list, index, editorContext, messageItem) {
      const item = list[index] || null;
      if (!item) return;
      if (item.type === "canvas") {
        this.atCanvasData.senderNickname = item.content;
        const query = uni.createSelectorQuery().in(this);
        this.$nextTick(() => {
          query
            .select(".canvas-container-name")
            .boundingClientRect((style) => {
              let width = parseInt(style.width);
              this.atCanvasData.style.width = width + "px";
              this.atCanvasData.show = true;
              this.$nextTick(() => {
                const ctx = uni.createCanvasContext("atCanvas");
                const fontSize = 16;
                ctx.setFontSize(fontSize); //设置字体大小
                ctx.setFillStyle("#3e44ff"); //文字颜色
                let text = this.atCanvasData.senderNickname;
                if (width >= 240) {
                  text = transformContent(
                    ctx,
                    this.atCanvasData.senderNickname,
                    width
                  )[0];
                }
                ctx.fillText(text, 0, 16);
                ctx.draw();
                uni.canvasToTempFilePath({
                  canvasId: "atCanvas",
                  success: (res) => {
                    this.doHideKeyboard(true);
                    this.isInsertImage = true;
                    editorContext.insertImage({
                      src: res.tempFilePath,
                      width: this.atCanvasData.style.width,
                      height: "20px",
                      extClass: "at-img",
                      data: {
                        sendID: item.userID,
                        senderNickname: item.nickname,
                      },
                      complete: () => {
                        this.doHideKeyboard();
                        if (list[index + 1]) {
                          this.makeEditorContent(
                            list,
                            index + 1,
                            editorContext,
                            messageItem
                          );
                        } else {
                          messageItem.readOnly = true;
                        }
                      },
                    });
                  },
                });
              });
            })
            .exec();
        });
      } else if (item.type === "text") {
        this.doHideKeyboard(true);
        editorContext.insertText({
          text: item.content,
          complete: () => {
            editorContext.blur();
            this.doHideKeyboard();
            if (list[index + 1]) {
              this.makeEditorContent(
                list,
                index + 1,
                editorContext,
                messageItem
              );
            } else {
              messageItem.readOnly = true;
            }
          },
        });
      }
    },
    resetScrollTo(id = "messageContent-bottom") {
      this.scrollViewData.scrollIntoView = "";
      this.$nextTick(() => {
        setTimeout(() => {
          this.scrollViewData.scrollIntoView = id;
        }, 50);
      });
    },
    markMessageAsRead() {
      if (this.isSingleChat) {
        this.$im.markC2CMessageAsRead(
          this.operationID,
          this.conversationData.userID,
          [],
          (r) => {
            // console.log(r);
            this.$store.commit("message/set_indexMessageTimes");
          }
        );
      } else if (this.isGroupChat) {
        this.$im.markGroupMessageAsRead(
          this.operationID,
          this.conversationData.groupID,
          [],
          (r) => {
            // console.log(r);
            this.$store.commit("message/set_indexMessageTimes");
          }
        );
      }
    },
    toInfo() {
      if (this.isSingleChat) {
        uni.navigateTo({
          url: "./userSetting?userID=" + this.conversationData.userID,
        });
      }
      if (this.isGroupChat) {
        uni.navigateTo({
          url:
            "/pages/group/info?id=" +
            this.conversationData.groupID +
            "&isInGroup=1",
        });
      }
    },
    pageClick() {
      this.addHideAllToolTimes();
    },
    addHideAllToolTimes() {
      this.hideAllToolTimes++;
    },
    delMessageItem(messageItem) {
      this.$store.commit("message/del_localConversationMessage", {
        groupID: this.getMessageOptions.groupID,
        userID: this.getMessageOptions.userID,
        messageItem,
        currentUserID: this.userID,
      });
    },
    revoke(m) {
      //撤回消息
      this.$im.revokeMessage(this.operationID, m, (res) => {
        if (res.errCode === 0) {
          this.delMessageItem(m);
          this.$store.commit("message/set_successTimes");
        }
      });
    },
    recvRevokeMessage() {
      if (this.revokeMessageInPage.length > 0) {
        const list = [...this.revokeMessageInPage];
        list.map((clientMsgID) => {
          this.$store.commit("message/del_revokeMessageList", clientMsgID);
          this.$store.commit("message/del_localConversationMessage", {
            groupID: this.getMessageOptions.groupID,
            userID: this.getMessageOptions.userID,
            messageItem: { clientMsgID },
            currentUserID: this.userID,
          });
        });
      }
    },
    doCheck() {
      this.hideAll();
      this.editorCtx.blur();
      this.multipleData.selectedList = [];
      this.multipleData.show = true;
      this.addHideAllToolTimes();
      //多选消息
    },
    conversationCardItemClick(item) {
      const { clientMsgID } = item;
      const index = this.multipleData.selectedList.findIndex(
        (cID) => cID === clientMsgID
      );
      if (index === -1) {
        this.multipleData.selectedList.push(clientMsgID);
      } else {
        this.multipleData.selectedList.splice(index, 1);
      }
    },
    multipleSelect({ index }) {
      const messageList3 = this.localMessageList.filter((i) => {
        return this.multipleData.selectedList.includes(i.clientMsgID);
      });
      if (index === "0") {
        //删除
        messageList3.map((messageItem) => {
          this.$im.deleteMessageFromLocalStorage(
            this.operationID,
            messageItem,
            (res) => {
              if (res.errCode === 0) {
                this.delMessageItem(messageItem.clientMsgID);
              }
            }
          );
        });
      } else if (index === "1") {
        //合并转发
        console.log(messageList3);
        const summaryList = messageList3.slice(0, 3).map((i) => {
          let senderNickname = "";
          if (i.senderNickname) {
            senderNickname = i.senderNickname + ":";
          }
          let content = formatConversationCardMessage(i);
          if (i.contentType === 114) {
            content =
              `回复${i.quoteElem.quoteMessage.senderNickname}:` + content;
          }
          return senderNickname + content;
        });
        const res = this.$im.createMergerMessage(
          this.operationID,
          messageList3,
          "聊天记录",
          summaryList
        );
        this.$store.commit("message/set_operationMessageItem", res);
        uni.navigateTo({
          url: "/pages/forward/index",
        });
      }
      this.multipleClose();
    },
    multipleClose() {
      this.multipleData.actionShow = false;
      this.multipleData.show = false;
    },
    createAtMessage(sendID, senderNickname) {
      const { atUserList } = formatSendContent(this.sendData.html);
      if (atUserList.includes(sendID)) return;
      this.atCanvasData.senderNickname = "@" + senderNickname;
      // this.atCanvasData.senderNickname =
      //   "@senderNicksenderNicksenderNicksenderNick";
      this.$nextTick(() => {
        const query = uni.createSelectorQuery().in(this);
        query
          .select(".canvas-container-name")
          .boundingClientRect((style) => {
            let width = parseInt(style.width);
            this.atCanvasData.style.width = width + "px";
            this.atCanvasData.show = true;
            this.$nextTick(() => {
              const ctx = uni.createCanvasContext("atCanvas");
              const fontSize = 16;
              ctx.setFontSize(fontSize); //设置字体大小
              ctx.setFillStyle("#3e44ff"); //文字颜色
              let text = this.atCanvasData.senderNickname;
              if (width >= 240) {
                text = transformContent(
                  ctx,
                  this.atCanvasData.senderNickname,
                  width
                )[0];
              }
              ctx.fillText(text, 0, 16);
              ctx.draw();
              this.canvasToTempFilePath(sendID, senderNickname);
            });
          })
          .exec();
      });
    },
    canvasToTempFilePath(sendID, senderNickname) {
      uni.canvasToTempFilePath({
        canvasId: "atCanvas",
        success: (res) => {
          this.isInsertImage = true;
          const DisbaledKeyboard = this.$refs.DisbaledKeyboard;
          DisbaledKeyboard.insertImage(
            res.tempFilePath,
            this.atCanvasData.style.width,
            "20px",
            { sendID, senderNickname }
          );
          // this.doHideKeyboard(true);
          // this.isInsertImage = true;
          // this.editorCtx.insertImage({
          //   src: res.tempFilePath,
          //   width: this.atCanvasData.style.width,
          //   height: "20px",
          //   data: { sendID, senderNickname },
          //   complete: () => {
          //     this.doHideKeyboard();
          //   },
          // });
        },
      });
    },
    showBigPhoto(src, bigPhotoStyle) {
      this.$refs.BigPhoto.init(src, bigPhotoStyle);
    },
    showVideoPop(videoElem) {
      this.$refs.VideoPop.init(videoElem);
    },
    refresherrefresh() {
      if (this.scrollViewData.isFreshing) return;
      this.scrollViewData.isFreshing = true;
      this.scrollViewData.triggered = true;
      if (
        this.scrollViewData.loadmore.status === "loadmore" &&
        this.localMessageList[0] &&
        this.localMessageList[0].clientMsgID
      ) {
        this.scrollViewData.loadmore.status = "loading";
        setTimeout(() => {
          this.getMessageOptions.startClientMsgID =
            this.localMessageList[0].clientMsgID;
          // #ifdef H5
          setTimeout(() => {
            this.scrollViewData.loadmore.status = "loadmore";
            this.scrollViewData.triggered = false;
            this.scrollViewData.isFreshing = false;
          }, 1000);
          // #endif
          // #ifdef APP-PLUS
          this.getMoreHistoryMessageList();
          // #endif
        }, 0);
      } else {
        setTimeout(() => {
          this.scrollViewData.triggered = false;
          this.scrollViewData.isFreshing = false;
        }, 50);
      }
    },
    otherFileClick(type) {
      switch (type) {
        case "image":
          this.fileImageData.actionShow = true;
          break;
        case "camera":
          this.fileVideoData.actionShow = true;
          break;
        case "phone":
          break;
        case "file":
          this.chooseFile();
          break;
        case "card":
          this.toShareUserCard();
          break;
        case "location":
          const userID = this.isSingleChat ? this.sourceID : "";
          const groupID = this.isGroupChat ? this.sourceID : "";
          uni.navigateTo({
            url: "./map?userID=" + userID + "&groupID=" + groupID,
          });
          break;
        case "voice":
          break;
        default:
          break;
      }
    },
    confirmChooseAlbum(item) {
      switch (item.type) {
        case "image":
          this.chooseImage("album");
          break;
        case "video":
          this.chooseVideo("album");
          break;
      }
    },
    confirmChooseCamera(item) {
      switch (item.type) {
        case "image":
          this.chooseImage("camera");
          break;
        case "video":
          this.chooseVideo("camera");
          break;
      }
    },
    chooseImage(sourceType) {
      uni.chooseImage({
        count: 9,
        sourceType: [sourceType],
        success: (r) => {
          // #ifdef APP-PLUS
          r.tempFilePaths.map((path) => {
            let imagePath = path;
            if (sourceType === "camera") {
              imagePath = this.convertLocalFileSystemURL(imagePath);
            }
            this.sendData.messageContent =
              this.$im.createImageMessageFromFullPath(
                this.operationID,
                this.formatPath(imagePath)
              );
            this.sendMessage();
          });
          // #endif
        },
        fail: (error) => {
          console.log(error);
        },
      });
    },
    chooseVideo(sourceType) {
      uni.chooseVideo({
        sourceType: [sourceType],
        maxDuration: 60,
        camera: "back",
        success: (r) => {
          let tempFilePath = r.tempFilePath;
          const duration = r.duration;
          if (sourceType === "camera") {
            tempFilePath = this.convertLocalFileSystemURL(tempFilePath);
          }
          this.fileVideoData.file = {
            tempFilePath,
            duration,
          };
          this.fileVideoData.path = tempFilePath;
        },
      });
    },
    convertLocalFileSystemURL(path) {
      //相对路径转换为绝对路径
      // #ifdef H5
      return path;
      // #endif
      // #ifdef APP-PLUS
      return plus.io.convertLocalFileSystemURL(path);
      // #endif
    },
    videoCoverSuccess(base64) {
      this.saveBase64Img(base64);
      this.fileVideoData.path = "";
    },
    saveBase64Img(base64) {
      const bitmap = new plus.nativeObj.Bitmap("test");
      bitmap.loadBase64Data(
        base64,
        () => {
          const url = "_doc/" + new Date().getTime().toString() + ".png"; // url为时间戳命名方式
          bitmap.save(
            url,
            {
              overwrite: true, // 是否覆盖
              // quality: 'quality'  // 图片清晰度
            },
            (i) => {
              uni.saveImageToPhotosAlbum({
                filePath: url,
                success: (e) => {
                  this.sendVideoMessage(e.path);
                  bitmap.clear();
                },
              });
            },
            () => {
              uni.showToast({
                title: "视频发送失败",
                icon: "none",
              });
              bitmap.clear();
            }
          );
        },
        () => {
          uni.showToast({
            title: "视频发送失败",
            icon: "none",
          });
          bitmap.clear();
        }
      );
    },
    videoCoverFail() {
      this.fileVideoData.path = "";
      uni.showToast({
        title: "视频发送失败",
        icon: "none",
      });
    },
    sendVideoMessage(snapshotPath) {
      // #ifdef APP-PLUS
      const r = this.fileVideoData.file;
      const typeArr = r.tempFilePath.split(".");
      const type = typeArr[typeArr.length - 1];
      this.sendData.messageContent = this.$im.createVideoMessageFromFullPath(
        this.operationID,
        this.formatPath(r.tempFilePath),
        type.toUpperCase(),
        r.duration,
        this.formatPath(snapshotPath)
      );
      this.sendMessage();
      // #endif
    },
    formatPath(path) {
      const pathList = path.split("file://");
      return pathList[1] || path;
    },
    chooseFile() {
      AfDocument.openMode(
        {
          size: "1", //选择总数量
          paths: ["/storage/emulated/0"], //自定义选择目录
          isDown: true, //是否下钻（true 筛选当前目录以下的所有文件，fales 只筛选当前目录文件）
          types: [
            {
              name: "文档",
              value: ["doc", "wps", "docx", "xls", "xlsx", "pdf"],
            },
          ],
        },
        (res2) => {
          res2.res.map((item) => {
            this.sendData.messageContent =
              this.$im.createFileMessageFromFullPath(
                this.operationID,
                item.path,
                item.name
              );
            this.sendMessage();
          });
        }
      );
      //H5
      // uni.chooseFile({
      //   count: 1,
      //   extension: [".doc", ".xls", ".ppt", ".pdf", ".docx", ".xlsx", ".pptx"],
      //   success: (r) => {
      //     console.log(r);
      //     r.tempFiles.map((file) => {
      //       this.sendData.messageContent = im.createFileMessageFromFullPath(
      //         this.operationID,
      //         file.path,
      //         file.name
      //       );
      //       this.sendMessageNotOss();
      //     });
      //   },
      //   fail: (error) => {
      //     console.log(error);
      //   },
      // });
    },
    sendMessage() {
      // #ifdef APP-PLUS
      this.pushMessageToStatusList();
      this.$im.sendMessage(
        this.operationID,
        this.sendData.messageContent,
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
      // #endif
      this.clearSendMessage();
    },
    sendMessageNotOss() {
      // #ifdef APP-PLUS
      this.pushMessageToStatusList("notoss");
      this.$im.sendMessageNotOss(
        this.operationID,
        this.sendData.messageContent,
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
      // #endif
      this.clearSendMessage();
    },
    pushMessageToStatusList(type = "normal") {
      const messageContent = JSON.parse(this.sendData.messageContent);
      // console.log(messageContent);
      // this.messageList.push(messageContent);
      this.$store.dispatch("message/push_localConversationMessage", {
        userID: this.getMessageOptions.userID,
        groupID: this.getMessageOptions.groupID,
        messageItem: messageContent,
        currentUserID: this.userID,
        im: this.$im,
      });
      const messageItem = {
        messageContent,
        userID: this.getMessageOptions.userID,
        groupID: this.getMessageOptions.groupID,
        desc: {
          title: "你有一条新消息",
          desc: "",
          ex: "",
          iOSPushSound: "+1",
          iOSBadgeCount: true,
        },
      };
      this.$store.commit(
        "message/set_sendMessageStatusList",
        messageItem,
        0,
        type
      );
      this.resetScrollTo();
    },
    soundBtnTouchStart() {
      this.$refs.SoundPop.start();
    },
    soundBtnTouchMove(e) {
      const item = e.touches[0];
      this.$refs.SoundPop.move(item.pageX, item.pageY);
    },
    soundBtnTouchEnd() {
      this.$refs.SoundPop.end();
    },
    createSoundMessage(filePath, duration) {
      this.sendData.messageContent = this.$im.createSoundMessageFromFullPath(
        this.operationID,
        filePath,
        duration
      );
      this.sendMessage();
    },
    toShareUserCard() {
      const groupID = this.isGroupChat ? this.sourceID : "";
      const userID = this.isSingleChat ? this.sourceID : "";
      uni.navigateTo({
        url:
          "/pages/group/memberList?groupID=" +
          groupID +
          "&userID=" +
          userID +
          "&pageStatus=shareUserCard",
      });
    },
    getSendContentTopHeight() {
      if (this.scrollViewData.timer) {
        clearTimeout(this.scrollViewData.timer);
      }
      this.scrollViewData.timer = setTimeout(() => {
        this.$nextTick(() => {
          const query = uni.createSelectorQuery().in(this);
          query
            .select(".sendContent-content-top")
            .boundingClientRect((style) => {
              this.scrollViewData.sendContentTopHeight = style.height;
            })
            .exec();
        });
      }, 50);
    },
    doHideKeyboard(isStart = false) {
      if (this.scrollViewData.keyboardTimer) {
        clearInterval(this.scrollViewData.keyboardTimer);
      }
      this.scrollViewData.canChangeKeyboardHeight = true;
      if (isStart) {
        this.scrollViewData.canChangeKeyboardHeight = false;
        this.scrollViewData.keyboardTimer = setInterval(() => {
          uni.hideKeyboard(); //隐藏软键盘
        }, 2);
      }
    },
    keyboardHeightChange(v) {
      if (this.scrollViewData.canChangeKeyboardHeight) {
        this.scrollViewData.keyboardHeight = v.height;
      }
    },
    onScroll(e) {
      this.scrollViewData.scrollTop = e.detail.scrollTop;
      this.scrollViewData.scrollHeight = e.detail.scrollHeight;
      this.scrollViewData.is2Tower = false;
    },
    scrolltolower() {
      this.scrollViewData.is2Tower = true;
    },
    setDraftText() {
      let draftText = "";
      if (this.hasContent) {
        draftText = formatSendContent(this.sendData.html).content;
      }
      this.$im.setConversationDraft(
        this.operationID,
        this.conversationData.conversationID,
        draftText,
        () => {
          this.$store.commit("message/set_indexMessageTimes");
        }
      );
    },
  },
  onReady() {
    // #ifdef H5
    // this.resetScrollTo();
    // #endif
  },
  onHide() {
    this.setDraftText();
  },
  onLoad(param) {
    this.$store.commit("message/clear_sendMessageStatusList");
    this.scrollViewData.isFreshing = false;
    this.sessionType = param.sessionType;
    this.sourceID = param.sourceID;
    this.clientMsgID = param.clientMsgID;
    this.getMessageOptions.userID =
      this.sessionType === "1" ? param.sourceID : ""; //单聊
    this.getMessageOptions.groupID =
      this.sessionType === "2" ? param.sourceID : ""; //群聊
    this.scrollViewData.sendContentTopHeight = parseInt(uni.upx2px(108));
    // #ifdef APP-PLUS
    this.init();
    // #endif
    // #ifdef H5
    // this.clientMsgID = "9895b9b504449b5cd4b30f8509ca8cea";
    // this.getNormalHistoryMessageList();
    // #endif
    uni.onKeyboardHeightChange((res) => {
      this.keyboardHeightChange(res);
    });
  },
  onUnload() {
    this.$store.commit("message/set_conversationData");
    this.$store.commit("message/clear_newMessageList");
    this.$store.commit("message/clear_revokeMessageList");
    uni.offKeyboardHeightChange(this.keyboardHeightChange);
    console.log("onUnload");
    this.setDraftText();
  },
  computed: {
    ...mapGetters([
      "operationID",
      "successTimes",
      "newMessageTimes",
      "userID",
      "infoUpdateTimes",
      "systemInfo",
      "newMessageList",
      "revokeMessageTimes",
      "revokeMessageList",
      "clearHistoryMessageTimes",
      "frinendChangeTimes",
      "frinendInfoChangeTimes",
      "localConversationMessageList",
    ]),
    localConversation() {
      const item = this.localConversationMessageList.filter(
        (i) => i.groupID === this.sourceID || i.userID === this.sourceID
      )[0] || { messageList: [] };
      return item;
    },
    localAllMessageList() {
      const list = this.localConversation.messageList;
      // console.log(list);
      // #ifdef H5
      return [
        {
          clientMsgID: "21c84a0427fd47f6a250d7cd8adde22d",
          serverMsgID: "22cf1d4a4c306631f4a433555381cb45",
          createTime: 1658304560511,
          sendTime: 1658304560530,
          sessionType: 1,
          sendID: "2911830477",
          recvID: "3138541532",
          msgFrom: 200,
          contentType: 1204,
          platformID: 0,
          content:
            '{"detail":"CiYKCjI5MTE4MzA0NzcYsPDelgYiBkiN9rmWBjIKMjkxMTgzMDQ3NxoiCgoyOTExODMwNDc3EgZoaWhpaGkaDGljX2F2YXRhcl8wNQ==","defaultTips":"We have become friends","jsonDetail":"{\\"friend\\":{\\"ownerUserID\\":\\"2911830477\\",\\"createTime\\":1658304560,\\"friendUser\\":{\\"createTime\\":1657699085},\\"operatorUserID\\":\\"2911830477\\"},\\"opUser\\":{\\"userID\\":\\"2911830477\\",\\"nickname\\":\\"hihihi\\",\\"faceURL\\":\\"ic_avatar_05\\"}}"}',
          seq: 1549,
          isRead: false,
          status: 2,
          offlinePush: {},
          pictureElem: {
            sourcePicture: {
              size: 0,
              width: 0,
              height: 0,
            },
            bigPicture: {
              size: 0,
              width: 0,
              height: 0,
            },
            snapshotPicture: {
              size: 0,
              width: 0,
              height: 0,
            },
          },
          soundElem: {
            dataSize: 0,
            duration: 0,
          },
          videoElem: {
            videoSize: 0,
            duration: 0,
            snapshotSize: 0,
            snapshotWidth: 0,
            snapshotHeight: 0,
          },
          fileElem: {
            fileSize: 0,
          },
          mergeElem: {},
          atElem: {
            isAtSelf: false,
          },
          faceElem: {
            index: 0,
          },
          locationElem: {
            longitude: 0,
            latitude: 0,
          },
          customElem: {},
          quoteElem: {},
          notificationElem: {
            detail:
              '{"friend":{"ownerUserID":"2911830477","createTime":1658304560,"friendUser":{"createTime":1657699085},"operatorUserID":"2911830477"},"opUser":{"userID":"2911830477","nickname":"hihihi","faceURL":"ic_avatar_05"}}',
            defaultTips: "We have become friends",
          },
          messageEntityElem: {},
          attachedInfoElem: {
            groupHasReadInfo: {
              hasReadCount: 0,
              groupMemberCount: 0,
            },
            isPrivateChat: false,
            hasReadTime: 0,
            notSenderNotificationPush: false,
          },
        },
        {
          clientMsgID: "dd20a4a7465725285b24a297db9feaa2",
          serverMsgID: "68e76a40288ba1354b38318bc7099bdc",
          createTime: 1658304574787,
          sendTime: 1658304575063,
          sessionType: 1,
          sendID: "3138541532",
          recvID: "2911830477",
          msgFrom: 100,
          contentType: 101,
          platformID: 2,
          senderNickname: "Jack-Chain",
          senderFaceUrl: "ic_avatar_03",
          content: "1",
          seq: 0,
          isRead: false,
          status: 2,
          offlinePush: {},
          pictureElem: {
            sourcePicture: {
              size: 0,
              width: 0,
              height: 0,
            },
            bigPicture: {
              size: 0,
              width: 0,
              height: 0,
            },
            snapshotPicture: {
              size: 0,
              width: 0,
              height: 0,
            },
          },
          soundElem: {
            dataSize: 0,
            duration: 0,
          },
          videoElem: {
            videoSize: 0,
            duration: 0,
            snapshotSize: 0,
            snapshotWidth: 0,
            snapshotHeight: 0,
          },
          fileElem: {
            fileSize: 0,
          },
          mergeElem: {},
          atElem: {
            isAtSelf: false,
          },
          faceElem: {
            index: 0,
          },
          locationElem: {
            longitude: 0,
            latitude: 0,
          },
          customElem: {},
          quoteElem: {},
          notificationElem: {},
          messageEntityElem: {},
          attachedInfoElem: {
            groupHasReadInfo: {
              hasReadCount: 0,
              groupMemberCount: 0,
            },
            isPrivateChat: false,
            hasReadTime: 0,
            notSenderNotificationPush: false,
          },
        },
        {
          clientMsgID: "07609c9426110bfd89c2f37fba36c943",
          serverMsgID: "813db01e202e623a1500026cfd5c4934",
          createTime: 1658304613785,
          sendTime: 1658304613939,
          sessionType: 1,
          sendID: "2911830477",
          recvID: "3138541532",
          msgFrom: 100,
          contentType: 101,
          platformID: 5,
          senderNickname: "hihihi",
          senderFaceUrl: "ic_avatar_05",
          content: "2",
          seq: 1553,
          isRead: false,
          status: 2,
          offlinePush: {},
          pictureElem: {
            sourcePicture: {
              size: 0,
              width: 0,
              height: 0,
            },
            bigPicture: {
              size: 0,
              width: 0,
              height: 0,
            },
            snapshotPicture: {
              size: 0,
              width: 0,
              height: 0,
            },
          },
          soundElem: {
            dataSize: 0,
            duration: 0,
          },
          videoElem: {
            videoSize: 0,
            duration: 0,
            snapshotSize: 0,
            snapshotWidth: 0,
            snapshotHeight: 0,
          },
          fileElem: {
            fileSize: 0,
          },
          mergeElem: {},
          atElem: {
            isAtSelf: false,
          },
          faceElem: {
            index: 0,
          },
          locationElem: {
            longitude: 0,
            latitude: 0,
          },
          customElem: {},
          quoteElem: {},
          notificationElem: {},
          messageEntityElem: {},
          attachedInfoElem: {
            groupHasReadInfo: {
              hasReadCount: 0,
              groupMemberCount: 0,
            },
            isPrivateChat: false,
            hasReadTime: 0,
            notSenderNotificationPush: false,
          },
        },
        {
          clientMsgID: "152f8fc72912bc5f12310f8bb8548e93",
          serverMsgID: "9c39dd019a53d8021c438aedb96a9692",
          createTime: 1658304881803,
          sendTime: 1658304882091,
          sessionType: 1,
          sendID: "3138541532",
          recvID: "2911830477",
          msgFrom: 100,
          contentType: 101,
          platformID: 2,
          senderNickname: "Jack-Chain",
          senderFaceUrl: "ic_avatar_03",
          content: "4",
          seq: 0,
          isRead: false,
          status: 2,
          offlinePush: {},
          pictureElem: {
            sourcePicture: {
              size: 0,
              width: 0,
              height: 0,
            },
            bigPicture: {
              size: 0,
              width: 0,
              height: 0,
            },
            snapshotPicture: {
              size: 0,
              width: 0,
              height: 0,
            },
          },
          soundElem: {
            dataSize: 0,
            duration: 0,
          },
          videoElem: {
            videoSize: 0,
            duration: 0,
            snapshotSize: 0,
            snapshotWidth: 0,
            snapshotHeight: 0,
          },
          fileElem: {
            fileSize: 0,
          },
          mergeElem: {},
          atElem: {
            isAtSelf: false,
          },
          faceElem: {
            index: 0,
          },
          locationElem: {
            longitude: 0,
            latitude: 0,
          },
          customElem: {},
          quoteElem: {},
          notificationElem: {},
          messageEntityElem: {},
          attachedInfoElem: {
            groupHasReadInfo: {
              hasReadCount: 0,
              groupMemberCount: 0,
            },
            isPrivateChat: false,
            hasReadTime: 0,
            notSenderNotificationPush: false,
          },
        },
        {
          clientMsgID: "9895b9b504449b5cd4b30f8509ca8cea",
          serverMsgID: "c86b354fc7b5d832daef0047c5f014b6",
          createTime: 1658305109525,
          sendTime: 1658305109611,
          sessionType: 1,
          sendID: "2911830477",
          recvID: "3138541532",
          msgFrom: 100,
          contentType: 101,
          platformID: 5,
          senderNickname: "hihihi",
          senderFaceUrl: "ic_avatar_05",
          content: "5",
          seq: 1591,
          isRead: false,
          status: 2,
          offlinePush: {},
          pictureElem: {
            sourcePicture: {
              size: 0,
              width: 0,
              height: 0,
            },
            bigPicture: {
              size: 0,
              width: 0,
              height: 0,
            },
            snapshotPicture: {
              size: 0,
              width: 0,
              height: 0,
            },
          },
          soundElem: {
            dataSize: 0,
            duration: 0,
          },
          videoElem: {
            videoSize: 0,
            duration: 0,
            snapshotSize: 0,
            snapshotWidth: 0,
            snapshotHeight: 0,
          },
          fileElem: {
            fileSize: 0,
          },
          mergeElem: {},
          atElem: {
            isAtSelf: false,
          },
          faceElem: {
            index: 0,
          },
          locationElem: {
            longitude: 0,
            latitude: 0,
          },
          customElem: {},
          quoteElem: {},
          notificationElem: {},
          messageEntityElem: {},
          attachedInfoElem: {
            groupHasReadInfo: {
              hasReadCount: 0,
              groupMemberCount: 0,
            },
            isPrivateChat: false,
            hasReadTime: 0,
            notSenderNotificationPush: false,
          },
        },
        {
          clientMsgID: "6521a9d39d2023e173edd4e097bf0eee",
          serverMsgID: "14b79142abc0975103f40b72018c52c3",
          createTime: 1658305160155,
          sendTime: 1658305160436,
          sessionType: 1,
          sendID: "3138541532",
          recvID: "2911830477",
          msgFrom: 100,
          contentType: 101,
          platformID: 2,
          senderNickname: "Jack-Chain",
          senderFaceUrl: "ic_avatar_03",
          content: "6",
          seq: 0,
          isRead: false,
          status: 2,
          offlinePush: {},
          pictureElem: {
            sourcePicture: {
              size: 0,
              width: 0,
              height: 0,
            },
            bigPicture: {
              size: 0,
              width: 0,
              height: 0,
            },
            snapshotPicture: {
              size: 0,
              width: 0,
              height: 0,
            },
          },
          soundElem: {
            dataSize: 0,
            duration: 0,
          },
          videoElem: {
            videoSize: 0,
            duration: 0,
            snapshotSize: 0,
            snapshotWidth: 0,
            snapshotHeight: 0,
          },
          fileElem: {
            fileSize: 0,
          },
          mergeElem: {},
          atElem: {
            isAtSelf: false,
          },
          faceElem: {
            index: 0,
          },
          locationElem: {
            longitude: 0,
            latitude: 0,
          },
          customElem: {},
          quoteElem: {},
          notificationElem: {},
          messageEntityElem: {},
          attachedInfoElem: {
            groupHasReadInfo: {
              hasReadCount: 0,
              groupMemberCount: 0,
            },
            isPrivateChat: false,
            hasReadTime: 0,
            notSenderNotificationPush: false,
          },
        },
        {
          clientMsgID: "ebc6724d19b516e0989309d956a06c50",
          serverMsgID: "dd7a717ed880fe6f1096289b57769c08",
          createTime: 1658305276636,
          sendTime: 1658305276917,
          sessionType: 1,
          sendID: "3138541532",
          recvID: "2911830477",
          msgFrom: 100,
          contentType: 101,
          platformID: 2,
          senderNickname: "Jack-Chain",
          senderFaceUrl: "ic_avatar_03",
          content: "7",
          seq: 0,
          isRead: false,
          status: 2,
          offlinePush: {},
          pictureElem: {
            sourcePicture: {
              size: 0,
              width: 0,
              height: 0,
            },
            bigPicture: {
              size: 0,
              width: 0,
              height: 0,
            },
            snapshotPicture: {
              size: 0,
              width: 0,
              height: 0,
            },
          },
          soundElem: {
            dataSize: 0,
            duration: 0,
          },
          videoElem: {
            videoSize: 0,
            duration: 0,
            snapshotSize: 0,
            snapshotWidth: 0,
            snapshotHeight: 0,
          },
          fileElem: {
            fileSize: 0,
          },
          mergeElem: {},
          atElem: {
            isAtSelf: false,
          },
          faceElem: {
            index: 0,
          },
          locationElem: {
            longitude: 0,
            latitude: 0,
          },
          customElem: {},
          quoteElem: {},
          notificationElem: {},
          messageEntityElem: {},
          attachedInfoElem: {
            groupHasReadInfo: {
              hasReadCount: 0,
              groupMemberCount: 0,
            },
            isPrivateChat: false,
            hasReadTime: 0,
            notSenderNotificationPush: false,
          },
        },
        {
          clientMsgID: "e4b95d1f2a8f7de37df0b98bf54c7535",
          serverMsgID: "8c01c086c3b41370a8ba653cd9f371de",
          createTime: 1658305686395,
          sendTime: 1658305686814,
          sessionType: 1,
          sendID: "3138541532",
          recvID: "2911830477",
          msgFrom: 100,
          contentType: 101,
          platformID: 2,
          senderNickname: "Jack-Chain",
          senderFaceUrl: "ic_avatar_03",
          content: "8",
          seq: 0,
          isRead: true,
          status: 2,
          offlinePush: {},
          pictureElem: {
            sourcePicture: {
              size: 0,
              width: 0,
              height: 0,
            },
            bigPicture: {
              size: 0,
              width: 0,
              height: 0,
            },
            snapshotPicture: {
              size: 0,
              width: 0,
              height: 0,
            },
          },
          soundElem: {
            dataSize: 0,
            duration: 0,
          },
          videoElem: {
            videoSize: 0,
            duration: 0,
            snapshotSize: 0,
            snapshotWidth: 0,
            snapshotHeight: 0,
          },
          fileElem: {
            fileSize: 0,
          },
          mergeElem: {},
          atElem: {
            isAtSelf: false,
          },
          faceElem: {
            index: 0,
          },
          locationElem: {
            longitude: 0,
            latitude: 0,
          },
          customElem: {},
          quoteElem: {},
          notificationElem: {},
          messageEntityElem: {},
          attachedInfoElem: {
            groupHasReadInfo: {
              hasReadCount: 0,
              groupMemberCount: 0,
            },
            isPrivateChat: false,
            hasReadTime: 0,
            notSenderNotificationPush: false,
          },
        },
        {
          clientMsgID: "9f61f3fff976023c59c1552bbd377357",
          serverMsgID: "58c400805561f01c6c5d2280d137d4fb",
          createTime: 1658307244426,
          sendTime: 1658307244725,
          sessionType: 1,
          sendID: "3138541532",
          recvID: "2911830477",
          msgFrom: 100,
          contentType: 101,
          platformID: 2,
          senderNickname: "Jack-Chain",
          senderFaceUrl: "ic_avatar_03",
          content: "[吓哭]",
          seq: 0,
          isRead: true,
          status: 2,
          offlinePush: {},
          pictureElem: {
            sourcePicture: {
              size: 0,
              width: 0,
              height: 0,
            },
            bigPicture: {
              size: 0,
              width: 0,
              height: 0,
            },
            snapshotPicture: {
              size: 0,
              width: 0,
              height: 0,
            },
          },
          soundElem: {
            dataSize: 0,
            duration: 0,
          },
          videoElem: {
            videoSize: 0,
            duration: 0,
            snapshotSize: 0,
            snapshotWidth: 0,
            snapshotHeight: 0,
          },
          fileElem: {
            fileSize: 0,
          },
          mergeElem: {},
          atElem: {
            isAtSelf: false,
          },
          faceElem: {
            index: 0,
          },
          locationElem: {
            longitude: 0,
            latitude: 0,
          },
          customElem: {},
          quoteElem: {},
          notificationElem: {},
          messageEntityElem: {},
          attachedInfoElem: {
            groupHasReadInfo: {
              hasReadCount: 0,
              groupMemberCount: 0,
            },
            isPrivateChat: false,
            hasReadTime: 0,
            notSenderNotificationPush: false,
          },
        },
        {
          clientMsgID: "0ec963d63cf73d077c962b4c1e7b8abf",
          serverMsgID: "cdce7838253912a090bcab5288f9d552",
          createTime: 1658307691529,
          sendTime: 1658307587628,
          sessionType: 1,
          sendID: "3138541532",
          recvID: "2911830477",
          msgFrom: 100,
          contentType: 109,
          platformID: 2,
          senderNickname: "Jack-Chain",
          senderFaceUrl: "ic_avatar_03",
          content:
            '{"description":"乡村基(孵化园B区店)","longitude":104.085803,"latitude":30.510904}',
          seq: 1670,
          isRead: false,
          status: 2,
          offlinePush: {},
          pictureElem: {
            sourcePicture: {
              size: 0,
              width: 0,
              height: 0,
            },
            bigPicture: {
              size: 0,
              width: 0,
              height: 0,
            },
            snapshotPicture: {
              size: 0,
              width: 0,
              height: 0,
            },
          },
          soundElem: {
            dataSize: 0,
            duration: 0,
          },
          videoElem: {
            videoSize: 0,
            duration: 0,
            snapshotSize: 0,
            snapshotWidth: 0,
            snapshotHeight: 0,
          },
          fileElem: {
            fileSize: 0,
          },
          mergeElem: {},
          atElem: {
            isAtSelf: false,
          },
          faceElem: {
            index: 0,
          },
          locationElem: {
            description: "乡村基(孵化园B区店)",
            longitude: 104.085803,
            latitude: 30.510904,
          },
          customElem: {},
          quoteElem: {},
          notificationElem: {},
          messageEntityElem: {},
          attachedInfoElem: {
            groupHasReadInfo: {
              hasReadCount: 0,
              groupMemberCount: 0,
            },
            isPrivateChat: false,
            hasReadTime: 0,
            notSenderNotificationPush: false,
          },
        },
        {
          clientMsgID: "c0093369fc51fca4727d64dc899fd1c3",
          serverMsgID: "b8aa226f51aa65ca3e162550b5254bf9",
          createTime: 1658307829532,
          sendTime: 1658307726449,
          sessionType: 1,
          sendID: "3138541532",
          recvID: "2911830477",
          msgFrom: 100,
          contentType: 102,
          platformID: 2,
          senderNickname: "Jack-Chain",
          senderFaceUrl: "ic_avatar_03",
          content:
            '{"sourcePath":"/storage/emulated/0/Android/data/com.openIm.app/apps/__UNI__EC966F0/doc/uniapp_temp/compressed/1658307829353_1658234418918.jpg","sourcePicture":{"uuid":"1658307829945248077-702731134813084759.jpg","type":"image/jpeg","size":69617,"width":744,"height":1080,"url":"https://storage-online.rentsoft.cn/openim/1658307829945248077-702731134813084759.jpg"},"bigPicture":{"size":0,"width":0,"height":0},"snapshotPicture":{"size":0,"width":200,"height":200,"url":"https://storage-online.rentsoft.cn/openim/1658307829945248077-702731134813084759.jpg?imageView2/2/w/200/h/200"}}',
          seq: 1673,
          isRead: false,
          status: 2,
          offlinePush: {},
          pictureElem: {
            sourcePath:
              "/storage/emulated/0/Android/data/com.openIm.app/apps/__UNI__EC966F0/doc/uniapp_temp/compressed/1658307829353_1658234418918.jpg",
            sourcePicture: {
              uuid: "1658307829945248077-702731134813084759.jpg",
              type: "image/jpeg",
              size: 69617,
              width: 744,
              height: 1080,
              url: "https://storage-online.rentsoft.cn/openim/1658307829945248077-702731134813084759.jpg",
            },
            bigPicture: {
              size: 0,
              width: 0,
              height: 0,
            },
            snapshotPicture: {
              size: 0,
              width: 200,
              height: 200,
              url: "https://storage-online.rentsoft.cn/openim/1658307829945248077-702731134813084759.jpg?imageView2/2/w/200/h/200",
            },
          },
          soundElem: {
            dataSize: 0,
            duration: 0,
          },
          videoElem: {
            videoSize: 0,
            duration: 0,
            snapshotSize: 0,
            snapshotWidth: 0,
            snapshotHeight: 0,
          },
          fileElem: {
            fileSize: 0,
          },
          mergeElem: {},
          atElem: {
            isAtSelf: false,
          },
          faceElem: {
            index: 0,
          },
          locationElem: {
            longitude: 0,
            latitude: 0,
          },
          customElem: {},
          quoteElem: {},
          notificationElem: {},
          messageEntityElem: {},
          attachedInfoElem: {
            groupHasReadInfo: {
              hasReadCount: 0,
              groupMemberCount: 0,
            },
            isPrivateChat: false,
            hasReadTime: 0,
            notSenderNotificationPush: false,
          },
        },
      ];
      // #endif
      return list;
    },
    localAllMessageListLength() {
      return this.localAllMessageList.length;
    },
    localAllMessageListShowLength() {
      return this.pageMessageData.pageNo * this.pageMessageData.pageSize;
    },
    localMessageList() {
      let index =
        this.localAllMessageListLength - this.localAllMessageListShowLength;
      index = index < 0 ? 0 : index;
      return this.localAllMessageList.slice(
        index,
        this.localAllMessageListLength
      );
    },
    revokeMessageInPage() {
      return this.revokeMessageList.filter((clientMsgID) => {
        return (
          this.localMessageList.filter((i) => i.clientMsgID === clientMsgID)
            .length > 0
        );
      });
    },
    isNearBottom() {
      const max = 100;
      return (
        this.scrollViewData.scrollHeight -
          this.scrollViewData.scrollTop -
          this.scrollStyle.scrollHeight <=
        max
      );
    },
    getUsersInfoTimes() {
      return this.frinendChangeTimes + this.frinendInfoChangeTimes;
    },
    hasContent() {
      return (
        this.sendData.text !== this.defaultText ||
        this.sendData.html !== this.defaultHtml
      );
    },
    emoji_list() {
      return faceArr;
    },
    fileType_list() {
      return fileArr;
    },
    isSingleChat() {
      return this.sessionType === "1";
    },
    isGroupChat() {
      return this.sessionType === "2";
    },
    isReply() {
      return this.sendData.quoteMessage !== null;
    },
    replyMessageList() {
      let list = [];
      if (this.isReply) {
        const content = this.sendData.quoteContent || "";
        const item = {
          type: "text",
          content,
          startIndex: 0,
          endIndex: content.length - 1,
        };
        list = getEmojiContent([item]);
      }
      return list;
    },
    isMute() {
      return (
        this.isGroupChat &&
        this.groupCurrentUserInfo &&
        this.groupCurrentUserInfo.muteEndTime !== 0
      );
    },
    scrollStyle() {
      const inputHeight = this.scrollViewData.sendContentTopHeight;
      let scrollHeight =
        this.systemInfo.screenHeight -
        inputHeight -
        44 -
        this.systemInfo.statusBarHeight -
        this.scrollViewData.keyboardHeight;
      const emojiHeight = parseInt(uni.upx2px(400));
      const fileHeight = parseInt(uni.upx2px(400));
      if (this.showEmoji && !this.scrollViewData.keyboardHeight) {
        scrollHeight -= emojiHeight;
      }
      if (this.showOther && !this.scrollViewData.keyboardHeight) {
        scrollHeight -= fileHeight;
      }
      // #ifdef H5
      scrollHeight = 500;
      // #endif
      return { height: scrollHeight + "px", scrollHeight: scrollHeight };
    },
    isBlackUser() {
      return this.isSingleChat && this.friendInfo && this.friendInfo.blackInfo;
    },
    conversationData_showName() {
      if (
        this.isSingleChat &&
        this.friendInfo &&
        this.friendInfo.friendInfo &&
        this.friendInfo.friendInfo.remark
      ) {
        return this.friendInfo.friendInfo.remark;
      }
      return this.conversationData.showName;
    },
  },
  watch: {
    successTimes() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.refreshNewMessageList();
      }, 500);
    },
    newMessageTimes() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.refreshNewMessageList();
      }, 500);
    },
    infoUpdateTimes() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.refreshNewMessageList();
      }, 500);
    },
    isMute: {
      handler(status) {
        if (this.muteData.timer) {
          clearTimeout(this.muteData.timer);
        }
        if (
          status &&
          this.groupCurrentUserInfo &&
          this.groupCurrentUserInfo.muteEndTime
        ) {
          const now = new Date().getTime();
          const endTime = new Date(
            this.groupCurrentUserInfo.muteEndTime
          ).getTime();
          this.muteData.timer = setTimeout(() => {
            this.groupCurrentUserInfo.muteEndTime = 0;
          }, endTime - now);
        } else if (this.groupCurrentUserInfo) {
          this.groupCurrentUserInfo.muteEndTime = 0;
        }
      },
      immediate: true,
    },
    isReply() {
      this.$nextTick(() => {
        this.getSendContentTopHeight();
      });
    },
    revokeMessageTimes() {
      if (this.revokeMessageData.timer) {
        clearTimeout(this.revokeMessageData.timer);
      }
      this.revokeMessageData.timer = setTimeout(() => {
        this.recvRevokeMessage();
      }, 500);
    },
    clearHistoryMessageTimes() {
      this.$store.commit("message/clear_localConversationMessage", {
        groupID: this.getMessageOptions.groupID,
        userID: this.getMessageOptions.userID,
        currentUserID: this.userID,
      });
    },
    getUsersInfoTimes() {
      if (!this.isGroupChat) {
        this.getUsersInfo();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.conversation {
  height: 100vh;
  // overflow-y: hidden;
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
      flex-direction: row;
      .right-item {
        .image {
          width: 46rpx;
          height: 46rpx;
          margin-right: 46rpx;
        }
        .dot {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-direction: row;
          &-text {
            border-radius: 50%;
            width: 10rpx;
            height: 10rpx;
            background: #000000;
            &:nth-of-type(2) {
              margin: 0 6rpx;
            }
          }
        }
      }
    }
  }
  .scrollView {
    overflow-anchor: auto;
    position: relative;
    .messageContent {
      position: relative;
      min-height: 100%;
      .loadMore {
        position: absolute;
        bottom: calc(100% + 48rpx);
        left: 0;
        width: 100%;
      }
      &-empty {
        height: 24rpx;
        background-color: #fff;
      }
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
          /deep/.at-img {
            margin-bottom: 6rpx;
            width: auto;
            vertical-align: middle;
          }
        }
      }
    }
  }
  .sendContent {
    width: 100%;
    &-content {
      width: 100%;
      &-top {
        background-color: #e8f2ff;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        flex-wrap: nowrap;
        padding: 18rpx 0;
        min-height: 108rpx;
        box-sizing: border-box;
        position: relative;
        .image,
        .send-btn {
          margin-top: 12rpx;
        }
        .image {
          flex-shrink: 0;
          width: 52rpx;
          height: 52rpx;
          margin-right: 20rpx;
        }
        .image1 {
          margin-left: 20rpx;
        }
        .sendContent-editor {
          flex: 1;
          display: flex;
          flex-direction: column;
          margin-right: 20rpx;
          overflow: hidden;
          .DisbaledKeyboard {
            flex: 1;
            background-color: #fff;
          }
          .reply {
            height: 56rpx;
            box-sizing: border-box;
            background-color: #fff;
            margin-top: 12rpx;
            padding: 4rpx 8rpx;
            font-size: 24rpx;
            color: #666666;
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            align-items: center;
            justify-content: space-between;
            &-editor {
              height: 24px;
              line-height: 24px;
              min-height: 24px;
              flex: 1;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            &-icon {
              flex-shrink: 0;
              padding: 4rpx;
              margin-left: 12rpx;
              background-color: #b3b3b3;
              border-radius: 50%;
            }
          }
        }
        .sendContent-soundBtn {
          margin-right: 20rpx;
          flex: 1;
          height: 72rpx;
          line-height: 72rpx;
          background: #1d6bed;
          border-radius: 8rpx;
          text-align: center;
          color: #fff;
        }
        .send-btn {
          flex-shrink: 0;
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
        &-disabled {
          position: absolute;
          width: 100%;
          height: 100%;
          line-height: 100%;
          position: absolute;
          left: 0;
          top: 0;
          background-color: rgba(0, 0, 0, 0.4);
          z-index: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          .text {
            color: #fff;
            font-size: 32rpx;
          }
        }
      }
      &-emoji {
        box-sizing: border-box;
        padding-bottom: 40rpx;
        background-color: #fff;
        height: 400rpx;
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
      &-file {
        box-sizing: border-box;
        height: 400rpx;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        padding-bottom: 24rpx;
        &-item {
          margin-top: 24rpx;
          width: 25%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .fileImage {
            width: 96rpx;
            height: 96rpx;
            border-radius: 12rpx;
          }
          .fileText {
            font-size: 22rpx;
            color: #999999;
            margin-top: 4rpx;
          }
        }
      }
      &-multiple {
        height: 108rpx;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .button {
          width: 45%;
        }
      }
    }
  }
  .canvas-container {
    position: fixed;
    z-index: -11;
    left: 0;
    top: 50%;
    opacity: 0;
    &-name {
      max-width: 480rpx;
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>