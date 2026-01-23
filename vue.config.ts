let filePath = "";
let Timestamp = "";
// import { production } from '@/infrastructure/utils/env.ts'
let time =  new Date().getTime();
//编译环境判断，判断是否为h5环境
if (process.env.UNI_PLATFORM === "h5") {
  filePath = "static/js/"; //打包文件存放路径
  Timestamp = "." + new Date().getTime(); //时间戳
}
console.log(Timestamp,'Timestamp')
module.exports = {
  // 配置路径别名
  configureWebpack: {
    output: {
      filename: `${filePath}[name]${Timestamp}.ts`,
      chunkFilename: `${filePath}[name]${Timestamp}.ts`,
    },
    devServer: {
      // 调试时允许内网穿透，让外网的人访问到本地调试的H5页面
      disableHostCheck: true,
    },
  },
  //productionSourceMap: false,
};
