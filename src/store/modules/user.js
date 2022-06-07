import { app_login } from "../../../service/api/user";
const state = {
  platform: "",
  operationID: "",
  userID: "",
  token: "",
  userInfo: {
    userID: "",
    nickname: "",
    faceURL: "",
    gender: "",
    phoneNumber: "",
    birth: "",
    email: "",
    createTime: "",
    ex: "",
    attachedInfo: "",
  },
};
const mutations = {
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
