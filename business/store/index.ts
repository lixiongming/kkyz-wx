import { defineStore } from "pinia";
interface userInfo {
	name : string
}
const systemInfo = uni.getSystemInfoSync();

// 保存变量到本地存储中
const saveLifeData = (key, value) => {
	// 判断变量名是否在需要存储的数组中
	if (saveStateKeys.indexOf(key) != -1) {
		// 获取本地存储的lifeData对象，将变量添加到对象中
		let tmp = uni.getStorageSync('lifeData_' + env) || {};
		tmp[key] = value;
		// 执行这一步后，所有需要存储的变量，都挂载在本地的lifeData对象中
		uni.setStorageSync('lifeData_' + env, tmp)
	}
}
export default defineStore<any>("main", {
	state: () => {
		return {
			$screenHeight: systemInfo.screenHeight,
			windowHeight: systemInfo.windowHeight,
			$windowWidth: systemInfo.screenWidth,
			$windowBottom: systemInfo.windowBottom,
			$statusBarHeight: systemInfo.statusBarHeight,
			$px: systemInfo.screenWidth / 375,
			$safeAreaInsetsBottom: systemInfo.safeAreaInsets.bottom,
			token: uni.getStorageSync('token') || '',
			middle_token: uni.getStorageSync('middle_token') || '',
			tabbar_name:'home',
			// 裁剪图片缓存数据
			cropper_data: {
				// 裁剪返回图片
                result_src: '',
				// 离开页面，其他缓存数据
				extra_data: null,
			},
			// 是否通过分享进入小程序
			is_from_share: false,
			// 是否通过朋友圈分享进入小程序
			is_wechat_moments_share: false,
		};
	},
	actions: {
	}
});