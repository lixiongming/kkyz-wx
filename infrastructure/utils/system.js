// import {
// 	env
// } from '@/config';
import {
	getUserInfo,
	getUserToken,
	getUserID,
	validatenull
} from './util';
// import checkUpdate from '@/uni_modules/uni-upgrade-center-app/utils/check-update';
// import callCheckVersion from '@/uni_modules/uni-upgrade-center-app/utils/call-check-version';

// import { apiPutLocationCityInfo } from '@/api/jobhunter';
import store from '@/business/store/index';

let isJumping = false;
let showDialog = false;

const goToPage = (url, forceLogin, callback) => {
	// if (isJumping) {
	// 	return;
	// }
	// if (forceLogin && checkUserInfo(url)) {
	//     return;
	// }
	// isJumping = true;
	callback();
}

const goToPageComplete = () => {
	// setTimeout(() => {
	isJumping = false;
	// }, 500)
}

/**
 * 弹窗提示
 * success	显示成功图标，此时 title 文本在小程序平台最多显示 7 个汉字长度。
 * error	显示错误图标，此时 title 文本在小程序平台最多显示 7 个汉字长度。
 * none	    不显示图标，此时 title 文本在小程序最多可显示两行，App仅支持单行显示。
 * @param {String} title
 * @param {String} icon
 * @param {Boolean} mask
 * @returns
 */
export const showToast = (title, icon = 'none', mask = false) => {
	let args = {
		title: title,
		duration: 1500,
		icon,
		mask
	};
	// let app = getApp();
	// if (app._loadTimer) {
	//     clearTimeout(app._loadTimer);
	//     app._loadTimer = null;
	//     hideLoading();
	// }
	uni.showToast(args);
	return new Promise((resolve, reject) => {
		setTimeout(resolve, args.duration)
	})
}

/**
 * 显示加载状态
 * @param {String} title
 * @param {Boolean} mask
 */
export const showLoading = (title, mask = false) => {
	getApp({allowDefault: true}).globalData.isShowLoading = true;
	uni.showLoading({
		title: title || '加载中...',
		mask
	})
}

/**
 * 隐藏加载状态
 */
export const hideLoading = () => {
	if (getApp({allowDefault: true}).globalData.isShowLoading) {
		return uni.hideLoading()
	}
}

/**
 * 提示弹窗
 * @param {String} content
 * @param {Function} callback
 * @returns
 */
export const showModal = (content, callback) => {
	if (showDialog || !content) {
		return
	}
	showDialog = true;
	uni.showModal({
		content: content,
		showCancel: false,
		confirmText: '我知道了',
		success() {
			callback && callback.call(this);
			showDialog = false;
		}
	});
}

/**
 * 确认弹窗
 * @param {String} content
 * @param {Function} confirm
 * @param {Function} cancel
 * @param {String} confirmText
 * @param {String} cancelText
 * @returns
 */
export const showConfirm = (content, confirm, cancel, confirmText, cancelText) => {
	if (showDialog) {
		return
	}
	showDialog = true;
	uni.showModal({
		title: '提示',
		content: content,
		confirmText: confirmText || "确定",
		cancelText: cancelText || "取消",
		success(res) {
			showDialog = false;
			if (res.confirm) {
				confirm && confirm.call(this);
			} else {
				cancel && cancel.call(this);
			}
		}
	});
}

/**
 * 全局函数-页面跳转
 */
export const router = {
	push(url, params, events = {}) {
		return navigateTo(`/pages${url}/index` + queryParams(params), events, true)
	},
	replace(url, params) {
		redirectTo(`/pages${url}/index` + queryParams(params))
	},
	back(delta = 1) {
		navigateBack(delta);
	},
	pushx(url, params, events) {
		const id = getUserID() || 1;
		const path = {
			1: '/zp',
			2: '/qz'
		}
		if (path[id] == undefined) {
			return showToast('身份错误', 'error');
		}
		router.push(path[id] + url, params, events);
	}
}
/**
 * 全局函数-页面跳转
 */
export const navigateTo = (url, events = {}, forceLogin = true, animationType) => {
	return new Promise((resolve, reject) => {
		goToPage(url, forceLogin, () => {
			uni.navigateTo({
				url,
				events,
				animationType,
				success(res) {
					resolve(res)
				},
				fail(err) {
					reject(err)
				},
				complete: () => goToPageComplete()
			});
		});
	})
}

export const navigateBack = (delta, forceLogin = false) => {
	goToPage(null, forceLogin, () => {
		isJumping = false;
		// let pages = getCurrentPages();
		if (pages.length > 1) {
			uni.navigateBack({
				delta
			});
		} else {
			switchTab()
		}
	});
}

export const redirectTo = (url, forceLogin = true) => {
	return new Promise((resolve, reject) => {
		goToPage(url, forceLogin, () => {
			uni.redirectTo({
				url,
				complete: () => goToPageComplete(),
				success(res) {
					resolve(res)
				},
				fail(err) {
					reject(err)
				}
			});
		});
	})
}

export const reLaunch = (url, forceLogin = false) => {
	goToPage(url, forceLogin, () => {
		uni.reLaunch({
			url,
			complete: () => goToPageComplete()
		});
	});
}

export const switchTab = (url, forceLogin = false, params) => {
	return new Promise((resolve, reject) => {
		if (!url) {
			// if (store.state.$id === 1) {
			// 	url = '/pages/tabbar/universe-zp/index';
			// } else {
			// 	url = '/pages/tabbar/looking/index';
			// }
			url = '/views/pages/home/index';
		}
		/* #ifdef APP-PLUS */
		url = `/views/pages/tabbars/index?path=${url}${queryParams(params, false)}`;
		goToPage(url, forceLogin, () => {
			uni.reLaunch({
				url,
				success(res) {
					resolve(res)
				},
				fail(err) {
					reject(err)
				},
				complete: () => goToPageComplete()
			});
		});
		/* #endif */
		/* #ifndef APP-PLUS */
		console.log('url',url)
		goToPage(url, forceLogin, () => {
			uni.switchTab({
				url,
				success(res) {
					resolve(res)
				},
				fail(err) {
					reject(err)
				},
				complete: () => goToPageComplete()
			});
		});
		/* #endif */
	});
}

//向起始页通过事件传递数据
export const uniEventChannel = {


	eventEmit(that, eventName, data) {
		// #ifdef APP-NVUE
		const eventChannel = that.$scope.eventChannel; // 兼容APP-NVUE
		// #endif
		// #ifndef APP-NVUE
		const eventChannel = that.getOpenerEventChannel();
		// #endif
		eventChannel.emit(eventName, data)

	},
	eventOn(that, eventName, callback) {
		// #ifdef APP-NVUE
		const eventChannel = that.$scope.eventChannel; // 兼容APP-NVUE
		// #endif
		// #ifndef APP-NVUE
		const eventChannel = that.getOpenerEventChannel();
		// #endif
		// 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
		eventChannel.on(eventName, (data) => {
			callback && callback.call(that, data)
		})
	}


};

/**
 * 数据缓存封装
 */
export const cache = {
	/**
	 * 设置缓存
	 * @param {String} key 键名
	 * @param {any} value 键值
	 */
	set(key, value) {
		return uni.setStorageSync(key + '_' + env, value);
	},
	/**
	 * 获取缓存
	 * @param {String} key 键名
	 * @param {any} def 没有值时的默认值
	 * @returns 
	 */
	get(key, def = '') {
		let value = uni.getStorageSync(key + '_' + env);
		return validatenull(value) ? def : value;
	},
	/**
	 * 移除缓存
	 * @param {String} key  键名
	 */
	remove(key) {
		return uni.removeStorageSync(key + '_' + env);
	},
	/**
	 * 清除缓存
	 */
	clear() {
		return uni.clearStorageSync();
	}
};

/**
 * 设置底部导航栏
 * @param {Number} type type = 0 重置，1设置为黑色
 */
export const setTabbar = (type = 0) => {
	let params = [{
			backgroundColor: '#FFFFFF',
			borderStyle: 'white',
		},
		{
			backgroundColor: '#11104B',
			borderStyle: 'white',
		}
	]
	uni.setTabBarStyle(params[type])
}

/**
 * 全局函数-检查小程序是否可更新
 */
export const checkAppUpdate = () => {
	/* #ifdef APP-PLUS */
	// 检查更新
	callCheckVersion().then(res => {
		if (res.result.code > 0) {
			// 有新版本
			checkUpdate();
		}
	})
	/* #endif */
	/* #ifdef MP */
	if (uni.canIUse('getUpdateManager')) {
		const updateManager = uni.getUpdateManager();
		updateManager.onCheckForUpdate((res) => {
			if (res.hasUpdate) {
				updateManager.onUpdateReady(() => {
					uni.showModal({
						title: '更新提示',
						content: '新版本已经准备好，重启小程序？',
						showCancel: false,
						confirmText: '好的',
						success() {
							updateManager.applyUpdate();
						}
					})
				})
			}
		});
	}
	/* #endif */
}

export const getLocation = (manual) => {
	return new Promise((resolve, reject) => {
		/* #ifdef MP */
		let authSetting = {};
		uni.getSetting({
			success(res) {
				authSetting = res.authSetting || {};
				if (authSetting['scope.userLocation'] || !manual) {
					/* #endif */
					uni.getLocation({
						type: 'wgs84',
						success: function(res) {
							let {
								latitude,
								longitude
							} = res;
							uni.request({
								url: `https://apis.map.qq.com/ws/geocoder/v1/`,
								data: {
									location: `${latitude},${longitude}`,
									key: 'GD7BZ-7UBE4-CH7UR-XNFZ7-UUQN3-LTBZX'
								},
								success(res) {
									let {
										adcode,
										city,
										city_code,
										nation_code
									} = res.data.result.ad_info;
									let resolveData = {
										latitude,
										longitude,
										adcode,
										city: city,
										code: city_code.replace(
											nation_code, '')
									}
									//更新用户位置信息
									if (getUserToken() && getUserID() !== 1) {
										apiPutLocationCityInfo({
											locationCityId: resolveData.code,
											locationX: longitude,
											locationY: latitude
										}).then(() => {
											store.dispatch('getUserInfo');
										})
									}
									resolve(resolveData);

								},
								fail(err) {
									reject(err)
								}
							})
						},
						fail: function(err) {
							console.log('err', err)
							reject(err)
						}
					})
					/* #ifdef MP */
				} else {

					showConfirm('是否前往设置开启授权？', () => {
						uni.openSetting();
					}, () => {
						reject()
					})
				}
			},
			fail(err) {
				console.log(err)
			}
		});
		/* #endif */
	})
};


export const chooseImage = (count = 1, callback) => {
	uni.chooseImage({
		count, //默认9
		sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
		sourceType: ['album', 'camera '], //从相册选择
		success: (res) => {
			console.log(res)
			console.log(JSON.stringify(res.tempFilePaths));
			callback && callback.call(this, res)
		}
	});
}

// 去地图选择位置
export const chooseLocation = () => {
	return new Promise(async (resolve, reject) => {
		await uni.chooseLocation({
			success: function(res) {
				//腾讯的经纬度和位置名称 一起返回去
				console.log('位置名称：' + res.name);
				console.log('详细地址：' + res.address);
				console.log('纬度：' + res.latitude);
				console.log('经度：' + res.longitude);
				let {
					name,
					longitude,
					latitude
				} = res;
				uni.request({
					url: `https://api.map.baidu.com/geoconv/v1/`,
					data: {
						coords: `${longitude},${latitude}`,
						from: 1,
						to: 5,
						ak: 'ijh28uA5OvNCNyv7Vhro0kMkNjwjkxZB'
					},
					success(res) {
						let {
							y,
							x
						} = res.data.result[0];
						uni.request({
							url: 'https://api.map.baidu.com/reverse_geocoding/v3/',
							data: {
								location: `${y},${x}`,
								output: 'json',
								ak: 'ijh28uA5OvNCNyv7Vhro0kMkNjwjkxZB',
							},
							success(result) {
								console.log('name', name);
								console.log('result', result.data
									.result); //包含百度的经纬度
								//name,longitude,latitude   指腾讯的
								resolve(Object.assign({}, {
									name,
									longitude,
									latitude
								}, {
									...result.data.result
								}));

							},
							fail(err) {
								reject(err)
							},
							complete(res) {
								// console.log(res)
							}
						})
					}
				})
			},
			fail(err){
				console.log("选择位置失败",err)
			}
		})
	})

}

//高德地图 经纬度转换
export const addressTranslation = ({
	point,
	name = '',
	address=''
}) => {
	return new Promise(async (resolve, reject) => {
	name= name=="地图当前位置"?address:name;
		console.log('addressTranslation', point, name);

		try {
			let {
				longitude,
				latitude
			} = point;
			let res = await uni.request({
				url: `https://api.map.baidu.com/geoconv/v1/`,
				data: {
					coords: `${longitude},${latitude}`,
					from: 1,
					to: 5,
					ak: 'ijh28uA5OvNCNyv7Vhro0kMkNjwjkxZB'
				}
			})
			let {
				y,
				x
			} = res[1].data.result[0];
			let result = await uni.request({
				url: 'https://api.map.baidu.com/reverse_geocoding/v3/',
				data: {
					location: `${y},${x}`,
					output: 'json',
					ak: 'ijh28uA5OvNCNyv7Vhro0kMkNjwjkxZB',
				}
			})
			console.log('result',result);
			resolve(Object.assign({}, {
				name,
				longitude,
				latitude
			}, {
				...result[1].data.result
			}))
			
			
		} catch (err) {
			console.log(err);
			reject(err)
		}


	})

}

export const checkUserInfo = () => {
	let info = getUserInfo();
	// let pages = getCurrentPages();
	let currentPage = pages[pages.length - 1];
	let route = '/' + currentPage.route;
	
	if (info.positionType === null) {
		//没有完善资料
		showToast('请先完善资料').then(() => {
			if (route == '/pages/login/index') {
				router.replace('/zp/basic', {});
			} else {
				router.push('/zp/basic', {});
			}
		});
		return false;
	} else if (info.companyAttestationType !== 1) { // companyAttestationType ==null 0 未认证  1 认证通过  2 认证失败
		// if (info.companyAttestationType === 2 || info.companyAttestationType === 0) {
		// 	//认证失败跳转到结果页
		// 	router.push('/zp/auth/result', {
		// 		type: info.companyAttestationType
		// 	});
		// } else {
			//未认证或未认证成功
			showToast('请先资质认证', 'none').then(() => {
				if (route == '/pages/login/index') {
					router.replace('/zp/auth/cert', {});
				} else {
					router.push('/zp/auth/cert', {});
				}
			});
		// }
		return false;
	}
	return true;
}

/**
 * 压缩视频文件
 * https://uniapp.dcloud.net.cn/api/media/video.html#compressvideo
 * @param url uni.chooseVideo 返回的 tempFilePath
 * @param size uni.chooseVideo 返回的 文件大小
 */
export const compressVideo = (url, size) => {
	let quality = size / 1000 / 1000 < 200 ? 'high' : 'medium';
	showLoading('视频处理中...');
	return new Promise((resolve, reject) => {
		let platforms = ['macos', 'windows'];
		if (platforms.indexOf(store.state.$systemInfo.osName) > -1) {
			hideLoading();
			resolve({
				tempFilePath: url,
				size
			})
			return
		}
		uni.compressVideo({ 
			src: url,
			quality: quality, // low: 低 | 0.08 ， medium: 中 | 0.22， high: 高 | 0.5
			success: function(res) {
				hideLoading();
				resolve(res);
			},
			fail: function(err){
				console.log('视频压缩失败', err);
				hideLoading();
				showToast('视频压缩失败');
				reject(err);
			}
		})
	})
}

/**
 * 对象转url参数
 * @param {*} data,对象
 * @param {*} isPrefix,是否自动加上"?"
 */
export const queryParams = (data = {}, isPrefix = true, arrayFormat = 'brackets') => {
    let prefix = isPrefix ? '?' : '&';
    let _result = [];
    if (['indices', 'brackets', 'repeat', 'comma'].indexOf(arrayFormat) == -1) arrayFormat = 'brackets';
    for (let key in data) {
        let value = data[key];
        // 去掉为空的参数
        if (['', undefined, null].indexOf(value) >= 0) {
            continue;
        }
        // 如果值为数组，另行处理
        if (value.constructor === Array) {
            // e.g. {ids: [1, 2, 3]}
            switch (arrayFormat) {
                case 'indices':
                    // 结果: ids[0]=1&ids[1]=2&ids[2]=3
                    for (let i = 0; i < value.length; i++) {
                        _result.push(key + '[' + i + ']=' + value[i]);
                    }
                    break;
                case 'brackets':
                    // 结果: ids[]=1&ids[]=2&ids[]=3
                    value.forEach(_value => {
                        _result.push(key + '[]=' + _value);
                    });
                    break;
                case 'repeat':
                    // 结果: ids=1&ids=2&ids=3
                    value.forEach(_value => {
                        _result.push(key + '=' + _value);
                    });
                    break;
                case 'comma':
                    // 结果: ids=1,2,3
                    let commaStr = '';
                    value.forEach(_value => {
                        commaStr += (commaStr ? ',' : '') + _value;
                    });
                    _result.push(key + '=' + commaStr);
                    break;
                default:
                    value.forEach(_value => {
                        _result.push(key + '[]=' + _value);
                    });
            }
        } else {
            _result.push(key + '=' + value);
        }
    }
    return _result.length ? prefix + _result.join('&') : '';
};