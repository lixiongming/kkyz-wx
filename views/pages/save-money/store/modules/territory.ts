import { defineStore } from "pinia";
import { territoryApi } from "/views/pages/save-money/api/index.ts";
import useMine from "@/views/pages/save-money/store/modules/mine.ts";

export default defineStore<any>("territory", {
  state: () => {
    return {
      // 领地详情
      landlord_detail: {},
      // 领地出售记录
      sell_records:[],
      // 公告信息
      announcement_info: {
        area_code: "",
        board: "",
      },
      landlord_list_data: {
        list: [],
        pageInfo: {},
      },
      create_order_id: null,
    };
  },
  actions: {
    // 我的领地列表
    async getLandlordList(params: any) {
      const { data } = await territoryApi.landlordListApi(params);
      let { items, pageInfo } = data;
      // 处理分页数据Start
      if (params.pageSize > 15) {
        this.landlord_list_data.list = items;
      } else {
        this.landlord_list_data.list =
          this.landlord_list_data.list.concat(items);
      }
      // 处理分页数据End
      this.landlord_list_data.pageInfo = pageInfo;
    },
    // 获取全部领地列表
    async getAllLandlordList(params: any) {
      const { data } = await territoryApi.landlordListApi({
        status: 1,
        page: 1,
        pageSize: 15,
      });
      return data
    },
    // 购买领地-创建订单
    async landlordCreateOrder(params: any) {
      const { data } = await territoryApi.landlordCreateOrderApi(params);
      // this.create_order_id = data.order_id;
      useMine().create_order_id = data.order_id;
    },
    // 购买领地-提交订单
    async landlordFinishPay(params: any) {
      const { data } = await territoryApi.landlordFinishPayApi(params);
      return data;
    },
    // 获取用户任务列表
    async landlordSell(params: any) {
      const { data } = await territoryApi.landlordSellApi(params);
    },
    // 领地详情
    async landlordDetail(params: any) {
      const { data } = await territoryApi.landlordDetailApi(params);
      this.landlord_detail = data;
    },
    // 出售领地撤回
    async landlordWithdrewSell() {
      const { data } = await territoryApi.landlordWithdrewSellApi({id:this.sell_records.id});
    },
    // 领地出售进度
    async landlordsellDetaill(params: any) {
      const { data } = await territoryApi.landlordsellDetaillApi(params);
      this.sell_records=data
    },
    // 设置公告牌
    async landlordSetting(params: any) {
      const { data } = await territoryApi.landlordSettingApi(
        this.announcement_info
      );
    },
    // 删除已售出领地数据
    async landlordDel(params: any) {
      const { data } = await territoryApi.landlordDelApi(params);
    },
  },
});
