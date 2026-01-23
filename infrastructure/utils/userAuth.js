// 隐私设置权限
export function privacyAuth(key) {
  const auths = uni.getStorageSync("_auth");
  return auths[key] == 1;
}
