import im from "@/config/im";
import store from "@/src/store";
export function set_messageToLocal(messageList, sourceID, sessionType) {
  messageList.map((i) => {
    if (sessionType === 1) {
      insertSingleMessageToLocalStorage(i, i.recvID, i.sendID);
    } else if (sessionType === 2) {
      insertGroupMessageToLocalStorage(i, i.groupID, i.sendID);
    }
  });
}
function insertSingleMessageToLocalStorage(message, recvID, sendID) {
  im.insertSingleMessageToLocalStorage(
    store.getters.operationID,
    message,
    recvID,
    sendID,
    (res) => {
      console.log("single",res);
    }
  );
}
function insertGroupMessageToLocalStorage(message, groupID, sendID) {
  im.insertGroupMessageToLocalStorage(
    store.getters.operationID,
    message,
    groupID,
    sendID,
    (res) => {
      console.log("group",res);
    }
  );
}
