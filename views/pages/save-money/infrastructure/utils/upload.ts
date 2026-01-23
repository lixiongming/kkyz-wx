



let header = {
    // #ifdef MP
    "Content-Type": "multipart/form-data",
    // #endif
    "Authorization": "Bearer " + uni.getStorageSync("token"),
}
// 新增图片
const afterRead = async (arr: any, urls: any) => {
    console.log(urls)
    const res: any = await uploadFilePromise(urls[0])
    console.log(res, 1232132)
    arr.push({ path: res.url, urlUp: res.sendUrl })
    console.log(arr, 'arr')
}
// 上传图片或视频请求
async function uploadFilePromise(url: string) {
    header = {
        // #ifdef MP
        "Content-Type": "multipart/form-data",
        // #endif
        "Authorization": "Bearer " + uni.getStorageSync("token"),
    }
    const action = uni.$config.baseURL + "api/post/uploadImage";
    return new Promise((resolve, reject) => {
        uni.uploadFile({
            url: action, // 仅为示例，非真实的接口地址
            filePath: url,
            name: 'image',
            header: header,
            formData: {},
            success: (res: any) => {
                setTimeout(() => {
                    const data = JSON.parse(res.data);
                    if (data.code === 500) {
                        uni.showToast({
                            title: data.message,
                            icon: "none",
                            duration: 2000
                        });
                        resolve({ url: "", sendUrl: "", status: 'failed', message: '', type: 'image' });
                        console.log("500-->", data);
                        return;
                    } else if (data.code === 401) {
                        uni.showToast({
                            title: '请先登录',
                            icon: "none",
                            duration: 2000
                        });
                        resolve({ url: "", sendUrl: "", status: 'failed', message: '', type: 'image' });
                        console.log("500-->", data);
                        return;
                    } else {
                        console.log("非500-->", data);
                        resolve({ url: data?.data?.image_url, sendUrl: data?.data?.url, status: 'success', message: '', type: 'image' })
                    }

                }, 1000)
            },
            fail: (err) => {
                console.log("err-->", err);
                uni.showToast({
                    title: err,
                    icon: "none",
                    duration: 2000
                });
                resolve({ url: "", sendUrl: "", status: 'failed', message: '' });
            }
        });
    })
}



// 上传图片
export const uploadImg = async (arr: any, count = 9, callback: any) => {
    uni.chooseImage({
        count,
        sourceType: ['album'],
        success:  (res: any) => {
            callback()
            afterRead(arr, res.tempFilePaths)
        }
    })
}


