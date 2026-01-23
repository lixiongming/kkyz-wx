import { defineStore } from "pinia";
import { memberApi } from "/views/pages/save-money/api/index.ts";
import useMine from "@/views/pages/save-money/store/modules/mine.ts";

export default defineStore<any>("member", {
  state: () => {
    return {
        // 会员套餐
        member_package: [],
        create_order_id: null,
        
        // 体验馆模块
        // 区县体验官详情
        experience_office_detail: {},
        // 购买体验官（创建订单）
        experience_office_order: {},
        // 体验官订单完成支付
        experience_office_finish: {},
        // 已购买会员订单列表
        member_list: [],
        redEnvelopeRewardPool: 0

    };
  },
  actions: {
    // 会员套餐
    async getMemberPackage(params: any) {
      const { data } = await memberApi.memberPackageApi(params);
      this.member_package = data
    },
    // 购买会员套餐（创建订单）
    async memberCreateOrder(params: any) {
      const { data } = await memberApi.memberCreateOrderApi(params);
      // this.create_order_id = data.order_id;
      useMine().create_order_id = data.order_id;
    },
    // 会员订单完成支付
    async memberFinishPay(params: any) {
      const { data } = await memberApi.memberFinishPayApi(params);
    },
    // 体验官模块
    // 区县体验官详情
    async experienceDetail(params: any) {
      const { data } = await memberApi.experienceDetailApi(params);
      this.experience_office_detail = data;
    },
    // 购买体验官（创建订单）
    async experienceCreateOrder(params: any) {
      const { data } = await memberApi.experienceCreateOrderApi(params);
      // this.experience_office_order = data;
      useMine().create_order_id = data.order_id;
    },
    // 体验官订单完成支付
    async experienceFinishPay(params: any) {
      const { data } = await memberApi.experienceFinishPayApi(params);
      this.experience_office_finish = data;
    },
    // ---------------------------------------------------------
    // 已购买会员订单列表
    async getMemberList(params: any) {
      const { data } = await memberApi.memberListApi(params);
      this.member_list = data.items
    },
    // 获取当前会员红包奖励池
    async getRedEnvelopeRewardPool() {
      const { data } = await memberApi.redEnvelopeRewardPoolApi();
      this.redEnvelopeRewardPool = data.ticket
    },
  },
});
