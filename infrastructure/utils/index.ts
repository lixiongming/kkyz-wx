

// 复制到粘贴板
export const copyFn = (str,message) => {
    str = typeof str === "string" ? str : str.toString();
    uni.setClipboardData({
        data: String(str),
        success: function () {
        uni.showToast({
            title: message||"复制成功",
        });
        },
        fail: function () {
        uni.showToast({
            title: "复制失败",
        });
        },
    });
};

export const isTabbarPage = (url:any) => {
    let tabbar = [
        "views/pages/mine/index",
        "views/pages/message/index",
        "views/pages/explore/index",
        "views/pages/home/index",
        "/"
    ]
    return tabbar.includes(url)
}