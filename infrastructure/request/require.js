import dev from  '../config/env/development.js'
import pro from  '../config/env/production.js'

const env = process.env.NODE_ENV || 'production';

// console.log(env,'envenvenv------------77')
function baseRequest(url, method, data) {
	let Url = 'http://47.113.109.163:8981/',header = {};
	if(env == 'production'){
		Url = 'http://coupon.mdd3.cn/'
	}
	// console.log(url,'url')
	return new Promise((resolve, reject) => {
		uni.request({
			url: Url + "api/" + url,
			method: method || "GET",
			header: header,
			data: data || {},
			success: (res) => {
				// console.log(res.data,'resresresres')
				resolve(res.data);
				if(res.data.code!=200){
					uni.showToast({
					  title: "系统繁忙，请稍后重试",
					  icon: "none",
					  duration: 2000,
					});
				}
				resolve(res.data);
			},
			fail: (err) => {
				resolve(err);
			},
		});
	});
}

const request = {};
["options", "get", "post", "put", "head", "delete", "trace", "connect"].forEach(
	(method) => {
		request[method] = (api, data, opt) =>
			baseRequest(api, method, data, opt || {});
	}
);

export default request;