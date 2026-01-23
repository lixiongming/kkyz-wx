
<template>
	<view class="right-wrapper" @touchmove.stop.prevent="moveStop" :style="viewColor">
		<view class="control-wrapper animated" :class="showBox?'slideInRight':''">			
			<view class="content-box">
				<view class="title">店铺类型</view>
				<view class="brand-wrapper">
					<scroll-view style="max-height: 400rpx;" :scroll-y="isShow">
						<view class="wrapper">	
							<view class="item line1" v-for="(item,index) in list" :key="index" :class="item.check?'on':''" @tap="bindChenck1(item)">
								{{item.type_name}}
							</view>				
						</view>
					</scroll-view>
					<!-- <view class="btns" v-if="!isShow && list.length>9" @click="isShow = true">展开全部<text class="iconfont icon-xiangxia"></text></view>
					<view class="btns" v-if="isShow && list.length>9"  @click="isShow = false">收起<text class="iconfont icon-xiangshang"></text></view> -->
				</view>
				<view class="title">商户分类</view>
				<view class="brand-wrapper">
					<scroll-view style="max-height: 400rpx;" :scroll-y="isShow">
						<view class="wrapper">			
							<view class="item line1" v-for="(item,index) in merCate" :key="index" :class="item.check?'on':''" @tap="bindChenck2(item)">
								{{item.category_name}}
							</view>				
						</view>
					</scroll-view>
					<view class="btns" v-if="!isShow && merCate.length>9" @click="isShow = true">展开全部<text class="iconfont icon-xiangxia"></text></view>
				</view>
				<view class="foot-btn">
					<view class="btn-item" @click="reset">重置</view>
					<view class="btn-item confirm" @click="confirm">确定</view>
				</view>
			</view>
		</view>
		<view class="right-bg" @click="close"></view>
	</view>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue'
import store from '@/business/store/modules/mall.ts';
const Store = store()
const viewColor = computed(() => Store.viewColor)

const props = defineProps({
  storeTypeArr: { // 店铺类型
    type: Array,
    default: () => []
  },
  merList: { // 商户分类
    type: Array,
    default: () => []
  },
  status: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['confirm', 'close'])

const min = ref('')
const max = ref('')
const isShow = ref(false)
const list = ref([])
const merCate = ref([])
const activeList = ref([])
const selectList = ref([])
const showBox = ref(false)

// 初始化数据
list.value = props.storeTypeArr // 店铺类型
merCate.value = props.merList // 商户分类
showBox.value = props.status

const bindChenck1 = (item) => {
  item.check = !item.check
  arrFilter1()
}

const bindChenck2 = (item) => {
  item.check = !item.check
  arrFilter2()
}

const arrFilter1 = () => {
  selectList.value = list.value.filter(item => item.check === true)
}

const arrFilter2 = () => {
  activeList.value = merCate.value.filter(item => item.check === true)
}

const reset = () => {
  list.value.forEach(el => {
    el.check = false
  })
  merCate.value.forEach(el => {
    el.check = false
  })
  arrFilter1()
  arrFilter2()
}

const confirm = () => {
  arrFilter1()
  arrFilter2()
  console.log(activeList.value)
  const obj = {
    storeTypeArr: selectList.value,
    merList: activeList.value,
    status: false
  }
  showBox.value = false
  emit('confirm', obj)
}

const close = () => {
  showBox.value = false
  emit('close')
}

const moveStop = () => {}
</script>

<style lang="scss">
	.slideInRight{
		animation-duration:.5s
	}
	.right-wrapper{
		z-index: 99;
		position: fixed;
		left: 0;
		top: 0;
		/* #ifdef H5 */
		top: var(--window-top);
		/* #endif */
		width: 100%;
		height: 100%;
		.control-wrapper{
			z-index: 90;
			position: absolute;
			right: 0;
			top: 0;
			display: flex;
			flex-direction: column;
			width: 635rpx;
			height: 100%;
			background-color: #F5F5F5;
			.header{
				padding: 50rpx 26rpx 40rpx;
				background-color: #fff;
				.title{
					font-size: 26rpx;
					font-weight: bold;
					color: #282828;
				}
				.input-wrapper{
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-top: 28rpx;
					input{
						width:260rpx;
						height:56rpx;
						padding: 0 10rpx;
						background:rgba(242,242,242,1);
						border-radius:28rpx;
						font-size: 22rpx;
						text-align: center;
					}
					.line{
						width:15rpx;
						height:2rpx;
						background:#7D7D7D;
					}
				}
			}
			.content-box{
				position: relative;
				flex: 1;
				display: flex;
				flex-direction: column;
				margin-top: 20rpx;
				padding: 0 26rpx;
				background-color: #fff;
				overflow: hidden;
				.title{
					padding: 40rpx 0 20rpx;
					font-size: 26rpx;
					font-weight: bold;
					color: #282828;
				}
				.brand-wrapper{
					// flex: 1;
					overflow: hidden;
					.wrapper{
						display: flex;
						flex-wrap: wrap;
						padding-bottom: 20rpx;
					}
					.item{
						display: block;
						width:186rpx;
						height:56rpx;
						line-height: 56rpx;
						text-align: center;
						background:rgba(242,242,242,1);
						border-radius:28rpx;
						margin-top: 25rpx;
						padding: 0 10rpx;
						margin-right: 12rpx;
						&:nth-child(3n){
							margin-right: 0;
						}
						&.on{
							background: var(--view-minorColor);
							border:1px solid var(--view-theme);
							color: var(--view-theme);
						}
					}
					.btns{
						display: flex;
						align-items: center;
						justify-content: center;
						padding-top: 10rpx;
						font-size: 22rpx;
						color: #999;
						.iconfont{
							margin-left: 10rpx;
							margin-top: 5rpx;
							font-size: 20rpx;
						}
					}
				}
				.foot-btn{
					display: flex;
					align-items: center;
					justify-content: space-between;
					position: absolute;
					// width: 100%;
					// text-align: center;
					bottom: calc(var(--window-top) + 30rpx);
					.btn-item{
						display: flex;
						align-items: center;
						justify-content: center;
						width:286rpx;
						height:68rpx;
						background:rgba(255,255,255,1);
						border:1px solid rgba(170,170,170,1);
						border-radius:34rpx;
						font-size: 26rpx;
						color: #282828;
						&.confirm{
							background: var(--view-theme);
							border-color: var(--view-theme);
							color: #fff;
							margin-left: 20rpx;
						}
					}
				}
			}
		}
		.right-bg{
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			background-color: rgba(0,0,0,.5);
		}
	}
</style>
