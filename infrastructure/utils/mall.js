 
// import {
// 	spread
// } from "@/api/user";
import Cache from '@/infrastructure/utils/cache';
// import Store from '@/store/index';
import mallStore from "@/business/store/modules/mall";

export function configMap(args, init) {
	if(Array.isArray(args)) {
		return args.reduce((i, v)=>{
			i[v] = () => Store.getters.globalData[v];
			return i;
		}, init || {})
	}else{
		return Object.keys(args).reduce((i, v)=>{
			i[v] = () => {
				const val = Store.getters.globalData[v];
				return (val === undefined || val === null || val === '') ? args[v] : val;
			};
			return i;
		}, init || {})
	}
}

export function redirect(url){
	uni.switchTab({
		url,
		fail(){
			uni.redirectTo({
				url
			})	
		}
	})
}

/**
 *  转换商户跳转链接, 自动追加商户 id
 * @param {string} path
 * @param {int} mer_id
 * @param {string} name 商户id  参数名, 默认 mer_id
 */
export function merPath(path, mer_id, name){
	if(!mer_id) return path;
	path += ((path.indexOf('?') > -1 ? '&' : '?') + (name || 'mer_id') + '=' + mer_id);
	return path;
}

/**
 * 绑定用户授权
 * @param {Object} puid
 */
export function silenceBindingSpread() {
    const store = mallStore();
	//#ifdef H5
	let puid = Cache.get('spread');
	//#endif

	//#ifdef MP || APP-PLUS
	let puid = store.globalData.spid;
	if (!puid) {
		puid = store.globalData.code;
	}
	//#endif

	puid = parseInt(puid);
	if (Number.isNaN(puid)) {
		puid = 0;
	}
	if (puid) {

		//#ifdef H5
		Cache.clear('spread');
		//#endif

		//#ifdef MP || APP-PLUS
		store.globalData.spid = 0;
		store.globalData.code = 0;
		//#endif


	}
}

export function isWeixin() {
	// 注释原来的,隐藏微信授权,不判断是否微信H5,甘
	// return false;	
	return navigator.userAgent.toLowerCase().indexOf("micromessenger") !== -1;
}

export function parseQuery() {
	const res = {};

	const query = (location.href.split("?")[1] || "")
		.trim()
		.replace(/^(\?|#|&)/, "");

	if (!query) {
		return res;
	}

	query.split("&").forEach(param => {
		const parts = param.replace(/\+/g, " ").split("=");
		const key = decodeURIComponent(parts.shift());
		const val = parts.length > 0 ? decodeURIComponent(parts.join("=")) : null;

		if (res[key] === undefined) {
			res[key] = val;
		} else if (Array.isArray(res[key])) {
			res[key].push(val);
		} else {
			res[key] = [res[key], val];
		}
	});

	return res;
}

	/**
	 * Luhn校验算法校验银行卡号；Luhm校验规则：16位银行卡号（19位通用）:1、将未带校验位的 15（或18）位卡号从右依次编号 1 到 15（18），位于奇数位号上的数字乘以 2；2、将奇位乘积的个十位全部相加，再加上所有偶数位上的数字。
	 * @param {string} bankno 银行卡号
	 * @returns 是否为正确的银行卡号
	 */
	export function verifyBankCardNumber(bankno) {
		var lastNum = bankno.substr(bankno.length - 1, 1); //取出最后一位（与luhm进行比较）
		var first15Num = bankno.substr(0, bankno.length - 1); //前15或18位
		var newArr = new Array();
		for (var i = first15Num.length - 1; i > -1; i--) {
			//前15或18位倒序存进数组
			newArr.push(first15Num.substr(i, 1));
		}
		var arrJiShu = new Array(); //奇数位*2的积 <9
		var arrJiShu2 = new Array(); //奇数位*2的积 >9
		var arrOuShu = new Array(); //偶数位数组
		for (var j = 0; j < newArr.length; j++) {
			if ((j + 1) % 2 == 1) {
				//奇数位
				if (parseInt(newArr[j]) * 2 < 9) arrJiShu.push(parseInt(newArr[j]) * 2);
				else arrJiShu2.push(parseInt(newArr[j]) * 2);
			} //偶数位
			else arrOuShu.push(newArr[j]);
		}
		var jishu_child1 = new Array(); //奇数位*2 >9 的分割之后的数组个位数
		var jishu_child2 = new Array(); //奇数位*2 >9 的分割之后的数组十位数
		for (var h = 0; h < arrJiShu2.length; h++) {
			jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
			jishu_child2.push(parseInt(arrJiShu2[h]) / 10);
		}
		var sumJiShu = 0; //奇数位*2 < 9 的数组之和
		var sumOuShu = 0; //偶数位数组之和
		var sumJiShuChild1 = 0; //奇数位*2 >9 的分割之后的数组个位数之和
		var sumJiShuChild2 = 0; //奇数位*2 >9 的分割之后的数组十位数之和
		var sumTotal = 0;
		for (var m = 0; m < arrJiShu.length; m++) {
			sumJiShu = sumJiShu + parseInt(arrJiShu[m]);
		}
		for (var n = 0; n < arrOuShu.length; n++) {
			sumOuShu = sumOuShu + parseInt(arrOuShu[n]);
		}
		for (var p = 0; p < jishu_child1.length; p++) {
			sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]);
			sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]);
		}
		//计算总和
		sumTotal =
			parseInt(sumJiShu) +
			parseInt(sumOuShu) +
			parseInt(sumJiShuChild1) +
			parseInt(sumJiShuChild2);
		//计算Luhm值
		var k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10;
		var luhm = 10 - k;
		var my = false;
		if (lastNum == luhm) {
			//Luhm验证通过
			my = true;
		} else {
			//银行卡号必须符合Luhm校验
			my = false;
		}
		return my;
	}
 
let token = ''
try {
	token = uni.getStorageSync('LOGIN_STATUS_TOKEN')
} catch (error) {

}
// const VUE_APP_WS_URL = process.env.VUE_APP_WS_URL || `ws://${location.hostname}?type=user&token=${token}`;
// const VUE_APP_WS_URL = `wss://mer.crmeb.net?type=user&token=${token}`
export default parseQuery;


