 
// import store from '@/packages/mall/store/index';
import Cache from '@/infrastructure/utils/cache.js';
// #ifdef H5
// import {
// 	isWeixin
// } from "../utils";
// import auth from './wechat';
// #endif

import { LOGIN_STATUS, USER_INFO, EXPIRES_TIME, STATE_R_KEY } from '@/infrastructure/config/cache.js';
// const Store = store()
function prePage() {
	let pages = getCurrentPages();
	let currentPage = pages[pages.length - 1];
	let route = currentPage.route;
	return route	
}

function objectToQueryString(obj) {
	return Object.entries(obj).map(([key, value]) => `${key}=${value}`).join('&');
}

export function toLogin() {
	let pages = getCurrentPages();
	let currentPage = pages[pages.length - 1];
	let path = currentPage.route;
	let curRoute_options = objectToQueryString(currentPage?.options);
	
	Cache.set('login_back_url', path);

	uni.redirectTo({
		url: curRoute_options ? "/views/pages/mine/login?path=" + `${encodeURIComponent(path + '?' + curRoute_options)}` : "/views/pages/mine/login?path=" + path
	});
}

export function checkLogin() {
	let token = Cache.get(LOGIN_STATUS);
	let expiresTime = Cache.get(EXPIRES_TIME) || 0;
	let newTime = Math.round(new Date() / 1000);
	if (expiresTime < newTime || !token) {
		Cache.clear(LOGIN_STATUS);
		Cache.clear(EXPIRES_TIME);
		Cache.clear(USER_INFO);
		Cache.clear(STATE_R_KEY);
		return false;
	} else {
		// store.UPDATE_LOGIN(token);
		let userInfo = Cache.get(USER_INFO, true);
		if (userInfo) {
			// store.UPDATE_USERINFO(userInfo);
		}
		return true;
	}

}
