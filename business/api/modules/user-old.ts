import request from "/infrastructure/request/mall-interceptor.js";
import Cache from "@/infrastructure/utils/cache.js";

/**
 * 获取用户信息
 *
 */
export function getUserInfo() {
  return request.get("user");
}
/**
 * 头像
 *
 */
export function editAvatar(data) {
  return request.post("user/change/info", data);
}

// 修改昵称
export function updateInfo(data) {
  return request.post("user/change/avatar", data);
}
/**
 * h5用户登录
 * @param data object 用户账号密码
 */
export function loginH5(data) {
  return request.post("auth/login", data, {
    noAuth: true,
  });
}
/**
 * h5用户手机号登录
 * @param data object 用户手机号 也只能
 */
export function loginMobile(data) {
  return request.post("auth/mall_sms_login", data, {
    noAuth: true,
  });
}
/**
 * h5用户手机号登录
 * @param data object
 */
export function loginMpPhone(data) {
  return request.post("auth/mp_phone", data, {
    noAuth: true,
  });
}
/**
 * h5获取登录授权auth_token
 * @param data object
 */
export function getAuthType(data) {
  return request.post("auth/mp_login_type", data, {
    noAuth: true,
  });
}
/**
 * 验证码key
 */
export function getCodeApi() {
  return request.get(
    "verify_code",
    {},
    {
      noAuth: true,
    }
  );
}

/**
 * h5用户发送验证码
 * @param data object 用户手机号
 */
export function registerVerify(data) {
  return request.post("auth/send_login_sms", data, {
    noAuth: true,
  });
}
/**
 * h5用户手机号注册
 * @param data object 用户手机号 验证码 密码
 */
export function register(data) {
  return request.post("auth/register", data, {
    noAuth: true,
  });
}

/**
 * 用户手机号修改密码
 * @param data object 用户手机号 验证码 密码
 */
export function registerReset(data) {
  return request.post("/register/reset", data, {
    noAuth: true,
  });
}
/**
 * 用户手机号忘记密码
 */
export function registerForget(data) {
  return request.post("user/change_pwd", data, {
    noAuth: true,
  });
}
/**
 * 获取用户中心菜单
 *
 */
export function getMenuList() {
  return request.get("common/menus", {});
}
/*
 * 签到用户信息
 * */
export function getSignUser() {
  return request.get("user/sign/info");
}

/**
 * 获取签到配置
 *
 */
export function getSignConfig() {
  return request.get("sign/config");
}
/**
 * 获取签到列表
 * @param object data
 */
export function getSignList(data) {
  return request.get("user/sign/lst", data);
}
/**
 * 用户签到
 */
export function setSignIntegral() {
  return request.post("user/sign/create");
}

/**
 * 签到列表(年月)
 * @param object data
 *
 */
export function getSignMonthList(data) {
  return request.get("user/sign/month", data);
}
/**
 * 活动状态
 *
 */
export function userActivity() {
  return request.get("user/activity");
}
/*
 * 资金明细（types|0=全部,1=消费,2=充值,3=返佣）
 * */
export function getCommissionInfo(q, types) {
  return request.get("user/bill", q);
}
/*
 * 提现列表
 * */
export function extractLst(data) {
  return request.get("user/extract/lst", data);
}
/*
 * 积分记录
 * */
export function getIntegralList(data) {
  return request.get("user/integral/lst", data);
}

/**
 * 获取分销海报图片
 *
 */
//#ifdef H5 || APP-PLUS
export function spreadBanner() {
  
  return request.get("user/spread_image", {
    type: "wechat",
  });
}
//#endif
//#ifdef MP
export function spreadBanner() {
  return request.get("user/spread_image", {
    type: "routine",
  });
  
}
//#endif
/**
 *
 * 获取推广用户一级和二级
 * @param object data
 */
export function spreadPeople(data) {
  return request.get("user/spread_list", data);
}
/**
 *
 * 推广佣金/提现总和
 * @param int type
 */
export function spreadCount(type) {
  return request.get("spread/count/" + type);
}
/*
 * 推广数据
 * */
export function getSpreadInfo() {
  return request.get("/commission");
}
/**
 *
 * 推广订单
 * @param object data
 */
export function spreadOrder(data) {
  return request.get("user/spread_order", data);
}
/*
 * 获取推广人排行
 * */
export function getRankList(data) {
  return request.get("user/spread_top", data);
}
/*
 * 获取佣金排名
 * */
export function getBrokerageRank(q) {
  return request.get("user/brokerage_top", q);
}
/**
 * 提现申请
 * @param object data
 */
export function extractCash(data) {
  return request.post("user/extract/create", data);
}
/**
 * 提现银行/提现最低金额
 *
 */
export function extractBank() {
  return request.get("user/extract/banklst");
}
/**
 * 会员等级列表
 *
 */
export function userLevelGrade() {
  return request.get("user/level/grade");
}
/**
 * 获取某个等级任务
 * @param int id 任务id
 */
export function userLevelTask(id) {
  return request.get("user/level/task/" + id);
}
/**
 * 检查用户是否可以成为会员
 *
 */
export function userLevelDetection() {
  return request.get("user/level/detection");
}
/**
 *
 * 地址列表
 * @param object data
 */
export function getAddressList(data) {
  return request.get("user/address/lst", data);
}
/**
 * 设置默认地址
 * @param int id
 */
export function setAddressDefault(id) {
  return request.post("user/address/update/" + id);
}
/**
 * 修改 添加地址
 * @param object data
 */
export function editAddress(data) {
  return request.post("user/address/create", data);
}
/**
 * 删除地址
 * @param int id
 *
 */
export function delAddress(id) {
  return request.post("user/address/delete/" + id);
}
/**
 * 获取单个地址
 * @param int id
 */
export function getAddressDetail(id) {
  return request.get("user/address/detail/" + id);
}
/**
 * 修改用户信息
 * @param object
 */
export function userEdit(data) {
  return request.post("user/edit", data);
}
/*
 * 退出登录
 * */
export function getLogout() {
  return request.post("logout");
}
/**
 * 佣金转入
 *
 */
export function rechargeBrokerage(data) {
  return request.post("user/recharge/brokerage", data);
}
/**
 * 小程序充值
 *
 */
export function rechargeRoutine(data) {
  return request.post("recharge/routine", data);
}
/*
 * 公众号充值
 * */
export function rechargeWechat(data) {
  return request.post("user/recharge", data);
}
/**
 * 获取默认地址
 *
 */
export function getAddressDefault() {
  return request.get("address/default");
}
/**
 * 充值金额选择
 */
export function getRechargeApi() {
  return request.get("common/recharge_quota");
}
/**
 * 登陆记录
 */
export function setVisit(data) {
  return request.post(
    "user/set_visit",
    { ...data },
    {
      noAuth: true,
    }
  );
}
/**
 * 客服列表
 */
export function serviceList(data) {
  return request.get("service/list", data);
}
/**
 * 客服列表
 */
export function serviceLogin(key, data) {
  return request.post("service/scan_login/" + key, data);
}
/**
 * 客服获取客户列表
 */
export function serviceUserList(mer_id, data) {
  return request.get("service/user_list/" + mer_id, data);
}
/**
 * 用户获取聊天记录详情
 */
export function getChatRecord(to_uid, data) {
  return request.get("service/history/" + to_uid, data);
}
/**
 * 客服获取聊天记录详情
 */
export function getMerHistory(userid, mer_id, data) {
  return request.get("service/mer_history/" + mer_id + "/" + userid, data);
}
/**
 * 静默绑定推广人
 * @param {Object} puid
 */
export function spread(puid) {
  Cache.set("spread", puid || 0);
  return request.post("user/spread", {
    spread_spid: puid,
  });
}
/**
 * 反馈类型
 */
export function feedbackType() {
  return request.get("common/feedback_type");
}
/**
 * 提交反馈
 */
export function feedback(data) {
  return request.post("user/feedback", { ...data });
}
/**
 * 反馈列表
 */
export function feedbackList(data) {
  return request.get("user/feedback/list", data);
}
/**
 * 反馈列表
 */
export function feedbackDetail(id) {
  return request.get("user/feedback/detail/" + id);
}
/**
 * 浏览记录
 */
export function historyList(data) {
  return request.get("user/history", data);
}
/**
 * 删除浏览记录
 */
export function historyDelete(id) {
  return request.post("user/history/delete/" + id);
}
/**
 * 批量删除浏览记录
 */
export function historyBatchDelete(data) {
  return request.post("user/history/batch/delete", data);
}
/**
 * 批量收藏浏览记录
 */
export function historyBatchCollect(data) {
  return request.post("user/relation/batch/create", data);
}
/**
 * 佣金记录
 */
export function brokerage_list(data) {
  return request.get("user/brokerage_list", data);
}
/**
 * 佣金数据
 */
export function spreadInfo() {
  return request.get("user/spread_info");
}
// 图片验证码
export function getCaptcha() {
  return request.get(
    "captcha",
    {},
    {
      noAuth: true,
    }
  );
}
// 用户账户列表
export function userAcc() {
  return request.get(
    "user/account",
    {},
    {
      noAuth: true,
    }
  );
}
// 创建发票
export function invoiceSave(data) {
  return request.post("user/receipt/create", data);
}
// 编辑发票
export function invoiceUpdate(id, data) {
  return request.post("user/receipt/update/" + id, data);
}
// 获取默认发票
export function invoiceDefault(id) {
  return request.post("user/receipt/is_default/" + id);
}
// 发票抬头--列表
export function invoice(data) {
  return request.get("user/receipt/lst", data);
}
// 发票抬头--删除
export function invoiceDelete(id) {
  return request.post("user/receipt/delete/" + id);
}
// 发票--详情
export function invoiceDetail(id) {
  return request.get("user/receipt/detail/" + id);
}
/**
 * 新版分享海报信息获取
 *
 */
export function spreadMsg(data) {
  return request.get("user/v2/spread_image", data);
}
/**
 * 图片链接转base64
 *
 */
export function imgToBase(data) {
  return request.post("common/base64", data);
}
/**
 * 获取协议
 *
 */
export function getAgreementApi(key) {
  return request.get("agreement/" + key, {}, { noAuth: true });
}
/**
 * 获取协议
 *
 */
export function getIntegralInfo() {
  return request.get("user/integral/info");
}
/**
 * 获取店铺列表
 *
 */
export function getStoreList(data) {
  return request.get("user/services", data);
}
/*
	获取佣金说明
*/
export function commissionDescription() {
  return request.get("agreement/sys_extension_agree");
}
/*
	获取用户分销等级信息
*/
export function getBrokerageInfo() {
  return request.get("user/brokerage/info");
}
/*
	获取用户分销等级表格数据
*/
export function getBrokerageGrade() {
  return request.get("user/brokerage/all");
}
/*
	分销员升级提醒
*/
export function brokerageNotice(data) {
  return request.get(`user/brokerage/notice`, data);
}
/*
	口令解析
*/
export function pwdResolution(data) {
  return request.get(`command/copy?key=${data}`);
}
/*
	获取佣金说明
*/
export function getInstructions(key) {
  return request.get(`agreement/${key}`);
}
/*
	会员信息
*/
export function memberInfo() {
  return request.get("user/member/info");
}
/**
 * 成长值记录
 * @param object data
 *
 */
export function growthValueRecord(data) {
  return request.get("user/member/log", data);
}
/**
 * 协议规则列表
 * @param object data
 *
 */
export function cacheLst() {
  return request.get("agreement_lst", {}, { noAuth: true });
}
/**
 * 协议规则列表对应的数据
 * @param object data
 *
 */
export function cacheInfo(key) {
  return request.get(`agreement/${key}`, {}, { noAuth: true });
}
/**
 * 注销账户
 * @param object data
 *
 */
export function userOut(data) {
  return request.post(`user/cancel`, data);
}
/**
 * 获取聊天用户信息
 * @param object data
 *
 */
export function serviceUser(merId, uid) {
  return request.get(`service/user/${merId}/${uid}`);
}
/**
 * 保存聊天用户备注
 * @param object data
 *
 */
export function serviceSaveMark(merId, uid, mark) {
  return request.post(`service/mark/${merId}/${uid}`, { mark });
}
/**
 * 获取会员卡类型
 * @param object data
 *
 */
export function memberCard() {
  return request.get(`svip/pay_lst`);
}
/**
 * 开通付费会员--支付
 * @param object data
 *
 */
export function memberCardCreate(id, data) {
  return request.post(`svip/pay/${id}`, data);
}
/**
 * 付费会员权益
 * @param object data
 *
 */
export function memberEquity() {
  return request.get(`svip/user_info`, {}, { noAuth: true });
}
/**
 * 付费会员优惠券
 * @param object data
 *
 */
export function memberCouponLst() {
  return request.get(`svip/coupon_lst`, {}, { noAuth: true });
}
/**
 * 付费会员优惠券--领取
 * @param object data
 *
 */
export function receiveMemberCoupon(id) {
  return request.post(`svip/coupon_receive/${id}`);
}
/**
 * 付费会员--会员商品
 * @param object data
 *
 */
export function groomList(data) {
  return request.get(`svip/product_lst`, data, { noAuth: true });
}
/**
 * 客服聊天--撤回消息
 * @param object data
 *
 */
export function chatReverstApi(id) {
  return request.post(`service/recall/${id}`);
}
/**
 * 客服聊天--判断店铺是否有在线客服
 * @param object data
 *
 */
export function hasServiceApi(id) {
  return request.get(`has_service/${id}`);
}
/**
 * 银行卡提现--银行卡信息
 * @param object data
 *
 */
export function getBankInfo() {
  return request.get(`user/extract/history_bank`);
}

/**
 * 注册检测手机号是否存在  ,修改人: wu
 */
export function existphone(data) {
  return request.post("auth/existphone", data, {
    noAuth: true,
  });
}

/**
 *@用户互转-余额 修改人：吴
 *@@param string duid 收款人id
 *@@param int money 余额数量
 */
export function userToPerMoney(data) {
  return request.get("user/money/trans", data);
}

/**
 * @Description: 用户互转-获取手续费率 ,修改人: 吴
 * @createTime: 2022-12-13 15:15:51
 * @param {uni:订单号} data
 */
export function getTransCharge(data) {
  return request.get("user/get_trans_charge", data);
}

/**
 * @Description:  设置/重置支付密码（重置功能弃用）,修改人: 吴
 * @createTime: 2022-12-13 15:16:56
 * @param {type:是否首次设置密码} data
 */
export function postPayPwd(data) {
  return request.post("user/edit_pay_pwd", data);
}

/**
 * @description :  重置支付密码-旧密码-验证旧支付密码,修改人: 吴
 * @createTime : 2023-12-13 15:18:46
 */
export function payPwdOldCheck(data) {
  return request.post("user/pay_pwd_old_check", data);
}

/**
 * @description : 重置支付密码-旧密码-验证并重置,修改人:吴
 */
export function payPwdChangeCheck(data) {
  return request.post("user/pay_pwd_change_check", data);
}

/**
 * @description : 重置支付密码-验证码-验证并重置，修改人: 吴
 */
export function payPwdBySms(data) {
  return request.post("user/pay_pwd_by_sms", data);
}

/**
 *
 * 用户互转-上级/下级/全平台列表 吴
 * @param object data
 */

export function spreadPeopleb(data) {
  return request.post("user/spread/people/sc", data);
}

/**
 * 用户互转-最近转账人列表 吴
 */
export function getNearMoney() {
  return request.get("user/nearly_trans");
}

/**
 * @description : 获取实名认证信息,修改人: 甘
 * @createTime : 2024-01-20 09:42:44
 */
export function getUserCertificate(data) {
  return request.post("user/certification", data);
}

/**
 * @description : 用户实名认证状态，修改人: 甘
 * @createTime : 2024-01-20 09:42:44
 */
export function certificateCreateApi(data) {
  return request.get("user/certification/detail", data);
}

/**
 * @description : 实名认证上传身份证图片，解析图片信息接口
 * @createTime : 2024-01-20 09:42:44
 */
export function getExtractIdCardInfo(data) {
  return request.post("user/extract_id_card_info", data);
}
/**
 * @description :  获取boss系统用户数据,修改人: gan
 * @createTime : 2024-01-31 10:56:42
 */
export function getBossInfoApi(data) {
  return request.get("user/wallet_data", data);
}

/**
 * @description :  三方登录 修改人: 申
 * @createTime : 2024-01-31 10:56:42
 */
export function middle_login(data) {
  return request.post("auth/middle/login", data, {
    noAuth: true,
  });
}

/**
 * @description :  校验验证码 修改人: 申
 * @createTime : 2024-05-29 10:56:42
 */
export function user_code_verifyAPi(data) {
  return request.post("auth/user_code_verify", data, {
    noAuth: true,
  });
}
/**
 * @description : 获取企业申请列表
 * @createTime : 2024-05-29 10:56:42
 */
export function getEnterprises(data) {
  return request.post("h5/salesman/get_enterprises_list", data);
}
/**
 * @description : 获取企业申请详情
 * @createTime : 2024-05-29 10:56:42
 */
export function getApplyDetails(data) {
  return request.post("h5/salesman/get_apply_details", data);
}
/**
 * @description : 审核企业
 * @createTime : 2024-05-29 10:56:42
 */
export function salesmanAudit(data) {
  return request.post("h5/salesman/audit", data);
}
/**
 * @description : 待审核商品列表
 * @createTime : 2024-05-29 10:56:42
 */
export function getAuditGoods(data) {
  return request.post("h5/salesman/audit_goods_list", data);
}
/**
 * @description : 审核商品
 * @createTime : 2024-05-29 10:56:42
 */
export function auditGoods(data) {
  return request.post("h5/salesman/audit_goods", data);
}

/**
  * @description :  获取商品审核信息
  * @createTime : 2024-05-30 10:46:00
*/
export function  getGoodsExamineInfo(data){
	return request.post('h5/salesman/audit_goods_details',data)
}

/**
  * @description :  根据分销系统TOKEN获取看看宇宙项目TOKEN
  * @createTime : 2024-05-30 10:46:00
*/
export function  autoLogin(data){
	return request.post('auth/auto_login',data, { noAuth : true})
}

// 获取提现手续费
export function getExtractCharge(data) {
	return request.get('user/extract/get_trans_charge', data);
}

// 获取用户银行卡列表
export function getbankCardList(data) {
	return request.get('user/bank_card/list', data);
}

// 新增/编辑用户银行卡信息
export function editbankCard(data) {
	return request.post('user/bank_card/save', data);
}

// 提现-申请米粒提现
export function extractBossPriceCash(data) {
	return request.post('user/extract/create_boss_price', data)
}

// 获取支持提现的银行列表
export function getBankList(data) {
	return request.get('user/member/get_bank_list', data)
 }

//  获取我的结算账户
export function getMember(data) {
	return request.get('user/member/list', data)
}

// 获取提现日志
export function getExtractList(data, type) {
	return request.get(`user/extract/list`, data)
}

// 获取结算日志
export function getSettlementList(data, type) {
	return request.get(`user/extract/settle_account_details`, data)
}

// 兑换券兑换米粒
export function greenToBossPriceApi(data) {
	return request.post('user/green_integral/exchange_boss_price', data)
}

// 获取公告列表
export function getNoticeListApi(data) {
	return request.get('user/notice/list', data, {
		noAuth: true
	})
}

/**
 * @description 获取店铺用户信息
 */
export function getShareBenefitUserInfo(data) {
  return request.get(`user/shareBenefit/getShareBenefitUserInfo`, data)
}

/**
 * @description 获取商户列表
 */
export function getShareBenefitMerchant(data) {
  return request.get(`user/shareBenefit/getShareBenefitMerchant`, data)
}

/**
 * @description 获取团队列表
 */
export function getSubUserList(data) {
  return request.get(`user/shareBenefit/getSubUserList`, data)
}

/**
 * @description 获取收益列表
 */
export function getEarningsList(data) {
  return request.get(`user/shareBenefit/getEarningsList`, data)
}

/**
 * @description 获取收益列表
 */
export function getQrcode(data) {
  return request.get(`store/merchant/qrcode/${data}`, data)
}

/**
 * @description 商户爆单房队伍列表
 */
export function merchantRoomList(data) {
  return request.get(`explosive/merchantRoom/list`, data)
}

/**
 * @description 爆单房队伍列表
 */
export function roomTeamList(data) {
  return request.get(`explosive/room/teamList`, data)
}
/**
 * @description 加入或创建爆单房队伍
 */
export function createJoin(data) {
  return request.post(`explosive/userRoom/createJoin`, data)
}

/**
 * @description 查看爆单房内用户数据
 */
export function userRoomUserData(data) {
  return request.get(`explosive/userRoom/users`, data)
}

/**
 * @description 查看爆单房内用户数据
 */
export function merchantRoomTeam(data) {
  return request.get(`explosive/merchantRoom/team`, data)
}
/**
 * @description 用户商户消费积分收入列表
 */
export function expIncomeList(id, data) {
  return request.get(`explosive/integralLog/expIncomeList/${id}`, data)
}
/**
 * @description 用户商户消费积分支出列表
 */
export function expOutList(id, data) {
  return request.get(`explosive/integralLog/expOutList/${id}`, data)
}
/**
 * @description 用户兑换积分收入列表
 */
export function superIncomeList(data) {
  return request.get(`explosive/integralLog/superIncomeList`, data)
}
/**
 * @description 用户兑换积分支出列表
 */
export function superOutlayList(data) {
  return request.get(`explosive/integralLog/superOutlayList`, data)
}

/**
 * @description 爆单房列表（返回所有商户）
 */
export function roomList(data) {
  return request.get(`explosive/room/list`, data)
}

/**
 * @description 查看爆单房内用户数据
 */
export function userRoomUsers(data) {
  return request.get(`explosive/userRoom/users`, data)
}

/**
 * @description 爆单房分页列表
 */
export function roomPageList(data) {
  return request.get(`explosive/room/pageList`, data)
}

/**
 * @description 查看该商户更多爆单房
 */
export function roomMore(data) {
  return request.get(`explosive/room/more`, data)
}
/**
 * @description 新品孵化数据统计
 */
export function dashboardDataApi() {
  return request.get(`user/new-products/dashboard-data`)
}
/**
 * @description 获取渠道商配置业务员信息
 */
export function getSalesmanChannlInfoApi() {
  return request.get(`h5/salesman/get_user_channel`)
}

// 看看宇宙新菜单栏接口
export function authMenusApi(data) {
	return request.get(`auth/menus`,data);
}

// 看看宇宙指定菜单栏接口
export function authTopMenusApi(data) {
	return request.get(`auth/topMenus`,data);
}
// 添加潜在商户
export function addPotentialMerApi(data) {
	return request.post(`h5/salesman/addPotentialMer`,data);
}
// 获取商户信息
export function getMerInfoApi(data) {
	return request.post(`h5/salesman/getMerInfo`,data);
}
/**
 * @description 业务员-潜在商户列表
 */
export function getPotentialMerListApi(data) {
  return request.get(`h5/salesman/potentialMerList`, data)
}
/**
 * @description 业务员-潜在商户列表
 */
export function potentialMerRemarkListApi(data) {
  return request.get(`h5/salesman/potentialMerRemarkList`, data)
}
// 获取用户个人资料（团队）
export function addPotentialMerRemarkApi(data) {
	return request.post(`h5/salesman/addPotentialMerRemark`, data);
}
// 获取奖励统计
export function getSalesmanTicketTotalApi(data) {
	return request.get(`h5/salesman/getSalesmanTicketTotal`, data);
}
// 获取奖励列表
export function getSalesmanTicketListlApi(data) {
	return request.get(`h5/salesman/getSalesmanTicketList`, data);
}
// 获取奖励详情
export function getgetSalesmanTicketDetailsApi(data) {
	return request.get(`h5/salesman/getSalesmanTicketDetails`, data);
}
