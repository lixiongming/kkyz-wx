import request from "/infrastructure/request/mall-interceptor.js";
// 获取商户详情
export function fetchMerchantInfoApi(data) {
	return request.post('offline/merchant/fetchMerchantInfo', data, {
		noAuth: true,
		noPrefix: true,
        isMall: true
	})
}

// 获取商户视频
export function getVideoApi(data) {
    return request.get(`offline/merchant/getVideo?mer_id=${data.mer_id}`, {}, {
        noAuth: true,
		noPrefix: true,
        isMall: true
	})
}

/**
 * 获取首页DIY；
 */
export function getDiy(data) {
	return request.get('diy',data,{ noAuth: true, isMall: true });
}

/**
 * diy-小程序直播
 * @param {Object} data
 */
export function getLiveData(data) {
	return request.get("diy/broadcast", data, {
		noAuth: true,
		isMall: true
	});
}

/**
 * 直播列表
 * @returns {*}
 */
export function getBroadcastListApi(data) {
	return request.get("broadcast/lst", data, {
		noAuth: true,
		isMall: true
	});
}

/**
 * 获取用户信息
 *
 */
export function getUserInfo() {
	return request.get("user");
}

/**
 * @description :  三方登录
 * @createTime
 */
export function middle_login(data) {
	return request.post("auth/middle/login", data, {
		noAuth: true,
		isMall: true
	});
}

// 获取订单详细信息（商城）
export function groupOrderDetail(order_id){
	return request.get('order/group_order_detail/'+order_id);
}

/**
 * 订单支付
 * @param object data
*/
export function orderPay(id){
	return request.post('order/mini/pay/'+id);
}

/**
 * 用户绑定小程序账号
 * @param object data
*/
export function bindUserRouteId(data){
	return request.post('user/wechat/bindUserRouteId',data);
}

// 支付状态订单
export function getPayOrder(uni){
	return request.get('order/status/'+uni);
}

// 扫用户支付营销码
export function getUserFetchUidMarketingCodeInfo(data) {
	return request.post('offline/user/fetchUidMarketingCodeInfo', data, {
		noAuth: true,
		noPrefix: true,
        isMall: true
	})
}

// 获取一条用户广告位视频号信息
export function userGetVideo(uid) {
    return request.get(`offline/user/getVideo?uid=${uid}`, {}, {
        noAuth: true,
		noPrefix: true,
        isMall: true
	})
}

// 获取附近商户
export function merOfflineNearbyApi(data: any) {
    return request.get(`api/h5/mer_offline/nearby`, data, {
        noAuth: true,
		noPrefix: true,
        isMall: true
	})
}