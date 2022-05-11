<template>
	<view v-if="show">
		<view class="zmm-watermark-box" :style="[{'top':top+'px'},{'opacity':opacity}]">
			<view class="zmm-watermark-getwh" ref="getwh" id="getwh" :style="[{'max-width':maxWidth+'px'}]">
				<rich-text :nodes="watermark"></rich-text>
			</view>
			<view class="zmm-watermark-content">
				<view class="zmm-watermark-text" :style="[{'color':color},{'margin-bottom':margin+'px'},{'max-width':maxWidth+'px'},{'transform':'rotate('+rotate+'deg)'}]" v-for="(item,index) in forLength" :key="index">
					<rich-text :nodes="watermark"></rich-text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				top: 0,//H5状态栏高度
				forLength: 0 //水印数量
			};
		},
		props: {
			maxWidth: { //单条水印最大宽度
				type: Number,
				default: 180
			},
			rotate: { //水印旋转角度
				type: Number,
				default: -21
			},
			margin: { //水印之间上下间距
				type: Number,
				default: 50
			},
			watermark: { //水印文字(支持html富文本)
				type: String,
				default: '水印文字'
			},
			color: { //水印文字默认颜色
				type: String,
				default: '#000000'
			},
			opacity: { //水印透明度
				type: Number,
				default: 0.15
			},
			show: { //是否显示水印
				type: Boolean,
				default: true
			},
		},
		mounted() {
			this.getstatusBarHeight();
		},
		methods: {
			getstatusBarHeight() { //计算水印数量
				var SystemInfo = uni.getSystemInfoSync();
				this.top = SystemInfo.safeArea.top + SystemInfo.windowTop;
				var screenArea = parseInt(SystemInfo.screenHeight * (SystemInfo.screenWidth * 1.2))
				var watermarkArea = 0
				const query = uni.createSelectorQuery().in(this);
				query.select('#getwh').boundingClientRect(data => {
					watermarkArea = parseInt((data.height + this.margin) * data.width)
				}).exec();
				var timer = setInterval(() => {
					if (watermarkArea == 0) {} else {
						clearInterval(timer)
						this.forLength = parseInt((screenArea / watermarkArea))
					}
				}, 500)
			},
		}
	}
</script>
<style>
	.zmm-watermark-box {
		overflow: hidden;
		width: 100%;
		height: 100vh;
		pointer-events: none;
		position: fixed;
		top: 30px;
		z-index: 9999;
		left: 0;
		top: 0;
	}

	.zmm-watermark-content {
		left: -10%;
		position: absolute;
		width: 120%;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
	}

	.zmm-watermark-text {
		text-align: center;
		transform: rotate(-21deg);
		margin: 0 10px;
		margin-bottom: 100rpx;
		color: rgba(0, 0, 0, 0.05);
		max-width: 180px;
		font-size: 16px;
		letter-spacing: 10rpx;
		word-break: break-all;
		line-height: 1;
	}

	.zmm-watermark-getwh {
		position: absolute;
		left: 0;
		top: 0;
		opacity: 0;
		display: inline-block;
		max-width: 180px;
		font-size: 16px;
		letter-spacing: 10rpx;
		word-break: break-all;
		line-height: 1;
	}
</style>
