/**
 * @file 解决直接使用jwt-decode.js 出现以下错误问题
 * [decodeToken error] <InvalidTokenError: Invalid token specified: invalid base64 for part #2 (atob is not defined)>
InvalidTokenError: Invalid token specified: invalid base64 for part #2 (atob is not defined)
    at module.exports.o.jwtDecode (https://usr/appservice.app.js:629:2289)
    at v (https://usr/appservice.app.js:755:1016)
    at https://usr/appservice.app.js:755:3794
    at s (https://usr/appservice.app.js:575:738)
    at Generator.<anonymous> (https://usr/appservice.app.js:575:2075)
    at Generator.next (https://usr/appservice.app.js:575:1101)
    at asyncGeneratorStep (https://usr/appservice.app.js:537:58)
    at c (https://usr/appservice.app.js:537:277)
    at https://usr/appservice.app.js:537:370
    at new Promise (<anonymous>)
 */

// Base64解码函数
function base64Decode(input) {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    let str = "";
  
    // 处理 Base64 非法字符
    input = String(input).replace(/=+$/, "");
  
    if (input.length % 4 === 1) {
      throw new Error(
        "'atob' failed: The string to be decoded is not correctly encoded."
      );
    }
  
    for (
      let bc = 0, bs = 0, buffer, i = 0;
      (buffer = input.charAt(i++));
      ~buffer && ((bs = bc % 4 ? bs * 64 + buffer : buffer), bc++ % 4)
        ? (str += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
        : 0
    ) {
      buffer = chars.indexOf(buffer);
    }
  
    return str;
  }
   
  // JWT解码函数
  export const jwtDecode = (token) => {
    const [header, payload, signature] = token.split(".");
  
    if (!header || !payload || !signature) {
      throw new Error("Invalid token");
    }
  
    // 使用自定义的 Base64 解码函数解码 payload
    const decodedPayload = base64Decode(
      payload.replace(/-/g, "+").replace(/_/g, "/")
    );
    return JSON.parse(decodedPayload);
  };