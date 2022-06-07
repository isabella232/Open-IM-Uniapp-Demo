import { commonConfig } from "@/config/index";
import store from "@/src/store";
import { post, get } from "../http";
export function app_login(data) {
  const d = {
    ...data,
    secret: commonConfig.secret,
    platform: store.getters.platform,
  };
  return post("/auth/user_token", d);
}
