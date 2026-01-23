
import request from "/views/pages/save-money/infrastructure/request/interceptor.js";
export default {
    // 红包--领取记录
    drawListApi(data: any) {
        return request.get(`hongbao/drawList`,data);
    },
    // 红包--派发列表
    distributeListApi(data: any) {
        return request.get(`hongbao/list`,data);
    },
   // 红包--派发列表
    packetDetailApi(data: any) {
        return request.get(`hongbao/detail`,data);
    },
    // 红包--领取人
    drawUsersApi(data: any) {
        return request.get(`hongbao/drawUsers`,data);
    },
    // 红包--评论列表
    commentListApi(data: any) {
        return request.get(`hongbao/commentList`,data);
    },
    // 红包--二级评论列表
    levelCommentApi(data: any) {
        return request.get(`hongbao/levelComment`,data);
    },
    // 红包--评论
    commentApi(data: any) {
        return request.post(`hongbao/comment`,data);
    },
    // 红包--发红包
    createApi(data: any) {
        return request.post(`hongbao/create`,data);
    },
    // 红包--点赞
    likeApi(data: any) {
        return request.post(`hongbao/like`,data);
    },
    // 红包--支付
    payApi(data: any) {
        return request.post(`hongbao/finishPay`,data);
    },
    // 红包--支付
    drawApi(data: any) {
         return request.post(`hongbao/draw`,data);
     },
    // 关注他人或者取消关注接口
    attentionAPI(data: any) {
       return request.post(`user/attention`, data);
    },
    // 是否关注他人
    attentionStatus(data: any) {
        return request.get(`user/attentionStatus`, data);
    },
    // 打赏金币
    rewardApi(data: any) {
        return request.post(`hongbao/reward`, data);
    },
    // 说明配置内容
    explainConfigApi(type: string) {
        return request.get(`knowledge/explain?tag=${type}`);
    },
    // 打赏金币
    getQuickSendApi(data: any) {
        return request.get(`help/quick_send`, data);
    },
     // 银行卡列表
     getUserBankCardListApi(data: any) {
        return request.get(`userBank/getUserBankCardList`, data);
    },
    // 新增银行卡
    saveBankCardApi(data: any) {
        return request.post(`userBank/saveBankCard`, data);
    },
    // 编辑银行卡
     editBanCardApi(data: any) {
        return request.post(`userBank/editBanCard`, data);
    },
     // 删除银行卡
     delBankApi(data: any) {
        return request.post(`userBank/delBank`, data);
    },
    //银行列表
     getBankListApi(data: any) {
        return request.get(`userBank/getBankList`, data);
      },
    //银行详情
     getBankCardDetailAPi(data: any) {
        return request.get(`userBank/getBankCardDetail`, data);
      },
};

