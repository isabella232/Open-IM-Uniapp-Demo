
export default   {
    userInfo: state => state.user.userInfo,
    platform: state => state.user.platform,
    operationID: state => state.user.operationID,
    userID: state => state.user.userID,
    token: state => state.user.token,
    messageList: state => state.message.messageList,
    successTimes: state => state.message.successTimes,
    newMessageTimes: state => state.message.newMessageTimes,
  }