import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex)
import getters from "./getters";
import user from "./modules/user";
import message from "./modules/message";
const store = new Vuex.Store({
  modules: {
    user,
    message,
  },
  getters,
});

export default store;
