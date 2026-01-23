import App from './App'
import { setupConfig } from  "./infrastructure/config/index";

import uView from "/uni_modules/uview-plus";

import { setupRouter } from  "./business/router/index.ts";

import { setimgUrl, createEle } from "./infrastructure/utils/imgUrls";

// import Filters from '/views/pages/save-money/infrastructure/utils/filter'
import {imgUrlEvent} from '/views/pages/save-money/infrastructure/utils/imgUrls'
import { setNativeView } from '/views/pages/save-money/infrastructure/utils/native-view';

// import "tailwindcss/tailwind.css";

import "./views/styles/animation.css";

import "./views/styles/common.scss";

import * as Pinia from  'pinia'
// #ifndef VUE3
import Vue from 'vue'
// import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from  'vue'

export function createApp() {
  const app = createSSRApp(App)

app.config.globalProperties.$imgUrl = imgUrlEvent
   app.use(uView)


  setupConfig(app).then(()=>{
    setupRouter(app)
  })
  setimgUrl(app)
  setNativeView();
  app.use(Pinia.createPinia());
  return {
    app,
    Pinia
  }
}
// #endif