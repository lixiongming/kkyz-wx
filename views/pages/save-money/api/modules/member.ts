import request from "/views/pages/save-money/infrastructure/request/interceptor.js";
export default {
  // 会员套餐
  memberPackageApi(data: any) {
    return request.get(`member/package`, data);
  },
  // 购买会员套餐（创建订单）
  memberCreateOrderApi(data: any) {
    return request.post(`member/createOrder`, data);
  },
  // 会员订单完成支付
  memberFinishPayApi(data: any) {
    return request.post(`member/finishPay`, data);
  },

  // 体验官-区县体验官详情
  experienceDetailApi(data: any) {
    return request.get(`experience/detail?area_code=${data.area_code}`);
  },
  // 体验官-购买体验官（创建订单）
  experienceCreateOrderApi(data: any) {
    return request.post(`experience/createOrder`, data);
  },
  // 体验官-体验官订单完成支付
  experienceFinishPayApi(data: any) {
    return request.post(`experience/finishPay`, data);
  },
  // 已购买会员订单列表
  memberListApi(data: any) {
    return request.get(`member/paidOrderList`, data);
  },
  // 获取当前会员红包奖励池
  redEnvelopeRewardPoolApi() {
    return request.post(`member/redPacketPool`);
  },
};
