<template>
	<view class="bgColor" v-if="detail">
		<watermark></watermark>
		<view class="wxscanCodeDetail">
			<view class="wxscanCodeDetail-imgs">
				<image v-for="(item,index) in detail.portrait" :src="item" mode="aspectFill"></image>
			</view>
			<view class="wxscanCodeDetail-title">{{detail.name}}({{detail.count}})</view>
			<view class="wx-btn wx-btn-info" @click="ingroup">加入群聊</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			detail:''
		};
	},
	computed: {},
	onLoad(e) {
		this.param = e.param;
	},
	onShow() {
		this.getInfo(this.param);
	},
	methods: {
		ingroup(){
			var data=this.param.split(':')
			var type=data[0]
			var value=data[1]
			this.$http.request({
				url: '/group/joinGroup/' + value,
				success: res => {
					if (res.data.code == 200) {
						uni.navigateBack({
							delta:1
						})
					}
				}
			});
		},
		getInfo(e) {
			//详情
			this.$http.request({
				url: '/group/scanCode/' + e,
				success: res => {
					if (res.data.code == 200) {
						this.detail = res.data.data;
					}
				}
			});
		}
	}
};
</script>

<style scoped>
/* #ifdef APP-PLUS */
.bgColor {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: #ededed;
	overflow: auto;
}
/* #endif */
/* #ifdef H5 */
page {
	background: #ededed;
}
/* #endif */
.wx-btn {
	min-width: 200rpx;
	height: 75rpx;
	line-height: 75rpx;
	text-align: center;
	border-radius: 12rpx;
	background-color: #007aff;
	color: #fff;
	font-size: 32rpx;
}

.wx-btn-info {
	background-color: #05c160;
}
.wxscanCodeDetail{
	height: 100vh;
	display: flex;flex-direction: column;
	background-color: #fff;
	align-items: center;
}
.wxscanCodeDetail-imgs{
	width: 120rpx;
	height: 120rpx;
	border-radius: 12rpx;
	overflow: hidden;
	display: flex;flex-direction: row;flex-wrap: wrap;
	background-color: #DEDEDE;
	margin-top: 8.5vh;
}
.wxscanCodeDetail-imgs image{
	margin: 2rpx;
	width: 56rpx;
	height: 56rpx;
}
.wxscanCodeDetail-title{
	word-break: break-all;
	font-size: 40rpx;
	color: #333;
	margin-top: 4vh;
	margin-bottom: 50vh;
}
</style>
