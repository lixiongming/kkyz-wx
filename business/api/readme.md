# 接口目录
接口文件参见下面写法
eg:
```
export default {
	register(data){
			return uni.$u.post("/api/login/register", data)
	} 
	,getUserInfo(data){
		return uni.$u.get('/api/ucenter/info', data)
	}
	,editPwd(data){
		return uni.$u.post('/api/ucenter/edit-pwd',data)
	}
	,login(data){
		return uni.$u.post('/api/login/login',data)
	}
}
```

## 如何定义 http的 其他信息？

参见 infrastructure/request/interceptor.js 。 具体设置参见 uview文档