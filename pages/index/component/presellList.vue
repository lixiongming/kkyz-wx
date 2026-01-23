<template>
	<view></view>
</template>

<script>
 
	
import easyLoadimage from '@/components/easy-loadimage/easy-loadimage.vue';
import { getPresellData } from '@/api/api.js';
import { HTTP_REQUEST_URL } from '@/config/app';
export default {
	components:{
		easyLoadimage
	},
	name: 'presellList',
	props: {
		dataConfig: {
			type: Object,
			default: () => {}
		},
		merId: {
			type: String || Number,
			default: ''
		}	
	},
	data() {
		return {
			domain: HTTP_REQUEST_URL,
			presellList: [],
			mbConfig: this.dataConfig.mbConfig.val*2, //页面间距
			styleType: this.dataConfig.tabConfig.tabVal, //单行，多行，板块
			bgStyle: this.dataConfig.bgStyle.type ? 20 : 0,
			conStyle: this.dataConfig.conStyle.type ? 16 : 0,
			conStyles: this.dataConfig.conStyle.type,
			titleShow: this.dataConfig.titleShow.val,
			priceShow: this.dataConfig.priceShow.val,
			themeColor: this.dataConfig.themeColor && this.dataConfig.themeColor.color[0].item,
			presellShow: this.dataConfig.presellShow.val,
			diy_id: this.dataConfig.did,
			unique: this.dataConfig.timestamp,
		};
	},
	created() {},
	mounted() {
		this.getPresellProduct()
	},
	methods: {
		// 预售
		getPresellProduct() {
			let that = this;
			getPresellData({
				diy_id: that.diy_id,
				unique: that.unique,
				mer_id: that.merId,
				limit: that.styleType == 2 ? 3 : 12
			}).then(res => {
				that.presellList = res.data.list;
			}).catch(e => {});
		},
	}
};
</script>

<style scoped lang="scss">
@import '../style/main.scss';
.presell-wrapper{
	margin: 0 20rpx;
}
.spike-wrapper {
	box-sizing: border-box;
	&.wrapper2{
		padding: 0 20rpx 20rpx;
	}	
}
.presell-count {
	background-color: #fff;
	border-radius: 16rpx;
	box-shadow: 4rpx 2rpx 12rpx 2rpx rgba(0, 0, 0, 0.03);
}
.title-bd {
	margin-bottom: 0;
	padding: 24rpx 30rpx 30rpx 30rpx;
	border-radius: 16rpx 16rpx 0 0;
	background-size: 100%;
	background-repeat: no-repeat;
	.more-btn {
		top: 23rpx;
	}
}
.wapper_count {
	padding-left: 20rpx;
}
.wrapper-count2{
	.wapper_count{
		padding: 0;
	}
}
</style>
