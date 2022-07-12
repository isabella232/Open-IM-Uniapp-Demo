import { checkResponseData } from "./common";
import { toast } from "@/common/toast";
import { commonConfig } from "./index";
import store from "@/src/store";
// const isDev = process.env.NODE_ENV === "development";
const isDev = false;
const im = uni.requireNativePlugin("Tuoyun-OpenIMSDK");
const event = uni.requireNativePlugin("globalEvent");
//初始化platform
function init_platform() {
  const systemInfo = uni.getSystemInfoSync();
  store.commit("user/set_systemInfo", systemInfo);
  store.commit("user/set_platform", systemInfo.platform === "android" ? 2 : 1);
  store.commit("user/set_operationID", systemInfo.deviceId);
  // store.commit("user/set_operationID", Date.now().toString());
}
function init() {
  createDir().then((data_dir) => {
    const flag = im.initSDK(store.getters.operationID, {
      platform: store.getters.platform,
      api_addr: commonConfig.api_addr,
      ws_addr: commonConfig.ws_addr,
      data_dir, //SDK数据存放目录
      log_level: commonConfig.log_level,
      object_storage: commonConfig.object_storage,
    });
    setListener();
    addListener();
    getLoginStatus();
  });
}
//创建存储目录
function createDir() {
  return new Promise((resolve, reject) => {
    plus.io.requestFileSystem(plus.io.PRIVATE_DOC, (fs) => {
      fs.root.getDirectory(
        "user",
        {
          create: true,
        },
        (entry) => {
          resolve(entry.fullPath);
        },
        (error) => {
          reject();
        }
      );
    });
  });
}
// 设置监听
function setListener() {
  im.setUserListener((res) => {
    console.log("setUserListener", res);
  });
  im.setFriendListener((res) => {
    console.log("setFriendListener", res);
  });
  im.setGroupListener((res) => {
    console.log("setGroupListener", res);
  });
  im.setAdvancedMsgListener((res) => {
    console.log("setAdvancedMsgListener", res);
  }); //收到新消息
  im.setConversationListener((res) => {
    console.log("setConversationListener", res);
  }); //会话列表变化
}
function addListener() {
  // connect status
  event.addEventListener("onConnectSuccess", (res) => {
    console.log("onConnectSuccess");
  });
  event.addEventListener("onConnectFailed", (res) => {});
  // sendMessage callback
  event.addEventListener("sendMessageProgress", (res) => {
    // console.log("sendMessageProgress", res);
    store.commit("message/set_singleMessageStatusList", {
      message: JSON.parse(res.message),
      status: 0,
    });
  });
  event.addEventListener("sendMessageSuccess", (res) => {
    // console.log("sendMessageSuccess", JSON.parse(res.message));
    store.commit("message/set_successTimes");
    //status:   0：发送中,1：发送成功,-1:发送失败
    store.commit("message/set_singleMessageStatusList", {
      message: JSON.parse(res.message),
      status: 1,
    });
  });
  event.addEventListener("sendMessageFailed", (res) => {
    // console.log("sendMessageFailed", res);
    store.commit("message/set_singleMessageStatusList", {
      message: JSON.parse(res.message),
      status: -1,
    });
  });
  // message listener
  event.addEventListener("onRecvNewMessage", (res) => {
    console.log("onRecvNewMessage", res);
    store.commit("message/set_newMessageTimes");
    store.commit("message/set_newMessageList", JSON.parse(res.message));
  });
  event.addEventListener("onRecvMessageRevoked", (res) => {
    console.log("onRecvMessageRevoked", res);
    store.commit("message/set_revokeMessageList", res.msgId);
    store.commit("message/set_revokeMessageTimes");
    store.commit("message/set_newMessageTimes");
  });
  event.addEventListener("onRecvC2CReadReceipt", (res) => {
    // console.log("onRecvC2CReadReceipt", res);
  });
  event.addEventListener("onRecvGroupReadReceipt", (res) => {
    // console.log("onRecvGroupReadReceipt", res);
  });
  //文件上传
  event.addEventListener("uploadFileFailed", (res) => {
    console.log("uploadFileFailed", res);
    toast("上传失败，请稍后再试");
  });
  event.addEventListener("uploadFileProgress", (res) => {
    console.log("uploadFileProgress", res);
  });
  event.addEventListener("uploadFileSuccess", (res) => {
    console.log("uploadFileSuccess", res);
    store.commit("message/set_uploadFileRes", res.data);
  });
  event.addEventListener("onJoinedGroupDeleted", (res) => {
    store.commit("contacts/set_joinedGroupDeletedTimes");
  });
  event.addEventListener("onBlackAdded", (res) => {
    store.commit("message/set_frinendChangeTimes");
  });
  event.addEventListener("onBlackDeleted", (res) => {
    store.commit("message/set_frinendChangeTimes");
  });
  event.addEventListener("onFriendInfoChanged", (res) => {
    console.log("onFriendInfoChanged", res);
    store.commit("message/set_frinendInfoChangeTimes");
  });
}
export function login() {
  im.login(
    store.getters.operationID,
    store.getters.userID,
    store.getters.token,
    (res) => {
      if (res.errCode !== 0) {
        toast(res.errMsg);
      } else {
        getLoginStatus();
      }
    }
  );
}
function getLoginStatus() {
  const status = im.getLoginStatus(); // 返回值为 101:登录成功 102:登陆中 103:登录失败 201:登出
  if (isDev) {
    testNext();
  } else if (status === 101) {
    loginSuccess();
  } else if (status === -2) {
    uni.redirectTo({
      url: "/pages/login/index",
    });
  }
}
function testNext() {
  uni.switchTab({
    url: "/pages/index/index",
  });
  // uni.navigateTo({
  //   url: "/pages/conversation/index?sessionType=1&sourceID=13918588195",
  // });
}
function loginSuccess() {
  im.getSelfUserInfo(store.getters.operationID, (res) => {
    let data = checkResponseData(res);
    if (data) {
      data = JSON.parse(data);
      store.commit("user/set_userInfo", data);
      // console.log(data);
    }
  });
  uni.switchTab({
    url: "/pages/index/index",
  });
}
init_platform();
init();
export default im;
