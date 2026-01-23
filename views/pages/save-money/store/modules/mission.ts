import { defineStore } from "pinia";
import { missionApi } from "/views/pages/save-money/api/index.ts";
import useMine from "@/views/pages/save-money/store/modules/mine.ts";

export default defineStore<any>("mission", {
    state: () => {
        return {
            // 矩阵任务列表信息
            task_list_info: {},
            // 用户橱窗信息
            wechat_shop_info: {},
            // 我的达人导师信息
            my_expert_mentor_info: {},
            // 我的达人团队列表
            my_expert_team_list: [],
            // 达人导师团队排行榜
            expert_mentor_team_rank_list: [],
            // 勋章列表
            expert_medal_list: {},
            // 绑定上级的code码
            expert_parent_code: '',
        };
    },
    actions: {
        // 用户矩阵任务列表
        async expertTaskList(params: any) {
            const { data } = await missionApi.expertTaskListApi(params);
            this.task_list_info = data;
        },
        // 用户矩阵任务列表(版本2)
        async expertTaskList2(params: any) {
            const { data } = await missionApi.expertTaskList2Api(params);
            // this.task_list_info = data;
            return data;
        },
        // 提交任务订单号
        async expertSubmitOrder(params: any) {
            await missionApi.expertSubmitOrderApi(params);
        },
        // 成为达人申请
        async expertBecomeExpert(params: any) {
            const { code } = await missionApi.expertBecomeExpertApi(params);
            // 更新用户信息接口
            if (code == 200) {
                await useMine().getUserMyInfo();
            }
        },
        // 提交橱窗信息
        async wechatShopAdd(params: any) {
            const { data } = await missionApi.wechatShopAddApi(params);
			return data;
        },
        // 获取橱窗信息
        async getUserWechatShop() {
            const { data } = await missionApi.getUserWechatShopApi();
            this.wechat_shop_info = data;
			return data;
        },
        // 我的达人导师信息
        async getUserExpertMentorInfo() {
            const { data } = await missionApi.getUserExpertMentorInfoApi();
            this.my_expert_mentor_info = data;
			return data;
        },
        // 我的达人团队列表
        async getMyExpertTeamList() {
            const { data } = await missionApi.getMyExpertTeamListApi();
            this.my_expert_team_list = data;
			return data;
        },
        // 达人导师团队排行榜
        async getMyExpertMentorRankingList(params: any) {
            const { data } = await missionApi.getMyExpertMentorRankingListApi(params);
            this.expert_mentor_team_rank_list = data;
			return data;
        },
        // 获取勋章列表
        async getMedalList() {
            const { data } = await missionApi.getMedalListApi();
            this.expert_medal_list = data;
			return data;
        },
        // 领取勋章
        async grantMedal(params: any) {
            await missionApi.grantMedalApi(params);
        },
        // 绑定达人分销码
        async bindExpertUserCode(parent_expert_user_code: any) {
            const { data } = await missionApi.bindExpertUserCodeApi({ parent_expert_user_code });
            return data;
        },
        // 获取分红记录
        async getExpertShareProfitList(params: any) {
            const { data } = await missionApi.getExpertShareProfitListApi(params);
            return data;
        },
        // 获取粉丝数据
        async getStatFansNum() {
            const { data } = await missionApi.getStatFansNumApi();
            return data;
        },
    },
});