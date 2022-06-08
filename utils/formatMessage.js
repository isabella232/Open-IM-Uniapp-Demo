export function formatMessageCardMessage(messageItem) {
  let content = "";
  let latestMsg = messageItem.latestMsg;
  if (!latestMsg) return content;
  latestMsg = JSON.parse(latestMsg);
  content = latestMsg.content;
  let contentType = getMessageCardContentType(messageItem);
  content = getContent(content, contentType);
  return `${getNickname(latestMsg.senderNickname)}${content}`;
}
export function formatConversationCardMessage(messageItem) {
  let content = messageItem.content;
  let contentType = getConversationCardContentType(messageItem);
  content = getContent(content, contentType);
  return content;
}
export function formatHistoryCardMessage(item) {
  console.log(item);
  let content = item.messageItem.content;
  let contentType = getHistoryCardContentType(item);
  content = getContent(content, contentType);
  return content;
}
function getContent(c, cType) {
  let content = c;
  switch (cType) {
    case 101: //文字
      break;
    case 102:
      content = "[图片]";
      break;
    case 103:
      content = "[语音]";
      break;
    case 104:
      content = "[视频]";
      break;
    case 105:
      content = "[文件]";
      break;
    case 110:
      content = "[自定义消息]";
      break;
    case 1204:
      content = `你们已经是好友啦,开始聊天吧~`;
      break;
    case 1501:
      content = getNoticeContent(content) + "创建了群聊";
      break;
    case 1502:
      content = getNoticeContent(content) + "更新了群信息";
      break;
    case 1508:
      content = getNoticeContent(content) + "更新了群信息";
      break;
    case 1509:
      content = getNoticeContent(content, 1509) + "加入了群聊";
      break;
    case 1511:
      content = getNoticeContent(content) + "解散了群组";
      break;
    case 1512:
      content = getNoticeContent(content,1512);
      break;
    case 1513:
      content = getNoticeContent(content,1513);
      break;
    case 1514:
      content = getNoticeContent(content) + "开启了禁言";
      break;
    case 1515:
      content = getNoticeContent(content) + "关闭了禁言";
      break;
    default:
      let c2 = JSON.parse(content);
      let c3 = JSON.parse(c2.jsonDetail);
      console.log(cType, c2.defaultTips, c3);
      break;
  }
  return content;
}
export function getMessageCardContentType(messageItem) {
  let contentType = 110;
  let latestMsg = messageItem.latestMsg;
  if (!latestMsg) return contentType;
  latestMsg = JSON.parse(latestMsg);
  contentType = latestMsg.contentType;
  return contentType;
}
export function getConversationCardContentType(messageItem) {
  return messageItem.contentType || 110;
}
export function getHistoryCardContentType(item) {
  return item.messageItem.contentType || 110;
}
function getNickname(nickname = "", conversationType = 1) {
  //1、单聊;2、群聊
  if (conversationType === 1) {
    return "";
  }
  return nickname ? nickname + " :" : "";
}
const noticeTypeList = [
  1501, 1502, 1503, 1504, 1505, 1506, 1507, 1508, 1509, 1510, 1511, 1512, 1513,
  1514, 1515, 1516, 1701,
];
export function isNoticeMessage(cType) {
  //是否会话提示信息
  return noticeTypeList.includes(cType);
}
function getNoticeContent(c, cType) {
  let content = JSON.parse(c);
  let jsonDetail = JSON.parse(content.jsonDetail);
  content = jsonDetail.opUser.nickname;
  if (cType === 1509) {
    let invitedUserList = jsonDetail.invitedUserList.map((i) => i.nickname);
    content += "邀请了" + invitedUserList.join("、");
  } else if (cType === 1512) {
    let mutedUser = jsonDetail.mutedUser.nickname;
    let mutedSeconds = jsonDetail.mutedSeconds;
    content = `${mutedUser}被${content}禁言了${mutedSeconds}秒`;
  } else if (cType === 1513) {
    let mutedUser = jsonDetail.mutedUser.nickname;
    content = `${mutedUser}被${content}解除了禁言`;
  }
  return content;
}
