/**
 * 缓存数据对象
 * @param {*} key 存储key
 * @returns 
 */
export function useCacheData(key) {

    // 未发布，保存用户输入数据
	function saveInputData(data) {
		uni.setStorageSync(key, data);
	}

	// 清除数据
	function clearInputData() {
		uni.removeStorageSync(key);
	}

	// 获取用户数据
	function getInputData() {
		return uni.getStorageSync(key);
	}

	// 缓存数据操作
	function inputDataOp(type, data) {
		switch(type) {
			case 'set':
				saveInputData(data);
				return;
			case 'get':
				return getInputData();
			case 'clear':
				clearInputData();
				return;
			default:
				return;
		}
	}

	// 对外暴露缓存数据操作(set|get|clear)
    return inputDataOp;
}