 
const env = process.env.NODE_ENV || 'production';
let VUE_APP_WS_URL = env == 'production' ? `wss://mall.mdd3.cn?type=user` : `wss://testmall.mdd3.cn?type=user`
export let openPlantGrass = '-openPlantGrass-'

let httpApi = env == 'production' ? 'https://mall.mdd3.cn' : 'http://43.138.252.246:8802'  //正式专用
// let httpApi = env == 'production' ?  'http://test.www.mall.mdd3.cn' : 'https://mall.mdd3.cn' //测试专用
let wsApi = ''

// #ifdef MP-WEIXIN
const accountInfo = wx.getAccountInfoSync();
const version = accountInfo.miniProgram.envVersion;
switch(version) {
	case 'develop':
	case 'trial':
		VUE_APP_WS_URL = 'wss://testmall.mdd3.cn?type=user'
		break;
	case 'release':
		VUE_APP_WS_URL = 'wss://mall.mdd3.cn?type=user'
		break;
	default:
		break;
}
// #endif

export default {
	// 请求域名 格式： https://您的域名
	// #ifdef MP || APP-PLUS
	// HTTP_REQUEST_URL: httpApi,
	HTTP_REQUEST_URL: httpApi,
	VUE_APP_WS_URL: wsApi ? `${wsApi}?type=user` : VUE_APP_WS_URL,
	// #endif

	// #ifdef H5
	//H5接口是浏览器地址
	HTTP_REQUEST_URL: httpApi,
	// 聊天长连接地址
	VUE_APP_WS_URL: wsApi ? `${wsApi}?type=user` : VUE_APP_WS_URL,
	// #endif
	openPlantGrass: openPlantGrass,
	HEADER: {
		'content-type': 'application/json',
		//#ifdef H5
		'Form-type': navigator.userAgent.toLowerCase().indexOf("micromessenger") !== -1 ? 'wechat' : 'h5',
		//#endif
		//#ifdef MP
		'Form-type': 'routine',
		//#endif
		//#ifdef APP-PLUS
		'Form-type': 'app',
		//#endif
	},
	// 回话密钥名称 请勿修改此配置
	TOKENNAME: 'X-Token',
	// 缓存时间 0 永久
	EXPIRE: 0,
	IAMGES_URL:'https://mall-cdn.mdd3.cn/images'
};


export const EXPIRE = 0
export const HEADER = {		
	'content-type': 'application/json',
	//#ifdef H5
	'Form-type': navigator.userAgent.toLowerCase().indexOf("micromessenger") !== -1 ? 'wechat' : 'h5',
	//#endif
	//#ifdef MP
	'Form-type': 'routine',
	//#endif
	//#ifdef APP-PLUS
	'Form-type': 'app',
	//#endif
	}
export const TOKENNAME = 'X-Token'
export const HTTP_REQUEST_URL = httpApi
export const IAMGES_URL = 'https://mall-cdn.mdd3.cn/images'
