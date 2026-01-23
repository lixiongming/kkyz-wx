import request from "/views/pages/save-money/infrastructure/request/interceptor.js";
export default {
  // 任务模块接口
  // 获取用户任务列表
  getTaskListApi(data: any) {
    return request.get(`task/center/list`, data);
  },
  // 获取签到任务信息
  getSignInInfoApi(data: any) {
    return request.get(`task/center/getSignInInfo`, data);
  },
  // 签到
  signInApi(data: any) {
    return request.post(`task/center/signIn`, data);
  },
  // 获取大转盘抽奖礼品配置信息
  getLotteryConfigApi(data: any) {
    return request.get(`lottery/config`, data);
  },
  // 获取执行抽奖结果
  getLotteryResultApi(data: any) {
    return request.get(`lottery/result`, data);
  },
  // 检查是否达到大转盘抽奖条件
  checkDrawLotteryApi() {
    return request.get(`task/center/checkDrawLottery`);
  },
  // 获取执行抽奖结果(新版v1)
  getLotteryResultV1Api(data: any) {
    return request.post(`lottery/lottery`, data);
  },
  // 检查是否达到大转盘抽奖条件(新版v1)
  checkDrawLotteryV1Api(data: any) {
    return request.post(`lottery/checkLottery`, data);
  },
  // 获取签到抽奖次数
  getLotteryNumApi() {
    return request.get(`lottery/getLotteryNum`);
  },
  // 用户完成某项任务，发放金币
  completeTaskApi(data: any) {
    return request.post(`task/center/completeTask`, data);
  },
  // ---------------------------------------------------
  // 获取用户个人中心基础信息
  getUserMyInfoApi() {
    return request.get(`my/index`);
  },
  // 获取大抽奖奖品信息
  getlotteryConfigApi() {
    return request.get(`luckyLottery/config`);
  },
  // 新手说明
  getHelpManualApi(data: any) {
    return request.get(`help/manual`, data);
  },
  // 素材中心
  getHelpMaterialApi(data: any) {
    return request.get(`help/material`, data);
  },
  // 在线指导
  getHelpGuideApi() {
    return request.get(`help/guide`);
  },
  // 获取订单支付参数（通用）
  payGenerateOrderPaymentApi(data: any) {
    return request.post(`pay/generateOrderPayment`, data);
  },
  // 查询订单支付状态
  payCheckOrderPayStatusApi(data: any) {
    return request.get(`pay/checkOrderPayStatus`, data);
  },
  // 获取大抽奖奖品信息
  getlotteryConfigsApi() {
    return request.get(`luckyLottery/config`);
  },
  // 获取大抽奖奖品信息
  getlotteryInitApi() {
    return request.get(`luckyLottery/init`);
  },
  // 押注
  postlotteryUserBetApi(data: any) {
    return request.post(`luckyLottery/userBet`, data);
  },
  // 押注记录列表
  getuserBetRecordListApi(data: any) {
    return request.get(`luckyLottery/userBetRecordList`, data);
  },
  // 获取查中奖兑换码和我的兑换码列表
  getuserBetCodeListApi(data: any) {
    return request.get(`luckyLottery/userBetCodeList`, data);
  },
  // 上轮公示
  getlotteryResultAnnounceApi() {
    return request.get(`luckyLottery/lotteryResultAnnounce`);
  },
  // 取消支付
  orderCancelApi(data: any) {
    return request.post(`order/cancel`,data);
  },
  // 兑换券明细
  ticketDetailApi(data: any) {
      return request.get(`ticket/detail`,data);
   },
};
