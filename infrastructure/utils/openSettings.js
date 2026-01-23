let system = uni.getSystemInfoSync(); // 获取系统信息
/**检查是否打开GPS功能（android）**/
export const checkLocation = () => {
	if (system.platform === 'android') { // 判断平台
		openGps()
	} else if (system.platform == "ios") {
		//苹果打开对应的通知栏
		uni.showModal({
			title: "定位权限开启提醒",
			content: "未开启定位，请前往设置！",
			confirmText: "去设置",
			success: function(res) {
				if (res.confirm) {
					var app = plus.ios.invoke("UIApplication", "sharedApplication");
					var setting = plus.ios.invoke("NSURL", "URLWithString:", "app-settings:");
					plus.ios.invoke(app, "openURL:", setting);
					plus.ios.deleteObject(setting);
					plus.ios.deleteObject(app);
				}
			}
		});
	}
}
/**
 * 定位权限及弹出权限弹框
 * **/
let num = 0;
export const openGps = () => {
	plus.android.requestPermissions(
		['android.permission.ACCESS_FINE_LOCATION'],
		function(resultObj) {
			var result = 0;
			for (var i = 0; i < resultObj.granted.length; i++) {
				var grantedPermission = resultObj.granted[i]; //'已获取的权限：
				result = 1
			}
			for (var i = 0; i < resultObj.deniedPresent.length; i++) {
				var deniedPresentPermission = resultObj.deniedPresent[i]; //拒绝本次申请的权限
				num += 1
				result = 0
			}
			for (var i = 0; i < resultObj.deniedAlways.length; i++) {
				var deniedAlwaysPermission = resultObj.deniedAlways[i]; //永久拒绝申请的权限
				num += 1
				result = -1
			}
			// 若所需权限被拒绝,则打开APP设置界面,可以在APP设置界面打开相应权限
			if (result != 1) {
				setTimeout(() => {
					var Intent = plus.android.importClass("android.content.Intent")
					var Settings = plus.android.importClass("android.provider.Settings")
					var Uri = plus.android.importClass("android.net.Uri")
					var mainActivity = plus.android.runtimeMainActivity()
					var intent = new Intent()
					intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS)
					var uri = Uri.fromParts("package", mainActivity.getPackageName(), null)
					intent.setData(uri)
					mainActivity.startActivity(intent)
				}, 1200)
			} else {
				//因为安卓手机  手机授权之后还需要打开定位服务功能所有当手机授权之后 调用下面的方法
				var context = plus.android.importClass("android.content.Context")
				var locationManager = plus.android.importClass("android.location.LocationManager")
				var main = plus.android.runtimeMainActivity()
				var mainSvr = main.getSystemService(context.LOCATION_SERVICE)
				if (!mainSvr.isProviderEnabled(locationManager.GPS_PROVIDER)) {
					uni.showModal({
						title: '提示',
						content: '请打开定位服务功能',
						success(res) {
							if (res.confirm) {
								if (!mainSvr.isProviderEnabled(locationManager.GPS_PROVIDER)) {
									var Intent = plus.android.importClass('android.content.Intent');
									var Settings = plus.android.importClass('android.provider.Settings')
									var intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS)
									main.startActivity(intent) // 打开系统设置GPS服务页面
								} else {}
							}
						}
					});
					return
				}
			}
		},
		function(error) {
			resolve({
				code: error.code,
				message: error.message
			});
		}
	);
}