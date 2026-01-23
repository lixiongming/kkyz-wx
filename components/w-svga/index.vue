<template>
  <div class="bg">
    <canvas id="canvas" class="canvas"></canvas>
  </div>
</template>
<script  setup>
import { Parser, Player, DB } from 'svga'
import { ref ,computed,nextTick} from "vue";
let props = defineProps({
  svgaImg: {
    type: String,
    required: true
  }
})
const w = computed(() => 28+ 'px')
const h = computed(() => 28 + 'px')
const canvas=ref()
const startSvga = async function () {
  try {
    const db = new DB()
  
    let svga = await db.find(props.svgaImg)

    if (!svga) {
      const parser = new Parser({ isDisableImageBitmapShim: true })
      svga = await parser.load(props.svgaImg)
      await db.insert(props.svgaImg, svga)
    }
    const doc = document.getElementById('canvas')
     console.log(doc, 'db');
    const player = new Player(doc)
    await player.mount(svga)
    player.onStart = () => console.log('播放了')
    // 开始播放动画
    player.start()
  } catch (error) {
    console.error(error)
  }
}
nextTick(() => {
  startSvga()
})
</script>
<style scoped>
    .w-svga {
        width: 100%;
        height: 100%;
    }
    .i-image {
        /* #ifndef APP-NVUE */
        width: 100%;
        height: 100%;
        /* #endif */
    }
    .image,
    .i-image_placeholder {
        /* #ifdef APP-NVUE */
        flex: 1;
        /* #endif */
        /* #ifndef APP-NVUE */
        width: 100%;
        height: 100%;
		display: block;
        /* #endif */
        /* will-change: transform; */
    }
    .i-image_placeholder {
        background-color: #F8F8F8;
    }
</style>