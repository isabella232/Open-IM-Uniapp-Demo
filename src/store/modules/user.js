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
  set_userID(state, userID) {
    state.userID = userID;
  },
  set_token(state, token) {
    state.token = token;
  },
  set_userInfo(state, userInfo) {
    state.userInfo = userInfo;
  },
};
const actions = {
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      app_login(userInfo)
        .then((res) => {
          // console.log(res);
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
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
