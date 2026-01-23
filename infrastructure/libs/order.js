 

export function goShopDetail(item,uid) {	
	return new Promise(resolve => {
		if (item.product_type === 1) {
			uni.navigateTo({
				url: `/pagesActivity/goods_seckill_details/index?id=${item.product_id}&time=${item.stop_time}`
			})
		} else if (item.product_type === 2) {
			uni.navigateTo({
				url: `/pagesActivity/presell_details/index?id=${item.activity_id}`
			})
		} else if (item.product_type === 0 || item.product_type === 10) {
			let url =  `/pagesProduct/goods_details/index?id=${item.product_id}`;
			if(item.welfareType&&item.welfareType.title){
				url = url + '&title=' + item.welfareType.title
			}
			uni.navigateTo({
				url
			})	
		}else if (item.product_type === 4) {
			uni.navigateTo({
				url: `/pagesActivity/combination_details/index?id=${item.activity_id}`
			})
		}else if (item.product_type === 40) {
			uni.navigateTo({
				url: `/pagesActivity/combination_status/index?id=${item.activity_id}`
			})
		}else {
			resolve(item);
		}
	});
}

export function goPage() {
	return new Promise(resolve => {
		resolve(true);
	});
}
