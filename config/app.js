import { toast } from "@/common/toast";
import { commonConfig } from "./index";
import store from "@/src/store";
// const isDev = process.env.NODE_ENV === "development";
const im = uni.requireNativePlugin("Tuoyun-OpenIMSDK");
const event = uni.requireNativePlugin("globalEvent");
export function init() {
  init_platform();
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
    checkCurrenUser();
  });
}
//初始化platform
function init_platform() {
  const systemInfo = uni.getSystemInfoSync();
  store.commit("user/set_systemInfo", systemInfo);
  store.commit("user/set_platform", systemInfo.platform === "android" ? 2 : 1);
  store.commit("user/set_operationID", systemInfo.deviceId);
  // store.commit("user/set_operationID", Date.now().toString());
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
    console.log("onConnectSuccess", res);
    store.commit("user/set_connectStatus", 1);
    // checkCurrenUser();
  });
  event.addEventListener("onConnectFailed", (res) => {
    console.log("onConnectFailed", res);
    store.commit("user/set_connectStatus", 0);
    toast("服务器连接超时，请稍后再试");
  });
  event.addEventListener("onConnecting", (res) => {
    console.log("onConnecting", res);
    store.commit("user/set_connectStatus", 2);
  });
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
    console.log("sendMessageFailed", res);
    store.commit("message/set_singleMessageStatusList", {
      message: JSON.parse(res.message),
      status: -1,
      errCode: res.errCode,
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
//上次没有退出登录-自动登录
function checkCurrenUser() {
  const userID = store.getters.userID;
  const token = store.getters.token;
  const loginStatus = store.getters.loginStatus;
  const connectStatus = store.getters.connectStatus;
  const hasLastLoginData = userID && token ? true : false; //是否有上次登录用户数据(userID、token)
  if (hasLastLoginData && connectStatus === 1 && !loginStatus) {
    startLogin();
  } else if (!hasLastLoginData) {
    store.dispatch("user/logOut", im);
  }
}
function startLogin() {
  const operationID = store.getters.operationID;
  login()
    .then(() => {
      im.getSelfUserInfo(operationID, (res) => {
        if (res.errCode === 0) {
          const loginStatus = store.getters.loginStatus;
          if (!loginStatus) {
            const data = JSON.parse(res.data);
            store.commit("user/set_userInfo", data);
            console.log(data);
            store.commit("user/set_loginStatus", true);
          }
        } else {
          toast(res.errMsg);
        }
      });
    })
    .catch((msg) => {
      toast(msg);
      store.dispatch("user/logOut", im);
    });
}
function login() {
  const operationID = store.getters.operationID;
  const userID = store.getters.userID;
  const token = store.getters.token;
  return new Promise((resolve, reject) => {
    im.login(operationID, userID, token, (res) => {
      if (res.errCode === 0) {
        const loginStatus = getLoginStatus();
        if (loginStatus) {
          resolve(loginStatus);
        } else {
          reject("登录失败");
        }
      } else {
        reject(res.errMsg);
      }
    });
  });
}
function getLoginStatus() {
  const status = im.getLoginStatus(); // 返回值为 101:登录成功 102:登陆中 103:登录失败 201:登出
  if (status === 101) {
    return true;
  } else {
    return false;
  }
}
init();
export default im;
