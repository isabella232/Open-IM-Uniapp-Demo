import { commonConfig } from "@/config/index";
import store from "@/src/store";
import { post, get } from "../http";
export function app_login(data) {
  const d = {
    ...data,//phoneNumber,password,operationID
    platform: store.getters.platform,
  };
  // console.log(d);
  return post("/demo/login", d);
}