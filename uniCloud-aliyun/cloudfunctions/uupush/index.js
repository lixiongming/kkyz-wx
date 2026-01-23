'use strict';  
const uniPush = uniCloud.getPushManager({appId:"__UNI__5E7CD8B"})
exports.main = async (event, context) => {
	let obj = JSON.parse(event.body)
    return await uniPush.sendMessage({
        "title": obj.title,
        "content": obj.content
	}) 
};