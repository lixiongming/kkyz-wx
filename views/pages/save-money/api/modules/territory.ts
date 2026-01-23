import request from "/views/pages/save-money/infrastructure/request/interceptor.js";
export default {
  // 领主模块
  // 我的领地列表
  landlordListApi(data: any) {
    return request.get(`landlord/list`, data);
  },
  // 领地详情
  landlordDetailApi(data: any) {
    return request.get(`landlord/detail`, data);
  },
  // 购买领地-创建订单
  landlordCreateOrderApi(data: any) {
    return request.post(`landlord/createOrder`, data);
  },
  // 购买领地-提交订单
  landlordFinishPayApi(data: any) {
    return request.post(`landlord/finishPay`, data);
  },
  // 出售领地
  landlordSellApi(data: any) {
    return request.post(`landlord/sell`, data);
  },
  // 出售领地撤回
  landlordWithdrewSellApi(data: any) {
    console.log(data);
    return request.post(`landlord/withdrewSell`, data);
  },
  // 领地出售进度
  landlordsellDetaillApi(data: any) {
    console.log(data);
    return request.get(`landlord/sellDetail`, data);
  },
  // 设置公告牌
  landlordSettingApi(data: any) {
    return request.post(`landlord/setting`, data);
  },
  // 删除已售出领地数据
  landlordDelApi(data: any) {
    return request.delete(`landlord/del`, data);
  }
};
