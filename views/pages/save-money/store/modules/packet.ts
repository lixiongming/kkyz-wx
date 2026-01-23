import { defineStore } from "pinia";
import { packetApi } from '/views/pages/save-money/api/index.ts';

export default defineStore<any>("packet", {
    state: () => {
        return {
        // 红包--领取记录列表
        draw_list: [],
        // 红包--派发列表
        distribute_list:{
            items:[]
        },
        // 红包--详情
        packet_detail:{},
        // 红包--领取人
        draw_users:[],
        // 红包--评论列表
        reviewList:[],
        // 红包--二级评论列表
        level_comment:[],
        // 红包--是否完成领取
        is_Draw_hongbao:false,
        // 说明配置内容
        config_content: {},
        // 快捷消息
         quick_send:[],
        // 红包列表
        bank_card_list:{
            items:[]
        },
        // 银行列表
        bank_list:{
            items:[]
        },
        // 银行卡详情
        card_detail:{}
        };
    },
    actions: {
        // 红包--领取记录
      async  getDrawList(params:any) {
            const { data } = await packetApi.drawListApi(params)
            this.distribute_list.pageInfo=data.pageInfo
            this.distribute_list.items =this.distribute_list.items.concat(data.items) 
        },
       // 红包--派发列表
      async  distributeList(params:any) {
          const { data } = await packetApi.distributeListApi(params)
          if(Array.isArray(data)){
            this.distribute_list.items=[]
            return 
          }
          this.distribute_list.pageInfo=data?.pageInfo
          this.distribute_list.items =this.distribute_list.items.concat(data?.items) 
       },
      // 红包--详情
      async  packetDetail(params:any) {
          const { data } = await packetApi.packetDetailApi(params)
          this.packet_detail = data
       },
      // 红包--领取人
      async  drawUsers(params:any) {
          const { data } = await packetApi.drawUsersApi(params)
          this.draw_users = data
      },
      // 红包--评论列表
      async  commentList(params:any) {
        console.log(params)
          const { data } = await packetApi.commentListApi(params)
          this.reviewList = data
      },
      // 红包--评论列表
      async  levelComment(params:any) {
          const { data } = await packetApi.levelCommentApi(params)
          this.level_comment = data
          return data
      },
      // 红包--评论
      async  comment(params:any) {
        const { data } = await packetApi.commentApi(params)
       },
      // 红包--发红包
      async  create(params:any) {
        const result = await packetApi.createApi(params)
         return result;
       },
           // 红包--支付
       async  pay(params: any) {
            const { data } = await packetApi.payApi(params)
            return data;
        },
       // 红包--点赞
       async like(params:any) {
          console.log(params)
         const { data } = await packetApi.likeApi(params)
         return data
        },
       // 红包--领取
       async draw(params:any) {
            const { data } = await packetApi.drawApi(params)
        },
      // 红包--关注用户
       async attention(params:any) {
        const { data } = await packetApi.attentionAPI(params)
       },
        // 红包--是否关注他人
        async attentionStatusApi(params:any) {
            const { data } = await packetApi.attentionStatus(params)
            return data
        },
        // 红包--打赏金币
        async reward(params:any) {
            const { data } = await packetApi.rewardApi(params)
            return data
        },
        // 红包--打赏金币
        async explainConfig(type:string) {
            const { data } = await packetApi.explainConfigApi(type)
            this.config_content = data;
            return data
        },
        // 红包--快捷消息
        async getQuickSend() {
            const { data } = await packetApi.getQuickSendApi()
            this.quick_send = data;
        },
        // 红包--银行卡列表
        async getUserBankCardList(params:any) {
            const { data } = await packetApi.getUserBankCardListApi(params)
            this.bank_card_list.pageInfo=data.pageInfo
               data.items.forEach((item:any)=>item.flag=false)
            this.bank_card_list.items =this.bank_card_list.items.concat(data.items) 
        },
        // 红包--编辑银行卡
        async editBanCard(params:any) {
            const { data } = await packetApi.editBanCardApi(params)
        },
        // 红包--新增银行卡
        async saveBankCard(params:any) {
            const { data } = await packetApi.saveBankCardApi(params)
        },
        // 红包--删除银行卡
        async delBank(params:any) {
            const { data } = await packetApi.delBankApi(params)
        },
        // 红包--银行列表
           async getBankList(params:any) {
            const { data } = await packetApi.getBankListApi(params)
            this.bank_list.pageInfo=data.pageInfo
            this.bank_list.items =this.bank_list.items.concat(data.items) 
        },
          // 红包--银行卡详情
        async getBankCardDetail(params:any) {
            const { data } = await packetApi.getBankCardDetailAPi(params)
            this.card_detail=data
        },
     }
}); 
