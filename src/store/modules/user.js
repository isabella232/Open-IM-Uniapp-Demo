import { app_login } from "../../../service/api/user";
const state = {
  platform: "",
  operationID: "",
  userID: "3493949860",
  token: "",
  userInfo: {
    userID: "3493949860",
    nickname: "blooming",
    faceURL: "ic_avatar_02",
    gender: 1,
    phoneNumber: "",
    birth: 0,
    email: "",
    createTime: 0,
    ex: "",
    attachedInfo: "",
  },
  systemInfo: {
    screenHeight: 667,
    screenWidth: 375,
  },
  loginStatus: false, //是否登录
  loginUserInfo: null,
  connectStatus: 1, //服务器连接状态:0,:失败;1:成功;2:连接中
};
const mutations = {
  set_systemInfo(state, systemInfo) {
    console.log(systemInfo);
    state.systemInfo = systemInfo;
  },
  set_platform(state, platform) {
    state.platform = platform;
  },
  set_operationID(state, operationID) {
    state.operationID = operationID;
  },
  set_userID(state, userID = "") {
    state.userID = userID;
  },
  set_token(state, token = "") {
    state.token = token;
  },
  set_userInfo(state, userInfo) {
    state.userInfo = userInfo;
  },
  set_loginUserInfo(state, loginUserInfo = null) {
    state.loginUserInfo = loginUserInfo;
  },
  set_loginStatus(state, loginStatus = false) {
    state.loginStatus = loginStatus;
  },
  set_connectStatus(state, connectStatus = 0) {
    state.connectStatus = connectStatus;
  },
};
const actions = {
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      app_login(userInfo)
        .then((res) => {
          if (res.errCode === 0) {
            commit("set_token", res.data.token);
            commit("set_userID", res.data.userID);
            resolve();
          } else {
            reject({ message: res.errMsg });
          }
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  },
  logOut({ commit, rootGetters }, im) {
    commit("set_token");
    commit("set_userID");
    commit("set_loginStatus");
    if (rootGetters.operationID && im) {
      im.logout(rootGetters.operationID, () => {});
    }
    // uni.clearStorage();
    uni.redirectTo({
      url: "/pages/login/index",
    });
  },
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
