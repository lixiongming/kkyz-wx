

/**
 * 预加载图片(一个结果状态)
 * @param urls String[] 图片地址列表
 * @returns 加载图片完成状态(一个结果状态)
 */
export function preloadImageAll(urls) {
    const promises = urls.map(url => {
    return new Promise((resolve, reject) => {
        uni.getImageInfo({
            src: url,
            success: resolve,
            fail: reject
        });
    });
    });
    return Promise.all(promises);
}

/**
 * 预加载图片(多个结果状态)
 * @param urls String[] 图片地址列表
 * @returns 加载图片完成状态列表(多个结果状态)
 */
export function preloadImageAllSettled(urls) {
    const promises = urls.map(url => {
    return new Promise((resolve, reject) => {
        uni.getImageInfo({
            src: url,
            success: resolve,
            fail: reject
        });
    });
    });
    return Promise.allSettled(promises);
}

/**
 * 图片下载保存到相册
 * @param url 保存的图片的网络地址
 * @param successCb 成功回调
 * @param failCb 失败回调
 * @returns 成功或失败的promise
 */
export function downloadImageSaveAlbum(url, successCb, failCb) {
    return new Promise((resolve, reject,) => {
        // 下载文件(图片)
        uni.downloadFile({
            url: url, // 图片的网络地址
            success: (res) => {
                if (res.statusCode === 200) {
                    // 下载成功，获取临时文件路径
                    const tempFilePath = res.tempFilePath;
                    // 调用保存图片到相册的API
                    uni.saveImageToPhotosAlbum({
                        filePath: tempFilePath, // 使用临时文件路径
                        success: function() {
                            // 保存成功
                            uni.showToast({
                                title: "保存成功",
                                icon: "none"
                            });
                            resolve();
                            // 成功回调
                            successCb && successCb();
                        },
                        fail: function() {
                            // 保存失败
                            uni.showToast({
                                title: "保存失败，请稍后重试",
                                icon: "none"
                            });
                            reject();
                            // 失败回调
                            failCb && failCb();
                        }
                    });
                } else {
                    // 下载失败
                    uni.showToast({
                        title: "下载失败，请检查网络",
                        icon: "none"
                    });
                    reject();
                    // 失败回调
                    failCb && failCb();
                }
            },
            fail: () => {
                // 下载失败
                uni.showToast({
                    title: "下载失败，请检查网络",
                    icon: "none"
                });
                reject();
                // 失败回调
                failCb && failCb();
            }
        });
    });
}