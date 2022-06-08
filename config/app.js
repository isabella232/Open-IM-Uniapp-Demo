import { checkResponseData } from "./common";
import { toast } from "@/common/toast";
import { commonConfig } from "./index";
import store from "@/src/store";
const im = uni.requireNativePlugin("Tuoyun-OpenIMSDK");
const event = uni.requireNativePlugin("globalEvent");
//初始化platform
function init_platform() {
  // #ifdef APP-PLUS
  const systemInfo = uni.getSystemInfoSync();
  store.commit("user/set_platform", systemInfo.platform === "android" ? 2 : 1);
  store.commit("user/set_operationID", systemInfo.deviceId);
  // #endif
  // #ifdef H5
  store.commit("user/set_platform", 5);
  // #endif
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
  im.setUserListener();
  im.setFriendListener();
  im.setGroupListener();
  im.setAdvancedMsgListener(); //收到新消息
  im.setConversationListener(); //会话列表变化
}
function addListener() {
  // connect status
  event.addEventListener("onConnectSuccess", (res) => {
    console.log("onConnectSuccess");
  });
  event.addEventListener("onConnectFailed", (res) => {});
  // sendMessage callback
  event.addEventListener("sendMessageSuccess", (res) => {
    console.log(res);
    store.commit("message/set_successTimes");
  });
  event.addEventListener("sendMessageFailed", (res) => {
    console.log(res, "sendMessageFailed");
  });
  event.addEventListener("sendMessageProgress", (res) => {
    console.log(res, "sendMessageProgress");
  });
  // message listener
  event.addEventListener("onRecvNewMessage", (res) => {
    console.log(res, "onRecvNewMessage");
    store.commit("message/set_newMessageTimes");
  });
  event.addEventListener("onRecvMessageRevoked", (res) => {});
  event.addEventListener("onRecvC2CReadReceipt", (res) => {});
  event.addEventListener("onRecvGroupReadReceipt", (res) => {});
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
  if (status === 101) {
    loginSuccess();
  } else if (status === -2) {
    uni.redirectTo({
      url: "/pages/login/index",
    });
  }
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
