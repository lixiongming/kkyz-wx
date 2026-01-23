import dev from  '../env/development.js'
import pro from  '../env/production.js'
// 加载当前环境下的配置
const env = process.env.NODE_ENV || 'production';
export function setimgUrl(app) {
    install()
}
const install = () => {
    uni.$imgUrl = loadimgUrl
};

function loadimgUrl(url, imgArgName) {
  const imgUlr = env === 'production' ? pro[imgArgName] : dev[imgArgName];
    //判断imgurl是否有前缀
  if (url?.slice(0, 4) == "http") {
    return url;
  } else {
    return imgUlr + url;
  }
}

// 行内调用此方法
export function imgUrlEvent(url, imgArgName = 'aliyunImgUrl'){
   return  loadimgUrl(url, imgArgName)
}