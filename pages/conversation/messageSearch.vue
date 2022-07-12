<template>
  <view class="container">
    <view class="statusBar" />
    <view class="content">
      <view class="search">
        <u-search
          shape="square"
          v-model="searchContent"
          placeholder="搜索"
          actionText="取消"
          :actionStyle="{ color: '#1B72EC' }"
          @change="searchContentChange"
          @search="searchConfirm"
          @custom="back"
        />
        <view
          class="search-tips"
          v-show="
            !searchContent &&
            !isEmpty &&
            !messageListObj.searchResultItems.length
          "
        >
          <view class="search-tips-title">搜索指定内容</view>
          <view class="search-tips-types">
            <text class="text" @click="changeType(102)">图片</text>
            <text class="text" @click="changeType(104)">视频</text>
            <text class="text" @click="changeType(105)">文件</text>
          </view>
        </view>
        <view class="search-empty" v-show="isEmpty">
          没有找到“
          <text class="color-blue">{{ searchContent }}</text>
          ”相关结果
        </view>
      </view>
      <view
        class="messageList"
        v-for="conversation in messageListObj.searchResultItems"
        :key="conversation.conversationID"
      >
        <!-- <view class="messageList-info">
          <Avatar
            :src="conversation.faceURL"
            :name="conversation.showName"
            :isGroupChat="conversation.conversationType === 2"
            size="42px"
            @click="toInfo"
          />
        </view> -->
        <view
          class="messageList-item"
          v-for="card in filterMessageList(conversation.messageList)"
          :key="card.clientMsgID"
        >
          <Avatar
            :src="card.senderFaceUrl"
            :name="card.senderNickname"
            :isGroupChat="conversation.conversationType === 2"
            size="42px"
            @click="toInfo"
          />
          <HistoryMessageCard2
            class="HistoryMessageCard2"
            :card="card"
            :conversationType="conversation.conversationType"
            :conversationID="getConversationID(conversation, card)"
            @showBigPhoto="showBigPhoto"
            @showVideoPop="showVideoPop"
          />
        </view>
      </view>
    </view>
    <BigPhoto ref="BigPhoto" />
    <VideoPop ref="VideoPop" />
  </view>
</template>

<script>
import { mapGetters } from "vuex";
import Avatar from "@/components/Avatar.vue";
import HistoryMessageCard2 from "@/components/HistoryMessageCard2.vue";
import BigPhoto from "@/components/BigPhoto.vue";
import VideoPop from "@/components/VideoPop.vue";
export default {
  components: { Avatar, HistoryMessageCard2, BigPhoto, VideoPop },
  data() {
    return {
      conversationID: "",
      searchContent: "",
      isEmpty: false,
      messageList: [],
      messageListObj: {
        totalCount: 45,
        searchResultItems: [
          {
            conversationID: "group_4293847457",
            conversationType: 2,
            showName: "openIM",
            faceURL: "",
            messageCount: 35,
            messageList: [
              {
                clientMsgID: "71f8f414e247214e00114420ab59e7ff",
                serverMsgID: "57ce9548233f48091721c84d17fe762d",
                createTime: 1657073679725,
                sendTime: 1657073679894,
                sessionType: 2,
                sendID: "3493949860",
                recvID: "3798435312",
                msgFrom: 100,
                contentType: 101,
                platformID: 5,
                senderNickname: "OpenIM-sk",
                senderFaceUrl:
                  "https://storage-online.rentsoft.cn/openim/1655861026796104324-1488665021329751810image_cropper_1655861022512.jpg",
                groupID: "4293847457",
                content: "5555",
                seq: 11028,
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
                clientMsgID: "c0dae5ff54715d0c8cac97adce9d1044",
                serverMsgID: "f6b64dc25b224e6f0e6895c20a51d1f4",
                createTime: 1656790592304,
                sendTime: 1656790592360,
                sessionType: 2,
                sendID: "3910354567",
                recvID: "3798435312",
                msgFrom: 100,
                contentType: 101,
                platformID: 5,
                senderNickname: "15368851004",
                senderFaceUrl: "ic_avatar_01",
                groupID: "4293847457",
                content: "555",
                seq: 9861,
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
                clientMsgID: "f1e56d958b49f87ae3ae20e2e03532ad",
                serverMsgID: "f8f105101a2ae2e500b5ca4add56c528",
                createTime: 1656644373581,
                sendTime: 1656644373581,
                sessionType: 2,
                sendID: "2906686850",
                recvID: "3798435312",
                msgFrom: 100,
                contentType: 101,
                platformID: 0,
                groupID: "4293847457",
                content: "欢迎13550223963加入部门",
                seq: 9064,
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
                clientMsgID: "a7cb03f7a51421bfc02be10b94a7ea2c",
                serverMsgID: "1d3c3cee5580fba4f949498532a508cb",
                createTime: 1656579538448,
                sendTime: 1656579538448,
                sessionType: 2,
                sendID: "51570084",
                recvID: "3798435312",
                msgFrom: 100,
                contentType: 101,
                platformID: 0,
                groupID: "4293847457",
                content: "欢迎15568200005加入部门",
                seq: 8687,
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
                clientMsgID: "3cf8b9170d2fbbe4af907742bc68eaa3",
                serverMsgID: "2fe808cff628c0ba8c3ad1ea0f0930e8",
                createTime: 1656493266670,
                sendTime: 1656493266684,
                sessionType: 2,
                sendID: "2447894878",
                recvID: "3798435312",
                msgFrom: 100,
                contentType: 101,
                platformID: 0,
                groupID: "4293847457",
                content: "欢迎15011035521加入部门",
                seq: 7959,
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
                clientMsgID: "67831b42e427be8c455a5467b16b539d",
                serverMsgID: "1d58f2df5a77c8290d2ee775353bafaf",
                createTime: 1656423693814,
                sendTime: 1656423693815,
                sessionType: 2,
                sendID: "1137474230",
                recvID: "3798435312",
                msgFrom: 100,
                contentType: 101,
                platformID: 0,
                groupID: "4293847457",
                content: "欢迎13666665555加入部门",
                seq: 7690,
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
                clientMsgID: "25bb8954365e60e559941f461a089132",
                serverMsgID: "76e6d05236bbdf848708af2822f17eab",
                createTime: 1656405753443,
                sendTime: 1656405753449,
                sessionType: 2,
                sendID: "3068599638",
                recvID: "3798435312",
                msgFrom: 100,
                contentType: 101,
                platformID: 0,
                groupID: "4293847457",
                content: "欢迎13808553326加入部门",
                seq: 7488,
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
                clientMsgID: "bb6057ddbf2a111bbe80ec7245bedaa2",
                serverMsgID: "a661f96421110dd67f4699dd1aacee72",
                createTime: 1656405310981,
                sendTime: 1656405310981,
                sessionType: 2,
                sendID: "635808834",
                recvID: "3798435312",
                msgFrom: 100,
                contentType: 101,
                platformID: 0,
                groupID: "4293847457",
                content: "欢迎13055183205加入部门",
                seq: 7408,
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
                clientMsgID: "15ec8e9731f7c2afb18eac05ab532c60",
                serverMsgID: "6d47e5e26f7143a80c6286a4bb842d1c",
                createTime: 1656317001795,
                sendTime: 1656317001795,
                sessionType: 2,
                sendID: "874106728",
                recvID: "3798435312",
                msgFrom: 100,
                contentType: 101,
                platformID: 0,
                groupID: "4293847457",
                content: "欢迎15521130932加入部门",
                seq: 6942,
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
                clientMsgID: "03dff92c522b83da845f6a3daffb8bd8",
                serverMsgID: "754e4bdf59d295ff73a676052aef5c8c",
                createTime: 1656213454983,
                sendTime: 1656213480079,
                sessionType: 2,
                sendID: "2304726291",
                recvID: "3798435312",
                msgFrom: 100,
                contentType: 101,
                platformID: 2,
                senderNickname: "OpenIM-Gordon",
                senderFaceUrl: "ic_avatar_05",
                groupID: "4293847457",
                content: "55",
                seq: 6653,
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
                clientMsgID: "1d2910ee9086ecb0d34c81e70852cea5",
                serverMsgID: "220e1e8bf0fd9f355947381ee5351208",
                createTime: 1656213434369,
                sendTime: 1656213439511,
                sessionType: 2,
                sendID: "2304726291",
                recvID: "3798435312",
                msgFrom: 100,
                contentType: 101,
                platformID: 2,
                senderNickname: "OpenIM-Gordon",
                senderFaceUrl: "ic_avatar_05",
                groupID: "4293847457",
                content: "556",
                seq: 6652,
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
                clientMsgID: "3e82d71e75811e9fb2767f73648e6560",
                serverMsgID: "5a35dda89c11242431635f4afcedcece",
                createTime: 1656061157956,
                sendTime: 1656061157956,
                sessionType: 2,
                sendID: "1588863484",
                recvID: "3798435312",
                msgFrom: 100,
                contentType: 101,
                platformID: 0,
                groupID: "4293847457",
                content: "欢迎13915589359加入部门",
                seq: 6068,
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
                clientMsgID: "d74f2b6bfb9e6fe91a4ad26863dbb505",
                serverMsgID: "dffa303b0f585b7e5fcc2f4e66c5acb9",
                createTime: 1655999269518,
                sendTime: 1655999269519,
                sessionType: 2,
                sendID: "377921948",
                recvID: "3798435312",
                msgFrom: 100,
                contentType: 101,
                platformID: 0,
                groupID: "4293847457",
                content: "欢迎13915589358加入部门",
                seq: 5307,
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
                clientMsgID: "9cb5f3bb1e07a858e89da6d3f2d94816",
                serverMsgID: "3e22f9f508c0df2aea2055286c5d8882",
                createTime: 1655970454985,
                sendTime: 1655970454989,
                sessionType: 2,
                sendID: "535654423",
                recvID: "3798435312",
                msgFrom: 100,
                contentType: 101,
                platformID: 0,
                groupID: "4293847457",
                content: "欢迎13735589373加入部门",
                seq: 5025,
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
                clientMsgID: "a1ae5e1a98aa1119f47f1ddc3f7e8c40",
                serverMsgID: "2f0b80e421ec3e7da5b1cdffc679d403",
                createTime: 1655897621142,
                sendTime: 1655897621143,
                sessionType: 2,
                sendID: "2382999449",
                recvID: "3798435312",
                msgFrom: 100,
                contentType: 101,
                platformID: 0,
                groupID: "4293847457",
                content: "欢迎15521244847加入部门",
                seq: 4118,
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
                clientMsgID: "d4aa641e30e81f09353eca7b5422ae80",
                serverMsgID: "d0387e7b84cd4c613c9edcaf9dc96d27",
                createTime: 1655879543846,
                sendTime: 1655879543846,
                sessionType: 2,
                sendID: "861922392",
                recvID: "3798435312",
                msgFrom: 100,
                contentType: 101,
                platformID: 0,
                groupID: "4293847457",
                content: "欢迎15589810065加入部门",
                seq: 3803,
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
                clientMsgID: "749f2aa451fc656be2ac1471dc05a00b",
                serverMsgID: "655ae8822f0e65a1d2ca16a003a81f9c",
                createTime: 1655878814120,
                sendTime: 1655878814129,
                sessionType: 2,
                sendID: "98669789",
                recvID: "3798435312",
                msgFrom: 100,
                contentType: 101,
                platformID: 0,
                groupID: "4293847457",
                content: "欢迎15500000000加入部门",
                seq: 3761,
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
                clientMsgID: "f311225fb2e88fc403537dc9853bc233",
                serverMsgID: "5a6a9bb35f47a4602f54084680271589",
                createTime: 1655782010351,
                sendTime: 1655782010399,
                sessionType: 2,
                sendID: "3629529336",
                recvID: "3798435312",
                msgFrom: 100,
                contentType: 101,
                platformID: 5,
                senderNickname: "18179061336",
                senderFaceUrl: "ic_avatar_02",
                groupID: "4293847457",
                content: "555",
                seq: 2933,
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
                clientMsgID: "da09d7b5230b25a783e693f99c0b6012",
                serverMsgID: "6512d93385ed54ae267c7cbf110cc9c1",
                createTime: 1655781993724,
                sendTime: 1655781993793,
                sessionType: 2,
                sendID: "3493949860",
                recvID: "3798435312",
                msgFrom: 100,
                contentType: 101,
                platformID: 5,
                senderNickname: "OpenIM-sk",
                senderFaceUrl: "ic_avatar_06",
                groupID: "4293847457",
                content: "555",
                seq: 2932,
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
                clientMsgID: "e753073cacf0f68033c74f320abb5a77",
                serverMsgID: "042c7edd26f0c056bff35d03bd5dd970",
                createTime: 1655733782154,
                sendTime: 1655733782182,
                sessionType: 2,
                sendID: "494904972",
                recvID: "3798435312",
                msgFrom: 100,
                contentType: 101,
                platformID: 0,
                groupID: "4293847457",
                content: "欢迎15579847501加入部门",
                seq: 2636,
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
                clientMsgID: "af5492e941f998db81927cbd2b69f72b",
                serverMsgID: "d6c3f45ca5207b8ccddf70f96570033c",
                createTime: 1655733299668,
                sendTime: 1655733299668,
                sessionType: 2,
                sendID: "2477414884",
                recvID: "3798435312",
                msgFrom: 100,
                contentType: 101,
                platformID: 0,
                groupID: "4293847457",
                content: "欢迎18929395598加入部门",
                seq: 2630,
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
                clientMsgID: "b9966648c9352033ca42c7c6c3885229",
                serverMsgID: "37af34fbb0abc36849a3754482352f15",
                createTime: 1655704039064,
                sendTime: 1655704039065,
                sessionType: 2,
                sendID: "3851244785",
                recvID: "3798435312",
                msgFrom: 100,
                contentType: 101,
                platformID: 0,
                groupID: "4293847457",
                content: "欢迎18692796551加入部门",
                seq: 2333,
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
                clientMsgID: "758c5c50afdcd022c5fb3de91f086951",
                serverMsgID: "2ccd218f43f532c2e884e0ab29622c4c",
                createTime: 1655703987827,
                sendTime: 1655703987827,
                sessionType: 2,
                sendID: "412186295",
                recvID: "3798435312",
                msgFrom: 100,
                contentType: 101,
                platformID: 0,
                groupID: "4293847457",
                content: "欢迎18692796554加入部门",
                seq: 2325,
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
                clientMsgID: "a08bf5f139e2405f2ce7cfc4bb7ef017",
                serverMsgID: "3aedf0d0f752bd6588fbec58a0fc04db",
                createTime: 1655703357763,
                sendTime: 1655703357763,
                sessionType: 2,
                sendID: "4209719766",
                recvID: "3798435312",
                msgFrom: 100,
                contentType: 101,
                platformID: 0,
                groupID: "4293847457",
                content: "欢迎15552525723加入部门",
                seq: 2315,
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
                clientMsgID: "9f2543b6cd0b1f42b11108f6c058e7ef",
                serverMsgID: "94dabe0aa3e6d77d9e2051ea90f5b482",
                createTime: 1655657791805,
                sendTime: 1655657791807,
                sessionType: 2,
                sendID: "1567086576",
                recvID: "3798435312",
                msgFrom: 100,
                contentType: 101,
                platformID: 0,
                groupID: "4293847457",
                content: "欢迎553628212@qq.com加入部门",
                seq: 2102,
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
                clientMsgID: "3709b08a90ec597ffa64671f35334d23",
                serverMsgID: "072cd3d689514fd8422d22641cc299ca",
                createTime: 1655651133144,
                sendTime: 1655651133144,
                sessionType: 2,
                sendID: "3671176759",
                recvID: "3798435312",
                msgFrom: 100,
                contentType: 101,
                platformID: 0,
                groupID: "4293847457",
                content: "欢迎1855555555加入部门",
                seq: 2065,
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
                clientMsgID: "967b0d50e0d90cb2900d3e04054fdaf0",
                serverMsgID: "f14b008297575ec7b740126e71e8b3f5",
                createTime: 1655639382072,
                sendTime: 1655639382073,
                sessionType: 2,
                sendID: "1255390353",
                recvID: "3798435312",
                msgFrom: 100,
                contentType: 101,
                platformID: 0,
                groupID: "4293847457",
                content: "欢迎15553105061加入部门",
                seq: 2030,
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
                clientMsgID: "2355fc7c87edddd169ca39ab2275fb47",
                serverMsgID: "f7b01b557de6b0f99ec6dedca5e3bdd7",
                createTime: 1655609374705,
                sendTime: 1655609375730,
                sessionType: 2,
                sendID: "3493949860",
                recvID: "3798435312",
                msgFrom: 100,
                contentType: 106,
                platformID: 2,
                senderNickname: "OpenIM-sk",
                senderFaceUrl: "ic_avatar_06",
                groupID: "4293847457",
                content:
                  '{"text":" @1551416320 你可以参考go来实现","atUserList":["1551416320"],"atUsersInfo":[{"atUserID":"1551416320","groupNickname":"土鸡"}],"isAtSelf":false}',
                seq: 1665,
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
                  text: " @1551416320 你可以参考go来实现",
                  atUserList: ["1551416320"],
                  atUsersInfo: [
                    {
                      atUserID: "1551416320",
                      groupNickname: "土鸡",
                    },
                  ],
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
                clientMsgID: "ea097eb67a47cfcaaf8a979fdaa84d75",
                serverMsgID: "3320982e906210665c75eef3c47a04e6",
                createTime: 1655512192272,
                sendTime: 1655512193577,
                sessionType: 2,
                sendID: "3953634282",
                recvID: "3798435312",
                msgFrom: 100,
                contentType: 106,
                platformID: 2,
                senderNickname: "常在心",
                senderFaceUrl: "ic_avatar_02",
                groupID: "4293847457",
                content:
                  '{"text":" @2565500466 可以呀","atUserList":["2565500466"],"atUsersInfo":[{"atUserID":"2565500466","groupNickname":"国际法"}],"isAtSelf":false}',
                seq: 1090,
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
                  text: " @2565500466 可以呀",
                  atUserList: ["2565500466"],
                  atUsersInfo: [
                    {
                      atUserID: "2565500466",
                      groupNickname: "国际法",
                    },
                  ],
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
                clientMsgID: "4741f2fcbad2e21796c454c810a31c88",
                serverMsgID: "0c76c4af790caa8faf26a1689be0db0b",
                createTime: 1655473039500,
                sendTime: 1655473039845,
                sessionType: 2,
                sendID: "3493949860",
                recvID: "3798435312",
                msgFrom: 100,
                contentType: 106,
                platformID: 2,
                senderNickname: "OpenIM-sk",
                senderFaceUrl: "ic_avatar_06",
                groupID: "4293847457",
                content:
                  '{"text":" @1551416320 具体说说","atUserList":["1551416320"],"atUsersInfo":[{"atUserID":"1551416320","groupNickname":"土鸡"}],"isAtSelf":false}',
                seq: 337,
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
                  text: " @1551416320 具体说说",
                  atUserList: ["1551416320"],
                  atUsersInfo: [
                    {
                      atUserID: "1551416320",
                      groupNickname: "土鸡",
                    },
                  ],
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
                clientMsgID: "b404e86dd0b0ea9944884a50e6a26ad2",
                serverMsgID: "65fa880e36d74daf4f370528d14cd108",
                createTime: 1655468457211,
                sendTime: 1655468458209,
                sessionType: 2,
                sendID: "1254106652",
                recvID: "3798435312",
                msgFrom: 100,
                contentType: 105,
                platformID: 2,
                senderNickname: "云雀台",
                senderFaceUrl: "ic_avatar_06",
                groupID: "4293847457",
                content:
                  '{"filePath":"/data/user/0/io.openim.app.enterprisechat/cache/file_picker/birthday1655226811509.jpg","uuid":"1655468457293875494-7492765961795168921.jpg","sourceUrl":"https://storage-online.rentsoft.cn/openim/1655468457293875494-7492765961795168921.jpg","fileName":"birthday1655226811509.jpg","fileSize":683575}',
                seq: 217,
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
                  filePath:
                    "/data/user/0/io.openim.app.enterprisechat/cache/file_picker/birthday1655226811509.jpg",
                  uuid: "1655468457293875494-7492765961795168921.jpg",
                  sourceUrl:
                    "https://storage-online.rentsoft.cn/openim/1655468457293875494-7492765961795168921.jpg",
                  fileName: "birthday1655226811509.jpg",
                  fileSize: 683575,
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
                clientMsgID: "8fcd3316345ccd5d4061aa6388d00422",
                serverMsgID: "06a8177adb49aa2f2ca690a5057b3184",
                createTime: 1655468450613,
                sendTime: 1655468451587,
                sessionType: 2,
                sendID: "1254106652",
                recvID: "3798435312",
                msgFrom: 100,
                contentType: 105,
                platformID: 2,
                senderNickname: "云雀台",
                senderFaceUrl: "ic_avatar_06",
                groupID: "4293847457",
                content:
                  '{"filePath":"/data/user/0/io.openim.app.enterprisechat/cache/file_picker/birthday1655226811509.jpg","uuid":"1655468450694024801-4157133051581718742.jpg","sourceUrl":"https://storage-online.rentsoft.cn/openim/1655468450694024801-4157133051581718742.jpg","fileName":"birthday1655226811509.jpg","fileSize":683575}',
                seq: 216,
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
                  filePath:
                    "/data/user/0/io.openim.app.enterprisechat/cache/file_picker/birthday1655226811509.jpg",
                  uuid: "1655468450694024801-4157133051581718742.jpg",
                  sourceUrl:
                    "https://storage-online.rentsoft.cn/openim/1655468450694024801-4157133051581718742.jpg",
                  fileName: "birthday1655226811509.jpg",
                  fileSize: 683575,
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
                clientMsgID: "5967ed064b6071b67735605bb7012c90",
                serverMsgID: "0cf8fc351f8cee4b27f8a5ab6539737a",
                createTime: 1655468359465,
                sendTime: 1655468360529,
                sessionType: 2,
                sendID: "1254106652",
                recvID: "3798435312",
                msgFrom: 100,
                contentType: 105,
                platformID: 2,
                senderNickname: "云雀台",
                senderFaceUrl: "ic_avatar_06",
                groupID: "4293847457",
                content:
                  '{"filePath":"/data/user/0/io.openim.app.enterprisechat/cache/file_picker/birthday1655226811509.jpg","uuid":"1655468359553912488-5202458289597147449.jpg","sourceUrl":"https://storage-online.rentsoft.cn/openim/1655468359553912488-5202458289597147449.jpg","fileName":"birthday1655226811509.jpg","fileSize":683575}',
                seq: 215,
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
                  filePath:
                    "/data/user/0/io.openim.app.enterprisechat/cache/file_picker/birthday1655226811509.jpg",
                  uuid: "1655468359553912488-5202458289597147449.jpg",
                  sourceUrl:
                    "https://storage-online.rentsoft.cn/openim/1655468359553912488-5202458289597147449.jpg",
                  fileName: "birthday1655226811509.jpg",
                  fileSize: 683575,
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
                clientMsgID: "2d66618b60a258db590a5739088045c6",
                serverMsgID: "31db60da2838619cfe91ce7b85988a18",
                createTime: 1655467715439,
                sendTime: 1655467716575,
                sessionType: 2,
                sendID: "1254106652",
                recvID: "3798435312",
                msgFrom: 100,
                contentType: 105,
                platformID: 2,
                senderNickname: "云雀台",
                senderFaceUrl: "ic_avatar_06",
                groupID: "4293847457",
                content:
                  '{"filePath":"/data/user/0/io.openim.app.enterprisechat/cache/file_picker/birthday1655226811509.jpg","uuid":"1655467715536275757-204123665542931154.jpg","sourceUrl":"https://storage-online.rentsoft.cn/openim/1655467715536275757-204123665542931154.jpg","fileName":"birthday1655226811509.jpg","fileSize":683575}',
                seq: 203,
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
                  filePath:
                    "/data/user/0/io.openim.app.enterprisechat/cache/file_picker/birthday1655226811509.jpg",
                  uuid: "1655467715536275757-204123665542931154.jpg",
                  sourceUrl:
                    "https://storage-online.rentsoft.cn/openim/1655467715536275757-204123665542931154.jpg",
                  fileName: "birthday1655226811509.jpg",
                  fileSize: 683575,
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
                clientMsgID: "7f3b81294102c4397f80e7b2579bfe96",
                serverMsgID: "6e4faaf621fc3d873896871494ddf23a",
                createTime: 1655463332528,
                sendTime: 1655463333463,
                sessionType: 2,
                sendID: "2304726291",
                recvID: "3798435312",
                msgFrom: 100,
                contentType: 101,
                platformID: 2,
                senderNickname: "18712345678",
                senderFaceUrl: "ic_avatar_05",
                groupID: "4293847457",
                content: "55",
                seq: 149,
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
            ],
          },
          {
            conversationID: "single_870517699",
            conversationType: 1,
            showName: "小红",
            faceURL:
              "https://storage-online.rentsoft.cn/openim/1655532712536247948-8273290538659802269image_cropper_1655532711426.jpg",
            messageCount: 1,
            messageList: [
              {
                clientMsgID: "90ac92a6041f5ed2d661406246a80274",
                serverMsgID: "2721e2a3bfd97c855a8b7bd646047fc0",
                createTime: 1657074194281,
                sendTime: 1657074090144,
                sessionType: 1,
                sendID: "3798435312",
                recvID: "870517699",
                msgFrom: 100,
                contentType: 101,
                platformID: 2,
                senderNickname: "OpenIM-Blooming",
                senderFaceUrl: "ic_avatar_06",
                content: "55",
                seq: 11031,
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
            ],
          },
          {
            conversationID: "group_4116783051",
            conversationType: 2,
            showName: "后台开发中心",
            faceURL: "",
            messageCount: 9,
            messageList: [
              {
                clientMsgID: "95229dffec58673b03caa7c9c5c9e032",
                serverMsgID: "dd6d04b323f373037fc6e475840ba3cd",
                createTime: 1656493267281,
                sendTime: 1656493267282,
                sessionType: 2,
                sendID: "2447894878",
                recvID: "3798435312",
                msgFrom: 100,
                contentType: 101,
                platformID: 0,
                groupID: "4116783051",
                content: "欢迎15011035521加入部门",
                seq: 7962,
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
                clientMsgID: "97f664383b07c088eac7c42453afe703",
                serverMsgID: "598f7b686bc1608faa33be90e0b43f6e",
                createTime: 1656423694119,
                sendTime: 1656423694125,
                sessionType: 2,
                sendID: "1137474230",
                recvID: "3798435312",
                msgFrom: 100,
                contentType: 101,
                platformID: 0,
                groupID: "4116783051",
                content: "欢迎13666665555加入部门",
                seq: 7692,
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
                clientMsgID: "3b4cdef6f5239238c951fd405f347c7e",
                serverMsgID: "bebf9d67d9d85d1185e0a94d7942c4d0",
                createTime: 1656405311313,
                sendTime: 1656405311313,
                sessionType: 2,
                sendID: "635808834",
                recvID: "3798435312",
                msgFrom: 100,
                contentType: 101,
                platformID: 0,
                groupID: "4116783051",
                content: "欢迎13055183205加入部门",
                seq: 7410,
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
                clientMsgID: "5dea7777c7891a2ed6c518567c34003e",
                serverMsgID: "3ad684d1f162a05f5435b61f69f7d999",
                createTime: 1656317002435,
                sendTime: 1656317002435,
                sessionType: 2,
                sendID: "874106728",
                recvID: "3798435312",
                msgFrom: 100,
                contentType: 101,
                platformID: 0,
                groupID: "4116783051",
                content: "欢迎15521130932加入部门",
                seq: 6945,
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
                clientMsgID: "7f906980eb03c6a49a53a4d38d20e241",
                serverMsgID: "111010717f4705594e6511a7c3a10b19",
                createTime: 1655878814509,
                sendTime: 1655878814509,
                sessionType: 2,
                sendID: "98669789",
                recvID: "3798435312",
                msgFrom: 100,
                contentType: 101,
                platformID: 0,
                groupID: "4116783051",
                content: "欢迎15500000000加入部门",
                seq: 3763,
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
                clientMsgID: "ab250798d2cd6201e3123cbd9de97513",
                serverMsgID: "76584fbd38c6b7cd8a4bef7934fed355",
                createTime: 1655733782518,
                sendTime: 1655733782519,
                sessionType: 2,
                sendID: "494904972",
                recvID: "3798435312",
                msgFrom: 100,
                contentType: 101,
                platformID: 0,
                groupID: "4116783051",
                content: "欢迎15579847501加入部门",
                seq: 2638,
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
                clientMsgID: "a816ba8c727d21ccafd225016a2220a4",
                serverMsgID: "d858b1c9c3aa586cd87ead33ffc13afd",
                createTime: 1655703988060,
                sendTime: 1655703988061,
                sessionType: 2,
                sendID: "412186295",
                recvID: "3798435312",
                msgFrom: 100,
                contentType: 101,
                platformID: 0,
                groupID: "4116783051",
                content: "欢迎18692796554加入部门",
                seq: 2327,
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
                clientMsgID: "ea905f258785e3336bb650de0fe0aa7b",
                serverMsgID: "87febbd9093b1ee002cf0cba9579b800",
                createTime: 1655467608223,
                sendTime: 1655467609440,
                sessionType: 2,
                sendID: "1254106652",
                recvID: "3798435312",
                msgFrom: 100,
                contentType: 105,
                platformID: 2,
                senderNickname: "云雀台",
                senderFaceUrl: "ic_avatar_06",
                groupID: "4116783051",
                content:
                  '{"filePath":"/data/user/0/io.openim.app.enterprisechat/cache/file_picker/birthday1655226811509.jpg","uuid":"1655467608346032059-8741545748998466867.jpg","sourceUrl":"https://storage-online.rentsoft.cn/openim/1655467608346032059-8741545748998466867.jpg","fileName":"birthday1655226811509.jpg","fileSize":683575}',
                seq: 195,
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
                  filePath:
                    "/data/user/0/io.openim.app.enterprisechat/cache/file_picker/birthday1655226811509.jpg",
                  uuid: "1655467608346032059-8741545748998466867.jpg",
                  sourceUrl:
                    "https://storage-online.rentsoft.cn/openim/1655467608346032059-8741545748998466867.jpg",
                  fileName: "birthday1655226811509.jpg",
                  fileSize: 683575,
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
                clientMsgID: "afef70538603bd08b8ea75a4df822455",
                serverMsgID: "6d34a55d7e053194560991f871475fde",
                createTime: 1655467524966,
                sendTime: 1655467526109,
                sessionType: 2,
                sendID: "1254106652",
                recvID: "3798435312",
                msgFrom: 100,
                contentType: 105,
                platformID: 2,
                senderNickname: "云雀台",
                senderFaceUrl: "ic_avatar_06",
                groupID: "4116783051",
                content:
                  '{"filePath":"/data/user/0/io.openim.app.enterprisechat/cache/file_picker/birthday1655226811509.jpg","uuid":"1655467525053405361-4493988860614313135.jpg","sourceUrl":"https://storage-online.rentsoft.cn/openim/1655467525053405361-4493988860614313135.jpg","fileName":"birthday1655226811509.jpg","fileSize":683575}',
                seq: 191,
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
                  filePath:
                    "/data/user/0/io.openim.app.enterprisechat/cache/file_picker/birthday1655226811509.jpg",
                  uuid: "1655467525053405361-4493988860614313135.jpg",
                  sourceUrl:
                    "https://storage-online.rentsoft.cn/openim/1655467525053405361-4493988860614313135.jpg",
                  fileName: "birthday1655226811509.jpg",
                  fileSize: 683575,
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
            ],
          },
        ],
      },
      messageType: 101,
    };
  },
  methods: {
    searchContentChange() {
      this.isEmpty = false;
    },
    searchConfirm() {
      this.messageType = 101;
      this.searchLocalMessages();
    },
    changeType(type) {
      this.messageType = type;
      this.searchLocalMessages();
    },
    searchLocalMessages() {
      this.$im.searchLocalMessages(
        this.operationID,
        {
          conversationID: this.conversationID,
          keywordList: [this.searchContent],
          keywordListMatchType: 0,
          senderUserIDList: [],
          messageTypeList: [this.messageType],
          searchTimePosition: 0,
          searchTimePeriod: 0,
          pageIndex: 1,
          count: 50,
        },
        (res) => {
          console.log(res);
          if (res.errCode !== 0) {
            this.isEmpty = true;
          } else {
            const data = JSON.parse(res.data);
            console.log(JSON.parse(res.data));
            this.messageListObj.totalCount = data.totalCount;
            this.messageListObj.searchResultItems =
              data.searchResultItems || [];
            if (this.messageListObj.searchResultItems.length) {
              this.isEmpty = false;
            }
          }
        }
      );
    },
    back() {
      uni.navigateBack();
    },
    toInfo() {},
    filterMessageList(list) {
      return list.filter((i) => i.senderNickname || i.senderFaceUrl);
    },
    getConversationID(conversation, card) {
      if (conversation.conversationType === 2) {
        return card.groupID;
      } else if (
        conversation.conversationType === 1 &&
        card.sendID === this.userID
      ) {
        return card.recvID;
      } else {
        return card.sendID;
      }
    },
    showBigPhoto(src, bigPhotoStyle) {
      this.$refs.BigPhoto.init(src, bigPhotoStyle);
    },
    showVideoPop(videoElem) {
      this.$refs.VideoPop.init(videoElem);
    },
  },
  onLoad(param) {
    // #ifdef APP-PLUS
    this.messageListObj.searchResultItems = [];
    // #endif
    this.conversationID = param.conversationID;
    if (param.messageType) {
      this.messageType = Number(param.messageType);
      this.searchLocalMessages();
    }
  },
  computed: {
    ...mapGetters(["operationID", "userID"]),
  },
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: #fff;
  .content {
    padding: 24rpx 44rpx;
  }
  .search {
    margin-bottom: 40rpx;
    &-tips {
      padding: 0 60rpx;
      margin-top: 32rpx;
      text-align: center;
      font-size: 28rpx;
      color: #666666;
      &-title {
        margin-top: 114rpx;
        margin-bottom: 48rpx;
        text-align: center;
        font-size: 28rpx;
        color: #666666;
      }
      &-types {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        .text {
          font-size: 32rpx;
          color: #1b72ec;
        }
      }
    }
    &-empty {
      margin-top: 196rpx;
      text-align: center;
      font-size: 28rpx;
      color: #666666;
      .color-blue {
        color: #1b72ec;
      }
    }
  }
  .messageList {
    &-item {
      display: flex;
      justify-content: space-between;
      flex-direction: row;
      .HistoryMessageCard2 {
        flex: 1;
      }
    }
  }
}
</style>