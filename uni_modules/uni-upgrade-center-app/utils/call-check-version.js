export default function() {
	// #ifdef APP-PLUS
	return new Promise((resolve, reject) => {
		plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {
			uniCloud.callFunction({
				name: 'check-version',
				data: {
					appid: plus.runtime.appid,
					appVersion: plus.runtime.version,
					wgtVersion: widgetInfo.version
					// appVersion: '2.1.0',
					// wgtVersion: '2.1.0'
				},
				success: (e) => {
					resolve(e)
				},
				fail: (error) => {
					reject(error)
				}
			})
		})
	})
	// #endif
	// #ifndef APP-PLUS
	return new Promise((resolve, reject) => {
		reject({
			message: '请在App中使用'
		})
	})
	// #endif
}
