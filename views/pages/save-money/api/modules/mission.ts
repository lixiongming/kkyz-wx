import request from "/views/pages/save-money/infrastructure/request/interceptor.js";
export default {
  // 用户矩阵任务列表
  expertTaskListApi() {
    return request.get(`expert/task`);
  },
  // 用户矩阵任务列表(版本2)
  expertTaskList2Api(data: any) {
    return request.get(`expert/new_task`, data);
  },
  // 提交任务订单号
  expertSubmitOrderApi(data: any) {
    return request.post(`expert/SubmitOrder`, data);
  },
  // 成为达人申请
  expertBecomeExpertApi(data: any) {
    return request.post(`expert/becomeExpert`, data);
  },
  // 提交橱窗信息
  wechatShopAddApi(data: any) {
    return request.post(`wechat/shop/add`, data);
  },
  // 获取橱窗信息
  getUserWechatShopApi() {
    return request.get(`wechat/shop/detail`);
  },
  // 我的达人导师信息
  getUserExpertMentorInfoApi() {
    return request.get(`expert/expert_info`);
  },
  // 我的达人团队列表
  getMyExpertTeamListApi() {
    return request.get(`expert/team`);
  },
  // 达人导师团队排行榜
  getMyExpertMentorRankingListApi(data: any) {
    return request.get(`expert/ranking?page=${data.page}&pageSize=${data.pageSize}`);
  },
  // 获取勋章列表
  getMedalListApi() {
    return request.get(`expert/medalList`);
  },
  // 领取勋章
  grantMedalApi(data: any) {
    return request.post(`expert/grantMedal`, data);
  },
  // 绑定达人分销码
  bindExpertUserCodeApi(data: any, extra: any) {
    return request.post(`user/bindExpertUserCode`, data, extra);
  },
  // 获取分红记录
  getExpertShareProfitListApi(data: any, extra: any) {
    return request.get(`expert/getExpertShareProfitList`, data);
  },
  // 获取粉丝数据
  getStatFansNumApi() {
    return request.get(`expert/getStatFansNum`);
  },
};