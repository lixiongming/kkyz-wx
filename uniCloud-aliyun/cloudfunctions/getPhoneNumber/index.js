"use strict";
// 云函数验证签名，此示例中以接受GET请求为例作演示
// const crypto = require("crypto");
exports.main = async (event, context) => {
    // const secret = "kkyz-snb-88"; // 密钥
    // const hmac = crypto.createHmac("sha256", secret);

    // let params = event.queryStringParameters;
    // const sign = params.sign;
    // delete params.sign;
    // const signStr = Object.keys(params)
    //     .sort()
    //     .map((key) => {
    //         return `${key}=${params[key]}`;
    //     })
    //     .join("&");

    // hmac.update(signStr);

    // if (sign !== hmac.digest("hex")) {
    //     throw new Error("非法访问");
    // }

    const res = await uniCloud.getPhoneNumber({
        provider: "univerify",
        appid: "__UNI__5E7CD8B", // DCloud appid，不同于callFunction方式调用，使用云函数Url化需要传递DCloud appid参数
        apiKey: "5786778f65271ca73733a23d0f53c600", // 在开发者中心开通服务并获取apiKey
        apiSecret: "484ec50d254af52dd3077cbd3876be86", // 在开发者中心开通服务并获取apiSecret
        access_token: event.access_token,
        openid: event.openid,
    });
    // 返回手机号给自己服务器
    return res;
};
