import Vue from "vue";
import App from "./App";
import uView from "@/uni_modules/uview-ui";
import store from "./src/store";
import im from "./config/im";
import api from "./service";
import { toast } from "./common/toast";
Vue.use(uView);
Vue.config.productionTip = false;
Vue.prototype.$store = store;
Vue.prototype.$im = im;
Vue.prototype.$api = api;
Vue.prototype.$toast = toast;
App.mpType = "app";
const app = new Vue({
  ...App,
  store,
});
app.$mount();
