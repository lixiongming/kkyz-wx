import { loadModules, mountToApp } from "@/packages/kkyz/infrastructure/utils/common";
import constant from "./modules/constant.js";
import dev from  '../env/development.js'
import pro from  '../env/production.js'
// 加载当前环境下的配置
const env = process.env.NODE_ENV || 'production';

let  config = { ...constant};

async function loadConfig() {
//   console.log(config);
//   console.log(env)
   if(env=='production'){
	config={...config,...pro}
   }else{
	config={...config,...dev}
   }
uni.$config=config
console.log(uni.$config)
}

const install = (Vue) => {
  mountToApp(Vue, "$config", config);
};

export function setupConfig(app) {
  return loadConfig().then(()=>{
	app.use(install);
  }) 
}
