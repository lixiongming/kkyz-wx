<template>
	<view :style="localViewColor">
		<view class="product-window" :class="(attr.cartAttr === true ? 'on' : '') + ' ' + (iSbnt || destri?'join':'') + ' ' + (isPresell ?'presell-window':'')">
			<view class="textpic acea-row row-between-wrapper">
				<view class="pictrue">
					<image :src="attr.productSelect.image ? attr.productSelect.image : image" @click="loookImg"></image>
				</view>
				<view class="text">
					<view class="line1">
						{{ attr.productSelect.store_name }}
					</view>
					<view v-if="isPresell" class="money presell_price">
						<view>
							预售价
							￥<text class="num">{{ attr.productSelect.price }}</text>
							<text v-if="presell_type === 2">定金￥<text class="num">{{ attr.productSelect.down_price }}</text></text>
						</view>
						<text class="stock" v-if='isShow'>库存: {{ attr.productSelect.stock }}</text>
						<text class='stock' v-if="limitNum">限量: {{attr.productSelect.quota_show}}</text>
					</view>
					<view v-else class="money">
						<view class="acea-row row-middle">
							<view class="acea-row row-middle">
								<view v-if="type=='points'" class="points_money">
									<image :src="`${domain}/static/images/jf-point.png`" mode=""></image>
									<text class="points-num">{{attr.productSelect.ot_price}}</text>积分 <text v-if="attr.productSelect.price > 0">+{{attr.productSelect.price}}元</text>
									<text v-if="limitCount > 0" class="points-limit">限购{{limitCount}}件</text>
								</view>
								<view v-else>
									<text>￥</text><text class="num">{{ attr.productSelect.price }}</text>
								</view>
								<view v-if="svipPrice" class="acea-row row-middle">
									<text class='vip-money'>￥{{attr.productSelect.svip_price}}</text>
									<view class="vipImg">
										<image :src="imgUrlEvent('/images/wx-applet/mine/mine-bg.png','aliyunImgUrl')"></image>
									</view>
								</view>
							</view>
						</view>
						<view class="stock_count" style="margin-top: 15rpx;" v-if="zone_type == 'hot' || zone_type == 'premium' || zone_type == 'exchange'">
							<text class="integral" v-if="attr.productSelect.consume_points&&!welfareTitle" v-show="attr.productSelect?.consume_points">预计赠送{{decimalExchangeCoupons(attr.productSelect.consume_points)}}消费积分</text>
							<view v-if="zone_type == 'exchange'" style="margin:4rpx 0px;"><text class="integral" >兑换积分最多抵扣{{ attr.productSelect.super_integral }}</text></view>
							<text class="stock" v-if='isShow'>库存: {{ attr.productSelect.stock }}</text>
							<text class='stock' v-if="limitNum">限量: {{attr.productSelect.quota_show}}</text>
						</view>
						<view class="stock_count" style="margin-top: 15rpx;" v-else>
							<text class="integral" v-if="attr.productSelect.ticket&&!welfareTitle&& zone_type != 'welfare'">预计赠送{{decimalExchangeCoupons(attr.productSelect.ticket)}}兑换券</text>
							<text class="stock" v-if='isShow'>库存: {{ attr.productSelect.stock }}</text>
							<text class='stock' v-if="limitNum">限量: {{attr.productSelect.quota_show}}</text>
						</view>
					</view>
				</view>
				<view class="iconfont icon-guanbi" @click="closeAttr"></view>
			</view>

			<view class="productWinList">
				<view class="item" v-for="(item, indexw) in attr.productAttr" :key="indexw">
					<view class="title">{{ item.attr_name }}</view>
					<view class="listn acea-row row-middle">
						<view class="itemn" :class="item.index === itemn.attr ? 'on' : ''" v-for="(itemn, indexn) in item.attr_value"
						 @click="tapAttr(indexw, indexn)" :key="indexn">
							{{ itemn.attr }}
						</view>
					</view>
				</view>
			</view>
			<view v-if="type !='points'" class="cart acea-row">
				<view class="title">数量</view>
				<view class="carnum acea-row row-left">
					<view class="buy_limit" v-if="minCount>0 || maxCount>0">
						(
						<text v-if="minCount>0">{{minCount}}件起购<text v-if="minCount>0 && maxCount>0">，</text></text><text v-if="maxCount>0">最多{{maxCount}}件</text>
						<block v-if="minCount>0&&maxCount>0 && plusStep>1">
							，</br v-if="plusStep>1"><text v-if="plusStep>1">单次加购件数为{{ plusStep }}件</text>
							</br><text>单次加购件数为{{ plusStep }}件</text>
						</block>
						<block v-else>
							<text v-if="plusStep>1">，单次加购件数为{{ plusStep }}件</text>
						</block>
						) 
					</view>
					<view class="item reduce" :class="(attr.productSelect.cart_num <= 1 || (minCount>0 && attr.productSelect.cart_num<=minCount)) ? 'on' : ''" @click="CartNumDes">
						<view class="reduce_txt"></view>
					</view>
					<view class='item num'>
						<input type="number" v-model="attr.productSelect.cart_num" data-name="productSelect.cart_num" @input="bindCode(attr.productSelect.cart_num)" @keydown.native="btKeyDown" @keyup.native="btKeyUp"></input>
					</view>
					<view v-if="iSplus" class="item plus" :class="(attr.productSelect.cart_num >= attr.productSelect.stock || destri || (maxCount>0&&attr.productSelect.cart_num>=maxCount)) ? 'on' : ''"
					 @click="CartNumAdd">
					     <text class="line_row"></text><text class="line_col"></text>
					 </view>
					<view v-else class='item plus' :class='((attr.productSelect.cart_num >= attr.productSelect.quota_show) 
						|| (attr.productSelect.cart_num >= attr.productSelect.product_stock) || (attr.productSelect.cart_num <= max) || (maxCount>0&&attr.productSelect.cart_num>=maxCount)) ? "on":""'
					 @click='CartNumAdd'>+</view>
				</view>
			</view>
			<view class="joinBnt b-color" v-if="destri && attr.productSelect.stock>0" @click="goCat">立即购买</view>
			<view class="joinBnt on" v-else-if="destri && attr.productSelect.stock<=0">已售罄</view>
			<view class="joinBnt b-color" v-if="iSbnt && attr.productSelect.stock>0"
			 @click="goCat">我要参团</view>
			<view class="joinBnt on" v-else-if="(iSbnt && attr.productSelect.stock<=0)">已售罄</view>
		</view>
		<!-- <view class="mall-mask" @touchmove.prevent :hidden="attr.cartAttr === false" @click="closeAttr"></view> -->
		<view class="mall-mask" @touchmove.prevent v-if="attr.cartAttr" @click="closeAttr"></view>
	</view>
</template>

<script setup>
	import { ref, computed, watch, onMounted, markRaw, getCurrentInstance, defineAsyncComponent, nextTick, defineProps } from "vue";
	import { Highdebounce } from '@/infrastructure/utils/validate.js'
	import store_ from "@/business/store/modules/mall.ts";
	import { decimalExchangeCoupons } from "@/infrastructure/utils/filter.js"
	import { imgUrlEvent } from "@/infrastructure/utils/imgUrls";
	const Store = store_();
	const emits = defineEmits(['goCat','iptCartNum','myevent','ChangeCartNum','attrVal','ChangeAttr'])
	const props = defineProps({
		attr: {
			type: Object,
			default: () => {}
		},
		limitNum: {
			type: Number,
			value: 0
		},
		limitCount: {
			type: Number,
			value: 0
		},
		isShow: {
			type: Number,
			value: 0
		},
		iSbnt: {
			type: Number,
			value: 0
		},
		iSplus: {
			type: Number,
			value: 0
		},
		destri: {
			type: Number,
			value: 0
		},
		isPresell: {
			type: Number,
			value: 0
		},
		presell_type: {
			type: Number,
			value: 1
		},
		image: {
			type: String,
			value: ''
		},
		maxCount: {
			type: Number,
			value: 0
		},
		minCount: {
			type: Number,
			value: 0
		},
		plusStep: {
			type: Number,
			value: 1
		},
		payLimit: {
			type: Number,
			value: 1
		},
		svipPrice: {
			type: Boolean,
			value: false
		},
		type: {
			type: String,
			value: ''
		},
		domain: {
			type: String,
			value: ''
		},
		max: {
			type: Number,
			value: 0
		},
		sku:{
			type: Array,
			value: []
		},
		zone_type:{
            type : String,
			value: ''
		},
		welfareTitle:{
			type: String,
			value: ''
		}
	})
    console.log(props.attr)
	const localViewColor = computed(() => {
		return Store.localViewColor;
	})

	const skuIndex = ref(0)

	//  查看大图
	function loookImg(){
		let arr = [props.attr && props.attr.productSelect && props.attr.productSelect.image ? props.attr.productSelect.image : props.image]
		uni.previewImage({
			urls: arr,
		});
	}
	function goCat() {
		emits('goCat')
	}
	/**
	 * 购物车手动输入数量
	 * 
	 */
	function bindCode(e) {
		let num = JSON.parse(JSON.stringify(e));
		if((num-props.minCount)%props.plusStep){
			num = props.minCount + props.plusStep*Math.ceil((num-props.minCount)/props.plusStep)
		}
		emits('iptCartNum', num);
	}
	function btKeyDown(e) {
		if(e.target.value){
			e.target.value = e.target.value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,"");
		}
	}
	function btKeyUp(e) {
		if(e.target.value){
			e.target.value = e.target.value.replace(/[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/g,"")
		}
	}
	function closeAttr() {
		emits('myevent');
	}
	const CartNumDes = Highdebounce(function() {
		if (!props.destri) {
			emits('ChangeCartNum', false);
		}
	},50,true)
	const CartNumAdd = Highdebounce(function() {
		if (!props.destri) {
			emits('ChangeCartNum', true);
		}
	},50,true)
	function tapAttr(indexw, indexn) {
		skuIndex.value=indexn
		emits("attrVal", {
			indexw: indexw,
			indexn: indexn
		});
		if (props.attr) {
			props.attr.productAttr[indexw].index = props.attr.productAttr[indexw].attr_values[indexn]
		}
		let value = getCheckedValue().join(",");
		emits("ChangeAttr", value);
	}
	//获取被选中属性；
	function getCheckedValue() {
		let productAttr = props.attr.productAttr;
		let value = [];
		for (let i = 0; i < productAttr.length; i++) {
			for (let j = 0; j < productAttr[i].attr_values.length; j++) {
				if (productAttr[i].index === productAttr[i].attr_values[j]) {
					value.push(productAttr[i].attr_values[j]);
				}
			}
		}
		return value;
	}
</script>

<style scoped lang="scss">
.integral {
	    // margin: 20rpx 30rpx 0 0;
	    color: #ffffff;
		font-size: 20rpx;
		font-weight: 500;
		background-color: #FF4D25;
		border: 1px solid #FF4D25;
		height: 32rpx;
		line-height: 32rpx;
		border-radius: 4rpx;
		padding: 2rpx 9rpx;
	    // margin-left: 24rpx;
	}
	.product-window {
		position: fixed;
		bottom: 0;
		width: 100%;
		left: 0;
		background-color: #fff;
		z-index: 77;
		border-radius: 16rpx 16rpx 0 0;
		padding-bottom: 140rpx;
		padding-bottom: calc(140rpx + constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		padding-bottom: calc(140rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
		transform: translate3d(0, 100%, 0);
		transition: all .3s cubic-bezier(.25, .5, .5, .9);
		&.presell-window {
			padding-bottom: 200rpx;
			padding-bottom: calc(200rpx + constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
			padding-bottom: calc(200rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
		}
	}
	.product-window.on {
		transform: translate3d(0, 0, 0);
	}
	.product-window.join {
		padding-bottom: 30rpx;
	}
	.product-window .textpic {
		padding: 0 80rpx 0 30rpx;
		margin-top: 29rpx;
		position: relative;
	}
	.product-window .textpic .pictrue {
		width: 150rpx;
		height: 150rpx;
	}
	.product-window .textpic .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 10rpx;
	}
	.product-window .textpic .text {
		width: 460rpx;
		font-size: 32rpx;
		color: #202020;
	}
	.product-window .textpic .text .money {
		font-size: 24rpx;
		margin-top: 26rpx;
		font-weight: 700;
		color: var(--view-theme);
	}
	.product-window .textpic .text .money .points_money {
		font-weight: normal;
		display: flex;
		align-items: baseline;
	}
	.product-window .textpic .text .money .points_money image{
		width: 26rpx;
		height: 26rpx;
	}
	.product-window .textpic .text .money .points_money .points-num{
		font-size: 34rpx;
	}
	.product-window .textpic .text .money .points_money .points-limit{
		display: flex;
		padding: 0 10rpx;
		align-items: center;
		justify-content: center;
		color: var(--view-theme);
		border: 1px solid var(--view-theme);
		height: 30rpx;
		border-radius: 13rpx;
		background: var(--view-bgColor);
		margin-left: 10rpx;
		font-size: 18rpx;
	}
	.product-window .stock_count{
		// margin-top: 5rpx;
	}
	.product-window .textpic .text .money .num {
		font-size: 36rpx;
	}
	.product-window .textpic .text .money .stock {
		height: 32rpx;
		line-height: 32rpx;
		color: #999;
		margin-left: 18rpx;
		font-weight: normal;
	}
	.product-window .textpic .text .presell_price {
		color: #FF7F00;
		.num {
			display: inline-block;
			margin-right: 20rpx;
		}
		.stock {
			margin-left: 0;
		}
	}
	.vip-money {
		color: #282828;
		font-size: 22rpx;
		margin-left: 6rpx;
	}
	.vipImg {
		width: 65rpx;
		height: 28rpx;
		margin-left: 4rpx;
		image {
			width: 100%;
			height: 100%;
			display: block;
		}
	}
	.product-window .textpic .iconfont {
		position: absolute;
		right: 30rpx;
		top: -5rpx;
		font-size: 35rpx;
		color: #8a8a8a;
	}
	.product-window .productWinList {
		max-height: 395rpx;
		overflow: auto;
		margin-top: 36rpx;
	}
	.product-window .productWinList .item~.item {
		margin-top: 36rpx;
	}
	.product-window .productWinList .item .title {
		font-size: 30rpx;
		color: #999;
		padding: 0 30rpx;
	}
	.product-window .productWinList .item .listn {
		padding: 0 30rpx 0 16rpx;
	}
	.product-window .productWinList .item .listn .itemn {
		border: 1px solid #bbb;
		font-size: 26rpx;
		color: #282828;
		padding: 7rpx 33rpx;
		border-radius: 6rpx;
		margin: 14rpx 0 0 14rpx;
	}
	.product-window .productWinList .item .listn .itemn.on {
		color: #fff;
		background-color: var(--view-bgColor);
		border-color: var(--view-bgColor);
	}
	.product-window .cart {
		margin-top: 36rpx;
		padding: 0 30rpx;
		display: -webkit-box;
		display: -webkit-flex;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-pack: justify;
		-webkit-justify-content: space-between;
		-ms-flex-pack: justify;
		justify-content: space-between;
	}
	.product-window .cart .title {
		font-size: 30rpx;
		color: #999;
		line-height: 54rpx;
	}
	.product-window .cart .carnum {
		height: 54rpx;
		align-items: center;
	}
	.product-window .cart .carnum .buy_limit {
		font-size: 22rpx;
		color: var(--view-bgColor);
		margin-right: 30rpx;
	}
	.product-window .cart .carnum .item {
		// border: 1px solid #a4a4a4;
		width: 40rpx;
		height: 40rpx;
		text-align: center;
		color: #a8a8a8;
		font-size: 45rpx;
		border: 1px solid #777;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border-radius: 8rpx;
	}
	.product-window .cart .carnum .reduce {
		line-height: 48rpx;
	}
	.product-window .cart .carnum .reduce.on {
		border-color: #e3e3e3;
		color: #dedede;
		.reduce_txt{
			background: #e3e3e3;
		}
	}
	.product-window .cart .carnum .plus {
		position: relative;
	}
	.product-window .cart .carnum .plus.on {
		border-color: #e3e3e3;
		color: #dedede;
		.line_row,
		.line_col{
			background: #e3e3e3;
		}
	}
	.product-window .cart .carnum .num {
		width: 80rpx;
		// background: #f7f7f9;
		font-size: 28rpx;
		font-weight: 500;
		display: flex;
		align-items: center;
		border: none;
		padding: 0 6rpx;
		color: var(--view-theme);
		// margin: 0 8rpx;
	}
	.product-window .cart .carnum .reduce_txt {
		display: block;
		height: 4rpx;
		width: 20rpx;
		background: #282828;
	}

	.product-window .cart .carnum .line_row,
	.product-window .cart .carnum .line_col {
		display: block;
		height: 4rpx;
		width: 20rpx;
		background: var(--view-theme);
		position: absolute;
		left: 50%;
		top: 50%;
	}
	.product-window .cart .carnum .line_row  {
	   transform: translate(-50%, -50%);
	}
	.product-window .cart .carnum .line_col {
	   transform: translate(-50%, -50%) rotateZ(90deg);
	}
	.product-window .joinBnt {
		font-size: 30rpx;
		width: 620rpx;
		height: 86rpx;
		border-radius: 50rpx;
		text-align: center;
		line-height: 86rpx;
		color: #fff;
		margin: 21rpx auto 0 auto;
		&.b-color{
			background-color: var(--view-theme);
		}
	}
	.product-window .joinBnt.on {
		background-color: #bbb;
		color: #fff;
		background-image: none;
	}
</style>
