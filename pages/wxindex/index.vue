<template>
	<view class="wx-index">
		<image class="wx-bg" src="../../static/wx/bg.jpg" mode="aspectFill"></image>
		<view class="wx-btns">
			<view class="wx-btn wx-btn-info" @click="goLogin">登录</view>
			<view class="wx-btn wx-btn-normal" @click="goRegister">注册</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			}
		},
		onLoad() {},
		methods: {
			goLogin(){
				uni.navigateTo({
					url:'../../wx/login/index'
				})
			},
			goRegister(){
				uni.navigateTo({
					url:'../../wx/register/index'
				})
			}
		}
	}
</script>

<style scoped>
	.wx-index{
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		position: relative;
	}
	.wx-btns{display: flex;flex-direction: row;align-items: center;justify-content: space-between;position: absolute;width: 100%;bottom: 40rpx;padding:0 34rpx;box-sizing: border-box;}
	.wx-btn{
		width: 200rpx;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		border-radius: 12rpx;
		background-color: #007AFF;
		color: #fff;
		font-size: 32rpx;
	}
	.wx-btn-info{
		background-color: #05C160;
	}
	.wx-btn-normal{
		background-color: #18181A;
	}
	.wx-bg{
		width: 100vw;
		height: 100vh;
	}
</style>
