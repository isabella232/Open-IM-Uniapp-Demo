import im from "@/config/im";
import { toast } from "@/common/toast";
import store from "@/src/store";
export function scan(sessionType = "0") {
  //0、两种都搜索，1、单聊，2、群聊
  // #ifdef APP-PLUS
  uni.scanCode({
    scanType: ["qrCode"],
    success: (res) => {
      if (sessionType === "2") {
        checkGroup(res.result, sessionType);
      } else {
        checkUser(res.result, sessionType);
      }
    },
  });
  // #endif
}
function checkUser(id, sessionType) {
  im.getUsersInfo(store.getters.operationID, [id], (res) => {
    if (res.errCode !== 0 && sessionType !== "0") {
      toast("未查找到该用户");
    } else if (res.errCode !== 0 && sessionType === "0") {
      checkGroup(id, sessionType);
    } else {
      uni.navigateTo({
        url: "/pages/friend/info?id=" + id,
      });
    }
  });
}
function checkGroup(id, sessionType) {
  im.getUsersInfo(store.getters.operationID, [id], (res) => {
    if (res.errCode !== 0 && sessionType === "0") {
      toast("未查找到该用户或群组");
    } else if (res.errCode !== 0 && sessionType !== "0") {
      toast("未查找到该群组");
    } else {
      uni.navigateTo({
        url: "/pages/group/info?id=" + id,
      });
    }
  });
}
