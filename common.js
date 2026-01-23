const path = require("path");
// 注意： 打包成 h5 和 app 都不需要开启插件配置
const isH5 = process.env.UNI_PLATFORM === "h5";
const isApp = process.env.UNI_PLATFORM === "app";
const WeappTailwindcssDisabled = isH5 || isApp;
const fs = require('fs')
const resolve = (p) => {
    return path.resolve(__dirname, p);
};


/**
 * 修复HbuilderX #exec 指令不生效
 */
const replacePreprocess = ()=>{
	
	//要覆盖的文件
	let dest  = process.env.UNI_CLI_CONTEXT + "/node_modules/@dcloudio/uni-cli-shared/lib/preprocess/lib/preprocess.js"
	//自己维护的文件
	let src   = __dirname + '/infrastructure/vendor/preprocess.js'

	

	// 确保源文件存在  
	if (fs.existsSync(src) && fs.existsSync(dest )) {  
		
		let srcStat = fs.statSync(src)
		let destStat = fs.statSync(dest)
		if(srcStat.mtime.getTime() === destStat.mtime.getTime()){
			return 
		}
	    fs.copyFileSync(src , dest );  
		console.warn('启用项目内的preprocess.js，修复#exec 指令不生效')
	    console.warn('[' + src + ']文件已成功移动并覆盖['+dest+']文件')
		console.warn('如果出现TypeError: Cannot read properties of undefined (reading subPackages),请重新运行项目！')
	} 
	
}

module.exports = {
    WeappTailwindcssDisabled,
    resolve,
	replacePreprocess
}