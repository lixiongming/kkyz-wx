<template>
	<view class="time" :class="{themeColor : isView, bgTheme: isTheme}" :style="justifyLeft+localViewColor+'background-color:'+ bgColor +';color:'+ colors +';background-image:url('+bgImage+');'">
		<text class="red" v-if="tipText">{{ tipText }}</text>
		<text class="styleAll" v-if="isDay === true">{{ day }}</text>
		<text class="timeTxt red" v-if="dayText">{{ dayText }}</text>
		<text class="styleAll">{{ hour }}</text>
		<text class="timeTxt red" v-if="hourText">{{ hourText }}</text>
		<text class="styleAll">{{ minute }}</text>
		<text class="timeTxt red" v-if="minuteText">{{ minuteText }}</text>
		<text class="styleAll">{{ second }}</text>
		<text class="timeTxt red" v-if="secondText">{{ secondText }}</text>
	</view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import store from '@/business/store/modules/mall.ts';
const Store = store()
const props = defineProps({
  justifyLeft: {
    type: String,
    default: ""
  },
  tipText: {
    type: String,
    default: "倒计时"
  },
  dayText: {
    type: String,
    default: "天"
  },
  hourText: {
    type: String,
    default: "时"
  },
  minuteText: {
    type: String,
    default: "分"
  },
  secondText: {
    type: String,
    default: "秒"
  },
  datatime: {
    type: Number,
    default: 0
  },
  isDay: {
    type: Boolean,
    default: true
  },
  id: {
    type: [String, Number],
    default: ""
  },
  bgColor: {
    type: String,
    default: ""
  },
  colors: {
    type: String,
    default: ""
  },
  bgImage: {
    type: String,
    default: ""
  },
  isView: {
    type: Boolean,
    default: false
  },
  isTheme: {
    type: Boolean,
    default: false
  }
})

const day = ref("00")
const hour = ref("00")
const minute = ref("00")
const second = ref("00")

const localViewColor = computed(()=>{
	return Store.localViewColor
})

const show_time = () => {
  const runTime = () => {
    let intDiff = props.datatime - Date.parse(new Date()) / 1000
    let dayVal = 0, hourVal = 0, minuteVal = 0, secondVal = 0

    if (intDiff > 0) {
      if (props.isDay === true) {
        dayVal = Math.floor(intDiff / (60 * 60 * 24))
      } else {
        dayVal = 0
      }
      hourVal = Math.floor(intDiff / (60 * 60)) - dayVal * 24
      minuteVal = Math.floor(intDiff / 60) - dayVal * 24 * 60 - hourVal * 60
      secondVal = Math.floor(intDiff) - dayVal * 24 * 60 * 60 - hourVal * 60 * 60 - minuteVal * 60

      if (hourVal <= 9) hourVal = "0" + hourVal
      if (minuteVal <= 9) minuteVal = "0" + minuteVal
      if (secondVal <= 9) secondVal = "0" + secondVal

      day.value = dayVal
      hour.value = hourVal
      minute.value = minuteVal
      second.value = secondVal
    } else {
      day.value = "00"
      hour.value = "00"
      minute.value = "00"
      second.value = "00"
      clearInterval(intervalId)
      uni.$emit('endTime', props.id)
    }
  }

  runTime()
  const intervalId = setInterval(runTime, 1000)
}

onMounted(() => {
  show_time()
})
</script>

<style lang="scss" scoped>
	.styleAll {
		padding: 0 6rpx;
	}
	.red{
		margin: 0 4rpx;
	}
	.themeColor .red{
		color: var(--view-theme);
	}
	.bgTheme .styleAll{
		background-color: var(--view-theme);
		color: #ffffff;
		font-size: 22rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.time{
		display: flex;
		justify-content: center;
    flex-direction: row;
		font-size: 20rpx;
	} 

</style>
