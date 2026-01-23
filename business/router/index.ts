import uniCrazyRouter from "uni-crazy-router";
import routes from "@/pages.json";
import { isTabbarPage } from "@/infrastructure/utils/index.ts";

// var routes = ROUTES_MAP;
// const pay_page_list = ['views/pages/save-money/views/pages/member/index','views/pages/save-money/views/pages/territory/index','views/pages/save-money/views/pages/packet/send-packet','views/pages/save-money/views/pages/member/experience-officer']

const Blacklist = ['views/pages/publish/s_notes', 'views/pages/publish/s_article', 'views/pages/publish/s_video']
export function setupRouter(app: any) {
  // 接收vue3的实例，并注册uni-crazy-router
  app.use(uniCrazyRouter);

  uniCrazyRouter.beforeEach(async (to, from, next) => {

    if (from.url == 'views/pages/home/index') {
      uni.showTabBar();
    }

    if (checkLogin(to.url)) {
      console.log('放行', to.url)
      // istabbarStyle(to)
      next();
      // 逻辑代码
    }
  });
  
  uniCrazyRouter.afterEach((to, from) => {
    // reflashHomePage(to);
  });
  
  uniCrazyRouter.onError((to, from) => {
    // 逻辑代码
  });
  
  function checkLogin(url: string){
    let route = routes.pages.find(item => item.path === url)
    const isLogin = uni.getStorageSync("isLogin");
    if (route && route?.meta?.auth == true && !isLogin) {
      setTimeout(() => {
        uni.navigateTo({
          url: '/views/pages/mine/login',
        });
      });
      return false;
    }
    return true
  }
  
  // 判断tabbar是否为主页设置对应的背景色
  const istabbarStyle = (data: any) => {
    console.log(data.url, '路由参数')
    let ishome = data.url == '/'
    let isExplorer = data.url == 'views/pages/explore/index'
    // #ifdef APP-PLUS
    ishome = data.url == 'views/pages/home/index'
    // #endif 
  
    try{
      if (ishome) {
        uni.$emit('enterHome')
      } else {
        uni.$emit('outHome', '')
      }
      uni.setTabBarStyle({
        color: '#777777',
        selectedColor: '#1CDAFE',
        backgroundColor: ishome || isExplorer ? "#000" : "#fff",
        borderStyle: ishome || isExplorer ? "#000" : "#fff",
      });
    }catch(err){
       console.log(err,12323)
    }
  
  //  await setTimeout(() => {
    
  //   }, 0);
  }
}


