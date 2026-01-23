import { defineStore } from "pinia";
import { mineApi } from "/views/pages/save-money/api/index.ts";

interface userInfo {
  name: string;
}
export default defineStore<any>("_mine", {
    state: () => {
        return {
            // 任务模块
            // 用户任务列表
            user_task_list: [],
            // 签到任务信息
            sign_in_info: {},
            // 签到完成/失败信息
            sign_in_result: {},
            // 抽奖礼品配置信息
            lottery_config: [],
            // 抽奖结果
            lottery_result: {},
            // 用户基本信息
            my_info:{},
            // 获取大抽奖奖品信息
            Luck_config:{},
            // 新手说明
            help_manual:{},
            // 素材中心
            help_material:{},
            // 在线指导
            help_guide:{},
            // 订单支付信息
            order_pay_info: {},
            // 是否开启轮询
            is_polling: false,
           // 订单支付状态信息
           order_status_info: {},
           //
           checking: false,
           //幸运大抽奖初始化信息
            lottery_init:{},
            // 押注列表
            bet_recordList:{
                items:[],
                pageInfo:{}
            },
            // 中奖兑换码和我的兑换码列表
            bet_code_list:{},
            // 上轮公示
            top_publicity:{},
            // 公共创建订单id
            create_order_id: null,
            // 兑换券明细
            ticket_detail:{
                items:[]
            },

            // ---------------------------------------------------------


        };
    },
    actions: {
        // 任务模块
        // 获取用户任务列表
        async getTaskList() {
            const { data } = await mineApi.getTaskListApi()
            this.user_task_list = data
        },
        // 获取签到任务信息
        async getSignInInfo() {
            const { data } = await mineApi.getSignInInfoApi()
            this.sign_in_info = data
        },
        // 签到
        async signIn(params: any) {
            const { data } = await mineApi.signInApi(params)
            this.sign_in_result = data
            return data;
        },
        // 获取大转盘抽奖礼品配置信息
        async getLotteryConfig() {
            const { data } = await mineApi.getLotteryConfigApi()
            this.lottery_config = data
            return data;
        },
        // 获取任务抽奖结果
        async getLotteryResult(params: any) {
            const { data } = await mineApi.getLotteryResultApi(params)
            this.lottery_result = data
            return data;
        },
        // 检查是否达到大转盘抽奖条件
        async checkDrawLottery(params: any) {
            const { data } = await mineApi.checkDrawLotteryApi(params)
            return data;
        },
        // 获取任务抽奖结果(新版v1)
        async getLotteryResultV1(params: any) {
            const { data } = await mineApi.getLotteryResultV1Api(params)
            this.lottery_result = data
            return data;
        },
        // 检查是否达到大转盘抽奖条件(新版v1)
        async checkDrawLotteryV1(params: any) {
            const { data } = await mineApi.checkDrawLotteryV1Api(params)
            return data;
        },
        // 获取签到抽奖次数
        async getLotteryNum() {
            const { data } = await mineApi.getLotteryNumApi()
            return data;
        },
        // 用户完成某项任务，发放金币
        async completeTask(params: any) {
            const { data } = await mineApi.completeTaskApi(params)
            return data;
        },
        // ----------------------------------------------------
       //获取用户基本信息
           async getUserMyInfo() {
            const { data } = await mineApi.getUserMyInfoApi()
            this.my_info=data
        },
        //获取大抽奖奖品信息
           async getlotteryConfig() {
                const { data } = await mineApi.getlotteryConfigsApi()
                this.Luck_config=data
                this.Luck_config=this.Luck_config.concat(data)
        },
         //获取大抽奖奖品信息
         async getHelpManual(params: any) {
            const { data } = await mineApi.getHelpManualApi(params)
            this.help_manual=data
        },
         //获取大抽奖奖品信息
         async getHelpMaterial(params: any) {
            const { data } = await mineApi.getHelpMaterialApi(params)
            this.help_material=data
         },
          //在线指导
         async getHelpGuide() {
             const { data } = await mineApi.getHelpGuideApi()
             this.help_guide=data
         },
           // 查询订单支付状态
        async payCheckOrderPayStatus(params: any) {
             if (this.checking) return;
             this.checking = true;
             const { data } = await mineApi.payCheckOrderPayStatusApi(params);
             this.checking = false;
             this.order_status_info = data;
         },
      // 获取订单支付参数（通用）
       async payGenerateOrderPayment(order_id: any) {
          let params = {
           order_id: order_id + "",
           pay_type: "sandCashier",
           return_url: "/",
           platform: "H5",
          };
          const { data } = await mineApi.payGenerateOrderPaymentApi(params);
          this.order_pay_info = data;
          // 开始轮询状态
          this.is_polling = true;
        // 跳转收银台
        uni.navigateTo({
            url: `/views/pages/home/webView?url=${data.cashierUrl}`,
        });
          
      },
        //幸运大抽奖初始化信息
        async getlotteryInit() {
            const { data } = await mineApi.getlotteryInitApi()
             this.lottery_init=data
        },
        //押注
        async postlotteryUserBet(params: any) {
            const { data } = await mineApi.postlotteryUserBetApi(params)
            return data
        },
        //押注记录列表
        async getuserBetRecordList(params: any) {
            const { data } = await mineApi.getuserBetRecordListApi(params)
            this.bet_recordList.pageInfo=data.pageInfo
            this.bet_recordList.items =this.bet_recordList.items.concat(data.items) 
        },
        //获取查中奖兑换码和我的兑换码列表
        async getuserBetCodeList(params: any) {
            const { data } = await mineApi.getuserBetCodeListApi(params)
            this.bet_code_list=data
        },
         //上轮公示
         async getlotteryResultAnnounce() {
            const { data } = await mineApi.getlotteryResultAnnounceApi()
            this.top_publicity=data
        },
         // 取消支付
         async payCancelOrder(params: any) {
            const { data, code } = await mineApi.orderCancelApi(params)
            if (code == 200) {
                this.create_order_id = null
            }
        },
        
        // 校验订单状态并取消待支付订单
        async cancelPayOrder () {
            if (!this.create_order_id) return
            const { data } = await mineApi.payCheckOrderPayStatusApi({ order_id: this.create_order_id });
            if (!data.paid) {
                // 订单未支付 取消支付
                await this.payCancelOrder({ order_id: this.create_order_id })
            }
        },
        // 兑换券明细
         async ticketDetail(params: any) {
            const { data, code } = await mineApi.ticketDetailApi(params)
            if (code == 200) {
                this.ticket_detail.pageInfo = data.pageInfo
                this.ticket_detail.items= this.ticket_detail.items.concat(data.items)
            }
        },
    }
}); 
