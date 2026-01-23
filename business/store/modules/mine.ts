import { defineStore } from "pinia";
import { mineApi } from '/business/api/index.ts'
import mainStore from "@/business/store/index.ts";
import { clearLoginStorage } from "@/infrastructure/request/interceptor.js";
import { jwtDecode } from '@/infrastructure/utils/jwt-decode.js'

interface userInfo {
    name: string
}
export default defineStore<any>("mine", {
    state: () => {
        return {
            is_new: false,
            isLogin: uni.getStorageSync('isLogin') || false,
            openid: uni.getStorageSync('o_id') || '',
            userInfo: uni.getStorageSync('userInfo') || {},
            myInfo: {},  // 个人中心获赞等信息
            agreementInfo: {
                privacy_agreement: '',
                user_agreement: ''
            }, // 用户协议和隐私协议
            ShareInfo: {
                list: [],
                total: 0,
                user: {}
            },
            // 默认图片配置
            configDefaults: {},
            reportReason: [
                {
                    id: 1,
                    title: '发布不当的内容或信息',
                    children: [
                        {
                            cid: 1,
                            title: '色情低俗'
                        },
                        {
                            cid: 2,
                            title: '政治敏感'
                        },
                        {
                            cid: 3,
                            title: '不实信息'
                        },
                        {
                            cid: 4,
                            title: '违法犯罪'
                        },
                        {
                            cid: 5,
                            title: '侮辱谩骂'
                        },
                    ]
                },
                {
                    id: 2,
                    title: '传播色情资源、引导私下交易',
                    children: [
                        {
                            cid: 1,
                            title: '展示招嫖信息'
                        },
                        {
                            cid: 2,
                            title: '传播色情资源'
                        },
                        {
                            cid: 3,
                            title: '赌博/赌球'
                        },
                        {
                            cid: 4,
                            title: '引导站外交易'
                        },
                    ]
                },
                {
                    id: 3,
                    title: '未成年人相关',
                    children: [
                        {
                            cid: 1,
                            title: '未成年低俗'
                        },
                        {
                            cid: 2,
                            title: '未成年不良行为'
                        },
                        {
                            cid: 3,
                            title: '色情/恐怖动画'
                        }
                    ]
                },
                {
                    id: 4,
                    title: '网络暴力',
                    children: [
                        {
                            cid: 1,
                            title: '网暴我自己'
                        },
                        {
                            cid: 2,
                            title: '网暴他人'
                        }
                    ]
                },
                {
                    id: 5,
                    title: '以上没有我想举报的类型',
                    children: [
                        {
                            cid: 1,
                            title: '其他违规'
                        }
                    ]
                },
            ]
          
        };
    },
    actions: {
        // 登录
        async loginApi(info: any) {
            let req = info
            if(uni.getStorageSync('invite_code')){
               req = {...info,invite_code:uni.getStorageSync('invite_code')}
            }
            const { data } = await mineApi.loginApi(req)
            console.log(data)
            const decoded = jwtDecode(data.token);
            uni.setStorageSync("token_time",decoded.exp)
            uni.setStorageSync('middle_token', data.middle_token);
            uni.setStorageSync('token', data.token);
            uni.setStorageSync('isLogin', true);
            this.isLogin = true;
            uni.removeStorageSync('invite_code');
            mainStore().$patch((state) => {
                state.token = data.token;
                state.middle_token = data.middle_token;
            })
			return data;
        },
        // 退出登录
        async logoutApi(info: any) {
            const { data } = await mineApi.logoutApi(info)
            console.log(data)
            // 清除缓存
            clearLoginStorage();
            this.userInfo = {};
            this.isLogin = false;
            this.myInfo = {};
			mainStore().$patch((state)=>{
				state.token = '';
				state.middle_token = '';
			})
        },
        // 注册
        async registerApi(info: any) {
            const { data } = await mineApi.registerApi(info)
            uni.removeStorageSync('invite_code');
            console.log(data)
            return data;

        },
        // 发送手机验证码
        async sendSmsApi(info: any) {
            const { data } = await mineApi.sendSmsApi(info)
            console.log(data, '验证码')
            this.code = data
        },
        // 是否要显示邀请码
        async is_new_mobileApi(info: any) {
            const { data } = await mineApi.is_new_mobileApi(info)
            console.log(data)
            this.is_new = data.is_new
        },
        // 邀请码是否有效
        async check_invite_codeApi(info: any) {
            const { data } = await mineApi.check_invite_codeApi(info)
          
            return data.valid

        },
        // 检查middle_token
        async check_middle_tokenApi(info: any) {
            const { data } = await mineApi.check_middle_tokenApi(info)
            console.log(data)

        },
        // 获取用户基础信息
        async baseInfoApi() {
            const { data } = await mineApi.baseInfoApi()
            console.log(data, '用户基础信息')
            uni.setStorageSync('userInfo', data)
            this.userInfo = data
        },
        // 分享信息
        async promotionApi() {
            const { data } = await mineApi.promotionApi()
            console.log(data, '分享信息')
            this.ShareInfo = data
        },
        // 获取用户个人中心基础信息
        async getUserMyInfoApi() {
            const { data } = await mineApi.getUserMyInfoApi()
            console.log(data, '个人中心基础信息')
            this.myInfo = data
            return data;
        },
        // 获取用户协议和隐私协议
        async getAgreementApi() {
            const { data } = await mineApi.getAgreementApi()
            this.agreementInfo = data
            return data;
        },
        // 海报图
        async shareImage() {
            const { data } = await mineApi.shareImage()
            let arr = [];
            for (const key in data) {
                arr.push(data[key])
            }
            arr = arr.concat(arr)
            return arr
		},
		// 生成海报图二维码
		async createQrcode(params) {
		    const { data } = await mineApi.createQrcode(params)
		    return data;
		},
        // 修改用户基本信息
        async editBaseInfoApi(info: any) {
            await mineApi.editBaseInfoApi(info)
            await this.baseInfoApi();
            console.log('修改用户基本信息')
        },
        // 退出登录
        async securityApi(info: any) {
            await mineApi.securityApi(info)
            // console.log(data)
            // 清除缓存
            clearLoginStorage();
            this.userInfo = {};
            this.isLogin = false;
            this.myInfo = {};
			mainStore().$patch((state)=>{
				state.token = '';
				state.middle_token = '';
			})
        },
        // 获取默认图片配置信息
        async getConfigDefaultApi(info: any) {
            const { data } = await mineApi.getConfigDefaultApi();
            uni.setStorageSync('defaultConfig', data);
            console.log("默认图片配置", data);
            this.configDefaults = data;
            return data;
        },
		// 获取默认图片配置信息
		async getShareInfoApi(info: any) {
		    const { data } = await mineApi.getShareInfo();
		    return data;
		},
        // 修改上级邀请码
        async settingInviteCode(info: any) {
		    const { data } = await mineApi.settingInviteCodeApi(info);
		    return data;
		},
        // 忘记密码找回
        async retrievePassword(info: any) {
            const { data } = await mineApi.retrievePasswordApi(info);
            return data;
        },
         // 校验验证码
         async verifySmsCode(info: any) {
           const { data } = await mineApi.verifySmsCodeApi(info);
           return data;
        },
    }
}); 
