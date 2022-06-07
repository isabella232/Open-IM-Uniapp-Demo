import { toast } from "@/common/toast";
import { commonConfig } from "./index";
import { OpenIMSDK } from "open-im-sdk";
import store from "@/src/store";
const openIM = new OpenIMSDK();
function init() {
  const config = {
    userID: store.getters.userID,
    token: store.getters.token,
    url: commonConfig.ws_addr,
    platformID: store.getters.platform,
  };
  openIM
    .login(config)
    .then((res) => {
      console.log("login suc...");
    })
    .catch((err) => {
      console.log("login failed...");
    });
}
export function login() {}
export default openIM;
