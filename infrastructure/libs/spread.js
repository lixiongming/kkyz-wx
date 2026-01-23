 
import { spread } from '@/business/api/modules/user.ts'
import Cache from "@/infrastructure/utils/cache.js";

const shareScence = function(spid,islogin) {
    if(spid)Cache.set("spread", spid || 0);
	if(spid && islogin){
		spread(spid).then(res=>{
		}) 
	} 
}
export default shareScence

