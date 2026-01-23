function toLogin(){
	// store.commit("LOGOUT");
	uni.showToast({
		title: '请登录',
		icon: 'none',
		duration: 1000
	});
}
function atob(input) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let str = input.replace(/=+$/, '');
  let output = '';
  if (str.length % 4 === 1) {
    throw new Error('InvalidLengthError');
  }
  for (let i = 0, len = str.length; i < len; i += 4) {
    const a = chars.indexOf(str.charAt(i));
    const b = chars.indexOf(str.charAt(i + 1));
    const c = chars.indexOf(str.charAt(i + 2));
    const d = chars.indexOf(str.charAt(i + 3));
    const sum = (a << 18) | (b << 12) | (c << 6) | d;
    output += String.fromCharCode((sum >> 16) & 0xFF, (sum >> 8) & 0xFF, sum & 0xFF);
  }
 
  return output;
}
/**
 * 发送请求
 */
function baseRequest(url, method, data, {
	noAuth = false,
	noVerify = false,
	noPrefix = false
}) {
	let Url = uni.$config.mddUrl || 'https://mall.mdd3.cn',
		header = {};
	let token = uni.getStorageSync("mall_token");
	if (!noAuth) {
		//登录过期自动登录
		// if (!token && !checkLogin()) {
		// 	toLogin();
		// 	return Promise.reject({
		// 		msg: '未登录'
		// 	});
		// }
	}
	if (token) header['X-Token'] = 'Bearer ' + token;
	return new Promise((reslove, reject) => {
		uni.request({
			url: noPrefix ? Url + '/' + url : Url + '/api/' + url,
			// url: noPrefix ? Url + '/' + url : Url + '/api/' + url,
			method: method || 'GET',
			header: header,
			data: data || {},
			success: (res) => {
				// if (res.data && res.data.encode) {
				// 	try {
				// 		res.data.data = JSON.parse(decompress(res.data.data));
				// 	} catch (e) {
				// 		res.data.data = decompress(decodeURI(res.data.data));
				// 	}
				// }
				if (noVerify)
					reslove(res.data, res);
				else if (res.data.status == 200)
					reslove(res.data, res);
				else if ([410000, 410001, 410002, 40000].indexOf(res.data.status) !== -1) {
					toLogin();
					reject(res.data);
				} else if (res.data.status == 501) {
					uni.reLaunch({
						url: '/pages/error/index'
					})
					reject(res.data);
				}else if(res.data.status==400){
					reject(res.data.message || '系统错误');
				} else{
					reject(res.data.message || '系统错误');
				}
			},
			fail: (message) => {
				reject('请求失败');
			}
		})
	});
}
const request = {};
['options', 'get', 'post', 'put', 'head', 'delete', 'trace', 'connect'].forEach((method) => {
	request[method] = (api, data, opt) => baseRequest(api, method, data, opt || {})
});
export default request;
