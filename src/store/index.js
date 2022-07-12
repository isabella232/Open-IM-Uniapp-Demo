import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex)
const vuexPersisted = new createPersistedState({
  storage: {
    getItem: key => uni.getStorageSync(key),
    setItem: (key, value) => uni.setStorageSync(key, value),
    removeItem: key => uni.removeStorageSync(key)
  }
})
import getters from "./getters";
import user from "./modules/user";
import message from "./modules/message";
import group from "./modules/group";
import contacts from "./modules/contacts";
const store = new Vuex.Store({
  modules: {
    user,
    message,
    group,
    contacts,
  },
  getters,
  plugins: [vuexPersisted]
});

export default store;
