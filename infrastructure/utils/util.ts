import { mineApi, homeApi } from "@/business/api/index";
import CONSTANTS from "@/infrastructure/utils/constant-data";
// import { jwtDecode } from "jwt-decode";
import { jwtDecode } from '@/infrastructure/utils/jwt-decode.js'
export const getUserToken = () => { };
export const getUserInfo = () => { };
export const getUserID = () => { };
export const validatenull = () => { };
export const videoFramePath = (value: any) => { //七牛云视频第一帧

	if (value && value.indexOf('videoCompress/') > -1) {
		value = value.replace('videoCompress/', '');
	}
	if (value && value.indexOf('.') > -1) {
		value = value.split('.')[2];
		value = value.split('/')[2]
		value = value + '.jpg';

		return 'https://facemecdn.sanniuben.com/video/videoFrame/' + value;
	} else {
		return '';
	}
};


// 跳转优惠券小程勋
export const toCoupon = (id, path, type) => {
	console.log("触发---》")
	plus.share.getServices(res => {
		let sweixin = null;
		sweixin = res.find(i => i.id === 'weixin')
		if (sweixin) {
			type = type || 0,
				// `/pages/app/start?pid=221334&rid=${rid}`
				// 分享跳转到微信小程序
				sweixin.launchMiniProgram({
					id,  //微信小程序原生id(优惠券小程序)
					path, //    打开小程序的页面路径，不传默认跳转首页
					type //     微信小程序版本类型，可取值： 0-正式版； 1-测试版； 2-体验版。 默认值为0。
				})
		} else {
			uni.showToast({
				title: '请安装微信',
				icon: 'none'
			})
		}
	}, err => {
		console.log("分享失败"); // 获取分享服务列表失败
	});
}

// 跳转小程序
export async function toApplet(appId, path, middleToken) {
	// #ifdef APP-PLUS
	if (appId) {
		const apiServer = 'https://api.finclip.com'
		MopSdk.openApplet({
			apiServer,
			appId,
			startParams: {
				path,
				query: 'middle_token=' + middleToken
			}
		})
	}
	// #endif
}


// 跳转H5-browser/H5-webview
export async function toH5(url, type) {
	if (type == CONSTANTS.outer_chains[0].value) {
		uni.navigateTo({ url: `/views/pages/home/webView?url=${url}` })
	} else {
		// APP打开默认浏览器
		// #ifdef APP-PLUS
		plus.runtime.openURL(url, function (err) {
			uni.showToast({
				title: JSON.stringify(err),
				duration: 8000
			})
		});
		// #endif
	}
}


export function getLocation(callBack) { 
	// 获取位置信息
	uni.getLocation({
		type: "gcj02",
		isHighAccuracy: true,
		success: (res: any) => {
			console.log(res, '位置信息')
			// 使用经纬度调用 getlbsGeocoder 接口获取城市信息
			const location = `${res.longitude},${res.latitude}`;
			getCityFromGeocoder(location, callBack);
		},
		fail: (err: any) => {
			console.error('获取位置信息失败:', err);
			// 定位获取失败，使用默认城市，数据结构与接口返回一致
			const defaultLocationInfo = {
				addressComponent: {
					city: '北京市',
					province: '北京市',
					adcode: '110000',
					district: '',
					towncode: '',
					streetNumber: {
						number: '',
						location: '',
						direction: '',
						distance: '',
						street: ''
					},
					country: '中国',
					township: '',
					businessAreas: [],
					building: {
						name: [],
						type: []
					},
					neighborhood: {
						name: [],
						type: []
					},
					citycode: '010'
				},
				formatted_address: '北京市'
			};
			// 缓存默认城市信息
			uni.setStorageSync("locationInfo", defaultLocationInfo);
			callBack({
				cityName: '北京',
				province: '北京市',
				city: '北京市'
			});
			//
		},
	});
	
	// 通过 getlbsGeocoder 接口获取城市信息
	async function getCityFromGeocoder(location: string, callBack: Function) {
		try {
			console.log('调用 getlbsGeocoder 接口，位置:', location);
			const res = await homeApi.getlbsGeocoder({ location });
			console.log('getlbsGeocoder 接口返回:', res);
			
			// 处理返回数据
			if (res && res.data && res.data.addressComponent) {
				const addressComponent = res.data.addressComponent;
				let cityName = '北京'; // 默认城市
				
				// 处理城市名称，直辖市没有 city 字段，使用 province
				if (addressComponent.city) {
					cityName = addressComponent.city.slice(-1) === '市' ? addressComponent.city.slice(0, -1) : addressComponent.city;
				} else if (addressComponent.province) {
					// 直辖市没有 city 字段，使用 province
					cityName = addressComponent.province.slice(-1) === '市' ? addressComponent.province.slice(0, -1) : addressComponent.province;
				}
				if(!uni.getStorageSync("locationInfo")){
				// 缓存接口返回的所有信息
				uni.setStorageSync("locationInfo", res.data);
				console.log('缓存的位置信息:', res.data);
				}

				callBack({
					cityName: cityName,
					province: addressComponent.province,
					city: addressComponent.city || addressComponent.province
				});
			} else {
				console.error('getlbsGeocoder 接口返回数据格式不正确:', res);
				// 接口返回数据格式不正确，使用默认城市，数据结构与接口返回一致
				const defaultLocationInfo = {
					addressComponent: {
						city: '北京市',
						province: '北京市',
						adcode: '110000',
						district: '',
						towncode: '',
						streetNumber: {
							number: '',
							location: '',
							direction: '',
							distance: '',
							street: ''
						},
						country: '中国',
						township: '',
						businessAreas: [],
						building: {
							name: [],
							type: []
						},
						neighborhood: {
							name: [],
							type: []
						},
						citycode: '010'
					},
					formatted_address: '北京市'
				};
				// 缓存默认城市信息
				uni.setStorageSync("locationInfo", defaultLocationInfo);
				callBack({
					cityName: '北京',
					province: '北京市',
					city: '北京市'
				});
			}
		} catch (error) {
			console.error('调用 getlbsGeocoder 接口失败:', error);
			// 接口调用失败，使用默认城市，数据结构与接口返回一致
			const defaultLocationInfo = {
				addressComponent: {
					city: '北京市',
					province: '北京市',
					adcode: '110000',
					district: '',
					towncode: '',
					streetNumber: {
						number: '',
						location: '',
						direction: '',
						distance: '',
						street: ''
					},
					country: '中国',
					township: '',
					businessAreas: [],
					building: {
						name: [],
						type: []
					},
					neighborhood: {
						name: [],
						type: []
					},
					citycode: '010'
				},
				formatted_address: '北京市'
			};
			// 缓存默认城市信息
			uni.setStorageSync("locationInfo", defaultLocationInfo);
			callBack({
				cityName: '北京',
				province: '北京市',
				city: '北京市'
			});
		}
	}
}




/**
 * url转对象
 * @param {string} url
 * @returns {Object}
 */
export function paramsQuery(url) {
	const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ');
	if (!search) {
		return {};
	}
	const obj = {};
	const searchArr = search.split('&');
	searchArr.forEach(v => {
		const index = v.indexOf('=');
		if (index !== -1) {
			const name = v.substring(0, index);
			const val = v.substring(index + 1, v.length);
			obj[name] = val;
		}
	});
	return obj;
}

// 判断数量是否超过1w
export const isNumber = (num: any, isAdd: string) => {
	console.log(num)
	let myNum = num.toString()
	let t = myNum.slice(-1)
	if (t == 'w' || t == '+') {

	} else {
		myNum = Number(myNum)
		isAdd == '+' ? myNum += 1 : myNum -= 1

	}
	console.log(myNum)
	return myNum.toString()

}

// 校验ios用户是否不展示一些特殊页面(true: 隐藏，false：显示)
export async function checkIosNoShow() {
	let defaultconfig = uni.getStorageSync('defaultConfig');
	if (!defaultconfig) {
		const { data, code } = await mineApi.getConfigDefaultApi();
		if (code == 200) {
			defaultconfig = data;
		}
	}
	const isLogin = uni.getStorageSync('isLogin');
	const userInfo = uni.getStorageSync('userInfo');
	const curPhone = userInfo.mobile;
	// const systemInfo = uni.getSystemInfoSync();
	// const isIos = systemInfo.platform === 'ios';
	const curVersion = plus.runtime.version;
	const curVersionNum = Number(curVersion.split('.').join(''));
	const newVersion = defaultconfig.new_version;
	const newVersionNum = Number(newVersion.split('.').join(''));
	const filterPhones = defaultconfig.filter_phone.split(',');
	console.log("curVersionNum-->", curVersionNum, newVersionNum);
	// 当前用户版本号是否是最新的
	const v_isNew = curVersionNum < newVersionNum ? false : true;
	// 与登录手机号是否在黑名单里
	const phone_isHas = isLogin && filterPhones.indexOf(curPhone) > -1;
	console.log('check---->', v_isNew, phone_isHas);
	if (v_isNew || phone_isHas) {
		return true;
	}

	return false;
}
let flag = false
let message_arr: any = []
// 消息推送
export const pushMessage_event = () => {
	if (flag) return //监听函数只出发一次
	flag = true
	uni.onPushMessage((res: any) => {
		const { title, content, payload } = { ...res.data }
		if (payload.send_type == "all") { //判断给个人发消息还是全部用户
			// 创建本地通知栏消息
		  send_event(title, content, res.data)
		} else {
			if (payload.mobile.includes(uni.getStorageSync('userInfo').mobile)) {
				send_event(title, content, res.data)
			}
		}
	})

	// #ifdef APP
	// 监听点击菜单栏消息
	void plus.push.addEventListener('click', (e) => {
		console.log(message_arr, e)
		let { content } = e
		let message_data = message_arr.find((item) => item.content == content)
		if (message_data.payload.channel === 'mdd') {
			to_mdd(message_data)
		} else {
			to_universe(message_data)
		}
	}, false)
	// #endif

}

// 创建本地通知栏消息
const send_event = (title, content, data) => {
	if (uni.$config.app_env == data.payload.app_env) { //判断给不同环境用户发消息
		let when = new Date()
		uni.createPushMessage({
			title,
			content,
			when,
			success() {
				message_arr.push(data)
				console.log(data.payload.mobile, 'payload')
				console.log('推送成功')
			},
			fail() {
				console.log("推送失败");
			}
		})
	}

}

// 跳转看看宇宙
const to_universe = (message_data) => {
	switch (message_data.payload.msg_type) {
		case 'interact_message':
			uni.navigateTo({ url: '/views/pages/message/replyToComments' })
			break;
		case 'system_message':
			uni.navigateTo({ url: '/views/pages/message/systemNotification' })
			break;
	}
}

// 跳转mdd商城
const to_mdd = async (message_data) => {
	const [code, middleToken] = await getMiddleToken();
	let params = {
		middle_token: middleToken,
		order: true,
		path: message_data.payload.link,
	};

	to_without_event(params,uni.$config.mddUrl)
}


// 获取middle_token
export async function getMiddleToken() {
	const middle_token = uni.getStorageSync("middle_token");
	const res = await homeApi.checkMiddleToken({ middle_token: middle_token });
	const middleToken = res.data.middle_token;
	return [res.code, middleToken];
}


// 跳转外部公共方法
export const to_without_event=(params,path)=>{
	let url =
	path+
		`?params=${encodeURIComponent(JSON.stringify(params))}`;
	if (uni.getStorageSync("defaultConfig").order_jump_method == 1) {
		uni.navigateTo({ url: `/views/pages/home/webView?url=${url}` });
	} else {
		plus.runtime.openURL(url, function (err) {
			uni.showToast({
				title: JSON.stringify(err),
				duration: 8000,
			});
		});
	}


}

// 赚省星球入口
export function toEarnProvince() {
	let routes = getCurrentPages();
	let curRoute = routes[routes.length - 1].$page.fullPath;
	if (!uni.getStorageSync("isLogin")) {
		console.log(curRoute)
		uni.navigateTo({
			url: "/views/pages/mine/login?path=" + curRoute,
		});
		return;
	}
	getLocation((city) => {
		uni.navigateTo({
			url:'/views/pages/save-money/views/pages/tabbar/index'
		})
	});
};

// 节流函数
export function throttle(fn, delay) {
	var lastArgs;
	var timer;
	var delay = delay || 200;
	return function(...args) {
		lastArgs = args;
		if(!timer){
			timer = setTimeout(()=>{
				timer = null;
				fn.apply(this, lastArgs);
			}, delay);
		}
	}
}

/**
	 * opt  object | string
	 * to_url object | string
	 * 例:
	 * this.Tips('/pages/test/test'); 跳转不提示
	 * this.Tips({title:'提示'},'/pages/test/test'); 提示并跳转
	 * this.Tips({title:'提示'},{tab:1,url:'/pages/index/index'}); 提示并跳转值table上
	 * tab=1 一定时间后跳转至 table上
	 * tab=2 一定时间后跳转至非 table上
	 * tab=3 一定时间后返回上页面
	 * tab=4 关闭所有页面跳转至非table上
	 * tab=5 关闭当前页面跳转至table上
	 */
export function Tips(opt, to_url) {
	if (typeof opt == 'string') {
		to_url = opt;
		opt = {};
	}
	let title = opt.title || '',
		icon = opt.icon || 'none',
		image = opt.image || '',
		endtime = opt.endtime || 2000,
		success = opt.success;
	if (title) uni.showToast({
		title: title,
		icon: icon,
		image: image,
		duration: endtime,
		success
	})
	if (to_url != undefined) {
		if (typeof to_url == 'object') {
			let tab = to_url.tab || 1,
				url = to_url.url || '';
			switch (tab) {
				case 1:
					//一定时间后跳转至 table
					setTimeout(function() {
						uni.switchTab({
							url: url
						})
					}, endtime);
					break;
				case 2:
					//跳转至非table页面
					setTimeout(function() {
						uni.navigateTo({
							url: url,
						})
					}, endtime);
					break;
				case 3:
					//返回上页面
					setTimeout(function() {
						// #ifndef H5
						uni.navigateBack({
							delta: parseInt(url),
						})
						// #endif
						// #ifdef H5
						history.back();
						// #endif
					}, endtime);
					break;
				case 4:
					//关闭当前所有页面跳转至非table页面
					setTimeout(function() {
						uni.reLaunch({
							url: url,
						})
					}, endtime);
					break;
				case 5:
					//关闭当前页面跳转至非table页面
					setTimeout(function() {
						uni.redirectTo({
							url: url,
						})
					}, endtime);
					break;
			}

		} else if (typeof to_url == 'function') {
			setTimeout(function() {
				to_url && to_url();
			}, endtime);
		} else {
			//没有提示时跳转不延迟
			setTimeout(function() {
				uni.navigateTo({
					url: to_url,
				})
			}, title ? endtime : 0);
		}
	}
}
//验证token是否有效
export async function checkTokenEventAst(){
	console.log('执行校验token')
	if (!uni.getStorageSync("isLogin")) {
		return false;
	}
    if(uni.getStorageSync('middle_token')){
    	const {data} = await mineApi.checkToken({middle_token: uni.getStorageSync('middle_token')})
		if(!data.valid){
			uni.showToast({
              title:'登录已失效，请重新登录',
			  icon:'none'
			})
		}
    	return data.valid
    }else{
    	return false
    }
}

// 转译商户类型字段
export function translateMerType(type, wantKey = false) {
    const map = {
        m: 'merchant',
        s: 'seller'
    };
    
    if (!type) return '';
    
    const normalized = String(type).toLowerCase().trim();
    
    if (wantKey) {
        // 返回键值（简称）
        return map[normalized] ? normalized : Object.keys(map).find(key => map[key] === normalized) || normalized;
    } else {
        // 返回值（全称）
        return map[normalized] || normalized;
    }
}

// 自动续登
export function autoLoginEvent(){
	if(uni.getStorageSync("isLogin")){
	  let token_time = uni.getStorageSync("token_time")
	  const timestamp = Math.floor(new Date().getTime() / 1000);
	  let days5 = 432000 //单位秒 5天 
	  console.log(timestamp > (token_time || 0)  - days5)
	  if(timestamp > (token_time || 0) - days5 ){
		  mineApi.forceRefreshTokenApi().then(async (res) => {
		  const decoded = jwtDecode(res.data.token);
		  uni.setStorageSync("token_time",decoded.exp)
		  uni.setStorageSync("token", res.data.token);
		  console.log('时间解密',decoded);
		  });
	  }
	}
  }

  //前端错误日志上传钉钉
export function uploadDingDing(type=2,data={},req={},url=''){
	const accountInfo = uni.getAppBaseInfo();
	console.log('版本号：',accountInfo.appVersion)
	// type:1=页面错误、2=接口错误
    let pages = getCurrentPages();
    let curRoute = pages[pages.length - 1].route;
	console.log('当前环境：',uni.$config.app_env)
	if(uni.$config.app_env != 'prod') return
	// 页面报错参数
	let text_page = 
`### 看看宇宙商城-微信小程序前端错误日志
\n**版本号：** v${accountInfo.appVersion}
\n**报错类型：** 页面错误
\n**报错页面：** ${curRoute}
\n**错误信息：** ${data}`

   // 接口报错参数
    let text_req = 
`### 看看宇宙商城-微信小程序前端错误日志
\n**版本号：** v${accountInfo.appVersion}
\n**报错类型：** 接口报错
\n**报错页面：** ${curRoute}
\n**请求接口：** ${url}
\n**请求参数：** ${JSON.stringify(req)}
\n**错误信息：** ${JSON.stringify(data)}`
	uni.request({
		url: 'https://oapi.dingtalk.com/robot/send?access_token=e13d4f2b0345933ffa3acce25f9e4adc53c0c29e5655e75a8219f9f3dc3c5b21', // 替换为你的后端接口
		method: 'POST',
		data: {
			"msgtype": "markdown",
            "markdown": {
            "title": "看看宇宙商城-微信小程序前端错误日志",
            "text": type == 1 ? text_page : text_req
            }
          },
		header: {
			'Content-Type': 'application/json'
		},
		success: (res) => {
			console.log('错误上报成功', res.data);
		},
		fail: (err) => {
			console.error('错误上报失败', err);
		}
	});
}