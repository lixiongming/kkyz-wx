import request from "/infrastructure/request/interceptor.js";

export default {
  // 点赞列表
  like_post_list(data: any) {
    return request.get(`message/like_post_list`, data);
  },
  // 互动列表
  interact_message_list(data: any) {
    return request.get(`message/interact_message_list`, data);
  },
  // 创建聊天标识
  create_chat_id(data: any) {
    return request.post(`chat/conversation`, data);
  },
  // 私聊列表
  private_chat_list({ page, pageSize }: any) {
    return request.get(`chat/list?page=${page}&pageSize=${pageSize}`);
  },
  // 发送消息(私聊)
  private_chat_send(data: any) {
    return request.post(`chat/send`, data);
  },
  // 获取获赞、评论、关注等未读消息数量(私聊)
  getmsg_unread_num() {
    return request.get(`message/last_message`);
  },
  // 一键清除未读消息,改为已读(私聊)
  clear_unread_msg(data: any) {
    return request.post(`message/update_read`, data);
  },
  // 消息设置
  setting(data: any) {
    return request.post(`message/setting`, data);
  },
  // 获取消息设置
  getSetting(data: any) {
    return request.get(`message/setting`, data);
  },
  // 关注消息列表
  attentionMessageList(data: any) {
    return request.get(`message/attention_message_list`, data);
  },
  // 系统消息列表
  systemMessageList(data: any) {
    return request.get(`message/system_message_list`, data);
  },
  // 系统消息详情
  systemMessageDetail(id: number) {
    return request.get(`message/system_message_detail?id=${id}`);
  },
  // 清空聊天记录
  deleteMessage(data: any) {
    return request.post(`chat/delete_message`, data);
  },
  // 是否拉黑
  bisBlockedlacklist(id: any) {
    return request.get(`chat/blacklist/is_blocked?block_user_id=${id}`);
  },
  // 加入黑名单
  blacklistAdd(data: any) {
    return request.post(`chat/blacklist/add`, data);
  },
  // 移除黑名单
  blacklistREmove(data: any) {
    return request.post(`chat/blacklist/remove`, data);
  },
  // 获取消息详情列表(私聊)
  private_chat_detail({ conversation_id, first_message_id, page, pageSize }: any) {
    return request.get(`chat/messages?conversation_id=${conversation_id}&first_message_id=${first_message_id}&page=${page}&pageSize=${pageSize}`);
  },
    // 消息删除(私聊)
  private_chat_del(data: any) {
        return request.delete(`chat/deleteChat`, data);
    },
  // 消息撤回(私聊)
  private_chat_withdraw(data: any) {
      return request.post(`chat/withdraw`, data);
  },
  // 获取私信用户信息
  get_user_chat_info({ user_id }: any) {
    return request.get(`chat/userInfo?user_id=${user_id}`);
  },
  // 获取未读消息数量
  unread_num() {
    return request.get(`message/unread_num`);
  },
  // 删除私聊列表某个聊天会话
  del_private_chat(data: any) {
    return request.delete(`chat/delConversation`, data);
  }
};
