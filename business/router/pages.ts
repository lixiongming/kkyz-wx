//该文件再项目启动前执行，要使用commonJs规范
const fs = require("fs");
const path = require("path");

/* #ifdef APP-PLUS */
//  const homePage = {
//   path: "views/pages/tabbars/index",
//   style: {
//     navigationBarTitleText: "首页",
//   },
// };
/* #endif */
const homePage = {
  path: "views/pages/save-money/views/pages/tabbar/index",
  style: {
    navigationBarTitleText: "首页",
  },
};

let list = [homePage];

var filedir = __dirname + "/page_modules";
var files = fs.readdirSync(filedir);

//遍历读取到的文件列表
files.forEach(function (filename) {
  console.log(filename,'filename')
  //获取当前文件的绝对路径
  var file = path.join(filedir, filename);
  //根据文件路径获取文件信息，返回一个fs.Stats对象
  let module = require(file);
  list = list.concat(module)
});

module.exports = list;
