import {
	baseUrl,
	imgUrl as baseImg,
} from "@/infrastructure/request/interceptor.js";

export function loadModules(files, cb) {
	let modules = {}
	for (const key in files) {
		if (Object.prototype.hasOwnProperty.call(files, key)) {
			let index = key.replace(/(\.\/modules\/|\.js)/g, '')
			if (cb) {
				cb(modules, index, files[key].default)
			} else {
				modules[index] = files[key].default
			}
		}
	}
	return modules
}

//把变量挂在到Vue 上
export function mountToApp(Vue, key, value) {
	//访问 属性名+Store 可以获取对应的实例。

	// #ifndef VUE3
	Vue.prototype[key] = value
	// #endif

	// #ifdef VUE3
	Vue.config.globalProperties[key] = value
	// #endif
}

export const prefix = 'haipi_token'


export function getCurrentPage() {
	// let pages = getCurrentPages()
	return pages[pages.length - 1]
}


/**
 * 重试
 * @param {Function} fun 要执行的函数
 * @param {Integer} num 当前执行的次数
 * @param {Integer} max 最大重试多少次
 * @param {Integer} time 每次执行的间隔时间 
 */
export function retry(fun, time = 200, max = 20, num = 0) {
	let inter = setInterval(async () => {
		let flag = true
		if (num === max) {
			clearInterval(inter)
			return
		}
		try {
			flag = fun() === false ? false : true
		} catch (e) {
			console.log(e)
			flag = false
		}
		if (flag) {
			clearInterval(inter)
		}
		num++
	}, time)




}


export const checkNoCN = (rule, value, callback) => {
	if (value) {
		if (/[\u4E00-\u9FA5]/g.test(value)) {
			callback(new Error("不能包含中文!"));
		} else {
			callback();
		}
	}
	callback();
};

// 上传
export const uploadFile = (file) => {
	return new Promise((resolve, reject) => {
		uni.uploadFile({
			url: baseUrl + "/api/upload/upload",
			filePath: file,
			header: {
				Authorization: localStorage.getItem("haipi_token"),
			},
			name: "file",
			success: (res) => {
				const {
					code,
					data
				} = JSON.parse(res.data);
				if (code !== 200) {
					reject();
				}
				resolve(data);
			},
			fail: (err) => {
				reject(err);
			},
		});
	});
}

/**
 * 
 * @param {String} title 
 * @param {Function} fn 
 * @param {Object} options 
 */
export const successToast = (title, fn, options = {
	duration: 1500
}) => {
	const {
		icon,
		duration
	} = options;
	uni.showToast({
		title,
		icon,
		duration,
		complete: () => {
			setTimeout(() => {
				if (fn) {
					fn();
				} else {
					uni.navigateBack();
				}
			}, duration)
		}
	});
}

// 以下接口token失效默认不处理跳转
let apis = [
	"/api/post/like",
	"/api/post/favorite",
	"/api/user/attention"

]
export const loginJumpCheck = (api) => {
	return apis.includes(api)
}
/**
 * APP升级更新
 */
export const updateApp = (data) => {
	const {
		title, // 标题
		contents, // 升级内容
		is_mandatory, // 是否强制更新
		is_silently, //是否静默更新
		url, // 安装包下载地址
		platform, // 安装包平台
		type // 安装包类型
	} = data;

	// 静默更新，只有wgt有
	if (is_silently) {
		uni.downloadFile({
			url: e.result.url,
			success: res => {
				if (res.statusCode == 200) {
					// 下载好直接安装，下次启动生效
					plus.runtime.install(res.tempFilePath, {
						force: false
					});
				}
			}
		});
		return;
	}

	let isWGT = type === 'wgt'
	let isiOS = !isWGT ? platform.includes('iOS') : false;
	// let confirmText = isiOS ? '立即跳转更新' : '立即下载更新';

	// 安装包下载
	if (isiOS) {
		plus.runtime.openURL(url);
		return;
	}

	// uni.showToast({
	// 	title: '后台下载中……',
	// 	duration: 1000
	// });

	// wgt 和 安卓下载更新
	const downloadTask = uni.downloadFile({
		url,
		success: res => {
			if (res.statusCode !== 200) {
				data.edit(0)
				console.error('下载安装包失败', err);
				return;
			}
			// 下载好直接安装，下次启动生效
			plus.runtime.install(res.tempFilePath, {
				force: true
			}, () => {
				data.edit(0)
				if (is_mandatory) {
					//更新完重启app
					plus.runtime.restart();
					return;
				}
				uni.showModal({
					title: '安装成功是否重启？',
					success: res => {
						if (res.confirm) {
							//更新完重启app
							plus.runtime.restart();
						}
					}
				});
			}, err => {
				data.edit(0)
				uni.showModal({
					title: '更新失败',
					content: err.message,
					showCancel: false
				});
			});
		}
	});

	downloadTask.onProgressUpdate((progress) => {
		data.edit(progress.progress)
		console.log('下载进度：' + progress.progress);
		// console.log('已下载数据长度' + progress.totalBytesWritten);
		// console.log('预期需要下载的数据总长度' + progress.totalBytesExpectedToWrite);
		// 更新UI上的进度条或显示进度信息
		//具体UI风格可自己实现
	})

	return downloadTask
}