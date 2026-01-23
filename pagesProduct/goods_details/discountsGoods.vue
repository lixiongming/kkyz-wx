<template>
	<view :style="localViewColor">
		<view class="container" :class="popup.show==true?'on':''">
			<view class="header">
				<text class="title">优惠套餐({{discountsTotal}})</text>
				<text class="iconfont icon-guanbi5" @tap.stop="closePopup"></text>
			</view>
			<view class="main_count">
				<scroll-view scroll-y="true">
					<view v-for="(item, index) in discountsData" :key="index" class="list">
						<view class="acea-row list_title">
							<view class="combo_list_name">
								<image class="title_icon" src="/static/images/combo_title.png"></image>
								<view class="name line1">套餐{{index+1}}: {{item.title}}</view>
							</view>
							<view class="combo_list_money">￥{{item.total_price}}</view>
						</view>
						<view v-if="item.is_time == 1">
							<view class="comb_time">
								<text class="count-time">距套餐结束</text>
								<countDown class="spike-count" :tip-text="' '" :day-text="'天'" :hour-text="':'" :minute-text="':'" :second-text="' '" :isDay="true" :datatime="item.stop_time" :isTheme="true" :isView="true"></countDown>
							</view>
						</view>
						<block v-for="(itemn, indexn) in item.discountsProduct" :key="indexn">
								<view class="pro_list">
									<view v-if="item.type == 1 && indexn!=0" class="checkbox" @tap.stop="checkedChange(item,itemn)">
										<text v-if="itemn.checked" class="iconfont icon-xuanzhong1"></text>
										<text v-else class="iconfont icon-weixuanzhong"></text>											
									</view>
									<view v-if="item.type == 1 && indexn ==0" class="checkbox">
										<text class="iconfont icon-xuanzhong1" style="color: #999999;"></text>
									</view>									
									<view class="picture">
										<image :src="itemn.image" class="image"></image>
										<text v-if="itemn.product_id == id_" class="current_pro">当前商品</text>
									</view>
									<view class="info">
										<view class="name line1" :class="item.type==1 ? 'names' : ''">{{itemn.store_name}}</view>
										<view class="list_attr" @click="selecAttr(index,indexn)">
											<text class="line1">
											{{itemn.attr || '默认'}}
											</text>
											<text class="iconfont icon-xiangxia"></text>																						
										</view>
										<view class="price acea-row">
											<view>
												￥
												<text>{{itemn.product.price}}</text>
											</view>
											<view class="ot_price">
											￥{{itemn.product.ot_price}}
											</view>
										</view>
									</view>
								</view>
							</block>						
						<view class="save_money"><text>省:</text>  ¥{{item.checked_save_money}}</view>
						<view v-if="item.is_limit == 0 || (item.is_limit == 1 && item.limit_num > 0)" class="btn" @click="subData(index)">
							购买此套餐{{item.checked_num}}件商品
						</view>
						<view v-else-if="item.is_limit == 1 && item.limit_num <= 0" class="btn disabled">
							套餐已售罄
						</view>
					</view>
				</scroll-view>				
			</view>	
		</view>
		<view class='mask' catchtouchmove="true" v-if='popup.show' @tap="closePopup"></view>
		<productWindow :attr="attr" :isShow="1" :title="selectTitle" :iSplus="1" @myevent="onMyEvent"
			@ChangeAttr="ChangeAttr" @attrVal="attrVal" @iptCartNum="iptCartNum" id="product-window" @goCat="goOrder()">
		</productWindow>
	</view>
</template>
<script setup>
	import { ref, computed, watch, onMounted, markRaw, getCurrentInstance, defineAsyncComponent, nextTick, defineProps, defineExpose } from "vue";
	import { discountsCartAdd, getDiscountsLst } from '@/business/api/modules/store.ts';
	import productWindow from './productWindow.vue'
	import countDown from '@/components/countDown';

	import store_ from "@/business/store/modules/mall.ts";
	const Store = store_();

	const props = defineProps(['uid','id'])

	let id_ = ref(props.id)
	
	const localViewColor = computed(()=>{
		return Store.localViewColor;
	})

	const discountsData = ref([])
	const discountsTotal = ref(0)
	const popup = ref({
		show: false
	})
	const attr = ref({
		cartAttr: false,
		productAttr: [],
		productSelect: {},
	})
	const productValue = ref([])
	const isOpen = ref(false)
	const attrValue = ref([])
	const attrTxt = ref("")
	const selectAttr = ref([])
	const selectValue = ref([])
	const proNum = ref(0)
	const images = ref([])
	const selectCountPrice = ref([])
	const selectTitle = ref("")
	const seleNum = ref(0)
	const isFirst = ref(true)
	const seleIndexn = ref(-1)
	const seleIndex = ref(-1)
	const unique = ref("0")

	// 点击关闭按钮
	function closePopup() {
		popup.value.show = false
	}
	function showPopup(id) {
		id_.value = id
		popup.show = true
		getList();	
	}
	function initAttr(){
		discountsData.value.map((v, i) => {
			getData(i)
		})
	}
	function getData(index){
		discountsData.value[index].discountsProduct.forEach((item, i) => {
			attr.value.productAttr = item.product.attr;	
			productValue.value = item.product.sku				
			DefaultSelect(index,i)				
			getPrice(discountsData.value[index])										
		})
	}
	/*获取套餐列表数据*/
	function getList(){
		getDiscountsLst({product_id: id_.value}).then(res => {
			res.data.list.forEach((item, index) => {
				item.total_price = 0;
				item.checked_num = item.count;
				item.checked_save_money = 0;
				item.discountsProduct.forEach((v, i) => {
					this.$set(v,'checked',true)
					v.checked = true
					v.attr = ''
					v.unique = ''
					item.total_price += parseFloat(v.product.price)		
					item.checked_save_money += (parseFloat(v.product.ot_price) - parseFloat(v.product.price)).toFixed(2)
				})					
			})	
			discountsTotal.value = res.data.count;
			discountsData.value = res.data.list;
			initAttr()
		}).catch(err => {
			
		});
	}
	/**
	 * 购物车手动填写
	 *
	 */
	function iptCartNum(e) {	
		attr.value.productSelect.cart_num = e
	}
	/**
	 * 打开属性插件
	 */
	function selecAttr(index, n) {
		proNum.value = index
		seleNum.value = n
		selectTitle.value = discountsData.value[index].discountsProduct[n].product.store_name
		attr.value.productAttr = discountsData.value[index].discountsProduct[n].product.attr
		productValue.value = discountsData.value[index].discountsProduct[n].product.sku
		if(isFirst.value || (!isFirst.value &&
			(seleIndex.value != index && seleIndexn.value != n || seleIndex.value == index && seleIndexn.value != n || seleIndex.value != index && seleIndexn.value == n) || unique.value != attr.value.productSelect.unique)){
			DefaultSelect(index,n)
		}
		seleIndex.value = index;seleIndexn.value = n
		isFirst.value = false
		nextTick((e) => {
			attr.value.cartAttr = true
			isOpen.value = true
		})
	}
	function attrVal(val) {
		attr.value.productAttr[val.indexw].index = attr.value.productAttr[val.indexw].attr_values[val.indexn]
	}
	/**
	* 属性变动赋值
	*
	*/
	function ChangeAttr(res) {
		let productSelect = productValue.value[res];
		if (productSelect && productSelect.stock > 0) {
			attr.value.productSelect.image = productSelect.image
			attr.value.productSelect.price = productSelect.price
			attr.value.productSelect.stock = productSelect.stock
			attr.value.productSelect.product_stock = productSelect.stock
			attr.value.productSelect.unique = productSelect.unique
			unique.value = productSelect.unique;
			attr.value.productSelect.cart_num = 1;										
			discountsData.value[proNum.value].discountsProduct[seleNum.value].attr = res || "";
			discountsData.value[proNum.value].discountsProduct[seleNum.value]['product'].price = productSelect.price || 0;
			discountsData.value[proNum.value].discountsProduct[seleNum.value]['product'].ot_price = productSelect.ot_price || 0;
			discountsData.value[proNum.value].discountsProduct[seleNum.value].unique = productSelect.unique || "";			
		} else {
			attr.value.productSelect.store_name = discountsData.value[proNum.value].discountsProduct[seleNum.value].product.store_name;
			attr.value.productSelect.image = discountsData.value[proNum.value].discountsProduct[seleNum.value].product.image;
			attr.value.productSelect.price = discountsData.value[proNum.value].discountsProduct[seleNum.value].product.price;
			attr.value.productSelect.ot_price = discountsData.value[proNum.value].discountsProduct[seleNum.value].product.ot_price;
			attr.value.productSelect.product_stock = 0;
			attr.value.productSelect.unique = "";
			return;
		}
		getPrice(discountsData.value[proNum.value])				
	}

	/**
	 * 默认选中属性
	 *
	 */
	function DefaultSelect(index,indexn) {
		let productAttr = attr.value.productAttr;				
		let value = [];
		for (var key in productValue.value) {
			if (productValue.value[key].stock > 0) {
				value = attr.value.productAttr.length ? key.split(',') : [];
				break;
			}
		}
		for (let i = 0; i < productAttr.length; i++) {
			productAttr[i].index = value[i];
		}
		//sort();排序函数:数字-英文-汉字；
		let productSelect = productValue.value[value.join(',')];
		if (productSelect && productAttr.length) {
			attr.value.productSelect.store_name = productSelect.store_name;
			attr.value.productSelect.image = productSelect.image;
			attr.value.productSelect.price = productSelect.price;
			attr.value.productSelect.ot_price = productSelect.ot_price;
			attr.value.productSelect.stock = productSelect.stock;
			attr.value.productSelect.product_stock = productSelect.stock;
			attr.value.productSelect.unique = productSelect.unique;
			unique.value = productSelect.unique;
			attr.value.productSelect.cart_num = 1;					
			attr.value.productSelect.vip_price = productSelect.vip_price;					
			discountsData.value[index].discountsProduct[indexn].unique = productSelect.unique || "";
			discountsData.value[index].discountsProduct[indexn].attr = value.join(',');
			discountsData.value[index].discountsProduct[indexn]['product'].price = productSelect.price;
			discountsData.value[index].discountsProduct[indexn]['product'].ot_price = productSelect.ot_price;
			discountsData.value[index].discountsProduct[indexn]['product'].ot_price = productSelect.ot_price;
		} else if (productSelect && !productAttr.length) {
			attr.value.productSelect.store_name = productSelect.store_name;
			attr.value.productSelect.image = productSelect.image;
			attr.value.productSelect.price = productSelect.price;
			attr.value.productSelect.ot_price = productSelect.ot_price;
			attr.value.productSelect.stock = productSelect.stock;
			attr.value.productSelect.product_stock = productSelect.stock;
			attr.value.productSelect.unique = productSelect.unique || '';
			unique.value = productSelect.unique;
			attr.value.productSelect.cart_num = 1;
			attr.value.productSelect.vip_price = productSelect.vip_price;
			discountsData.value[index].discountsProduct[indexn]['product'].price = productSelect.price;
			discountsData.value[index].discountsProduct[indexn]['product'].ot_price = productSelect.ot_price;
			discountsData.value[index].discountsProduct[indexn].attr = ''
			discountsData.value[index].discountsProduct[indexn].unique = productSelect.unique || "";
		}else if (!productSelect && !productAttr.length || !productSelect && productAttr.length) {
			attr.value.productSelect.store_name = discountsData.value[0].discountsProduct[0].product.store_name;
			attr.value.productSelect.image = discountsData.value[0].discountsProduct[0].product.image;
			attr.value.productSelect.price = discountsData.value[0].discountsProduct[0].product.price;
			attr.value.productSelect.ot_price = discountsData.value[0].discountsProduct[0].product.ot_price;
			attr.value.productSelect.product_stock = 0;
			attr.value.productSelect.unique = "";
			unique.value = "";
		}
	}
	
	function onMyEvent() {
		attr.value.cartAttr = false
		isOpen.value = false
	}
	function checkedChange(item,itemn) {
		itemn.checked = !itemn.checked
		if(itemn.checked){
			item.checked_num++
		}else{
			item.checked_num--;
		}
		getPrice(item)				
	}
	/*计算此套餐总价及节省价*/
	function getPrice(item){
		let checked_save_money = 0;
		let total_price = 0;			
		item.discountsProduct.forEach((v, i) => {
			if(v.checked){
				checked_save_money += (parseFloat(v.product.ot_price) - parseFloat(v.product.price));
				total_price += parseFloat(v.product.price);
			}				
		})	
		item.checked_save_money = checked_save_money.toFixed(2);
		item.total_price = total_price;
	}
	function subData(index) {
		let data = []
		let reqData = {
			is_new: 1,
			discount_id: discountsData.value[index].discount_id,
			data: [],				
		}
		if (discountsData.value[index].type == 0) {		
			selectValue.value = []
			discountsData.value[index].discountsProduct.map(v => {
				selectValue.value.push(v.discount_product_id + '')
			})
		} else {
			if (discountsData.value[index].checked_num < 2) {
				return util.Tips({
					title: '请先选择套餐商品'
				});			
			}
			selectValue.value = []
			discountsData.value[index].discountsProduct.map(v => {
				if(v.checked){
					selectValue.value.push(v.discount_product_id + '')
				}				
			})
		}
		for (let i = 0; i < discountsData.value[index].discountsProduct.length; i++) {
			for (let j = 0; j < selectValue.value.length; j++) {
				if (discountsData.value[index].discountsProduct[i].discount_product_id == selectValue.value[j]) {	
					reqData.data.push({
						cart_num: 1,
						product_attr_unique: discountsData.value[index].discountsProduct[i].unique,
						product_id: discountsData.value[index].discountsProduct[i].product_id
					})
				} 
			}
		}
		discountsCartAdd(reqData)
			.then(function(res) {
				uni.navigateTo({
					url: '/pagesProduct/order_confirm/index?cartId=' + res
						.data
						.cart_id
						.join(',')
				});
			})
			.catch(err => {
				this.selectValue = []
				return util.Tips({
					title: err
				});
			});
	}
	function goOrder() {
		isOpen.value = false
		attr.value.cartAttr = false
	}

	defineExpose({
		showPopup
	})
</script>

<style lang="scss" scoped>
::v-deep.container{
	position: fixed;
	bottom: 0;
	width: 100%;
	left: 0;
	background-color: #f5f5f5;
	z-index: 300;
	border-radius: 16rpx 16rpx 0 0;
	transform: translate3d(0, 100%, 0);
	transition: all .3s cubic-bezier(.25, .5, .5, .9);
	max-height: 1000rpx;
	&.on {
		transform: translate3d(0, 0, 0);
	}
	.header{
		position: relative;
		padding: 36rpx 30rpx;
		text-align: center;
		.title{
			color: #282828;
			font-size: 32rpx;
			font-weight: bold;
		}
		.iconfont{
			color: #8A8A8A;
			font-size: 28rpx;
			position: absolute;
			top: 0;
			right: 0;
		}
		.icon-guanbi5 {
			right: 20rpx;
			color: #8a8a8a;
			font-size: 30rpx;
			line-height: 30rpx;
			top: 40rpx;
			background-color: transparent;
			font-weight: normal;
		}
		
	}
	scroll-view{
		max-height: 900rpx;
	}
	.comb_time{
		display: flex;
		justify-items: center;
		margin-top: 24rpx;
		.count-time{
			color: #666666;
			font-size: 22rpx;
		}
		.time{
			align-items: center;
			
		}
		.red{
			height: 30rpx;
			line-height: 30rpx;
		}
		.styleAll{
			background:  var(--view-bgColor);
			color: #ffffff;
			font-size: 22rpx;
		}
		.timeTxt{
			color: var(--view-bgColor);
			font-size: 20rpx;
		}
	}
	.styleAll{
		background-color: var(--view-bgColor);
		color: #ffffff;
		font-size: 22rpx;
	}
	.main_count{
		padding: 0 20rpx 30rpx;
		max-height: 900rpx;
		overflow-y: scroll;
		.list{
			margin-bottom: 20rpx;
			background: #ffffff;
			padding: 30rpx 20rpx;
			.list_title{	
				color: #282828;
				font-weight: bold;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.combo_list_name{
					font-size: 30rpx;
					display: flex;
					align-items: center;
					.name{
						max-width: 500rpx;
						margin-left: 8rpx;
					}
					
					.title_icon,uni-image,image{
						width: 26rpx;
						height:26rpx;
					}
				}
				.combo_list_money{
					color: var(--view-bgColor);
					font-size: 28rpx;
				}
			}
			&:last-child{
				margin-bottom: 0;
			}
			.btn{
				width: 670rpx;
				height: 60rpx;
				line-height: 60rpx;
				background-image: var(--view-bgColor);
				border-radius: 43px;
				margin: 21rpx auto 0;
				color: #ffffff;
				text-align: center;
				font-size: 24rpx;
				&.disabled{
					cursor: not-allowed;
					background:#bbb
				}
			}
			.save_money{
				color: var(--view-bgColor);
				font-size: 26rpx;
				font-weight: bold;
				text-align: center;
				margin-top: 30rpx;
				text{
					font-weight: normal;
					display: inline-block;
					font-size: 20rpx;
					margin-right: 8rpx;
				}
			}
		}
		.pro_list{
			display: flex;
			align-items: center;
			padding: 30rpx 0;
			border-bottom: 1px solid #EEEEEE;
			&:last-child{
				border-bottom: none;
			}
			.checkbox{
				margin-right: 30rpx;
			
			}
			.icon-xuanzhong1{
				color: var(--view-bgColor);
			}
			.icon-xuanzhong1,.icon-weixuanzhong{
				font-size: 40rpx;
			}
			.icon-xuanzhong3{
				color: var(--view-bgColor);
				font-size: 18rpx;
				width: 40rpx;
				height: 40rpx;
				border-radius: 100%;
				background: var(--view-bgColor);
				line-height: 40rpx;
			}
			.picture,.image,uni-image{
				width: 180rpx;
				height: 180rpx;
				border-radius: 12rpx;
				position: relative;
			}
			.current_pro{
				background: linear-gradient(270deg, #F67A38 0%, #F11B09 100%);
				border-radius: 0 12rpx 0 12rpx;
				color: #fff;
				line-height: 34rpx;
				height: 34rpx;
				font-size: 16rpx;
				text-align: center;
				position: absolute;
				bottom: 0;
				left: 0;
				width: 100rpx;
			}
			.info{
				margin-left: 30rpx;
				position: relative;
				.name{
					max-width: 460rpx;
					color: #282828;
					font-size: 28rpx;
					line-height: 36rpx;
					&.names{
						max-width: 380rpx;
					}
				}
				.price{
					color: #282828;
					font-weight: bold;
					margin-top: 54rpx;
					font-size: 22rpx;
					font-weight: bold;
					align-items: center;
					text{
						font-size: 28rpx;
					}
					.ot_price{
						font-weight: normal;
						font-size: 20rpx;
						color: #999;
						text-decoration: line-through;
						margin-left: 10rpx;
					}
				}
			}
		}
		
	}	
	.list_attr{
		max-width:390rpx;
		display: inline-block;
		height: 34rpx;
		line-height: 34rpx;
		font-size: 22rpx;
		color: #666666;
		border-radius: 18rpx;
		background-color: #f5f5f5;
		padding: 0 60rpx 0 20rpx;
		margin-top: 20rpx;
		position: relative;
		.iconfont{
			font-size: 12rpx;
			position: absolute;
			right: 20rpx;
			top: 2rpx;
		}
		text{
			display: inline-block;
			max-width: 300rpx;
		}
	}
	
}
::v-deep.uni-checkbox .uni-checkbox-input{
	width: 38rpx;
	height: 38rpx;
	border-radius: 100%;
	margin-right: 30rpx;
}
</style>
