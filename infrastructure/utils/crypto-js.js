// 引入crypto - js库
import CryptoJS from 'crypto-js';
 
// 密钥
const secretKey = CryptoJS.enc.Utf8.parse("5488eb2dc07aba10df9470260a36197c");
// 偏移量
const iv = CryptoJS.enc.Utf8.parse("cec6334cc0ad435a")
// 密钥与偏移量若与服务端有交互，则需确保它们与服务端使用的是相同的。 
 
// 加密模式：【CBC(默认) ECB CFB OFB CTRGladman(CTR)】
// 填充方式：【 NoPadding ZeroPadding Pkcs7(Pkcs5)(默认) Iso10126 Iso97971 AnsiX923】
 
/** 加密函数
 * @param {Object} data
 */
export const encryptAES=(data)=> {
	let encryptedParams = typeof data === 'string' ? data : JSON.stringify(data)
	let encrypted = CryptoJS.AES.encrypt(encryptedParams, secretKey, {
		iv: iv,
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.Pkcs7
	})
	return encrypted.toString();
}
 
/** 解密函数
 * @param {Object} params
 */
export const decryptAES=(params)=> {
	let decrypted = CryptoJS.AES.decrypt(params, secretKey, {
		iv: iv,
		mode: CryptoJS.mode.CBC, // 加密模式
		padding: CryptoJS.pad.Pkcs7 // 填充方式
	});
	let decryptedData = decrypted.toString(CryptoJS.enc.Utf8)
	// a.解密的数据为纯字符串则直接return
	// b.解密的数据为JSON后的字符串则 JSON.parse 后返回
	// c.无法解析其类型则返回空数据
	switch (isStringOrValidJSON(decryptedData)) {
		case 'String':
			return decryptedData
			break;
		case 'JSON':
			return JSON.parse(decryptedData)
			break;
		default:
			return ""
			break;
	}
}
 
/** 判断是否是纯字符串还是JSON字符串
 * @param {Object} value
 */
const isStringOrValidJSON=(value)=> {
	try {
		JSON.parse(value);
		return 'JSON';
	} catch (e) {
		if (typeof value === 'string') {
			return 'String';
		}
	}
	return 'Invalid';
}