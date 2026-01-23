/**
 * 文件(图片/视频)请求
 * @param {String} url - 请求地址
 * @param {Object} file_options - 上传文件相关对象(包含filePath, name)
 * @param {Function} successCallback - 回调
 * @returns 
 */
export function fileRequest(url, file_options, callback) {
    let Url = uni.$config.baseURL,
      header = {};
  
    if (uni.getStorageSync("token"))
      header.Authorization = "Bearer " + uni.getStorageSync("token");
    return new Promise((resolve, reject) => {
        uni.uploadFile({
            url: Url + "api/" + url, // 仅为示例，非真实的接口地址
            filePath: file_options.filePath, // 文件地址
            name: file_options.name,
            header: header,
            method: "POST",
            formData: {},
            success: (res) => {
                if (res.data) {
                    try {
                        res.data = JSON.parse(res.data);
                    } catch (e) {
                        res.data = res.data;
                    }
                }
                console.log("Success", res);
                callback(res, resolve, reject);
            },
            fail: (err) => {
                reject('请求错误');
            }
        });
    });
}