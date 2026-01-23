<template>
	<view :style="localViewColor" v-if="tempArr.length">
		<view :style="{ paddingTop: mbConfig + 'rpx'}">
		<view class="index-product-wrapper" :style="{ background: themeColor,borderRadius: bgStyle+'rpx'}">
			<!-- 顶部筛选栏 -->
			<view class='nav acea-row row-middle'>
				<!-- <view class='item' @click="downStatus = !downStatus" :class="{'t-color':downKey>0 && firstKey == 0}">
					{{downMenu[downKey].title}}
					<text v-if="!downStatus" class="iconfont icon-xiala1 spin"></text>
					<text v-else class="iconfont icon-xiala1"></text>
				</view> -->
				<view class='item' :class="{'t-color': where.order==''}" @click='set_where(4)'>
					综合
				</view>
				<view class='item' :class="{'t-color': where.order=='sales'}" @click='set_where(3)'>
					销量
				</view>
				<view class='item' :class="{'t-color': where.order=='contribution_desc' || where.order=='contribution_asc'}" @click='set_where(1)'>
					<text>共献值</text>
					<!-- <image v-if="contribution==1" :src="domain+'/static/diy/up'+keyColor+'.png'"></image>
					<image v-else-if="contribution==2" :src="domain+'/static/diy/down'+keyColor+'.png'"></image>
					<image v-else src='/static/images/horn.png'></image> -->
					<!-- <image class="sort_img" :class="custom_contribution" v-if="contribution==1 || contribution==2" :src="`/static/images/sort_sub.png`"></image> -->
					<!-- <image class="sort_img" v-else src='/static/images/sort_default.png'></image> -->
				</view>
				<view class='item' :class="{'t-color': where.order=='price_desc' || where.order=='price_asc'}" @click='set_where(2)'>
					<text>价格</text>
					<!-- <image v-if="price==1" :src="domain+'/static/diy/up'+keyColor+'.png'"></image>
					<image v-else-if="price==2" :src="domain+'/static/diy/down'+keyColor+'.png'"></image>
					<image v-else src='/static/images/horn.png'></image> -->
					<!-- <image class="sort_img" :class="custom_price" v-if="price==1 || price==2" :src="`/static/images/sort_sub.png`"></image> -->
					<!-- <image class="sort_img" v-else src='/static/images/sort_default.png'></image> -->
				</view>
				<!-- <view class='item' @click='bindRight'>
					筛选
					<text class="iconfont icon-shaixuan"></text>
				</view> -->
				<view style="text-align: right;" v-if="tabIndex==1" class='iconfont item' :class='itemStyle==1?"icon-pailie":"icon-tupianpailie"'
				 @click='Changswitch'></view>
			</view>
			<!-- <view class="list_wrap" :class="changeClass()"> -->
			<view class="list_wrap" :class="list_wrap_style">
			<!-- 单列 -->
			<block v-if="itemStyle == 0">	
				<view class="list-box animated listA" :class="tempArr.length > 0 ? 'fadeIn on' : ''">
					<view class="item" v-for="(item, index) in tempArr" :key="index" @click="goDetail(item)">
						<view class="pictrue" :class="'cont'+conStyle">	
							<easy-loadimage mode="widthFix" :image-src="item.image"></easy-loadimage>
							<view v-if="item.stock == 0" class="sell_out">已售罄</view>
							<view v-if="item.border_pic" :style="{ backgroundImage: `url(${item.border_pic})` }" class="border-picture"></view>
						</view>
						<view class="text-info" style="display: flex; flex-direction: column; justify-content: space-between;">
							<view>
								<view v-if="titleShow" class="title line1">{{ item.store_name }}</view>
								<view class="merchant_info">
									<view v-if="item.merchant && item.merchant.type_name" :style="'background:'+labelColor" class="font-bg-red">{{item.merchant.type_name}}</view>
									<view class="txt" :style="'border-color:'+priceColor+';color:'+priceColor+';'" v-if="item.issetCoupon && couponShow">领券</view>
									<view class="txt delivery" v-if="item.delivery_free">包邮</view>
								</view>
							</view>
							<view v-if="priceShow" class="price acea-row" :style="'color:'+priceColor">
								<text>¥</text><text class="price-yuan">{{ item.price }}</text>
								<!-- <text class="price-jiao" v-if="computedPrice(item.price)[1] > 0">.{{ computedPrice(item.price)[1] }}</text> -->
							</view>	
							<view class="contribution acea-row">
								<view>赠<text>{{ item.ticket || 0 }}兑换券</text></view>
							</view>
						</view>
					</view>
				</view>
			</block>
			<!-- 两列 -->
			<block v-if="itemStyle == 1">
				<view class="list-box listS animated" :class="tempArr.length > 0 ? 'fadeIn on' : ''">
					<view class="item" v-for="(item, index) in tempArr" :key="index" @click="goDetail(item)" :class="'bg'+conStyle">
						<view class="pictrue picture1" :class="'cont'+conStyle">
							<!-- <image :src="item.image" mode=""></image> -->
							<easy-loadimage mode="widthFix" :image-src="item.image"></easy-loadimage>
							<view v-if="item.stock == 0" class="sell_out">已售罄</view>
							<view v-if="item.border_pic" :style="{ backgroundImage: `url(${item.border_pic})` }" class="border-picture"></view>
						</view>
						<view class="text-info">
							<view v-if="titleShow" class="title line2">{{ item.store_name }}</view>
							<view v-if="priceShow" class="price acea-row" :style="'color:'+priceColor">
								<text>¥</text><text class="price-yuan">{{ item.price }}</text>
								<!-- <text class="price-jiao" v-if="computedPrice(item.price)[1] > 0">.{{ computedPrice(item.price)[1] }}</text> -->
							</view>
							<view class="contribution acea-row">
								<view>赠<text>{{ item.ticket || 0 }}兑换券</text></view>
							</view>
						</view>
					</view>
				</view>
			</block>
			<!-- 三列 -->
			<block v-if="itemStyle == 2">
				<view class="list-box animated listB" :class="tempArr.length > 0 ? 'fadeIn on' : ''">
					<view class="item" v-for="(item, index) in tempArr" :key="index" @click="goDetail(item)">
						<view class="pictrue" :class="'cont'+conStyle">		
							<!-- <image :src="item.image" mode=""></image> -->
							<easy-loadimage mode="widthFix" :image-src="item.image"></easy-loadimage>
							<view v-if="item.stock == 0" class="sell_out">已售罄</view>
							<view v-if="item.border_pic" :style="{ backgroundImage: `url(${item.border_pic})` }" class="border-picture"></view>
						</view>
						<view class="text-info" style="display: flex; flex-direction: column; justify-content: space-between;">
							<view v-if="titleShow" class="title line1">{{ item.store_name }}</view>
							<view class="contribution acea-row">
								<view>赠<text>{{ item.contribution || 0 }}共献值</text></view>
							</view>
							<view v-if="priceShow" class="price">
								<view v-if="priceShow" :style="'color:'+priceColor">
									<!-- ¥<text>{{ item.price }}</text> -->
									<text>¥</text><text class="price-yuan">{{ computedPrice(item.price)[0] }}</text>
									<text class="price-jiao" v-if="computedPrice(item.price)[1] > 0">.{{ computedPrice(item.price)[1] }}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</block>
			<!--大图-->
			<block v-if="itemStyle == 3">
				<view class="list-box animated listC" :class="tempArr.length > 0 ? 'fadeIn on' : ''">
					<view class="item" v-for="(item, index) in tempArr" :key="index" @click="goDetail(item)" :style="'border-radius:'+bgStyle+'rpx;'">
						<view class="pictrue" :class="'cont'+conStyle">
							<easy-loadimage mode="widthFix" :image-src="item.image"></easy-loadimage>
						</view>
						<view class="text-info" style="display: flex; flex-direction: column; justify-content: space-between;">
							<view v-if="titleShow" class="title line2">{{ item.store_name }}</view>
							<view class="contribution acea-row">
								<view>赠<text>{{ item.contribution || 0 }}共献值</text></view>
							</view>
							<view v-if="priceShow || opriceShow" class="price">
								<view v-if="priceShow" :style="'color:'+priceColor">
									<text>￥</text>
									{{ item.price }}
								</view>
							</view>
						</view>
					</view>
				</view>
			</block>
			</view>
		</view>
		</view>
	</view>
</template>

<script>
 
import { getProductData,getProductListData } from '@/api/api.js';
import { HTTP_REQUEST_URL } from '@/config/app';
import { configMap } from "@/utils";
import { mapGetters } from "vuex";
export default {
	name: 'goodList',
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
	computed: {
		...configMap({statusBarHeight:0},mapGetters(['localViewColor'])),
		list_wrap_style () {
			switch (this.itemStyle) {
				case 0:
                    return 'list_wrap_A';
                case 1:
                    return 'list_wrap_S';
				case 2:
					return 'list_wrap_B';
				case 3:
					return 'list_wrap_C';
                default:
                    return '';
			}
		},
		custom_contribution () {
			switch (this.contribution) {
                case 1:
                    return 'up';
                case 2:
                    return 'down';
                default:
                    return '';
            }
		},
		custom_price () {
			switch (this.price) {
                case 1:
                    return 'up';
                case 2:
                    return 'down';
                default:
                    return '';
            }
		},
	},
	data() {
		return {
			domain: HTTP_REQUEST_URL,
			tempArr: [],
			mbConfig: this.dataConfig.mbConfig.val*2,
			numConfig: this.dataConfig.numConfig.val ? this.dataConfig.numConfig.val : this.dataConfig.numConfig.val,
			themeColor: this.dataConfig.themeColor.color[0].item,
			priceColor: this.dataConfig.fontColor.color[0].item,
			labelColor: this.dataConfig.labelColor.color[0].item,
			itemStyle: this.dataConfig.itemStyle.type,
			sortType: this.dataConfig.goodsSort.type,
			conStyle: this.dataConfig.conStyle.type,
			bgStyle: this.dataConfig.bgStyle.type ? '20' : '0',
			// type: 0 自动模式(随机获取商品列表)，type: 1 手动模式(手动添加商品列表)
			type: this.dataConfig.tabConfig.tabVal || 0,
			selectId: this.dataConfig.selectConfig.activeValue || 0,
			productIds: this.dataConfig.goodsList.ids || [],
			titleShow: this.dataConfig.titleShow.val,
			priceShow: this.dataConfig.priceShow.val,
			couponShow: this.dataConfig.couponShow.val,
			diy_id: this.dataConfig.did,
			unique: this.dataConfig.timestamp,
			// from商品搜索
			downStatus: false,
			downKey: 0,
			// 下拉菜单
			downMenu: [{
					title: '综合',
					key: 1,
				},
				{
					title: '评分',
					key: 2,
				},
				{
					title: '新品',
					key: 3,
				}
			],
			where: {
				cate_id: '',
				order: '',
				price_on: '',
				price_off: '',
				brand_id: '',
				keyword: '',
				is_trader: '',
				page: 1,
				limit: 30
			},
			contribution:0,
			price: 0,
			// 是否第一个
			firstKey: 4,
			// tab切换
			tabIndex: 1,
			// 加载数据状态
			proLoading: false,
			// 是否继续加载数据
			isScroll: true,
		};
	},
    onShow() {
		// console.log(222);
	},
	created() {},
	mounted() {
		switch (this.dataConfig.goodsSort.type){
			case 1:
				this.where.order = 'sales';
				break;
			case 2:
				this.where.order = 'price_asc';
				break;
			case 3:
				this.where.order = 'contribution_desc';
				break;
			default:
				this.where.order = '';
				break;
		}
		this.productslist();
		// 商品列表为自动模式，可分页加载数据
		if (this.type == 0) {
			uni.$on("product_load_more", this.productslist);
		}
	},
	methods: {
		Changswitch: function() {
			let that = this;
			that.itemStyle = that.itemStyle == 0 ? 1 : (that.itemStyle == 1 ? 0 : 1 ) ;
		},
		//点击事件处理
		set_where: function(e) {
			this.downStatus = false
			if((e==3||e==4)&&e==this.firstKey){
				return;
			}
			switch (e) {
				case 1:
					this.firstKey = e;
					this.price = 0;
					if (this.contribution == 0) {
						this.contribution = 1;
						this.where.order = 'contribution_asc'
					} else if (this.contribution == 1) {
						this.contribution = 2;
						this.where.order = 'contribution_desc'
					} else if (this.contribution == 2) {
						this.contribution = 0;
						this.where.order = ''
					}
					this.$set(this.where, 'page', 1)
					this.productslist();
					break;
				case 2:
					this.contribution = 0;
					this.firstKey = e
					if (this.price == 0) {
						this.price = 1;
						this.where.order = 'price_asc'
					} else if (this.price == 1) {
						this.price = 2;
						this.where.order = 'price_desc'
					} else if (this.price == 2) {
						this.price = 0;
						this.where.order = ''
					}
					this.$set(this.where, 'page', 1)
					this.productslist();
					break;
				case 3:
					this.price = 0;
					this.contribution = 0;
					this.loadend = false;
					this.$set(this.where, 'order', 'sales')
					this.$set(this.where, 'page', 1)
					this.productslist();
					this.firstKey = e
					break;
				case 4:
					this.price = 0;
					this.contribution = 0;
					this.loadend = false;
					this.$set(this.where, 'order', '')
					this.$set(this.where, 'page', 1)
					this.productslist();
					this.firstKey = e
					break;
			}
			this.loadend = false;
			// this.$set(this.where, 'page', 1);
			// this.productslist();
		},
		// 右侧切换
		bindRight() {
			this.price = 0;
			this.firstKey = 4
		},
		/**
		 * @return {Array}
		 * @description 拆解商品金额
		 */
		computedPrice(num){
			let price = String(num);
			// 商品价格为0则直接返回0字符串后的价格如果为null也直接返回0
			if(Number(num) == 0 || Number(num) !== Number(num)) return [0];
			if(price == null) return [0];
			let arr = price.split('.');
			return arr
		},
		productslist(isScrollLoad) {
			// 添加isScrollLoad逻辑判断：解决当分页加载到最后一条数据时，无法点击刷选条件的问题
			if (!this.isScroll && isScrollLoad) return;
			if (this.proLoading) return;
			this.proLoading = true;
			let data = {};
			if (this.type == 1) {
				data = {
					diy_id: this.diy_id,
					unique: this.unique,
					mer_id: this.merId,
					product_ids: this.productIds.toString(),
					limit: this.productIds.length,
					page: this.where.page,
				};
			} else {
				data = {
					diy_id: this.diy_id,
					unique: this.unique,
					mer_id: this.merId,
					order: this.sortType == 2 ? 'price_asc' : this.sortType == 1 ? 'sales' : '',
					limit: this.numConfig,
					page: this.where.page,
				};
				if(this.merId){
					data.mer_cate_id = this.selectId.toString()
				}else{
					data.cate_pid = this.selectId.toString()
				}
			}
			data.order = this.where.order;
			if (isScrollLoad) {
				data.page = this.where.page + 1;
			} else {
				this.where.page = 1;
			}
			getProductListData(data).then(res => {
				// this.tempArr = res.data.list;
				let productList = res.data.list;
				if (isScrollLoad) {
					let list = res.data.list;
					productList = this.tempArr.concat(list);
					this.isScroll = this.tempArr.length<res.data.count;
					if (this.isScroll) {
						this.$set(this.where, 'page', this.where.page + 1)
					}
					
				} else {
					this.isScroll = true;
				}
				
				this.proLoading = false;
				this.tempArr = productList;
				
			});
		},
		goDetail(item) {
			this.$emit('detail', item);
		},
		// 商品列表不同展示方式，class不同
		changeClass() {
			switch (this.itemStyle) {
				case 0:
                    return 'list_wrap_A';
                case 1:
                    return 'list_wrap_S';
				case 2:
					return 'list_wrap_B';
				case 3:
					return 'list_wrap_C';
                default:
                    return '';
			}
        },
		// 商品排序方式字段样式
		changeSortClass(name, type) {
            switch (type) {
                case 1:
                    return 'up';
                case 2:
                    return 'down';
                default:
                    return '';
            }
        },
	}
};
</script>

<style lang="scss" scoped>
	
.index-product-wrapper {
	// margin: 0rpx 20rpx 0 20rpx;
	// padding: 0rpx 20rpx 0 20rpx;
	// padding: 0 20rpx 0;
	padding: 0;
	.list_wrap {
		padding: 0 20rpx;
		&.list_wrap_A {
			background: #fff;
			padding: 20rpx;
			border-radius: 16rpx;
		}
		&.list_wrap_B {}
		&.list_wrap_C {}
		&.list_wrap_S {}
	}
	.nav {
			padding: 0 20rpx;
			// height: 100rpx;
			height: 50rpx;
			margin-bottom: 16rpx;
			color: var(--view-noSelectColor);
			font-size: 28rpx;
			// background-color: #fff;
			display: flex;
			justify-content: space-between;
		}
	.nav .item {
		display: flex;
		align-items: center;
		// justify-content: center;
		justify-content: space-between;
		// flex: 1;
		.spin {
			display: block;
			transform: rotate(180deg);
			font-size: 36rpx;
		}
	}
	.t-color {
		color: var(--view-theme);
	}
	.nav .item.t-color {
		font-weight: bold;
		color: var(--view-assist);
	}
	.nav .item image {
		width: 15rpx;
		height: 19rpx;
		margin-left: 10rpx;
	}
	.nav .item {
		font-size: 24rpx;
	}
	.nav .item {
		&.iconfont {
			font-size: 28rpx;
		}
		
	}
	
	.nav .item .sort_img {
		width: 28rpx;
		height: 28rpx;
		margin-left: 4rpx;
		&.up {
			transform: rotate(0deg);
		}
		&.down {
			transform: rotate(180deg);
		}
	}

	.list-box {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		
		.item {
			// width: 328rpx;
			width: 348rpx;
			margin-bottom: 20rpx;
			overflow: hidden;
			position: relative;
			&.on {
				border-radius: 0;
			}
			.pictrue_log {
				width: 92rpx;
				height: 44rpx;
				font-size: 26rpx;
				line-height: 44rpx;
			}
			.pictrue,/deep/image,/deep/.easy-loadimage,/deep/uni-image {
				width: 100%;
				display: block;
				position: relative;
				.border-picture {
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					background: center/cover no-repeat;
				}
			}
			.picture1,/deep/.picture1 image,/deep/.picture1 .easy-loadimage,/deep/.picture1 uni-image {			
				height: 346rpx;
				position: relative;
				.border-picture {
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					background: center/cover no-repeat;
				}
				.sell_out {
					display: flex;
					width: 150rpx;
					height: 150rpx;
					align-items: center;
					justify-content: center;
					border-radius: 100%;
					background: rgba(0,0,0,.6);
					color: #fff;
					font-size: 30rpx;
					position: absolute;
					top: 50%;
					left: 50%;
					margin: -75rpx 0 0 -75rpx;
					&::before{
						content: "";
						display: block;
						width: 140rpx;
						height: 140rpx;
						border-radius: 100%;
						border: 1px dashed #fff;
						position: absolute;
						top: 5rpx;
						left: 5rpx;
					}
				}
			}
			.cont1,/deep/.cont1 image,/deep/.cont1 .easy-loadimage,/deep/.cont1 uni-image,.cont1 .border-picture{
				border-radius: 16rpx;
			}
			.text-info {
				padding: 10rpx 20rpx 15rpx;
				.title {
					color: var(--view-theme);
					// font-weight: bolder;
				}
				.old-price {
					margin-top: 4rpx;
					font-size: 26rpx;
					color: #999;
					text-decoration: line-through;
					text {
						margin-right: 2px;
						font-size: 20rpx;
					}
				}
				.price {
					display: flex;
					// margin-top: 20rpx;
					font-size: 28rpx;
					align-items: center;
					text {
						font-size: 28rpx;
						font-weight: 600;
					}
					.ot-price{
						color: #aaa;
						font-size: 26rpx;
						text-decoration: line-through;
						margin-left: 6rpx;
						font-weight: normal;
						margin-top: 10rpx;
					}	
				}
			}
			.pictrue {
				position: relative;
			}		
			.border-picture {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				border-radius: 8rpx;
				background: center/cover no-repeat;
			}
		}
		.merchant_info{
			display: flex;
			align-items: center;
			margin-top: 20rpx;
			.merchant_type{
				color: #fff;
				line-height: 30rpx;
				padding: 0 10rpx;
				border-radius: 2rpx;
				font-size: 22rpx;
			}
			.txt {
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 0 4rpx;
				height: 28rpx;
				margin-left: 15rpx;
				border: 1px solid $theme-color;
				border-radius: 4rpx;
				font-size: 20rpx;
				font-weight: normal;
				&.delivery{
					color: var(--view-priceColor);
					border-color: var(--view-priceColor);
				}
			}
		}
		&.on {
			display: flex;
		}
		&.listA {
			// width: 100vw;
			// background: #fff;
			.item {
				display: flex;
				width: 100%;
				.pictrue,/deep/image,/deep/.easy-loadimage,/deep/uni-image {
					width: 240rpx;
					height: 240rpx;		
				}
				.sell_out {
					display: flex;
					width: 110rpx;
					height: 110rpx;
					align-items: center;
					justify-content: center;
					border-radius: 100%;
					background: rgba(0,0,0,.6);
					color: #fff;
					font-size: 24rpx;
					position: absolute;
					top: 50%;
					left: 50%;
					margin: -55rpx 0 0 -55rpx;
					&::before{
						content: "";
						display: block;
						width: 100rpx;
						height: 100rpx;
						border-radius: 100%;
						border: 1px dashed #fff;
						position: absolute;
						top: 5rpx;
						left: 5rpx;
					}
				}
				.text-info {
					width: 490rpx;
					// padding: 16rpx 24rpx 48rpx;
					.contribution {
						font-size: 24rpx;
						color: var(--view-priceColor);
					}
					.price {
						// .price-jiao {
						// 	font-size: 28rpx;
						// }
						font-size: 24rpx;
						font-weight: 600;
						margin: 8rpx 0;
						.price-yuan {
							font-size: 36rpx;
							margin-left: 8rpx;
						}
					}
				}
			}
		}
		&.listB {
			justify-content: inherit;
			.item {
				width: 31.3%;
				margin-right: 3.05%;
				.pictrue,/deep/image,/deep/.easy-loadimage,/deep/uni-image {
					height: 220rpx;	
				}
				.sell_out {
					display: flex;
					width: 110rpx;
					height: 110rpx;
					align-items: center;
					justify-content: center;
					border-radius: 100%;
					background: rgba(0,0,0,.6);
					color: #fff;
					font-size: 24rpx;
					position: absolute;
					top: 50%;
					left: 50%;
					margin: -55rpx 0 0 -55rpx;
					&::before{
						content: "";
						display: block;
						width: 100rpx;
						height: 100rpx;
						border-radius: 100%;
						border: 1px dashed #fff;
						position: absolute;
						top: 5rpx;
						left: 5rpx;
					}
				}
				&:nth-child(3n) {
					margin-right: 0;
				}
				.price{
					// display: flex;	
					// align-items: center;
					// justify-content: center;
					font-size: 20rpx;
					text{
						font-size: 28rpx;
					}
				}
				.text-info{
					padding: 10rpx 4rpx;
					.contribution {
						padding: 4rpx 0;
						font-size: 24rpx;
						color: goldenrod;
					}
				}
			}
		}
		&.listC{
			.item{
				width: 100%;
				.pictrue,/deep/image,/deep/.easy-loadimage,/deep/uni-image{
					height: 320rpx;			
				}
				.price{
					margin-top: 20rpx;
					font-size: 40rpx;
					display: flex;
					align-items: center;
					.old-price{
						font-weight: normal;
						font-size: 22rpx;
						margin-left: 10rpx;
					}
				}
				
				
				
				
				.text-info {
					.contribution {
						padding: 4rpx 0;
						font-size: 24rpx;
						color: goldenrod;
					}
				}
			}
		}
		&.listS{
			.item{
				background: #ffffff;
				border-radius: 8rpx;
				// border-radius: 12rpx;
				// background: #F3FDFF;
				// box-shadow: 0 8rpx 8rpx 0 #E5E5E5;
			}
			.text-info {
				padding: 16rpx 24rpx 48rpx;
				// height: 160rpx;
				display: flex;
				flex-direction: column;
				// justify-content: space-around;
				.title {
					// font-weight: bolder;
					height: 72rpx;
					line-height: 36rpx;
				}
				.contribution {
					font-size: 24rpx;
					display: flex;
					align-items: baseline;
					color: var(--view-priceColor);
					// margin-top: 6rpx;
					// margin-bottom: 18rpx;
				}



				.price{
					// font-size: 40rpx;
					// font-size: 28rpx;
					font-size: 24rpx;
					font-weight: 600;
					margin: 8rpx 0;
					display: flex;
					align-items: baseline;
					.old-price{
						font-weight: normal;
						font-size: 22rpx;
						margin-left: 10rpx;
					}
					.price-yuan {
						font-size: 36rpx;
						margin-left: 8rpx;
					}
				}
			}
			.cont1,/deep/.cont1 image,/deep/.cont1 .easy-loadimage,/deep/.cont1 uni-image,.cont1 .border-picture{
				border-radius: 8rpx 8rpx 0 0;
			}
			// .bg1{
			// 	border-radius: 12rpx;
			// }
		}
	}
}
</style>
