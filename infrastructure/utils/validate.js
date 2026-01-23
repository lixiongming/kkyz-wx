 
/**
 * 验证小数点后两位及多个小数
 * money 金额
 */
export function isMoney(money) {
	var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
	if (reg.test(money)) {
		return true
	} else {
		return false
	}
}
/**
 * 验证手机号码
 */
export function checkPhone(phone) {
	var reg = /^1(3|4|5|6|7|8|9)\d{9}$/
	if (reg.test(phone)) {
		return true
	} else {
		return false
	}
}


/**
 * 验证邮箱
 */
export function isEmailAvailable(emailInput) {
	var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
	if (!myreg.test(emailInput)) {
		return false;
	} else {
		return true;
	}
}

/**
 * 函数防抖 (高级防抖) gan 1/3
 * @param fn
 * @param t delay执行时间
 * @param immediate 是否立即执行 true为立即执行 false为延迟执行
 * @returns {Function}
 * @constructor
 */
export const Highdebounce = function(func, t, immediate) {
		let delay = t || 500;
		let timerout
		return function() {
			let context = this;
			let args = arguments;
			clearTimeout(timerout)
			if (immediate) {
				let callNow = !timerout;
				timerout = setTimeout(() => {
					timerout = null;
				}, delay);
				if (callNow) func.apply(context, args);
			} else {
				timerout = setTimeout(function() {
					func.apply(context, args);
				}, delay);
			}
		}
	}