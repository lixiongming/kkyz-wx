<template>
	<view :style="mall_store.viewColor">
		<form @submit="formSubmit" report-submit='true'>
			<view class='evaluate-con' v-if="product_info.product">
				<view class='goodsStyle acea-row row-between'>
					<view class='pictrue'>
						<image :src='product_info.productAttr.image' v-if="product_info.productAttr.image"></image>
						<image :src='product_info.product.image' v-else></image>
					</view>
					<view class='text acea-row row-between'>
						<view class='name'>{{product_info.product.store_name}}</view>
						<view class='money'>
							<view>￥{{ product_info.product_type == 3 ? product_info.productAssistAttr.assist_price : product_info.productAttr.price}}</view>
							<view class='num'>x{{cart_num}}</view>
						</view>
					</view>
				</view>
				<view class='score'>
					<view class='item acea-row row-middle' v-for="(item,indexw) in score_list" :key="indexw">
						<view>{{item.name}}</view>
						<view class='starsList'>
							<text @click="stars(indexn, indexw)" v-for="(itemn, indexn) in item.stars" :key="indexn" class='iconfont' :class="item.index >= indexn? 'icon-shitixing font-color':'icon-kongxinxing'"></text>
						</view>
						<text class='evaluate'>{{item.index === -1 ? "" : item.index + 1 + "分"}}</text>
					</view>
					<view class='textarea'>
						<textarea placeholder='商品满足你的期待么？说说你的想法，分享给想买的他们吧~' name="comment" placeholder-class='placeholder'></textarea>
						<view class='list acea-row row-middle'>
							<view class='pictrue' v-for="(item,index) in pics" :key="index">
								<image :src='item'></image>
								<text class='iconfont icon-guanbi1 font-color' @click='delPic(index)'></text>
							</view>
							<view class='pictrue acea-row row-center-wrapper row-column' @click='uploadpic' v-if="pics.length < 6">
								<text class='iconfont icon-icon25201'></text>
								<view>上传图片</view>
							</view>
						</view>
					</view>
					<button class='evaluateBnt' formType="submit">立即评价</button>
				</view>
			</view>
		</form>
	</view>
</template>

<script lang="js" setup>
	import { ref,  } from 'vue'
	import { onLoad } from "@dcloudio/uni-app";
	import { orderProductApi,orderCommentApi} from '@/business/api/modules/order';
	import { toLogin } from '@/infrastructure/libs/login.js';
	import util from '@/infrastructure/utils/utils'
	import store from '@/business/store/modules/mall';
	const mall_store = store()
	const welfare_post_id = ref('')
	const pics = ref([])
	const score_list = ref([{
			name: "商品质量",
			stars: ["", "", "", "", ""],
			index: -1
		},
		{
			name: "服务态度",
			stars: ["", "", "", "", ""],
			index: -1
		},
		{
			name: "物流服务",
			stars: ["", "", "", "", ""],
			index: -1
		}
	])
	const order_id = ref('')
	const unique = ref('')
	const product_info = ref({})
	const cart_num = ref(0)
	const latitude = ref('')
	const longitude = ref('')
	
	onLoad((options) => {
		if(options.welfare_post_id){
		console.log(options.welfare_post_id,'welfare_post_id')
		welfare_post_id.value = options.welfare_post_id
		}
		if (!options.uni && options.order_id) return util.Tips({
			title: '缺少参数'
		}, {
			tab: 3,
			url: 1
		});
		unique.value = options.uni;
		order_id.value = options.order_id;
		let is_login = uni.getStorageSync('isLogin')
		if (is_login) {
			getOrderProduct();
			selfLocation();
		} else {
			toLogin()
		}
	})
	
	/**
	 * 获取某个产品详情
	 *
	 */
	function getOrderProduct() {
		orderProductApi({ order_product_id: unique.value }).then(res => {
			product_info.value = res.data.cart_info
			cart_num.value = res.data.product_num;
		}).catch(error=>{
			util.Tips({
				title:error
			},{
				tab: 3,
				url: 1
			})
		})
	}
	function stars(indexn, indexw) {
		score_list.value[indexw].index = indexn;
	}
	/**
	 * 删除图片
	 *
	 */
	function delPic(index) {
		let pic = pics.value[index];
		pics.value.splice(index, 1);
	}
	
	/**
	 * 上传文件
	 *
	 */
	function uploadpic() {
		util.uploadImageOne('post/uploadImage', function(res) {
			console.log(res);
			pics.value.push(res.data.image_url);
		});
	}
	/**
	 * 立即评价
	 */
	function formSubmit(e) {
		let value = e.detail.value,
			product_score = score_list.value[0].index + 1 === 0 ? "" : score_list.value[0].index + 1,
			service_score = score_list.value[1].index + 1 === 0 ? "" : score_list.value[1].index + 1,
			logistics_score = score_list.value[2].index + 1 === 0 ? "" : score_list.value[2].index + 1;
		if (!value.comment) return util.Tips({title: '请填写你对宝贝的心得！'});
		value.product_score = product_score + '';
		value.service_score = service_score + '';
		value.postage_score = logistics_score + '';
		value.pics = pics.value;
		uni.showLoading({
			title: "正在发布评论……"
		});
		
		value.location = latitude.value + ',' + longitude.value
		orderCommentApi({ ...value, order_product_id: unique.value }).then(res => {
			uni.hideLoading();
			util.Tips({
				title: '感谢您的评价!',
				icon: 'success'
			});
			setTimeout(()=>{
             if(welfare_post_id.value){
				console.log('跳转驿站商品详情')
              uni.redirectTo({url:'/packages/mall/views/pages/users/post-station/purchase-detail?order_id=' + order_id.value + '&welfare_post_id=' + welfare_post_id.value})
			 }else{
               uni.redirectTo({url:'/pagesOrder/order-details/index?order_id=' + order_id.value})
			 }
				
			},500)
		}).catch(err => {
			uni.hideLoading();
			return util.Tips({
				title: err
			});
		});
	}
	function selfLocation() {
		uni.getLocation({
			type: 'gcj02',
			success: (res) => {
				// console.log(res,'2222')
				latitude.value = res.latitude
				longitude.value = res.longitude
			},
			fail: (res) => {
				uni.showToast({
					title: res,
					icon: 'none',
					duration: 1000
				});
			},
			complete: (res) => {
			}
		});
	}
	
</script>

<style lang="scss" scoped>
	.evaluate-con .score {
		background-color: #fff;
		border-top: 1px solid #f5f5f5;
		font-size: 28rpx;
		color: #282828;
		padding: 48rpx 30rpx 65rpx 30rpx;
	}
	.evaluate-con .score .item~.item {
		margin-top: 30rpx;
	}
	.evaluate-con .score .item .starsList {
		padding: 0 35rpx 0 40rpx;
	}
	.evaluate-con .score .item .starsList .iconfont {
		font-size: 40rpx;
		color: #aaa;
	}
	.evaluate-con .score .item .starsList .iconfont~.iconfont {
		margin-left: 20rpx;
	}
	.evaluate-con .score .item .evaluate {
		color: #aaa;
		font-size: 24rpx;
	}
	.evaluate-con .score .textarea {
		width: 690rpx;
		background-color: #fafafa;
		border-radius: 10rpx;
		margin-top: 48rpx;
	}
	.evaluate-con .score .textarea textarea {
		font-size: 28rpx;
		padding: 38rpx 30rpx 0 30rpx;
		width: 100%;
		box-sizing: border-box;
		height: 160rpx;
	}
	.evaluate-con .score .textarea .placeholder {
		color: #bbb;
	}
	.evaluate-con .score .textarea .list {
		margin-top: 25rpx;
		padding-left: 5rpx;
	}
	.evaluate-con .score .textarea .list .pictrue {
		width: 140rpx;
		height: 140rpx;
		margin: 0 0 35rpx 25rpx;
		position: relative;
		font-size: 22rpx;
		color: #bbb;
	}
	.evaluate-con .score .textarea .list .pictrue:nth-last-child(1) {
		border: 1px solid #ddd;
		box-sizing: border-box;
	}
	.evaluate-con .score .textarea .list .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 3rpx;
	}
	.evaluate-con .score .textarea .list .pictrue .icon-guanbi1 {
		font-size: 45rpx;
		position: absolute;
		top: -20rpx;
		right: -20rpx;
	}
	.evaluate-con .score .textarea .list .pictrue .icon-icon25201 {
		color: #bfbfbf;
		font-size: 50rpx;
	}
	.evaluate-con .score .evaluateBnt {
		font-size: 30rpx;
		color: #fff;
		width: 690rpx;
		height: 86rpx;
		border-radius: 43rpx;
		text-align: center;
		line-height: 86rpx;
		margin-top: 45rpx;
		background-color: var(--view-theme);
	}
</style>
