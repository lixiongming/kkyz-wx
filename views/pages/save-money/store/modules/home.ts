import { defineStore } from "pinia";
import { homeApi } from "/views/pages/save-money/api/index.ts";

export default defineStore<any>("my_home", {
  state: () => {
    return {
      // 地址信息
      address_info: {
        location: "",
        city_code: "",
        area_code: "",
      },
      // 首页信息
      homepage_info: {},
      gold_list_data: {
        list: [],
        pageInfo: {},
        gold_text: {},
        gold_num: 0
      },
      taskCenterLuckyStarList: []
    };
  },
  actions: {
    // 赚省首页（领地红包列表）
    async moneyHomepageInfo(params: any) {
      const { data } = await homeApi.moneyHomepageApi(params);
      this.homepage_info = data;
    },
    // 获取用户金币明细列表
    async getGoldList(params: any) {
      const { data } = await homeApi.goldListApi(params);
      let { items, pageInfo, gold_text, gold_num } = data;
      this.gold_list_data.gold_text = gold_text;
      this.gold_list_data.gold_num = gold_num;
      this.homepage_info.user.gold = gold_num; 
      // 处理分页数据Start
      if (params.pageSize > 15) {
        this.gold_list_data.list = items;
      } else {
        this.gold_list_data.list = this.gold_list_data.list.concat(items);
      }
      // 处理分页数据End
      this.gold_list_data.pageInfo = pageInfo;
    },
    // 获取用户幸运星任务列表
    async getTaskCenterLuckyStarList(params: any) {
      const { data } = await homeApi.taskCenterLuckyStarListApi(params);
      this.taskCenterLuckyStarList = data
    },
  },
});
