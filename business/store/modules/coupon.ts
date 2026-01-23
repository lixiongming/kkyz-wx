import { defineStore } from "pinia";
import { couponApi } from '/business/api/index.ts'
interface userInfo {
	name : string
}
export default defineStore<any>("coupon", {
	state: () => {
		return {

		};
	},
	actions: {
		// 淘宝 - 获取商品列表
		async getGoodsList(val : object) {
			const { data } = await couponApi.getGoodsListApi(val);
			return data
		},
		// 淘宝 - 将商品链接转换为淘口令
		async changePassword(val : object) {
			const { data } = await couponApi.changePasswordApi(val)
			return data
		},
		//  美团 - 获取优商惠品
		async getCoupon(val : object) {
			const { data } = await couponApi.getCouponApi(val)
			return data
		},
		// 美团 -获取轮播图商品
		async getBanner(val : object) {
			const { data } = await couponApi.getBannerApi(val)
			return data
		},
		// 美团 -获取分享链接
		async getReferralLink(val : object) {
			const { data } = await couponApi.getReferralLinkApi(val)
			return data
		},
		// 美团 -获取广告位商品
		async getRecommend(val : object) {
			const { data } = await couponApi.getRecommendApi(val)
			return data
		},
	}
});