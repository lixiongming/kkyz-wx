/**
 * 校验完整网址正则
 * @param url String
 * @returns Boolean
 */
export function isValidURL(url) {
    const strRegex = /(http|https):\/\/([\w.]+\/?)\S*/;
    return strRegex.test(url);
}