import request from "/views/pages/save-money/infrastructure/request/interceptor.js";
export default {
  // 赚省首页（领地红包列表）
  moneyHomepageApi(data: any) {
    return request.get(`money/homepage`, data);
  },
  // 获取用户金币明细列表
  goldListApi(data: any) {
    return request.get(`gold/list`, data);
  },
  // 获取用户幸运星任务列表
  taskCenterLuckyStarListApi(data: any) {
    return request.get(`task/center/luckyStarList`, data);
  }
};
