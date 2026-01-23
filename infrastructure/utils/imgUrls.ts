import dev from  '../config/env/development.js'
import pro from  '../config/env/production.js'
// import GlobalPopup from '/views/pages/save-money/views/components/global-popup.vue'
// 加载当前环境下的配置
const env = process.env.NODE_ENV || 'production';
export function setimgUrl(app) {
    install()
}
const install = () => {
    uni.$imgUrl = loadimgUrl
    // uni.$globalPopup = createEle;
};

function loadimgUrl(url, imgArgName) {
  // 全部替换为阿里云
  const imgUlr = env === 'production' ? pro['aliyunImgUrl'] : dev['aliyunImgUrl'];
    //判断imgurl是否有前缀
  if (url?.slice(0, 4) == "http") {
    return url;
  } else {
    //  判断为七牛云，全部替换路径
    return imgUlr + (imgArgName == 'imgUrl' ? '/qny' + url : url);
  }
}

// 行内调用此方法
export function imgUrlEvent(url, imgArgName = 'imgUrl'){
   return loadimgUrl(url, imgArgName)
}

// export function createEle() {
//   const popup = new GlobalPopup({
//     el: document.createElement('div')
//   })
//   document.body.appendChild(popup.$el)
//   popup.openPopup()
// }