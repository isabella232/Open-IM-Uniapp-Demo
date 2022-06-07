const state = {
  messageList: [],
  messageType: {
    TEXTMESSAGE: 101,
    PICTUREMESSAGE: 102,
    VOICEMESSAGE: 103,
    VIDEOMESSAGE: 104,
    FILEMESSAGE: 105,
    ATTEXTMESSAGE: 106,
    MERGERMESSAGE: 107,
    CARDMESSAGE: 108,
    LOCATIONMESSAGE: 109,
    CUSTOMMESSAGE: 110,
    REVOKEMESSAGE: 111,
    HASREADRECEIPTMESSAGE: 112,
    TYPINGMESSAGE: 113,
    QUOTEMESSAGE: 114,
    FACEMESSAGE: 115,
    FRIENDAPPLICATIONAPPROVED: 1201,
    FRIENDAPPLICATIONREJECTED: 1202,
    FRIENDAPPLICATIONADDED: 1203,
    FRIENDADDED: 1204,
    FRIENDDELETED: 1205,
    FRIENDREMARKSET: 1206,
    BLACKADDED: 1207,
    BLACKDELETED: 1208,
    SELFINFOUPDATED: 1303,
    NOTIFICATION: 1400,
    GROUPCREATED: 1501,
    GROUPINFOUPDATED: 1502,
    JOINGROUPAPPLICATIONADDED: 1503,
    GROUPMEMBERQUIT: 1504,
    GROUPAPPLICATIONACCEPTED: 1505,
    GROUPAPPLICATIONREJECTED: 1506,
    GROUPOWNERTRANSFERRED: 1507,
    MEMBERKICKED: 1508,
    MEMBERINVITED: 1509,
    MEMBERENTER: 1510,
    GROUPDISMISSED: 1511,
    GROUPMEMBERMUTED: 1512,
    GROUPMEMBERCANCELMUTED: 1513,
    GROUPMUTED: 1514,
    GROUPCANCELMUTED: 1515,
    GROUPMEMBERINFOUPDATED: 1516,
    BURNMESSAGECHANGE: 1701,
  },
  successTimes: 0,
  newMessageTimes: 0,
};
const mutations = {
  setMessageList(state, messageList) {
    state.messageList = messageList;
  },
  set_successTimes(state) {
    state.successTimes++;
  },
  set_newMessageTimes(state) {
    state.newMessageTimes++;
  },
};
const actions = {};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
};