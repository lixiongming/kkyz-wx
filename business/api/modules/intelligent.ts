import request from "/infrastructure/request/interceptor.js";

/**
 * 达人带货判定
 */
export function getSatisfyConditionApi() {
	return request.get("mall/sell/satisfyCondition");
}

/**
 * 我的带货列表
 */
export function getMySellProductApi(data: any) {
	return request.get('mall/sell/mySellProduct', data,)
}
/**
 * 选品中心列表
 */
export function selectionProductListApi(data: any) {
	return request.get('mall/sell/selectionProductList', data,)
}

/**
 *  选品中心-带货
*/
export function addSellProductApi(data: any) {
	return request.post('mall/sell/addSellProduct', data,)
}

/**
 * 选品中心-分类列表
*/
export function getCategoryListApi(data: any) {
	return request.get('mall/sell/getCategoryList', data,)
}

/**
 * 带货操作
 */
export function operateProductApi(data: any) {
	return request.post('mall/sell/operateProduct', data)
}

/**
 * 佣金规则
 */
export function getExplainApi(data: any) {
	return request.get('knowledge/explain', data)
}

/**
 * 获取累积消费满足最小金额
 */
export function getSatisfyAmountApi(data: any) {
	return request.get('mall/sell/satisfyAmount', data)
}
