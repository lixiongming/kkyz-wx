

// uni请求的二次封装
const baseUrl='http://47.113.109.163:80/'


export const request=(url,data={},method="GET",header={},)=>{
	return new Promise((resolve,reject)=>{

		uni.request({
			url:baseUrl+url,
			data,
			method,
			header,
			success:(res)=>{
				resolve(res.data)
			},
			fail:(err)=>{
				console.log('请求失败')
				reject(err)
			}
		})
		
	})
}



 export const imgUrl='http://miduoduo-metablock.oss-cn-shenzhen.aliyuncs.com'