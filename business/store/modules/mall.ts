import {getUserInfo} from '@/business/api/modules/mall.ts';
// import { LOGIN_STATUS, UID, USER_CODE, USER_INFO } from '@/infrastructure/config/modules/cache';
let LOGIN_STATUS = 'LOGIN_STATUS_TOKEN';
let UID = 'UID'
let USER_CODE = 'USER_CODE'
let USER_INFO = 'USER_INFO'
import Cache from '@/infrastructure/utils/cache';
import { defineStore } from "pinia";

export default defineStore("mall_app", {
	state: () => {
		return {
            token: Cache.get(LOGIN_STATUS) || null,
            isLogin:!!Cache.get(LOGIN_STATUS),
            backgroundColor: "#fff",
            userInfo: null,
            uid: Cache.get(UID) || null,
            user_code:Cache.get(USER_CODE) || null,
            globalData: uni.getStorageSync('GLOBAL_DATA') || {},
            homeActive: false,
            copyPwd: null,
            pageFooter:uni.getStorageSync('pageFoot') || {},
            keyColor: Cache.get('KEY_COLOR') || '_default',
            viewColor: Cache.get('VIEW_COLOR') || '--view-theme: #1DB0FC;--view-assist:#FF7612;--view-priceColor:#1DB0FC;--view-bgColor:rgba(255, 118, 18,.1);--view-minorColor:rgba(233, 51, 35,.1);--view-bntColor11:#FDA923;--view-bntColor12:#FD6523;--view-bntColor21:#F11B09;--view-bntColor22:#F67A38;',
            localViewColor: Cache.get('LOCAL_VIEW_COLOR') || '--view-theme: #111111;--view-assist:#000000;--view-priceColor:#FF4D25;--view-bgColor:#00DCEE;--view-noSelectColor:#777777',
            localKeyColor: Cache.get('LOCAL_KEY_COLOR') || '_cyan',
            discounts_json: {}
        };
	},
	actions: {
        LOGIN(opt) {
            this.token = opt.token;
            Cache.set(LOGIN_STATUS, opt.token, opt.time);
            uni.removeStorageSync('auth_token');
        },
        SETUID(val){
            this.uid = val;
            Cache.set(UID, val);
        },
        SETUSER_CODE(val){
            this.user_code = val;
            Cache.set(USER_CODE, val);
        },
        UPDATE_LOGIN(token) {
            this.token = token;
        },
        LOGOUT() {
            this.token = null;
            this.uid = null
            Cache.clear(LOGIN_STATUS);
            Cache.clear(UID);
        },
        BACKGROUND_COLOR(color) {
            this.color = color;
            document.body.style.backgroundColor = color;
        },
        UPDATE_USERINFO(userInfo) {
            userInfo.isNew && Cache.set('is_new_user', '1')
            this.userInfo = userInfo;
        },
        OPEN_HOME() {
            this.homeActive = true;
        },
        CLOSE_HOME() {
            this.homeActive = false;
        },
        PARSE_PWD(pwd) {
            this.copyPwd = pwd;
        },
        VIEW_COLOR(color) {
            Cache.set('VIEW_COLOR', color)
            this.viewColor = color;
        },
        KEY_COLOR(key) {
            Cache.set('KEY_COLOR', key)
            this.keyColor = key;
        },
        LOCAL_VIEW_COLOR(color) {
            Cache.set('LOCAL_VIEW_COLOR', color)
            this.localViewColor = color;
        },
        LOCAL_KEY_COLOR(key) {
            Cache.set('LOCAL_KEY_COLOR', key)
            this.localKeyColor = key;
        },
        GLOBAL_DATA(key) {
            uni.setStorageSync('GLOBAL_DATA', key);
            this.globalData = key;
        },
        FOOT_UPLOAD(data){
            this.pageFooter = data
        },
        set_discounts(data) {
            this.discounts_json = data
        },
        USERINFO({ commit }, force) {
            if (this.userInfo !== null && !force)
                return Promise.resolve(this.userInfo);
            else
                return new Promise(reslove => {
                    getUserInfo().then(res => {
                        commit("UPDATE_USERINFO", res.data);
                        Cache.set(USER_INFO, res.data);
                        reslove(res.data);
                    });
                }).catch(() => {
    
                });
        }
	}
});