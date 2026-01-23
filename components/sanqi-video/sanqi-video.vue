<template>
	<view
	  v-html="videoHtml"
	  id="dom-video"
	  class="dom-video"
	/>
</template>

<script>
	export default {
		name: "sqVideo",
		props: {
			src: {
				type: String,
				required: true
			},
			controls: {
				type: Boolean,
				default: false
			},
			autoplay: {
				type: Boolean,
				default: false
			},
			muted: {
				type: Boolean,
				default: false
			},
			width: {
				type: String,
				default: '100%'
			},
			height: {
				type: String,
				default: 'auto'
			},
			borderRadius: {
				type: String,
				default: '0px'
			},
			loop: {
				type: Boolean,
				default: false
			},
			poster: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				videoHtml:'',
				randomStr: Math.floor(Math.random() * 1000) + '-' + Math.floor(Math.random() * 1000)
			}
		},
		mounted() {
			this.initVideoHtml()
		},
		methods: {
			// 初始化视频
			initVideoHtml() {
				this.videoHtml = `<video
			      src="${this.src}"
			      id="dom-html-video_${this.randomNum}"
			      class="dom-html-video"
			      ${this.autoplay ? 'autoplay' : ''}
			      ${this.loop ? 'loop' : ''}
			      ${this.controls ? 'controls' : ''}
			      ${this.muted ? 'muted' : ''}
			      ${this.poster ? 'poster="' + this.poster + '"' : ''}
			      preload="auto"
			      playsinline
			      webkit-playsinline
			      width="100%"
			      height="100%"
			      style="object-fit: contain;padding:0;border-radius:${this.borderRadius}"
			    >
			      <source src="${this.src}" type="video/mp4">
			      <source src="${this.src}" type="video/ogg">
			      <source src="${this.src}" type="video/webm">
			    </video>
			  `
			},
		}
	}
</script>
